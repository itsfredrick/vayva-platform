import React, { useState, useMemo } from "react";
import { Template } from "@/types/templates";
import {
  TEMPLATE_CATEGORIES,
  getNormalizedTemplates,
  NormalizedTemplate,
} from "@/lib/templates-registry";
import { UpgradePlanModal } from "@/components/billing/UpgradePlanModal";
import { TemplateCard, TemplateModal, TemplateCardData } from "@vayva/ui";

interface TemplateGalleryProps {
  // We accept both legacy Template (if passed from parent) or we fetch internally
  templates?: Template[];
  currentPlan: "free" | "growth" | "pro";
  onUseTemplate: (template: any) => void;
  selectedTemplateId?: string;
  onPreview?: (template: any) => void;
  recommendedTemplateId?: string;
  recommendationReason?: string;
  selectedCategory?: string; // Category from onboarding (e.g., "Retail", "Food")
  brandColor?: string;
  logoUrl?: string;
  allowPayLater?: boolean;
}

function FilterPill({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${isActive
        ? "bg-black text-white shadow-md"
        : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}
    >
      {label}
    </button>
  );
}

export const TemplateGallery = ({
  currentPlan,
  onUseTemplate,
  selectedTemplateId,
  onPreview,
  recommendedTemplateId,
  recommendationReason,
  selectedCategory,
  brandColor,
  logoUrl,
  allowPayLater,
}: TemplateGalleryProps) => {
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [targetPlan, setTargetPlan] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePlanFilter, setActivePlanFilter] = useState<"all" | "free" | "growth" | "pro">("all");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateCardData | null>(null);

  // Gating State
  const [ownedTemplateIds, setOwnedTemplateIds] = useState<string[]>([]);
  const [ownedCount, setOwnedCount] = useState(0);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(true);

  React.useEffect(() => {
    fetch("/api/control-center/library")
      .then(res => res.json())
      .then(data => {
        if (data.ownedIds) {
          setOwnedTemplateIds(data.ownedIds);
          setOwnedCount(data.count || 0);
        }
      })
      .finally(() => setIsLoadingLibrary(false));
  }, []);

  const allTemplates = useMemo(() => getNormalizedTemplates(), []);

  const filteredTemplates = useMemo(() => {
    let filtered = allTemplates;

    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter((t) => t.category === activeCategory);
    }

    // Filter by plan
    if (activePlanFilter !== "all") {
      filtered = filtered.filter((t) => {
        const requiredPlan = t.requiredPlan || "free";
        if (activePlanFilter === "free") return requiredPlan === "free";
        if (activePlanFilter === "growth") return requiredPlan === "free" || requiredPlan === "growth";
        if (activePlanFilter === "pro") return true; // Pro can see all
        return true;
      });
    }

    // Sort: category-matched templates first if selectedCategory is provided
    if (selectedCategory) {
      filtered = [...filtered].sort((a, b) => {
        const aMatches = a.category === selectedCategory;
        const bMatches = b.category === selectedCategory;
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return 0;
      });
    }

    return filtered;
  }, [activeCategory, activePlanFilter, allTemplates, selectedCategory]);

  const handleUnlock = (template: NormalizedTemplate) => {
    setTargetPlan(template.requiredPlan || "pro");
    setUpgradeModalOpen(true);
  };

  const handlePreview = (template: any) => {
    setPreviewTemplate(template);
  };

  const handleUse = async (template: NormalizedTemplate) => {
    // 1. Check if already owned
    if (ownedTemplateIds.includes(template.id)) {
      onUseTemplate(template);
      return;
    }

    // 2. Try to add to library (API handles limits)
    try {
      const res = await fetch("/api/control-center/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id })
      });

      if (res.status === 403) {
        // Limit reached
        setTargetPlan("growth"); // Or pro, depending on logic
        setUpgradeModalOpen(true);
        return;
      }

      if (res.ok) {
        // Success, update local state
        setOwnedTemplateIds(prev => [...prev, template.id]);
        setOwnedCount(prev => prev + 1);
        onUseTemplate(template);
      }
    } catch (err) {
      console.error("Failed to add template", err);
    }
  };

  return (
    <section className="mb-12 space-y-8">
      <UpgradePlanModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={currentPlan}
        requiredPlan={targetPlan}
      />

      {previewTemplate && (
        <TemplateModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={(t) => {
            setPreviewTemplate(null);
            handleUse(t as any);
          }}
          appUrl={process.env.NEXT_PUBLIC_APP_URL}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Template Gallery</h2>
          <p className="text-gray-500 text-sm">
            Choose a starting point for your store.
            {currentPlan === 'free' && " (Free Plan: Use temporarily)"}
            {currentPlan === 'growth' && ` (Growth Plan: ${ownedCount}/3 Owned)`}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3">
          {/* Plan Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-gray-500 self-center mr-2">Plan:</span>
            <FilterPill
              label="All Plans"
              isActive={activePlanFilter === "all"}
              onClick={() => setActivePlanFilter("all")}
            />
            <FilterPill
              label="Free"
              isActive={activePlanFilter === "free"}
              onClick={() => setActivePlanFilter("free")}
            />
            <FilterPill
              label="Growth"
              isActive={activePlanFilter === "growth"}
              onClick={() => setActivePlanFilter("growth")}
            />
            <FilterPill
              label="Pro"
              isActive={activePlanFilter === "pro"}
              onClick={() => setActivePlanFilter("pro")}
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-gray-500 self-center mr-2">Category:</span>
            <FilterPill
              label="All"
              isActive={activeCategory === "All"}
              onClick={() => setActiveCategory("All")}
            />
            {TEMPLATE_CATEGORIES.filter((c) => c.isActive).map((cat) => (
              <FilterPill
                key={cat.slug}
                label={cat.displayName}
                isActive={activeCategory === cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template as any}
            userPlan={currentPlan}
            brandColor={brandColor}
            logoUrl={logoUrl}
            onPreview={() => handlePreview(template)}
            onUse={() => handleUse(template as any)}
            onUnlock={() => handleUnlock(template)}
            allowPayLater={allowPayLater}
            isOwned={ownedTemplateIds.includes(template.id)}
            customAction={
              template.id === selectedTemplateId ? {
                label: "Customize",
                onClick: () => window.location.href = "/dashboard/control-center/customize"
              } : undefined
            }
            recommendation={
              template.id === recommendedTemplateId
                ? ({
                  reason:
                    recommendationReason || "Recommended for your business",
                  expectedImpact: "Best Match",
                } as any)
                : undefined
            }
          />
        ))}

        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            No templates found in this category.
          </div>
        )}
      </div>
    </section>
  );
};
