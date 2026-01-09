
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@vayva/db";

// GET /api/kitchen/orders?status=active
export async function GET(request: NextRequest) {
    try {
        const sessionUser = await getSessionUser();
        if (!sessionUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Retrieve active kitchen orders: PREPARING, UNFULFILLED
        // Technically "PAID" usually means UNFULFILLED in our current flow if we map it right.
        // We want orders that need kitchen attention.

        const orders = await prisma.order.findMany({
            where: {
                storeId: sessionUser.storeId,
                fulfillmentStatus: {
                    in: ["UNFULFILLED", "PREPARING", "PROCESSING"]
                },
                // For KDS, we probably only want today's orders or recent ones.
                // sorting by oldest first (FIFO)
            },
            include: {
                items: true,
                // optionally customer for name
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return NextResponse.json({ orders });
    } catch (e) {
        console.error("Fetch kitchen orders error:", e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
