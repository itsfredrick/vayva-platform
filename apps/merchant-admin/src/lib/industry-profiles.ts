import { OnboardingProfile } from "./templates-registry";

export const INDUSTRY_PROFILES: Record<string, OnboardingProfile> = {
    retail: {
        prefill: {
            industryCategory: "Retail & Products",
            deliveryEnabled: true,
            paymentsEnabled: true,
        },
        requireSteps: ["payments"],
    },
    food: {
        prefill: {
            industryCategory: "Food & Catering",
            deliveryEnabled: true,
            paymentsEnabled: true,
        },
        requireSteps: ["delivery", "payments"],
    },
    services: {
        prefill: {
            industryCategory: "Professional Services",
            deliveryEnabled: false,
            paymentsEnabled: true,
        },
        requireSteps: ["payments"],
    },
    digital: {
        prefill: {
            industryCategory: "Digital Goods",
            deliveryEnabled: false,
            paymentsEnabled: true,
        },
        requireSteps: ["payments"],
    },
    events: {
        prefill: {
            industryCategory: "Events & Tickets",
            deliveryEnabled: false,
            paymentsEnabled: true,
        },
        requireSteps: ["payments"],
    },
    education: {
        prefill: {
            industryCategory: "Online Courses",
            deliveryEnabled: false,
            paymentsEnabled: true,
        },
        requireSteps: ["payments"],
    },
    b2b: {
        prefill: {
            industryCategory: "Wholesale / B2B",
            deliveryEnabled: true,
            paymentsEnabled: true,
        },
        requireSteps: ["payments", "kyc"],
    },
    marketplace: {
        prefill: {
            industryCategory: "Multi-vendor",
            deliveryEnabled: true,
            paymentsEnabled: true,
        },
        requireSteps: ["payments", "kyc"],
    },
    nonprofit: {
        prefill: {
            industryCategory: "Nonprofit / Charity",
            deliveryEnabled: false,
            paymentsEnabled: true,
        },
        requireSteps: ["payments"],
    },
    "real-estate": {
        prefill: {
            industryCategory: "Real Estate",
            deliveryEnabled: false,
            paymentsEnabled: false,
        },
        requireSteps: [],
    },
};
