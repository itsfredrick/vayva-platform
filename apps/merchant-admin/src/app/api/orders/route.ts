import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@vayva/db';

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
        const statusParam = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Real database query - simplified to avoid TypeScript issues
        // TODO: Add proper includes for customer and items after verifying schema
        const orders = await prisma.order.findMany({
            where: {
                storeId: user.storeId,
                ...(statusParam && { status: statusParam as any }),
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });

        // Transform to match expected format
        const transformedOrders = orders.map(order => ({
            id: order.id,
            merchantId: order.storeId,
            orderNumber: order.orderNumber.toString(),
            refCode: order.refCode,
            status: order.status,
            paymentStatus: order.paymentStatus,
            fulfillmentStatus: order.fulfillmentStatus,
            customer: {
                id: order.customerId || '',
                email: order.customerEmail || '',
                phone: order.customerPhone || '',
            },
            totalAmount: Number(order.total),
            subtotal: Number(order.subtotal),
            tax: Number(order.tax),
            shippingTotal: Number(order.shippingTotal),
            discountTotal: Number(order.discountTotal),
            currency: order.currency,
            source: order.source,
            paymentMethod: order.paymentMethod || '',
            deliveryMethod: order.deliveryMethod || '',
            timestamps: {
                createdAt: order.createdAt.toISOString(),
                updatedAt: order.updatedAt.toISOString(),
            },
        }));

        return NextResponse.json(transformedOrders);
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
