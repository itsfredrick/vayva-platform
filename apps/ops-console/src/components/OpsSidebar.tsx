'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    ShieldAlert,
    Scale,
    Receipt,
    Wallet,
    AlertTriangle,
    MessageSquare,
    Settings,
    LogOut,
    AppWindow
} from 'lucide-react';

const MENU_ITEMS = [
    { label: 'Dashboard', href: '/ops', icon: LayoutDashboard },
    { label: 'Merchants', href: '/ops/merchants', icon: Users },
    { label: 'Moderation', href: '/ops/moderation', icon: ShieldAlert },
    { label: 'Disputes', href: '/ops/disputes', icon: Scale },
    { label: 'Refunds', href: '/ops/refunds', icon: Receipt },
    { label: 'Reconciliation', href: '/ops/reconciliation', icon: Wallet },
    { label: 'Payout Issues', href: '/ops/payout-issues', icon: AlertTriangle },
    { label: 'WA Compliance', href: '/ops/wa-compliance', icon: MessageSquare },
    { label: 'Settings', href: '/ops/settings', icon: Settings },
    { label: 'Support', href: '/ops/support', icon: AppWindow },
];

export function OpsSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-50">
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <div className="font-bold text-lg tracking-tight">Vayva <span className="text-gray-400">Ops</span></div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/ops' && pathname.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-black text-white'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                                }`}
                        >
                            <Icon size={18} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <Link href="/signin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut size={18} />
                    Sign Out
                </Link>
            </div>
        </div>
    );
}
