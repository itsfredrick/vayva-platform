'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/AuthShell';
import { TextField } from '@/components/auth/TextField';
import { MagneticButton } from '@/components/MagneticButton';
import { ROUTES } from '@/lib/routes';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
        setIsSent(true);
    };

    if (isSent) {
        return (
            <AuthShell
                title="Check your email"
                subtitle="We've sent password reset instructions to your email."
                topRightLink={{ label: "Back to Login", href: ROUTES.login }}
            >
                <div className="bg-white/60 p-6 rounded-xl border border-[#22C55E]/20 text-center">
                    <div className="w-12 h-12 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-gray-600 mb-6">
                        If an account exists for that email, you will receive a reset link shortly.
                    </p>
                    <MagneticButton asChild className="w-full !rounded-xl !bg-[#22C55E] !text-white">
                        <Link href={ROUTES.login}>Return to Login</Link>
                    </MagneticButton>
                </div>
            </AuthShell>
        );
    }

    return (
        <AuthShell
            title="Reset your password"
            subtitle="Enter your email to receive reset instructions."
            topRightLink={{ label: "Back to Login", href: ROUTES.login }}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                />

                <div className="pt-2">
                    <MagneticButton className="w-full !rounded-xl !text-base !py-3 bg-[#0B1220] hover:brightness-125 text-white shadow-xl shadow-slate-900/10">
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending link...
                            </span>
                        ) : (
                            "Send Reset Link"
                        )}
                    </MagneticButton>
                </div>
            </form>
        </AuthShell>
    );
}
