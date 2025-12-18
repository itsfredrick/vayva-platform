'use client';

import { useState } from 'react';
import { TemplateCard } from './template-card';
import { TemplateFilter } from './template-filter';
import { TemplatePreviewModal } from './template-preview-modal';
import { AnimatePresence, motion } from 'framer-motion';

interface Template {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    category: string;
    tags: string[];
    isFree: boolean;
    licenseName: string | null;
    stars: number;
    previewImage: string | null;
    updatedAt: string;
}

interface TemplateGalleryProps {
    initialTemplates: Template[];
}

export function TemplateGallery({ initialTemplates }: TemplateGalleryProps) {
    const [templates, setTemplates] = useState(initialTemplates);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    // Filter logic
    const filteredTemplates = templates.filter(t => {
        const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
        const matchesSearch = !searchQuery ||
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

    return (
        <div className="space-y-8">
            <TemplateFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                    {filteredTemplates.map(template => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            onPreview={() => setSelectedTemplate(template)}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredTemplates.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    No templates found matching your criteria.
                </div>
            )}

            <AnimatePresence>
                {selectedTemplate && (
                    <TemplatePreviewModal
                        template={selectedTemplate}
                        onClose={() => setSelectedTemplate(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
