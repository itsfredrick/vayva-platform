import { NextRequest, NextResponse } from "next/server";


import { prisma } from "@vayva/db";
import { cookies } from "next/headers";
import { requireAuth } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  

  const cookieStore = await cookies();
  const storeId = cookieStore.get("x-active-store-id")?.value;
  if (!storeId)
    return new NextResponse("No active store user", { status: 400 });

  const selection = await prisma.storeTemplateSelection.findUnique({
    where: { storeId },
    include: { templateManifest: true },
  });

  return NextResponse.json({ selection });
}
