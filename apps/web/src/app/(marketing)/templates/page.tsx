'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

const THEMES = [
    { name: 'Aurora', category: 'Fashion', image: 'bg-pink-500/20' },
    { name: 'Onyx', category: 'Electronics', image: 'bg-blue-500/20' },
    { name: 'Sage', category: 'Home & Living', image: 'bg-green-500/20' },
    { name: 'Ember', category: 'Beauty', image: 'bg-orange-500/20' },
    { name: 'Obsidian', category: 'Luxury', image: 'bg-black/50' },
    { name: 'Cobalt', category: 'Services', image: 'bg-indigo-500/20' },
];

export default function TemplatesPage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Start with style.</h1>
                    <p className="text-xl text-white/60 mb-8">
                        Choose from our professionally designed themes. Fully customizable and optimized for mobile.
                    </p>

                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {['All', 'Fashion', 'Electronics', 'Beauty', 'Food', 'Services'].map((filter, i) => (
                            <button key={filter} className={`px-5 py-2 rounded-full text-sm font-bold border ${i === 0 ? 'bg-white text-black border-white' : 'bg-transparent text-white border-white/20 hover:border-white/50'}`}>
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {THEMES.map((theme) => (
                        <div key={theme.name} className="group cursor-pointer">
                            <div className={`aspect-[3/4] rounded-2xl ${theme.image} border border-white/10 mb-6 relative overflow-hidden`}>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity">
                                    <Button className="rounded-full font-bold">Preview Theme</Button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{theme.name}</h3>
                                    <p className="text-white/50 text-sm">{theme.category}</p>
                                </div>
                                <Link href="/auth/signup">
                                    <span className="text-sm font-bold text-[#46EC13] group-hover:underline">Use this theme</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
