import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';

export async function GET(request: Request) {
    try {
        // Require authentication
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized - Please login' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'retail';

        // Mock orders data for development
        // TODO: Replace with real database query filtered by user.storeId
        const mockOrders = [
            {
                id: 'ord_1025',
                merchantId: user.storeId,
                type: 'retail',
                status: 'NEW',
                paymentStatus: 'paid',
                customer: { id: 'c1', name: 'Chioma Adebayo', phone: '+234 801 234 5678' },
                items: [{ id: 'p1', name: 'Vintage Silk Scarf', quantity: 1, price: 12000 }],
                totalAmount: 12000,
                currency: 'NGN',
                source: 'whatsapp',
                timestamps: {
                    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
                    updatedAt: new Date().toISOString()
                },
                fulfillmentType: 'delivery'
            },
            {
                id: 'ord_1024',
                merchantId: user.storeId,
                type: 'retail',
                status: 'PROCESSING',
                paymentStatus: 'paid',
                customer: { id: 'c2', name: 'Ibrahim Musa', phone: '+234 705 555 1212' },
                items: [{ id: 'p2', name: 'Leather Wallet', quantity: 1, price: 8500 }],
                totalAmount: 8500,
                currency: 'NGN',
                source: 'website',
                timestamps: {
                    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
                    updatedAt: new Date().toISOString()
                },
                fulfillmentType: 'delivery'
            },
            {
                id: 'ord_1023',
                merchantId: user.storeId,
                type: 'retail',
                status: 'COMPLETED',
                paymentStatus: 'paid',
                customer: { id: 'c3', name: 'Amaka Okafor', phone: '+234 803 123 4567' },
                items: [
                    { id: 'p3', name: 'Designer Handbag', quantity: 1, price: 35000 },
                    { id: 'p4', name: 'Sunglasses', quantity: 1, price: 8000 }
                ],
                totalAmount: 43000,
                currency: 'NGN',
                source: 'whatsapp',
                timestamps: {
                    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date().toISOString()
                },
                fulfillmentType: 'delivery'
            },
            {
                id: 'ord_1022',
                merchantId: user.storeId,
                type: 'retail',
                status: 'NEW',
                paymentStatus: 'pending',
                customer: { id: 'c4', name: 'Tunde Bakare', phone: '+234 806 789 0123' },
                items: [{ id: 'p5', name: 'Running Shoes', quantity: 2, price: 15000 }],
                totalAmount: 30000,
                currency: 'NGN',
                source: 'website',
                timestamps: {
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date().toISOString()
                },
                fulfillmentType: 'delivery'
            },
            {
                id: 'ord_1021',
                merchantId: user.storeId,
                type: 'retail',
                status: 'PROCESSING',
                paymentStatus: 'paid',
                customer: { id: 'c5', name: 'Ngozi Eze', phone: '+234 809 456 7890' },
                items: [{ id: 'p6', name: 'Laptop Sleeve', quantity: 1, price: 12500 }],
                totalAmount: 12500,
                currency: 'NGN',
                source: 'whatsapp',
                timestamps: {
                    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date().toISOString()
                },
                fulfillmentType: 'pickup'
            }
        ];

        return NextResponse.json(mockOrders);
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
