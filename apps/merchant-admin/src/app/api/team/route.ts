import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';

export async function GET() {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        // Get team members
        const members = await prisma.membership.findMany({
            where: { storeId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                joinedAt: 'asc',
            },
        });

        return NextResponse.json({
            members: members.map(m => ({
                id: m.userId,
                name: `${m.user.firstName} ${m.user.lastName}`,
                email: m.user.email,
                role: m.role,
                status: m.status,
                joinedAt: m.joinedAt,
            })),
        });
    } catch (error: any) {
        console.error('Team fetch error:', error);

        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Failed to fetch team' },
            { status: 500 }
        );
    }
}
