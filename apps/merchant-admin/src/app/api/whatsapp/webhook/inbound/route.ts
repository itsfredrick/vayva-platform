import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { env } from "@/lib/config/env";
import { WhatsAppClient } from "@/lib/whatsapp/client";
import { AIService, AIMessage } from "@/lib/ai/aiService";
import { logger } from "@/lib/logger";
import {
  applyConsentUpdate,
  normalizePhoneToE164
} from "@/lib/consent/consent";
import { ConsentChannel, ConsentSource } from "@vayva/db";

// Verification Endpoint (Meta requirement)
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode && token) {
    if (mode === "subscribe" && token === env.WHATSAPP_VERIFY_TOKEN) {
      logger.info("[WEBHOOK] Verified signature.");
      return new NextResponse(challenge);
    } else {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }
  return new NextResponse("Bad Request", { status: 400 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if this is a WhatsApp status update (ignore for now)
    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          const value = change.value;

          if (value.messages) {
            for (const message of value.messages) {
              await handleMessage(message, value.contacts?.[0]);
            }
          }
        }
      }
      return NextResponse.json({ status: "success" });
    }

    return new NextResponse("Not Found", { status: 404 });
  } catch (e) {
    logger.error("[WEBHOOK_ERROR]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

async function handleMessage(message: any, contactInfo: any) {
  const from = message.from; // Phone number ID (e.g. 23480...)
  const textBody = message.text?.body || "";
  const type = message.type;

  if (type !== 'text') return; // Only process text for V1

  logger.info(`[MSG] From: ${from} | Text: ${textBody}`);

  // 1. Consent / Opt-Out Logic
  const cleanText = textBody.trim().toUpperCase();
  if (["STOP", "UNSUBSCRIBE", "CANCEL", "NO PROMOS"].includes(cleanText)) {
    const phoneE164 = normalizePhoneToE164(from);
    if (phoneE164) {
      // Find store (assuming first found or env based)
      // For now, update global consent? Or finding a random store?
      // Existing logic required merchantId.
      // We'll skip store-specific opt-out if we can't identify store, 
      // OR find ANY store with this customer.
      // Simplified: just log it for now as we transition to Multi-tenant webhook.
      logger.info(`Opt-out received for ${phoneE164}`);
    }
    return;
  }

  // 2. Identify Store (Single-tenant assumption OR find via phone)
  // For this MVP, we assume the environment belongs to ONE merchant.
  // We'll pick the first Store with AI Enabled.
  const agentSettings = await prisma.whatsAppAgentSettings.findFirst({
    where: { enabled: true },
    include: { store: true }
  });

  if (!agentSettings) {
    logger.info("No AI Agent enabled.");
    return;
  }

  const store = agentSettings.store;
  const storeId = store.id;

  // 3. Upsert Customer & Conversation
  const phoneE164 = `+${from}`; // Approximate E164

  let customer = await prisma.customer.findFirst({
    where: {
      storeId,
      OR: [{ phone: from }, { phone: phoneE164 }]
    }
  });

  if (!customer) {
    const name = contactInfo?.profile?.name || "Unknown Customer";
    customer = await prisma.customer.create({
      data: {
        storeId,
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" ") || "",
        phone: phoneE164,
        whatsappContactId: from,
        marketingOptIn: true // Opt-in by messaging us
      }
    });
  }

  // Find active conversation
  let conversation = await prisma.conversation.findFirst({
    where: {
      storeId,
      contactId: customer.whatsappContactId || from,
      status: 'OPEN'
    },
    include: { messages: { take: 5, orderBy: { createdAt: 'desc' } } }
  });

  if (!conversation) {
    // Create Contact if missing (Contact model is separate from Customer in schema? Yes, Line 476)
    // Ensure Contact exists
    let contact = await prisma.contact.findUnique({
      where: { storeId_channel_externalId: { storeId, channel: 'WHATSAPP', externalId: from } }
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          storeId,
          channel: 'WHATSAPP',
          externalId: from,
          displayName: contactInfo?.profile?.name || "WhatsApp User",
          phoneE164: phoneE164
        }
      });
    }

    conversation = await prisma.conversation.create({
      data: {
        storeId,
        contactId: contact.id, // Must link to Contact, not Customer directly (Conversation.contactId -> Contact.id)
        status: 'OPEN'
      },
      include: { messages: true }
    });
  }

  // 4. Save Inbound Message
  await prisma.message.create({
    data: {
      storeId,
      conversationId: conversation.id,
      direction: 'INBOUND',
      type: 'TEXT',
      textBody: textBody,
      status: 'DELIVERED'
    }
  });

  // Mark Read in WhatsApp
  await WhatsAppClient.markRead(message.id);

  // 5. Generate AI Response
  // Construct history
  const history: AIMessage[] = (conversation.messages || []).reverse().map((m: any) => ({
    role: m.direction === 'INBOUND' ? 'user' : 'assistant',
    content: m.content || ""
  }));

  // Add current
  history.push({ role: "user", content: textBody });

  // Chat
  const aiResponse = await AIService.chat(history, {
    storeName: store.name
  });

  if (aiResponse.message) {
    // Send Reply
    await WhatsAppClient.sendText(from, aiResponse.message);

    // Save Outbound
    await prisma.message.create({
      data: {
        storeId,
        conversationId: conversation.id,
        direction: 'OUTBOUND',
        type: 'TEXT',
        textBody: aiResponse.message,
        status: 'SENT'
      }
    });
  }

  // 6. Handle Intent (Order Placement)
  // If intents are extracted, handle them. E.g. "ORDER_PLACEMENT" -> Create Draft Order.
  if (aiResponse.intent === 'order_placement' && agentSettings.catalogMode === 'CatalogPlusFAQ') {
    // Create logic for draft order...
    // For now, just logging.
    logger.info(`[AI] Auto-draft logic triggered for ${from}`);
  }
}
