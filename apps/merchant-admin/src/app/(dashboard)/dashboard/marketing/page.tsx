"use client";

import React from "react";
import Link from "next/link";
import { Icon, Badge } from "@vayva/ui";
import { motion } from "framer-motion";

export default function MarketingPage() {
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 font-heading">Marketing Hub 🚀</h1>
                <p className="text-gray-500 mt-1 font-medium">
                    Attract new customers and retain existing ones with AI-powered tools.
                </p>
            </div>

            {/* Strategy Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 1. ATTRACT */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                            <Icon name={"Target" as any} size={16} />
                        </div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Attract</h2>
                    </div>

                    {/* Feature: Flash Sales */}
                    <Link href="/dashboard/marketing/flash-sales">
                        <motion.div
                            whileHover={{ y: -2 }}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                    <Icon name={"Clock" as any} size={20} />
                                </div>
                                <Icon name={"ArrowUpRight" as any} size={16} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">Flash Sales</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Create urgency with limited-time offers and countdown timers on your storefront.
                            </p>
                        </motion.div>
                    </Link>

                    {/* Feature: Discount Codes */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative overflow-hidden opacity-75">
                        <div className="absolute top-3 right-3">
                            <Badge variant="default" className="text-[10px] bg-white border border-gray-200 text-gray-500">Soon</Badge>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 mb-4 shadow-sm">
                            <Icon name={"Percent" as any} size={20} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Coupons</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Create percentage or fixed-amount discount codes for your customers.
                        </p>
                    </div>

                    {/* Feature: Social Posters */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative overflow-hidden opacity-75">
                        <div className="absolute top-3 right-3">
                            <Badge variant="default" className="text-[10px] bg-white border border-gray-200 text-gray-500">Soon</Badge>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 mb-4 shadow-sm">
                            <Icon name={"Image" as any} size={20} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Social Posters</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Auto-generate branded images for Instagram Stories and WhatsApp Status.
                        </p>
                    </div>
                </div>

                {/* 2. CONVERT */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Icon name={"Zap" as any} size={16} />
                        </div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Convert</h2>
                    </div>

                    {/* Feature: Abandoned Cart */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 relative overflow-hidden">
                        <div className="absolute top-3 right-3">
                            <Badge className="bg-blue-600 text-white border-none">AI Agent</Badge>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                            <Icon name={"ShoppingBag" as any} size={20} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Cart Recovery</h3>
                        <p className="text-xs text-gray-600 leading-relaxed mb-4">
                            Automatically recover lost sales via WhatsApp. The AI sends reminders and discount nudges.
                        </p>
                        <div className="flex flex-col gap-2 mt-auto">
                            <div className="bg-white/50 rounded-lg p-2 text-[10px] text-gray-500 flex justify-between">
                                <span>Recoverable Revenue</span>
                                <span className="font-bold text-gray-900">₦0.00</span>
                            </div>
                            <div className="bg-white/50 rounded-lg p-2 text-[10px] text-gray-500 flex justify-between">
                                <span>Recovered (Last 30d)</span>
                                <span className="font-bold text-green-600">₦0.00</span>
                            </div>
                        </div>
                    </div>

                    {/* Feature: Welcome Flow */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative overflow-hidden opacity-75">
                        <div className="absolute top-3 right-3">
                            <Badge variant="default" className="text-[10px] bg-white border border-gray-200 text-gray-500">Soon</Badge>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 mb-4 shadow-sm">
                            <Icon name={"MessageSquare" as any} size={20} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Welcome Flow</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Greet new customers with a discount code when they first message your AI Agent.
                        </p>
                    </div>
                </div>

                {/* 3. RETAIN */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <Icon name={"Heart" as any} size={16} />
                        </div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Retain</h2>
                    </div>

                    {/* Feature: Broadcasts */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative overflow-hidden opacity-75">
                        <div className="absolute top-3 right-3">
                            <Badge variant="default" className="text-[10px] bg-white border border-gray-200 text-gray-500">Soon</Badge>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 mb-4 shadow-sm">
                            <Icon name={"Bell" as any} size={20} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Broadcasts</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Send targeted messages to customer segments (e.g., "Big Spenders", "Inactive").
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
