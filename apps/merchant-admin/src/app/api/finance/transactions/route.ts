import { NextRequest, NextResponse } from "next/server";


import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  

  const storeId = user.storeId;
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    const transactions = await prisma.order.findMany({
      where: {
        storeId,
        paymentStatus: {
          in: ["SUCCESS", "FAILED"] as any,
        },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        paymentStatus: true,
        createdAt: true,
        Customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        paymentMethod: true,
        currency: true,
      },
    });

    const formatted = transactions.map((tx: any) => ({
      id: tx.id,
      order: tx.orderNumber,
      customer: tx.Customer
        ? `${tx.Customer.firstName || ""} ${tx.Customer.lastName || ""}`.trim() ||
        tx.Customer.email
        : "Guest Customer",
      amount: `${tx.currency} ${Number(tx.total).toLocaleString()}`,
      status: tx.paymentStatus === "SUCCESS" ? "paid" : "failed",
      provider: tx.paymentMethod || "Paystack", // Default to Paystack for now
      date: new Date(tx.createdAt).toLocaleDateString(),
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}
