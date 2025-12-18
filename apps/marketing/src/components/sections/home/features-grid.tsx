"use client";

import React from 'react';
import { Container } from '../../ui/container';
import { Store, MessageSquare, CreditCard, LayoutDashboard, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
    {
        icon: Store,
        title: "Store Builder",
        description: "Create a beautiful, mobile-optimized store in minutes. No design skills needed.",
        link: "/features/store"
    },
    {
        icon: MessageSquare,
        title: "WhatsApp AI Assistant",
        description: "Your 24/7 sales agent. Automatically answer questions and close deals via WhatsApp.",
        link: "/features/whatsapp-ai"
    },
    {
        icon: CreditCard,
        title: "Payments & Logistics",
        description: "Accept card/transfer instantly via Paystack. Automated delivery coordination.",
        link: "/features/payments"
    },
    {
        icon: LayoutDashboard,
        title: "Business Management",
        description: "Track inventory, orders, and customer data in one simple dashboard.",
        link: "/features/store" // Routing to store for general mgmt context
    }
];

export function FeaturesGrid() {
    return (
        <section className="py-24 bg-gray-50 border-t border-b border-gray-100" id="features">
            <Container>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                        Everything You Need to Sell, Without the Tech Headache.
                    </h2>
                    <p className="text-gray-600">
                        We combined the best e-commerce tools into one simple app designed for the way you sell.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURES.map((feature, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-gray-700 transition-colors">{feature.title}</h3>
                            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                                {feature.description}
                            </p>
                            <Link href={feature.link} className="inline-flex items-center text-sm font-semibold text-black hover:underline group/link">
                                Learn more
                                <ArrowRight size={14} className="ml-1 transition-transform group-hover/link:translate-x-1" />
                            </Link>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
