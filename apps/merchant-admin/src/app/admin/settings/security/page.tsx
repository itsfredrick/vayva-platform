'use client';

import React from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';

export default function SecurityPage() {
    return (
        <AdminShell title="Security Settings" breadcrumb="Settings">
            <div className="max-w-3xl mx-auto flex flex-col gap-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-[#0B0B0B]">Security</h1>
                    <p className="text-[#525252]">Manage your account security and authentication preferences.</p>
                </div>

                {/* MFA Section */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Icon name="Shield" size={20} className="text-green-600" />
                            <h3 className="font-bold text-[#0B0B0B]">Two-Factor Authentication (2FA)</h3>
                        </div>
                        <p className="text-sm text-[#525252] max-w-sm">Protect your account by requiring an extra code when logging in.</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                </div>

                {/* Session Timeout */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-start justify-between">
                    <div>
                        <h3 className="font-bold text-[#0B0B0B] mb-2">Session Timeout</h3>
                        <p className="text-sm text-[#525252] max-w-sm">Automatically log out inactive users.</p>
                    </div>
                    <select className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm">
                        <option>12 Hours</option>
                        <option>24 Hours</option>
                        <option>1 Hour</option>
                    </select>
                </div>

                {/* API Keys */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-[#0B0B0B]">API Keys</h3>
                            <p className="text-sm text-[#525252]">Manage keys for external integrations.</p>
                        </div>
                        <Button size="sm">Create Key</Button>
                    </div>
                    <div className="text-sm text-center text-gray-400 py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        No active API keys found.
                    </div>
                </div>

            </div>
        </AdminShell>
    );
}
