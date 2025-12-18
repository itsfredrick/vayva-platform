'use client';

import { Search } from 'lucide-react';

interface TemplateFilterProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (c: string) => void;
    searchQuery: string;
    onSearchChange: (q: string) => void;
}

export function TemplateFilter({
    categories,
    selectedCategory,
    onSelectCategory,
    searchQuery,
    onSearchChange
}: TemplateFilterProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-sm">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => onSelectCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category
                                ? 'bg-gray-900 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white/80"
                />
            </div>
        </div>
    );
}
