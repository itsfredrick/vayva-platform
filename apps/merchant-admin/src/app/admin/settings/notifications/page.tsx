'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';

export default function NotificationSettingsPage() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await api.get('/notifications/templates'); // Ensure APIG way routes this
                // If endpoint logic missing, mocked:
                if (!res.data || res.data.length === 0) {
                    setTemplates([
                        { id: '1', name: 'Order Placed (WhatsApp)', channel: 'WHATSAPP', enabled: true },
                        { id: '2', name: 'Order Shipped (SMS)', channel: 'SMS', enabled: false },
                    ]);
                } else {
                    setTemplates(res.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTemplates();
    }, []);

    return (
        <AdminShell title="Notification Settings" breadcrumb="Settings">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-bold text-[#0B0B0B]">Notification Templates</h2>
                    <p className="text-[#525252] text-sm">Manage automated messages sent to customers.</p>
                </div>

                <div className="grid gap-4">
                    {templates.map(t => (
                        <div key={t.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={cn("p-2 rounded-lg", t.channel === 'WHATSAPP' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600')}>
                                    <Icon name={t.channel === 'WHATSAPP' ? 'MessageCircle' : 'Mail'} size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-[#0B0B0B]">{t.name}</h3>
                                    <p className="text-xs text-[#525252]">{t.channel}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={cn("text-xs font-bold uppercase", t.enabled ? 'text-green-600' : 'text-gray-400')}>
                                    {t.enabled ? 'Active' : 'Disabled'}
                                </span>
                                <Button variant="outline" size="sm">Edit</Button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </AdminShell>
    );
}
