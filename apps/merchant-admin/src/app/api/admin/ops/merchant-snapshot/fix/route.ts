import { NextRequest, NextResponse } from 'next/server';
import { remediateStore } from '@/lib/ops/remediation';
import { computeMerchantReadiness } from '@/lib/ops/computeReadiness';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    // Admin Guard
    // ...

    const body = await req.json();
    const { merchant_id, mode } = body;

    if (!merchant_id) return new NextResponse('Missing merchant_id', { status: 400 });

    try {
        const correlationId = uuidv4();

        // Run Fix
        const fixes = await remediateStore(merchant_id, correlationId);

        // Re-compute
        const readiness = await computeMerchantReadiness(merchant_id);

        return NextResponse.json({
            success: true,
            fixes,
            readiness,
            correlationId
        });
    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 });
    }
}
