
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';
import { Customer, CustomerStatus } from '@vayva/shared';

// Mock Customers Data
const MOCK_CUSTOMERS: Customer[] = [
    {
        id: 'cus_1',
        merchantId: 'mer_123',
        name: 'Chioma Okeke',
        phone: '+234 801 234 5678',
        firstSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), // 60 days ago
        lastSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        totalOrders: 12,
        totalSpend: 156000,
        status: CustomerStatus.VIP,
        preferredChannel: 'whatsapp'
    },
    {
        id: 'cus_2',
        merchantId: 'mer_123',
        name: 'Emmanuel Adebayo',
        phone: '+234 802 345 6789',
        firstSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        lastSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        totalOrders: 1,
        totalSpend: 15000,
        status: CustomerStatus.NEW,
        preferredChannel: 'website'
    },
    {
        id: 'cus_3',
        merchantId: 'mer_123',
        name: 'Aisha Bello',
        phone: '+234 803 456 7890',
        firstSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
        lastSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(), // inactive > 30 days
        totalOrders: 3,
        totalSpend: 45000,
        status: CustomerStatus.RETURNING,
        preferredChannel: 'whatsapp'
    },
    {
        id: 'cus_4',
        merchantId: 'mer_123',
        name: 'Guest (0809...)', // Implicit profile
        phone: '+234 809 999 9999',
        firstSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        lastSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        totalOrders: 1,
        totalSpend: 2500,
        status: CustomerStatus.NEW,
        preferredChannel: 'whatsapp'
    }
];

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search')?.toLowerCase();
        const session = await requireAuth();
    const storeId = session.user.storeId; // TODO: session

        // Pagination
        const page = Number(searchParams.get('page')) || 1;
        const limit = Number(searchParams.get('limit')) || 50;
        const skip = (page - 1) * limit;

        const where: any = { storeId };
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [customers, total] = await Promise.all([
            prisma.customer.findMany({
                where,
                include: {
                    orders: {
                        select: {
                            total: true,
                            createdAt: true
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.customer.count({ where })
        ]);

        const formattedCustomers = customers.map(c => {
            const totalOrders = c.orders.length;
            const totalSpend = c.orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
            const lastOrder = c.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

            // Determine status based on activity
            let status = CustomerStatus.NEW;
            if (totalOrders > 5 && totalSpend > 100000) status = CustomerStatus.VIP;
            else if (totalOrders > 1) status = CustomerStatus.RETURNING;

            return {
                id: c.id,
                merchantId: c.storeId,
                name: `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim() || 'Guest',
                phone: c.phone || '',
                firstSeenAt: c.createdAt.toISOString(),
                lastSeenAt: lastOrder?.createdAt.toISOString() || c.createdAt.toISOString(),
                totalOrders,
                totalSpend,
                status, // Using calculated status
                preferredChannel: 'whatsapp' // Default or derive from Customer data if available
            };
        });

        return NextResponse.json({
            data: formattedCustomers,
            meta: {
                total,
                page,
                limit
            }
        });
    } catch (error) {
        console.error("Fetch Customers Error:", error);
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }
}
