"use client";

import React, { useState, useEffect } from 'react';
import { Icon, cn, Button } from '@vayva/ui';
import { WalletBalance, LedgerEntry, Invoice, Settlement, Dispute } from '@vayva/shared';
import { WalletHero } from '@/components/wallet/WalletHero';
import { TransactionList } from '@/components/wallet/TransactionList';
import { PayoutSummary } from '@/components/wallet/PayoutSummary';
import { WithdrawalModal } from '@/components/wallet/WithdrawalModal';
import { SettlementList } from '@/components/wallet/SettlementList';
import { DisputeList } from '@/components/wallet/DisputeList';
import { apiClient } from '@/lib/apiClient';
import { WalletPageSkeleton } from '@/components/LoadingSkeletons';

export default function WalletPage() {
    const [balance, setBalance] = useState<WalletBalance | null>(null);
    const [transactions, setTransactions] = useState<LedgerEntry[]>([]);
    const [settlements, setSettlements] = useState<Settlement[]>([]);
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]); // Keeping invoices for now, though prompt focused on core wallet
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState<'transactions' | 'settlements' | 'disputes'>('transactions');
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [balRes, txnRes, setRes, dispRes] = await Promise.all([
                    apiClient.get('/api/wallet/balance'),
                    apiClient.get('/api/wallet/transactions'),
                    apiClient.get('/api/wallet/settlements'),
                    apiClient.get('/api/wallet/disputes')
                ]);
                setBalance(balRes);
                setTransactions(txnRes);
                setSettlements(setRes);
                setDisputes(dispRes);
            } catch (e) {
                console.error("Failed to load wallet data", e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const TabButton = ({ id, label, icon }: { id: typeof activeTab, label: string, icon: any }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={cn(
                "pb-3 px-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors",
                activeTab === id ? "border-black text-black" : "border-transparent text-gray-400 hover:text-gray-600"
            )}
        >
            <Icon name={icon} size={16} /> {label}
            {/* Badges for attention */}
            {id === 'settlements' && settlements.length > 0 && <span className="bg-yellow-100 text-yellow-700 text-[10px] px-1.5 py-0.5 rounded-full">{settlements.length}</span>}
            {id === 'disputes' && disputes.length > 0 && <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded-full">{disputes.length}</span>}
        </button>
    );

    if (loading) {
        return <WalletPageSkeleton />;
    }

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-gray-900">Wallet</h1>
                    <p className="text-gray-500 text-sm mt-1">Financial truth, settlements, and payouts.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { }} className="hidden sm:flex">
                        Payout Accounts
                    </Button>
                    <Button size="sm" onClick={() => setIsWithdrawModalOpen(true)}>
                        Withdraw Funds
                    </Button>
                </div>
            </div>

            {/* 1. Hero & Status */}
            {/* Removed StatusStrip as it was redundant with Hero updates and new tabs */}
            <WalletHero balance={balance} isLoading={loading} onWithdraw={() => setIsWithdrawModalOpen(true)} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Tabs */}
                    <div className="flex items-center gap-6 border-b border-gray-200 mb-4 overflow-x-auto">
                        <TabButton id="transactions" label="Ledger" icon="List" />
                        <TabButton id="settlements" label="Settlements" icon="Clock" />
                        <TabButton id="disputes" label="Disputes" icon="ShieldAlert" />
                    </div>

                    <div className="min-h-[400px]">
                        {activeTab === 'transactions' && (
                            <TransactionList transactions={transactions} isLoading={loading} />
                        )}

                        {activeTab === 'settlements' && (
                            <SettlementList settlements={settlements} isLoading={loading} />
                        )}

                        {activeTab === 'disputes' && (
                            <DisputeList disputes={disputes} isLoading={loading} />
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <PayoutSummary />

                    {/* Statements */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h4 className="font-bold text-gray-900 text-sm mb-4">Financial Statements</h4>
                        <p className="text-xs text-gray-500 mb-4">Download your monthly transaction history for accounting.</p>
                        <button className="w-full py-2.5 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
                            <Icon name="Download" size={14} /> Download Statement
                        </button>
                    </div>
                </div>
            </div>

            {/* WITHDRAWAL MODAL */}
            {balance && (
                <WithdrawalModal
                    isOpen={isWithdrawModalOpen}
                    onClose={() => setIsWithdrawModalOpen(false)}
                    availableBalance={balance.available}
                    onSuccess={() => {
                        // Refresh data
                        window.location.reload();
                    }}
                />
            )}
        </div>
    );
}
