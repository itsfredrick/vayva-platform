"use client";

import React, { useState, useEffect } from "react";
import { Button, Icon, cn } from "@vayva/ui";
import { useOnboarding } from "@/context/OnboardingContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Master Prompt Step 11: Review (Expanded)
// Change Impact: Warn if editing critical sections
// Confidence Check: "I confirm" checkbox
// No forced upgrades or spam

export default function ReviewPage() {
  const { state, completeOnboarding } = useOnboarding();
  const [confirmed, setConfirmed] = useState(false);
  const [legalConsent, setLegalConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleFinish = async () => {
    setIsSubmitting(true);
    await completeOnboarding();
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div
      className="max-w-6xl mx-auto pb-24"
    >
      {/* ... header and sections grid */}

      {/* Confidence Check & Legal Consent - Premium Card */}
      <div className="bg-black text-white p-10 md:p-12 rounded-[3.5rem] shadow-3xl shadow-black/20 max-w-2xl mx-auto relative overflow-hidden group">
        {/* Animated background element */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#46EC13]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

        <div className="space-y-10 relative z-10">
          {/* Certification Checkbox */}
          <div
            className="flex items-start gap-8 cursor-pointer"
            onClick={() => setConfirmed(!confirmed)}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-all duration-500",
                confirmed
                  ? "bg-[#46EC13] border-[#46EC13] text-black shadow-lg shadow-[#46EC13]/20 scale-110"
                  : "border-white/20 bg-white/5 hover:border-white/40"
              )}
            >
              {confirmed && <Icon name="Check" size={24} className="font-black" />}
            </div>
            <div className="select-none flex-1">
              <span className="text-xl font-black text-white block mb-2 uppercase tracking-tight">
                Certify Configuration
              </span>
              <span className="text-gray-400 text-sm font-medium leading-relaxed">
                Accepting these parameters allows Vayva to optimize your initial dashboard experience. You retain full control over these primitives in your settings.
              </span>
            </div>
          </div>

          {/* Legal Consent Checkbox */}
          <div
            className="flex items-start gap-8 cursor-pointer"
            onClick={() => setLegalConsent(!legalConsent)}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-all duration-500",
                legalConsent
                  ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-110"
                  : "border-white/20 bg-white/5 hover:border-white/40"
              )}
            >
              {legalConsent && <Icon name="Check" size={24} className="font-black" />}
            </div>
            <div className="select-none flex-1">
              <span className="text-xl font-black text-white block mb-2 uppercase tracking-tight">
                Legal Agreement
              </span>
              <span className="text-gray-400 text-sm font-medium leading-relaxed uppercase tracking-widest text-[10px]">
                I AGREE TO THE <a href="https://vayva.co/legal/terms" target="_blank" className="underline hover:text-white">TERMS OF SERVICE</a> AND <a href="https://vayva.co/legal/privacy" target="_blank" className="underline hover:text-white">PRIVACY POLICY</a>. I ACKNOWLEDGE THAT I HAVE READ THE WITHDRAWAL FEE DISCLOSURE AND AI USAGE POLICY.
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Button
            onClick={handleFinish}
            disabled={!confirmed || !legalConsent || isSubmitting}
            className={cn(
              "h-20 w-full rounded-[2rem] text-xl font-black transition-all flex items-center justify-center gap-4 overflow-hidden relative",
              (confirmed && legalConsent && !isSubmitting)
                ? "!bg-white !text-black hover:scale-[1.03] active:scale-95 shadow-2xl shadow-white/10"
                : "!bg-white/10 !text-white/20 cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-4">
                <Icon name="Loader" size={24} className="animate-spin" />
                Initializing Ecosystem...
              </div>
            ) : (
              <>
                Deploy Final System <Icon name="ArrowRight" size={24} className="group-hover:translate-x-2 transition-transform duration-500" />
              </>
            )}
            {(confirmed && legalConsent) && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />}
          </Button>
        </div>
      </div>

      {/* Decorative Assets */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
        <div className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-[#46EC13]/5 rounded-full blur-[150px]" />
        <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />
      </div>
    </div>
  );
}
