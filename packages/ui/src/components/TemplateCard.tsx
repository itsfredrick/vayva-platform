"use client";

import React from "react";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { cn } from "../utils";

// Generic interface that matches NormalizedTemplate but is self-contained in UI package
export interface TemplateCardData {
    id: string;
    name: string;
    description: string;
    tier?: string; // e.g. 'free', 'pro'
    requiredPlan?: string;
    isActive?: boolean;
    isLocked?: boolean;
    badges?: string[];
    features?: string[];
    previewImageDesktop: string;
    previewImages?: { cover?: string }; // Legacy support
    previewRoute?: string;
}

export interface TemplateCardProps {
    template: TemplateCardData;
    userPlan: "free" | "growth" | "pro";
    onPreview: (template: any) => void;
    onUse: (template: any) => void;
    onUnlock?: () => void;
    recommendation?: {
        reason: string;
        expectedImpact: string;
    };
    customAction?: {
        label: string;
        onClick: () => void;
    };
    allowPayLater?: boolean;
    brandColor?: string;
    logoUrl?: string;
    className?: string;
}

export const TemplateCard = ({
    template,
    userPlan = "free",
    onPreview,
    onUse,
    onUnlock,
    allowPayLater,
    recommendation,
    customAction,
    brandColor,
    logoUrl,
    className,
    isOwned = false,
}: TemplateCardProps & { isOwned?: boolean }) => {
    // Determine if locked based on plan
    const planLevels = ["free", "growth", "pro"];
    const userLevelIndex = planLevels.indexOf(userPlan);
    const requiredPlan = template.requiredPlan || template.tier || "free";
    const requiredLevelIndex = planLevels.indexOf(requiredPlan);
    const isPlanLocked = requiredLevelIndex > userLevelIndex;
    const isLocked = !isOwned && (template.isLocked || isPlanLocked);

    // Image source resolution
    const imageSrc =
        template.previewImageDesktop ||
        template.previewImages?.cover ||
        "/images/template-previews/default-desktop.png";

    return (
        <div
            className={cn(
                "group bg-white border border-gray-100 rounded-3xl overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 relative h-full flex flex-col",
                template.isActive
                    ? "ring-2 ring-black shadow-xl"
                    : "hover:border-black/10 shadow-sm",
                className
            )}
        >
            {/* Thumbnail Area */}
            <div
                className="aspect-[4/3] bg-gray-50 relative group-hover:opacity-95 transition-opacity cursor-pointer overflow-hidden"
                onClick={() => onPreview(template)}
            >
                <div className="absolute inset-0 flex items-center justify-center text-gray-200">
                    <Icon name="Layout" size={64} strokeWidth={1} />
                </div>

                {imageSrc && !imageSrc.includes("default-desktop") ? (
                    <img
                        src={imageSrc}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 relative z-10"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <div className={cn(
                        "w-full h-full relative z-10 flex items-center justify-center transition-transform duration-700 group-hover:scale-105",
                        // Dynamic gradients based on template name hash or category would be ideal, 
                        // but purely decorative random-ish gradients work well for 'No Mock' feel.
                        // We'll use a sophisticated gray-scale + accent pattern.
                        "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200"
                    )}>
                        <div className="text-gray-300 transform group-hover:scale-110 transition-transform duration-500">
                            {/* Contextual Icon based on name keywords */}
                            {template.name.toLowerCase().includes('fashion') ? <Icon name="Shirt" size={64} strokeWidth={1} /> :
                                template.name.toLowerCase().includes('food') || template.name.toLowerCase().includes('dining') ? <Icon name="Utensils" size={64} strokeWidth={1} /> :
                                    template.name.toLowerCase().includes('digital') ? <Icon name="FileDigit" size={64} strokeWidth={1} /> :
                                        template.name.toLowerCase().includes('event') ? <Icon name="Ticket" size={64} strokeWidth={1} /> :
                                            <Icon name="Layout" size={64} strokeWidth={1} />
                            }
                        </div>
                        {/* Decorative pattern overlay */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
                    </div>
                )}

                <div className="absolute top-4 right-4 flex gap-2 z-20">
                    {template.isActive && (
                        <span className="bg-black text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-xl border border-white/20">
                            SELECTED
                        </span>
                    )}

                    {/* Badges */}
                    {template.badges?.map((badge: string) => (
                        <span
                            key={badge}
                            className="bg-black text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-xl border border-white/20 uppercase"
                        >
                            {badge}
                        </span>
                    ))}

                    {isLocked ? (
                        <span className="bg-white/80 backdrop-blur-sm text-black px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm border border-gray-100 flex items-center gap-1">
                            <Icon name="Lock" size={10} /> {requiredPlan.toUpperCase()}
                        </span>
                    ) : null}
                </div>

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-30">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPreview(template);
                        }}
                        className="bg-white text-black px-5 py-2.5 rounded-2xl font-bold text-xs transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl"
                    >
                        Live Preview
                    </button>
                    {brandColor && (
                        <div
                            className="bg-white px-5 py-2.5 rounded-2xl font-bold text-xs transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl flex items-center gap-2"
                            style={{ color: brandColor }}
                        >
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }} />
                            Branded
                        </div>
                    )}
                </div>

                {/* Brand Overlay */}
                {(brandColor || logoUrl) && (
                    <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-black/20 to-transparent z-10 p-4 transition-opacity group-hover:opacity-0">
                        <div className="flex items-center gap-2">
                            {logoUrl && (
                                <img src={logoUrl} className="w-6 h-6 rounded-full border border-white/50 shadow-sm object-cover bg-white" alt="Brand" />
                            )}
                            {brandColor && !logoUrl && (
                                <div className="w-6 h-6 rounded-full border border-white/50 shadow-sm" style={{ backgroundColor: brandColor }} />
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-md font-bold text-gray-900 font-heading">
                        {template.name}
                    </h3>
                    {/* Recommendation badge if present */}
                    {recommendation && (
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200">
                            BEST MATCH
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-400 mb-4 line-clamp-2 h-8 leading-relaxed">
                    {template.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                    {template.features?.slice(0, 3).map((f: string) => (
                        <span
                            key={f}
                            className="text-[9px] font-bold uppercase tracking-wider bg-gray-50 text-gray-500 px-2.5 py-1 rounded-lg border border-gray-100"
                        >
                            {f}
                        </span>
                    ))}
                </div>

                {/* Actions */}
                <div className="mt-auto">
                    {customAction ? (
                        <Button
                            onClick={customAction.onClick}
                            className="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-2xl font-bold text-xs shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {customAction.label}
                        </Button>
                    ) : template.isActive ? (
                        <Button
                            disabled
                            className="w-full bg-gray-100 text-gray-400 py-3 rounded-2xl font-bold text-xs ring-0 border-none"
                        >
                            Selected Template
                        </Button>
                    ) : isLocked ? (
                        <Button
                            onClick={() => allowPayLater ? onUse(template) : onUnlock?.()}
                            className="w-full bg-gray-900 text-white hover:bg-black py-3 rounded-2xl font-bold text-xs shadow-xl transition-all"
                        >
                            {allowPayLater ? (
                                <>
                                    <Icon name="ArrowRight" size={14} className="mr-2" />
                                    Select & Pay Later
                                </>
                            ) : (
                                <>
                                    <Icon name="Lock" size={14} className="mr-2" />
                                    Unlock with {requiredPlan}
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => onUse(template)}
                            className="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-2xl font-bold text-xs shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                            style={brandColor ? { backgroundColor: brandColor, color: '#000' } : undefined} // Dark text on brand color usually safer for vibrant brands, or need contrasting logic
                        >
                            Select Design
                        </Button>
                    )}
                </div>
            </div>
        </div >
    );
};
