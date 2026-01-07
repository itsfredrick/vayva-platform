"use client";

import { useState, useEffect } from "react";
import { Button, Input, Icon, Avatar } from "@vayva/ui";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/LoadingSkeletons";
import { motion } from "framer-motion";
import { OnboardingIncompleteAlert } from "@/components/dashboard/OnboardingIncompleteAlert";

export default function SettingsOverview() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Mock Data - In real app, fetch from /api/merchant/me
    const [store, setStore] = useState({
        businessName: "My Store",
        description: "Modern retail experience for boutique fashion & electronics.",
        category: "Retail",
        email: "support@mystore.com",
        phone: "+234 800 123 4567",
        whatsapp: "+234 800 987 6543",
        currency: "NGN",
        address: "12 Admiralty Way, Lekki Phase 1, Lagos",
        brandColor: "#6366f1",
        socials: {
            instagram: "mystore_ng",
            x: "mystore_ng"
        }
    });

    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await fetch("/api/settings/profile");
                const data = await res.json();
                if (data && !data.error) {
                    setStore({
                        businessName: data.store.name || "",
                        description: data.profile.bio || "",
                        category: data.store.category || "Retail",
                        email: data.store.contacts?.email || "",
                        phone: data.store.contacts?.phone || "",
                        whatsapp: data.store.contacts?.whatsapp || "",
                        currency: data.store.currency || "NGN",
                        address: data.store.contacts?.address || "",
                        brandColor: data.store.settings?.brandColor || "#6366f1",
                        socials: {
                            instagram: data.store.settings?.socials?.instagram || "",
                            x: data.store.settings?.socials?.x || "",
                        }
                    });
                    setIsOnline(data.store.settings?.isOnline ?? true);
                }
            } catch (e) {
                toast.error("Failed to load store profile");
            }
        };
        loadProfile();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/settings/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    store: {
                        name: store.businessName,
                        category: store.category,
                        contacts: {
                            email: store.email,
                            phone: store.phone,
                            whatsapp: store.whatsapp,
                            address: store.address,
                        },
                        settings: {
                            brandColor: store.brandColor,
                            socials: store.socials,
                            isOnline: isOnline,
                        }
                    },
                    profile: {
                        bio: store.description,
                    }
                }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Store profile updated");
            } else {
                toast.error(data.error || "Update failed");
            }
        } catch (e) {
            toast.error("Network error saving profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 md:p-8 max-w-6xl mx-auto space-y-10 pb-32"
        >
            <OnboardingIncompleteAlert />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-heading">Settings Overview</h1>
                    <p className="text-gray-500 font-medium">Configure your business profile, branding, and operations.</p>
                </div>
                <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="px-3 py-1 flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", isOnline ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]")} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
                            {isOnline ? "Store Online" : "Store Offline"}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsOnline(!isOnline)}
                        className={cn(
                            "w-10 h-6 rounded-full p-1 transition-all duration-300 relative",
                            isOnline ? "bg-indigo-600" : "bg-gray-200 shadow-inner"
                        )}
                    >
                        <div className={cn(
                            "w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300",
                            isOnline ? "translate-x-4" : "translate-x-0"
                        )} />
                    </button>
                </div>
            </div>

            {loading && !store.businessName ? (
                <div className="space-y-12">
                    {/* Skeleton for Profile */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 space-y-6">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-24 w-24 rounded-3xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-24 w-full md:col-span-2" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Business Profile Section */}
                    <div className="glass-card rounded-3xl border-none shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-100/50 flex items-center justify-between bg-white/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shadow-inner">
                                    <Icon name="Building" size={20} />
                                </div>
                                <h3 className="font-bold text-xl text-gray-900 font-heading">Business Profile</h3>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="flex items-center gap-8 group">
                                <div className="relative">
                                    <div className="h-24 w-24 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 group-hover:border-indigo-400 transition-colors">
                                        <Icon name="Image" size={32} />
                                    </div>
                                    <button className="absolute -top-2 -right-2 p-2 bg-white rounded-full border border-gray-200 shadow-sm text-gray-500 hover:text-black">
                                        <Icon name="Pencil" size={14} />
                                    </button>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Store Logo</h4>
                                    <p className="text-xs text-gray-500 mb-3">Square ratio recommended (PNG/SVG, 500x500px).</p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="rounded-xl h-9 text-xs">Upload Logo</Button>
                                        <Button variant="ghost" size="sm" className="rounded-xl h-9 text-xs text-red-500">Remove</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Business Name</label>
                                    <Input
                                        value={store.businessName}
                                        onChange={(e) => setStore({ ...store, businessName: e.target.value })}
                                        className="rounded-xl h-11"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Business Category</label>
                                    <select className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-black outline-none appearance-none bg-no-repeat bg-[right_1rem_center]">
                                        <option>Retail & E-commerce</option>
                                        <option>Food & Beverage</option>
                                        <option>Services</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">About the Business</label>
                                    <textarea
                                        className="w-full min-h-[100px] p-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-black outline-none"
                                        value={store.description}
                                        onChange={(e) => setStore({ ...store, description: e.target.value })}
                                        placeholder="Brief description of what you sell..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Branding Section */}
                    <div className="glass-card rounded-3xl border-none shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-100/50 bg-white/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl shadow-inner">
                                    <Icon name="Palette" size={20} />
                                </div>
                                <h3 className="font-bold text-xl text-gray-900 font-heading">Brand Identity</h3>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-4">Primary Brand Color</label>
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <input
                                            type="color"
                                            value={store.brandColor}
                                            onChange={(e) => setStore({ ...store, brandColor: e.target.value })}
                                            className="h-12 w-12 rounded-lg cursor-pointer border-none bg-transparent"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{store.brandColor.toUpperCase()}</p>
                                            <p className="text-[10px] text-gray-500 font-medium">Applied to buttons & links</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Social Media Handles</label>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 group/insta">
                                            <Icon name="Instagram" size={16} className="text-pink-600" />
                                            <input
                                                className="bg-transparent border-none outline-none text-xs font-medium w-full"
                                                placeholder="Instagram username"
                                                value={store.socials.instagram}
                                                onChange={(e) => setStore({ ...store, socials: { ...store.socials, instagram: e.target.value } })}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-[10px] font-bold bg-white shadow-sm border border-gray-100 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                                                onClick={() => toast.info("Instagram OAuth flow coming soon!")}
                                            >
                                                Connect
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <Icon name="Twitter" size={16} className="text-blue-400" />
                                            <input
                                                className="bg-transparent border-none outline-none text-xs font-medium w-full"
                                                placeholder="X / Twitter handle"
                                                value={store.socials.x}
                                                onChange={(e) => setStore({ ...store, socials: { ...store.socials, x: e.target.value } })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Support & Contact Section */}
                    <div className="glass-card rounded-3xl border-none shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-100/50 bg-white/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-green-50 text-green-600 rounded-xl shadow-inner">
                                    <Icon name="LifeBuoy" size={20} />
                                </div>
                                <h3 className="font-bold text-xl text-gray-900 font-heading">Communication & Contact</h3>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Support Email</label>
                                    <Input value={store.email} onChange={(e) => setStore({ ...store, email: e.target.value })} className="rounded-xl h-11" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Support Phone</label>
                                    <Input value={store.phone} onChange={(e) => setStore({ ...store, phone: e.target.value })} className="rounded-xl h-11" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Customer WhatsApp</label>
                                    <Input value={store.whatsapp} onChange={(e) => setStore({ ...store, whatsapp: e.target.value })} className="rounded-xl h-11" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Physical Address</label>
                                    <Input value={store.address} onChange={(e) => setStore({ ...store, address: e.target.value })} className="rounded-xl h-11" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compliance & Operations Section */}
                    <div className="glass-card rounded-3xl border-none shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-100/50 bg-white/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-red-50 text-red-600 rounded-xl shadow-inner">
                                    <Icon name="Scale" size={20} />
                                </div>
                                <h3 className="font-bold text-xl text-gray-900 font-heading">Compliance & Legal</h3>
                            </div>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-green-100 text-green-700 rounded-full">
                                        <Icon name="Verified" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Identity Verification (KYC)</p>
                                        <p className="text-xs text-gray-500">Successfully verified via Paystack/YouVerify</p>
                                    </div>
                                </div>
                                <Icon name="CheckCircle2" className="text-green-500" size={20} />
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Documentation</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 border border-gray-100 rounded-2xl bg-white flex items-center justify-between group hover:border-black transition-all cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <Icon name="FileText" size={18} className="text-gray-400" />
                                            <span className="text-sm font-bold text-gray-900">CAC Certificate</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-indigo-600">UPLOADED</span>
                                    </div>
                                    <div className="p-4 border border-gray-200 border-dashed rounded-2xl bg-gray-50 flex items-center justify-between group hover:bg-white transition-all cursor-pointer">
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <Icon name="PlusCircle" size={18} />
                                            <span className="text-sm font-bold">Utility Bill</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-900">Terms of Service</p>
                                    <p className="text-xs text-indigo-600 font-bold underline cursor-pointer">vayva.com/legal/tos</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-900">Privacy Policy</p>
                                    <p className="text-xs text-indigo-600 font-bold underline cursor-pointer">vayva.com/legal/privacy</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final Action Bar */}
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50">
                        <div className="bg-gray-900/90 backdrop-blur-md p-6 rounded-3xl flex items-center justify-between shadow-2xl border border-white/10">
                            <div className="hidden sm:flex items-center gap-4 text-white">
                                <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/20 shadow-inner">
                                    <Icon name="ShieldCheck" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Unsaved Changes Detected</p>
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Commit updates to apply live</p>
                                </div>
                            </div>
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-white text-black font-bold h-12 px-12 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/10"
                            >
                                {loading ? <Icon name="Loader" className="animate-spin" size={18} /> : "Update Store"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
