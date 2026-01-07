import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get("orderId");

        if (!orderId) {
            return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Check if payment status is PAID
        // This relies on webhooks updating the Order status when a transfer happens via DVA.
        // Paystack DVA webhook "charge.success" usually contains the customer email/code.
        // We will need to implement webhook logic later to link payment to order.
        // For now, this endpoint checks the current status.

        return NextResponse.json({
            status: (order.paymentStatus as string) === "PAID" ? "PAID" : "PENDING",
            paymentStatus: order.paymentStatus as string,
            orderStatus: order.status as string
        });

    } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
