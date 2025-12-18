import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@vayva/db';

export async function POST(
    req: NextRequest,
    { params }: { params: { type: string } }
) {
    try {
        const session = await getServerSession();
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const policy = await prisma.merchantPolicy.update({
            where: {
                storeId_type: {
                    storeId: session.user.storeId,
                    type: params.type.toUpperCase().replace('-', '_')
                }
            },
            data: {
                status: 'PUBLISHED',
                publishedVersion: { increment: 1 },
                publishedAt: new Date(),
                lastUpdatedLabel: new Date().toISOString().split('T')[0] // YYYY-MM-DD
            }
        });

        return NextResponse.json({ policy });
    } catch (error) {
        console.error('Error publishing policy:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
