"use client";

import { Button, Icon, Badge, EmptyState } from "@vayva/ui";
import { formatCurrency } from "@/lib/formatters";
import { useState, useEffect } from "react";
import { WithdrawModal } from "@/components/finance/WithdrawModal";
import { Skeleton } from "@/components/LoadingSkeletons";
import { format } from "date-fns";

export default function FinancePage() {
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [wallet, setWallet] = useState({
        balance: 0.00,
        pending: 0.00,
        currency: 'NGN'
    });

    const fetchData = async () => {
        try {
            const [txRes, walletRes] = await Promise.all([
                fetch("/api/finance/transactions?limit=10"),
                fetch("/api/finance/wallet")
            ]);

            const txData = await txRes.json();
            const walletData = await walletRes.json();

            if (txData.success && Array.isArray(txData.data)) {
                setTransactions(txData.data);
            }

            if (walletData && !walletData.error) {
                setWallet(walletData);
            }
        } catch (e) {
            console.error("Failed to load finance data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Finance & Wallet 💳</h1>
                    <p className="text-gray-500 text-sm">Manage your earnings and payouts.</p>
                </div>
                <Button onClick={() => setIsWithdrawModalOpen(true)} className="bg-black text-white hover:bg-gray-800 rounded-xl">
                    <Icon name="ArrowUpRight" className="mr-2" size={16} />
                    Withdraw Funds
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-black text-white rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="relative z-10">
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Available Balance</p>
                        <h2 className="text-4xl font-bold mb-6 font-mono">{formatCurrency(wallet.balance)}</h2>
                        <div className="flex gap-3">
                            <Badge variant="success" className="bg-green-500/20 text-green-300 border-green-500/20">
                                Active
                            </Badge>
                            <span className="text-xs text-gray-400 flex items-center">
                                <Icon name="ShieldCheck" size={14} className="mr-1" /> Fully Secure
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Pending Clearance</p>
                            <h2 className="text-2xl font-bold text-gray-900">{formatCurrency(wallet.pending)}</h2>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                            <Icon name="Clock" size={20} />
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-auto">
                        Funds from recent orders are held for 24-48 hours before becoming available for withdrawal.
                    </p>
                </div>
            </div>

            {/* Wallet Funding details */}
            {(wallet as any).account_number && (
                <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                            <Icon name="Wallet" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-indigo-900">Fund Your Wallet</h3>
                            <p className="text-sm text-indigo-600/80">Transfer to this dedicated account to top up instantly.</p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8 text-center md:text-left">
                        <div>
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Bank Name</p>
                            <p className="font-mono font-bold text-xl text-indigo-900">{(wallet as any).bank_name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Account Number</p>
                            <p className="font-mono font-bold text-xl text-indigo-900 tracking-wider">{(wallet as any).account_number}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Account Name</p>
                            <p className="font-mono font-bold text-xl text-indigo-900">{(wallet as any).account_name}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <h3 className="font-bold text-lg text-gray-900">Transaction History</h3>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-black">View All</Button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="p-6 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-6 w-16" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && transactions.length === 0 && (
                    <div className="p-12">
                        <EmptyState
                            title="No transactions yet"
                            icon="Banknote"
                            description="Your earnings and payouts will appear here once you start selling."
                        />
                    </div>
                )}

                {/* Data Table */}
                {!loading && transactions.length > 0 && (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map((tx: any) => (
                                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">
                                        {format(new Date(tx.date || new Date()), "MMM d, yyyy")}
                                        <div className="text-xs text-gray-400 mt-0.5">
                                            {format(new Date(tx.date || new Date()), "h:mm a")}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{tx.order}</div>
                                        <div className="text-xs text-gray-500">{tx.customer}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={tx.status === 'paid' ? 'success' : tx.status === 'pending' ? 'warning' : 'default'} className="uppercase text-[10px]">
                                            {tx.status}
                                        </Badge>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-mono font-medium ${tx.type === 'debit' ? 'text-red-500' : 'text-green-600'}`}>
                                        {tx.type === 'debit' ? '-' : '+'}{formatCurrency(tx.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <WithdrawModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                availableBalance={wallet.balance}
                onSuccess={fetchData}
            />
        </div>
    );
}
