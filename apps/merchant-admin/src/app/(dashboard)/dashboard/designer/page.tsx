"use client";

import React, { useState, useEffect } from "react";
import { Button, Icon, Badge } from "@vayva/ui";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Skeleton } from "@/components/LoadingSkeletons";

// Mock implementation of a sidebar component for the designer
const DesignerSidebar = ({ activeTab, setActiveTab, brandColor, setBrandColor, headline, setHeadline, tagline, setTagline, bannerUrl, setBannerUrl, loading }: any) => {
    const tabs = [
        { id: "theme", label: "Theme", icon: "Palette" },
        { id: "content", label: "Content", icon: "Type" },
        { id: "sections", label: "Sections", icon: "Layout" },
        { id: "settings", label: "Settings", icon: "Settings" },
    ];

    const presets = ["#000000", "#46EC13", "#FF3B30", "#007AFF"];

    return (
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col h-full">
            <div className="p-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Store Editor</h2>
                <p className="text-xs text-gray-400">Customizing Vayva Standard</p>
            </div>

            <div className="flex p-2 gap-1 bg-gray-50 m-4 rounded-lg">
                {loading ? (
                    [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-8 flex-1 rounded-md" />)
                ) : (
                    tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === tab.id
                                ? "bg-white text-black shadow-sm"
                                : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            <Icon name={tab.icon as any} size={14} />
                            {tab.label}
                        </button>
                    ))
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {activeTab === "theme" && (
                    <div className="space-y-6 loading-in">
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Brand Colors</label>
                            <div className="flex gap-3 flex-wrap">
                                {presets.map(color => (
                                    <div
                                        key={color}
                                        onClick={() => setBrandColor(color)}
                                        className={`w-10 h-10 rounded-lg border-2 shadow-sm cursor-pointer hover:scale-105 transition-transform ${brandColor === color ? 'border-black ring-1 ring-black' : 'border-gray-100'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                                <div className="relative w-10 h-10 rounded-lg bg-white border-2 border-gray-200 shadow-sm cursor-pointer hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
                                    <input
                                        type="color"
                                        value={brandColor}
                                        onChange={(e) => setBrandColor(e.target.value)}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                    <Icon name="Plus" size={14} className="text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Typography</label>
                            <div className="p-3 border border-gray-200 rounded-xl hover:border-black cursor-pointer bg-gray-50">
                                <p className="font-bold text-gray-900 text-lg">Heading Font</p>
                                <p className="text-gray-500 text-sm">Inter Display</p>
                            </div>
                            <div className="p-3 border border-gray-200 rounded-xl hover:border-black cursor-pointer bg-white">
                                <p className="font-medium text-gray-900 text-sm">Body Font</p>
                                <p className="text-gray-500 text-xs">Roboto Sans</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "content" && (
                    <div className="space-y-6 loading-in">
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Headlines</label>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500">Main Headline</label>
                                <input
                                    type="text"
                                    value={headline}
                                    onChange={(e) => setHeadline(e.target.value)}
                                    placeholder="Welcome to our store"
                                    className="w-full text-sm p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500">Tagline / Subheading</label>
                                <input
                                    type="text"
                                    value={tagline}
                                    onChange={(e) => setTagline(e.target.value)}
                                    placeholder="The best products for you"
                                    className="w-full text-sm p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Assets</label>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500">Banner Image URL</label>
                                <input
                                    type="text"
                                    value={bannerUrl}
                                    onChange={(e) => setBannerUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full text-sm p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                                />
                                {bannerUrl && (
                                    <div className="mt-2 aspect-video w-full rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                        <img src={bannerUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "sections" && (
                    <div className="space-y-2 loading-in">
                        {['Hero Banner', 'Featured Collection', 'Image with Text', 'Newsletter', 'Footer'].map((section, i) => (
                            <div key={i} className="p-3 border border-gray-200 rounded-xl bg-white flex items-center justify-between group cursor-grab active:cursor-grabbing hover:border-black hover:shadow-sm transition-all">
                                <div className="flex items-center gap-3">
                                    <Icon name="GripVertical" size={14} className="text-gray-300 group-hover:text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">{section}</span>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1 hover:bg-gray-100 rounded"><Icon name="Eye" size={14} /></button>
                                    <button className="p-1 hover:bg-gray-100 rounded"><Icon name="Edit" size={14} /></button>
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full text-xs border-dashed border-gray-300 text-gray-400 hover:text-black hover:border-black">
                            <Icon name="Plus" size={14} className="mr-2" /> Add Section
                        </Button>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Icon name="Smartphone" size={12} />
                    <span>Editing Mobile View</span>
                </div>
            </div>
        </div>
    );
};

export default function DesignerPage() {
    const [activeTab, setActiveTab] = useState("sections");
    const [storeUrl, setStoreUrl] = useState("http://localhost:3001");
    const [storeData, setStoreData] = useState<any>(null);
    const [brandColor, setBrandColor] = useState("#000000");
    const [headline, setHeadline] = useState("");
    const [tagline, setTagline] = useState("");
    const [bannerUrl, setBannerUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch initial store data
    useEffect(() => {
        const fetchStore = async () => {
            try {
                const res = await fetch("/api/store/upsert");
                const data = await res.json();
                if (data.store) {
                    setStoreData(data.store);
                    // Hydrate state from settings
                    const settings = data.store.settings || {};
                    const themeConfig = settings.themeConfig || {};

                    if (settings.brandColor) setBrandColor(settings.brandColor);
                    if (themeConfig.headline) setHeadline(themeConfig.headline);
                    if (themeConfig.tagline) setTagline(themeConfig.tagline);
                    if (themeConfig.bannerUrl) setBannerUrl(themeConfig.bannerUrl);

                    // Set Preview URL with store context and preview params
                    const separator = storeUrl.includes('?') ? '&' : '?';
                    const previewUrl = `http://localhost:3001${separator}store=${data.store.slug}&preview=true`;
                    setStoreUrl(previewUrl);
                }
            } catch (e) {
                toast.error("Failed to load store configuration");
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, []);

    // Update iframe preview when content changes (debounce this ideally, but simple update works for now)
    useEffect(() => {
        if (!storeData) return;

        // This is a naive way to update preview; normally we'd postMessage or use URL params
        // For now, let's just append params to the storeUrl if we want instant preview without save
        // But for a robust "Save then View" flow, we rely on the DB.
        // To make it "Live", we can append params:

        // We only update if we have a base URL
        const msg = {
            type: 'THEME_UPDATE',
            payload: {
                brandColor,
                headline,
                tagline,
                bannerUrl
            }
        };

        // Try to send to iframe
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(msg, '*');
        }
    }, [brandColor, headline, tagline, bannerUrl, storeData]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/store/upsert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    brandColor,
                    settings: {
                        themeConfig: {
                            headline,
                            tagline,
                            bannerUrl,
                            fontHeading: "Inter Display",
                            fontBody: "Roboto Sans"
                        }
                    }
                })
            });

            if (!res.ok) throw new Error("Failed to save");

            toast.success("Theme changes saved successfully!");

            // Refresh iframe logic
            const iframe = document.querySelector('iframe');
            if (iframe) iframe.src = iframe.src;

        } catch (e) {
            toast.error("Failed to save changes");
        } finally {
            setSaving(false);
        }
    }

    // Pass props to sidebar
    const sidebarProps = {
        activeTab,
        setActiveTab,
        brandColor,
        setBrandColor,
        headline,
        setHeadline,
        tagline,
        setTagline,
        bannerUrl,
        setBannerUrl,
        loading
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-100 -m-6 md:-m-8">
            {/* Sidebar Controls */}
            <DesignerSidebar {...sidebarProps} />

            {/* Main Preview Area */}
            <div className="flex-1 flex flex-col h-full relative">
                {/* Toolbar */}
                <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button className="p-2 rounded-md bg-white shadow-sm text-black"><Icon name="Monitor" size={16} /></button>
                            <button className="p-2 rounded-md text-gray-500 hover:text-black"><Icon name="Smartphone" size={16} /></button>
                        </div>
                        <div className="h-4 w-[1px] bg-gray-300"></div>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            Live Preview
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" className="text-gray-500 hover:text-black">Discard</Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-black text-white px-6 hover:bg-gray-800">
                            {saving ? "Publishing..." : "Publish Changes"}
                        </Button>
                    </div>
                </div>

                {/* Canvas / Iframe */}
                <div className="flex-1 overflow-hidden flex items-center justify-center p-8 bg-[#F0F2F5]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full h-full max-w-[1200px] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 relative"
                    >
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-white">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Icon name="Loader" className="animate-spin text-gray-300" size={32} />
                                </div>
                                <p>Connecting to Storefront...</p>
                                <p className="text-xs text-gray-300 mt-2">Target: {storeUrl}</p>
                            </div>
                        </div>
                        {/* Actual Iframe */}
                        <iframe
                            src={storeUrl}
                            className="w-full h-full relative z-10"
                            title="Store Preview"
                            sandbox="allow-scripts allow-same-origin allow-forms"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

