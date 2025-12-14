'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@vayva/ui';
import { Input } from '@vayva/ui';
import { authClient } from '@/lib/auth-client';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!token) {
            setError('Invalid or missing token.');
            return;
        }

        try {
            await authClient.resetPassword({ token, newPassword: password });
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center">
                <h1 className="text-3xl font-bold text-[#1d1d1f] mb-4">Password Reset</h1>
                <p className="text-[#1d1d1f]/60 mb-8">Your password has been successfully updated.</p>
                <Link href="/auth/signin">
                    <Button className="w-full h-14 bg-[#1d1d1f] text-white font-bold rounded-xl">
                        Sign In Now
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#1d1d1f] mb-2">New Password</h1>
                <p className="text-[#1d1d1f]/60">Create a secure password for your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-xl text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <Input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className="h-12 bg-white/50 border-transparent focus:border-[#46EC13]/50 rounded-xl text-base"
                    />
                </div>

                <Button
                    className="w-full h-14 bg-[#1d1d1f] hover:bg-[#1d1d1f]/90 text-white font-bold text-lg rounded-xl shadow-lg mt-4"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Password'}
                </Button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
