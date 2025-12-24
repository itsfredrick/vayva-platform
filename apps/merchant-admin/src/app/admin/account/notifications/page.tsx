'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Shield, Save, Loader2 } from 'lucide-react';

interface NotificationSettings {
    email: {
        orderPaid: boolean;
        payoutProcessed: boolean;
        kycUpdates: boolean;
        disputes: boolean;
        marketing: boolean;
    };
    whatsapp: {
        orderUpdates: boolean;
        customerMessages: boolean;
        dailySummaries: boolean;
    };
    system: {
        security: boolean;
        subscription: boolean;
        errors: boolean;
    };
}

export default function NotificationsPage() {
    const [settings, setSettings] = useState<NotificationSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/notifications/settings');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setSettings(data);
        } catch (error) {
            console.error('Failed to load settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!settings) return;

        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/notifications/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (!res.ok) throw new Error('Failed to save');

            setMessage({ type: 'success', text: 'Settings saved successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (category: keyof NotificationSettings, key: string, value: boolean) => {
        if (!settings) return;
        setSettings({
            ...settings,
            [category]: {
                ...settings[category],
                [key]: value,
            },
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!settings) {
        return <div className="text-center py-12 text-gray-500">Failed to load settings</div>;
    }

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
                <p className="text-gray-600 mt-1">
                    Manage how you receive notifications
                </p>
            </div>

            {message && (
                <div className={`
                    p-4 rounded-lg border
                    ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}
                `}>
                    {message.text}
                </div>
            )}

            {/* Email Notifications */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
                </div>

                <div className="space-y-4">
                    <ToggleRow
                        label="Order Paid"
                        description="Get notified when a customer pays for an order"
                        checked={settings.email.orderPaid}
                        onChange={(v) => updateSetting('email', 'orderPaid', v)}
                    />
                    <ToggleRow
                        label="Payout Processed"
                        description="Get notified when a payout is processed"
                        checked={settings.email.payoutProcessed}
                        onChange={(v) => updateSetting('email', 'payoutProcessed', v)}
                    />
                    <ToggleRow
                        label="KYC Updates"
                        description="Get notified about KYC verification status"
                        checked={settings.email.kycUpdates}
                        onChange={(v) => updateSetting('email', 'kycUpdates', v)}
                    />
                    <ToggleRow
                        label="Disputes"
                        description="Get notified when a dispute is filed"
                        checked={settings.email.disputes}
                        onChange={(v) => updateSetting('email', 'disputes', v)}
                    />
                    <ToggleRow
                        label="Marketing Emails"
                        description="Receive tips, updates, and promotional content"
                        checked={settings.email.marketing}
                        onChange={(v) => updateSetting('email', 'marketing', v)}
                    />
                </div>
            </div>

            {/* WhatsApp Notifications */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-50 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">WhatsApp Notifications</h3>
                </div>

                <div className="space-y-4">
                    <ToggleRow
                        label="Order Updates"
                        description="Get order status updates via WhatsApp"
                        checked={settings.whatsapp.orderUpdates}
                        onChange={(v) => updateSetting('whatsapp', 'orderUpdates', v)}
                    />
                    <ToggleRow
                        label="Customer Messages"
                        description="Get notified when customers send messages"
                        checked={settings.whatsapp.customerMessages}
                        onChange={(v) => updateSetting('whatsapp', 'customerMessages', v)}
                    />
                    <ToggleRow
                        label="Daily Summaries"
                        description="Receive daily summary of your store activity"
                        checked={settings.whatsapp.dailySummaries}
                        onChange={(v) => updateSetting('whatsapp', 'dailySummaries', v)}
                    />
                </div>
            </div>

            {/* System Alerts */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
                </div>

                <div className="space-y-4">
                    <ToggleRow
                        label="Security Events"
                        description="Get notified about login attempts and security changes"
                        checked={settings.system.security}
                        onChange={(v) => updateSetting('system', 'security', v)}
                    />
                    <ToggleRow
                        label="Subscription Changes"
                        description="Get notified about plan changes and renewals"
                        checked={settings.system.subscription}
                        onChange={(v) => updateSetting('system', 'subscription', v)}
                    />
                    <ToggleRow
                        label="Critical Errors"
                        description="Get notified about system errors and issues"
                        checked={settings.system.errors}
                        onChange={(v) => updateSetting('system', 'errors', v)}
                    />
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

function ToggleRow({
    label,
    description,
    checked,
    onChange,
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    ${checked ? 'bg-green-600' : 'bg-gray-200'}
                `}
            >
                <span
                    className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${checked ? 'translate-x-6' : 'translate-x-1'}
                    `}
                />
            </button>
        </div>
    );
}
