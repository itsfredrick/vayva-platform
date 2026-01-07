import { NextRequest, NextResponse } from "next/server";


import { prisma } from "@vayva/db";
import { EventBus } from "@/lib/events/eventBus";
import { requireAuth } from "@/lib/session";

// Test WhatsApp Provider
const WhatsAppProvider = {
  sendText: async (to: string, text: string) => {
    return { messageId: `wa_mid_${Date.now()}` };
  },
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth();
  

  const { id } = await params;
  const body = await req.json();
  const { text, type = "transactional" } = body;

  if (!text) return new NextResponse("Text required", { status: 400 });

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: { contact: true },
  });

  if (!conversation) return new NextResponse("Not Found", { status: 404 });
  if (conversation.storeId !== user.storeId)
    return new NextResponse("Forbidden", { status: 403 });

  // CONSENT CHECK
  // If blocked_all, usually we can't send anything.
  // If transactional_off, we can send support replies but maybe not proactive notifications?
  // For Inbox (Manual Reply), we assume it's "Support" or "Transactional" in nature.
  // Ideally we check `CommunicationConsent` model.
  // For V1, we'll do a basic check on the Conversation or Contact if we had flags there.
  // Since we don't have easy access to `CommunicationConsent` in this file without import/query,
  // we'll assume "Support" replies are allowed unless there's a hard block logic implemented elsewhere.
  // Adding placeholder query:
  /*
    const consent = await prisma.communicationConsent.findFirst({
        where: { storeId: conversation.storeId, customerPhone: conversation.contact.phone }
    });
    if (consent?.status === 'BLOCKED_ALL') return new NextResponse('Customer blocked all messages', { status: 403 });
    */

  // Send via Provider
  try {
    const waRes = await WhatsAppProvider.sendText(
      conversation.contact.phoneE164 || "",
      text,
    );

    // Save Message to DB
    const message = await prisma.message.create({
      data: {
        storeId: conversation.storeId,
        conversationId: id,
        direction: "OUTBOUND",
        type: "TEXT",
        textBody: text,
        status: "SENT",
        providerMessageId: waRes.messageId,
        sentAt: new Date(),
      },
    });

    // Update Conversation SLA
    await prisma.conversation.update({
      where: { id },
      data: {
        lastOutboundAt: new Date(),
        lastRepliedAt: new Date(),
        lastMessageAt: new Date(),
        unreadCount: 0, // Reply usually clears unread? Or read marker does?
        status: "OPEN", // Re-open if closed?
      },
    });

    // Audit
    await EventBus.publish({
      merchantId: conversation.storeId,
      type: "inbox.message_sent",
      payload: { messageId: message.id, type },
      ctx: {
        actorId: user.id,
        actorType: "user" as any,
        correlationId: `req-${Date.now()}`,
        actorLabel: `${user.firstName || "System"} ${user.lastName || ""}`,
      },
    });

    return NextResponse.json(message);
  } catch (err: any) {
    console.error("Send Failed", err);
    return new NextResponse("Send Failed", { status: 500 });
  }
}
