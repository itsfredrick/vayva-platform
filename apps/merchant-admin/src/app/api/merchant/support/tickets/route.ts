import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SupportService } from '@/lib/support';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse('Unauthorized', { status: 401 });

    const tickets = await SupportService.getMerchantTickets(session.user.storeId);
    return NextResponse.json(tickets);
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();

    const ticket = await SupportService.createTicket({
        storeId: session.user.storeId,
        userId: session.user.id,
        type: body.type,
        subject: body.subject,
        description: body.description,
        priority: body.priority
    });

    return NextResponse.json(ticket);
}
