import { FashionPDP } from "@/components/storefront/pdp/FashionPDP";
import { RealEstatePDP } from "@/components/storefront/pdp/RealEstatePDP";
import { TechPDP } from "@/components/storefront/pdp/TechPDP";
import { DigitalPDP } from "@/components/storefront/pdp/DigitalPDP";
import { FoodPDP } from "@/components/storefront/pdp/FoodPDP";
import { StandardPDP } from "@/components/storefront/pdp/StandardPDP";
import { AmazonianPDP } from "@/components/storefront/pdp/AmazonianPDP";
import { ComponentType } from "react";
import { ProductData } from "@/hooks/storefront/useStorefront";

// Define the interface for PDP props
export interface PDPProps {
    product: ProductData;
    storeSlug: string;
    storeName: string;
    basePath?: string;
    relatedProducts?: ProductData[];
}

// Registry mapping template slugs to PDP components
const pdpRegistry: Record<string, ComponentType<PDPProps>> = {
    // Electronics / Tech
    "gizmo-demo": TechPDP,
    "gizmo-tech": TechPDP,

    // Real Estate
    "estate-demo": RealEstatePDP,
    "estate-prime": RealEstatePDP,

    // Digital / Audio
    "soundwave-demo": DigitalPDP,
    "soundwave": DigitalPDP,

    // Food
    "gourmet-demo": FoodPDP,
    "gourmet-dining": FoodPDP,
    "slice-life-demo": FoodPDP, // Pizza can use FoodPDP for now, or specialize later
    "pizza-demo": FoodPDP,
    "chopnow-demo": FoodPDP,
    "sugar-rush-demo": FoodPDP, // Bakery
    "bakery-demo": FoodPDP,

    // Fashion
    "aa-fashion-demo": FashionPDP,
    "aa-fashion": FashionPDP,
    "fashion-store": FashionPDP,

    // Marketplaces (Amazon Style fits best here)
    "vayva-markethub": AmazonianPDP,
    "markethub-demo": AmazonianPDP,
    "vayva-vendorhive": AmazonianPDP,
    "vendorhive-demo": AmazonianPDP,
    "vayva-bulktrade": AmazonianPDP,
    "bulktrade-demo": AmazonianPDP,
    "standard-retail": AmazonianPDP,

    "vayva-salon": StandardPDP,
    "salon-demo": StandardPDP,
    "vayva-oneproduct": StandardPDP,
    "oneproduct-demo": StandardPDP,

    // Fallbacks
    "default": AmazonianPDP // Default to Amazon style as requested
};

export function getPDPComponent(templateId: string): ComponentType<PDPProps> | null {
    // Normalize properties
    if (pdpRegistry[templateId]) {
        return pdpRegistry[templateId];
    }

    // Try without -demo
    const coreId = templateId.replace("-demo", "");
    if (pdpRegistry[coreId]) {
        return pdpRegistry[coreId];
    }

    // Heuristics based on name for defaults
    if (templateId.includes("food") || templateId.includes("pizza") || templateId.includes("bakery") || templateId.includes("coffee")) {
        return FoodPDP;
    }

    if (templateId.includes("tech") || templateId.includes("gizmo")) {
        return TechPDP;
    }

    // Default to Standard Retail PDP for everything else (Bloome, Bookly, etc.)
    return StandardPDP;
}
