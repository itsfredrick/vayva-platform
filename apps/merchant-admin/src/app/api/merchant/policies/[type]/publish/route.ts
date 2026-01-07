import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@vayva/db";
 // Assuming authOptions is imported from here
import { requireAuth } from "@/lib/session";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;
  const user = await requireAuth();
  

  try {
    const policy = await prisma.merchantPolicy.update({
      where: {
        storeId_type: {
          storeId: user.storeId,
          type: type.toUpperCase().replace("-", "_") as any,
        },
      },
      data: {
        status: "PUBLISHED",
        publishedVersion: { increment: 1 },
        publishedAt: new Date(),
        lastUpdatedLabel: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      },
    });

    return NextResponse.json({ policy });
  } catch (error) {
    console.error("Error publishing policy:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
