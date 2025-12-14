'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, GlassPanel, Icon } from '@vayva/ui';
import { AuthService } from '@/services/auth';

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await AuthService.register({ name, email, password });
            // Login immediately or ask to verify? 
            // For now, redirect to signin to login
            router.push('/signin?registered=true');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-dark p-4">
            <GlassPanel className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                            <Icon name="Sparkles" className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-text-secondary">Join thousands of merchants growing with Vayva.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Create Password"
                            type="password"
                            placeholder="Min 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>

                    <Button
                        className="w-full h-12 text-lg"
                        type="submit"
                        disabled={loading}
                        variant="primary"
                    >
                        {loading ? 'Creating Account...' : 'Get Started'}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-text-secondary">
                    Already have an account?{' '}
                    <Link href="/signin" className="text-primary hover:underline font-bold">
                        Sign in
                    </Link>
                </div>
            </GlassPanel>
        </div>
    );
}
