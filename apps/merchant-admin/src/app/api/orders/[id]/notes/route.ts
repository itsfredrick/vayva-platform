
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { note } = await request.json();

    if (!note) return NextResponse.json({ error: 'Note cannot be empty' }, { status: 400 });

    // Simulate DB append
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json({
        id,
        message: 'Note added successfully',
        note_id: `note_${Date.now()}`,
        created_at: new Date().toISOString()
    });
}
