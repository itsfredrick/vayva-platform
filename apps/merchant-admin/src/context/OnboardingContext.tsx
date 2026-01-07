"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { OnboardingState, OnboardingStepId } from "@/types/onboarding";
import { OnboardingService } from "@/services/onboarding";
import { useRouter } from "next/navigation";
import { telemetry } from "@/lib/telemetry";
import { getAttribution } from "@/lib/attribution";
import { ONBOARDING_PROFILES } from "@/lib/onboarding-profiles";
import { INDUSTRY_PROFILES } from "@/lib/industry-profiles";

interface OnboardingContextType {
  state: OnboardingState | null;
  loading: boolean;
  isNavigating: boolean;
  updateState: (data: Partial<OnboardingState>) => Promise<void>;
  goToStep: (step: OnboardingStepId) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  handleSaveExit: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<OnboardingState | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
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
          console.warn("Onboarding state load timed out, using default");
          resolve(OnboardingService.getState()); // Fallback to default state generator
        }, 2000);
      });

      let data = await Promise.race([dataPromise, timeoutPromise]);

      // FAST PATH LOGIC: Check attribution for template context
      try {
        const attribution = getAttribution();
        const initialTemplate = attribution.initial_template; // Slug or ID

        // MIGRATION: Fix legacy "store" step
        if ((data.currentStep as any) === "store" || (data.currentStep as any) === "store-details") {
          console.log("[ONBOARDING] Migrating legacy step:", data.currentStep);
          data.currentStep = "business" as OnboardingState["currentStep"]; // Type assertion to fix error
          await OnboardingService.saveStep("business", data);
        }

        // If we have a template in attribution but not in state (or state is fresh), apply profile
        // We only do this if the user hasn't explicitly selected a different template in the flow yet
        if (
          initialTemplate &&
          (!data.template?.id || data.template.id === initialTemplate)
        ) {
          console.log(
            "[ONBOARDING] Found initial template context:",
            initialTemplate,
          );
          const profile = ONBOARDING_PROFILES[initialTemplate];

          if (profile) {
            console.log("[ONBOARDING] Applying fast path profile:", profile);

            // Apply Skip & Require Steps
            data.skippedSteps = profile.skipSteps || [];
            data.requiredSteps = profile.requireSteps || [];

            // Apply Prefills
            if (profile.prefill) {
              // Business Category
              if (
                profile.prefill.industryCategory &&
                !data.business?.category
              ) {
                data.business = {
                  ...data.business,
                  category: profile.prefill.industryCategory,
                } as any;
              }

              // Delivery
              if (profile.prefill.deliveryEnabled !== undefined) {
                // If delivery is disabled by default (e.g. digital), set policy efficiently
                if (profile.prefill.deliveryEnabled === false) {
                  // Maybe set a flag or implicit policy, schema calls for 'policy' enum
                  // We won't force 'pickup_only' but we might note it.
                  // Actually, if skipped, we don't need to populate detailed fields unless required.
                }
              }

              // Payments
              if (profile.prefill.paymentsEnabled) {
                // Maybe pre-select a method?
              }

              // Set template in state so UI knows
              if (!data.template) {
                data.template = { id: initialTemplate, name: initialTemplate }; // Name will need lookup if we want pretty name
                data.templateSelected = true;
              }
            }

            // Telemetry
            telemetry.track("onboarding_fast_path_activated", {
              template: initialTemplate,
              skipped: data.skippedSteps,
              required: data.requiredSteps,
            });

            // Start Event
            telemetry.track("ONBOARDING_STARTED", {
              templateSlug: initialTemplate,
              entryPoint: attribution?.entry_point,
              fastPath: true,
            });
          }
        }
      } catch (e) {
        console.error("[ONBOARDING] Error applying fast path:", e);
      }

      // Fetch user data from auth to pre-populate business name
      try {
        const response = await fetch("/api/auth/merchant/me", {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          // Merge user's businessName into onboarding state if not already set
          if (userData.user?.businessName && !data.business?.name) {
            data.business = {
              name: userData.user.businessName,
              email: userData.user?.email || "",
              category: data.business?.category || "",
              location: data.business?.location || {
                city: "",
                state: "",
                country: "Nigeria",
              },
              ...data.business,
            };
          }
        }
      } catch (error) {
        console.warn("Could not fetch user data for onboarding:", error);
      }

      // CRITICAL: Load Store data from database
      try {
        const storeResponse = await fetch('/api/store/upsert');
        if (storeResponse.ok) {
          const { store } = await storeResponse.json();
          if (store) {
            console.log('[ONBOARDING] Loaded store data from database:', store);

            // Merge Store data into onboarding state
            data.business = {
              ...data.business,
              name: store.name || data.business?.name,
              category: store.category || data.business?.category,
              logo: store.logoUrl || (data.business as any)?.logo,
              location: {
                city: store.settings?.city || data.business?.location?.city || "",
                state: store.settings?.state || data.business?.location?.state || "",
                country: store.settings?.country || data.business?.location?.country || "Nigeria",
              },
              description: store.settings?.description || (data.business as any)?.description,
              email: (data.business as any)?.email || "", // Default to empty string if undefined
            };

            // Load brand colors
            if (store.settings?.brandColor) {
              data.branding = {
                ...data.branding,
                brandColor: store.settings.brandColor,
              };
            }

            // Load Template
            if (store.settings?.templateId) {
              data.template = {
                ...(data.template || {}),
                id: store.settings.templateId,
                name: data.template?.name || "Custom Template"
              };
              data.templateSelected = true;
            }

            // Load Payments
            if (store.settings?.paymentMethods) {
              const methods = store.settings.paymentMethods as string[];
              data.payments = {
                ...data.payments,
                method: methods.length > 1 ? "mixed" : (methods[0] as any),
                proofRequired: store.settings.paymentProofRule !== "optional",
              };
            }

            // Load Delivery
            if (store.settings?.deliveryPolicy) {
              data.delivery = {
                ...data.delivery,
                policy: store.settings.deliveryPolicy,
                stages: store.settings.deliveryStages,
                proofRequired: store.settings.deliveryProofRequired,
                pickupAddress: store.settings.deliveryPickupAddress,
              };
            }

            // Load KYC
            if (store.kycStatus || store.settings?.kycStatus) {
              data.kycStatus = (store.kycStatus || store.settings.kycStatus) as any;
              data.kyc = {
                method: store.settings?.kycMethod,
                status: data.kycStatus,
                data: {} // We don't load sensitive data back usually, or store it in secure vault
              };
            }

            // Load Team & WhatsApp
            if (store.settings?.team || store.settings?.whatsapp) {
              if (store.settings.team) data.team = store.settings.team;
              if (store.settings.whatsapp) {
                data.whatsappConnected = true;
                data.whatsapp = store.settings.whatsapp;
              }
            }
          }
        }
      } catch (error) {
        console.warn('[ONBOARDING] Could not load store data:', error);
      }

      setState(data);
    } catch (error) {
      console.error("Failed to load onboarding state:", error);
      // Even on error, we should try to set a safe default or at least stop loading
      setState({
        isComplete: false,
        currentStep: "business",
        lastUpdatedAt: new Date().toISOString(),
        whatsappConnected: false,
        templateSelected: false,
        kycStatus: "not_started",
        plan: "free",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateState = async (data: Partial<OnboardingState>) => {
    if (!state) return;

    const newState = { ...state, ...data };
    setState(newState);

    // Persist initial update to onboarding state
    await OnboardingService.saveStep(newState.currentStep, data);

    // CRITICAL: Save business details to Store table immediately
    if (data.business) {
      try {
        await fetch('/api/store/upsert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.business.name,
            category: data.business.category,
            city: data.business.location?.city,
            state: data.business.location?.state,
            country: data.business.location?.country || 'Nigeria',
            description: (data.business as any).description,
            logo: (data.business as any).logo,
          })
        });
        console.log('[ONBOARDING] Business details saved to database');
      } catch (error) {
        console.error('[ONBOARDING] Failed to save business to database:', error);
        // Don't block the flow if this fails
      }
    }

    // Save brand colors to database
    if (data.branding?.brandColor) {
      try {
        await fetch('/api/store/upsert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brandColor: data.branding.brandColor,
          })
        });
        console.log('[ONBOARDING] Brand color saved to database');
      } catch (error) {
        console.error('[ONBOARDING] Failed to save brand color:', error);
      }
    }

    // INDUSTRY TAILORING LOGIC: If segment just changed, apply industry profile
    if (data.intent?.segment && data.intent.segment !== state?.intent?.segment) {
      const profile = INDUSTRY_PROFILES[data.intent.segment];
      if (profile) {
        console.log(`[ONBOARDING] Applying tailored profile for: ${data.intent.segment}`, profile);

        const tailoredUpdate: Partial<OnboardingState> = {
          skippedSteps: profile.skipSteps || [],
          requiredSteps: profile.requireSteps || [],
        };

        if (profile.prefill) {
          if (profile.prefill.industryCategory) {
            tailoredUpdate.business = {
              ...(newState.business || {}),
              category: profile.prefill.industryCategory,
            } as any;
          }
        }

        // Merge with newState to create final state
        const finalState = { ...newState, ...tailoredUpdate };
        console.log(`[ONBOARDING] Final state after tailoring:`, {
          skippedSteps: finalState.skippedSteps,
          requiredSteps: finalState.requiredSteps,
          segment: finalState.intent?.segment,
        });

        setState(finalState);

        // Persist the complete tailored state
        await OnboardingService.saveStep(finalState.currentStep, {
          skippedSteps: finalState.skippedSteps,
          requiredSteps: finalState.requiredSteps,
          business: finalState.business,
        });
      }
    }
  };

  const goToStep = async (step: OnboardingStepId) => {
    if (!state || isNavigating) return;

    setIsNavigating(true);
    try {
      // Telemetry: Step Complete (for the previous step)
      telemetry.track("ONBOARDING_STEP_COMPLETED", {
        step: state.currentStep, // Canonical field name
        nextStep: step,
        templateSlug: state.template?.id,
        plan: state.plan,
        fastPath: !!state.skippedSteps?.length,
      });

      // Update current step in state
      await updateState({ currentStep: step });

      // Route to page
      router.push(`/onboarding/${step}`);
    } finally {
      // Small debounce to prevent rapid clicks
      setTimeout(() => setIsNavigating(false), 500);
    }
  };

  const completeOnboarding = async () => {
    // Telemetry: Required Flow Complete
    // Telemetry: Required Flow Complete
    telemetry.track("ONBOARDING_COMPLETED", {
      timeToDashboardMs: 0, // Placeholder
      templateId: state?.template?.id,
      templateSlug: state?.template?.id,
      plan: state?.plan,
      fastPath: !!state?.skippedSteps?.length,
      whatsappConnected: state?.whatsappConnected,
    });

    try {
      // 1. Get Store ID (needed for install)
      const userRes = await fetch("/api/auth/merchant/me");

      if (!userRes.ok) {
        console.error('[COMPLETE] Failed to get user context:', userRes.status, userRes.statusText);
        // Don't throw - continue with completion even if this fails
      } else {
        const userData = await userRes.json();
        // Fix: userData has merchant.storeId, not store.id
        const storeId = userData.merchant?.storeId || userData.store?.id;

        console.log('[COMPLETE] User data:', { storeId, hasTemplate: !!state?.template?.id });

        if (storeId && state?.template?.id) {
          // 2. Call Install API
          const installRes = await fetch("/api/templates/install", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              storeId: storeId,
              templateId: state.template.id,
            }),
          });

          if (!installRes.ok) {
            console.error(
              "Template install failed, continuing anyway...",
              await installRes.text(),
            );
          } else {
            console.log("Template installed successfully");
          }
        }
      }
    } catch (e) {
      console.error("Error during template installation:", e);
      // We don't block completion on this, as we want to get them to dashboard regardless
    }

    // Save final state
    const finalState: OnboardingState = {
      ...state!,
      isComplete: true,
      currentStep: state!.currentStep || "complete",
    };
    setState(finalState);

    try {
      await OnboardingService.complete();
      console.log('[COMPLETE] Onboarding marked as complete');
    } catch (error) {
      console.error('[COMPLETE] Error marking onboarding complete:', error);
      // Continue anyway - we'll redirect to completion page
    }

    // Redirect to success celebration page
    router.push("/onboarding/complete");
  };

  const handleSaveExit = async () => {
    try {
      // Save current progress to backend
      if (state) {
        await OnboardingService.saveStep(state.currentStep, state);
      }

      // Log user out
      await fetch("/api/auth/merchant/logout", {
        method: "POST",
        credentials: "include",
      });

      // Redirect to login page
      router.push("/signin");
    } catch (error) {
      console.error("Error during save & exit:", error);
      // Still redirect to login even if save fails
      router.push("/signin");
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        state,
        loading,
        isNavigating,
        updateState,
        goToStep,
        completeOnboarding,
        handleSaveExit,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
