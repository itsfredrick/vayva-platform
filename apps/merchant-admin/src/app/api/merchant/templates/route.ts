import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth'; // Mocked in local
import { authOptions } from '@/lib/auth';
import { prisma } from '@vayva/db';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const templates = await prisma.templateManifest.findMany({
        where: { isArchived: false },
        orderBy: { name: 'asc' }
    });

    return NextResponse.json({ templates });
}
