import React from "react";
import { StoreData, ProductData } from "@/hooks/storefront/useStorefront";

interface StorefrontSEOProps {
    store: StoreData | null;
    products?: ProductData[];
    activeProduct?: ProductData | null;
    basePath?: string;
}

export function StorefrontSEO({
    store,
    products,
    activeProduct,
    basePath = "",
}: StorefrontSEOProps) {
    if (!store) return null;

    const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
    const storeUrl = `${siteUrl}${basePath || `/store/${store.slug}`}`;

    const seoTitle = store.storefrontSettings?.seoTitle || store.name;
    const seoDescription = store.storefrontSettings?.seoDescription || `Shop at ${store.name} - ${store.category || "Online Store"}`;

    // Organization / Store Schema
    const storeSchema = {
        "@context": "https://schema.org",
        "@type": "Store",
        name: store.name,
        image: store.logoUrl,
        description: seoDescription,
        url: storeUrl,
        telephone: store.deliverySettings?.pickupPhone,
        address: store.deliverySettings?.pickupAddressLine1
            ? {
                "@type": "PostalAddress",
                streetAddress: store.deliverySettings.pickupAddressLine1,
                addressLocality: store.deliverySettings.pickupCity,
                addressRegion: store.deliverySettings.pickupState,
                addressCountry: "NG",
            }
            : undefined,
    };

    // Product Schema (if activeProduct is present)
    let productSchema = null;
    if (activeProduct) {
        productSchema = {
            "@context": "https://schema.org",
            "@type": "Product",
            name: activeProduct.name,
            image: activeProduct.image,
            description: activeProduct.description,
            sku: activeProduct.id,
            brand: {
                "@type": "Brand",
                name: store.name,
            },
            offers: {
                "@type": "Offer",
                url: `${storeUrl}/products/${activeProduct.id}`,
                priceCurrency: "NGN",
                price: activeProduct.price,
                availability:
                    (activeProduct.inventory ?? 1) > 0
                        ? "https://schema.org/InStock"
                        : "https://schema.org/OutOfStock",
            },
        };
    }

    // Breadcrumb Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: storeUrl,
            },
            ...(activeProduct
                ? [
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: activeProduct.category || "Products",
                        item: `${storeUrl}?category=${activeProduct.category || "all"}`,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: activeProduct.name,
                        item: `${storeUrl}/products/${activeProduct.id}`,
                    },
                ]
                : []),
        ],
    };

    return (
        <>
            <title>{seoTitle}</title>
            <meta name="description" content={seoDescription} />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
            />
            {productSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
                />
            )}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
        </>
    );
}
