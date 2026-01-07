import { CanonicalCategorySlug, CanonicalTemplateId } from "@/types/templates";

export { type CanonicalCategorySlug, type CanonicalTemplateId };

export enum TemplateCategory {
  RETAIL = "Retail",
  SERVICE = "Service",
  FOOD = "Food",
  DIGITAL = "Digital",
  EVENTS = "Events",
  EDUCATION = "Education",
  B2B = "B2B",
  MARKETPLACE = "Marketplace",
  NONPROFIT = "Nonprofit",
  REAL_ESTATE = "Real Estate",
}

export type BillingPlan = "free" | "growth" | "pro";

export interface OnboardingProfile {
  prefill: {
    industryCategory?: string;
    deliveryEnabled?: boolean;
    paymentsEnabled?: boolean;
    defaultCurrency?: string;
  };
  skipSteps?: Array<
    "business" | "storefront" | "payments" | "delivery" | "kyc"
  >;
  requireSteps?: Array<"payments" | "delivery" | "kyc">;
}

export type ConfigSchema = {
  sections: {
    id: string;
    title: string;
    description?: string;
    fields: {
      key: string;
      type: "color" | "text" | "number" | "boolean" | "select" | "image";
      label: string;
      helpText?: string;
      defaultValue?: any;
      options?: { label: string; value: string }[]; // for select
    }[];
  }[];
};

export interface TemplateDefinition {
  templateId: string;
  slug: string;
  displayName: string;
  category: TemplateCategory;
  businessModel: string;
  primaryUseCase: string;
  requiredPlan: BillingPlan;
  defaultTheme: "light" | "dark";
  status: "implemented" | "partial" | "pending";
  preview: {
    thumbnailUrl: string | null;
    mobileUrl: string | null;
    desktopUrl: string | null;
    testUrl?: string | null;
  };
  compare: {
    headline: string;
    bullets: string[];
    bestFor: string[];
    keyModules: string[];
  };
  routes: string[];
  layoutComponent: string; // The import path key or component name
  configSchema?: ConfigSchema;
  onboardingProfile?: OnboardingProfile;
}

export const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  "vayva-standard": {
    templateId: "vayva-standard",
    slug: "demo",
    displayName: "Standard Retail",
    category: TemplateCategory.RETAIL,
    businessModel: "Retail",
    primaryUseCase: "General Physical Goods",
    requiredPlan: "free",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "The essential store for physical products.",
      bullets: [
        "Classic hero banner with CTA",
        "Clean collection grid layout",
        "Simple product details page",
      ],
      bestFor: ["Clothing boutiques", "General merchandise", "Pop-up shops"],
      keyModules: ["Product Catalog", "Cart & Checkout", "Order Management"],
    },
    routes: ["/", "/collections/*", "/products/:slug"],
    layoutComponent: "StoreShell",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "Branding",
          fields: [
            { key: "primaryColor", type: "color", label: "Primary Brand Color", defaultValue: "#000000" },
          ],
        },
        {
          id: "hero",
          title: "Hero Section",
          fields: [
            { key: "heroTitle", type: "text", label: "Main Headline", defaultValue: "Timeless Essentials For Modern Living" },
            { key: "showAnnouncement", type: "boolean", label: "Show Announcement Bar", defaultValue: true },
          ],
        },
      ],
    },
    onboardingProfile: {
      prefill: {
        industryCategory: "Retail",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      requireSteps: ["payments"],
    },
  },
  "vayva-aa-fashion": {
    templateId: "vayva-aa-fashion",
    slug: "aa-fashion-demo",
    displayName: "A&A Fashion",
    category: TemplateCategory.RETAIL,
    businessModel: "Retail",
    primaryUseCase: "Fashion / Apparel",
    requiredPlan: "free",
    defaultTheme: "dark",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Bold, visual-first fashion retail.",
      bullets: [
        "Full-width imagery focused",
        "Lookbook style collections",
        "Size guide modal integration",
      ],
      bestFor: ["Fashion brands", "Streetwear", "Luxury apparel"],
      keyModules: ["Visual Merchandising", "Size Variants", "Instagram Feed"],
    },
    routes: ["/", "/collections/*", "/products/:slug"],
    layoutComponent: "AAFashionHome",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "Branding",
          fields: [
            {
              key: "primaryColor",
              type: "color",
              label: "Primary Brand Color",
              defaultValue: "#000000",
            },
            {
              key: "logoWidth",
              type: "number",
              label: "Logo Width (px)",
              defaultValue: 120,
            },
          ],
        },
        {
          id: "hero",
          title: "Hero Section",
          fields: [
            {
              key: "heroTitle",
              type: "text",
              label: "Main Headline",
              defaultValue: "New Collection",
            },
            {
              key: "showAnnouncement",
              type: "boolean",
              label: "Show Announcement Bar",
              defaultValue: true,
            },
          ],
        },
      ],
    },
    onboardingProfile: {
      prefill: {
        industryCategory: "Fashion",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      requireSteps: ["payments"],
    },
  },
  "vayva-gizmo-tech": {
    templateId: "vayva-gizmo-tech",
    slug: "gizmo-demo",
    displayName: "Gizmo Tech",
    category: TemplateCategory.RETAIL,
    businessModel: "Retail",
    primaryUseCase: "Electronics",
    requiredPlan: "free",
    defaultTheme: "dark",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "High-spec showcase for electronics.",
      bullets: [
        "Spec comparison tables",
        "Dark mode technical aesthetic",
        "Feature highlight grids",
      ],
      bestFor: ["Gadget stores", "Computer shops", "Audio equipment"],
      keyModules: ["Tech Specs", "Product Comparison", "Warranty Info"],
    },
    routes: ["/", "/collections/*", "/products/:slug"],
    layoutComponent: "GizmoTechHome",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "System Colors",
          fields: [
            {
              key: "primaryColor",
              type: "color",
              label: "Terminal Color",
              defaultValue: "#00ff41",
            },
          ],
        },
        {
          id: "effects",
          title: "Visual Effects",
          fields: [
            {
              key: "showMatrix",
              type: "boolean",
              label: "Show Matrix Background",
              defaultValue: true,
            },
          ],
        },
      ],
    },
    onboardingProfile: {
      prefill: {
        industryCategory: "Electronics",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      requireSteps: ["payments"],
    },
  },
  "vayva-bloome-home": {
    templateId: "vayva-bloome-home",
    slug: "bloome-demo",
    displayName: "Bloome & Home",
    category: TemplateCategory.RETAIL,
    businessModel: "Retail",
    primaryUseCase: "Home & Lifestyle",
    requiredPlan: "free",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Serene design for lifestyle and beauty.",
      bullets: [
        "Editorial style storytelling",
        "Soft typography and palettes",
        "Ritual/Routine builder layouts",
      ],
      bestFor: ["Home decor", "Skincare/Beauty", "Wellness brands"],
      keyModules: [
        "Subscription Support",
        "Bundle Builder",
        "Blog Integration",
      ],
    },
    routes: ["/", "/collections/*", "/products/:slug"],
    layoutComponent: "BloomeHomeLayout",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "Branding",
          fields: [
            { key: "primaryColor", type: "color", label: "Primary Text Color", defaultValue: "#44403C" },
            { key: "accentColor", type: "color", label: "Accent Color", defaultValue: "#78716C" },
          ],
        },
        {
          id: "hero",
          title: "Hero Section",
          fields: [
            { key: "heroTitle", type: "text", label: "Hero Headline", defaultValue: "Objects for Mindful Living" },
          ],
        },
        {
          id: "nav",
          title: "Navigation",
          fields: [
            { key: "showJournal", type: "boolean", label: "Show Journal Link", defaultValue: true },
          ],
        },
      ],
    },
    onboardingProfile: {
      prefill: {
        industryCategory: "Beauty",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      requireSteps: ["payments"],
    },
  },
  "vayva-bookly-pro": {
    templateId: "vayva-bookly-pro",
    slug: "bookly-demo",
    displayName: "Bookly Pro",
    category: TemplateCategory.SERVICE,
    businessModel: "Service",
    primaryUseCase: "Appointments / Bookings",
    requiredPlan: "growth",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Professional booking system for experts.",
      bullets: [
        "Real-time calendar availability",
        "Service menu with duration",
        "Deposit requirement handling",
      ],
      bestFor: ["Consultants", "Salons & Spas", "Clinics"],
      keyModules: ["Appointment Scheduling", "Staff Management", "Deposits"],
    },
    routes: ["/", "/book/:serviceId"],
    layoutComponent: "BooklyLayout",
    onboardingProfile: {
      prefill: {
        industryCategory: "Services",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      requireSteps: ["payments"],
    },
  },
  "vayva-chopnow": {
    templateId: "vayva-chopnow",
    slug: "chopnow-demo",
    displayName: "ChopNow",
    category: TemplateCategory.FOOD,
    businessModel: "Food",
    primaryUseCase: "Food Delivery / Restaurants",
    requiredPlan: "growth",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Fast menu ordering for restaurants.",
      bullets: [
        "Modifier groups (sides, toppings)",
        "Delivery vs Pickup toggle",
        "Visual menu categories",
      ],
      bestFor: ["Restaurants", "Fast Food", "Cloud Kitchens"],
      keyModules: [
        "Kitchen Display System",
        "Menu Modifiers",
        "Delivery Zones",
      ],
    },
    routes: ["/"],
    layoutComponent: "ChopnowLayout",
    onboardingProfile: {
      prefill: {
        industryCategory: "Food",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      requireSteps: ["delivery", "payments"],
    },
  },
  "vayva-file-vault": {
    templateId: "vayva-file-vault",
    slug: "filevault-demo",
    displayName: "FileVault",
    category: TemplateCategory.DIGITAL,
    businessModel: "Digital",
    primaryUseCase: "Digital Downloads",
    requiredPlan: "growth",
    defaultTheme: "dark",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Secure delivery for digital assets.",
      bullets: [
        "Instant secure download links",
        "License key distribution",
        "Preview for audio/video/pdf",
      ],
      bestFor: ["E-book authors", "Software devs", "Digital artists"],
      keyModules: [
        "Digital Rights Management",
        "Secure Links",
        "Automated Email",
      ],
    },
    routes: ["/"],
    layoutComponent: "FileVaultLayout",
    onboardingProfile: {
      prefill: {
        industryCategory: "Digital",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      requireSteps: ["payments"],
    },
  },
  "vayva-ticketly": {
    templateId: "vayva-ticketly",
    slug: "ticketly-demo",
    displayName: "Ticketly",
    category: TemplateCategory.EVENTS,
    businessModel: "Events",
    primaryUseCase: "Ticketing / RSVPs",
    requiredPlan: "growth",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Event ticketing and guest management.",
      bullets: [
        "Tiered ticket types (VIP, Early Bird)",
        "Event schedule display",
        "QR code generation",
      ],
      bestFor: ["Concerts", "Workshops", "Conferences"],
      keyModules: ["Ticketing Engine", "QR Check-in", "Guest Lists"],
    },
    routes: ["/", "/events/:slug"],
    layoutComponent: "TicketlyLayout",
    onboardingProfile: {
      prefill: {
        industryCategory: "Events",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      requireSteps: ["payments"],
    },
  },
  "vayva-eduflow": {
    templateId: "vayva-eduflow",
    slug: "eduflow-demo",
    displayName: "Eduflow",
    category: TemplateCategory.EDUCATION,
    businessModel: "Courses",
    primaryUseCase: "Online Courses / LMS",
    requiredPlan: "growth",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Complete Learning Management System.",
      bullets: [
        "Course curriculum outline",
        "Video lesson player",
        "Progress tracking",
      ],
      bestFor: ["Educators", "Coaches", "Training Centers"],
      keyModules: ["LMS Player", "Student Progress", "Quizzes"],
    },
    routes: ["/", "/learn/:courseId"],
    layoutComponent: "EduflowLayout",
    onboardingProfile: {
      prefill: {
        industryCategory: "Education",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      requireSteps: ["payments"],
    },
  },
  "vayva-bulktrade": {
    templateId: "vayva-bulktrade",
    slug: "bulktrade-demo",
    displayName: "BulkTrade",
    category: TemplateCategory.B2B,
    businessModel: "Wholesale",
    primaryUseCase: "Wholesale / Bulk Orders",
    requiredPlan: "pro",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "B2B portal for high-volume trade.",
      bullets: [
        "Minimum Order Quantity (MOQ) rules",
        "Tiered volume pricing tables",
        "Request for Quote (RFQ) flow",
      ],
      bestFor: ["Wholesalers", "Manufacturers", "Distributors"],
      keyModules: ["RFQ System", "Volume Pricing", "Invoice Generation"],
    },
    routes: ["/"],
    layoutComponent: "BulkTradeLayout",
    onboardingProfile: {
      prefill: {
        industryCategory: "Wholesale",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      requireSteps: ["payments", "kyc"],
    },
  },
  "vayva-markethub": {
    templateId: "vayva-markethub",
    slug: "markethub-demo",
    displayName: "MarketHub",
    category: TemplateCategory.MARKETPLACE,
    businessModel: "Marketplace",
    primaryUseCase: "Multi-vendor",
    requiredPlan: "pro",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Launch your own multi-vendor platform.",
      bullets: [
        "Vendor profiles and catalogs",
        "Unified cart from multiple sellers",
        "Vendor rating system",
      ],
      bestFor: ["Niche marketplaces", "Aggregators", "Malls"],
      keyModules: [
        "Multi-vendor Payouts",
        "Vendor Portal",
        "Commission Engine",
      ],
    },
    routes: ["/"],
    layoutComponent: "MarketHubLayout",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "Branding",
          fields: [
            { key: "primaryColor", type: "color", label: "Primary Brand Color", defaultValue: "#22c55e" },
            { key: "accentColor", type: "color", label: "Accent Slate Color", defaultValue: "#1e293b" },
          ],
        },
        {
          id: "hero",
          title: "Hero Section",
          fields: [
            { key: "heroTitle", type: "text", label: "Main Headline", defaultValue: "World-class design assets" },
            { key: "searchPlaceholder", type: "text", label: "Search Placeholder", defaultValue: "Search over 4 million fonts, graphics, and more..." },
          ],
        },
      ],
    },
    onboardingProfile: {
      prefill: {
        industryCategory: "Marketplace",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      requireSteps: ["payments", "kyc"],
    },
  },
  "vayva-giveflow": {
    templateId: "vayva-giveflow",
    slug: "giveflow-demo",
    displayName: "GiveFlow",
    category: TemplateCategory.NONPROFIT,
    businessModel: "Donations",
    primaryUseCase: "Fundraising / Charity",
    requiredPlan: "growth",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Drive impact with donation campaigns.",
      bullets: [
        "Fundraising goal progress bars",
        "Recurring donation options",
        "Donor wall recognition",
      ],
      bestFor: ["Non-profits", "Charities", "Personal Causes"],
      keyModules: ["Donations", "Recurring Billing", "Goal Tracking"],
    },
    routes: ["/"],
    layoutComponent: "GiveFlowLayout",
    onboardingProfile: {
      prefill: {
        industryCategory: "Non-profit",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      requireSteps: ["payments"],
    },
  },
  "vayva-homelist": {
    templateId: "vayva-homelist",
    slug: "homelist-demo",
    displayName: "HomeList",
    category: TemplateCategory.REAL_ESTATE,
    businessModel: "Property",
    primaryUseCase: "Listings / Rentals",
    requiredPlan: "pro",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Showcase properties and capture leads.",
      bullets: [
        "Property search with advanced filters",
        "Map integration for locations",
        "Booking viewing appointments",
      ],
      bestFor: ["Real Estate Agents", "Property Managers", "Rental Listings"],
      keyModules: ["Property Listings", "Map View", "Lead Capture Form"],
    },
    routes: ["/", "/properties/*"],
    layoutComponent: "HomeListLayout",
    onboardingProfile: {
      prefill: {
        industryCategory: "Real Estate",
        deliveryEnabled: false,
        paymentsEnabled: false,
      },
    },
  },
  "vayva-oneproduct": {
    templateId: "vayva-oneproduct",
    slug: "oneproduct-demo",
    displayName: "OneProduct Pro",
    category: TemplateCategory.RETAIL,
    businessModel: "Single Product",
    primaryUseCase: "Funnel / Landing Page",
    requiredPlan: "growth",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "High-conversion single product funnel.",
      bullets: [
        "Long-form persuasion layout",
        "Sticky 'Buy Now' mobile CTA",
        "integrated upsell flows",
      ],
      bestFor: ["Dropshippers", "Inventors", "Flash Sales"],
      keyModules: ["Funnel Builder", "Upsells", "Reviews/Social Proof"],
    },
    routes: ["/"],
    layoutComponent: "OneProductLayout",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "Branding",
          fields: [
            { key: "primaryColor", type: "color", label: "Call to Action Color", defaultValue: "#f97316" },
          ],
        },
        {
          id: "hero",
          title: "Hero Section",
          fields: [
            { key: "heroTitle", type: "text", label: "Main Headline", defaultValue: "ProFocus Elite" },
            { key: "accentTitle", type: "text", label: "Accent Headline", defaultValue: "Elite" },
            { key: "showAnnouncement", type: "boolean", label: "Show Countdown Banner", defaultValue: true },
          ],
        },
      ],
    },
    onboardingProfile: {
      prefill: {
        industryCategory: "Retail",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      requireSteps: ["payments"],
    },
  },
  "vayva-vendorhive": {
    templateId: "vayva-vendorhive",
    slug: "vendorhive-demo",
    displayName: "Vendor Hive",
    category: TemplateCategory.MARKETPLACE,
    businessModel: "Multi-vendor Marketplace",
    primaryUseCase: "Etsy-style Marketplace",
    requiredPlan: "pro",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "The ultimate community-driven marketplace.",
      bullets: [
        "Store discovery and following",
        "Community rating system",
        "Powerful global search",
      ],
      bestFor: ["Handmade crafts", "Vintage goods", "Local artisans"],
      keyModules: ["Vendor Management", "Global Search", "Commissions"],
    },
    routes: ["/"],
    layoutComponent: "VendorHiveLayout",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "Branding",
          fields: [
            { key: "primaryColor", type: "color", label: "Honey Accent Color", defaultValue: "#fbbf24" },
          ],
        },
        {
          id: "hero",
          title: "Hero Section",
          fields: [
            { key: "heroTitle", type: "text", label: "Hero Headline", defaultValue: "Support Independent Makers." },
            { key: "searchPlaceholder", type: "text", label: "Nav Search Ghost", defaultValue: "Search products, brands, and shops..." },
          ],
        },
      ],
    },
    onboardingProfile: {
      prefill: {
        industryCategory: "Marketplace",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      requireSteps: ["payments", "kyc"],
    },
  },
  "vayva-gourmet-dining": {
    templateId: "vayva-gourmet-dining",
    slug: "gourmet-dining-demo",
    displayName: "Gourmet Dining",
    category: TemplateCategory.FOOD,
    businessModel: "Restaurant",
    primaryUseCase: "Fine Dining",
    requiredPlan: "pro",
    defaultTheme: "dark",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Exquisite culinary showcase for fine dining.",
      bullets: ["Elegant menu presentation", "Reservation system", "Chef showcase"],
      bestFor: ["Upscale restaurants", "Bistros", "Wine bars"],
      keyModules: ["Menu Management", "Reservations", "Gallery"],
    },
    routes: ["/"],
    layoutComponent: "GourmetDiningFoodLayout",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "Branding",
          fields: [
            { key: "primaryColor", type: "color", label: "Primary Accent (Gold)", defaultValue: "#d4af37" },
          ],
        },
        {
          id: "hero",
          title: "Hero Section",
          fields: [
            { key: "heroTitle", type: "text", label: "Hero Headline", defaultValue: "Gourmet Dining" },
            { key: "heroSubtitle", type: "text", label: "Hero Subtitle", defaultValue: "Fine Dining Experience" },
            { key: "heroDesc", type: "text", label: "Hero Description", defaultValue: "A culinary journey through contemporary flavors and traditional techniques." },
          ],
        },
      ],
    },
  },
  "vayva-brew-bean": {
    templateId: "vayva-brew-bean",
    slug: "brew-bean-demo",
    displayName: "Brew & Bean",
    category: TemplateCategory.FOOD,
    businessModel: "Coffee Shop",
    primaryUseCase: "Cafe / Bakery",
    requiredPlan: "growth",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Cozy digital storefront for your cafe.",
      bullets: ["Quick order flow", "Visual menu categories", "Daily specials"],
      bestFor: ["Coffee shops", "Bakeries", "Tea rooms"],
      keyModules: ["Menu Ordering", "Loyalty Support", "Location Info"],
    },
    routes: ["/"],
    layoutComponent: "BrewBeanCoffeeLayout",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "Branding",
          fields: [
            { key: "primaryColor", type: "color", label: "Theme Color (Coffee)", defaultValue: "#6F4E37" },
          ],
        },
        {
          id: "hero",
          title: "Hero Section",
          fields: [
            { key: "heroTitle", type: "text", label: "Hero Headline", defaultValue: "Morning Rituals." },
            { key: "heroSubtitle", type: "text", label: "Hero Subtitle", defaultValue: "Roasted Fresh Daily" },
            { key: "heroDesc", type: "text", label: "Hero Description", defaultValue: "Hand-crafted espresso drinks and fresh pastries." },
          ],
        },
      ],
    },
  },
  "vayva-slice-life": {
    templateId: "vayva-slice-life",
    slug: "slice-life-demo",
    displayName: "Slice of Life",
    category: TemplateCategory.FOOD,
    businessModel: "Pizzeria",
    primaryUseCase: "Pizza Delivery",
    requiredPlan: "growth",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "High-energy pizza delivery template.",
      bullets: ["Deal highlights", "Quick category navigation", "Customizable banners"],
      bestFor: ["Pizzerias", "Burger joints", "Fast food"],
      keyModules: ["Deals Engine", "Fast Checkout", "Delivery Tracking"],
    },
    routes: ["/"],
    layoutComponent: "SliceLifePizzaLayout",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "Branding",
          fields: [
            { key: "primaryColor", type: "color", label: "Primary Action Color", defaultValue: "#FF4500" },
          ],
        },
        {
          id: "hero",
          title: "Hero Section",
          fields: [
            { key: "heroTitle", type: "text", label: "Hero Headline", defaultValue: "Slice of Heaven." },
            { key: "bannerText", type: "text", label: "Announcement Banner", defaultValue: "⚡️ Free Delivery on orders over ₦15,000 • Use Code: SLICE20 ⚡️" },
            { key: "showBanner", type: "boolean", label: "Show Announcement Bar", defaultValue: true },
          ],
        },
      ],
    },
  },
  "vayva-sugar-rush": {
    templateId: "vayva-sugar-rush",
    slug: "sugar-rush-demo",
    displayName: "Sugar Rush",
    category: TemplateCategory.FOOD,
    businessModel: "Bakery",
    primaryUseCase: "Pastries & Cakes",
    requiredPlan: "growth",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Sweet editorial design for bakeries.",
      bullets: ["Playful aesthetics", "Product storytelling", "Gift card support"],
      bestFor: ["Bakeries", "Confectioneries", "Cake artists"],
      keyModules: ["Gift Support", "Visual Menu", "Instagram Integration"],
    },
    routes: ["/"],
    layoutComponent: "SugarRushBakeryLayout",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "Branding",
          fields: [
            { key: "primaryColor", type: "color", label: "Primary Pink", defaultValue: "#FF9AA2" },
            { key: "accentColor", type: "color", label: "Deep Pink Accent", defaultValue: "#FF6F91" },
          ],
        },
        {
          id: "hero",
          title: "Hero Section",
          fields: [
            { key: "heroTitle", type: "text", label: "Hero Headline", defaultValue: "Eat dessert first." },
            { key: "heroSubtitle", type: "text", label: "Hero Subtitle", defaultValue: "Life is short." },
          ],
        },
      ],
    },
  },
  "vayva-quick-bites": {
    templateId: "vayva-quick-bites",
    slug: "quick-bites-demo",
    displayName: "Quick Bites",
    category: TemplateCategory.FOOD,
    businessModel: "Fast Food",
    primaryUseCase: "Quick Service Reality",
    requiredPlan: "pro",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "The ultimate app-like food ordering experience.",
      bullets: ["Sidebar navigation", "Search-first interface", "Deal cards"],
      bestFor: ["QSR Chains", "Ghost Kitchens", "Food Hubs"],
      keyModules: ["Advanced Search", "Quick Cart", "Promo Engine"],
    },
    routes: ["/"],
    layoutComponent: "QuickBitesFoodLayout",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "Branding",
          fields: [
            { key: "primaryColor", type: "color", label: "Brand Primary Color", defaultValue: "#f97316" },
          ],
        },
        {
          id: "hero",
          title: "Hero Section",
          fields: [
            { key: "heroTitle", type: "text", label: "Promo Headline", defaultValue: "Get 20% off your first order!" },
            { key: "heroSubtitle", type: "text", label: "Promo Code", defaultValue: "SAVE20" },
          ],
        },
      ],
    },
  },
  "vayva-wellness": {
    templateId: "vayva-wellness",
    slug: "wellness-demo",
    displayName: "Wellness Booking",
    category: TemplateCategory.SERVICE,
    businessModel: "Service",
    primaryUseCase: "Spa / Wellness",
    requiredPlan: "growth",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Minimalist booking for wellness centers.",
      bullets: ["Serene aesthetic", "Seamless service selection", "Simple scheduling"],
      bestFor: ["Spas", "Yoga studios", "Massage therapist"],
      keyModules: ["Booking System", "Service Catalog", "Consultation"],
    },
    routes: ["/"],
    layoutComponent: "WellnessBookingLayout",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "Branding",
          fields: [
            { key: "primaryColor", type: "color", label: "Theme Color", defaultValue: "#8B7355" },
          ],
        },
        {
          id: "hero",
          title: "Hero Section",
          fields: [
            { key: "heroTitle", type: "text", label: "Hero Headline", defaultValue: "Restore your balance." },
            { key: "heroDesc", type: "text", label: "Hero Description", defaultValue: "Experience holistic treatments designed to rejuvenate your mind." },
          ],
        },
      ],
    },
  },
  "vayva-glow-salon": {
    templateId: "vayva-glow-salon",
    slug: "glow-salon-demo",
    displayName: "Glow Salon",
    category: TemplateCategory.SERVICE,
    businessModel: "Service",
    primaryUseCase: "Beauty Salon",
    requiredPlan: "pro",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Premium visual experience for beauty salons.",
      bullets: ["Stylist carousel", "Deep service details", "Visual review section"],
      bestFor: ["High-end salons", "Hair stylists", "Makeup studios"],
      keyModules: ["Staff Management", "Advanced Booking", "Photography"],
    },
    routes: ["/"],
    layoutComponent: "GlowSalonLayout",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "Branding",
          fields: [
            { key: "primaryColor", type: "color", label: "Brand Primary", defaultValue: "#881337" },
            { key: "accentColor", type: "color", label: "Stone Accent", defaultValue: "#1c1917" },
          ],
        },
        {
          id: "hero",
          title: "Hero Section",
          fields: [
            { key: "heroTitle", type: "text", label: "Hero Headline", defaultValue: "Redefine Your Radiance" },
            { key: "heroSubtitle", type: "text", label: "Hero Subtitle", defaultValue: "Luxury Beauty Experience" },
          ],
        },
      ],
    },
  },
  "vayva-pro-consult": {
    templateId: "vayva-pro-consult",
    slug: "pro-consult-demo",
    displayName: "Pro Consult",
    category: TemplateCategory.SERVICE,
    businessModel: "Service",
    primaryUseCase: "Professional Services",
    requiredPlan: "pro",
    defaultTheme: "dark",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Expert consult booking for professionals.",
      bullets: ["Domain expert showcase", "B2B aesthetic", "Session-based ordering"],
      bestFor: ["Business coaches", "Legal consults", "Tech advisors"],
      keyModules: ["Consultation Pipeline", "Invoice Generation", "Video Hosting"],
    },
    routes: ["/"],
    layoutComponent: "ProConsultBookingLayout",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "Branding",
          fields: [
            { key: "primaryColor", type: "color", label: "Action Color (Blue)", defaultValue: "#2563eb" },
            { key: "accentColor", type: "color", label: "Slate Base Color", defaultValue: "#0f172a" },
          ],
        },
        {
          id: "hero",
          title: "Hero Section",
          fields: [
            { key: "heroTitle", type: "text", label: "Hero Headline", defaultValue: "Expert advice, on demand." },
            { key: "heroDesc", type: "text", label: "Hero Description", defaultValue: "Connect with top-tier consultants across tech, marketing, legal, and finance." },
          ],
        },
      ],
    },
  },
  "vayva-charity": {
    templateId: "vayva-charity",
    slug: "charity-gala-demo",
    displayName: "Charity Gala",
    category: TemplateCategory.EVENTS,
    businessModel: "Events",
    primaryUseCase: "Fundraising Gala",
    requiredPlan: "pro",
    defaultTheme: "dark",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Elegant fundraising experience.",
      bullets: ["Luxury aesthetic", "Ticket tiers", "Sponsorship support"],
      bestFor: ["Galas", "Fundraisers", "Auctions"],
      keyModules: ["Ticketing", "Donations", "Event Info"],
    },
    routes: ["/"],
    layoutComponent: "CharityGalaLayout",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "Branding",
          fields: [
            { key: "primaryColor", type: "color", label: "Primary Accent (Amber)", defaultValue: "#FBBF24" },
          ],
        },
        {
          id: "hero",
          title: "Hero Section",
          fields: [
            { key: "heroTitle", type: "text", label: "Hero Headline", defaultValue: "A Night to Remember" },
            { key: "heroSubtitle", type: "text", label: "Hero Subtitle", defaultValue: "Annual Charity Gala" },
          ],
        },
      ],
    },
  },
  "vayva-sound-wave": {
    templateId: "vayva-sound-wave",
    slug: "soundwave-demo",
    displayName: "SoundWave",
    category: TemplateCategory.DIGITAL,
    businessModel: "Digital Store",
    primaryUseCase: "Audio & Beats",
    requiredPlan: "pro",
    defaultTheme: "dark",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Premium audio marketplace.",
      bullets: ["Audio player integration", "Waveform visuals", "Instant delivery"],
      bestFor: ["Producers", "Sound designers", "Musicians"],
      keyModules: ["Audio Samples", "License Management", "Music Playback"],
    },
    routes: ["/"],
    layoutComponent: "SoundWaveLayout",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "Branding",
          fields: [
            { key: "primaryColor", type: "color", label: "Primary Purple", defaultValue: "#9333ea" },
          ],
        },
        {
          id: "hero",
          title: "Hero Section",
          fields: [
            { key: "heroTitle", type: "text", label: "Hero Headline", defaultValue: "Sonic Landscapes For Your Vision." },
            { key: "heroSubtitle", type: "text", label: "Hero Subtitle", defaultValue: "Sonic Landscapes" },
            { key: "heroDesc", type: "text", label: "Hero Description", defaultValue: "High-fidelity beats, cinematic soundscapes, and royalty-free samples designed for producers and creators." },
          ],
        },
      ],
    },
  },
  "vayva-rsvp": {
    templateId: "vayva-rsvp",
    slug: "rsvp-mate-demo",
    displayName: "RSVPMate",
    category: TemplateCategory.EVENTS,
    businessModel: "RSVP",
    primaryUseCase: "Private Events",
    requiredPlan: "growth",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Simplified RSVP management.",
      bullets: ["Clean invitation design", "Guest tracking", "Event details"],
      bestFor: ["Weddings", "Parties", "Corporate mixers"],
      keyModules: ["RSVP Engine", "Guest List", "Invitations"],
    },
    routes: ["/"],
    layoutComponent: "RSVPMateLayout",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "Branding",
          fields: [
            { key: "primaryColor", type: "color", label: "Primary Dark", defaultValue: "#2c2c2c" },
            { key: "accentColor", type: "color", label: "Nude Accent", defaultValue: "#d1bfa7" },
          ],
        },
        {
          id: "hero",
          title: "Hero Section",
          fields: [
            { key: "heroTitle", type: "text", label: "Invitation Text", defaultValue: "You Are Invited To" },
            { key: "heroDesc", type: "text", label: "Event Description", defaultValue: "Join us for an evening of celebration, great food, and wonderful company. We look forward to sharing this special moment with you." },
          ],
        },
      ],
    },
  },
  "vayva-saas-starter": {
    templateId: "vayva-saas-starter",
    slug: "saas-starter-demo",
    displayName: "SaaS Starter",
    category: TemplateCategory.DIGITAL,
    businessModel: "Digital SaaS",
    primaryUseCase: "Software Boilerplates",
    requiredPlan: "pro",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "The ultimate SaaS launchpad.",
      bullets: ["Pricing tables", "Feature grid", "Code snippets"],
      bestFor: ["Developers", "Startup founders", "Indie hackers"],
      keyModules: ["Auth Ready", "Payments", "Landing Page"],
    },
    routes: ["/"],
    layoutComponent: "SaaSStarterLayout",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "Branding",
          fields: [
            { key: "primaryColor", type: "color", label: "Indigo Accent", defaultValue: "#4f46e5" },
          ],
        },
        {
          id: "hero",
          title: "Hero Section",
          fields: [
            { key: "heroTitle", type: "text", label: "Hero Headline", defaultValue: "Ship products at warp speed." },
            { key: "heroDesc", type: "text", label: "Hero Description", defaultValue: "The ultimate boilerplate for developers. Includes authentication, payments, database, and email - all pre-configured so you can focus on building." },
          ],
        },
      ],
    },
  },
  "vayva-conference": {
    templateId: "vayva-conference",
    slug: "conference-pro-demo",
    displayName: "Conference Pro",
    category: TemplateCategory.EVENTS,
    businessModel: "Events",
    primaryUseCase: "Tech Conferences",
    requiredPlan: "pro",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "World-class conference platform.",
      bullets: ["Speaker carousel", "Day-wise schedule", "Ticket passes"],
      bestFor: ["Conferences", "Summits", "Tech events"],
      keyModules: ["Speaker Management", "Agenda", "Ticketing"],
    },
    routes: ["/"],
    layoutComponent: "ConferenceProLayout",
    configSchema: {
      sections: [
        {
          id: "branding",
          title: "Branding",
          fields: [
            { key: "primaryColor", type: "color", label: "Blue Primary", defaultValue: "#2563eb" },
          ],
        },
        {
          id: "hero",
          title: "Hero Section",
          fields: [
            { key: "heroTitle", type: "text", label: "Hero Headline", defaultValue: "The Future of Tech & Design." },
            { key: "heroSubtitle", type: "text", label: "Event Date", defaultValue: "Oct 24-26, 2024" },
            { key: "heroDesc", type: "text", label: "Hero Description", defaultValue: "Join 2,000+ innovators for 3 days of inspiring talks, workshops, and networking in Lagos." },
          ],
        },
      ],
    },
  },
  "vayva-standard-service": {
    templateId: "vayva-standard-service",
    slug: "standard-service",
    displayName: "Standard Service",
    category: TemplateCategory.SERVICE,
    businessModel: "Service",
    primaryUseCase: "General Appointments",
    requiredPlan: "free",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Essential booking for service businesses.",
      bullets: ["Simple service list", "Direct booking flow", "Business hours display"],
      bestFor: ["Freelancers", "Local businesses", "Consultants"],
      keyModules: ["Booking", "Service List"],
    },
    routes: ["/"],
    layoutComponent: "StoreShell",
  },
  "vayva-standard-food": {
    templateId: "vayva-standard-food",
    slug: "standard-food",
    displayName: "Standard Food",
    category: TemplateCategory.FOOD,
    businessModel: "Food",
    primaryUseCase: "Restaurant Menu",
    requiredPlan: "free",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Classic menu display for your eatery.",
      bullets: ["Clean menu grid", "Order for pickup", "Location info"],
      bestFor: ["Small cafes", "Food stands", "Local diners"],
      keyModules: ["Menu", "Pickup Ordering"],
    },
    routes: ["/"],
    layoutComponent: "StoreShell",
  },
  "vayva-standard-digital": {
    templateId: "vayva-standard-digital",
    slug: "standard-digital",
    displayName: "Standard Digital",
    category: TemplateCategory.DIGITAL,
    businessModel: "Digital",
    primaryUseCase: "Digital Sales",
    requiredPlan: "free",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Simple storefront for digital downloads.",
      bullets: ["File delivery", "Secure payments", "Product previews"],
      bestFor: ["Artists", "Authors", "Indie makers"],
      keyModules: ["Digital Delivery", "Cart"],
    },
    routes: ["/"],
    layoutComponent: "StoreShell",
  },
  "vayva-standard-events": {
    templateId: "vayva-standard-events",
    slug: "standard-events",
    displayName: "Standard Events",
    category: TemplateCategory.EVENTS,
    businessModel: "Events",
    primaryUseCase: "Event RSVPs",
    requiredPlan: "free",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Basic ticketing and RSVPs.",
      bullets: ["RSVP tracking", "Event info", "Social sharing"],
      bestFor: ["Small meetups", "Parties", "Workshops"],
      keyModules: ["RSVP", "Event Details"],
    },
    routes: ["/"],
    layoutComponent: "StoreShell",
  },
  "vayva-standard-education": {
    templateId: "vayva-standard-education",
    slug: "standard-education",
    displayName: "Standard Education",
    category: TemplateCategory.EDUCATION,
    businessModel: "Courses",
    primaryUseCase: "Knowledge Sharing",
    requiredPlan: "free",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Simple course listings.",
      bullets: ["Lesson list", "Enrolment flow", "Tutor profile"],
      bestFor: ["Tutors", "Coaches", "Knowledge creators"],
      keyModules: ["Course List", "Registration"],
    },
    routes: ["/"],
    layoutComponent: "StoreShell",
  },
  "vayva-standard-b2b": {
    templateId: "vayva-standard-b2b",
    slug: "standard-b2b",
    displayName: "Standard B2B",
    category: TemplateCategory.B2B,
    businessModel: "Wholesale",
    primaryUseCase: "Catalog Showcase",
    requiredPlan: "free",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Simple wholesale catalog.",
      bullets: ["Bulk product display", "Inquiry form", "Company profile"],
      bestFor: ["Small wholesalers", "Distributors"],
      keyModules: ["Catalog", "Inquiry"],
    },
    routes: ["/"],
    layoutComponent: "StoreShell",
  },
  "vayva-standard-marketplace": {
    templateId: "vayva-standard-marketplace",
    slug: "standard-marketplace",
    displayName: "Standard Marketplace",
    category: TemplateCategory.MARKETPLACE,
    businessModel: "Marketplace",
    primaryUseCase: "Multi-vendor Directory",
    requiredPlan: "free",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Vendor directory and listings.",
      bullets: ["Vendor list", "Product categories", "Simple search"],
      bestFor: ["Local directories", "Niche marketplaces"],
      keyModules: ["Vendor List", "Directory"],
    },
    routes: ["/"],
    layoutComponent: "StoreShell",
  },
  "vayva-standard-nonprofit": {
    templateId: "vayva-standard-nonprofit",
    slug: "standard-nonprofit",
    displayName: "Standard Nonprofit",
    category: TemplateCategory.NONPROFIT,
    businessModel: "Donations",
    primaryUseCase: "Cause Support",
    requiredPlan: "free",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Essential donation page.",
      bullets: ["One-time donations", "Impact stories", "Volunteer signup"],
      bestFor: ["Small charities", "Local causes"],
      keyModules: ["Donations", "Impact"],
    },
    routes: ["/"],
    layoutComponent: "StoreShell",
  },
  "vayva-standard-realestate": {
    templateId: "vayva-standard-realestate",
    slug: "standard-realestate",
    displayName: "Standard Real Estate",
    category: TemplateCategory.REAL_ESTATE,
    businessModel: "Property",
    primaryUseCase: "Listings",
    requiredPlan: "free",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Personalized property listings.",
      bullets: ["Property gallery", "Lead form", "Agent contact"],
      bestFor: ["Solo agents", "Property managers"],
      keyModules: ["Listings", "Leads"],
    },
    routes: ["/"],
    layoutComponent: "StoreShell",
  },
};

export function getTemplatesByCategory(
  category: TemplateCategory | string,
): NormalizedTemplate[] {
  const norm = (s: string) => s.trim().toLowerCase();
  const target = norm(category as string);
  return getNormalizedTemplates().filter(
    (t) => norm(t.category || "") === target,
  );
}

export function getTemplateBySlug(
  slug: string,
): TemplateDefinition | undefined {
  return Object.values(TEMPLATE_REGISTRY).find((t) => t.slug === slug);
}

export function getTemplatesByPlan(plan: BillingPlan): TemplateDefinition[] {
  return Object.values(TEMPLATE_REGISTRY).filter(
    (t) => t.requiredPlan === plan,
  );
}

// --- CANONICAL NORMALIZER (BATCH 1) ---

export const DEFAULT_DESKTOP_PREVIEW =
  "/images/template-previews/default-desktop.png";
export const DEFAULT_MOBILE_PREVIEW =
  "/images/template-previews/default-mobile.png";

export type NormalizedTemplate = {
  id: string;
  slug: string;
  name: string;
  category?: string;
  description: string;

  previewImageDesktop: string; // never empty
  previewImageMobile: string; // never empty
  previewRoute: string; // /preview/[slug]

  features: string[];
  isFree: boolean;
  requiredPlan?: string;
  status: "active" | "inactive" | "deprecated" | string;
  badges: string[];
  configSchema?: ConfigSchema; // New field for customization

  layoutComponent?: string | null;
  registry: TemplateDefinition; // Typed properly
};

export function getNormalizedTemplates(): NormalizedTemplate[] {
  return Object.values(TEMPLATE_REGISTRY)
    .map((t: TemplateDefinition) => {
      const slug = t.slug || t.templateId;

      // Normalize desktop image (fallback used if null)
      const desktop =
        t.preview?.desktopUrl ||
        t.preview?.thumbnailUrl ||
        DEFAULT_DESKTOP_PREVIEW;

      // Normalize mobile image (fallback used if null)
      const mobile = t.preview?.mobileUrl || DEFAULT_MOBILE_PREVIEW;

      const features: string[] = Array.isArray(t.compare?.bullets)
        ? t.compare.bullets
        : [];

      const requiredPlan = t.requiredPlan || "free";
      const isFree = requiredPlan === "free";

      // Badge Logic
      const badges: string[] = [];
      if (t.templateId.includes("fashion") || t.templateId.includes("give")) {
        badges.push("New");
      }
      if (t.status === "implemented") {
        // badges.push("Ready");
      }
      if (t.requiredPlan === "pro") {
        badges.push("Pro");
      }

      return {
        id: t.templateId,
        slug,
        name: t.displayName,
        category: t.category,
        description: t.compare?.headline || "",

        previewImageDesktop: desktop,
        previewImageMobile: mobile,
        previewRoute: `/preview/${slug}`,

        features,
        isFree,
        requiredPlan,
        status: t.status || "active",
        badges,

        layoutComponent: t.layoutComponent,
        registry: t, // Keep ref to original
      };
    })
    .filter((t) => t.status === "implemented" || t.status === "partial");
}

export const TEMPLATES = getNormalizedTemplates();

export interface CategoryConfig {
  slug: TemplateCategory | string;
  displayName: string;
  recommendedTemplates: string[];
  isActive: boolean;
}

export const TEMPLATE_CATEGORIES: CategoryConfig[] = [
  {
    slug: TemplateCategory.RETAIL as any,
    displayName: "Retail",
    recommendedTemplates: ["vayva-standard", "vayva-aa-fashion"],
    isActive: true,
  },
  {
    slug: TemplateCategory.SERVICE as any,
    displayName: "Services & Appointments",
    recommendedTemplates: ["vayva-standard-service", "vayva-bookly-pro"],
    isActive: true,
  },
  {
    slug: TemplateCategory.FOOD as any,
    displayName: "Food & Dining",
    recommendedTemplates: ["vayva-standard-food", "vayva-chopnow"],
    isActive: true,
  },
  {
    slug: TemplateCategory.DIGITAL as any,
    displayName: "Digital Products",
    recommendedTemplates: ["vayva-standard-digital", "vayva-file-vault"],
    isActive: true,
  },
  {
    slug: TemplateCategory.EVENTS as any,
    displayName: "Events & Ticketing",
    recommendedTemplates: ["vayva-standard-events", "vayva-ticketly"],
    isActive: true,
  },
  {
    slug: TemplateCategory.EDUCATION as any,
    displayName: "Education & Courses",
    recommendedTemplates: ["vayva-standard-education", "vayva-eduflow"],
    isActive: true,
  },
  {
    slug: TemplateCategory.B2B as any,
    displayName: "Wholesale B2B",
    recommendedTemplates: ["vayva-standard-b2b", "vayva-bulktrade"],
    isActive: true,
  },
  {
    slug: TemplateCategory.MARKETPLACE as any,
    displayName: "Marketplace",
    recommendedTemplates: ["vayva-standard-marketplace", "vayva-markethub"],
    isActive: true,
  },
  {
    slug: TemplateCategory.NONPROFIT as any,
    displayName: "Donations & Fundraising",
    recommendedTemplates: ["vayva-standard-nonprofit", "vayva-giveflow"],
    isActive: true,
  },
  {
    slug: TemplateCategory.REAL_ESTATE as any,
    displayName: "Real Estate",
    recommendedTemplates: ["vayva-standard-realestate", "vayva-homelist"],
    isActive: true,
  },
];
