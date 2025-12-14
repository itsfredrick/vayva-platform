'use client';

import { Button, GlassPanel } from '@vayva/ui';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-dark p-4">
            <GlassPanel className="w-full max-w-2xl p-12 text-center">
                <div className="mb-8">
                    {/* Illustration placeholder */}
                    <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🏪</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Let's set up your store</h1>
                    <p className="text-xl text-text-secondary max-w-lg mx-auto">
                        Complete a few simple steps to launch your Vayva store and start selling.
                    </p>
                </div>

                <Button
                    size="lg"
                    variant="primary"
                    className="h-14 px-8 text-lg"
                    onClick={() => router.push('/onboarding/store-details')}
                >
                    Start Setup
                </Button>
            </GlassPanel>
        </div>
    );
}
