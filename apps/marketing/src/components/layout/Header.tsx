"use client";

import Link from "next/link";
import { MagneticButton } from "@/components/MagneticButton";
import { ROUTES } from "@/lib/routes";

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-xl border-b border-slate-900/10 transition-all duration-300">
            <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                <Link
                    href={ROUTES.home}
                    className="text-xl font-bold text-[#0B1220] tracking-tight hover:opacity-80 transition-opacity"
                >
                    Vayva
                </Link>
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href={ROUTES.home + "#features"}
                        className="text-sm font-medium text-[#0B1220]/70 hover:text-[#0B1220] transition-colors"
                    >
                        Features
                    </Link>
                    <Link
                        href={ROUTES.templates}
                        className="text-sm font-medium text-[#0B1220]/70 hover:text-[#0B1220] transition-colors"
                    >
                        Templates
                    </Link>
                    <Link
                        href={ROUTES.pricing}
                        className="text-sm font-medium text-[#0B1220]/70 hover:text-[#0B1220] transition-colors"
                    >
                        Pricing
                    </Link>
                    <Link
                        href={ROUTES.home + "#faqs"}
                        className="text-sm font-medium text-[#0B1220]/70 hover:text-[#0B1220] transition-colors"
                    >
                        FAQs
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={ROUTES.login}
                        className="text-sm font-medium text-[#0B1220]/70 hover:text-[#0B1220] px-4 py-2 transition-colors"
                    >
                        Log in
                    </Link>
                    <MagneticButton asChild variant="primary">
                        <Link href={ROUTES.signup}>Get Started</Link>
                    </MagneticButton>
                </div>
            </nav>
        </header>
    );
}
