'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function MarketingHomePage() {
    return (
        <div className="w-full">
            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex items-center justify-center pt-10 pb-20 px-4 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center relative z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#46EC13] text-sm font-bold tracking-wide mb-6 uppercase">
                            Commerce for Africa
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
                            Sell online in Nigeria <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#46EC13] to-emerald-400">
                                faster than you think.
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
                            The complete toolkit for modern merchants. Build your store, automate WhatsApp sales, and manage deliveries in one place.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href="/auth/signup">
                                <Button className="bg-[#46EC13] hover:bg-[#3DD10F] text-black font-bold h-14 px-10 rounded-full text-lg shadow-[0_0_40px_-10px_rgba(70,236,19,0.4)] transition-all transform hover:scale-105">
                                    Create free account
                                </Button>
                            </Link>
                            <Link href="/demo">
                                <Button variant="outline" className="border-white/20 hover:bg-white/5 text-white h-14 px-8 rounded-full text-lg">
                                    <Icon name="play_circle" className="mr-2" />
                                    See how it works
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Dashboard Mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="mt-20 relative mx-auto max-w-4xl"
                    >
                        <div className="bg-[#0b141a] rounded-2xl border border-white/10 p-2 shadow-2xl">
                            <div className="bg-[#142210] rounded-xl overflow-hidden border border-white/5 aspect-[16/9] relative group">
                                {/* Placeholder for actual dashboard screenshot */}
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#142210] to-[#0f1a14]">
                                    <div className="text-center">
                                        <Icon name="dashboard" size={64} className="text-white/10 mb-4 mx-auto" />
                                        <p className="text-white/30 font-mono text-sm">Vayva Admin Dashboard</p>
                                    </div>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#46EC13]/10 to-transparent opacity-50" />
                            </div>
                        </div>

                        {/* Floating elements for visual interest */}
                        <div className="absolute -right-12 top-20 w-64 p-4 bg-[#142210]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl hidden md:block animate-float">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-[#46EC13]/20 flex items-center justify-center text-[#46EC13]">
                                    <Icon name="attach_money" />
                                </div>
                                <div>
                                    <p className="text-xs text-white/50">New Order</p>
                                    <p className="font-bold text-white">₦ 45,000.00</p>
                                </div>
                            </div>
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-[70%] bg-[#46EC13]" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* TRUST STRIP */}
            <section className="py-10 border-y border-white/5 bg-[#0b141a]/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Replace with actual logos later */}
                        {['Paystack', 'Flutterwave', 'GIG Logistics', 'Meta'].map((brand) => (
                            <div key={brand} className="text-white font-bold text-xl flex items-center gap-2">
                                <div className="w-6 h-6 bg-white/20 rounded-full" /> {brand}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES GRID */}
            <section className="py-32 px-4 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Everything you need to <br /> scale your business.</h2>
                        <p className="text-xl text-white/50">Forget juggling 5 different apps. Vayva brings your store, payments, and logistics into one command center.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: 'storefront',
                                title: 'Store Builder',
                                desc: 'Create a professional online store in minutes. No coding required.',
                                link: '/features/store-builder'
                            },
                            {
                                icon: 'chat',
                                title: 'WhatsApp AI',
                                desc: 'Automate customer support and sales directly on WhatsApp.',
                                link: '/features/whatsapp'
                            },
                            {
                                icon: 'local_shipping',
                                title: 'Logistics',
                                desc: 'Integrated delivery partners to get your products moving fast.',
                                link: '/features/marketplace' // Placeholder link
                            }
                        ].map((feature, i) => (
                            <Link href={feature.link} key={i}>
                                <div className="group h-full bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-[#46EC13]/30 transition-all duration-300">
                                    <div className="w-14 h-14 bg-[#46EC13]/10 text-[#46EC13] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Icon name={feature.icon} size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                                    <p className="text-white/60 leading-relaxed mb-6">{feature.desc}</p>
                                    <span className="text-[#46EC13] font-bold text-sm flex items-center gap-2">
                                        Learn more <Icon name="arrow_forward" size={16} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-32 px-4 bg-gradient-to-b from-[#142210] to-[#0b141a]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div>
                            <span className="text-[#46EC13] font-bold tracking-wide uppercase mb-4 block">How it works</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">From idea to <br /> first sale in minutes.</h2>

                            <div className="space-y-12">
                                {[
                                    { title: 'Create your store', desc: 'Sign up and choose a template that fits your brand.' },
                                    { title: 'Add products', desc: 'Upload your inventory, set prices, and manage variants.' },
                                    { title: 'Start selling', desc: 'Share your link and accept payments instantly.' }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-6">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white font-bold text-xl">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                                            <p className="text-white/50">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-3xl bg-white/5 border border-white/10 p-8 rotate-3 shadow-2xl">
                                {/* Visual placeholder for step-by-step UI */}
                                <div className="w-full h-full bg-[#142210] rounded-2xl border border-white/5 flex items-center justify-center">
                                    <span className="text-white/20">UI Walkthrough Animation</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA STRIP */}
            <section className="py-32 px-4">
                <div className="max-w-5xl mx-auto text-center bg-gradient-to-br from-[#46EC13]/20 to-[#142210] border border-white/10 rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to grow your business?</h2>
                        <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">Join thousands of Nigerian merchants using Vayva to power their commerce.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/auth/signup">
                                <Button className="bg-[#46EC13] hover:bg-[#3DD10F] text-black font-bold h-14 px-12 rounded-full text-lg">
                                    Get Started for Free
                                </Button>
                            </Link>
                        </div>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#46EC13]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                </div>
            </section>
        </div>
    );
}
