
import { NextResponse } from 'next/server';
import { FulfillmentService } from '@/services/FulfillmentService';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: "Shipment ID and Status required" }, { status: 400 });
        }

        const shipment = await FulfillmentService.updateShipmentStatus(id, status);

        return NextResponse.json(shipment);
    } catch (error: any) {
        console.error("Update Shipment Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
