import { NextRequest, NextResponse } from 'next/server';
import { PublishService } from '@/lib/publish/publishService';

export async function POST(req: NextRequest) {
    // Admin Guard
    // Check key or session roles...

    const body = await req.json();
    const { merchant_id, admin_id, reason } = body;

    if (!merchant_id) return new NextResponse('Missing ID', { status: 400 });

    try {
        await PublishService.adminOverridePublish(
            merchant_id,
            admin_id || 'admin',
            'Platform Admin',
            reason || 'Override'
        );
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 });
    }
}
