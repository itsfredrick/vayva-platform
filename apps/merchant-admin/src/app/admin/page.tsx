'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { useAuth } from '@/context/AuthContext';
import { Icon, Button, cn } from '@vayva/ui';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
    const { user, store, onboarding, verification } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    // 1. Onboarding & Redirect Check
    useEffect(() => {
        // Allow a small delay for context to settle if needed, but Context usually handles this.
        // We do a strict check here.
        if (onboarding && !onboarding.isComplete) {
            router.push('/onboarding/resume');
        } else {
            setIsLoading(false);
        }
    }, [onboarding, router]);

    if (isLoading) return <AdminShell title="Overview"><div className="p-12 text-center text-gray-400">Loading Dashboard...</div></AdminShell>;

    // Fallbacks
    const firstName = user?.firstName || 'Merchant';
    const storeName = store?.name || 'My Store';
    const isLive = store?.status === 'published';
    const kycStatus = verification?.kycStatus || 'pending';

    // Mock KPI Data
    const kpis = [
        { label: 'Revenue Today', value: '₦ 85,000', delta: '+12%', icon: 'Banknote', href: '/admin/finance' },
        { label: 'Orders Today', value: '12', delta: '+4', icon: 'ShoppingBag', href: '/admin/orders?status=today' },
        { label: 'Pending Fulfillment', value: '5', delta: 'Requires Action', isWarning: true, icon: 'Package', href: '/admin/orders?status=processing' },
        { label: 'Store Visits', value: '1,240', delta: '+8%', icon: 'Globe', href: '/admin/analytics' },
    ];

    // Quick Actions
    const actions = [
        { label: 'New Product', icon: 'Plus', href: '/admin/products/new' },
        { label: 'Create Discount', icon: 'Ticket', href: '/admin/promotions' }, // Placeholder
        { label: 'Create Invoice', icon: 'FileText', href: '/admin/finance?panel=invoices&create=1' }, // Deep link
        { label: 'Send Broadcast', icon: 'MessageCircle', href: '/admin/whatsapp' },
        { label: 'Delivery Task', icon: 'Truck', href: '/admin/orders' },
        { label: 'View Reports', icon: 'BarChart2', href: '/admin/analytics' },
    ];

    return (
        <AdminShell title="Overview">
            <motion.div
                className="max-w-6xl mx-auto pb-24 space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* A) Hero Strip */}
                <motion.div variants={itemVariants} className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-[#0B0B0B]">Welcome back, {firstName}</h1>
                    <p className="text-gray-500">
                        {isLive ? "Here's what's happening in your store today." : "Your store is almost ready—finish setup to go live."}
                    </p>
                </motion.div>

                {/* B) KPI Row */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpis.map((kpi, i) => (
                        <Link href={kpi.href} key={i}>
                            <motion.div
                                whileHover={{ y: -2 }}
                                className={cn(
                                    "p-5 rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md cursor-pointer h-full flex flex-col justify-between",
                                    kpi.isWarning ? "border-orange-200 bg-orange-50/30" : "border-gray-100"
                                )}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={cn("p-2 rounded-lg bg-gray-50 text-gray-500", kpi.isWarning && "bg-orange-100 text-orange-600")}>
                                        {/* @ts-ignore */}
                                        <Icon name={kpi.icon} size={20} />
                                    </div>
                                    <span className={cn("text-xs font-bold", kpi.isWarning ? "text-orange-600" : "text-green-600")}>{kpi.delta}</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1 opacity-70">{kpi.label}</p>
                                    <h3 className="text-2xl font-bold text-[#0B0B0B]">{kpi.value}</h3>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Col: Actions & Feed */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* C) Quick Actions */}
                        <motion.div variants={itemVariants}>
                            <h2 className="text-lg font-bold text-[#0B0B0B] mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {actions.map((action, i) => (
                                    <Link href={action.href} key={i}>
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="p-4 bg-white border border-gray-100 rounded-xl flex flex-col items-center justify-center gap-3 shadow-sm hover:border-gray-200 hover:shadow-md transition-all cursor-pointer h-32 text-center"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mb-1">
                                                {/* @ts-ignore */}
                                                <Icon name={action.icon} size={18} />
                                            </div>
                                            <span className="text-sm font-medium text-[#0B0B0B]">{action.label}</span>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>

                        {/* E) Activity Feed */}
                        <motion.div variants={itemVariants}>
                            <h2 className="text-lg font-bold text-[#0B0B0B] mb-4">Recent Activity</h2>
                            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="p-4 border-b border-gray-50 last:border-0 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
                                            ORD
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-[#0B0B0B]">New Order #102{4 - i}</p>
                                            <p className="text-xs text-gray-500">Chioma Adebayo placed an order via Storefront</p>
                                        </div>
                                        <span className="text-xs text-gray-400">2m ago</span>
                                    </div>
                                ))}
                                <div className="p-3 bg-gray-50 text-center">
                                    <Link href="/admin/orders" className="text-xs font-bold text-black hover:underline">View All Activity</Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Col: Store Card */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        {/* D) Store Card */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <span className={cn(
                                    "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                                    isLive ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                )}>
                                    {isLive ? "Live" : "Pending"}
                                </span>
                            </div>

                            <div className="flex flex-col items-center text-center mb-6 mt-2">
                                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold mb-3 border-4 border-gray-50">
                                    {storeName.charAt(0)}
                                </div>
                                <h3 className="text-lg font-bold text-[#0B0B0B]">{storeName}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded truncate max-w-[180px]">
                                        {store?.slug}.vayva.shop
                                    </p>
                                    <button className="text-gray-400 hover:text-black"><Icon name="Copy" size={12} /></button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Icon name="Layout" size={16} className="text-gray-500" />
                                        <div className="flex flex-col text-left">
                                            <span className="text-xs text-gray-400">Current Theme</span>
                                            <span className="text-sm font-bold text-[#0B0B0B]">Vayva Classic</span>
                                        </div>
                                    </div>
                                    <Link href="/admin/control-center"><Button size="sm" variant="outline" className="h-7 text-xs">Change</Button></Link>
                                </div>

                                {kycStatus !== 'approved' && (
                                    <div className="p-3 bg-orange-50 rounded-lg flex items-center justify-between border border-orange-100">
                                        <div className="flex items-center gap-3">
                                            <Icon name="ShieldAlert" size={16} className="text-orange-500" />
                                            <div className="flex flex-col text-left">
                                                <span className="text-xs font-bold text-orange-700">Verification Pending</span>
                                                <span className="text-[10px] text-orange-600">Complete KYC to unlock withdrawals</span>
                                            </div>
                                        </div>
                                        <Link href="/admin/account"><Icon name="ChevronRight" size={16} className="text-orange-400" /></Link>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
                                <Link href="/admin/control-center/branding">
                                    <Button variant="ghost" className="text-xs text-gray-500 hover:text-black">
                                        <Icon name="Edit" size={14} className="mr-2" /> Edit Branding & Logo
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#0D1D1E] rounded-xl shadow-lg p-6 text-white text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 blur-xl"></div>
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                                <p className="text-white/70 text-sm mb-4">Contact our support team on WhatsApp for instant assistance.</p>
                                <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-none font-bold">
                                    <Icon name="MessageCircle" size={16} className="mr-2" /> Chat Support
                                </Button>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </motion.div>
        </AdminShell>
    );
}
