import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/admin/auth';
import { prisma } from '@vayva/db';

export async function GET(req: NextRequest) {
    try {
        await checkAdminAccess();

        const logs = await prisma.auditLog.findMany({
            take: 100,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ logs });
    } catch (e: any) {
        return new NextResponse(e.message, { status: 403 });
    }
}
