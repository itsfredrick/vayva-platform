'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function MarketingSigninPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#46EC13]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 w-full max-w-md bg-[#0b141a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center shadow-2xl">
                <div className="w-16 h-16 bg-[#46EC13]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#46EC13]">
                    <span className="font-bold text-3xl">V</span>
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-white/50 mb-8">Sign in to manage your Vayva store.</p>

                <div className="space-y-4">
                    <Link href="/auth/login" className="block w-full">
                        <Button className="w-full h-14 bg-[#46EC13] hover:bg-[#3DD10F] text-black font-bold text-lg rounded-xl">
                            Continue to Dashboard
                        </Button>
                    </Link>

                    <div className="flex items-center gap-4 my-6">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-white/30 text-sm font-bold">OR</span>
                        <div className="h-px bg-white/10 flex-1" />
                    </div>

                    <Link href="/auth/signup" className="block w-full">
                        <Button variant="outline" className="w-full h-12 border-white/10 hover:bg-white/5 text-white font-bold rounded-xl">
                            Create new account
                        </Button>
                    </Link>
                </div>

                <div className="mt-8 text-xs text-white/30">
                    <p>Having trouble? <Link href="/help" className="text-[#46EC13] hover:underline">Contact Support</Link></p>
                </div>
            </div>
        </div>
    );
}
