'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, GlassPanel, StatusChip } from '@vayva/ui';
import { NotificationService } from '@/services/notifications';
import { useAuth } from '@/context/AuthContext';

export default function NotificationsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        NotificationService.list().then(setNotifications).catch(console.error);
    }, []);

    return (
        <AppShell
            title="Notifications"
            breadcrumbs={[{ label: 'Notifications', href: '/admin/notifications' }]}
            profile={{ name: user?.name || '', email: user?.email || '' }}
            storeName="Store"
            onLogout={() => router.push('/signin')}
        >
            <GlassPanel className="p-0 overflow-hidden">
                <div className="flex flex-col">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-text-secondary">No notifications.</div>
                    ) : (
                        notifications.map((n) => (
                            <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex justify-between items-center">
                                <div>
                                    <div className="font-medium text-white">{n.title}</div>
                                    <div className="text-sm text-text-secondary">{new Date(n.createdAt).toLocaleString()}</div>
                                </div>
                                <StatusChip status={n.status} />
                            </div>
                        ))
                    )}
                </div>
            </GlassPanel>
        </AppShell>
    );
}
