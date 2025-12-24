'use client';

import React, { useState, useEffect } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';

interface Invoice {
    id: string;
    invoiceNumber: string;
    date: string;
    amount: number;
    currency: string;
    status: string;
    pdfUrl: string;
}

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await fetch('/api/billing/invoices');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setInvoices(data.invoices || []);
        } catch (error) {
            console.error('Failed to load invoices', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (pdfUrl: string) => {
        window.open(pdfUrl, '_blank');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
    < Loader2 className = "w-6 h-6 animate-spin text-gray-400" />
            </div >
        );
    }

return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600 mt-1">
                View and download your billing invoices
            </p>
        </div>

        {invoices.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No invoices yet</p>
            </div>
        ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Invoice
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {invoice.invoiceNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {new Date(invoice.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ₦{(invoice.amount / 100).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`
                                            inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                            ${invoice.status === 'PAID' ? 'bg-green-100 text-green-800' : ''}
                                            ${invoice.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                                            ${invoice.status === 'FAILED' ? 'bg-red-100 text-red-800' : ''}
                                        `}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <button
                                        onClick={() => handleDownload(invoice.pdfUrl)}
                                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);
}
