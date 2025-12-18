'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { OnboardingState, OnboardingStepId } from '@/types/onboarding';
import { OnboardingService } from '@/services/onboarding';
import { useRouter } from 'next/navigation';

interface OnboardingContextType {
    state: OnboardingState | null;
    loading: boolean;
    updateState: (data: Partial<OnboardingState>) => Promise<void>;
    goToStep: (step: OnboardingStepId) => Promise<void>;
    completeOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<OnboardingState | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadState();
    }, []);

    const loadState = async () => {
        try {
            const data = await OnboardingService.getState();
            setState(data);
        } catch (error) {
            console.error('Failed to load onboarding state:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateState = async (data: Partial<OnboardingState>) => {
        if (!state) return;

        const newState = { ...state, ...data };
        setState(newState);

        // Persist
        await OnboardingService.saveStep(newState.currentStep, data);
    };

    const goToStep = async (step: OnboardingStepId) => {
        if (!state) return;

        // Update current step in state
        await updateState({ currentStep: step });

        // Route to page
        router.push(`/onboarding/${step}`);
    };

    const completeOnboarding = async () => {
        await OnboardingService.complete();
        router.push('/admin');
    };

    return (
        <OnboardingContext.Provider value={{
            state,
            loading,
            updateState,
            goToStep,
            completeOnboarding
        }}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}
