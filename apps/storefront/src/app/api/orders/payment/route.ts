import { NextRequest, NextResponse } from "next/server";
import { PaystackService } from "@/lib/paystack";
import { reportError } from "@/lib/error";
import { prisma } from "@vayva/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, amount, orderId, callbackUrl } = body;

    if (!email || !amount || !orderId) {
      return NextResponse.json(
        { error: "Missing required payment fields" },
        { status: 400 },
      );
    }

    // 1. Fetch Order to confirm existence
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Platform-Centric Payment:
    // We utilize the Platform's Paystack Keys (configured in ENV).
    // The money is collected by the Platform, then credited to the Merchant's internal Wallet via Webhook worker.
    // Merchants withdraw from Wallet.

    const amountKobo = Math.round(amount * 100);

    const response = await PaystackService.initializeTransaction({
      email,
      amount: amountKobo,
      reference: `ORD-${orderId}-${Date.now()}`, // Unique Ref
      callback_url: callbackUrl,
      metadata: {
        order_id: orderId,
        storeId: order.storeId, // Important for Worker to credit correct wallet
        type: "storefront_order", // Critical for Worker routing
        custom_fields: [
          {
            display_name: "Order ID",
            variable_name: "order_id",
            value: orderId,
          },
        ],
      },
    });

    return NextResponse.json(response);
  } catch (error: any) {
    reportError(error, { route: "POST /api/orders/payment" });
    return NextResponse.json(
      { error: error.message || "Payment initialization failed" },
      { status: 500 },
    );
  }
}
