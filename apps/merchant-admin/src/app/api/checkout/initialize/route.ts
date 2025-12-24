
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, total, method } = body;

        // Simulate backend processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock Order Creation logic would go here
        // db.order.create(...)

        if (method === 'paystack') {
            // Return mock checkout URL
            return NextResponse.json({
                success: true,
                orderId: 'ord_' + Math.floor(Math.random() * 10000),
                checkoutUrl: null, // Returning null triggers the "Mock Success" alert in the frontend hook
                message: 'Checkout initialized'
            });
        }

        return NextResponse.json({ success: false, message: 'Invalid method' }, { status: 400 });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
