'use client';

import React, { useState } from 'react';
import { Button } from '@vayva/ui';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MarketplaceWaitlistPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
        }, 800);
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#46EC13]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto text-center relative z-10"
            >
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-8">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Coming Soon</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 mb-6 pb-2">
                    Vayva Marketplace
                </h1>

                <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-lg mx-auto">
                    The first AI-powered marketplace for African commerce.
                    Compare prices, find trusted merchants, and shop with confidence.
                </p>

                {submitted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-50 border border-green-200 rounded-2xl p-8 max-w-md mx-auto"
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">You're on the list!</h3>
                        <p className="text-gray-500">We'll notify you when we open the doors.</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 h-14 px-6 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#46EC13] focus:border-transparent transition-all w-full text-base"
                        />
                        <Button
                            type="submit"
                            className="h-14 px-8 rounded-full bg-[#1d1d1f] hover:bg-black text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                        >
                            Join Waitlist
                        </Button>
                    </form>
                )}
            </motion.div>

            {/* Subtle Legal Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-0 right-0 flex justify-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest z-10"
            >
                <Link href="/legal/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
                <Link href="/legal/acceptable-use" className="hover:text-black transition-colors">Acceptable Use</Link>
            </motion.div>
        </div>
    );
}
