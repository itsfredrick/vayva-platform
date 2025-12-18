import React from 'react';
import {
    RefreshCcw,
    ExternalLink,
    AlertTriangle
} from 'lucide-react';

const FAILURES = [
    { id: 'PAY-8821', merchant: 'Gadget World', amount: '₦250,000', bank: 'GTBank', reason: 'Invalid Account Number', retries: 2, date: '10 mins ago' },
    { id: 'PAY-8822', merchant: 'Mama Cassie', amount: '₦12,500', bank: 'Access Bank', reason: 'Bank Network Error', retries: 1, date: '1 hour ago' },
    { id: 'PAY-8823', merchant: 'Lagos Fashion', amount: '₦85,000', bank: 'Zenith Bank', reason: 'Transaction Limit Exceeded', retries: 0, date: '3 hours ago' },
];

export default function PayoutIssuesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Payout Issues</h1>
                    <p className="text-sm text-muted-foreground mt-1">Resolve failed settlements to merchant bank accounts.</p>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr className="text-left">
                            <th className="px-4 py-3 font-medium text-muted-foreground">Payout ID</th>
                            <th className="px-4 py-3 font-medium text-muted-foreground">Merchant</th>
                            <th className="px-4 py-3 font-medium text-muted-foreground">Bank</th>
                            <th className="px-4 py-3 font-medium text-muted-foreground">Amount</th>
                            <th className="px-4 py-3 font-medium text-muted-foreground">Failure Reason</th>
                            <th className="px-4 py-3 font-medium text-muted-foreground">Retries</th>
                            <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {FAILURES.map((f) => (
                            <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{f.id}</td>
                                <td className="px-4 py-3 font-medium">{f.merchant}</td>
                                <td className="px-4 py-3">{f.bank}</td>
                                <td className="px-4 py-3 font-medium">{f.amount}</td>
                                <td className="px-4 py-3 text-red-600 flex items-center gap-1.5">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    {f.reason}
                                </td>
                                <td className="px-4 py-3 pl-8">{f.retries}</td>
                                <td className="px-4 py-3 text-muted-foreground text-xs">{f.date}</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="flex items-center gap-1 text-primary hover:underline text-xs font-medium ml-auto">
                                        <RefreshCcw className="w-3.5 h-3.5" /> Retry
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
