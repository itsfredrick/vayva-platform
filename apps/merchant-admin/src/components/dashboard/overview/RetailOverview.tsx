'use client';

import React, { useEffect, useState } from 'react';
import { Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Mock types for the new structure
interface DashboardContext {
    firstName: string;
    initials: string;
    storeStatus: 'LIVE' | 'DRAFT';
    paymentStatus: 'CONNECTED' | 'PENDING';
    whatsappStatus: 'CONNECTED' | 'ATTENTION';
    kycStatus: 'VERIFIED' | 'REVIEW' | 'ACTION';
}

interface Metric {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
}

interface DashMetrics {
    [key: string]: Metric;
}

interface ActivityItem {
    id: number;
    type: 'ORDER' | 'PAYMENT' | 'WHATSAPP' | 'BOOKING';
    message: string;
    user: string;
    time: string;
}

export const RetailOverview = () => {
    const [context, setContext] = useState<DashboardContext | null>(null);
    const [metrics, setMetrics] = useState<DashMetrics | null>(null);
    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // In real app, use SWR or React Query
                const [ctxRes, metricsRes, activityRes] = await Promise.all([
                    fetch('/api/dashboard/context').then(r => r.json()),
                    fetch('/api/dashboard/metrics').then(r => r.json()),
                    fetch('/api/dashboard/activity').then(r => r.json())
                ]);

                setContext(ctxRes);
                setMetrics(metricsRes);
                setActivity(activityRes);
            } catch (e) {
                console.error("Dashboard data load failed", e);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return <div className="p-12 text-center text-gray-400 font-medium">Preparing your workspace...</div>;
    }

    const StatusCard = ({ label, status, icon, healthy }: { label: string, status: string, icon: any, healthy: boolean }) => (
        <div className={cn(
            "flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02]",
            healthy ? "bg-white border-gray-100 hover:border-gray-200" : "bg-orange-50 border-orange-100"
        )}>
            <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                healthy ? "bg-gray-50 text-gray-900" : "bg-white text-orange-600 shadow-sm"
            )}>
                <Icon name={icon} size={18} />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                <div className="flex items-center gap-2">
                    <span className={cn("text-sm font-bold", healthy ? "text-gray-900" : "text-orange-700")}>
                        {status}
                    </span>
                    {!healthy && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">

            {/* SECTION 1: WELCOME & CONTEXT */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                        Welcome back, {context?.firstName} 👋
                    </h1>
                    <p className="text-gray-500 text-lg">Here’s what’s happening in your business today.</p>
                </div>
                {/* Optional secondary line moved to subtext above as per prompt standard */}
            </section>

            {/* SECTION 2: BUSINESS STATUS SNAPSHOT */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatusCard
                    label="Storefront"
                    status={context?.storeStatus === 'LIVE' ? 'Live' : 'Draft'}
                    icon="Store"
                    healthy={context?.storeStatus === 'LIVE'}
                />
                <StatusCard
                    label="Payments"
                    status={context?.paymentStatus === 'CONNECTED' ? 'Active' : 'Pending'}
                    icon="CreditCard"
                    healthy={context?.paymentStatus === 'CONNECTED'}
                />
                <StatusCard
                    label="WhatsApp"
                    status={context?.whatsappStatus === 'CONNECTED' ? 'Connected' : 'Attention'}
                    icon="MessageCircle"
                    healthy={context?.whatsappStatus === 'CONNECTED'}
                />
                <StatusCard
                    label="KYC"
                    status={context?.kycStatus === 'VERIFIED' ? 'Verified' : 'Action Required'}
                    icon="ShieldCheck"
                    healthy={context?.kycStatus === 'VERIFIED'}
                />
            </section>

            {/* SECTION 3: KEY METRICS */}
            <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Key Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metrics && Object.values(metrics).map((m, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <p className="text-sm font-medium text-gray-500 mb-1">{m.label}</p>
                            <div className="flex items-end justify-between">
                                <p className="text-3xl font-bold text-gray-900">{m.value}</p>
                                <div className={cn(
                                    "flex items-center text-xs font-bold px-2 py-1 rounded-full",
                                    m.trend === 'up' ? "bg-green-50 text-green-700" :
                                        m.trend === 'down' ? "bg-red-50 text-red-700" : "bg-gray-50 text-gray-600"
                                )}>
                                    {m.trend === 'up' ? '↗' : m.trend === 'down' ? '↘' : '–'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* SECTION 5: LIVE ACTIVITY FEED (Left Main) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Live Activity</h3>
                        <button className="text-sm font-bold text-gray-900 hover:underline">View all</button>
                    </div>

                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                        {activity.map((item, i) => (
                            <div key={item.id} className={cn(
                                "p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer",
                                i !== activity.length - 1 && "border-b border-gray-50"
                            )}>
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0",
                                    item.type === 'ORDER' ? "bg-blue-50 text-blue-600" :
                                        item.type === 'PAYMENT' ? "bg-green-50 text-green-600" :
                                            item.type === 'WHATSAPP' ? "bg-green-100 text-[#075E54]" : "bg-gray-100 text-gray-600"
                                )}>
                                    <Icon name={
                                        item.type === 'ORDER' ? "ShoppingBag" :
                                            item.type === 'PAYMENT' ? "Banknote" :
                                                item.type === 'WHATSAPP' ? "MessageCircle" : "Calendar"
                                    } size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">{item.message}</p>
                                    <p className="text-xs text-gray-500 font-medium">{item.user} • {item.type}</p>
                                </div>
                                <span className="text-xs font-bold text-gray-400 whitespace-nowrap">{item.time}</span>
                            </div>
                        ))}
                        {activity.length === 0 && (
                            <div className="p-12 text-center text-gray-400">No activity yet today.</div>
                        )}
                    </div>
                </div>

                {/* Right Column: Alerts & Quick Actions */}
                <div className="space-y-10">

                    {/* SECTION 4: ACTION REQUIRED */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Action Required</h3>
                        {/* Dynamic Logic: If healthy, show calm state. Hardcoded alert for demo. */}
                        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                            <div className="mb-4">
                                <h4 className="font-bold text-gray-900">2 Orders pending</h4>
                                <p className="text-sm text-gray-500">Awaiting your confirmation.</p>
                            </div>
                            <button className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors">
                                Review Orders
                            </button>
                        </div>
                    </section>

                    {/* SECTION 6: QUICK ACTIONS */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-gray-300 transition-all hover:shadow-sm">
                                <Icon name="Plus" size={24} className="text-gray-900" />
                                <span className="text-xs font-bold text-gray-600">Add Product</span>
                            </button>
                            <button className="p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-gray-300 transition-all hover:shadow-sm">
                                <Icon name="Share" size={20} className="text-gray-900" />
                                <span className="text-xs font-bold text-gray-600">Share Store</span>
                            </button>
                            <button className="p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-gray-300 transition-all hover:shadow-sm">
                                <Icon name="MessageCircle" size={20} className="text-gray-900" />
                                <span className="text-xs font-bold text-gray-600">WhatsApp</span>
                            </button>
                            <button className="p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-gray-300 transition-all hover:shadow-sm">
                                <Icon name="Settings" size={20} className="text-gray-900" />
                                <span className="text-xs font-bold text-gray-600">Settings</span>
                            </button>
                        </div>
                    </section>

                </div>
            </div>

        </div>
    );
};
