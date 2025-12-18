'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { Icon, cn } from '@vayva/ui';
import { motion } from 'framer-motion';

const SETTINGS_NAV = [
    {
        category: 'General',
        items: [
            { name: 'Overview', href: '/admin/account/overview' },
            { name: 'Profile', href: '/admin/account/profile' },
            { name: 'Store & Business', href: '/admin/account/store-business' },
        ]
    },
    {
        category: 'Billing & Usage',
        items: [
            { name: 'Subscription', href: '/admin/account/subscription' },
            { name: 'Billing', href: '/admin/account/billing' },
            { name: 'Invoices', href: '/admin/account/invoices' },
            { name: 'Usage & Limits', href: '/admin/account/usage' },
            { name: 'Add-ons', href: '/admin/account/add-ons' },
        ]
    },
    {
        category: 'Team & Security',
        items: [
            { name: 'Staff & Roles', href: '/admin/account/staff-roles' },
            { name: 'Security', href: '/admin/account/security' },
        ]
    },
    {
        category: 'Configuration',
        items: [
            { name: 'Connected Services', href: '/admin/account/connected-services' },
            { name: 'Compliance & KYC', href: '/admin/account/compliance-kyc' },
            { name: 'Notifications', href: '/admin/account/notifications' },
            { name: 'Help & Support', href: '/admin/account/help-support' },
        ]
    }
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AdminShell title="Account" breadcrumb="Settings">
            <div className="grid grid-cols-12 gap-8 h-full">

                {/* Secondary Sidebar (Col 1-3) */}
                <aside className="col-span-12 lg:col-span-3">
                    <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-6 shadow-sm">
                        <nav className="flex flex-col gap-6">
                            {SETTINGS_NAV.map((section) => (
                                <div key={section.category}>
                                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 px-3">
                                        {section.category}
                                    </h4>
                                    <div className="flex flex-col gap-0.5">
                                        {section.items.map((item) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <Link key={item.href} href={item.href}>
                                                    <div className={cn(
                                                        "px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between group",
                                                        isActive
                                                            ? "bg-gray-50 text-[#0B0B0B] font-bold"
                                                            : "text-[#525252] hover:bg-gray-50 hover:text-[#0B0B0B]"
                                                    )}>
                                                        {item.name}
                                                        {isActive && (
                                                            <motion.div
                                                                layoutId="active-pill"
                                                                className="w-1.5 h-1.5 rounded-full bg-[#0B0B0B]"
                                                            />
                                                        )}
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content (Col 4-12) */}
                <div className="col-span-12 lg:col-span-9 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </div>

            </div>
        </AdminShell>
    );
}
