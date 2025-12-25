
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@vayva/db';

export async function GET(request: Request) {
    try {
        // Require authentication
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized - Please login' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter') || 'all'; // all, unread, critical

        // Get real notifications from database
        const where: any = {
            storeId: user.storeId,
        };

        if (filter === 'unread') {
            where.readAt = null;
        } else if (filter === 'critical') {
            where.severity = 'HIGH';
        }

        const notifications = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        // Transform to expected format
        const formattedNotifications = notifications.map(notif => ({
            id: notif.id,
            merchantId: notif.storeId,
            type: notif.severity === 'HIGH' ? 'critical' : notif.severity === 'MEDIUM' ? 'action_required' : 'info',
            category: notif.category || 'system',
            title: notif.title,
            message: notif.body,
            actionUrl: notif.actionUrl || undefined,
            actionLabel: 'View Details',
            isRead: notif.readAt !== null,
            createdAt: notif.createdAt.toISOString(),
            channels: ['in_app'], // Default channel
        }));

        return NextResponse.json(formattedNotifications);
    } catch (error) {
        console.error("Fetch Notifications Error:", error);
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}
