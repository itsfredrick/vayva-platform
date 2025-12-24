'use client';

import React, { useState } from 'react';
import { Button, Icon, cn, Input } from '@vayva/ui';
import { useOnboarding } from '@/context/OnboardingContext';

// Master Prompt Step 10: KYC (Expanded)
// Method Comparison: Speed, Req, Data
// Failure Recovery: Neutral Language, Retry
// Trust: Encryption notices

type Method = 'bvn' | 'nin' | 'govt_id';
type Status = 'idle' | 'submitting' | 'failed' | 'success';

export default function KycPage() {
    const { updateState, goToStep } = useOnboarding();
    const [method, setMethod] = useState<Method>('bvn');
    const [status, setStatus] = useState<Status>('idle');
    const [idNumber, setIdNumber] = useState('');

    const handleSubmit = async () => {
        setStatus('submitting');

        // Simulate API check
        setTimeout(() => {
            // Fake logic: if ID is '0000', fail it for demo
            if (idNumber === '0000') {
                setStatus('failed');
            } else {
                setStatus('success');
            }
        }, 1500);
    };

    const handleContinue = async () => {
        await updateState({
            kycStatus: status === 'success' ? 'verified' : 'pending', // Pending implies awaiting backend
        });
        await goToStep('review');
    };

    return (
        <div className="flex flex-col lg:flex-row h-full gap-8 max-w-6xl mx-auto items-start">
            <div className="flex-1 w-full max-w-lg lg:pt-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your business identity</h1>
                    <p className="text-gray-500">Required for withdrawals. Encrypted & secure.</p>
                </div>

                {status === 'idle' || status === 'submitting' ? (
                    <div className="space-y-6">
                        {/* Method Selection */}
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { id: 'bvn', label: 'BVN', time: 'Instant', req: '11 digits', rcm: true },
                                { id: 'nin', label: 'NIN', time: '~24h', req: 'Slip or number', rcm: false },
                                { id: 'govt_id', label: 'Govt ID', time: 'Manual', req: 'Passport/DL', rcm: false },
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setMethod(opt.id as Method)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                                        method === opt.id
                                            ? "border-black bg-gray-50 shadow-sm"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-5 h-5 rounded-full border flex items-center justify-center",
                                            method === opt.id ? "border-black" : "border-gray-300"
                                        )}>
                                            {method === opt.id && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                                        </div>
                                        <span className="font-bold text-gray-900">{opt.label}</span>
                                        {opt.rcm && <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded">Fastest</span>}
                                    </div>
                                    <div className="text-right text-xs">
                                        <span className={cn("block font-medium", opt.time === 'Instant' ? "text-green-600" : "text-gray-500")}>{opt.time}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Input Field */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <label className="text-sm font-bold text-gray-900 block">
                                Enter {method.toUpperCase()} Number
                            </label>
                            <Input
                                disabled={status === 'submitting'}
                                value={idNumber}
                                onChange={(e) => setIdNumber(e.target.value)}
                                placeholder={method === 'bvn' ? '222...' : 'Enter ID number'}
                                className="tracking-widest font-mono"
                            />

                            <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 p-2 rounded">
                                <Icon name="Lock" size={12} />
                                <span>Encrypted with AES-256. Never shared with customers.</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleSubmit}
                            disabled={!idNumber || status === 'submitting'}
                            className="!bg-black text-white h-12 w-full rounded-xl text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            {status === 'submitting' ? (
                                <>
                                    <Icon name="Loader" className="animate-spin" size={18} /> Verifying...
                                </>
                            ) : (
                                "Verify Identity"
                            )}
                        </Button>
                    </div>
                ) : status === 'failed' ? (
                    // Failure Recovery UX
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center animate-in zoom-in-95">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="X" size={32} />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">We couldn't verify that ID</h3>
                        <p className="text-sm text-gray-600 mb-6 max-w-xs mx-auto">
                            The number didn't match our records. Please double-check for typos or try a different ID method.
                        </p>

                        <div className="flex flex-col gap-3">
                            <Button onClick={() => setStatus('idle')} className="w-full bg-red-600 hover:bg-red-700 text-white">
                                Try Again
                            </Button>
                            <Button onClick={handleContinue} variant="ghost" className="text-gray-500 hover:text-black">
                                Skip Verification (Limited Access)
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Success State
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center animate-in zoom-in-95">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="Check" size={32} />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Identity Verified</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            You're all set to accept payments and withdraw funds.
                        </p>
                        <Button onClick={handleContinue} className="w-full bg-black text-white">
                            Continue Setup
                        </Button>
                    </div>
                )}
            </div>

            {/* Compliance Badge */}
            <div className="hidden lg:block flex-1 w-full sticky top-24">
                <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-3xl p-8 text-white relative overflow-hidden">
                    <Icon name="Shield" className="absolute -bottom-8 -right-8 w-48 h-48 text-white/5" />
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-4">Why we need this</h3>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li className="flex gap-3">
                                <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center shrink-0">
                                    <Icon name="Landmark" size={14} />
                                </div>
                                <span>Regulatory compliance for financial services</span>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center shrink-0">
                                    <Icon name="UserCheck" size={14} />
                                </div>
                                <span>Prevents identity fraud and protects your account</span>
                            </li>
                        </ul>

                        <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
                            <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-[10px] font-bold border border-green-500/30">
                                AES-256
                            </div>
                            <span className="text-xs text-gray-400">Bank-grade encryption</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
