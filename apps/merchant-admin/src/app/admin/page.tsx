'use client';

import React from 'react';
import { Icon } from '@vayva/ui';

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-2">System Status</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Webhook Failures (1h)', value: '0', status: 'good' },
                        { label: 'Job DLQ', value: '0', status: 'good' },
                        { label: 'Past Due Merchants', value: '12', status: 'warning' },
                        { label: 'Risk Signals', value: '3', status: 'critical' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                            <div className="text-sm text-gray-500 font-medium mb-1">{stat.label}</div>
                            <div className={`text-2xl font-bold ${stat.status === 'good' ? 'text-gray-900' : stat.status === 'warning' ? 'text-orange-600' : 'text-red-600'
                                }`}>
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white border rounded-xl p-6">
                    <h2 className="font-bold mb-4 flex items-center gap-2">
                        <Icon name="Activity" size={16} /> Recent Incidents
                    </h2>
                    <div className="text-sm text-gray-500 text-center py-8">
                        No active incidents detected.
                    </div>
                </div>

                <div className="bg-white border rounded-xl p-6">
                    <h2 className="font-bold mb-4 flex items-center gap-2">
                        <Icon name="Search" size={16} /> Quick Lookup
                    </h2>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Store name, email, or ID..."
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                        <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold">Search</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
