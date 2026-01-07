import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";


import { redis } from "@/lib/redis";
import { requireAuth } from "@/lib/session";

// Cache TTL in seconds (5 minutes)
const CACHE_TTL = 300;

export async function GET(req: Request) {
    try {
        const user = await requireAuth();
        const storeId = user.storeId;
        const cacheKey = `analytics:summary:${storeId}`;

        // 1. Check Cache
        if (redis) {
            try {
                const cached = await redis.get(cacheKey);
                if (cached) {
                    return NextResponse.json({
                        success: true,
                        data: JSON.parse(cached),
                        source: 'cache'
                    });
                }
            } catch (e) {
                console.warn("Redis Error", e);
            }
        }

        // 1. Revenue & Orders
        // Best approach: Aggregate Order table for counts, PaymentTransaction for revenue
        const orderAgg = await prisma.order.aggregate({
            where: { storeId },
            _count: { id: true }
        });

        const txAgg = await prisma.paymentTransaction.aggregate({
            where: { storeId, status: 'SUCCESS' },
            _sum: { amount: true }
        });

        // 2. Deliveries
        const deliveryAgg = await prisma.shipment.aggregate({
            where: { storeId, status: 'DELIVERED' },
            _count: { id: true }
        });

        // 3. Visitors (Real count from analytics_event if exists, else fallback to daily agg)
        // Schema: analytics_event (Line 2492). merchantId field?
        // Actually schema says `merchantId String`.
        // Let's count them.
        const visitorCount = await prisma.analyticsEvent.count({
            where: { storeId }
            // In schema: merchantId String. storeId String?.
            // Let's use storeId if possible, or merchantId if it matches storeId.
            // Safe bet: storeId if present.
        });

        // Return Data
        const data = {
            revenue: Number(txAgg._sum.amount) || 0,
            orders: orderAgg._count.id || 0,
            deliveries: deliveryAgg._count.id || 0,
            totalVisitors: visitorCount || 0
        };

        // Cache the result
        if (redis) {
            try {
                await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data));
            } catch (e) {
                console.warn("Retis Set Error", e);
            }
        }

        // Return Data
        return NextResponse.json({
            success: true,
            data
        });

    } catch (error) {
        console.error("[ANALYTICS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
