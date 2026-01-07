import { NextResponse } from "next/server";


import { checkRateLimit } from "@/lib/rate-limit";
import { logAudit, AuditAction } from "@/lib/audit";
import { requireAuth } from "@/lib/session";

export async function POST() {
  try {
    const user = await requireAuth();
    if (!user || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const storeId = user.storeId;

    // Safety: Rate limit - 1 per hour
    await checkRateLimit(userId, "recovery_webhook_sync", 1, 3600, storeId);

    // Logic: Trigger background job to re-sync
    // (Simulated for MVP)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    await logAudit({
      storeId,
      actor: {
        type: "USER",
        id: userId,
        label: user.email || "Merchant",
      },
      action: "RECOVERY_WEBHOOK_SYNC_TRIGGERED",
      correlationId: `recovery-${Date.now()}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Recovery sync error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      {
        status: error.name === "RateLimitError" ? 429 : 500,
      },
    );
  }
}
