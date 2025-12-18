export const PRICING_VERSION = "2025-12-18_v1";
export const CURRENCY = "NGN";

export const PLAN_KEYS = ["starter", "growth", "pro"] as const;
export type PlanKey = typeof PLAN_KEYS[number];

export type Plan = {
    key: PlanKey;
    name: string;
    monthlyAmount: number; // NGN
    yearlyAmount?: number; // optional
    bullets: string[];
    ctaLabel: string;
    featured?: boolean;
};

export function formatNGN(amount: number): string {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(amount);
}

export const PLANS: Plan[] = [
    {
        key: "starter",
        name: "Starter",
        monthlyAmount: 0,
        bullets: ["100 orders/month", "Basic templates", "Self-dispatch"],
        ctaLabel: "Start Free",
    },
    {
        key: "growth",
        name: "Growth",
        monthlyAmount: 25000,
        bullets: ["1,000 orders/month", "All templates", "WhatsApp campaigns"],
        ctaLabel: "Choose Growth",
        featured: true,
    },
    {
        key: "pro",
        name: "Pro",
        monthlyAmount: 40000,
        bullets: ["Unlimited orders", "Priority support", "API access"],
        ctaLabel: "Choose Pro",
    },
];
