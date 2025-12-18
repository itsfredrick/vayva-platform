import { OnboardingClientLayout } from './OnboardingClientLayout';
import { OnboardingProvider } from '@/context/OnboardingContext';

export const dynamic = 'force-dynamic';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <OnboardingProvider>
            <OnboardingClientLayout>{children}</OnboardingClientLayout>
        </OnboardingProvider>
    );
}
