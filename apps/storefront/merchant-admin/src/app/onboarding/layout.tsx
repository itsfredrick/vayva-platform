'use client';

import { usePathname } from 'next/navigation';
import { GlassPanel } from '@vayva/ui';

const STEPS = [
    { path: '/onboarding/store-details', label: 'Store Details' },
    { path: '/onboarding/brand', label: 'Brand & Identity' },
    { path: '/onboarding/products', label: 'First Products' },
    // { path: '/onboarding/payments', label: 'Payments' }, // Skipped for brief V1
    { path: '/onboarding/review', label: 'Review' },
];

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const currentStepIndex = STEPS.findIndex(s => pathname.startsWith(s.path));

    return (
        <div className="min-h-screen bg-background-dark flex flex-col">
            <header className="h-16 border-b border-white/10 flex items-center px-8 bg-black/20 backdrop-blur-md">
                <span className="text-xl font-bold text-white">Vayva Setup</span>
            </header>

            <main className="flex-1 flex flex-col md:flex-row">
                {/* Sidebar Steps */}
                <div className="w-full md:w-64 p-6 border-r border-white/10 hidden md:block">
                    <div className="space-y-1">
                        {STEPS.map((step, index) => {
                            const isActive = index === currentStepIndex;
                            const isCompleted = index < currentStepIndex;
                            return (
                                <div
                                    key={step.path}
                                    className={`flex items-center gap-3 p-2 rounded-lg ${isActive ? 'bg-white/10 text-white' : 'text-text-secondary'}`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                        ${isActive ? 'bg-primary text-black' : isCompleted ? 'bg-green-500 text-black' : 'bg-white/10'}
                                    `}>
                                        {isCompleted ? '✓' : index + 1}
                                    </div>
                                    <span className="text-sm font-medium">{step.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 md:p-12 overflow-y-auto">
                    <div className="max-w-3xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
