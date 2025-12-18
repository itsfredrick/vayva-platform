'use client';

import { motion } from 'framer-motion';
import { Eye, Rocket } from 'lucide-react';
import Image from 'next/image';

interface TemplateCardProps {
    template: {
        id: string;
        name: string;
        description: string | null;
        tags: string[];
        stars: number;
        previewImage: string | null;
        licenseName: string | null;
    };
    onPreview: () => void;
}

export function TemplateCard({ template, onPreview }: TemplateCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
        >
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                {template.previewImage ? (
                    <Image
                        src={template.previewImage}
                        alt={template.name}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        No Preview
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button
                        onClick={onPreview}
                        className="bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                    >
                        <Eye className="w-4 h-4" /> Preview
                    </button>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{template.name}</h3>
                    {template.stars > 0 && (
                        <div className="flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-50 px-2 py-1 rounded-full">
                            ★ {template.stars}
                        </div>
                    )}
                </div>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                    {template.description || 'A professional Vayva store template.'}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex gap-2">
                        {template.licenseName && (
                            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded">
                                {template.licenseName}
                            </span>
                        )}
                    </div>
                    {/* Placeholder for Apply button if needed directly on card */}
                </div>
            </div>
        </motion.div>
    );
}
