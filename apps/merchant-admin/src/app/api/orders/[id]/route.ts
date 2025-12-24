
import { NextResponse } from 'next/server';
import { UnifiedOrder } from '@vayva/shared';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    return NextResponse.json({ success: true, ...body });
}
