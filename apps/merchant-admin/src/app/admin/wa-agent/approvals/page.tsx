'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { WaAgentService, WaApproval } from '@/services/wa-agent';
import { Button, Icon } from '@vayva/ui';

export default function ApprovalsPage() {
    const [approvals, setApprovals] = useState<WaApproval[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await WaAgentService.getApprovals();
            setApprovals(data);
            setIsLoading(false);
        };
        load();
    }, []);

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        await WaAgentService.actionApproval(id, action);
        setApprovals(prev => prev.filter(a => a.id !== id));
        alert(`Action ${action}d!`);
    };

    return (
        <AdminShell title="Approvals" breadcrumb="WhatsApp Agent">
            <div className="flex flex-col gap-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Request</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Risk Level</th>
                                <th className="px-6 py-4">Time</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-6 text-center text-gray-400">Loading approvals...</td></tr>
                            ) : approvals.length === 0 ? (
                                <tr><td colSpan={5} className="p-12 text-center text-gray-400">No pending approvals. Good job!</td></tr>
                            ) : (
                                approvals.map(approval => (
                                    <tr key={approval.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#0B0B0B] capitalize">{approval.type.replace('_', ' ')}</span>
                                                <span className="text-xs text-gray-500">{approval.description}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[#0B0B0B]">{approval.customerName}</td>
                                        <td className="px-6 py-4">
                                            <span className={
                                                approval.risk === 'high' ? "text-red-600 font-bold uppercase text-xs" :
                                                    approval.risk === 'medium' ? "text-orange-600 font-bold uppercase text-xs" :
                                                        "text-green-600 font-bold uppercase text-xs"
                                            }>
                                                {approval.risk}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">{new Date(approval.createdTime).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleAction(approval.id, 'reject')}>Reject</Button>
                                                <Button size="sm" className="bg-black text-white hover:bg-gray-800" onClick={() => handleAction(approval.id, 'approve')}>Approve</Button>
                                            </div>
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
