import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@vayva/db';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const policies = await prisma.merchantPolicy.findMany({
            where: { storeId: session.user.storeId },
            orderBy: { type: 'asc' }
        });

        return NextResponse.json({ policies });
    } catch (error) {
        console.error('Error fetching policies:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
