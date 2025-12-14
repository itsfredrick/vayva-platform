'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Use our new utility

const PLANS = [
    {
        name: 'Starter',
        price: 'Free',
        period: '',
        description: 'Perfect for testing the waters.',
        features: [
            '1 Online Store',
            'Up to 10 Products',
            'Basic Analytics',
            'Standard Support'
        ],
        cta: 'Start Free',
        popular: false
    },
    {
        name: 'Growth',
        price: '₦ 5,000',
        period: '/month',
        description: 'For growing businesses ready to scale.',
        features: [
            'Everything in Starter',
            'Unlimited Products',
            'WhatsApp Automation (100 chats)',
            'Custom Domain',
            'Lower Transaction Fees'
        ],
        cta: 'Start Trial',
        popular: true
    },
    {
        name: 'Pro',
        price: '₦ 15,000',
        period: '/month',
        description: 'Power users with high volume.',
        features: [
            'Everything in Growth',
            'Priority Support',
            'WhatsApp Automation (Unlimited)',
            'Advanced Reporting',
            'Staff Accounts (5)'
        ],
        cta: 'Contact Sales',
        popular: false
    }
];

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Simple, transparent pricing.</h1>
                    <p className="text-xl text-white/60 mb-8">No hidden fees. Cancel anytime.</p>

                    {/* Toggle */}
                    <div className="inline-flex items-center gap-4 bg-white/5 p-1 rounded-full border border-white/10">
                        <button
                            className={cn("px-6 py-2 rounded-full text-sm font-bold transition-all", !isYearly ? "bg-white/10 text-white" : "text-white/50")}
                            onClick={() => setIsYearly(false)}
                        >
                            Monthly
                        </button>
                        <button
                            className={cn("px-6 py-2 rounded-full text-sm font-bold transition-all", isYearly ? "bg-white/10 text-white" : "text-white/50")}
                            onClick={() => setIsYearly(true)}
                        >
                            Yearly <span className="text-[#46EC13] text-[10px] ml-1">SAVE 20%</span>
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.name}
                            className={cn(
                                "relative bg-[#0b141a] border rounded-3xl p-8 flex flex-col",
                                plan.popular ? "border-[#46EC13] shadow-[0_0_30px_-10px_rgba(70,236,19,0.2)]" : "border-white/10"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#46EC13] text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-white/50 text-sm h-10">{plan.description}</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    <span className="text-white/50">{plan.period}</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-3 text-sm text-white/80">
                                        <Icon name="check" size={16} className="text-[#46EC13]" />
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <Link href="/auth/signup" className="w-full">
                                <Button
                                    className={cn(
                                        "w-full h-12 rounded-full font-bold",
                                        plan.popular ? "bg-[#46EC13] hover:bg-[#3DD10F] text-black" : "bg-white/10 hover:bg-white/20 text-white"
                                    )}
                                >
                                    {plan.cta}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* FAQ Snippet */}
                <div className="mt-32 max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h3>
                    <div className="space-y-6">
                        {[
                            { q: 'Is there a free trial?', a: 'Yes, the Growth plan comes with a 14-day free trial. No credit card required.' },
                            { q: 'Can I change plans anytime?', a: 'Absolutely. You can upgrade or downgrade your plan from the dashboard billing settings.' },
                            { q: 'What payment methods do you accept?', a: 'We accept all major Nigerian cards, bank transfers, and USSD via Paystack.' }
                        ].map((item, i) => (
                            <div key={i} className="border-b border-white/5 pb-6">
                                <h4 className="font-bold text-white mb-2">{item.q}</h4>
                                <p className="text-white/50 text-sm">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
