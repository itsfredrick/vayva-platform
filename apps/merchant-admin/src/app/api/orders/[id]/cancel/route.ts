import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@vayva/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();
    const storeId = user.storeId;
    const { id } = await params;

    const data = await prisma.order.update({
      where: { id, storeId },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    console.error("Order cancel error:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 },
    );
  }
}
