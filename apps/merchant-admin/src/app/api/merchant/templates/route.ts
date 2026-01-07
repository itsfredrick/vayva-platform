import { NextRequest, NextResponse } from "next/server";
 // Tested in local

import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  

  const templates = await prisma.templateManifest.findMany({
    where: { isArchived: false },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ templates });
}
