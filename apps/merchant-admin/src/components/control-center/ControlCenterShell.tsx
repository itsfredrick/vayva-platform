"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, Icon } from "@vayva/ui";
import { motion } from "framer-motion";

interface NavItem {
    label: string;
    href: string;
    icon: string;
    description: string;
}

const CONTROL_NAV_ITEMS: NavItem[] = [
    {
        label: "Templates",
        href: "/dashboard/control-center/templates",
        icon: "Layout",
        description: "Manage your storefront look and feel.",
    },
    {
        label: "Media",
        href: "/dashboard/control-center/media",
        icon: "Image",
        description: "Upload and manage store assets.",
    },
    {
        label: "Domains",
        href: "/dashboard/control-center/domains",
        icon: "Globe",
        description: "Connect and manage your domains.",
    },
    {
        label: "Policies",
        href: "/dashboard/control-center/policies",
        icon: "ShieldAlert",
        description: "Legal and store policies.",
    },
    {
        label: "Settings",
        href: "/dashboard/control-center/settings",
        icon: "Settings",
        description: "SEO and social media links.",
    },
    {
        label: "Sales Channels",
        href: "/dashboard/control-center/sales-channels",
        icon: "Store",
        description: "Manage where you sell.",
    },
    {
        label: "QR Codes",
        href: "/dashboard/control-center/qr-codes",
        icon: "QrCode",
        description: "Generate and download store QR.",
    },
];

interface ControlCenterShellProps {
    children: React.ReactNode;
    activeTab?: string;
}

export const ControlCenterShell = ({ children }: ControlCenterShellProps) => {
    const pathname = usePathname();

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sub-Navigation Sidebar */}
            <aside className="w-full lg:w-72 shrink-0 space-y-6">
                {/* Store Status Card */}
                <div className="glass-card p-4 rounded-2xl border-none shadow-sm flex items-center justify-between bg-white ring-1 ring-black/5">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping absolute inset-0" />
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full relative" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Store is Live</span>
                    </div>
                    <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest">Settings</button>
                </div>

                <div>
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">
                        Customization
                    </h2>
                    <nav className="space-y-1">
                        {CONTROL_NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex flex-col gap-0.5 px-4 py-3 rounded-2xl transition-all relative group",
                                        isActive
                                            ? "bg-white shadow-sm ring-1 ring-black/5"
                                            : "hover:bg-white/50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "p-1.5 rounded-lg transition-colors",
                                            isActive ? "bg-black text-white" : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-black"
                                        )}>
                                            {/* @ts-ignore */}
                                            <Icon name={item.icon} size={16} />
                                        </div>
                                        <span className={cn(
                                            "text-sm font-bold transition-colors",
                                            isActive ? "text-black" : "text-gray-500 group-hover:text-black"
                                        )}>
                                            {item.label}
                                        </span>
                                    </div>
                                    {isActive && (
                                        <p className="text-[10px] text-gray-400 mt-1 pl-8 font-medium italic">
                                            {item.description}
                                        </p>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Quick View / Help Section */}
                <div className="hidden lg:block glass-card p-6 rounded-3xl border-none">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Icon name="Lightbulb" size={16} />
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Pro Tip</h4>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Consistency is key. Use your brand colors across templates and media to build trust with customers.
                    </p>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 w-full min-w-0">
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card rounded-[32px] border-none shadow-sm min-h-[600px] overflow-hidden flex flex-col"
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
};
