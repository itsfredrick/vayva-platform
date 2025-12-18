'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@vayva/ui';

interface AuthLeftPanelProps {
    showSignInLink?: boolean;
    showSignUpLink?: boolean;
}

export const AuthLeftPanel = ({ showSignInLink, showSignUpLink }: AuthLeftPanelProps) => {
    return (
        <div className="hidden lg:flex lg:w-[40%] bg-[#F8F9FA] flex-col justify-between p-12 relative overflow-hidden">
            {/* Subtle decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0D1D1E]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0D1D1E]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            {/* Top: Logo */}
            <div className="relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
                        <Icon name="Store" className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-heading font-bold text-black">
                        Vayva
                    </span>
                </Link>
            </div>

            {/* Center: Image and messaging */}
            <div className="relative z-10 flex flex-col items-start justify-center flex-1 py-12">
                {/* Placeholder illustration - will be replaced with actual image */}
                <div className="w-full max-w-md mb-8">
                    <div className="aspect-square bg-gradient-to-br from-[#0D1D1E]/10 to-[#0D1D1E]/5 rounded-3xl flex items-center justify-center">
                        <Icon name="Smartphone" className="w-32 h-32 text-[#0D1D1E]/20" />
                    </div>
                </div>

                {/* Headline */}
                <h2 className="text-3xl font-heading font-bold text-black mb-4 leading-tight">
                    Get yourself a storefront + WhatsApp AI
                </h2>

                {/* Subtext */}
                <p className="text-lg text-black/60 mb-6 leading-relaxed">
                    Start selling online in minutes. No technical skills required.
                    Your customers can shop and chat with AI assistance.
                </p>

                {/* Carousel dots (static for now) */}
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-black" />
                    <div className="w-2 h-2 rounded-full bg-black/20" />
                    <div className="w-2 h-2 rounded-full bg-black/20" />
                </div>
            </div>

            {/* Bottom: Navigation links */}
            <div className="relative z-10 flex items-center justify-between text-sm">
                <Link
                    href="/"
                    className="text-[#0D1D1E] hover:text-black font-medium transition-colors flex items-center gap-1"
                >
                    <Icon name="ArrowLeft" className="w-4 h-4" />
                    Back to home
                </Link>

                {showSignInLink && (
                    <Link
                        href="/signin"
                        className="text-[#0D1D1E] hover:text-black font-medium transition-colors"
                    >
                        Sign in
                    </Link>
                )}

                {showSignUpLink && (
                    <Link
                        href="/signup"
                        className="text-[#0D1D1E] hover:text-black font-medium transition-colors"
                    >
                        Create account
                    </Link>
                )}
            </div>
        </div>
    );
};
