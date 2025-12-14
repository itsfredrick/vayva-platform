'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, GlassPanel } from '@vayva/ui';
import { AuditService } from '@/services/audit';
import { useAuth } from '@/context/AuthContext';

export default function ActivityPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        AuditService.list().then(setEvents).catch(console.error);
    }, []);

    return (
        <AppShell
            title="Activity Feed"
            breadcrumbs={[{ label: 'Settings', href: '/admin/settings' }, { label: 'Activity', href: '#' }]}
            profile={{ name: user?.name || '', email: user?.email || '' }}
            storeName="Store"
            onLogout={() => router.push('/signin')}
        >
            <GlassPanel className="p-0 overflow-hidden">
                <div className="flex flex-col">
                    {events.length === 0 ? (
                        <div className="p-8 text-center text-text-secondary">No activity logs.</div>
                    ) : (
                        events.map((e) => (
                            <div key={e.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="font-mono text-xs text-text-secondary bg-white/10 px-2 py-1 rounded">
                                        {e.action}
                                    </div>
                                    <div className="text-white text-sm">
                                        <span className="text-text-secondary">Resource:</span> {e.resource} ({e.resourceId})
                                    </div>
                                </div>
                                <div className="text-xs text-text-secondary font-mono">
                                    {new Date(e.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </GlassPanel>
        </AppShell>
    );
}
