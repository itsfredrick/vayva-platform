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
  onboardingProfile?: OnboardingProfile;
  configSchema?: Record<
    string,
    {
      type: "color" | "text" | "number" | "boolean" | "select";
      label: string;
      default: any;
      options?: { label: string; value: any }[];
    }
  >;
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
    onboardingProfile: {
      prefill: {
        industryCategory: "Retail",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#4f46e5" },
      heroTitle: { type: "text", label: "Hero Title", default: "Modern Retail for Everyone" },
      heroDesc: { type: "text", label: "Hero Description", default: "Launch your online store with our flagship standard template. Clean, fast, and conversion-optimized." },
    },
  },
  "vayva-aa-fashion": {
    templateId: "vayva-aa-fashion",
    slug: "aa-fashion-demo",
    displayName: "A&A Fashion",
    category: TemplateCategory.RETAIL,
    businessModel: "Retail",
    primaryUseCase: "Fashion / Apparel",
    requiredPlan: "growth", // updated to Starter/Growth
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
    onboardingProfile: {
      prefill: {
        industryCategory: "Fashion",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#000000" },
      accentColor: { type: "color", label: "Accent Color", default: "#ffffff" },
      heroTitle: { type: "text", label: "Hero Title", default: "A&A Fashion: Bold Elegance" },
      heroDesc: { type: "text", label: "Hero Description", default: "Discover our latest seasonal collections and experience fashion that speaks for itself." },
    },
  },
  "vayva-gizmo-tech": {
    templateId: "vayva-gizmo-tech",
    slug: "gizmo-demo",
    displayName: "Gizmo Tech",
    category: TemplateCategory.RETAIL,
    businessModel: "Retail",
    primaryUseCase: "Electronics",
    requiredPlan: "growth", // updated to Starter/Growth
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
    onboardingProfile: {
      prefill: {
        industryCategory: "Electronics",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#0f172a" },
      accentColor: { type: "color", label: "Accent Color", default: "#3b82f6" },
      heroTitle: { type: "text", label: "Hero Title", default: "The Future of Electronics" },
      heroDesc: { type: "text", label: "Hero Description", default: "From high-performance audio to the latest in computing, Gizmo Tech brings you the best in technology." },
    },
  },
  "vayva-bloome-home": {
    templateId: "vayva-bloome-home",
    slug: "bloome-demo",
    displayName: "Bloome & Home",
    category: TemplateCategory.RETAIL,
    businessModel: "Retail",
    primaryUseCase: "Home & Lifestyle",
    requiredPlan: "pro", // updated to Pro
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
    onboardingProfile: {
      prefill: {
        industryCategory: "Beauty",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#fdf4ff" },
      accentColor: { type: "color", label: "Accent Color", default: "#a21caf" },
      heroTitle: { type: "text", label: "Hero Title", default: "Serene Spaces, Beautiful Living" },
      heroDesc: { type: "text", label: "Hero Description", default: "Curated collections for your home and lifestyle. Discover the art of beautiful living with Bloome & Home." },
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
      skipSteps: ["delivery"],
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#4f46e5" },
      heroTitle: { type: "text", label: "Hero Title", default: "Book Your Next Session" },
      heroDesc: { type: "text", label: "Hero Description", default: "Schedule appointments with ease and manage your time efficiently with our professional booking system." },
    },
  },
  "vayva-coffee": {
    templateId: "vayva-coffee",
    slug: "coffee-demo",
    displayName: "Brew & Bean",
    category: TemplateCategory.FOOD,
    businessModel: "Food",
    primaryUseCase: "Coffee Shop",
    requiredPlan: "free",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Simple ordering for cafes.",
      bullets: [
        "Warm, inviting aesthetic",
        "Quick-add menu grid",
        "Location & Hours highlight",
      ],
      bestFor: ["Coffee Shops", "Bakeries", "Juice Bars"],
      keyModules: ["Quick Menu", "Hours Display", "Simple Cart"],
    },
    routes: ["/"],
    layoutComponent: "BrewBeanCoffee",
    onboardingProfile: {
      prefill: {
        industryCategory: "Food",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#78350f" },
      heroTitle: { type: "text", label: "Hero Title", default: "Experience Better Coffee" },
      heroDesc: { type: "text", label: "Hero Description", default: "Artisan beans, expert roasting, and the perfect brew. Discover your new favorite coffee with Brew & Bean." },
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
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#ea580c" },
      heroTitle: { type: "text", label: "Hero Title", default: "Delicious Food, Fast." },
      heroDesc: { type: "text", label: "Hero Description", default: "Order your favorite meals from the best local restaurants. Hot, fresh, and delivered to your door." },
    },
  },
  "vayva-pizza": {
    templateId: "vayva-pizza",
    slug: "pizza-demo",
    displayName: "Slice Life",
    category: TemplateCategory.FOOD,
    businessModel: "Food",
    primaryUseCase: "Pizzeria / Fast Casual",
    requiredPlan: "growth", // Starter
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Bold, high-energy pizza delivery.",
      bullets: [
        "Interactive deal banners",
        "Visual toppings showcase",
        "Delivery promise tracker",
      ],
      bestFor: ["Pizzerias", "Burger Joints", "Fast Casual"],
      keyModules: ["Deal Engine", "Delivery Tracker", "Item Customization"],
    },
    routes: ["/"],
    layoutComponent: "SliceLifePizza",
    onboardingProfile: {
      prefill: {
        industryCategory: "Food",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      requireSteps: ["delivery", "payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#e11d48" },
      heroTitle: { type: "text", label: "Hero Title", default: "Best Pizza in Town" },
      heroDesc: { type: "text", label: "Hero Description", default: "Freshly made dough, premium toppings, and the perfect bake. Order your Slice Life pizza today." },
    },
  },
  "vayva-gourmet": {
    templateId: "vayva-gourmet",
    slug: "gourmet-demo",
    displayName: "Gourmet Dining",
    category: TemplateCategory.FOOD,
    businessModel: "Food",
    primaryUseCase: "Fine Dining",
    requiredPlan: "pro",
    defaultTheme: "dark",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Elegant fine dining experience.",
      bullets: [
        "Reservation system integration",
        "Seasonal menu showcase",
        "Chef's story section",
      ],
      bestFor: ["Fine Dining", "Steakhouses", "Wine Bars"],
      keyModules: [
        "Table Reservations",
        "Event Booking",
        "Wine List",
      ],
    },
    routes: ["/"],
    layoutComponent: "GourmetDiningFood",
    onboardingProfile: {
      prefill: {
        industryCategory: "Food Service",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      skipSteps: ["delivery"],
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#1a1a1a" },
      heroTitle: { type: "text", label: "Hero Title", default: "Exquisite Fine Dining" },
      heroDesc: { type: "text", label: "Hero Description", default: "Experience the art of culinary excellence. Our chefs create seasonal masterpieces for a truly unforgettable evening." },
    },
  },
  "vayva-bakery": {
    templateId: "vayva-bakery",
    slug: "bakery-demo",
    displayName: "Sugar Rush",
    category: TemplateCategory.FOOD,
    businessModel: "Food",
    primaryUseCase: "Bakery / Desserts",
    requiredPlan: "free",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Playful designs for sweet treats.",
      bullets: [
        "Pastel color palette",
        "Photo-first menu grid",
        "Curbside pickup focus",
      ],
      bestFor: ["Bakeries", "Cupcake Shops", "Ice Cream Parlors"],
      keyModules: ["Visual Menu", "Pickup Scheduler", "Gift Options"],
    },
    routes: ["/"],
    layoutComponent: "SugarRushBakery",
    onboardingProfile: {
      prefill: {
        industryCategory: "Food",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      requireSteps: ["delivery", "payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#f472b6" },
      heroTitle: { type: "text", label: "Hero Title", default: "Sweet Treats & More" },
      heroDesc: { type: "text", label: "Hero Description", default: "From decadent cakes to artisan breads, satisfy your cravings with our freshly baked delights." },
    },
  },
  "vayva-salon": {
    templateId: "vayva-salon",
    slug: "salon-demo",
    displayName: "Glow Salon",
    category: TemplateCategory.SERVICE,
    businessModel: "Service",
    primaryUseCase: "Salon / Spa",
    requiredPlan: "pro",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Premium salon booking experience.",
      bullets: [
        "Stylist portfolios",
        "Service menu with add-ons",
        "Lookbook gallery",
      ],
      bestFor: ["Hair Salons", "Spas", "Beauty Clinics"],
      keyModules: ["Booking", "Staff Profiles", "Gallery"],
    },
    routes: ["/"],
    layoutComponent: "GlowSalon",
    onboardingProfile: {
      prefill: {
        industryCategory: "Beauty",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#4f46e5" },
      heroTitle: { type: "text", label: "Hero Title", default: "Radiate with Glow Salon" },
      heroDesc: { type: "text", label: "Hero Description", default: "Expert hair styling, rejuvenating spa treatments, and premium beauty services. Book your transformation today." },
    },
  },
  "vayva-fitness": {
    templateId: "vayva-fitness",
    slug: "fitness-demo",
    displayName: "FitPhysique",
    category: TemplateCategory.SERVICE,
    businessModel: "Service",
    primaryUseCase: "Gym / Fitness",
    requiredPlan: "growth",
    defaultTheme: "dark",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "High-energy fitness studio template.",
      bullets: [
        "Class schedule calendar",
        "Trainer profiles",
        "Membership plan pricing",
      ],
      bestFor: ["Gyms", "Yoga Studios", "CrossFit"],
      keyModules: ["Class Booking", "Memberships", "Schedule"],
    },
    routes: ["/"],
    layoutComponent: "FitPhysique",
    onboardingProfile: {
      prefill: {
        industryCategory: "Fitness",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#ef4444" },
      heroTitle: { type: "text", label: "Hero Title", default: "Push Your Limits" },
      heroDesc: { type: "text", label: "Hero Description", default: "High-intensity training, expert coaches, and a supportive community. Join FitPhysique and crush your goals." },
    },
  },
  "vayva-cleaning": {
    templateId: "vayva-cleaning",
    slug: "cleaning-demo",
    displayName: "CleanPro",
    category: TemplateCategory.SERVICE,
    businessModel: "Service",
    primaryUseCase: "Cleaning / Home Services",
    requiredPlan: "free",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Trustworthy home service booking.",
      bullets: [
        "Instant quote request",
        "Service area coverage",
        "Customer testimonials",
      ],
      bestFor: ["Cleaners", "Plumbers", "Handymen"],
      keyModules: ["Quote Request", "Service List", "Trust Badges"],
    },
    routes: ["/"],
    layoutComponent: "CleanPro",
    onboardingProfile: {
      prefill: {
        industryCategory: "Home Services",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      skipSteps: ["delivery"],
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#2563eb" },
      heroTitle: { type: "text", label: "Hero Title", default: "Professional Home Services" },
      heroDesc: { type: "text", label: "Hero Description", default: "Reliable cleaning, plumbing, and maintenance services you can trust. Get an instant quote today." },
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
    layoutComponent: "DigitalVaultStore",
    onboardingProfile: {
      prefill: {
        industryCategory: "Digital",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      skipSteps: ["delivery"],
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#FF90E8" },
      heroTitle: { type: "text", label: "Hero Title", default: "High-quality digital assets for creators." },
      heroDesc: { type: "text", label: "Hero Description", default: "Premium fonts, prototypes, templates, and textures. Carefully curated for professional designers. Instant download." },
    },
  },
  "vayva-lens-folio": {
    templateId: "vayva-lens-folio",
    slug: "lensfolio-demo",
    displayName: "LensFolio",
    category: TemplateCategory.DIGITAL,
    businessModel: "Digital",
    primaryUseCase: "Photography / Design",
    requiredPlan: "growth",
    defaultTheme: "dark",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Showcase and sell creative assets.",
      bullets: [
        "Masonry grid gallery",
        "Before/After comparison sliders",
        "Digital download delivery",
      ],
      bestFor: ["Photographers", "Designers", "Visual Artists"],
      keyModules: ["Gallery", "Digital Delivery", "Portfolio"],
    },
    routes: ["/"],
    layoutComponent: "LensFolio",
    onboardingProfile: {
      prefill: {
        industryCategory: "Creative",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      skipSteps: ["delivery"],
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#4f46e5" },
      heroTitle: { type: "text", label: "Hero Title", default: "Through My Lens" },
      heroDesc: { type: "text", label: "Hero Description", default: "Discover a collection of unique perspectives and captured moments. Fine art prints and digital downloads for your collection." },
    },
  },
  "vayva-conference": {
    templateId: "vayva-conference",
    slug: "conference-demo",
    displayName: "ConferencePro",
    category: TemplateCategory.EVENTS,
    businessModel: "Events",
    primaryUseCase: "Conferences / Summits",
    requiredPlan: "pro",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Professional conference management.",
      bullets: [
        "Speaker lineup grid",
        "Multi-day schedule",
        "Sponsor showcase",
      ],
      bestFor: ["Tech Summits", "Medical Conferences", "Trade Shows"],
      keyModules: ["Schedule", "Speakers", "Sponsors"],
    },
    routes: ["/"],
    layoutComponent: "ConferencePro",
    onboardingProfile: {
      prefill: {
        industryCategory: "Events",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      skipSteps: ["delivery"],
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#2563eb" },
      heroTitle: { type: "text", label: "Hero Title", default: "The Future of Tech" },
      heroDesc: { type: "text", label: "Hero Description", default: "Join us for the most anticipated tech conference of the year. Network with leaders and learn from the best." },
    },
  },
  "vayva-rsvp": {
    templateId: "vayva-rsvp",
    slug: "rsvp-demo",
    displayName: "RSVPMate",
    category: TemplateCategory.EVENTS,
    businessModel: "Events",
    primaryUseCase: "Weddings / Parties",
    requiredPlan: "free",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Elegant digital invitations.",
      bullets: [
        "Single page RSVP",
        "Event details card",
        "Guest list management",
      ],
      bestFor: ["Weddings", "Birthdays", "Private Dinners"],
      keyModules: ["RSVP Form", "Event Details", "Map"],
    },
    routes: ["/"],
    layoutComponent: "RSVPMate",
    onboardingProfile: {
      prefill: {
        industryCategory: "Events",
        deliveryEnabled: false,
        paymentsEnabled: false, // Often free RSVP
      },
      skipSteps: ["delivery", "payments"],
      requireSteps: [],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#4f46e5" },
      heroTitle: { type: "text", label: "Hero Title", default: "We're Getting Married!" },
      heroDesc: { type: "text", label: "Hero Description", default: "Please join us for our special day. We can't wait to celebrate with you." },
    },
  },
  "vayva-coach": {
    templateId: "vayva-coach",
    slug: "coach-demo",
    displayName: "CoachLife",
    category: TemplateCategory.EDUCATION,
    businessModel: "Education",
    primaryUseCase: "Coaching / Mentorship",
    requiredPlan: "growth",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Personal brand for coaches.",
      bullets: [
        "1-on-1 session booking",
        "Testimonial carousels",
        "Intro video support",
      ],
      bestFor: ["Life Coaches", "Business Mentors", "Consultants"],
      keyModules: ["Bookings", "Blog", "Video"],
    },
    routes: ["/"],
    layoutComponent: "CoachLife",
    onboardingProfile: {
      prefill: {
        industryCategory: "Education",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      skipSteps: ["delivery"],
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#4f46e5" },
      accentColor: { type: "color", label: "Accent Color", default: "#6366f1" },
      heroTitle: { type: "text", label: "Hero Title", default: "Unlock Your Potential" },
      heroDesc: { type: "text", label: "Hero Description", default: "Personalized coaching and mentorship programs designed to help you achieve your professional and personal goals." },
    },
  },
  "vayva-workshop": {
    templateId: "vayva-workshop",
    slug: "workshop-demo",
    displayName: "WorkshopHub",
    category: TemplateCategory.EDUCATION,
    businessModel: "Education",
    primaryUseCase: "Online Courses / Workshops",
    requiredPlan: "pro",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Sell courses and workshops.",
      bullets: [
        "Course catalog grid",
        "Instructor profiles",
        "Filtering & Search",
      ],
      bestFor: ["Training Centers", "Bootcamps", "Online Schools"],
      keyModules: ["Course Catalog", "Search", "Student Accounts"],
    },
    routes: ["/"],
    layoutComponent: "WorkshopHub",
    onboardingProfile: {
      prefill: {
        industryCategory: "Education",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      skipSteps: ["delivery"],
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#4f46e5" },
      accentColor: { type: "color", label: "Accent Color", default: "#f59e0b" },
      heroTitle: { type: "text", label: "Hero Title", default: "Master New Skills" },
      heroDesc: { type: "text", label: "Hero Description", default: "Join our expert-led workshops and courses to advance your career and master the latest technologies." },
    },
  },


  "vayva-sound-wave": {
    templateId: "vayva-sound-wave",
    slug: "soundwave-demo",
    displayName: "SoundWave",
    category: TemplateCategory.DIGITAL,
    businessModel: "Digital",
    primaryUseCase: "Audio / Music",
    requiredPlan: "growth",
    defaultTheme: "dark",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Audio marketplace for producers.",
      bullets: [
        "Interactive audio player",
        "Track licensing options",
        "Beat selling workflow",
      ],
      bestFor: ["Music Producers", "Sound Designers", "Record Labels"],
      keyModules: ["Audio Player", "Licensing", "Digital Downloads"],
    },
    routes: ["/"],
    layoutComponent: "SoundWave",
    onboardingProfile: {
      prefill: {
        industryCategory: "Music",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      skipSteps: ["delivery"],
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#ef4444" },
      heroTitle: { type: "text", label: "Hero Title", default: "Elevate Your Sound" },
      heroDesc: { type: "text", label: "Hero Description", default: "Premium audio assets and music production tools for modern creators." },
    },
  },
  "vayva-saas-starter": {
    templateId: "vayva-saas-starter",
    slug: "saas-demo",
    displayName: "SaaS Starter",
    category: TemplateCategory.DIGITAL,
    businessModel: "Digital",
    primaryUseCase: "Software / SaaS",
    requiredPlan: "pro",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Modern landing page for software.",
      bullets: [
        "Pricing tier comparison",
        "Feature highlight grid",
        "Documentation links",
      ],
      bestFor: ["SaaS Founders", "Indie Hackers", "Software Tools"],
      keyModules: ["Landing Page", "Pricing Table", "Documentation"],
    },
    routes: ["/"],
    layoutComponent: "SaaSStarter",
    onboardingProfile: {
      prefill: {
        industryCategory: "Software",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      skipSteps: ["delivery"],
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#10b981" },
      heroTitle: { type: "text", label: "Hero Title", default: "The Modern SaaS Template" },
      heroDesc: { type: "text", label: "Hero Description", default: "Build and launch your next big idea faster with our complete SaaS starter kit." },
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
    layoutComponent: "EventTicketsPro",
    onboardingProfile: {
      prefill: {
        industryCategory: "Events",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      skipSteps: ["delivery"],
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#d1410c" },
      heroTitle: { type: "text", label: "Hero Title", default: "Make memories live." },
      heroDesc: { type: "text", label: "Hero Description", default: "Trending events happening near you." },
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
    layoutComponent: "LearnHubCourses",
    onboardingProfile: {
      prefill: {
        industryCategory: "Education",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      skipSteps: ["delivery"],
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#4f46e5" },
      heroTitle: { type: "text", label: "Hero Title", default: "Advance Your Career" },
      heroDesc: { type: "text", label: "Hero Description", default: "Learn from industry experts with our comprehensive, flexible courses designed for modern professionals." },
    },
  },
  "vayva-bulktrade": {
    templateId: "vayva-bulktrade",
    slug: "bulktrade-demo",
    displayName: "BulkTrade",
    category: TemplateCategory.B2B,
    businessModel: "Wholesale",
    primaryUseCase: "Bulk Sales / Distribution",
    requiredPlan: "growth",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Streamlined wholesale ordering.",
      bullets: [
        "MOQ enforcement",
        "Volume pricing tiers",
        "Quote request flow",
      ],
      bestFor: ["Distributors", "Manufacturers", "Importers"],
      keyModules: ["Bulk Pricing", "Request Quote", "Inventory"],
    },
    routes: ["/"],
    layoutComponent: "BulkTrade",
    onboardingProfile: {
      prefill: {
        industryCategory: "B2B",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      skipSteps: ["delivery"],
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#4f46e5" },
      heroTitle: { type: "text", label: "Hero Title", default: "B2B Wholesale Marketplace" },
      heroDesc: { type: "text", label: "Hero Description", default: "Streamline your bulk trading and supply chain with our specialized B2B platform." },
    },
  },
  "vayva-supplier": {
    templateId: "vayva-supplier",
    slug: "supplier-demo",
    displayName: "SupplierNetwork",
    category: TemplateCategory.B2B,
    businessModel: "B2B",
    primaryUseCase: "Supplier Marketplace",
    requiredPlan: "pro",
    defaultTheme: "dark",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Premier B2B network platform.",
      bullets: [
        "Supplier directory",
        "Contract management",
        "RFP submission",
      ],
      bestFor: ["Sourcing Agents", "Trade Associations", "Exporters"],
      keyModules: ["Directory", "Contracts", "RFP System"],
    },
    routes: ["/"],
    layoutComponent: "SupplierNetwork",
    onboardingProfile: {
      prefill: {
        industryCategory: "B2B",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      skipSteps: ["delivery"],
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#4f46e5" },
      heroTitle: { type: "text", label: "Hero Title", default: "Global Supplier Network" },
      heroDesc: { type: "text", label: "Hero Description", default: "Connect with verified suppliers across the globe and manage your procurement with ease." },
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
    onboardingProfile: {
      prefill: {
        industryCategory: "Marketplace",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      requireSteps: ["payments", "kyc"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#4f46e5" },
      heroTitle: { type: "text", label: "Hero Title", default: "Premier Digital Marketplace" },
      heroDesc: { type: "text", label: "Hero Description", default: "Connect with the best digital creators and discover exclusive assets for your next project." },
    },
  },
  "vayva-vendorhive": {
    templateId: "vayva-vendorhive",
    slug: "vendorhive-demo",
    displayName: "VendorHive",
    category: TemplateCategory.MARKETPLACE,
    businessModel: "Marketplace",
    primaryUseCase: "Artisan Marketplace",
    requiredPlan: "pro",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Community-driven artisan marketplace.",
      bullets: [
        "Shop by brand/maker",
        "Curated collections",
        "Social shopping feed",
      ],
      bestFor: ["Artisans", "Vintage Sellers", "Local Markets"],
      keyModules: ["Multi-vendor Cart", "Shop Profiles", "Feed"],
    },
    routes: ["/"],
    layoutComponent: "VendorHive",
    onboardingProfile: {
      prefill: {
        industryCategory: "Marketplace",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      skipSteps: ["delivery"],
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#4f46e5" },
      heroTitle: { type: "text", label: "Hero Title", default: "Handcrafted with Love" },
      heroDesc: { type: "text", label: "Hero Description", default: "Support local artisans and find unique, handmade treasures for your home and lifestyle." },
    },
  },
  "vayva-giveflow": {
    templateId: "vayva-giveflow",
    slug: "giveflow-demo",
    displayName: "GiveFlow",
    category: TemplateCategory.NONPROFIT,
    businessModel: "Donations",
    primaryUseCase: "Fundraising / Charity",
    requiredPlan: "free",
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
    layoutComponent: "GiveFlow",
    onboardingProfile: {
      prefill: {
        industryCategory: "Non-profit",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      skipSteps: ["delivery"],
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#064e3b" },
      accentColor: { type: "color", label: "Accent Color", default: "#ecfdf5" },
      heroTitle: { type: "text", label: "Hero Title", default: "Make a Lasting Impact" },
      heroDesc: { type: "text", label: "Hero Description", default: "Your contribution directly supports our mission to create positive change in the world." },
    },
  },
  "vayva-charity": {
    templateId: "vayva-charity",
    slug: "charity-demo",
    displayName: "CharityGala",
    category: TemplateCategory.NONPROFIT,
    businessModel: "Events",
    primaryUseCase: "Gala / Event Tickets",
    requiredPlan: "growth",
    defaultTheme: "dark",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Elegant event ticketing for galas.",
      bullets: [
        "Table reservations",
        "Sponsorship tiers",
        "Event schedule",
      ],
      bestFor: ["Foundations", "Galas", "Fundraisers"],
      keyModules: ["Ticketing", "Seat Selection", "Sponsorship"],
    },
    routes: ["/"],
    layoutComponent: "CharityGala",
    onboardingProfile: {
      prefill: {
        industryCategory: "Non-profit",
        deliveryEnabled: false,
        paymentsEnabled: true,
      },
      skipSteps: ["delivery"],
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#4f46e5" },
      heroTitle: { type: "text", label: "Hero Title", default: "Join Our Charity Gala" },
      heroDesc: { type: "text", label: "Hero Description", default: "Celebrate with us at our annual charity gala. Together, we can make a difference in our community." },
    },
  },
  "vayva-homelist": {
    templateId: "vayva-homelist",
    slug: "homelist-demo",
    displayName: "HomeList",
    category: TemplateCategory.REAL_ESTATE,
    businessModel: "Property",
    primaryUseCase: "Residential Listings",
    requiredPlan: "growth",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Simple property listings for agencies.",
      bullets: [
        "Grid view properties",
        "Agent contact forms",
        "Neighborhood guides",
      ],
      bestFor: ["Local Agencies", "Realtors", "Property Managers"],
      keyModules: ["Listings Grid", "Contact Form", "Map"],
    },
    routes: ["/"],
    layoutComponent: "HomeListLayout",
    onboardingProfile: {
      prefill: {
        industryCategory: "Real Estate",
        deliveryEnabled: false,
        paymentsEnabled: false,
      },
      skipSteps: ["delivery", "payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#4f46e5" },
      heroTitle: { type: "text", label: "Hero Title", default: "Find Your Perfect Home" },
      heroDesc: { type: "text", label: "Hero Description", default: "Explore our wide range of residential properties and find the one that fits your lifestyle." },
    },
  },
  "vayva-estate": {
    templateId: "vayva-estate",
    slug: "estate-demo",
    displayName: "EstatePrime",
    category: TemplateCategory.REAL_ESTATE,
    businessModel: "Property",
    primaryUseCase: "Luxury Real Estate",
    requiredPlan: "pro",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Showcase properties and capture leads.",
      bullets: [
        "Property search & filters",
        "Booking appointment flow",
        "Map integration",
      ],
      bestFor: ["Real Estate Agencies", "Developers", "Property Managers"],
      keyModules: ["Property Listings", "Map View", "Lead Capture Form"],
    },
    routes: ["/"],
    layoutComponent: "EstatePrime",
    onboardingProfile: {
      prefill: {
        industryCategory: "Real Estate",
        deliveryEnabled: false,
        paymentsEnabled: false,
      },
      skipSteps: ["delivery", "payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#1a1a1a" },
      heroTitle: { type: "text", label: "Hero Title", default: "Find Your Dream Home" },
      heroDesc: { type: "text", label: "Hero Description", default: "Discover our curated collection of premium properties and experience luxury living at its finest." },
    },
  },
  "vayva-agent": {
    templateId: "vayva-agent",
    slug: "agent-demo",
    displayName: "AgentPortfolio",
    category: TemplateCategory.REAL_ESTATE,
    businessModel: "Personal",
    primaryUseCase: "Agent Profile",
    requiredPlan: "growth",
    defaultTheme: "light",
    status: "implemented",
    preview: { thumbnailUrl: null, mobileUrl: null, desktopUrl: null },
    compare: {
      headline: "Personal brand for top agents.",
      bullets: [
        "Profile & Bio section",
        "Active listings grid",
        "Direct contact options",
      ],
      bestFor: ["Real Estate Agents", "Brokers", "Consultants"],
      keyModules: ["Agent Profile", "Listings", "Contact"],
    },
    routes: ["/"],
    layoutComponent: "AgentPortfolio",
    onboardingProfile: {
      prefill: {
        industryCategory: "Real Estate",
        deliveryEnabled: false,
        paymentsEnabled: false,
      },
      skipSteps: ["delivery", "payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#0f172a" },
      heroTitle: { type: "text", label: "Hero Title", default: "Your Trusted Real Estate Partner" },
      heroDesc: { type: "text", label: "Hero Description", default: "Hi, I'm your dedicated real estate agent. I'm here to help you find the perfect home or sell your property for the best price." },
    },
  },
  "vayva-oneproduct": {
    templateId: "vayva-oneproduct",
    slug: "oneproduct-demo",
    displayName: "OneProduct Pro",
    category: TemplateCategory.RETAIL,
    businessModel: "Single Product",
    primaryUseCase: "Funnel / Landing Page",
    requiredPlan: "pro", // updated to Pro
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
    onboardingProfile: {
      prefill: {
        industryCategory: "Retail",
        deliveryEnabled: true,
        paymentsEnabled: true,
      },
      requireSteps: ["payments"],
    },
    configSchema: {
      primaryColor: { type: "color", label: "Primary Color", default: "#4f46e5" },
      heroTitle: { type: "text", label: "Hero Title", default: "Discover the Future of Audio" },
      heroDesc: { type: "text", label: "Hero Description", default: "Experience sound like never before with our premium headphones, designed for true audiophiles." },
    },
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

  preview?: {
    thumbnailUrl: string | null;
    mobileUrl: string | null;
    desktopUrl: string | null;
    testUrl?: string | null;
  };
  previewImageDesktop: string; // never empty
  previewImageMobile: string; // never empty
  previewRoute: string; // /preview/[slug]

  features: string[];
  isFree: boolean;
  requiredPlan?: string;
  status: "active" | "inactive" | "deprecated" | string;

  layoutComponent?: string | null;
  registry: any;
};

export function getNormalizedTemplates(): NormalizedTemplate[] {
  return Object.values(TEMPLATE_REGISTRY)
    .map((t: any) => {
      const slug = t.slug || t.templateId;

      // Normalize desktop image (fallback used if null)
      const desktop =
        t.preview?.desktopUrl ||
        t.preview?.thumbnailUrl ||
        DEFAULT_DESKTOP_PREVIEW;

      // Normalize mobile image (fallback used if null)
      const mobile = t.preview?.mobileUrl || DEFAULT_MOBILE_PREVIEW;

      const features: string[] = Array.isArray(t.features)
        ? t.features
        : Array.isArray(t.compare?.bullets)
          ? t.compare.bullets
          : [];

      const requiredPlan = t.requiredPlan || "free";
      const isFree = requiredPlan === "free";

      return {
        id: t.templateId,
        slug,
        name: t.displayName,
        category: t.category,
        description: t.compare?.headline || t.description || "",

        preview: t.preview, // Pass through the full preview object
        previewImageDesktop: desktop,
        previewImageMobile: mobile,
        previewRoute: `/preview/${t.templateId}`, // Changed from slug to templateId for consistency with route

        features,
        isFree,
        requiredPlan,
        status: t.status || "active",

        layoutComponent: t.layoutComponent,
        registry: t, // Keep ref to original
      };
    })
    .filter((t) => t.status === "active" || t.status === "implemented");
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
    recommendedTemplates: ["vayva-bookly-pro", "vayva-salon", "vayva-fitness", "vayva-cleaning"],
    isActive: true,
  },
  {
    slug: TemplateCategory.FOOD as any,
    displayName: "Food & Dining",
    recommendedTemplates: ["vayva-chopnow", "vayva-gourmet"], // Added Gourmet
    isActive: true,
  },
  {
    slug: TemplateCategory.DIGITAL as any,
    displayName: "Digital Products",
    recommendedTemplates: ["vayva-file-vault", "vayva-lens-folio", "vayva-sound-wave", "vayva-saas-starter"],
    isActive: true,
  },
  {
    slug: TemplateCategory.EVENTS as any,
    displayName: "Events & Ticketing",
    recommendedTemplates: ["vayva-ticketly", "vayva-conference", "vayva-rsvp"],
    isActive: true,
  },
  {
    slug: TemplateCategory.EDUCATION as any,
    displayName: "Education & Courses",
    recommendedTemplates: ["vayva-eduflow", "vayva-coach", "vayva-workshop"],
    isActive: true,
  },
  {
    slug: TemplateCategory.B2B as any,
    displayName: "Wholesale & B2B",
    recommendedTemplates: ["vayva-bulktrade", "vayva-supplier"],
    isActive: true,
  },
  {
    slug: TemplateCategory.MARKETPLACE as any,
    displayName: "Marketplace",
    recommendedTemplates: ["vayva-markethub", "vayva-vendorhive"],
    isActive: true,
  },
  {
    slug: TemplateCategory.NONPROFIT as any,
    displayName: "Nonprofit",
    recommendedTemplates: ["vayva-giveflow", "vayva-charity"],
    isActive: true,
  },
  {
    slug: TemplateCategory.REAL_ESTATE as any,
    displayName: "Real Estate",
    recommendedTemplates: ["vayva-homelist", "vayva-estate", "vayva-agent"],
    isActive: true,
  },
];
