'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';

export default function ActivityLogPage() {
    // Mock Data
    const audits = [
        { id: '1', actor: 'Fredrick', action: 'ROLE_UPDATE', entity: 'Support Role', date: new Date().toISOString() },
        { id: '2', actor: 'System', action: 'ORDER_FULFILLMENT', entity: 'Order #1002', date: new Date(Date.now() - 3600000).toISOString() },
        { id: '3', actor: 'Sarah', action: 'LOGIN_SUCCESS', entity: 'Session', date: new Date(Date.now() - 7200000).toISOString() },
    ];

    return (
        <AdminShell title="Activity Log" breadcrumb="Settings">
            <div className="max-w-5xl mx-auto flex flex-col gap-8">

                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-[#0B0B0B]">Activity Log</h1>
                    <p className="text-[#525252]">Audit trail of all actions in your account.</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Actor</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Entity</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Meta</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {audits.map(log => (
                                <tr key={log.id}>
                                    <td className="px-6 py-4 font-medium text-[#0B0B0B]">{log.actor}</td>
                                    <td className="px-6 py-4 text-[#525252]">{log.action}</td>
                                    <td className="px-6 py-4 text-blue-600">{log.entity}</td>
                                    <td className="px-6 py-4 text-[#525252]">{new Date(log.date).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <Button variant="ghost" size="sm">View Details</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminShell>
    );
}
