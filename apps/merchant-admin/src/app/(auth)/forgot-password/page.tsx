'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@vayva/ui';
import { Input } from '@vayva/ui';
import { authClient } from '@/lib/auth-client';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await authClient.forgotPassword({ email });
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center">
                <h1 className="text-3xl font-bold text-[#1d1d1f] mb-4">Check your email</h1>
                <p className="text-[#1d1d1f]/60 mb-8">We have sent a password reset link to <span className="font-bold text-[#1d1d1f]">{email}</span>.</p>
                <Link href="/auth/signin">
                    <Button className="w-full h-14 bg-[#1d1d1f] text-white font-bold rounded-xl">
                        Back to Sign In
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#1d1d1f] mb-2">Reset Password</h1>
                <p className="text-[#1d1d1f]/60">Enter your email to receive instructions.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-xl text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 bg-white/50 border-transparent focus:border-[#46EC13]/50 rounded-xl text-base"
                    />
                </div>

                <Button
                    className="w-full h-14 bg-[#1d1d1f] hover:bg-[#1d1d1f]/90 text-white font-bold text-lg rounded-xl shadow-lg mt-4"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Sending Link...' : 'Send Reset Link'}
                </Button>
            </form>

            <div className="mt-8 text-center text-sm text-[#1d1d1f]/60">
                Remember your password?{' '}
                <Link href="/auth/signin" className="text-[#1d1d1f] hover:underline font-bold">
                    Sign in
                </Link>
            </div>
        </>
    );
}
