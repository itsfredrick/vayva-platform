"use client";

import { useEffect, useState } from "react";
import { Button, Icon } from "@vayva/ui";
import { useRouter } from "next/navigation";

interface OnboardingStatus {
    completed: boolean;
    completionPercentage: number;
    missingSteps: string[];
    canLaunch: boolean;
}

export function OnboardingIncompleteAlert() {
    const router = useRouter();
    const [status, setStatus] = useState<OnboardingStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        checkOnboardingStatus();
    }, []);

    const checkOnboardingStatus = async () => {
        try {
            const res = await fetch("/api/merchant/onboarding/status");
            if (res.ok) {
                const data = await res.json();
                setStatus(data);
            }
        } catch (error) {
            console.error("Failed to check onboarding status:", error);
        } finally {
            setLoading(false);
        }
    };

    // Only show if there are missing steps (even if launch ready)
    if (loading || !status || (status.missingSteps.length === 0) || dismissed) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg p-5 mb-8 shadow-sm relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-100 rounded-full blur-2xl opacity-50"></div>

            <div className="flex items-start gap-4 relative z-10">
                <div className="flex-shrink-0 bg-white p-2 rounded-full shadow-sm border border-indigo-100">
                    <Icon name="Sparkles" className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-indigo-900 flex items-center gap-2">
                        Optimization Opportunity
                        <span className="text-xs font-normal px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                            {status.completionPercentage}% Optimized
                        </span>
                    </h3>
                    <p className="mt-1 text-sm text-indigo-700 leading-relaxed">
                        To help our AI generate the best insights and growth strategies for your store,
                        we need a little more information.
                    </p>

                    <div className="mt-4 grid gap-2 md:grid-cols-2">
                        {status.missingSteps.map((step, i) => (
                            <div key={i} className="flex items-center justify-between bg-white/60 p-2 rounded border border-indigo-50/50">
                                <span className="text-sm font-medium text-indigo-800 pl-2">{step}</span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
                                    onClick={() => {
                                        // Simple linking logic based on step name
                                        if (step.includes("Products")) router.push("/onboarding?step=products");
                                        else if (step.includes("Payments")) router.push("/onboarding?step=payments");
                                        else if (step.includes("Identity")) router.push("/onboarding?step=identity");
                                        else router.push("/onboarding");
                                    }}
                                >
                                    Complete
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex gap-3">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDismissed(true)}
                            className="text-indigo-400 hover:text-indigo-600 p-0 h-auto font-normal text-xs"
                        >
                            Dismiss this recommendation
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
