import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';

export async function POST(request: Request) {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        const body = await request.json();
        const { email, role } = body;

        if (!email || !role) {
            return NextResponse.json(
                { error: 'Email and role are required' },
                { status: 400 }
            );
        }

        if (!['OWNER', 'ADMIN', 'SUPPORT'].includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role' },
                { status: 400 }
            );
        }

        // Check if user exists
        let user = await prisma.user.findUnique({
            where: { email },
        });

        // Get store info for email
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: { name: true },
        });

        const inviter = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { firstName: true, lastName: true },
        });

        // If user doesn't exist, send invitation email
        if (!user) {
            // Send invitation email
            const { sendTeamInvite } = await import('@/lib/email/team-invite');

            try {
                await sendTeamInvite({
                    email,
                    storeName: store?.name || 'Your Store',
                    role,
                    inviterName: `${inviter?.firstName} ${inviter?.lastName}`,
                });
            } catch (emailError) {
                console.error('Failed to send invitation email:', emailError);
                // Continue anyway - invitation can be resent
            }

            return NextResponse.json({
                success: true,
                message: 'Invitation sent',
                inviteId: `invite_${Date.now()}`,
            });
        }

        // Check if already a member
        const existingMembership = await prisma.membership.findUnique({
            where: {
                userId_storeId: {
                    userId: user.id,
                    storeId,
                },
            },
        });

        if (existingMembership) {
            return NextResponse.json(
                { error: 'User is already a team member' },
                { status: 400 }
            );
        }

        // Create membership
        await prisma.membership.create({
            data: {
                userId: user.id,
                storeId,
                role,
                status: 'active',
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Team member added successfully',
        });
    } catch (error: any) {
        console.error('Team invite error:', error);

        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Failed to invite team member' },
            { status: 500 }
        );
    }
}
