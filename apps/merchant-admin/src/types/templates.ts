
export interface TemplateVersion {
    version: string;
    releasedAt: string;
    changelog: string[];
}

export interface Template {
    id: string;
    name: string;
    description: string;
    tagline?: string;
    category: 'retail' | 'food' | 'services';
    planLevel: 'starter' | 'growth' | 'pro';
    isActive: boolean;
    isLocked: boolean;
    previewImages: {
        desktop: string;
        mobile: string;
        cover: string;
    };
    features: string[];
    currentVersion: string;
    versions: TemplateVersion[];
    tags: string[];
    author: string;
    installCount: number;
    rating: number;

    // Monetization
    // Monetization & Rules
    price: number; // 0 for free/included
    currency: string;
    isPurchased: boolean;
    revenueShare: number; // e.g. 0.6 for 60%

    // Gallery Metadata
    demand: 'popular' | 'high_demand' | 'niche' | 'regulated';
    checkoutMode: 'whatsapp' | 'website' | 'hybrid';
    setupTime: string; // e.g. "~15 mins"
    stockModel: 'inventory' | 'availability' | 'inquiry';
}
