import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";

// Mark this route as dynamic since it uses headers via getServerSession
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    if (!(user as any)?.storeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const policies = await prisma.merchantPolicy.findMany({
      where: { storeId: user.storeId },
      orderBy: { type: "asc" },
    });

    return NextResponse.json({ policies });
  } catch (error) {
    console.error("Error fetching policies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
