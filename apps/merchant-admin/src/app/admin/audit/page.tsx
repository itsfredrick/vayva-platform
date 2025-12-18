'use client';

import React, { useEffect, useState } from 'react';

export default function AdminAuditPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/audit')
            .then(res => res.json())
            .then(data => {
                setLogs(data.logs || []);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8">Loading audit trail...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Global Audit Log</h1>
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-bold text-gray-500">Time</th>
                            <th className="px-6 py-3 font-bold text-gray-500">Action</th>
                            <th className="px-6 py-3 font-bold text-gray-500">Actor</th>
                            <th className="px-6 py-3 font-bold text-gray-500">Target</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                    {new Date(log.createdAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900">{log.action}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    <span className="font-bold">{log.actorType}</span>:{log.actorId}
                                </td>
                                <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                                    {log.targetType}:{log.targetId}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
