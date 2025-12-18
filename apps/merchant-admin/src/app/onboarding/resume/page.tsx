'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/context/OnboardingContext';

export default function ResumePage() {
    const router = useRouter();
    const { state, loading } = useOnboarding();

    useEffect(() => {
        if (!loading) {
            if (state?.isComplete) {
                // Already done
                router.replace('/admin/dashboard');
            } else if (state?.currentStep) {
                // Resume last step
                router.replace(`/onboarding/${state.currentStep}`);
            } else {
                // Start fresh
                router.replace('/onboarding/welcome');
            }
        }
    }, [state, loading, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center animate-spin">
                    <span className="text-white font-bold text-xl">V</span>
                </div>
                <p className="text-gray-500 font-medium">Resuming setup...</p>
            </div>
        </div>
    );
}
