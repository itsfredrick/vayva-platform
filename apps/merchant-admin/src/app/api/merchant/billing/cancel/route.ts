import { NextRequest, NextResponse } from "next/server";


import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  

  try {
    await prisma.merchantSubscription.update({
      where: { storeId: user.storeId },
      data: { cancelAtPeriodEnd: true },
    });

    // Log Audit
    // ...

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
}
