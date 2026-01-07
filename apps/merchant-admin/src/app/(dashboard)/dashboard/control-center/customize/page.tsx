"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getNormalizedTemplates, NormalizedTemplate } from "@/lib/templates-registry";
import { ThemeEditor } from "@/components/control-center/editor/ThemeEditor";
import { toast } from "sonner";

export default function CustomizePage() {
    const { store } = useAuth() as any;
    const router = useRouter();
    const [template, setTemplate] = useState<NormalizedTemplate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!store) return;

        // Find the active template. 
        // Logic: if store.templateId is set, use it. Else default manual check.
        // Since we don't have store.templateId in the AuthContext type potentially, we might need to fetch or use what we check.
        // For now, let's assume store has templateId or we default.

        // Mocking: Assume store.templateId matches one in our registry
        const currentTemplateId = store.templateId || "vayva-aa-fashion"; // Default to the one we added schema to for testing
        const all = getNormalizedTemplates();
        const found = all.find(t => t.id === currentTemplateId) || all.find(t => t.slug === "aa-fashion-demo");

        if (found) {
            setTemplate(found);
        } else {
            toast.error("Could not load template definition.");
        }
        setLoading(false);

    }, [store]);

    const handleSave = async (config: any) => {
        try {
            const res = await fetch("/api/store/theme-config", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-store-id": store.id
                },
                body: JSON.stringify({ config }),
            });

            if (!res.ok) throw new Error("Failed to save");

            // Optionally update local store context context
            toast.success("Saved successfully");
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    if (loading) return <div className="p-8">Loading editor...</div>;
    if (!template) return <div className="p-8">Template not found.</div>;

    return (
        <ThemeEditor
            template={template}
            initialConfig={store?.templateConfig}
            onSave={handleSave}
        />
    );
}
