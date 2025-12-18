'use client';

import { motion } from 'framer-motion';
import { X, Check, ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';

interface TemplatePreviewModalProps {
    template: any;
    onClose: () => void;
}

export function TemplatePreviewModal({ template, onClose }: TemplatePreviewModalProps) {
    const handleUseTemplate = () => {
        // Redirect to signup with template param
        window.location.href = `/signup?template=${template.slug}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
                <div className="relative w-full md:w-2/3 h-64 md:h-full bg-gray-100 overflow-y-auto custom-scrollbar">
                    {template.previewImage ? (
                        <Image
                            src={template.previewImage}
                            alt={template.name}
                            width={1200}
                            height={800}
                            className="w-full h-auto"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            No Preview Available
                        </div>
                    )}
                </div>

                <div className="w-full md:w-1/3 bg-white p-8 flex flex-col border-l border-gray-100">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>

                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{template.name}</h2>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {template.tags.map((tag: string) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {template.description || 'A modern, high-performance template optimized for conversion.'}
                    </p>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>Mobile Optimized</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>SEO Ready</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>Free License ({template.licenseName})</span>
                        </div>
                    </div>

                    <div className="mt-auto space-y-3">
                        <button
                            onClick={handleUseTemplate}
                            className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Use This Template
                        </button>

                        <a
                            href={template.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors"
                        >
                            <Github className="w-4 h-4" /> View Source Code
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
