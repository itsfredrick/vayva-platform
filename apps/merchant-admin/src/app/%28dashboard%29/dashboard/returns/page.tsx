'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@vayva/ui';

export default function ReturnsPage() {
    const [returns, setReturns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock Data for UI V1
        // In prod: fetch('/api/merchant/returns')
        setLoading(false);
        setReturns([
            {
                id: 'r1',
                orderId: 'ORD-5521',
                customerPhone: '+2348012345678',
                reason: 'Wrong Size',
                status: 'requested',
                items: [{ qty: 1, name: 'Nike Air Max' }],
                createdAt: new Date().toISOString()
            },
            {
                id: 'r2',
                orderId: 'ORD-9988',
                customerPhone: '+2348099999999',
                reason: 'Damaged',
                status: 'approved',
                pickupMethod: 'dropoff',
                createdAt: new Date(Date.now() - 86400000).toISOString()
            }
        ]);
    }, []);

    const getStatusBadge = (s: string) => {
        const map: any = {
            requested: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-blue-100 text-blue-800',
            received: 'bg-purple-100 text-purple-800',
            completed: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        return map[s] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Returns (RMA)</h1>

            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-bold text-gray-500">Order</th>
                            <th className="p-4 font-bold text-gray-500">Customer</th>
                            <th className="p-4 font-bold text-gray-500">Reason</th>
                            <th className="p-4 font-bold text-gray-500">Status</th>
                            <th className="p-4 font-bold text-gray-500">Date</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {returns.map(r => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="p-4 font-mono text-sm">{r.orderId}</td>
                                <td className="p-4">{r.customerPhone}</td>
                                <td className="p-4 font-medium">{r.reason}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusBadge(r.status)}`}>{r.status}</span></td>
                                <td className="p-4 text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 text-right">
                                    <button className="bg-white border hover:bg-gray-50 text-sm font-bold px-3 py-1 rounded">
                                        Manage
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
