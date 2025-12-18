'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@vayva/ui';

export default function AdminWebhooksPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [replaying, setReplaying] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/admin/webhooks')
            .then(res => res.json())
            .then(data => {
                setEvents(data.events || []);
                setLoading(false);
            });
    }, []);

    const handleReplay = async (eventId: string, providerEventId: string) => {
        if (!confirm('Replaying this event will re-trigger handlers. Continue?')) return;
        setReplaying(eventId);
        try {
            const res = await fetch('/api/admin/webhooks/replay', {
                method: 'POST',
                body: JSON.stringify({ event_id: providerEventId })
            });
            if (res.ok) {
                alert('Replay triggered successfully');
                // Refresh list
            } else {
                alert('Replay failed');
            }
        } finally {
            setReplaying(null);
        }
    };

    if (loading) return <div className="p-8">Loading webhook logs...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Webhook Logs</h1>

            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-bold text-gray-500">Provider / ID</th>
                            <th className="px-6 py-3 font-bold text-gray-500">Type</th>
                            <th className="px-6 py-3 font-bold text-gray-500">Status</th>
                            <th className="px-6 py-3 font-bold text-gray-500">Received</th>
                            <th className="px-6 py-3 font-bold text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {events.map((evt) => (
                            <tr key={evt.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-xs">
                                    <div className="font-bold text-gray-900 uppercase">{evt.provider}</div>
                                    <div className="text-gray-500">{evt.eventId}</div>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">
                                    {evt.eventType}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${evt.status === 'failed' ? 'bg-red-100 text-red-600' :
                                            evt.status === 'processed' ? 'bg-green-100 text-green-600' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        {evt.status}
                                    </span>
                                    {evt.error && <div className="text-xs text-red-500 mt-1 max-w-xs truncate">{evt.error}</div>}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(evt.receivedAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleReplay(evt.id, evt.eventId)}
                                        disabled={!!replaying}
                                        className="text-xs font-bold bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-50"
                                    >
                                        {replaying === evt.id ? '...' : 'Replay'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
