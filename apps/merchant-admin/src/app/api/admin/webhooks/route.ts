import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/admin/auth';
import { prisma } from '@vayva/db';

export async function GET(req: NextRequest) {
    try {
        await checkAdminAccess();

        const events = await prisma.webhookEvent.findMany({
            take: 50,
            orderBy: { receivedAt: 'desc' }
        });

        return NextResponse.json({ events });
    } catch (e: any) {
        return new NextResponse(e.message, { status: 403 });
    }
}
