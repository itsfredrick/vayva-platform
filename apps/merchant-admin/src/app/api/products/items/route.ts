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

        // Mock products data for development
        // TODO: Replace with real database query filtered by user.storeId
        const mockProducts = [
            {
                id: 'prod_001',
                merchantId: user.storeId,
                type: 'RETAIL',
                name: 'Premium T-Shirt',
                description: 'High-quality cotton t-shirt with modern fit',
                price: 5000,
                currency: 'NGN',
                status: 'ACTIVE',
                inventory: {
                    enabled: true,
                    quantity: 50
                },
                itemsSold: 12,
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'prod_002',
                merchantId: user.storeId,
                type: 'RETAIL',
                name: 'Designer Sneakers',
                description: 'Comfortable and stylish sneakers for everyday wear',
                price: 25000,
                currency: 'NGN',
                status: 'ACTIVE',
                inventory: {
                    enabled: true,
                    quantity: 20
                },
                itemsSold: 8,
                createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'prod_003',
                merchantId: user.storeId,
                type: 'RETAIL',
                name: 'Leather Wallet',
                description: 'Genuine leather wallet with multiple card slots',
                price: 8500,
                currency: 'NGN',
                status: 'ACTIVE',
                inventory: {
                    enabled: true,
                    quantity: 35
                },
                itemsSold: 15,
                createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'prod_004',
                merchantId: user.storeId,
                type: 'RETAIL',
                name: 'Designer Handbag',
                description: 'Elegant handbag perfect for any occasion',
                price: 35000,
                currency: 'NGN',
                status: 'ACTIVE',
                inventory: {
                    enabled: true,
                    quantity: 10
                },
                itemsSold: 5,
                createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'prod_005',
                merchantId: user.storeId,
                type: 'RETAIL',
                name: 'Sunglasses',
                description: 'UV protection sunglasses with polarized lenses',
                price: 8000,
                currency: 'NGN',
                status: 'ACTIVE',
                inventory: {
                    enabled: true,
                    quantity: 40
                },
                itemsSold: 20,
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'prod_006',
                merchantId: user.storeId,
                type: 'RETAIL',
                name: 'Laptop Sleeve',
                description: 'Protective sleeve for 13-15 inch laptops',
                price: 12500,
                currency: 'NGN',
                status: 'DRAFT',
                inventory: {
                    enabled: true,
                    quantity: 0
                },
                itemsSold: 0,
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];

        return NextResponse.json(mockProducts);
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
