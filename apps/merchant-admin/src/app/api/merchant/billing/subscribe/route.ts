import { NextRequest, NextResponse } from "next/server";


import { prisma } from "@vayva/db";
import { PLANS } from "@/lib/billing/plans";
import { PaystackService } from "@/lib/payment/paystack";
import { requireAuth } from "@/lib/session";

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  

  if (!user?.storeId || !user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { plan_slug } = body;

  if (!PLANS[plan_slug]) {
    return new NextResponse("Invalid Plan", { status: 400 });
  }

  try {
    // Initialize Paystack Transaction
    const { authorization_url, reference } = await PaystackService.createPaymentForPlanChange(
      user.email,
      plan_slug,
      user.storeId
    );

    // Upsert pending subscription with real reference
    await prisma.merchantSubscription.upsert({
      where: { storeId: user.storeId },
      update: {
        planSlug: plan_slug,
        lastPaymentStatus: "pending",
      },
      create: {
        storeId: user.storeId,
        planSlug: plan_slug,
        status: "pending",
        lastPaymentStatus: "pending",
      },
    });

    return NextResponse.json({ ok: true, checkout_url: authorization_url });
  } catch (e: any) {
    console.error("Subscription Error:", e);
    return new NextResponse(e.message || "Payment initialization failed", { status: 500 });
  }
}
