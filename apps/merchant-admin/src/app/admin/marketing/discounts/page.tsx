'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';

export default function DiscountsPage() {
    const [rules, setRules] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateDrawer, setShowCreateDrawer] = useState(false);

    const fetchRules = async () => {
        try {
            const res = await api.get('/marketing/discounts/rules');
            setRules(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    return (
        <AdminShell title="Discounts" breadcrumb="Marketing">
            <div className="max-w-5xl mx-auto flex flex-col gap-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0B1220]">Discount Rules</h1>
                        <p className="text-[#525252]">Create coupons and automatic discounts.</p>
                    </div>
                    <Button onClick={() => setShowCreateDrawer(true)}>
                        <Icon name="Plus" size={16} className="mr-2" />
                        Create Discount
                    </Button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Value</th>
                                <th className="px-6 py-4">Active Period</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan={6} className="p-12 text-center text-gray-400">Loading...</td></tr>
                            ) : rules.length === 0 ? (
                                <tr><td colSpan={6} className="p-12 text-center text-gray-400">No discount rules yet.</td></tr>
                            ) : (
                                rules.map(rule => (
                                    <tr key={rule.id}>
                                        <td className="px-6 py-4 font-medium text-[#0B1220]">{rule.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold uppercase bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                                {rule.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[#525252]">
                                            {rule.type === 'PERCENT' ? `${rule.valuePercent}%` :
                                                rule.type === 'AMOUNT' ? `₦${rule.valueAmount}` : 'Free Shipping'}
                                        </td>
                                        <td className="px-6 py-4 text-[#525252]">
                                            {new Date(rule.startsAt).toLocaleDateString()} - {rule.endsAt ? new Date(rule.endsAt).toLocaleDateString() : 'Ongoing'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold uppercase bg-green-50 text-green-600 px-2 py-0.5 rounded">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </AdminShell>
    );
}
