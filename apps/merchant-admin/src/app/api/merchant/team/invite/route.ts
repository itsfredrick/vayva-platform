import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@vayva/db";
import { PLANS } from "@/lib/billing/plans";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    if (!user || !user.storeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json(); // Assuming body has email, etc. if needed later

    // 1. Fetch Store to get Plan
    const store = await prisma.store.findUnique({
      where: { id: user.storeId },
      select: { plan: true }
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const planSlug = (store.plan || "free").toLowerCase();
    const plan = PLANS[planSlug] || PLANS["free"];
    const maxSeats = plan.limits.teamSeats;

    // 2. Used Seats
    const seatsUsed = await prisma.membership.count({ where: { storeId: user.storeId } });

    // 3. Check Gate
    // Note: seatsUsed includes the owner, so we check if (used < max) 
    // OR if we want to allow inviting UP TO max, then (used + 1 <= max)
    // usually seat count includes pending invites too, but for now we just gate active+owner memberships
    if (seatsUsed >= maxSeats) {
      return NextResponse.json({
        error: `Plan limit reached. Upgrade to add more team members.`,
        code: "PLAN_LIMIT_REACHED",
        limit: maxSeats,
        current: seatsUsed
      }, { status: 403 });
    }

    // 4. Create Invite (Placeholder for actual invite logic)
    // await prisma.staffInvite.create({ ... })

    return NextResponse.json({ success: true, message: "Invite sent (simulated)" });

  } catch (e: any) {
    console.error("Invite error:", e);
    return new NextResponse(e.message || "Internal Server Error", { status: 500 });
  }
}
