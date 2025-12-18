import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasPermission, PERMISSIONS } from '@/lib/auth/permissions';
import { prisma } from '@vayva/db';
import { EventBus } from '@/lib/events/eventBus';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse('Unauthorized', { status: 401 });

    const { id } = params;

    const request = await prisma.approvalRequest.findUnique({ where: { id } });
    if (!request) return new NextResponse('Not Found', { status: 404 });
    if (request.merchantId !== session.user.storeId) return new NextResponse('Forbidden', { status: 403 });
    if (request.status !== 'pending') return new NextResponse('Request not pending', { status: 400 });

    // Check Permission
    const canDecide = await hasPermission(session.user.id, request.merchantId, PERMISSIONS.APPROVALS_DECIDE);
    if (!canDecide) return new NextResponse('Forbidden', { status: 403 });

    // We don't strictly enforce action-specific permission for rejection, but safe to keep consistent.
    // Usually rejection is easier. We'll enforce decide only.

    const body = await req.json().catch(() => ({}));
    const reason = body?.decisionReason;

    await prisma.approvalRequest.update({
        where: { id },
        data: {
            status: 'rejected',
            decidedByUserId: session.user.id,
            decidedByLabel: `${session.user.firstName} ${session.user.lastName}`,
            decidedAt: new Date(),
            decisionReason: reason
        }
    });

    await EventBus.publish({
        merchantId: request.merchantId,
        type: 'approvals.rejected',
        payload: { approvalId: id, reason },
        ctx: {
            actorId: session.user.id,
            actorType: 'user',
            actorLabel: `${session.user.firstName} ${session.user.lastName}`,
            correlationId: request.correlationId
        }
    });

    return NextResponse.json({ ok: true, status: 'rejected' });
}
