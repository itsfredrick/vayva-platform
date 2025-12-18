export type PlanType = 'starter' | 'growth' | 'pro';

export type OnboardingStepId =
    | 'welcome'
    | 'identity'
    | 'store-details'
    | 'brand'
    | 'delivery'
    | 'templates'
    | 'products'
    | 'payments'
    | 'whatsapp'
    | 'kyc'
    | 'review';

export interface OnboardingState {
    isComplete: boolean;
    currentStep: OnboardingStepId;
    lastUpdatedAt: string; // ISO date

    // Step 1: Goals
    enabledChannels?: {
        storefront: boolean;
        whatsappAi: boolean;
        market: boolean;
    };

    // Step 2: Identity (Merged into MerchantProfile usually, but kept here for wizard state)
    identity?: {
        fullName: string;
        email: string;
        phone: string;
    };

    // Step 3: Store Details
    storeDetails?: {
        storeName: string;
        category: string;
        state: string;
        city: string;
        slug: string;
    };

    // Step 4: Branding
    branding?: {
        logoUrl?: string;
        coverUrl?: string;
        brandColor?: string;
    };

    // Step 5: Pickup Location
    pickupLocation?: {
        address: string;
        contactName: string;
        phone: string;
        notes?: string;
    };

    // Step 6: Template
    template?: {
        selectedTemplateId: string;
        meta?: Record<string, any>;
    };

    // Step 7: Products (State tracking mainly, products saved to DB)
    products?: {
        hasAddedProducts: boolean;
        count: number;
    };

    // Step 8: Payments
    payments?: {
        isConfigured: boolean;
        paystackCustomerId?: string;
    };

    // Step 9: WhatsApp
    whatsapp?: {
        mode: 'own' | 'vayva';
        number: string;
        status: 'pending' | 'connected';
    };

    // Step 10: KYC
    kyc?: {
        bvn?: string;
        nin?: string;
        ninLast4?: string;
        bvnLast4?: string;
        status: 'pending' | 'verified' | 'failed' | 'rejected' | 'not_started';
    };
}
