import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@vayva/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireAuth();

    if (!user?.storeId) {
      return NextResponse.json({ count: 0 });
    }

    const unreadCount = await prisma.notification.count({
      where: {
        storeId: user.storeId,
        isRead: false,
      },
    });

    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error("[API] Unread Count Error:", error);
    return NextResponse.json({ count: 0 });
  }
}
