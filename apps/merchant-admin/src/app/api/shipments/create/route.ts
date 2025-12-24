
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { FulfillmentService } from '@/services/FulfillmentService';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderId, deliveryOptionType, trackingCode } = body;

        if (!orderId || !deliveryOptionType) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // TODO: Get storeId from session
        const session = await requireAuth();
    const storeId = session.user.storeId;

        const shipment = await FulfillmentService.createShipment({
            storeId,
            orderId,
            deliveryOptionType,
            trackingCode,
            // Add other optional fields as needed
        });

        return NextResponse.json(shipment);
    } catch (error: any) {
        console.error("Create Shipment Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
