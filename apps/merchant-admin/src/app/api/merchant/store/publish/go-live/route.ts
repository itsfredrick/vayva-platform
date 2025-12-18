import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PublishService } from '@/lib/publish/publishService';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.storeId) return new NextResponse('Unauthorized', { status: 401 });

    try {
        const result = await PublishService.goLive(
            session.user.storeId,
            session.user.id,
            session.user.name || session.user.email || 'Merchant'
        );
        return NextResponse.json(result);
    } catch (e: any) {
        if (e.message.includes('not ready')) {
            return new NextResponse(JSON.stringify({ error: e.message, type: 'NOT_READY' }), { status: 409 });
        }
        return new NextResponse(e.message, { status: 500 });
    }
}
