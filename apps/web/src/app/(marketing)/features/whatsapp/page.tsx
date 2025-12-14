'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function WhatsAppFeaturePage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-20 items-center">
                    <div>
                        <span className="text-[#46EC13] font-bold tracking-wide uppercase mb-4 block">WhatsApp AI Automation</span>
                        <h1 className="text-5xl font-bold text-white mb-6">Put your sales on autopilot.</h1>
                        <p className="text-xl text-white/60 mb-8 leading-relaxed">
                            Respond to customers instantly, 24/7. Our AI assistant can answer questions, recommend products, and confirm orders directly on WhatsApp.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/auth/signup">
                                <Button className="bg-[#46EC13] hover:bg-[#3DD10F] text-black font-bold h-12 px-8 rounded-full">
                                    Automate Now
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Chat Mockup */}
                    <div className="relative mx-auto w-full max-w-sm">
                        <div className="bg-[#0b141a] rounded-[2.5rem] border border-white/10 p-4 shadow-2xl">
                            <div className="bg-[#142210] rounded-[2rem] overflow-hidden h-[500px] relative flex flex-col">
                                {/* Header */}
                                <div className="bg-[#075E54] p-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20" />
                                    <div className="text-white text-sm font-bold">Vayva AI Assistant</div>
                                </div>
                                {/* Messages */}
                                <div className="p-4 space-y-4 flex-1">
                                    <div className="bg-[#202c33] p-3 rounded-lg rounded-tl-none max-w-[80%]">
                                        <p className="text-white text-xs">Do you have the Nike sneakers in size 42?</p>
                                    </div>
                                    <div className="bg-[#005c4b] p-3 rounded-lg rounded-tr-none max-w-[80%] ml-auto">
                                        <p className="text-white text-xs">Yes! We have the Air Jordan 1 High in stock. Would you like to place an order?</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
