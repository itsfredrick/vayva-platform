'use client';

import React from 'react';

interface MarketingShellProps {
    children: React.ReactNode;
    className?: string;
}

export function MarketingShell({ children, className = '' }: MarketingShellProps) {
    return (
        <div className={`min-h-screen bg-[#142210] text-white font-sans ${className}`}>
            {/* Global Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Top-right green glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#46EC13]/5 rounded-full blur-[120px]" />
                {/* Bottom-left blue glow */}
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
                {/* Soft Vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#142210]/20 to-[#142210]/80" />
            </div>

            {/* Content Content - strictly z-indexed above background */}
            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    );
}
