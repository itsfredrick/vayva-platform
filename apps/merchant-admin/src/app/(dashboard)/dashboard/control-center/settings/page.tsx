"use client";

import React, { useEffect, useState } from "react";
import { Icon, Button } from "@vayva/ui";
import { ControlCenterShell } from "@/components/control-center/ControlCenterShell";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

const socialSchema = z.object({
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    tiktok: z.string().optional(),
});

const settingsSchema = z.object({
    seoTitle: z.string().max(60, "Title is too long (max 60 chars)").optional(),
    seoDescription: z.string().max(160, "Description is too long (max 160 chars)").optional(),
    socialLinks: socialSchema.optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function GeneralSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
    });

    useEffect(() => {
        fetch("/api/store/settings/general")
            .then((res) => res.json())
            .then((data) => {
                reset({
                    seoTitle: data.seoTitle || "",
                    seoDescription: data.seoDescription || "",
                    socialLinks: data.socialLinks || {},
                });
            })
            .catch(() => toast.error("Failed to load settings"))
            .finally(() => setLoading(false));
    }, [reset]);

    const onSubmit = async (data: SettingsFormData) => {
        setSaving(true);
        try {
            const res = await fetch("/api/store/settings/general", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                toast.success("Settings saved successfully");
            } else {
                toast.error("Failed to save settings");
            }
        } catch (error) {
            toast.error("Error saving settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <ControlCenterShell>
                <div className="flex items-center justify-center h-full text-gray-400">
                    <Icon name="Loader" className="animate-spin mr-2" size={24} /> Loading Settings...
                </div>
            </ControlCenterShell>
        )
    }

    return (
        <ControlCenterShell>
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-10 max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-heading">
                            General Settings
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">
                            Manage SEO metadata and social media connections.
                        </p>
                    </div>
                    <Button type="submit" disabled={saving} className="rounded-xl px-6 h-11 shadow-lg shadow-indigo-500/20">
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>

                {/* SEO Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Icon name="Search" size={18} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Search Engine Optimization</h2>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-6 shadow-sm">
                        <div className="grid gap-2">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Page Title</label>
                            <input
                                {...register("seoTitle")}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors text-sm"
                                placeholder="My Awesome Store | Best Fashion"
                            />
                            {errors.seoTitle && <span className="text-xs text-red-500">{errors.seoTitle.message}</span>}
                            <p className="text-[10px] text-gray-400">Recommended length: 50-60 characters</p>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Meta Description</label>
                            <textarea
                                {...register("seoDescription")}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors text-sm min-h-[100px]"
                                placeholder="Shop the latest trends in fashion. Free shipping on orders over $50."
                            />
                            {errors.seoDescription && <span className="text-xs text-red-500">{errors.seoDescription.message}</span>}
                            <p className="text-[10px] text-gray-400">Recommended length: 150-160 characters</p>
                        </div>
                    </div>
                </div>

                {/* Social Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                        <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                            <Icon name="Share2" size={18} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Social Connections</h2>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 grid md:grid-cols-2 gap-6 shadow-sm">
                        <div className="grid gap-2">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                <Icon name="Instagram" size={14} /> Instagram
                            </label>
                            <input
                                {...register("socialLinks.instagram")}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors text-sm"
                                placeholder="https://instagram.com/mystore"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                <Icon name="Twitter" size={14} /> Twitter / X
                            </label>
                            <input
                                {...register("socialLinks.twitter")}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors text-sm"
                                placeholder="https://x.com/mystore"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                <Icon name="Facebook" size={14} /> Facebook
                            </label>
                            <input
                                {...register("socialLinks.facebook")}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors text-sm"
                                placeholder="https://facebook.com/mystore"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                <Icon name="Video" size={14} /> TikTok
                            </label>
                            <input
                                {...register("socialLinks.tiktok")}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors text-sm"
                                placeholder="https://tiktok.com/@mystore"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </ControlCenterShell>
    );
}
