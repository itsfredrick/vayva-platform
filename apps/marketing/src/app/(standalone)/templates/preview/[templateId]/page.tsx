"use client";

import React, { use } from "react";
import { getTemplateComponent } from "@/lib/template-preview-registry";
import { getTemplateBySlug, TEMPLATES } from "@/lib/templates-registry"; // We might need to lookup by ID or Slug

// In Next.js 15+, params and searchParams are Promises
export default function TemplatePreviewPage({
    params,
    searchParams
}: {
    params: Promise<{ templateId: string }>;
    searchParams: Promise<{ config?: string }>;
}) {
    const resolvedParams = use(params);
    const resolvedSearchParams = use(searchParams);
    const { templateId } = resolvedParams;
    const { config } = resolvedSearchParams;

    // Parse config if present
    let configOverride = null;
    if (config) {
        try {
            configOverride = JSON.parse(decodeURIComponent(config));
        } catch (e) {
            console.error("Failed to parse config override", e);
        }
    }

    // We need to resolve which component to render
    // The URL might use either the 'slug' or the 'templateId'. 
    // Let's assume templateId for now, or try to find it.

    // 1. Try direct match
    const Component = getTemplateComponent(templateId);

    // 2. Mock Store Data
    // In a real app, this would come from a database or context
    // Here we pass static data so the template looks "alive"
    // Use templateId as slug so mock data hook sees "vayva-aa-fashion" etc.
    const mockStoreSlug = templateId;
    const mockStoreName = "Preview Store";

    if (!Component) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Template not found.</p>
            </div>
        );
    }

    return (
        <Component
            storeName={mockStoreName}
            storeSlug={mockStoreSlug} // Used for loading mock data by ID/slug in hook
            basePath={`/templates/preview/${templateId}`} // Used for internal links
            config={configOverride}
        />
    );
}
