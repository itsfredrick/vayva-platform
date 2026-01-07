import { NextRequest, NextResponse } from "next/server";


import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth();
  

  const { id } = await params;

  const job = await prisma.importJob.findUnique({ where: { id } });
  if (!job || job.merchantId !== user.storeId)
    return new NextResponse("Forbidden", { status: 403 });

  return NextResponse.json(job);
}
