'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';

export default function WebhooksPage() {
    const [endpoints, setEndpoints] = useState<any[]>([]);
    const [deliveries, setDeliveries] = useState<any[]>([]);

    const fetchEndpoints = async () => {
        const res = await api.get('/webhooks/endpoints');
        setEndpoints(res.data || []);
    };

    const fetchDeliveries = async () => {
        const res = await api.get('/webhooks/deliveries');
        setDeliveries(res.data || []);
    };

    useEffect(() => {
        fetchEndpoints();
        fetchDeliveries();
    }, []);

    return (
        <AdminShell title="Webhooks" breadcrumb="Integrations">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0B1220]">Webhook Endpoints</h1>
                        <p className="text-[#525252]">Receive real-time events from your store.</p>
                    </div>
                    <Button>
                        <Icon name="Plus" size={16} className="mr-2" />
                        Add Endpoint
                    </Button>
                </div>

                <div className="grid gap-4">
                    {endpoints.map(endpoint => (
                        <div key={endpoint.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-[#0B1220] mb-1">{endpoint.url}</h3>
                                    <p className="text-sm text-[#525252]">
                                        {endpoint.subscribedEvents.length} events subscribed
                                    </p>
                                </div>
                                <span className={cn(
                                    "text-xs font-bold uppercase px-2 py-1 rounded",
                                    endpoint.status === 'ACTIVE' ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-500"
                                )}>
                                    {endpoint.status}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">View Logs</Button>
                                <Button variant="outline" size="sm">Test</Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <h2 className="text-xl font-bold text-[#0B1220] mb-4">Recent Deliveries</h2>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Event</th>
                                    <th className="px-6 py-4">Endpoint</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Time</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {deliveries.length === 0 ? (
                                    <tr><td colSpan={5} className="p-12 text-center text-gray-400">No deliveries yet.</td></tr>
                                ) : (
                                    deliveries.map(delivery => (
                                        <tr key={delivery.id}>
                                            <td className="px-6 py-4 font-medium text-[#0B1220]">{delivery.eventType}</td>
                                            <td className="px-6 py-4 text-[#525252] truncate max-w-xs">
                                                {endpoints.find(e => e.id === delivery.endpointId)?.url}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "text-xs font-bold uppercase px-2 py-0.5 rounded",
                                                    delivery.status === 'DELIVERED' ? "bg-green-50 text-green-600" :
                                                        delivery.status === 'FAILED' ? "bg-red-50 text-red-600" :
                                                            delivery.status === 'DEAD' ? "bg-gray-50 text-gray-500" :
                                                                "bg-blue-50 text-blue-600"
                                                )}>
                                                    {delivery.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-[#525252]">
                                                {new Date(delivery.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {delivery.status === 'FAILED' && (
                                                    <Button variant="ghost" size="sm">Replay</Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AdminShell>
    );
}
