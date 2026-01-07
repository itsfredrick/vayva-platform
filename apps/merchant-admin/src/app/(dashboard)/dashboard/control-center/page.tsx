"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@vayva/ui";
import { ControlCenterShell } from "@/components/control-center/ControlCenterShell";

export default function ControlCenterPage() {
    return (
        <ControlCenterShell>
            <div className="p-8 space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-heading">
                        Storefront Customization
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Manage how your store appears to customers across all platforms.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Appearance / Templates Card */}
                    <Link href="/dashboard/control-center/templates">
                        <div className="group bg-white/50 backdrop-blur-sm border border-gray-100 p-6 rounded-3xl hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer h-full border-none shadow-sm ring-1 ring-black/5">
                            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4 group-hover:rotate-6 transition-transform">
                                <Icon name="Layout" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 font-heading">
                                Template Gallery
                            </h3>
                            <p className="text-gray-400 text-xs leading-relaxed mb-6">
                                Choose your store's look. Browse premium templates, preview
                                layouts, and customize your brand appearance instantly.
                            </p>
                            <div className="flex items-center text-purple-600 font-bold text-xs uppercase tracking-widest mt-auto">
                                Manage Templates{" "}
                                <Icon
                                    name="ArrowRight"
                                    size={14}
                                    className="ml-2 group-hover:translate-x-1 transition-transform"
                                />
                            </div>
                        </div>
                    </Link>

                    {/* Media Manager Card */}
                    <Link href="/dashboard/control-center/media">
                        <div className="group bg-white/50 backdrop-blur-sm border border-gray-100 p-6 rounded-3xl hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer h-full border-none shadow-sm ring-1 ring-black/5">
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-4 group-hover:rotate-6 transition-transform">
                                <Icon name="FileImage" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 font-heading">
                                Assets & Media
                            </h3>
                            <p className="text-gray-400 text-xs leading-relaxed mb-6">
                                Central library for banners, logos, and promotional visuals.
                                Keep your store branding consistent.
                            </p>
                            <div className="flex items-center text-orange-600 font-bold text-xs uppercase tracking-widest mt-auto">
                                Open Library{" "}
                                <Icon
                                    name="ArrowRight"
                                    size={14}
                                    className="ml-2 group-hover:translate-x-1 transition-transform"
                                />
                            </div>
                        </div>
                    </Link>

                    {/* Domain Management */}
                    <Link href="/dashboard/control-center/domains">
                        <div className="group bg-white/50 backdrop-blur-sm border border-gray-100 p-6 rounded-3xl hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer h-full border-none shadow-sm ring-1 ring-black/5 relative">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:rotate-6 transition-transform">
                                <Icon name="Globe" size={24} />
                            </div>
                            <span className="absolute top-6 right-6 bg-gray-100 text-gray-400 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                Limited Access
                            </span>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 font-heading">
                                Domain Settings
                            </h3>
                            <p className="text-gray-400 text-xs leading-relaxed mb-6">
                                Connect a custom domain (e.g. mystore.com) and manage SSL
                                certificates for your secure storefront.
                            </p>
                            <div className="flex items-center text-blue-600 font-bold text-xs uppercase tracking-widest mt-auto">
                                Manage Domains{" "}
                                <Icon
                                    name="ArrowRight"
                                    size={14}
                                    className="ml-2 group-hover:translate-x-1 transition-transform"
                                />
                            </div>
                        </div>
                    </Link>

                    {/* Policy Management Card */}
                    <Link href="/dashboard/control-center/policies">
                        <div className="group bg-white/50 backdrop-blur-sm border border-gray-100 p-6 rounded-3xl hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer h-full border-none shadow-sm ring-1 ring-black/5">
                            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-4 group-hover:rotate-6 transition-transform">
                                <Icon name="ShieldCheck" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 font-heading">
                                Legal & Policies
                            </h3>
                            <p className="text-gray-400 text-xs leading-relaxed mb-6">
                                Configure Returns, Shipping, Privacy, and Terms. Build trust
                                with clear and professional legal documentation.
                            </p>
                            <div className="flex items-center text-red-600 font-bold text-xs uppercase tracking-widest mt-auto">
                                Edit Policies{" "}
                                <Icon
                                    name="ArrowRight"
                                    size={14}
                                    className="ml-2 group-hover:translate-x-1 transition-transform"
                                />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </ControlCenterShell>
    );
}
