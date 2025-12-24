
import { NextResponse } from 'next/server';
import { UnifiedOrderStatus } from '@vayva/shared';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { next_status } = await request.json();

    // Mock validation logic
    if (!Object.values(UnifiedOrderStatus).includes(next_status)) {
        return NextResponse.json({ error: 'Invalid status transition' }, { status: 409 });
    }

    // Simulate DB update
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
        id,
        status: next_status,
        updated_at: new Date().toISOString()
    });
}
