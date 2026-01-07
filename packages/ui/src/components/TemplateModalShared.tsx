"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight, Smartphone, Monitor } from "lucide-react";
import { Button } from "./Button";
import { TemplateCardData } from "./TemplateCard";

interface TemplateModalProps {
    template: TemplateCardData | null;
    onClose: () => void;
    onUse: (template: TemplateCardData) => void;
    actionLabel?: string;
    appUrl?: string; // e.g. local or production URL for signing up
}

export function TemplateModal({
    template,
    onClose,
    onUse,
    actionLabel = "Start with this template",
    appUrl,
}: TemplateModalProps) {
    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

    if (!template) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
                layoutId={`modal-${template.id}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden h-[90vh] flex flex-col md:flex-row"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full transition-colors shadow-sm"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Left: Preview (Scrollable) */}
                <div
                    className={`w-full md:w-3/4 bg-gray-100 flex flex-col relative overflow-hidden transition-all duration-500 ease-in-out ${viewMode === "mobile" ? "items-center justify-center bg-gray-200" : ""
                        }`}
                >
                    {/* Controls */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        <div className="bg-white/90 backdrop-blur rounded-full shadow-sm border border-gray-200 p-1 flex">
                            <button
                                onClick={() => setViewMode("desktop")}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === "desktop"
                                        ? "bg-[#0F172A] text-white shadow-md"
                                        : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                <Monitor className="w-3 h-3" /> Desktop
                            </button>
                            <button
                                onClick={() => setViewMode("mobile")}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === "mobile"
                                        ? "bg-[#0F172A] text-white shadow-md"
                                        : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                <Smartphone className="w-3 h-3" /> Mobile
                            </button>
                        </div>
                    </div>

                    {/* IFRAME */}
                    <motion.div
                        layout
                        className={`transition-all duration-500 ease-in-out shadow-2xl bg-white overflow-hidden relative mx-auto mt-auto ${viewMode === "mobile"
                                ? "w-[375px] h-[812px] rounded-[40px] border-[8px] border-[#1a1a1a] my-auto"
                                : "w-full h-full rounded-none border-0"
                            }`}
                    >
                        <iframe
                            src={template.previewRoute || `/templates/preview/${template.id}`} // Helper to handle missing previewRoute
                            className="w-full h-full border-0 bg-white"
                            title={`Preview of ${template.name}`}
                        />
                    </motion.div>
                </div>

                {/* Right: Details */}
                <div className="w-full md:w-1/4 p-8 border-l border-gray-100 flex flex-col h-full bg-white overflow-y-auto">
                    <div className="flex-1">
                        <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-[#22C55E] text-xs font-bold uppercase tracking-wider mb-4">
                            {template.tier || "Free"}
                        </span>
                        <h2 className="text-2xl font-bold text-[#0F172A] mb-4">
                            {template.name}
                        </h2>
                        <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                            {template.description}
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-[#0F172A] mb-3 text-sm">
                                    Key Features
                                </h4>
                                <ul className="space-y-2">
                                    {template.features?.slice(0, 6).map((feature, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2 text-xs text-gray-600"
                                        >
                                            <Check className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 mt-8 border-t border-gray-100 sticky bottom-0 bg-white">
                        <Button
                            onClick={() => onUse(template)}
                            className="w-full h-12 text-sm bg-[#0F172A] hover:bg-[#1E293B] text-white"
                        >
                            {actionLabel} <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
