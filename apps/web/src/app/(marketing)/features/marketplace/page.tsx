'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function MarketplaceFeaturePage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-purple-400 font-bold tracking-wide uppercase mb-4 block">Vayva Market</span>
                    <h1 className="text-5xl font-bold text-white mb-6">Get discovered by millions.</h1>
                    <p className="text-xl text-white/60 mb-8">
                        Don't just sell to your followers. List your products on Vayva Market and reach new customers instantly.
                    </p>
                    <Link href="/auth/signup">
                        <Button className="bg-purple-500 hover:bg-purple-600 text-white font-bold h-12 px-8 rounded-full">
                            Join the Marketplace
                        </Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-12 bg-white/5 border border-white/10 rounded-3xl p-12 items-center">
                    <div>
                        <h3 className="text-3xl font-bold text-white mb-4">How it works</h3>
                        <ul className="space-y-6">
                            {[
                                'Opt-in your products from your dashboard with one click.',
                                'We verify your business to build trust with buyers.',
                                'Customers discover your items on the Vayva Market app.',
                                'We handle the payment and you fulfill the order.'
                            ].map((step, i) => (
                                <li key={i} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm shrink-0">
                                        {i + 1}
                                    </div>
                                    <span className="text-white/80">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-[#0b141a] rounded-2xl border border-white/10 aspect-video flex items-center justify-center">
                        <Icon name="storefront" size={64} className="text-purple-500/30" />
                    </div>
                </div>
            </div>
        </div>
    );
}
