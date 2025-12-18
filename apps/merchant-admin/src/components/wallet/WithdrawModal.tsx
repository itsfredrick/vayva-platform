'use client';

import React, { useState } from 'react';
import { Button, Icon, cn } from '@vayva/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@/context/WalletContext';
import { WalletService, BankAccount } from '@/services/wallet';

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WithdrawModal = ({ isOpen, onClose }: WithdrawModalProps) => {
    const { summary, refreshWallet } = useWallet();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [amount, setAmount] = useState('');
    const [bankId, setBankId] = useState('');
    const [pin, setPin] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [withdrawalId, setWithdrawalId] = useState<string | null>(null);

    const [banks, setBanks] = useState<BankAccount[]>([]);

    React.useEffect(() => {
        if (isOpen) {
            WalletService.getBanks().then(setBanks);
            setStep(1);
            setAmount('');
            setPin('');
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleNext = () => {
        setError(null);
        setStep(prev => (prev + 1) as any);
    };

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);
        try {
            const wId = await WalletService.initiateWithdrawal(Number(amount), bankId, pin);
            setWithdrawalId(wId);
            setStep(3);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to initiate withdrawal');
        } finally {
            setLoading(false);
        }
    };

    const handleFinalize = async () => {
        if (!withdrawalId) return;
        setLoading(true);
        setError(null);
        try {
            await WalletService.confirmWithdrawal(withdrawalId, otp);
            await refreshWallet();
            onClose();
            // In a real app, use a Toast
            alert('Withdrawal Successful! Funds will be settled shortly.');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={handleBackdropClick}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="font-bold text-[#0B0B0B]">Withdraw Funds</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-black">
                        <Icon name="X" size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <AnimatePresence mode="wait">

                        {/* STEP 1: Details */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col gap-4"
                            >
                                <div className="p-3 bg-blue-50 rounded-lg flex items-center gap-3 text-sm text-blue-700">
                                    <Icon name="Info" size={16} />
                                    <span>Available Balance: ₦ {summary?.availableBalance.toLocaleString() || '0.00'}</span>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-[#525252]">Amount (₦)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-[#525252]">Select Destination Bank</label>
                                    <select
                                        className="h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 bg-white"
                                        value={bankId}
                                        onChange={e => setBankId(e.target.value)}
                                    >
                                        <option value="">Select a bank account</option>
                                        {banks.map(b => (
                                            <option key={b.id} value={b.id}>
                                                {b.bankName} - {b.accountNumber} ({b.accountName})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {error && <p className="text-red-500 text-xs">{error}</p>}

                                <Button
                                    className="w-full mt-2"
                                    disabled={!amount || !bankId}
                                    onClick={handleNext}
                                >
                                    Continue
                                </Button>
                            </motion.div>
                        )}

                        {/* STEP 2: Confirm & PIN */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col gap-6"
                            >
                                <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Amount</span>
                                        <span className="font-bold text-[#0B0B0B]">₦ {Number(amount).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Fee</span>
                                        <span className="font-bold text-[#0B0B0B]">₦ 50.00</span>
                                    </div>
                                    <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                                        <span className="font-bold">Total Debit</span>
                                        <span className="font-bold text-[#0B0B0B]">₦ {(Number(amount) + 50).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-[#525252]">Enter Wallet PIN to Authorize</label>
                                    <input
                                        type="password"
                                        maxLength={4}
                                        placeholder="••••"
                                        className="h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 text-center tracking-[0.5em] font-bold"
                                        value={pin}
                                        onChange={e => setPin(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                {error && <p className="text-red-500 text-xs">{error}</p>}

                                <Button
                                    className="w-full"
                                    disabled={pin.length !== 4 || loading}
                                    onClick={handleConfirm}
                                >
                                    {loading ? 'Processing...' : 'Send OTP'}
                                </Button>
                            </motion.div>
                        )}

                        {/* STEP 3: OTP */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col gap-6 text-center"
                            >
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                                    <Icon name="Mail" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#0B0B0B]">Verify Withdrawal</h4>
                                    <p className="text-xs text-gray-500 mt-1">We sent a 6-digit code to your email.</p>
                                </div>

                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    className="h-12 text-center text-xl tracking-[0.5em] font-bold border-b-2 border-gray-200 focus:outline-none focus:border-black bg-transparent w-full"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    autoFocus
                                />

                                {error && <p className="text-red-500 text-xs">{error}</p>}

                                <Button
                                    className="w-full"
                                    disabled={otp.length !== 6 || loading}
                                    onClick={handleFinalize}
                                >
                                    {loading ? 'Verifying...' : 'Confirm Withdrawal'}
                                </Button>

                                <button className="text-xs text-blue-600 hover:underline">Resend Code</button>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};
