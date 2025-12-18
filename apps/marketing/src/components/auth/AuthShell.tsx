'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/lib/routes';
import { motion } from 'framer-motion';

interface AuthShellProps {
    children: ReactNode;
    title: string;
    subtitle: string;
    imageSrc?: string;
    topRightLink?: { label: string; href: string };
}

export function AuthShell({
    children,
    title,
    subtitle,
    imageSrc = '/auth/login-bg.png',
    topRightLink
}: AuthShellProps) {
    return (
        <div className="min-h-screen bg-[#F7FAF7] text-[#0B1220] flex flex-col lg:flex-row">
            {/* Left Column: Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 py-12 relative">

                {/* Mobile/Tablet Header: Logo */}
                <div className="absolute top-6 left-6 lg:top-10 lg:left-10">
                    <Link href={ROUTES.home} className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
                        Vayva
                    </Link>
                </div>

                {/* Top Right Action (Mobile/Desktop) */}
                {topRightLink && (
                    <div className="absolute top-6 right-6 lg:top-10 lg:right-10 text-sm">
                        <Link href={topRightLink.href} className="font-medium text-[#22C55E] hover:text-[#16A34A] transition-colors">
                            {topRightLink.label}
                        </Link>
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mx-auto w-full max-w-sm lg:max-w-md mt-16 lg:mt-0"
                >
                    <div className="text-left mb-10">
                        <h2 className="text-3xl font-bold tracking-tight text-[#0B1220] mb-2">{title}</h2>
                        <p className="text-lg text-gray-600">{subtitle}</p>
                    </div>

                    {children}

                    <div className="mt-8 pt-6 border-t border-slate-900/5 text-center text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} Vayva. <Link href={ROUTES.terms} className="hover:underline">Terms</Link> &bull; <Link href={ROUTES.privacy} className="hover:underline">Privacy</Link>
                    </div>
                </motion.div>
            </div>

            {/* Right Column: Image Panel (Hidden on Tablet/Mobile) */}
            <div className="hidden lg:block lg:w-1/2 xl:w-[55%] relative p-4 pl-0">
                <div className="absolute inset-4 left-0 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-900/5">
                    <Image
                        src={imageSrc}
                        alt="Vayva Authentication"
                        fill
                        className="object-cover"
                        priority
                        quality={90}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88/lTPQAJXAN1lX0W4AAAAABJRU5ErkJggg==" // Generic greenish blur
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                    {/* Optional Quote/Testimonial could go here */}
                    <div className="absolute bottom-10 left-10 right-10 text-white">
                        <blockquote className="font-medium text-lg leading-relaxed">
                            "Vayva completely transformed how we handle WhatsApp orders. It's the professional upgrade every Nigerian merchant needs."
                        </blockquote>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md" />
                            <div className="text-sm opacity-90">Verified Merchant</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
