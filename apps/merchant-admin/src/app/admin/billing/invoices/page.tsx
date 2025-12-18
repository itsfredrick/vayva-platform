'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<any[]>([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            const res = await api.get('/billing/invoices');
            setInvoices(res.data || []);
        };
        fetchInvoices();
    }, []);

    return (
        <AdminShell title="Invoices" breadcrumb="Billing">
            <div className="max-w-5xl mx-auto flex flex-col gap-8">

                <div>
                    <h1 className="text-2xl font-bold text-[#0B1220] mb-2">Invoices & Receipts</h1>
                    <p className="text-[#525252]">View and download your billing history.</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Invoice #</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {invoices.length === 0 ? (
                                <tr><td colSpan={5} className="p-12 text-center text-gray-400">No invoices yet.</td></tr>
                            ) : (
                                invoices.map(invoice => (
                                    <tr key={invoice.id}>
                                        <td className="px-6 py-4 font-medium text-[#0B1220]">{invoice.number}</td>
                                        <td className="px-6 py-4 text-[#525252]">
                                            {new Date(invoice.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-[#525252]">
                                            ₦{invoice.amountDue}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "text-xs font-bold uppercase px-2 py-0.5 rounded",
                                                invoice.status === 'PAID' ? "bg-green-50 text-green-600" :
                                                    invoice.status === 'OPEN' ? "bg-blue-50 text-blue-600" :
                                                        "bg-gray-50 text-gray-500"
                                            )}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {invoice.hostedInvoiceUrl && (
                                                <a href={invoice.hostedInvoiceUrl} target="_blank" rel="noopener noreferrer">
                                                    <Button variant="ghost" size="sm">
                                                        <Icon name="ExternalLink" size={14} className="mr-1" />
                                                        View
                                                    </Button>
                                                </a>
                                            )}
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
