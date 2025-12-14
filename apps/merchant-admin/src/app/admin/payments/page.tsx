'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, Button, GlassPanel, StatusChip, EmptyState } from '@vayva/ui';
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
                {loading ? (
                    <div className="p-12 text-center text-text-secondary animate-pulse">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                    <div className="p-8">
                        <EmptyState
                            title="No Payments Yet"
                            description="No transactions found for your store."
                            icon="credit_card" // assuming credit card icon exists
                        />
                    </div>
                ) : (
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
                            {transactions.map((tx) => (
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
                            ))}
                        </tbody>
                    </table>
                )}
            </GlassPanel>
        </AppShell>
    );
}
