import React from 'react';
import { MessageSquare, AlertTriangle, Ban } from 'lucide-react';

const FLAGS = [
    { id: 1, merchant: 'Spam King', issue: 'Bulk messaging abuse', severity: 'High', detected: '2 mins ago' },
    { id: 2, merchant: 'Loan Shark', issue: 'Prohibited keyword "Loan"', severity: 'Critical', detected: '1 hour ago' },
    { id: 3, merchant: 'Crypto Bot', issue: 'Automated response loop', severity: 'Medium', detected: '3 hours ago' },
];

export default function WaCompliancePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">WhatsApp Compliance</h1>
                    <p className="text-sm text-muted-foreground mt-1">Monitor AI agent behavior and policy violations.</p>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr className="text-left">
                            <th className="px-4 py-3 font-medium text-muted-foreground">Merchant</th>
                            <th className="px-4 py-3 font-medium text-muted-foreground">Violation</th>
                            <th className="px-4 py-3 font-medium text-muted-foreground">Severity</th>
                            <th className="px-4 py-3 font-medium text-muted-foreground">Detected</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {FLAGS.map((flag) => (
                            <tr key={flag.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-3 font-medium">{flag.merchant}</td>
                                <td className="px-4 py-3">{flag.issue}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                         ${flag.severity === 'High' || flag.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {flag.severity}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">{flag.detected}</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-end gap-1 ml-auto">
                                        <Ban className="w-3.5 h-3.5" /> Disable Agent
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
