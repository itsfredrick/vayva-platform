"use client";

import React from 'react';
import { Container } from '../../ui/container';
import { UserPlus, Upload, Share2 } from 'lucide-react';

const STEPS = [
    {
        icon: UserPlus,
        title: "Create Account",
        text: "Sign up in 30 seconds. Verify your identity (KYC) to ensure fast payouts."
    },
    {
        icon: Upload,
        title: "Upload & Connect",
        text: "Add your products and connect your WhatsApp Business number seamlessly."
    },
    {
        icon: Share2,
        title: "Share & Sell",
        text: "Share your store link. Our AI handles customer questions, and you get paid instantly."
    }
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-gray-50 border-t border-gray-100">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                        From Idea to First Sale in 15 Minutes.
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10" />

                    {STEPS.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-white rounded-full border-4 border-gray-50 flex items-center justify-center shadow-sm mb-6 relative">
                                <step.icon className="text-black" size={32} />
                                <div className="absolute -top-1 -right-1 w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white">
                                    {idx + 1}
                                </div>
                            </div>
                            <h3 className="font-bold text-xl mb-3">{step.title}</h3>
                            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                                {step.text}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
