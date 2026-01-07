import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@vayva/db";

export async function GET() {
  try {
    const user = await requireAuth();
    const storeId = user.storeId;

    // Get invoices for this store's subscription
    const invoices = await prisma.invoice.findMany({
      where: {
        storeId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return NextResponse.json({
      invoices: invoices.map((inv: any) => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        date: inv.createdAt,
        amount: inv.amountNgn,
        currency: "NGN",
        status: inv.status,
        pdfUrl: `/api/billing/invoices/${inv.id}/pdf`,
      })),
    });
  } catch (error: any) {
    console.error("Invoices fetch error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 },
    );
  }
}
