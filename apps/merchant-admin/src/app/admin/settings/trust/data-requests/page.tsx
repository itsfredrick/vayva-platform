'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';

export default function DataRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/compliance/requests');
            setRequests(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <AdminShell title="Data Privacy Requests" breadcrumb="Trust Center">
            <div className="max-w-5xl mx-auto flex flex-col gap-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0B0B0B]">Data Requests</h1>
                        <p className="text-[#525252]">Handle Subject Access Requests (SAR) and Deletion requests.</p>
                    </div>
                    <Button variant="outline"><Icon name="Plus" size={16} className="mr-2" /> Log Request</Button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Requester</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Submitted</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-12 text-center text-gray-400">Loading...</td></tr>
                            ) : requests.length === 0 ? (
                                <tr><td colSpan={5} className="p-12 text-center text-gray-400">No pending data requests.</td></tr>
                            ) : (
                                requests.map(req => (
                                    <tr key={req.id}>
                                        <td className="px-6 py-4 font-medium text-[#0B0B0B]">
                                            {req.requesterType === 'CUSTOMER' ? 'Customer' : 'Staff'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                                {req.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                                                req.status === 'SUBMITTED' ? "bg-blue-50 text-blue-600" :
                                                    req.status === 'COMPLETED' ? "bg-green-50 text-green-600" :
                                                        "bg-gray-50 text-gray-500"
                                            )}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[#525252]">{new Date(req.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm">Review</Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Rights Explanation */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-[#0B0B0B] mb-4">Handling Data Rights (NDPR/GDPR)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#525252]">
                        <div className="flex gap-4">
                            <div className="p-2 bg-blue-50 text-blue-600 h-fit rounded-lg"><Icon name="Download" size={18} /></div>
                            <div>
                                <h4 className="font-bold text-[#0B0B0B] mb-1">Right to Portability (Export)</h4>
                                <p>Provide customers with their personal data in a machine-readable format.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="p-2 bg-red-50 text-red-600 h-fit rounded-lg"><Icon name="Trash" size={18} /></div>
                            <div>
                                <h4 className="font-bold text-[#0B0B0B] mb-1">Right to Erasure (Delete)</h4>
                                <p>Delete or anonymize customer personal data while keeping financial records.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AdminShell>
    );
}
