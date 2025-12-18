'use client';

import { ReactNode } from 'react';

/**
 * MarketingShell provides the consistent "Vayva" wrapper for all public pages.
 * It does not include Header/Footer itself because those are in layout.tsx (RootLayout),
 * but it enforces standard page constraints like max-width and internal padding
 * if a page chooses to wrap its main content in it.
 * 
 * However, the prompt says "All marketing pages MUST use MarketingShell".
 * Given layout.tsx already handles Header/Footer globally, MarketingShell might best serve
 * as the "Page Content Wrapper" handling the top-padding compensation and smooth reveal.
 */

import { motion } from 'framer-motion';

interface MarketingShellProps {
    children: ReactNode;
    className?: string;
    animate?: boolean;
}

export function MarketingShell({ children, className = "", animate = true }: MarketingShellProps) {
    return (
        <motion.div
            initial={animate ? { opacity: 0, y: 10 } : undefined}
            animate={animate ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} // Yucca/Typeform smooth ease
            className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 ${className}`}
        >
            {children}
        </motion.div>
    );
}
