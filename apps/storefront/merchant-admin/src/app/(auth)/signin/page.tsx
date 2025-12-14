'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Input, GlassPanel, Icon } from '@vayva/ui';
import { useAuth } from '@/context/AuthContext';
import { AuthService } from '@/services/auth';

export default function SigninPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await AuthService.login({ email, password });
            login(data.token, data.user);
            // AuthContext handles redirect
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-dark p-4">
            <GlassPanel className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                            <Icon name="Store" className="text-black" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-text-secondary">Sign in to manage your Vayva store.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div className="space-y-2">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="flex justify-end">
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-sm text-text-secondary hover:text-white transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                    </div>

                    <Button
                        className="w-full h-12 text-lg"
                        type="submit"
                        disabled={loading}
                        variant="primary"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-text-secondary">
                    New here?{' '}
                    <Link href="/signup" className="text-primary hover:underline font-bold">
                        Create an account
                    </Link>
                </div>
            </GlassPanel>
        </div>
    );
}
