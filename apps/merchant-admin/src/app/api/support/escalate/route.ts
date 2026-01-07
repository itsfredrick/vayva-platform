import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";


import {
  EscalationService,
  EscalationTrigger,
} from "@/lib/support/escalation.service";

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const storeId = user.storeId;
    const body = await req.json();

    const { conversationId, trigger, reason, aiSummary, metadata } = body;

    // Validation
    if (!trigger || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const ticket = await EscalationService.triggerHandoff({
      storeId,
      conversationId: conversationId || `manual_${Date.now()}`,
      trigger: trigger as EscalationTrigger,
      reason,
      aiSummary: aiSummary || "Manual escalation requested via API",
      metadata,
    });

    return NextResponse.json({ success: true, ticketId: ticket.id });
  } catch (error) {
    console.error("[SupportEscalation] Error triggering handoff", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
