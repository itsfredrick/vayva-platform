'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const FEATURES = [
    {
        title: 'Online Store Builder',
        description: 'Build a beautiful, mobile-friendly store in minutes. No design skills or coding needed.',
        icon: 'storefront',
        link: '/features/store-builder',
        color: 'text-blue-400',
        bg: 'bg-blue-400/10'
    },
    {
        title: 'WhatsApp Automation',
        description: 'Turn conversations into conversions with our AI-powered WhatsApp sales assistant.',
        icon: 'chat',
        link: '/features/whatsapp',
        color: 'text-[#46EC13]',
        bg: 'bg-[#46EC13]/10'
    },
    {
        title: 'Vayva Market',
        description: 'Get discovered by millions of shoppers on our centralized marketplace.',
        icon: 'public',
        link: '/features/marketplace',
        color: 'text-purple-400',
        bg: 'bg-purple-400/10'
    },
    {
        title: 'Integrated Payments',
        description: 'Accept cards, transfers, and USSD payments instantly. We handle the complexity.',
        icon: 'payments',
        link: '/pricing',
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10'
    },
    {
        title: 'Logistics & Delivery',
        description: 'Access pre-negotiated rates with top logistics partners for seamless shipping.',
        icon: 'local_shipping',
        link: '/features/marketplace', // Placeholder
        color: 'text-orange-400',
        bg: 'bg-orange-400/10'
    },
    {
        title: 'Analytics & Insights',
        description: 'Know what sells. Track revenue, visitor trends, and customer behavior.',
        icon: 'analytics',
        link: '/features/store-builder', // Placeholder
        color: 'text-pink-400',
        bg: 'bg-pink-400/10'
    }
];

export default function FeaturesPage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Hero */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Everything you <br /> need to sell.
                        </h1>
                        <p className="text-xl text-white/60">
                            Vayva is more than just a store builder. It's a complete operating system for your retail business.
                        </p>
                    </motion.div>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link href={feature.link} className="block h-full">
                                <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors group">
                                    <div className={`w-12 h-12 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6`}>
                                        <Icon name={feature.icon} size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#46EC13] transition-colors">{feature.title}</h3>
                                    <p className="text-white/50 leading-relaxed mb-4">{feature.description}</p>
                                    <div className="flex items-center text-sm font-bold text-white/40 group-hover:text-white transition-colors">
                                        Learn more <Icon name="arrow_forward" size={16} className="ml-2" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-32 text-center">
                    <h2 className="text-3xl font-bold text-white mb-8">Ready to get started?</h2>
                    <Link href="/auth/signup">
                        <Button className="bg-[#46EC13] hover:bg-[#3DD10F] text-black font-bold h-12 px-8 rounded-full">
                            Create free account
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
