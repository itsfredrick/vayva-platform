"use client";

import React, { useMemo, useState } from "react";
import { useOnboarding } from "@/context/OnboardingContext";
import { TemplateGallery } from "@/components/control-center/TemplateGallery";
import { recommendTemplate } from "@/lib/templates/recommendation-engine";
import { Template } from "@/types/templates";
import { Button, Icon, cn } from "@vayva/ui";

const PRESET_COLORS = [
  "#000000",
  "#FFFFFF",
  "#FF3B30",
  "#FF9500",
  "#FFCC00",
  "#4CD964",
  "#5AC8FA",
  "#007AFF",
  "#5856D6",
  "#FF2D55",
];

export default function TemplatesPage() {
  const { state, updateState, goToStep } = useOnboarding();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    state?.template ? { id: state.template.id, name: state.template.name } as Template : null
  );

  // Branding State
  const [brandColor, setBrandColor] = useState(state?.branding?.brandColor || "#000000");
  const [logoPreview, setLogoPreview] = useState<string | null>(state?.branding?.logoUrl || null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Determine the recommended template based on onboarding data
  const recommendation = useMemo(() => {
    if (!state) return null;
    return recommendTemplate(state);
  }, [state]);

  const handleUseTemplate = async (template: Template) => {
    setSelectedTemplate(template);

    const newState = {
      templateSelected: true,
      template: {
        id: template.id,
        name: template.name,
      },
      branding: {
        brandColor,
        logoUrl: logoPreview || undefined,
      }
    };

    await updateState(newState);

    // Save to database
    try {
      await fetch('/api/store/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Save template ID to settings (or proper column if it exists)
          // Also save branding
          brandColor,
          logo: logoPreview,
          templateId: template.id,
        })
      });
      console.log('[TEMPLATES] Saved template and branding to database');
    } catch (error) {
      console.error('[TEMPLATES] Failed to save to database:', error);
    }
  };

  const handleContinue = async () => {
    await goToStep("products");
  };

  const handleBack = () => {
    goToStep("identity");
  };

  // Default to 'growth' plan for onboarding preview context or use state if available
  const userPlan = (state?.plan as "free" | "growth" | "pro") || "growth";

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="mb-12 flex flex-col md:flex-row items-end justify-between px-4 gap-8">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Select your <span className="text-transparent bg-clip-text bg-gradient-to-br from-black via-gray-700 to-gray-400">digital storefront</span>
          </h1>
          <p className="text-lg text-gray-400 font-medium max-w-2xl">
            Based on your business profile, we've curated the most effective designs for your audience.
          </p>
        </div>

        <button
          onClick={handleBack}
          className="group flex items-center gap-3 text-gray-400 hover:text-black transition-all font-black text-xs uppercase tracking-[0.2em] mb-2"
        >
          <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-black transition-all">
            <Icon name="ArrowLeft" size={16} />
          </div>
          Back to Identity
        </button>
      </div>

      {recommendation && (
        <div className="px-4 mb-8">
          <div className="inline-flex items-center gap-4 p-4 bg-white/60 backdrop-blur-md border border-white shadow-xl shadow-black/5 rounded-[2rem] animate-in zoom-in duration-700">
            <div className="w-10 h-10 rounded-2xl bg-[#46EC13]/10 flex items-center justify-center text-[#46EC13] shrink-0 shadow-inner">
              <Icon name="Sparkles" size={18} />
            </div>
            <div className="text-left py-1 pr-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Expert Recommendation</p>
              <p className="text-sm font-bold text-gray-900">
                We suggest the <span className="text-[#46EC13]">{recommendation.recommendedTemplate}</span> template for {state?.intent?.segment || "your business"}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Brand Identity Section */}
      <div className="px-4 mb-8">
        <div className="bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white shadow-2xl shadow-black/5 transition-all duration-700 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

            {/* Color Picker */}
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Signature Color</label>
              <div className="flex gap-4">
                <div
                  className="w-12 h-12 rounded-xl shadow-lg border-2 border-white shrink-0 transition-colors duration-300"
                  style={{ backgroundColor: brandColor }}
                />
                <div className="flex-1 grid grid-cols-6 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBrandColor(color)}
                      className={cn(
                        "w-12 h-12 rounded-lg border transition-all hover:scale-110",
                        brandColor === color ? "border-black scale-110 shadow-md" : "border-white"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <div className="relative">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-black hover:text-black transition-colors">
                      <Icon name="Plus" size={12} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Store Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-white overflow-hidden relative group">
                  {logoPreview ? (
                    <img src={logoPreview} className="w-full h-full object-cover" alt="Logo" />
                  ) : (
                    <Icon name="Image" className="text-gray-300" size={24} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-900">Upload Mark</p>
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Square • PNG/JPG</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="px-4">
        <TemplateGallery
          currentPlan={userPlan}
          onUseTemplate={handleUseTemplate}
          selectedTemplateId={selectedTemplate?.id}
          recommendedTemplateId={recommendation?.recommendedTemplate}
          recommendationReason={recommendation?.reason}
          selectedCategory={recommendation?.category}
          brandColor={brandColor}
          logoUrl={logoPreview || undefined}
          allowPayLater={true}
        />
      </div>

      {selectedTemplate && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-4xl z-50 animate-in slide-in-from-bottom-12 duration-700">
          <div className="bg-white/80 backdrop-blur-2xl border border-white/50 p-6 md:p-8 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#46EC13]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />

            <div className="flex items-center gap-6 relative z-10">
              <div className="w-14 h-14 rounded-3xl bg-black flex items-center justify-center text-[#46EC13] shadow-xl group-hover:scale-110 transition-transform duration-500">
                <Icon name="Check" size={28} />
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Current Selection</p>
                <h3 className="text-2xl font-black text-gray-900 leading-none">
                  {selectedTemplate.name}
                </h3>
              </div>
            </div>

            <Button
              onClick={handleContinue}
              className="!bg-black !text-white h-16 px-12 rounded-2xl text-lg font-black shadow-xl hover:shadow-black/20 hover:scale-[1.05] active:scale-95 transition-all relative z-10 group/btn"
            >
              Continue with this look
              <Icon name="ArrowRight" className="ml-3 w-5 h-5 transition-transform duration-500 group-hover/btn:translate-x-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
