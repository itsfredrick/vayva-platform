"use client";

import React from 'react';
import Link from 'next/link';
import { Container } from '../../ui/container';
import { Button } from '../../ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
    return (
        <section className="pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-white">
            <Container>
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left: Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-900 mb-6">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Built for Nigerian Businesses
                            </div>
                            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6">
                                Turn Your WhatsApp into a <span className="text-gray-500">Sales Machine.</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Stop juggling DMs and bank transfers. Vayva gives you a professional online store, automated WhatsApp AI support, and instant payments—all in one app.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                                <Link href="/signup" className="w-full sm:w-auto">
                                    <Button size="lg" className="w-full sm:w-auto rounded-full px-8 text-base h-12">
                                        Start My Free Store
                                    </Button>
                                </Link>
                                <Link href="/how-it-works" className="w-full sm:w-auto">
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 text-base h-12 gap-2">
                                        View Demo Store
                                        <ArrowRight size={16} />
                                    </Button>
                                </Link>
                            </div>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-8 text-sm font-medium text-gray-500">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-black" />
                                    Paystack-ready
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-black" />
                                    WhatsApp-first
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-black" />
                                    No coding required
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Visual Mockup */}
                    <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="relative z-10"
                        >
                            {/* Simple CSS-based Phone/Chat Mockup */}
                            <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-white p-6 grid grid-cols-2 gap-4">
                                    {/* Fake Storefront Left */}
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                        <div className="h-3 w-20 bg-gray-200 rounded mb-4" />
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="aspect-square bg-gray-200 rounded" />
                                            <div className="aspect-square bg-gray-200 rounded" />
                                            <div className="aspect-square bg-gray-200 rounded" />
                                            <div className="aspect-square bg-gray-200 rounded" />
                                        </div>
                                    </div>
                                    {/* Fake Chat Right */}
                                    <div className="bg-green-50 rounded-lg p-3 border border-green-100 relative">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-6 h-6 bg-green-600 rounded-full" />
                                            <div className="h-2 w-16 bg-green-200 rounded" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-[10px] text-gray-600">
                                                Hi! Is the red sneaker available?
                                            </div>
                                            <div className="bg-green-600 p-2 rounded-lg rounded-tr-none shadow-sm text-[10px] text-white ml-auto w-3/4">
                                                Yes! We have 2 pairs left in size 42. Want to order?
                                            </div>
                                            <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-[10px] text-gray-600 w-1/2">
                                                Yes please.
                                            </div>
                                        </div>
                                        <div className="absolute bottom-3 left-3 right-3 h-6 bg-white rounded-full border border-gray-200" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        {/* Decorative Blur */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-green-200/30 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
                    </div>
                </div>
            </Container>
        </section>
    );
}
