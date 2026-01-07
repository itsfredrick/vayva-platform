import { NextRequest, NextResponse } from "next/server";


import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  

  const storeId = user.storeId;

  try {
    const collections = await prisma.collection.findMany({
      where: { storeId },
      include: {
        _count: {
          select: { CollectionProduct: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formatted = collections.map((col: any) => ({
      id: col.id,
      name: col.title,
      count: col._count.CollectionProduct,
      visibility: "Storefront", // Defaulting for MVP as schema lacks visibility flag
      updated: new Date(col.updatedAt).toLocaleDateString(),
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 },
    );
  }
}
