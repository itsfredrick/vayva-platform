
import { NextResponse } from 'next/server';
import { UnifiedOrderStatus } from '@vayva/shared';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();

    // Validate reason
    if (!body.reason) {
        return NextResponse.json({ error: 'Cancellation reason required' }, { status: 400 });
    }

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 600));

    return NextResponse.json({
        id,
        status: UnifiedOrderStatus.CANCELLED,
        cancellation_reason: body.reason,
        updated_at: new Date().toISOString()
    });
}
