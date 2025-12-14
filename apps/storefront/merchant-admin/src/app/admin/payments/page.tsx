'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, Button, GlassPanel, StatusChip } from '@vayva/ui';
import { PaymentService, PaymentTransaction } from '@/services/payments';
import { useAuth } from '@/context/AuthContext';

export default function PaymentsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        PaymentService.listTransactions()
            .then(setTransactions)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <AppShell
            title="Payments"
            breadcrumbs={[{ label: 'Payments', href: '/admin/payments' }]}
            profile={{ name: user?.name || '', email: user?.email || '' }}
            storeName="Store"
            onLogout={() => router.push('/signin')}
        >
            <div className="flex justify-end mb-6 gap-3">
                <Button variant="secondary" onClick={() => router.push('/admin/payments/payouts')}>
                    View Payouts
                </Button>
            </div>

            <GlassPanel className="p-0 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-sm font-medium text-text-secondary">Reference</th>
                            <th className="p-4 text-sm font-medium text-text-secondary">Date</th>
                            <th className="p-4 text-sm font-medium text-text-secondary">Order</th>
                            <th className="p-4 text-sm font-medium text-text-secondary">Customer</th>
                            <th className="p-4 text-sm font-medium text-text-secondary">Amount</th>
                            <th className="p-4 text-sm font-medium text-text-secondary">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="p-8 text-center text-text-secondary">Loading transactions...</td></tr>
                        ) : transactions.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-text-secondary">No transactions found.</td></tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white font-mono text-sm">{tx.reference}</td>
                                    <td className="p-4 text-text-secondary">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <button onClick={() => router.push(`/admin/orders/${tx.order.id}`)} className="text-primary hover:underline">
                                            #{tx.order.id.substring(0, 8)}
                                        </button>
                                    </td>
                                    <td className="p-4 text-white">{tx.order.customer?.name || 'Guest'}</td>
                                    <td className="p-4 text-white font-bold">{tx.currency} {tx.amount.toLocaleString()}</td>
                                    <td className="p-4"><StatusChip status={tx.status} /></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </GlassPanel>
        </AppShell>
    );
}
