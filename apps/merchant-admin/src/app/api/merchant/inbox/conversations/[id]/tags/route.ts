import { NextRequest, NextResponse } from "next/server";


import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth();
  

  const { id } = await params;
  const { tagIds } = await req.json(); // Expecting array of Tag IDs

  if (!Array.isArray(tagIds))
    return new NextResponse("Invalid tags", { status: 400 });

  const conv = await prisma.conversation.findUnique({ where: { id } });
  if (!conv || conv.storeId !== user.storeId)
    return new NextResponse("Forbidden", { status: 403 });

  // Transaction to replace tags
  // 1. Delete existing maps
  await prisma.conversation_tag_map.deleteMany({
    where: { conversationId: id },
  });

  // 2. Create new maps
  if (tagIds.length > 0) {
    await prisma.conversation_tag_map.createMany({
      data: tagIds.map((tagId: string) => ({
        conversationId: id,
        tagId,
      })),
    });
  }

  return NextResponse.json({ ok: true });
}
