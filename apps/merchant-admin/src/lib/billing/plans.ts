
export const PLAN_PRICING = {
    GROWTH: 25000,
    PRO: 40000,
};

export interface PlanLimits {
    teamSeats: number;
    templatesAvailable: 'limited' | 'all';
    monthlyCampaignSends: number;
}

export interface PlanFeatures {
    approvals: boolean;
    inboxOps: boolean;
    reports: boolean;
    advancedAnalytics: boolean;
}

export interface PlanDefinition {
    slug: 'growth' | 'pro';
    name: string;
    priceNgn: number;
    limits: PlanLimits;
    features: PlanFeatures;
    paystackPlanCode?: string; // To be filled with real codes later
}

export const PLANS: Record<string, PlanDefinition> = {
    growth: {
        slug: 'growth',
        name: 'Growth',
        priceNgn: PLAN_PRICING.GROWTH,
        limits: {
            teamSeats: 1,
            templatesAvailable: 'limited',
            monthlyCampaignSends: 1000
        },
        features: {
            approvals: false,
            inboxOps: true,
            reports: true,
            advancedAnalytics: false
        }
    },
    pro: {
        slug: 'pro',
        name: 'Pro',
        priceNgn: PLAN_PRICING.PRO,
        limits: {
            teamSeats: 5,
            templatesAvailable: 'all',
            monthlyCampaignSends: 10000
        },
        features: {
            approvals: true,
            inboxOps: true,
            reports: true,
            advancedAnalytics: true
        }
    }
};

export type PlanSlug = keyof typeof PLANS;
