import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PublishService } from '@/lib/publish/publishService';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.storeId) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();

    try {
        await PublishService.unpublish(
            session.user.storeId,
            session.user.id,
            session.user.name || 'Merchant',
            body.reason || 'No reason provided'
        );
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 });
    }
}
