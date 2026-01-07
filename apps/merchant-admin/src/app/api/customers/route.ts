import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";



export async function GET(req: Request) {
  try {
    const user = await requireAuth();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";

    // Optimized Search: Smart detection to avoid 4-column OR scan
    let where: any = { storeId: user.storeId };

    if (query) {
      const isPhone = /^[0-9+]+$/.test(query);
      const isEmail = query.includes('@');

      if (isPhone) {
        // fast index seek
        where.phone = { contains: query };
      } else if (isEmail) {
        // fast index seek
        where.email = { startsWith: query, mode: 'insensitive' };
      } else {
        // Name search only - remove phone/email columns from this heavy query
        where.OR = [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } }
        ];
      }
    }

    const customers = await prisma.customer.findMany({
      where: where as any,
      include: {
        _count: {
          select: { orders: true }
        },
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { createdAt: true }
        }
      },
      take: 50,
      orderBy: { createdAt: 'desc' }
    });

    // Calculate LTV (Total Spent) - usually aggregation is better but Prisma GroupBy might be heavy for list. 
    // For list view, maybe we just show order count. 
    // If we really need LTV, we need an aggregate query.
    // Let's do a separate aggregate or just load simple data for performance.
    // Marketing promise said "Customer List", usually just basic info. Profile has deep info.

    // Actually, let's fetch totalSpent for each? No, that's N+1.
    // Let's fetch aggregate in bulk if possible, or just omit LTV from the *list* view if it's too heavy, 
    // OR use `totalSpent` field if we add it to Customer (denormalization).
    // Since schema doesn't have `totalSpent` on Customer, 
    // I will just return order count and last active. User can click profile for LTV.
    // Or I can do a quick huge groupBy if the store is small. I'll skip LTV on list for performance for now.

    const formatted = customers.map((c: any) => ({
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      phone: c.phone,
      ordersCount: c._count.orders,
      lastActive: c.orders[0]?.createdAt || c.createdAt,
      tags: c.tags,
      // Mocking status based on tags or recency
      status: c.tags.includes('VIP') ? 'VIP' : 'ACTIVE'
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("[CUSTOMERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
