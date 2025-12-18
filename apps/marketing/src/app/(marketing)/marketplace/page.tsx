import React from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Check, ShoppingBag, Store } from 'lucide-react';

export default function MarketplacePage() {
    return (
        <section className="min-h-[80vh] flex items-center justify-center py-20 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-grid-gray-100/[0.2] mask-gradient-to-b" />

            <Container className="relative z-10">
                <div className="max-w-4xl mx-auto rounded-3xl bg-black text-white p-8 md:p-16 text-center border border-white/10 shadow-2xl relative overflow-hidden">

                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 to-black -z-10" />

                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-semibold mb-8 backdrop-blur-md">
                        Coming Soon to Nigeria 🇳🇬
                    </span>

                    <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        Vayva Market.
                    </h1>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        A centralized marketplace built for trust. Sellers get verified badges, and buyers get AI-powered recommendations.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto text-left">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <Store className="w-8 h-8 mb-4 text-green-400" />
                            <h3 className="font-bold text-lg mb-2">For Sellers</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-center gap-2"><Check size={14} className="text-white" /> Instant access to millions of buyers</li>
                                <li className="flex items-center gap-2"><Check size={14} className="text-white" /> Verified Merchant Badge</li>
                                <li className="flex items-center gap-2"><Check size={14} className="text-white" /> Lower transaction fees</li>
                            </ul>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <ShoppingBag className="w-8 h-8 mb-4 text-blue-400" />
                            <h3 className="font-bold text-lg mb-2">For Buyers</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-center gap-2"><Check size={14} className="text-white" /> AI Product Comparison</li>
                                <li className="flex items-center gap-2"><Check size={14} className="text-white" /> Escrow protection on payments</li>
                                <li className="flex items-center gap-2"><Check size={14} className="text-white" /> Verified authentic products</li>
                            </ul>
                        </div>
                    </div>

                    <div className="max-w-md mx-auto bg-white/10 p-2 rounded-full border border-white/10 flex items-center">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="bg-transparent border-none outline-none text-white px-4 py-2 flex-1 placeholder:text-gray-500"
                        />
                        <Button className="rounded-full bg-white text-black hover:bg-gray-200 px-6 h-10">
                            Join Waitlist
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">We&apos;ll notify you when we go live. No spam.</p>

                </div>
            </Container>
        </section>
    );
}
