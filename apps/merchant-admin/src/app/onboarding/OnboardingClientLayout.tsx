"use client";

import { useSonic } from "@/hooks/useSonic";

import { motion, AnimatePresence } from "framer-motion";
import React, { Suspense, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button, Icon, cn, Skeleton } from "@vayva/ui";
import { useOnboarding } from "@/context/OnboardingContext";
import { OnboardingStepId } from "@/types/onboarding";
import { Logo } from "@/components/Logo"; // Use original Logo component
import { telemetry } from "@/lib/telemetry";

interface StepDef {
  id: OnboardingStepId;
  path: string;
  label: string;
}

const STEPS: StepDef[] = [
  { id: "business", path: "/onboarding/business", label: "Business Details" },
  { id: "identity", path: "/onboarding/identity", label: "Owner Identity" },
  { id: "templates", path: "/onboarding/templates", label: "Template Selection" },
  { id: "products", path: "/onboarding/products", label: "Product Catalog" },
  { id: "payments", path: "/onboarding/payments", label: "Payment Methods" },
  { id: "delivery", path: "/onboarding/delivery", label: "Delivery Settings" },
  { id: "kyc", path: "/onboarding/kyc", label: "Verification" },
  { id: "team" as any, path: "/onboarding/team", label: "Team & Connections" },
  { id: "review", path: "/onboarding/review", label: "Review & Launch" },
];

export function OnboardingClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, handleSaveExit, state } = useOnboarding();

  // Calculate dynamic labels based on category
  const getStepLabel = (stepId: OnboardingStepId, defaultLabel: string) => {
    const segment = state?.intent?.segment;
    if (!segment) return defaultLabel;

    if (stepId === "products") {
      switch (segment) {
        case "nonprofit":
          return "Campaigns";
        case "real-estate":
          return "Listings";
        case "education":
          return "Courses";
        case "digital":
          return "Digital Products";
        case "services":
          return "Services List";
        case "b2b":
          return "Wholesale Catalog";
        default:
          return defaultLabel;
      }
    }

    if (stepId === "business" || (stepId as any) === "business") {
      if (segment === "nonprofit") return "Organization Details";
      if (segment === "real-estate") return "Agency Details";
    }

    return defaultLabel;
  };

  // Stabilize steps list to prevent jump (11 -> 10)
  const validSteps = useMemo(() => {
    // If we're still loading, return a stable structure if possible, 
    // but the loading check in OnboardingProvider takes care of the initial null state.
    // The flicker happens because state?.skippedSteps might update after initial load.
    return STEPS.filter(
      (step) => !state?.skippedSteps?.includes(step.id),
    ).map((step) => ({
      ...step,
      label: getStepLabel(step.id, step.label),
    }));
  }, [state?.skippedSteps, state?.intent?.segment]);

  useEffect(() => {
    const step = validSteps.find((s) => pathname.startsWith(s.path));
    if (step) {
      telemetry.track("ONBOARDING_STEP_VIEWED", {
        step: step.id,
        path: pathname,
        templateSlug: state?.template?.id,
        plan: state?.plan,
        fastPath: !!state?.skippedSteps?.length,
      });
    }
  }, [pathname, validSteps, state?.template?.id, state?.plan]);

  // Find current step index based on valid steps
  const currentStepIndex = validSteps.findIndex((s) =>
    pathname.startsWith(s.path),
  );
  const isFirstStep = currentStepIndex <= 0;

  /* Hook for sonic feedback */
  const { play: playClick } = useSonic("click", { volume: 0.4 });

  const handleBack = () => {
    playClick();
    if (currentStepIndex > 0) {
      router.push(validSteps[currentStepIndex - 1].path);
    }
  };

  const handleSkip = () => {
    playClick();
    if (currentStepIndex < validSteps.length - 1) {
      router.push(validSteps[currentStepIndex + 1].path);
    }
  };

  // Check if current step is optional (not in requiredSteps)
  const currentStep = validSteps[currentStepIndex];
  const FORCED_STEPS: OnboardingStepId[] = ["business", "templates"];
  const isOptionalStep =
    currentStep &&
    !state?.requiredSteps?.includes(currentStep.id) &&
    !FORCED_STEPS.includes(currentStep.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center animate-pulse">
            <Logo size="sm" showText={false} />
          </div>
          <p className="text-gray-500 font-medium">Loading setup...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="onboarding-wrapper min-h-screen bg-[#F5F5F7] flex flex-col selection:bg-black selection:text-white"
      style={{
        "--brand-color": state?.branding?.brandColor || "#09090b",
      } as React.CSSProperties}
    >
      <style jsx global>{`
        .onboarding-wrapper input:focus-visible,
        .onboarding-wrapper textarea:focus-visible {
          --tw-ring-color: var(--brand-color) !important;
          border-color: var(--brand-color) !important; 
        }
      `}</style>

      {/* Header */}
      <header className="h-14 md:h-16 px-4 md:px-8 bg-white/80 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 md:gap-3">
          <Logo size="sm" />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {!isFirstStep && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-gray-500 hover:text-black hover:bg-black/5 flex items-center gap-1 md:gap-2 px-2 md:px-4 rounded-xl transition-all"
            >
              <Icon name="ArrowLeft" className="w-4 h-4" />
              <span className="hidden md:inline">Back</span>
            </Button>
          )}
          {isOptionalStep && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 hover:bg-black/5 flex items-center gap-1 md:gap-2 px-2 md:px-4 rounded-xl transition-all"
            >
              <span>Skip</span>
              <Icon name="ArrowRight" className="w-4 h-4" />
            </Button>
          )}
        </div>
      </header>

      {/* Analytics Progress Bar */}
      <div className="w-full bg-gray-100 h-1 sticky top-14 md:top-16 z-40">
        <div
          className="h-full bg-black transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(0,0,0,0.2)]"
          style={{
            width: `${((currentStepIndex + 1) / validSteps.length) * 100}%`,
          }}
        />
      </div>

      <main className="flex-1 flex w-full relative">
        {/* Sidebar Stepper - Glassmorphism UI */}
        <aside className="hidden lg:flex flex-col w-72 xl:w-80 py-8 px-6 border-r border-gray-200/50 h-[calc(100vh-64px)] overflow-y-auto sticky top-16 bg-white/40 backdrop-blur-xl shrink-0">
          <div className="space-y-1.5 flex-1 mt-4">
            <AnimatePresence>
              {validSteps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                const isPending = index > currentStepIndex;

                return (
                  <motion.div
                    key={step.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      key={step.id}
                      className={cn(
                        "group flex items-center gap-3 p-3 rounded-2xl transition-all duration-300",
                        isActive
                          ? "bg-white shadow-xl shadow-black/5 ring-1 ring-black/5 scale-[1.02]"
                          : "hover:bg-white/60 hover:translate-x-1",
                        isPending ? "opacity-40" : "opacity-100",
                      )}
                    >
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500",
                          isCompleted
                            ? "bg-black text-white"
                            : isActive
                              ? "bg-[#46EC13] text-black shadow-[0_0_20px_rgba(70,236,19,0.5)] scale-110 animate-pulse-subtle"
                              : "bg-gray-100 text-gray-400 group-hover:bg-gray-200",
                        )}
                      >
                        {isCompleted ? <Icon name="Check" size={14} className="animate-in zoom-in duration-300" /> : index + 1}
                      </div>
                      <span
                        className={cn(
                          "text-sm font-semibold tracking-tight transition-colors",
                          isActive ? "text-black" : "text-gray-500 group-hover:text-gray-800",
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {state?.templateSelected &&
            state?.skippedSteps &&
            state.skippedSteps.length > 0 && (
              <div className="mt-6 mb-6 p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-xs text-green-700">
                  ✨{" "}
                  <strong>
                    {state.skippedSteps.length} steps automatically likely
                    skipped
                  </strong>{" "}
                  based on your template selection.
                </p>
              </div>
            )}

          <div className="pt-6 mt-6 border-t border-gray-200/50">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-black hover:bg-black/5 rounded-xl transition-all"
              onClick={handleSaveExit}
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Save & Exit
            </Button>
          </div>
        </aside>

        {/* Content Area - Premium Polish */}
        <div className="flex-1 min-w-0 bg-[#F5F5F7]">
          <div className="w-full mx-auto p-4 md:py-12 md:px-8 pb-32 max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
            {state?.templateSelected && (
              <div className="mb-8 p-4 bg-white/60 backdrop-blur-md border border-white shadow-xl shadow-black/5 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="w-10 h-10 rounded-2xl bg-[#46EC13]/10 flex items-center justify-center text-[#46EC13] shrink-0 shadow-inner">
                  <Icon name="Zap" size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 leading-tight">
                    Smart Setup: {state.template?.name || "Ready"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">
                    We've tailored this flow for your selected template.
                  </p>
                </div>
              </div>
            )}

            <div className="relative">
              <Suspense
                fallback={
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-1/3 rounded-xl" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                      <div className="space-y-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-14 w-full rounded-2xl" />
                      </div>
                      <div className="space-y-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-14 w-full rounded-2xl" />
                      </div>
                    </div>
                  </div>
                }
              >
                {children}
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
