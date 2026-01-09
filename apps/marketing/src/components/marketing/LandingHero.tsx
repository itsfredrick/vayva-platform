"use client";

import React from "react";
import Image from "next/image";
import * as motion from "framer-motion/client";
import { MessageSquareText } from "lucide-react";
import { PremiumButton } from "@/components/marketing/PremiumButton";
import { HeroDownloadButton } from "@/components/marketing/HeroDownloadButton";
import { APP_URL } from "@/lib/constants";

interface LandingHeroProps {
    headline: string;
    sub: string;
}

export function LandingHero({ headline, sub }: LandingHeroProps) {
    return (
        <section className="pt-12 pb-20 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto text-center"
            >
                {/* Status Pill */}
                <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 mb-8">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                    <span className="text-sm text-gray-600 font-medium">
                        Vayva Platform v1.0
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-[#0F172A] mb-8 leading-[1.1] tracking-tight">
                    {headline}
                </h1>

                <p className="text-xl text-[#64748B] mb-10 max-w-3xl mx-auto leading-relaxed">
                    {sub}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 items-center">
                    <a href={`${APP_URL}/signup`}>
                        <PremiumButton data-testid="landing-get-started">
                            Start selling for free
                        </PremiumButton>
                    </a>
                    <HeroDownloadButton />
                </div>

                {/* Mini-Preview / "Aha!" Moment */}
                <div className="relative max-w-5xl mx-auto mb-20">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#22C55E] to-blue-500 rounded-[40px] blur opacity-20 animate-pulse"></div>
                    <div className="relative bg-white border border-gray-100 rounded-[40px] shadow-2xl p-4 md:p-8">
                        <div className="aspect-[16/10] md:aspect-[16/8] bg-gray-50 rounded-[32px] overflow-hidden relative border border-gray-100">
                            <Image
                                src="/images/dashboard-demo-alt.png"
                                alt="Vayva AI Demo"
                                fill
                                priority
                                className="object-cover"
                            />
                            {/* Floating Notification Simulation */}
                            <motion.div
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 2, duration: 0.5 }}
                                className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-green-100 max-w-[240px]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                        <MessageSquareText className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Incoming Order</p>
                                        <p className="text-sm font-bold text-gray-900">Captured via WhatsApp AI</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
                    Trusted by modern businesses
                </p>

                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                    <Image
                        src="/logos/partner-paystack.png"
                        alt="Paystack"
                        width={120}
                        height={40}
                        className="h-8 w-auto object-contain"
                    />
                    <Image
                        src="/logos/youverify_logo.png"
                        alt="YouVerify"
                        width={120}
                        height={40}
                        className="h-8 w-auto object-contain"
                    />
                    <Image
                        src="/logos/123design_logo.jpg"
                        alt="123Design"
                        width={120}
                        height={40}
                        className="h-10 w-auto object-contain mix-blend-multiply"
                    />
                    <Image
                        src="/logos/oral4_logo.png"
                        alt="Oral4"
                        width={120}
                        height={40}
                        className="h-10 w-auto object-contain mix-blend-multiply"
                    />
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-sm text-[#64748B] font-medium mt-12">
                    <span className="flex items-center gap-2"> Secured Payments </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></span>
                    <span className="flex items-center gap-2"> Identity Verified </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></span>
                    <span className="flex items-center gap-2 text-green-500 font-bold"> No card required </span>
                </div>
            </motion.div>
        </section>
    );
}
