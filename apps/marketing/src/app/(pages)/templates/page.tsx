"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight, Smartphone, Monitor } from "lucide-react";
import {
    TEMPLATE_REGISTRY,
    TEMPLATE_CATEGORIES,
    TemplateCategory,
    getNormalizedTemplates
} from "@/lib/templates-registry";
import { Button } from "@vayva/ui";
import Link from "next/link";
import Image from "next/image";

// --- Types ---
type Template = ReturnType<typeof getNormalizedTemplates>[0];

// --- Components ---

function FilterPill({
    label,
    isActive,
    onClick
}: {
    label: string;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${isActive
                ? "bg-[#0F172A] text-white shadow-lg scale-105"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
        >
            {label}
        </button>
    );
}

// Mini-Skeleton that looks like a real website layout
function MiniSitePreview({ template, colorClass }: { template: Template; colorClass: string }) {
    const isDark = colorClass.includes('slate') || colorClass.includes('zinc') || template.category === 'Digital';
    const bgBase = isDark ? 'bg-slate-900' : 'bg-white';
    const textBase = isDark ? 'bg-slate-700' : 'bg-gray-200';
    const accentBase = isDark ? 'bg-indigo-500' : 'bg-gray-300';

    return (
        <div className={`w-full h-full ${bgBase} flex flex-col pointer-events-none select-none p-4`}>
            {/* Nav Bar */}
            <div className="flex items-center justify-between mb-4 opacity-50">
                <div className={`w-8 h-2 rounded-full ${textBase}`}></div>
                <div className="flex gap-2">
                    <div className={`w-4 h-2 rounded-full ${textBase}`}></div>
                    <div className={`w-4 h-2 rounded-full ${textBase}`}></div>
                    <div className={`w-4 h-2 rounded-full ${textBase}`}></div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="flex gap-4 mb-4">
                <div className="flex-1 space-y-2 py-2">
                    <div className={`w-3/4 h-3 rounded ${textBase}`}></div>
                    <div className={`w-1/2 h-3 rounded ${textBase}`}></div>
                    <div className={`w-1/3 h-5 rounded mt-2 ${accentBase} opacity-50`}></div>
                </div>
                <div className={`w-1/3 aspect-video rounded-md ${textBase}`}></div>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-3 gap-2 mt-auto">
                <div className={`aspect-square rounded-md ${textBase}`}></div>
                <div className={`aspect-square rounded-md ${textBase}`}></div>
                <div className={`aspect-square rounded-md ${textBase}`}></div>
            </div>
        </div>
    );
}

function TemplateCard({
    template,
    onSelect
}: {
    template: Template;
    onSelect: (t: Template) => void;
}) {
    // Dynamic color based on category
    const getCategoryColor = (cat: string) => {
        const colors: Record<string, string> = {
            'Retail': 'from-orange-50 to-rose-50',
            'Food': 'from-yellow-50 to-orange-50',
            'Service': 'from-blue-50 to-cyan-50',
            'Digital': 'from-purple-900 to-indigo-900', // Darker for Digital
            'Events': 'from-pink-50 to-rose-50',
            'Education': 'from-sky-50 to-indigo-50',
            'B2B': 'from-slate-50 to-gray-50',
            'Real Estate': 'from-emerald-50 to-teal-50',
            'Nonprofit': 'from-green-50 to-emerald-50',
            'Marketplace': 'from-indigo-50 to-blue-50',
        };
        return colors[cat] || 'from-gray-50 to-gray-100';
    };

    const colorClass = getCategoryColor(template.category || '');

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -8 }}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer relative flex flex-col"
            onClick={() => onSelect(template)}
        >
            {/* New Badge */}
            {(template.slug.includes('fashion') || template.slug.includes('give') || template.slug.includes('estate') || template.slug.includes('sound')) && (
                <div className="absolute top-3 left-3 z-10 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest shadow-lg">
                    New
                </div>
            )}

            {/* Browser Frame Header */}
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-1.5 h-9">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                <div className="ml-4 flex-1 bg-white h-5 rounded-md border border-gray-200 opacity-50 text-[8px] flex items-center px-2 text-gray-400 truncate">
                    vayva.com/templates/{template.slug}
                </div>
            </div>

            {/* Thumbnail / Preview Area */}
            <div className={`relative aspect-[16/10] bg-gradient-to-br ${colorClass} overflow-hidden group-hover:border-b-4 group-hover:border-blue-500 transition-all`}>
                {template.preview?.thumbnailUrl ? (
                    <img
                        src={template.preview.thumbnailUrl}
                        alt={template.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 group-hover:translate-y-1"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none'; // Fallback to mini-site
                        }}
                    />
                ) : (
                    <MiniSitePreview template={template} colorClass={colorClass} />
                )}

                {/* Hover Action Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                        <ArrowRight className="w-5 h-5 text-black" />
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{template.name}</h3>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{template.registry?.businessModel || "Business"}</p>
                    </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mt-auto leading-relaxed opacity-80">{template.description}</p>
            </div>
        </motion.div>
    );
}

function TemplateModal({
    template,
    onClose
}: {
    template: Template;
    onClose: () => void;
}) {
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

    if (!template) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                layoutId={`modal-${template.id}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Left: Preview (Scrollable) */}
                <div className={`w-full md:w-2/3 bg-gray-100 flex flex-col relative overflow-y-auto overflow-x-hidden transition-all duration-500 ease-in-out ${viewMode === 'mobile' ? 'p-8 items-center justify-center' : ''
                    }`}>

                    {/* Controls / Device Toggle Hint */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                        <div className="bg-white/90 backdrop-blur rounded-full shadow-sm border border-gray-200 p-1 flex">
                            <button
                                onClick={() => setViewMode('desktop')}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'desktop' ? 'bg-[#0F172A] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                <Monitor className="w-3 h-3" /> Desktop
                            </button>
                            <button
                                onClick={() => setViewMode('mobile')}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'mobile' ? 'bg-[#0F172A] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                <Smartphone className="w-3 h-3" /> Mobile
                            </button>
                        </div>
                    </div>

                    {/* IFRAME: Live Code Execution */}
                    <motion.div
                        layout
                        className={`transition-all duration-500 ease-in-out shadow-2xl bg-white overflow-hidden relative ${viewMode === 'mobile'
                            ? 'w-[430px] h-[932px] rounded-[55px] border-[12px] border-[#1a1a1a] scale-[0.85] origin-center'
                            : 'w-full h-full rounded-none border-0'
                            }`}
                    >
                        <iframe
                            src={`/templates/preview/${template.id}`}
                            className="w-full h-full border-0 bg-white"
                            title={`Preview of ${template.name}`}
                        />

                        {/* Home Indicator */}
                        {viewMode === 'mobile' && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[130px] h-[5px] bg-black/80 rounded-full z-20 pointer-events-none" />
                        )}
                    </motion.div>
                </div>
                {/* Right: Details */}
                <div className="w-full md:w-1/3 p-8 border-l border-gray-100 flex flex-col h-full bg-white">
                    <div className="flex-1">
                        <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-[#22C55E] text-xs font-bold uppercase tracking-wider mb-4">
                            {template.category}
                        </span>
                        <h2 className="text-3xl font-bold text-[#0F172A] mb-4">{template.name}</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {template.description}
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-[#0F172A] mb-3">Best For</h4>
                                <div className="flex flex-wrap gap-2">
                                    {/* Accessing internal registry details safely */}
                                    {(template.registry.compare?.bestFor || []).map((item: string) => (
                                        <span key={item} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-[#0F172A] mb-3">Key Features</h4>
                                <ul className="space-y-2">
                                    {template.features.slice(0, 4).map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                            <Check className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 mt-8 border-t border-gray-100">
                        <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/signup?template=${template.slug}`}>
                            <Button className="w-full h-12 text-lg bg-[#0F172A] hover:bg-[#1E293B] text-white">
                                Start with {template.name} <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// --- Main Page ---

export default function TemplatesPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    // Load templates
    const allTemplates = getNormalizedTemplates();

    // Filter logic
    const filteredTemplates = activeCategory === "All"
        ? allTemplates
        : allTemplates.filter(t => t.category === activeCategory);

    return (
        <div className="min-h-screen bg-gray-50/50">

            {/* 1. Hero */}
            <section className="pt-32 pb-12 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto"
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-[#0F172A] mb-6 tracking-tight">
                        Choose your <span className="text-[#22C55E]">starting point</span>.
                    </h1>
                    <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
                        Professional, mobile-first templates designed for Nigerian businesses.
                        Start with any specific industry design and customize it freely.
                    </p>
                </motion.div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                    <FilterPill
                        label="All Templates"
                        isActive={activeCategory === "All"}
                        onClick={() => setActiveCategory("All")}
                    />
                    {TEMPLATE_CATEGORIES.filter(c => c.isActive).map((cat) => (
                        <FilterPill
                            key={cat.slug}
                            label={cat.displayName}
                            isActive={activeCategory === cat.slug}
                            onClick={() => setActiveCategory(cat.slug)}
                        />
                    ))}
                </div>
            </section>

            {/* 2. Grid */}
            <section className="px-6 pb-24 max-w-7xl mx-auto">
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence>
                        {filteredTemplates.map((template) => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                onSelect={setSelectedTemplate}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredTemplates.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400">No templates found for this category.</p>
                    </div>
                )}
            </section>

            {/* 3. Modal */}
            <AnimatePresence>
                {selectedTemplate && (
                    <TemplateModal
                        template={selectedTemplate}
                        onClose={() => setSelectedTemplate(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
