'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function StoreBuilderPage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Hero */}
                <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
                    <div>
                        <span className="text-blue-400 font-bold tracking-wide uppercase mb-4 block">Online Store Builder</span>
                        <h1 className="text-5xl font-bold text-white mb-6">Your brand, your website.<br /> No code required.</h1>
                        <p className="text-xl text-white/60 mb-8 leading-relaxed">
                            Create a stunning, mobile-optimized online store that looks exactly how you want.
                            Customize themes, manage pages, and connect your own domain in minutes.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/auth/signup">
                                <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-12 px-8 rounded-full">
                                    Start Building
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 p-2 rotated-3d">
                            {/* Mockup Placeholder */}
                            <div className="w-full h-full bg-[#0b141a] rounded-xl flex items-center justify-center border border-white/5">
                                <span className="text-white/20">Store Preview UI</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features List */}
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: 'Mobile First', desc: 'Every theme is designed to look perfect on phones, where 90% of your customers are.' },
                        { title: 'Custom Domains', desc: 'Connect your own .com or .ng domain for a professional look.' },
                        { title: 'Fast Checkout', desc: 'Optimized checkout flow designed to reduce abandoned carts in Nigeria.' }
                    ].map((item, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                            <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                            <p className="text-white/50">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
