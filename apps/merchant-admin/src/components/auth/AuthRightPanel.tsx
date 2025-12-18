'use client';

import React from 'react';
import Link from 'next/link';

interface AuthRightPanelProps {
    children: React.ReactNode;
    stepIndicator?: string; // e.g., "Step 1/2"
    title: string;
    subtitle?: string;
}

export const AuthRightPanel = ({ children, stepIndicator, title, subtitle }: AuthRightPanelProps) => {
    return (
        <div className="flex-1 lg:w-[60%] bg-white flex flex-col">
            {/* Top bar with help link */}
            <div className="h-16 px-6 lg:px-12 flex items-center justify-end border-b border-gray-100">
                <Link
                    href="/help"
                    className="text-sm text-[#0D1D1E] hover:text-black font-medium transition-colors"
                >
                    Having trouble? Get help
                </Link>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-[520px]">
                    {/* Form card */}
                    <div className="bg-white border border-[#E6E6E6] rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 lg:p-10">
                        {/* Step indicator */}
                        {stepIndicator && (
                            <div className="text-xs font-medium text-black/40 uppercase tracking-wider mb-3">
                                {stepIndicator}
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-black mb-3 leading-tight">
                            {title}
                        </h1>

                        {/* Subtitle */}
                        {subtitle && (
                            <p className="text-base text-[#525252] mb-8">
                                {subtitle}
                            </p>
                        )}

                        {/* Form content */}
                        <div>
                            {children}
                        </div>
                    </div>

                    {/* Simple Footer Links - Centered under the card */}
                    <div className="mt-8 flex items-center justify-center gap-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        <Link href="/legal/terms" className="hover:text-black transition-colors">Terms of Service</Link>
                        <div className="w-1 h-1 bg-gray-200 rounded-full" />
                        <Link href="/legal/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
