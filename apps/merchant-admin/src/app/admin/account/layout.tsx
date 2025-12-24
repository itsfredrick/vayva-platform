'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Store,
    Building2,
    Palette,
    Globe,
    CreditCard,
    Receipt,
    BarChart3,
    Package,
    Users,
    Shield,
    Plug,
    FileCheck,
    Bell,
    HelpCircle
} from 'lucide-react';

const SETTINGS_NAV = [
    {
        category: 'Store & Business',
        items: [
            { name: 'Store Profile', href: '/admin/account/profile', icon: Store },
            { name: 'Business Details', href: '/admin/account/store-business', icon: Building2 },
            { name: 'Branding', href: '/admin/account/branding', icon: Palette },
            { name: 'Currency & Locale', href: '/admin/account/locale', icon: Globe },
        ]
    },
    {
        category: 'Billing & Usage',
        items: [
            { name: 'Subscription', href: '/admin/account/subscription', icon: CreditCard },
            { name: 'Billing', href: '/admin/account/billing', icon: Receipt },
            { name: 'Invoices', href: '/admin/account/invoices', icon: Receipt },
            { name: 'Usage & Limits', href: '/admin/account/usage', icon: BarChart3 },
            { name: 'Add-ons', href: '/admin/account/add-ons', icon: Package },
        ]
    },
    {
        category: 'Team & Security',
        items: [
            { name: 'Staff & Roles', href: '/admin/account/staff-roles', icon: Users },
            { name: 'Security', href: '/admin/account/security', icon: Shield },
        ]
    },
    {
        category: 'Configuration',
        items: [
            { name: 'Connected Services', href: '/admin/account/connected-services', icon: Plug },
            { name: 'Compliance & KYC', href: '/admin/account/compliance-kyc', icon: FileCheck },
            { name: 'Notifications', href: '/admin/account/notifications', icon: Bell },
        ]
    },
    {
        category: 'Support',
        items: [
            { name: 'Help & Support', href: '/admin/account/help-support', icon: HelpCircle },
        ]
    }
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Account Sidebar - ONLY navigation (no main dashboard nav) */}
            <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto flex-shrink-0">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Account Settings</h2>
                    <p className="text-sm text-gray-500">Manage your business</p>
                </div>

                <nav className="p-4">
                    {SETTINGS_NAV.map((section) => (
                        <div key={section.category} className="mb-6">
                            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 px-3">
                                {section.category}
                            </h4>
                            <div className="flex flex-col gap-0.5">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;

                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <div className={`
                                                px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-3 group
                                                ${isActive
                                                    ? "bg-green-50 text-green-700 font-semibold"
                                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                                }
                                            `}>
                                                <Icon className="w-4 h-4" />
                                                <span className="flex-1">{item.name}</span>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="active-pill"
                                                        className="w-1.5 h-1.5 rounded-full bg-green-600"
                                                    />
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
