import { NextRequest, NextResponse } from "next/server";


import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  

  const storeId = user.storeId;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "OPEN";
  const limit = parseInt(searchParams.get("limit") || "20");

  // Filter Logic
  const where: any = { merchantId: storeId };
  if (status !== "ALL") where.status = status;

  const items = await prisma.conversation.findMany({
    where,
    orderBy: { lastMessageAt: "desc" },
    take: limit,
    include: {
      contact: { select: { phoneE164: true, displayName: true } },
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { textBody: true, createdAt: true, direction: true },
      },
    },
  });

  // Post-process SLA status
  const now = new Date();
  const result = items.map((c: any) => {
    let slaStatus = "active";
    if (c.unreadCount > 0 && c.lastInboundAt) {
      const diff = now.getTime() - new Date(c.lastInboundAt).getTime();
      if (diff > 24 * 60 * 60 * 1000) slaStatus = "overdue";
      else slaStatus = "unread";
    }
    return {
      ...c,
      slaStatus,
      lastMessage: c.messages[0],
    };
  });

  return NextResponse.json({ items: result });
}
