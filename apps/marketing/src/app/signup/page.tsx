'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/AuthShell';
import { TextField } from '@/components/auth/TextField';
import { Checkbox } from '@/components/auth/Checkbox';
import { MagneticButton } from '@/components/MagneticButton';
import { ROUTES } from '@/lib/routes';

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
    };

    return (
        <AuthShell
            title="Create your account"
            subtitle="Create your store, pick a template, start selling."
            topRightLink={{ label: "Already have an account? Log in", href: ROUTES.login }}
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <TextField
                    label="Full Name"
                    type="text"
                    name="name"
                    placeholder="Adewale Musa"
                    required
                    autoComplete="name"
                />

                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                />

                <div className="space-y-1">
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                        autoComplete="new-password"
                    />
                    <p className="text-xs text-gray-500">Use at least 8 characters.</p>
                </div>

                <TextField
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                />

                <div className="flex items-start pt-2">
                    <Checkbox
                        label={
                            <span className="text-sm text-gray-600">
                                I agree to the <Link href={ROUTES.terms} className="text-[#22C55E] hover:underline">Terms</Link> and <Link href={ROUTES.privacy} className="text-[#22C55E] hover:underline">Privacy Policy</Link>.
                            </span>
                        }
                        id="terms"
                        name="terms"
                        required
                    />
                </div>

                <div className="pt-2">
                    <MagneticButton className="w-full !rounded-xl !text-base !py-3 bg-[#0B1220] hover:brightness-125 text-white shadow-xl shadow-slate-900/10">
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating account...
                            </span>
                        ) : (
                            "Create Account"
                        )}
                    </MagneticButton>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-[#F7FAF7] text-gray-500 font-medium">Or sign up with</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 bg-white px-4 py-3 border border-slate-900/10 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22C55E]/50 transition-all"
                >
                    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M12.0003 20.45c4.6667 0 8.45-3.7833 8.45-8.45 0-.6167-.0667-1.2167-.1833-1.8H12.0003v3.3167h4.75c-.2 1.1-.8 2.0333-1.7 2.65l2.7667 2.15c1.6167-1.5 2.55-3.7 2.55-6.2167 0-4.6667-3.7833-8.45-8.45-8.45-2.6167 0-4.8167 1.55-5.91667 3.8333L3.08363 4.96667C4.2003 2.76667 7.8503 1.25 12.0003 1.25z" fill="#EA4335" />
                    </svg>
                    Google
                </button>
            </form>
        </AuthShell>
    );
}
