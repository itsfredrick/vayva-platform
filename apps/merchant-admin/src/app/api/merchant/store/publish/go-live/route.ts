import { NextRequest, NextResponse } from "next/server";


import { PublishService } from "@/lib/publish/publishService";
import { logAuditEvent, AuditEventType } from "@/lib/audit";
import { requireAuth } from "@/lib/session";

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  

  try {
    const result = await PublishService.goLive(
      user.storeId,
      user.id,
      user.name || user.email || "Merchant",
    );

    // Log audit event
    await logAuditEvent(
      user.storeId,
      user.id,
      AuditEventType.SETTINGS_CHANGED,
      { action: "STORE_PUBLISHED", result },
    );

    return NextResponse.json(result);
  } catch (e: any) {
    if (e.message.includes("not ready")) {
      return new NextResponse(
        JSON.stringify({ error: e.message, type: "NOT_READY" }),
        { status: 409 },
      );
    }
    return new NextResponse(e.message, { status: 500 });
  }
}
