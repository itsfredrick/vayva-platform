import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";



export async function GET(req: Request) {
    try {
        const user = await requireAuth();

        const shipments = await prisma.shipment.findMany({
            where: { storeId: user.storeId },
            include: {
                Order: {
                    select: {
                        orderNumber: true,
                        total: true,
                        currency: true
                    }
                },
                DeliveryEvents: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        const formatted = shipments.map((s: any) => ({
            id: s.id,
            trackingCode: s.trackingCode,
            order: s.Order?.orderNumber ? `#${s.Order.orderNumber}` : 'N/A',
            customer: s.recipientName || "Guest",
            status: s.status, // Uses DB status
            rider: s.courierName || s.provider, // Provider as fallback
            eta: s.status === 'DELIVERED' ? 'Arrived' : 'Calculating...',
            // Mock POD from notes or a specific event if not in DB.
            // Since User requested No Mock Data, we return null if no POD image url is stored.
            // We'll check if notes contains 'POD:'.
            pod: s.notes?.startsWith('POD:') ? s.notes.replace('POD:', '') : null
        }));

        return NextResponse.json({ success: true, data: formatted });
    } catch (error) {
        console.error("[LOGISTICS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
