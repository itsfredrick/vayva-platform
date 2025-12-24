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
    handleSaveExit: () => void;
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
            // Race between actual load and a safety timeout
            // This ensures we never get stuck on "Loading setup..." for more than 2 seconds
            const dataPromise = OnboardingService.getState();
            const timeoutPromise = new Promise<OnboardingState>((resolve) => {
                setTimeout(() => {
                    console.warn('Onboarding state load timed out, using default');
                    resolve(OnboardingService.getState()); // Fallback to default state generator
                }, 2000);
            });

            const data = await Promise.race([dataPromise, timeoutPromise]);

            // Fetch user data from auth to pre-populate business name
            try {
                const response = await fetch('/api/auth/merchant/me', {
                    credentials: 'include'
                });
                if (response.ok) {
                    const userData = await response.json();
                    // Merge user's businessName into onboarding state if not already set
                    if (userData.user?.businessName && !data.business?.name) {
                        data.business = {
                            name: userData.user.businessName,
                            email: userData.user?.email || '',
                            category: data.business?.category || '',
                            location: data.business?.location || { city: '', state: '' },
                            ...data.business
                        };
                    }
                }
            } catch (error) {
                console.warn('Could not fetch user data for onboarding:', error);
            }

            setState(data);
        } catch (error) {
            console.error('Failed to load onboarding state:', error);
            // Even on error, we should try to set a safe default or at least stop loading
            setState({
                isComplete: false,
                currentStep: 'welcome',
                lastUpdatedAt: new Date().toISOString(),
                whatsappConnected: false,
                templateSelected: false,
                kycStatus: 'not_started',
                plan: 'free'
            });
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Save final state
        const finalState: OnboardingState = {
            ...state!,
            isComplete: true,
            currentStep: state!.currentStep || 'complete',
        };
        setState(finalState);
        await OnboardingService.complete();

        // Redirect to dashboard with welcome param
        router.push('/admin/dashboard?welcome=true');
    };

    const handleSaveExit = async () => {
        try {
            // Save current progress to backend
            if (state) {
                await OnboardingService.saveStep(state.currentStep, state);
            }

            // Log user out
            await fetch('/api/auth/merchant/logout', {
                method: 'POST',
                credentials: 'include'
            });

            // Redirect to login page
            router.push('/signin');
        } catch (error) {
            console.error('Error during save & exit:', error);
            // Still redirect to login even if save fails
            router.push('/signin');
        }
    };

    return (
        <OnboardingContext.Provider value={{
            state,
            loading,
            updateState,
            goToStep,
            completeOnboarding,
            handleSaveExit
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
