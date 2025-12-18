'use client';

import React, { useState } from 'react';
import { Button, Input, Icon } from '@vayva/ui';
import { useOnboarding } from '@/context/OnboardingContext';

export default function KYCPage() {
    const { updateState, goToStep } = useOnboarding();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        bvn: '',
        nin: ''
    });

    const [verified, setVerified] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { PaymentService } = await import('@/services/payments');
            const result = await PaymentService.submitKyc(formData.nin, formData.bvn);

            await updateState({
                kyc: {
                    status: result.status, // Should be PENDING
                    ninLast4: formData.nin.slice(-4),
                    bvnLast4: formData.bvn.slice(-4)
                }
            });

            await goToStep('review');
        } catch (error) {
            console.error('KYC Submission Error:', error);
            // In a real app, show error toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black mb-2">Identity Verification</h1>
                <p className="text-gray-600">Required by CBN regulations to operate a merchant account.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">

                <div className="space-y-4">
                    <Input
                        label="Bank Verification Number (BVN)"
                        value={formData.bvn}
                        onChange={(e) => setFormData({ ...formData, bvn: e.target.value })}
                        required
                        maxLength={11}
                        placeholder="11-digit number"
                        helperText="Use '11111111111' to test instant verification"
                    />

                    <Input
                        label="National Identity Number (NIN)"
                        value={formData.nin}
                        onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
                        required
                        maxLength={11}
                        placeholder="11-digit number"
                    />
                </div>

                <div className="p-4 bg-gray-50 rounded-xl flex gap-3 text-xs text-gray-500">
                    <Icon name="Lock" size={16} className="shrink-0 mt-0.5" />
                    <p>
                        Your ID information is encrypted and only used for identity verification purposes.
                        It is never shared with third parties without your consent.
                        <a href="/legal/kyc-explainer" target="_blank" className="text-black underline block mt-1">why we ask for this?</a>
                    </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => goToStep('whatsapp')}
                        className="flex-1 text-gray-500 hover:text-black"
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-[2] !bg-black !text-white h-12 rounded-xl"
                        isLoading={loading}
                        disabled={formData.bvn.length !== 11 || formData.nin.length !== 11}
                    >
                        Verify Identity
                        <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
