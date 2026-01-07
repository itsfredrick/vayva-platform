"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Icon } from "@vayva/ui";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { useOnboarding } from "@/context/OnboardingContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function IdentityPage() {
  const { state, updateState, goToStep } = useOnboarding();
  const { user, refreshProfile } = useAuth(); // Destructure refreshProfile here
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Pre-fill from Auth User or Onboarding State
    const initialData = {
      fullName:
        state?.identity?.fullName ||
        (user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : (user as any)?.name || ""),
      email: state?.identity?.email || user?.email || "",
      phone: state?.identity?.phone || user?.phone || "",
    };
    setFormData(initialData);
  }, [user, state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isLoading) return;

    if (!formData.fullName || !formData.phone) {
      setError("Please fill in all required fields");
      return;
    }

    setError("");
    setIsLoading(true);

    // Force refresh the profile to get updated details
    // const { refreshProfile } = useAuth(); // REMOVED: Invalid Hook Call

    try {
      // Save to Onboarding State (for progress tracking)
      await updateState({
        identity: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: "owner",
          authMethod: user?.email?.includes("gmail") ? "google" : "email",
        },
      });

      // CRITICAL: Save to User Table in Database
      try {
        await fetch("/api/auth/merchant/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // Split Full Name into First/Last if needed on backend, or send fullName if backend supports it
            // Backend supports 'fullName' logic in PATCH
            fullName: formData.fullName,
            phone: formData.phone,
          }),
        });
        console.log('[IDENTITY] Saved to User table');

        // REFRESH PROFILE to ensure local auth context has latest data when returning
        await refreshProfile();

      } catch (dbError) {
        console.error('[IDENTITY] Failed to save to User table:', dbError);
      }

      console.log('[IDENTITY] Saved identity data:', {
        fullName: formData.fullName,
        phone: formData.phone,
      });

      await new Promise(resolve => setTimeout(resolve, 300));
      await goToStep("templates");
    } catch (err) {
      console.error('[IDENTITY] Error saving:', err);
      setError("Failed to save. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    goToStep("business");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col xl:flex-row h-full gap-12 max-w-7xl mx-auto items-start"
    >
      {/* Left Column: Form - Glassmorphism UI */}
      <div className="flex-1 w-full max-w-2xl lg:pt-4">
        <div className="mb-6">
          <motion.label variants={itemVariants} className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">
            Personal Sovereignty
          </motion.label>
          <motion.h1 variants={itemVariants} className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
            Owner <span className="text-transparent bg-clip-text bg-gradient-to-br from-black via-gray-700 to-gray-400">Identity</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-base text-gray-400 font-medium max-w-lg">
            Tell us about the person behind the brand. This ensures secure account ownership and verification.
          </motion.p>
        </div>

        <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white shadow-2xl shadow-black/5 space-y-6 transition-all duration-700 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-3 bg-black/[0.02] rounded-xl border border-black/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Store Role</p>
                  <p className="text-sm font-black text-gray-900">MASTER OWNER</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-black text-[#46EC13] flex items-center justify-center shadow-lg">
                  <Icon name="ShieldCheck" size={18} />
                </div>
              </div>

              <div className="p-4 bg-black/[0.02] rounded-2xl border border-black/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Auth Channel</p>
                  <p className="text-sm font-black text-gray-900 uppercase">{user?.email?.includes("gmail") ? "Google Cloud" : "Standard Email"}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm">
                  <Icon name={user?.email?.includes("gmail") ? "Chrome" : "Mail"} size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Legal Full Name</label>
                <div className="relative">
                  <Input
                    placeholder="e.g. Ali Adebayo"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="h-12 bg-gray-50/50 border-gray-100 focus:border-black rounded-xl font-black text-base transition-all pl-12"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <Icon name="User" size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Business Email</label>
                <div className="relative">
                  <Input
                    type="email"
                    value={formData.email}
                    disabled
                    className="h-12 bg-gray-100/50 border-gray-100 text-gray-400 rounded-xl font-black text-base transition-all pl-12 cursor-not-allowed"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <Icon name="Lock" size={16} />
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 font-medium italic ml-1">Contact support to modify primary account email.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Primary Phone</label>
                <p className="text-[10px] text-gray-400 font-medium ml-1 mt-1">Nigerian format: 11 digits (e.g. 08012345678)</p>
                <PhoneInput
                  value={formData.phone}
                  onChange={(phone) => setFormData({ ...formData, phone })}
                  className="h-12 bg-gray-50/50 border-gray-100 focus:border-black rounded-xl font-black text-base transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-black uppercase tracking-widest animate-in shake">
                {error}
              </div>
            )}

            <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <button
                type="button"
                onClick={handleBack}
                className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
              >
                Back to Business
              </button>
              <Button
                type="submit"
                disabled={!formData.fullName || !formData.phone || isLoading}
                className="!bg-black !text-white h-14 px-8 rounded-xl text-base font-black shadow-xl hover:shadow-black/20 hover:scale-105 active:scale-95 transition-all w-full md:w-auto group"
              >
                {isLoading ? <Icon name="Loader" className="animate-spin" /> : "Secure & Continue"}
                <Icon name="ArrowRight" className="ml-3 w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
              </Button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Right Column: Premium Trust Panel */}
      <div className="hidden xl:block flex-1 w-full sticky top-24 max-w-sm">
        <div className="bg-black rounded-[3.5rem] p-10 text-white relative overflow-hidden h-[600px] flex flex-col justify-between shadow-3xl shadow-black/20">
          <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/[0.03] rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -left-20 w-60 h-60 bg-white/[0.02] rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 space-y-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#46EC13]/10 text-[#46EC13] flex items-center justify-center border border-[#46EC13]/20 shadow-lg shadow-[#46EC13]/5">
                <Icon name="ShieldCheck" size={32} />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight leading-none uppercase">Identity Vault</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Protocols Active</p>
              </div>
            </div>

            <div className="space-y-8">
              {[
                { icon: "Lock", title: "AES-256 Encryption", desc: "Your personal data is encrypted at rest and in transit." },
                { icon: "Fingerprint", title: "Biometric Audit", desc: "Digital ownership signatures are cryptographically logged." },
                { icon: "Verified", title: "Compliance Ready", desc: "Meets global KYC standards for payment processing." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-all duration-500">
                    <Icon name={item.icon as any} size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-tight text-white mb-1">{item.title}</h4>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 p-8 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#46EC13] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">System Integrity Verified</span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">
              "Personal data is only used for authentication and ensuring you retain master control over your store's treasury."
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
