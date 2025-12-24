
import { NextResponse } from 'next/server';
import { ProductServiceItem } from '@vayva/shared';

// This would connect to DB in real app
// For now, we simulate success
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();

    return NextResponse.json({
        id,
        ...body,
        updatedAt: new Date().toISOString()
    });
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    return NextResponse.json({
        success: true,
        id,
        deletedAt: new Date().toISOString()
    });
}
