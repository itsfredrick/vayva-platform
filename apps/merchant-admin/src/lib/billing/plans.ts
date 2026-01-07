import { PLANS as CONFIG_PLANS, PlanKey as ConfigPlanKey } from "@/config/pricing";

export type PlanKey = ConfigPlanKey;

export const PLAN_PRICING = {
  GROWTH: CONFIG_PLANS.find((p) => p.key === "growth")?.monthlyAmount || 25000,
  PRO: CONFIG_PLANS.find((p) => p.key === "pro")?.monthlyAmount || 40000,
};

export interface PlanLimits {
  teamSeats: number;
  maxOwnedTemplates: number;
  monthlyCampaignSends: number;
}

export interface PlanFeatures {
  approvals: boolean;
  inboxOps: boolean;
  reports: boolean;
  advancedAnalytics: boolean;
}

export interface PlanDefinition {
  slug: PlanKey;
  name: string;
  priceNgn: number;
  limits: PlanLimits;
  features: PlanFeatures;
}

export const PLANS: Record<string, PlanDefinition> = {
  free: {
    slug: "free",
    name: "Free",
    priceNgn: 0,
    limits: {
      teamSeats: 1,
      maxOwnedTemplates: 0,
      monthlyCampaignSends: 100,
    },
    features: {
      approvals: false,
      inboxOps: true,
      reports: true,
      advancedAnalytics: false,
    },
  },
  growth: {
    slug: "growth",
    name: "₦25,000",
    priceNgn: PLAN_PRICING.GROWTH,
    limits: {
      teamSeats: 1,
      maxOwnedTemplates: 3,
      monthlyCampaignSends: 1000,
    },
    features: {
      approvals: false,
      inboxOps: true,
      reports: true,
      advancedAnalytics: false,
    },
  },
  pro: {
    slug: "pro",
    name: "₦40,000",
    priceNgn: PLAN_PRICING.PRO,
    limits: {
      teamSeats: 5,
      maxOwnedTemplates: 100, // Unlimited effectively
      monthlyCampaignSends: 10000,
    },
    features: {
      approvals: true,
      inboxOps: true,
      reports: true,
      advancedAnalytics: true,
    },
  },
};

export type PlanSlug = PlanKey;
