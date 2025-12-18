"use client";

import React, { useState } from 'react';
import { Container } from '../../ui/container';
import { Button } from '../../ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const PLANS = [
    {
        name: "Starter",
        price: "Free",
        description: "Perfect for testing the waters.",
        features: [
            "5% Transaction Fee",
            "5 Products Limit",
            "vayva.shop Subdomain",
            "Basic Store Builder",
            "4-Day AI Trial"
        ],
        cta: "Start Free",
        href: "/signup",
        popular: false
    },
    {
        name: "Growth",
        price: "₦25,000",
        period: "/mo",
        description: "For serious sellers scaling up.",
        features: [
            "2% Transaction Fee",
            "20 Products",
            "vayva.com.ng Subdomain",
            "Full WhatsApp AI Assistant",
            "Listed on Vayva Market"
        ],
        cta: "Choose Plan",
        href: "/signup?plan=growth",
        popular: true
    },
    {
        name: "Pro",
        price: "₦40,000",
        period: "/mo",
        description: "Maximum power for big brands.",
        features: [
            "1% Transaction Fee",
            "Unlimited Products",
            "Free Custom Domain",
            "Dedicated Account Manager",
            "Verified Merchant Badge"
        ],
        cta: "Choose Plan",
        href: "/signup?plan=pro",
        popular: false
    }
];

export function PricingHome() {
    const [annual, setAnnual] = useState(false);

    return (
        <section className="py-24 bg-white" id="pricing">
            <Container>
                <div className="text-center mb-12">
                    <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                        Simple Pricing for Every Stage.
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Start for free, upgrade as you grow. No hidden fees.
                    </p>

                    {/* Toggle */}
                    <div className="inline-flex items-center gap-4 bg-gray-50 p-1 rounded-full border border-gray-200">
                        <button
                            className={cn("px-6 py-2 rounded-full text-sm font-semibold transition-all", !annual ? "bg-white shadow text-black" : "text-gray-500")}
                            onClick={() => setAnnual(false)}
                        >
                            Monthly
                        </button>
                        <button
                            className={cn("px-6 py-2 rounded-full text-sm font-semibold transition-all relative", annual ? "bg-white shadow text-black" : "text-gray-500")}
                            onClick={() => setAnnual(true)}
                        >
                            Yearly <span className="absolute -top-3 -right-3 bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">Save 20%</span>
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.name}
                            className={cn(
                                "flex flex-col p-8 rounded-2xl border transition-all duration-300 relative bg-white",
                                plan.popular ? "border-black shadow-xl scale-105 z-10" : "border-gray-100 hover:border-gray-200 shadow-sm"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 left-0 -mt-4 flex justify-center">
                                    <span className="bg-black text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                                        Best Value
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                                <p className="text-sm text-gray-500">{plan.description}</p>
                            </div>

                            <div className="mb-8">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                {plan.period && <span className="text-gray-500 font-medium">{plan.period}</span>}
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                {plan.features.map(feature => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <div className="mt-1 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Check size={10} className="text-green-600" />
                                        </div>
                                        <span className="text-sm text-gray-600">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href={plan.href} className="w-full">
                                <Button
                                    className="w-full"
                                    variant={plan.popular ? "default" : "outline"}
                                >
                                    {plan.cta}
                                </Button>
                            </Link>

                            <p className="text-center text-[10px] text-gray-400 mt-4">
                                Paystack payments supported
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
