
import { NextResponse } from 'next/server';
import { Notification, NotificationType } from '@vayva/shared';

// Mock Data
const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif_1',
        merchantId: 'mer_123',
        type: 'critical',
        category: 'account',
        title: 'KYC Verification Failed',
        message: 'Your identity verification failed. Withdrawals are currently blocked.',
        actionUrl: '/admin/account/overview',
        actionLabel: 'Fix Issue',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        channels: ['in_app', 'banner', 'email']
    },
    {
        id: 'notif_2',
        merchantId: 'mer_123',
        type: 'action_required',
        category: 'orders',
        title: 'Order #1924 needs attention',
        message: 'Payment for this order has been pending for 24 hours.',
        actionUrl: '/admin/orders/1924',
        actionLabel: 'View Order',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        channels: ['in_app']
    },
    {
        id: 'notif_3',
        merchantId: 'mer_123',
        type: 'success',
        category: 'payments',
        title: 'Withdrawal Successful',
        message: '₦450,000 has been sent to your GTBank account.',
        actionUrl: '/admin/wallet',
        actionLabel: 'View Wallet',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        channels: ['in_app', 'whatsapp']
    },
    {
        id: 'notif_4',
        merchantId: 'mer_123',
        type: 'info',
        category: 'system',
        title: 'New Feature: Control Center',
        message: 'You can now manage all your store settings in one place.',
        actionUrl: '/admin/control-center',
        actionLabel: 'Explore',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        channels: ['in_app']
    }
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all'; // all, unread, critical

    let filtered = [...MOCK_NOTIFICATIONS];

    if (filter === 'unread') {
        filtered = filtered.filter(n => !n.isRead);
    } else if (filter === 'critical') {
        filtered = filtered.filter(n => n.type === 'critical');
    }

    // Sort by Date DESC
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(filtered);
}
