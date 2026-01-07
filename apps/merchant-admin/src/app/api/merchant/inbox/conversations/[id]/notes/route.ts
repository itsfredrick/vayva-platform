import { NextRequest, NextResponse } from "next/server";


import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth();
  

  const { id } = await params;
  const { note } = await req.json();

  if (!note) return new NextResponse("Note empty", { status: 400 });

  const conv = await prisma.conversation.findUnique({ where: { id } });
  if (!conv || conv.storeId !== user.storeId)
    return new NextResponse("Forbidden", { status: 403 });

  const created = await prisma.internalNote.create({
    data: {
      merchantId: conv.storeId,
      conversationId: id,
      authorId: user.id, // Or name if simple string
      note,
    },
  });

  // Audit Log (simplified)
  /* await prisma.auditLog.create({ ... }) */

  return NextResponse.json(created);
}
