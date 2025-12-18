'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@vayva/ui';
import { formatMoneyNGN } from '@/lib/billing/formatters';

export default function DisputesPage() {
    const [disputes, setDisputes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock or Real API
        // For V1 we assume an API exists to list disputes, or we mock here for UI dev
        // fetch('/api/merchant/disputes').then(...)
        // Let's create the API first or Mock data here
        setLoading(false);
        setDisputes([
            {
                id: 'd1',
                reason: 'Fraudulent Transaction',
                amountNgn: 15000,
                status: 'evidence_required',
                deadlineAt: new Date(Date.now() + 86400000).toISOString(),
                providerDisputeId: 'DSP_123'
            }
        ]);
    }, []);

    const getStatusColor = (s: string) => {
        if (s === 'won') return 'bg-green-100 text-green-700';
        if (s === 'lost') return 'bg-red-100 text-red-700';
        if (s === 'evidence_required') return 'bg-yellow-100 text-yellow-700 animate-pulse';
        return 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Disputes & Chargebacks</h1>

            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-bold text-gray-500">ID</th>
                            <th className="p-4 font-bold text-gray-500">Reason</th>
                            <th className="p-4 font-bold text-gray-500">Amount</th>
                            <th className="p-4 font-bold text-gray-500">Status</th>
                            <th className="p-4 font-bold text-gray-500">Deadline</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {disputes.map(d => (
                            <tr key={d.id} className="hover:bg-gray-50">
                                <td className="p-4 text-xs font-mono">{d.providerDisputeId}</td>
                                <td className="p-4 font-bold">{d.reason}</td>
                                <td className="p-4">{formatMoneyNGN(d.amountNgn)}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(d.status)}`}>{d.status.replace('_', ' ')}</span></td>
                                <td className="p-4 text-sm font-bold text-red-600">
                                    {d.deadlineAt && new Date(d.deadlineAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <button className="bg-white border hover:bg-gray-50 border-gray-300 text-sm font-bold px-3 py-1 rounded">
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {disputes.length === 0 && !loading && (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-400">No active disputes 🛡️</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
