"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PolicyEditor } from "@/components/policies/PolicyEditor";
import { ControlCenterShell } from "@/components/control-center/ControlCenterShell";

// Fetch policies from store settings
const fetchPolicies = async () => {
    const res = await fetch("/api/store/policies");
    return res.json();
};

const savePolicies = async (data: any) => {
    await fetch("/api/store/policies", {
        method: "PATCH",
        body: JSON.stringify(data),
    });
};

function PoliciesContent() {
    const searchParams = useSearchParams();
    const tab = searchParams.get("tab") || "returns"; // default to returns
    const [storeData, setStoreData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPolicies().then((data) => {
            setStoreData(data);
            setLoading(false);
        });
    }, []);

    const handleSave = async (content: string) => {
        const field =
            tab === "returns"
                ? "returnsMarkdown"
                : tab === "shipping"
                    ? "shippingMarkdown"
                    : tab === "privacy"
                        ? "privacyMarkdown"
                        : "termsMarkdown";

        await savePolicies({ [field]: content });
        // Optimistic update
        setStoreData({ ...storeData, [field]: content });
    };

    if (loading)
        return (
            <div className="p-8 space-y-8 animate-pulse">
                <div className="h-8 bg-gray-100 rounded-xl w-48 mb-10" />
                <div className="space-y-4">
                    <div className="h-4 bg-gray-100 rounded-lg w-1/3" />
                    <div className="h-64 bg-gray-50 rounded-3xl border border-gray-100" />
                </div>
                <div className="flex justify-end pt-4">
                    <div className="h-10 bg-gray-100 rounded-xl w-32" />
                </div>
            </div>
        );

    const content =
        tab === "returns"
            ? storeData.returnsMarkdown
            : tab === "shipping"
                ? storeData.shippingMarkdown
                : tab === "privacy"
                    ? storeData.privacyMarkdown
                    : storeData.termsMarkdown;

    return (
        <div className="p-8 h-full flex flex-col">
            <PolicyEditor
                key={tab} // Force re-mount on tab change to reset state
                type={tab as any}
                initialContent={content}
                onSave={handleSave}
                storeSlug={storeData.slug || "demo-store"}
            />
        </div>
    );
}

export default function PoliciesPage() {
    return (
        <ControlCenterShell>
            <Suspense
                fallback={
                    <div className="p-12 text-center text-gray-400">Loading...</div>
                }
            >
                <PoliciesContent />
            </Suspense>
        </ControlCenterShell>
    );
}
