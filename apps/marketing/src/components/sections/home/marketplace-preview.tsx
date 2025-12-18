"use client";

import React from 'react';
import { Container } from '../../ui/container';
import { Button } from '../../ui/button';
import Link from 'next/link';

export function MarketplacePreview() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <Container>
                <div className="bg-black rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-800 to-black opacity-50" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-6">
                            Vayva Market
                        </span>
                        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
                            Expand Your Reach on Vayva Market.
                        </h2>
                        <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                            Stop chasing customers one by one. List your products on Vayva&apos;s verified marketplace and get discovered by thousands of Nigerian shoppers instantly.
                        </p>

                        <div className="flex justify-center">
                            <Link href="/marketplace">
                                <Button className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12 text-base font-semibold">
                                    Join the Waitlist
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mock Cards at bottom acting as decorative elements */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50 rotate-3 scale-110">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-sm">
                                <div className="aspect-square bg-white/5 rounded-lg mb-2" />
                                <div className="h-2 w-20 bg-white/10 rounded mb-1" />
                                <div className="h-2 w-12 bg-white/10 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
