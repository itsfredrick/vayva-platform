import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const user = await requireAuth();

    const orders = await prisma.order.findMany({
      where: { storeId: user.storeId },
      include: {
        Customer: {
          select: { firstName: true, lastName: true, email: true }
        },
        PaymentTransaction: {
          select: { amount: true, status: true }
        },
        OrderItem: {
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const formatted = orders.map((o: any) => {
      // Calculate Paid Amount
      // Assuming transaction amount is Decimal, need to convert
      const paidAmount = o.PaymentTransaction
        .filter((t: any) => t.status === 'SUCCESS')
        .reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);

      return {
        id: o.id,
        orderNumber: o.orderNumber,
        customer: o.Customer ? { firstName: o.Customer.firstName, lastName: o.Customer.lastName } : null,
        total: Number(o.total),
        paidAmount: paidAmount,
        currency: o.currency,
        status: o.paymentStatus || o.status, // Order status fallback
        // Determine if PARTIAL logic applies if not explicitly in enum
        displayStatus: paidAmount >= Number(o.total) ? 'PAID' : paidAmount > 0 ? 'PARTIAL' : 'PENDING',
        items: o.OrderItem.length,
        createdAt: o.createdAt
      };
    });

    return NextResponse.json({ success: true, data: formatted });

  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
