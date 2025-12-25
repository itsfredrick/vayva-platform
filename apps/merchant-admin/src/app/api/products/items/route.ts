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
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Get real products from database
        const where: any = {
            storeId: user.storeId,
        };

        if (status) {
            where.status = status;
        }

        const products = await prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });

        // Transform to expected format
        const formattedProducts = products.map((product: any) => ({
            id: product.id,
            merchantId: product.storeId,
            type: 'RETAIL',
            name: product.title,
            description: product.description || '',
            price: Number(product.price),
            currency: 'NGN',
            status: product.status,
            inventory: {
                enabled: product.trackInventory,
                quantity: 0, // Inventory managed via inventory service
            },
            itemsSold: 0, // Sales tracked via orders
            createdAt: product.createdAt.toISOString(),
        }));

        return NextResponse.json(formattedProducts);
    } catch (error) {
        console.error("Fetch Products Error:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

// Keep POST method for future implementation
export async function POST(request: Request) {
    try {
        // Require authentication
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized - Please login' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Mock response for product creation
        const newProduct = {
            id: `prod_${Date.now()}`,
            merchantId: user.storeId,
            ...body,
            createdAt: new Date().toISOString()
        };

        return NextResponse.json(newProduct);
    } catch (error: any) {
        console.error("Create Product Error:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
