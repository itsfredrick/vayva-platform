'use client';

import { Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Icon, cn } from '@vayva/ui';
import { useOnboarding } from '@/context/OnboardingContext';
import { OnboardingStepId } from '@/types/onboarding';
import { VayvaLogo } from '@/components/VayvaLogo';

interface StepDef {
    id: OnboardingStepId;
    path: string;
    label: string;
}

const STEPS: StepDef[] = [
    { id: 'welcome', path: '/onboarding/welcome', label: 'Welcome' },
    { id: 'setup-path', path: '/onboarding/setup-path', label: 'Start' },
    { id: 'business', path: '/onboarding/business', label: 'Business Basics' },
    { id: 'whatsapp', path: '/onboarding/whatsapp', label: 'WhatsApp' },
    { id: 'templates', path: '/onboarding/templates', label: 'Templates' },
    { id: 'order-flow', path: '/onboarding/order-flow', label: 'Order Flow' },
    { id: 'payments', path: '/onboarding/payments', label: 'Payments' },
    { id: 'delivery', path: '/onboarding/delivery', label: 'Delivery' },
    { id: 'team', path: '/onboarding/team', label: 'Team' },
    { id: 'kyc', path: '/onboarding/kyc', label: 'Identity' },
    { id: 'review', path: '/onboarding/review', label: 'Review' },
];

export function OnboardingClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { loading, handleSaveExit } = useOnboarding();

    // Find current step index
    const currentStepIndex = STEPS.findIndex(s => pathname.startsWith(s.path));
    const isFirstStep = currentStepIndex <= 0;

    const handleBack = () => {
        if (currentStepIndex > 0) {
            router.push(STEPS[currentStepIndex - 1].path);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center animate-pulse">
                        <VayvaLogo className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-500 font-medium">Loading setup...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
            {/* Header */}
            <header className="h-16 px-6 lg:px-8 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <img src="/logo-icon.png" alt="Vayva Logo" className="w-16 h-16 object-contain" />
                    <span className="font-bold text-lg">Vayva</span>
                </div>

                <div className="flex items-center gap-4">
                    {!isFirstStep && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBack}
                            className="text-gray-500 hover:text-black hover:bg-gray-100 flex items-center gap-2"
                        >
                            <Icon name="ArrowLeft" size={16} />
                            Back
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-black hover:bg-gray-100"
                    >
                        Having trouble? Get help
                    </Button>
                </div>
            </header>

            <main className="flex-1 flex max-w-[1440px] mx-auto w-full">
                {/* Sidebar Stepper - Hidden on mobile */}
                <aside className="hidden lg:flex flex-col w-72 py-8 px-6 border-r border-gray-200 h-[calc(100vh-64px)] overflow-y-auto sticky top-16 bg-white/50 backdrop-blur-sm">
                    <div className="space-y-1 flex-1">
                        {STEPS.map((step, index) => {
                            const isActive = index === currentStepIndex;
                            const isCompleted = index < currentStepIndex;
                            const isPending = index > currentStepIndex;

                            return (
                                <div
                                    key={step.id}
                                    className={cn(
                                        "flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200",
                                        isActive ? "bg-white shadow-sm ring-1 ring-black/5" : "hover:bg-black/5",
                                        isPending ? "opacity-50" : "opacity-100"
                                    )}
                                >
                                    <div className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                                        isCompleted ? "bg-black text-white" : isActive ? "bg-[#46EC13] text-black" : "bg-gray-200 text-gray-500"
                                    )}>
                                        {isCompleted ? <Icon name="Check" size={12} /> : index + 1}
                                    </div>
                                    <span className={cn("text-sm font-medium", isActive ? "text-black" : "text-gray-600")}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-6 mt-6 border-t border-gray-200">
                        <Button variant="ghost" className="w-full justify-start text-gray-500 hover:text-black" onClick={handleSaveExit}>
                            <Icon name="LogOut" size={16} className="mr-2" />
                            Save & Exit
                        </Button>
                    </div>
                </aside>

                {/* Content Area */}
                <div className="flex-1 min-w-0 bg-[#F5F5F7]">
                    <div className="w-full mx-auto p-6 md:p-12 pb-32">
                        <Suspense fallback={
                            <div className="h-64 flex items-center justify-center">
                                <Icon name={"Loader2" as any} className="w-8 h-8 animate-spin text-gray-400" />
                            </div>
                        }>
                            {children}
                        </Suspense>
                    </div>
                </div>
            </main>
        </div>
    );
}
