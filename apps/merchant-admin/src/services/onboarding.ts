import { OnboardingState, OnboardingStepId } from '@/types/onboarding';

const STORAGE_KEY = 'vayva_onboarding_state';

const defaultState: OnboardingState = {
    isComplete: false,
    currentStep: 'welcome',
    lastUpdatedAt: new Date().toISOString(),
    enabledChannels: {
        storefront: true,
        whatsappAi: false,
        market: false
    }
};

export const OnboardingService = {
    getState: async (): Promise<OnboardingState> => {
        // In real app: fetch from API
        // For now: read from localStorage
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        }
        return defaultState;
    },

    saveStep: async (stepId: OnboardingStepId, data: Partial<OnboardingState>): Promise<void> => {
        // In real app: POST to API
        console.log(`Saving step ${stepId}`, data);

        // Dual-write to localStorage
        if (typeof window !== 'undefined') {
            const currentState = await OnboardingService.getState();
            const newState = {
                ...currentState,
                ...data,
                currentStep: stepId,
                lastUpdatedAt: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        }
    },

    complete: async (): Promise<void> => {
        await OnboardingService.saveStep('review', { isComplete: true });
    },

    reset: async (): Promise<void> => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
        }
    }
};
