import { NextRequest, NextResponse } from "next/server";


import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  

  const storeId = user.storeId;
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    // If Payout table is empty (likely in dev), we might return empty array.
    // But for completeness, let's fetch real Payout records.
    const payouts = await prisma.payout.findMany({
      where: { storeId },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    // Safe Map
    const formatted = payouts.map((po: any) => ({
      id: po.id,
      amount: `${po.currency} ${Number(po.amount).toLocaleString()}`,
      status: po.status, // e.g., 'Paid', 'Processing'
      bank: "Unknown Bank", // We assume external provider handles this details or stored in metadata
      period: "N/A", // Logic for settlement period would be here
      date: new Date(po.createdAt).toLocaleDateString(),
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch payouts" },
      { status: 500 },
    );
  }
}
