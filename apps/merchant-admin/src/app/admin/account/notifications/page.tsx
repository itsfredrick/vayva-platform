'use client';

import React, { useEffect, useState } from 'react';
import { GlassPanel, Button } from '@vayva/ui';
import { AccountService } from '@/services/account.service';
import { NotificationPrefs } from '@/types/account';
import { Spinner } from '@/components/Spinner';

// Toggle Component (Simple)
function Toggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: (val: boolean) => void }) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
            <span className="text-text-secondary text-sm">{label}</span>
            <button
                onClick={() => onChange(!checked)}
                className={`w-10 h-5 rounded-full transition-colors relative ${checked ? 'bg-primary' : 'bg-white/20'}`}
            >
                <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${checked ? 'left-6' : 'left-1'}`} />
            </button>
        </div>
    );
}

export default function NotificationsPage() {
    const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await AccountService.getNotifications();
            setPrefs(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleChange = (channel: 'email' | 'whatsapp', key: string, val: boolean) => {
        if (!prefs) return;
        const newPrefs = {
            ...prefs,
            [channel]: {
                ...prefs[channel],
                [key]: val
            }
        };
        setPrefs(newPrefs);
        AccountService.updateNotifications(newPrefs); // Fire and forget update
    };

    if (loading || !prefs) return <div className="text-text-secondary"><Spinner size="sm" /> Loading preferences...</div>;

    return (
        <div className="space-y-6 max-w-2xl">
            <GlassPanel className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Email Notifications</h3>
                <Toggle label="New Orders" checked={prefs.email.orders} onChange={(v) => handleChange('email', 'orders', v)} />
                <Toggle label="Payouts & Finance" checked={prefs.email.payouts} onChange={(v) => handleChange('email', 'payouts', v)} />
                <Toggle label="WA Agent Approvals" checked={prefs.email.waApprovals} onChange={(v) => handleChange('email', 'waApprovals', v)} />
                <Toggle label="Low Stock Alerts" checked={prefs.email.lowStock} onChange={(v) => handleChange('email', 'lowStock', v)} />
            </GlassPanel>

            <GlassPanel className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">WhatsApp Notifications</h3>
                <Toggle label="Real-time Order Alerts" checked={prefs.whatsapp.orders} onChange={(v) => handleChange('whatsapp', 'orders', v)} />
                <Toggle label="Payout Confirmations" checked={prefs.whatsapp.payouts} onChange={(v) => handleChange('whatsapp', 'payouts', v)} />
            </GlassPanel>
        </div>
    );
}
