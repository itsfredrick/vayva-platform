import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Adjust import if needed
import { computeMerchantReadiness } from '@/lib/ops/computeReadiness';
import { prisma } from '@vayva/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
    // Admin Guard (Mock or Real)
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.isAdmin) return new NextResponse('Unauthorized', { status: 403 });

    const { searchParams } = new URL(req.url);
    const merchantId = searchParams.get('merchant_id');

    if (!merchantId) return new NextResponse('Missing merchant_id', { status: 400 });

    try {
        const store = await prisma.store.findUnique({
            where: { id: merchantId }, // assuming merchantId is storeId for this context
            include: { policies: true }
        });

        if (!store) return new NextResponse('Store not found', { status: 404 });

        const readiness = await computeMerchantReadiness(merchantId);
        const correlationId = uuidv4();

        const snapshot = {
            merchant: {
                id: merchantId,
                plan: 'growth', // Mock plan
                createdAt: store.createdAt
            },
            store: {
                name: store.name,
                slug: store.slug,
                readinessLevel: readiness.level
            },
            readiness,
            policies: {
                published: store.policies.some(p => p.published),
                types: store.policies.map(p => p.type)
            },
            meta: {
                correlationId,
                generatedAt: new Date().toISOString()
            }
        };

        return NextResponse.json(snapshot);

    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 });
    }
}
