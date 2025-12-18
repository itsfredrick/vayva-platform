"use client";

import React from 'react';
import { Container } from '../../ui/container';
import { ChevronDown } from 'lucide-react';

const FAQS = [
    { q: "Do I need to know how to code?", a: "Not at all. Vayva is designed for non-techies. If you can use WhatsApp, you can use Vayva." },
    { q: "How do I get paid?", a: "We integrate directly with Paystack. Payments go straight to your bank account within 24 hours of settlement." },
    { q: "Is the WhatsApp AI really automated?", a: "Yes. Our AI reads customer messages and suggests replies or sends them automatically based on your settings. You can always take over manually." },
    { q: "Can I use my own domain?", a: "Yes, Growth and Pro plans allow you to connect a custom domain (e.g., yourstore.com)." }
];

export function TrustAndFAQ() {
    return (
        <section className="py-24 bg-gray-50 border-t border-gray-100">
            <Container>
                <div className="grid md:grid-cols-2 gap-16">
                    {/* Left: Trust */}
                    <div>
                        <h2 className="font-heading text-3xl font-bold mb-6">
                            Your Safety Net.
                        </h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            We know trust is everything in Nigerian commerce. That&apos;s why we&apos;ve built safety into every step.
                        </p>
                        <div className="grid gap-4">
                            {[
                                "Bank-grade security via Paystack",
                                "Verified Seller Badges (Marketplace)",
                                "Local Support Team based in Lagos",
                                "99.9% Uptime Guarantee"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-black" />
                                    <span className="font-semibold text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: FAQ */}
                    <div>
                        <h3 className="font-bold text-xl mb-6">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            {FAQS.map((faq, i) => (
                                <details key={i} className="group bg-white rounded-xl border border-gray-100 open:shadow-md transition-all">
                                    <summary className="flex items-center justify-between p-5 font-medium cursor-pointer list-none">
                                        {faq.q}
                                        <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
