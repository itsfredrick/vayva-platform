import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";



export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { conversationId, messageId, rating, reason, comment } = body;
    const storeId = user.storeId;

    if (!messageId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Enforce Rules
    const finalReason = rating === "SOLVED" ? null : reason;
    const finalComment = rating === "SOLVED" ? null : comment;

    // Store Feedback
    await prisma.supportBotFeedback.create({
      data: {
        storeId,
        conversationId: conversationId || "unknown",
        messageId,
        rating,
        reason: finalReason,
        // input comment if schema supported it, for now we stick to schema
      },
    });

    // Telemetry
    await prisma.supportTelemetryEvent.create({
      data: {
        storeId,
        conversationId: conversationId || "unknown",
        eventType: "MERCHANT_FEEDBACK_RECORDED",
        messageId,
        payload: { rating, reason: finalReason },
      },
    });

    // Simple Auto-Escalation Check on Negative Feedback Loop
    // If this conversation has > 2 NOT_SOLVED ratings, we could auto-escalate here.
    // For MVP, we just store the data.

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SupportFeedback] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
