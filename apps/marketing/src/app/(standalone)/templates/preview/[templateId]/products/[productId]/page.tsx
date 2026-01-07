"use client";

import React, { use } from "react";
import { getPDPComponent } from "@/lib/pdp-registry";
import { useStorefrontProduct } from "@/hooks/storefront/useStorefront";
import { Loader2 } from "lucide-react";

export default function ProductDetailPage({
    params
}: {
    params: Promise<{ templateId: string; productId: string }>
}) {
    const { templateId, productId } = use(params);

    // 1. Resolve PDP Component
    const PDPComponent = getPDPComponent(templateId);

    // 2. Fetch Product Data
    // We reuse the standard storefront hook. 
    // Note: useStorefrontProduct handles finding the product by ID from the simulated store data.
    const { product, isLoading } = useStorefrontProduct(templateId, productId);

    if (!PDPComponent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-sans text-zinc-500">
                PDP Template not found for "{templateId}".
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 font-sans">
                <h1 className="text-2xl font-bold text-zinc-900 mb-2">Product Not Found</h1>
                <p className="text-zinc-500">The product "{productId}" could not be located in this store.</p>
                <a href={`/templates/preview/${templateId}`} className="mt-6 px-6 py-2 bg-zinc-900 text-white rounded-md text-sm font-bold">
                    Return to Store
                </a>
            </div>
        );
    }

    // 3. Render
    return (
        <PDPComponent
            product={product}
            storeSlug={templateId}
            storeName="Preview Store" // In real app, fetch store details
            basePath={`/templates/preview/${templateId}`}
            relatedProducts={[]} // Could suggest related logic later
        />
    );
}
