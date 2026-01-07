import { ProductData } from "@/hooks/storefront/useStorefront";

export const MOCK_PRODUCTS: Record<string, ProductData[]> = {
    // --- FASHION ---
    "vayva-aa-fashion": [
        {
            id: "p1",
            name: "Oversized Cotton Trench",
            description: "A timeless essential reimagined with a modern, oversized silhouette. Water-resistant coating.",
            price: 125000,
            originalPrice: 150000,
            image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
            category: "Outerwear",
            rating: 4.8,
            tags: ["New Arrival", "Bestseller"]
        },
        {
            id: "p2",
            name: "Silk Blend Mid-Rise Trouser",
            description: "Luxurious silk blend trousers perfect for office or evening wear.",
            price: 85000,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop",
            category: "Bottoms",
            rating: 4.5,
            tags: ["Trending"]
        },
        {
            id: "p3",
            name: "Structured Wool Blazer",
            description: "Sharp tailoring meets comfort. 100% merino wool.",
            price: 180000,
            originalPrice: 200000,
            image: "https://images.unsplash.com/photo-1591369045365-ea933390cc82?q=80&w=1000&auto=format&fit=crop",
            category: "Outerwear",
            rating: 5.0,
            tags: ["Premium"]
        },
        {
            id: "p4",
            name: "Chunky Knit Sweater",
            description: "Hand-knitted feel with premium wool blend.",
            price: 65000,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=1000&auto=format&fit=crop",
            category: "Tops",
            rating: 4.7
        },
    ],

    // --- TECH (GIZMO) ---
    "vayva-gizmo-tech": [
        {
            id: "t1",
            name: "X-Pro Wireless Headphones",
            description: "Active noise cancellation with 40-hour battery life. Studio quality sound.",
            price: 250000,
            originalPrice: 290000,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
            category: "Audio",
            rating: 4.9,
            tags: ["Top Rated", "Free Shipping"]
        },
        {
            id: "t2",
            name: "UltraBook Pro M1",
            description: "The thinnest, lightest laptop we've ever built. Power that lasts all day.",
            price: 1250000,
            originalPrice: 1400000,
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop",
            category: "Laptops",
            rating: 4.8,
            tags: ["New"]
        },
        {
            id: "t3",
            name: "SmartLens 4K Camera",
            description: "Professional grade photography in a compact body.",
            price: 850000,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
            category: "Cameras",
            rating: 4.6
        },
        {
            id: "t4",
            name: "Quantum Mechanical Keyboard",
            description: "Tactile switches with customizable RGB lighting.",
            price: 45000,
            originalPrice: 60000,
            image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1000&auto=format&fit=crop",
            category: "Accessories",
            rating: 4.7
        }
    ],

    // --- FOOD (GOURMET) ---
    "vayva-gourmet": [
        {
            id: "f1",
            name: "Truffle Mushroom Risotto",
            description: "Arborio rice slow-cooked with wild mushrooms and black truffle oil.",
            price: 18000,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1000&auto=format&fit=crop",
            category: "Mains",
            rating: 4.9,
            tags: ["Vegetarian", "Chef's Choice"]
        },
        {
            id: "f2",
            name: "Pan-Seared Salmon",
            description: "Atlantic salmon served with asparagus and lemon butter sauce.",
            price: 22000,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=1000&auto=format&fit=crop",
            category: "Mains",
            rating: 4.8,
            tags: ["Gluten Free"]
        },
        {
            id: "f3",
            name: "Decadent Chocolate Lava Cake",
            description: "Warm molten chocolate center served with vanilla bean ice cream.",
            price: 8000,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1000&auto=format&fit=crop",
            category: "Desserts",
            rating: 5.0,
            tags: ["Popular"]
        }
    ],

    // --- SERVICE (BEAUTY) ---
    "vayva-salon": [
        {
            id: "s1",
            name: "Hydrafacial Deluxe",
            description: "Deep cleansing, exfoliation, and hydration for glowing skin.",
            price: 45000,
            originalPrice: 60000,
            image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1000&auto=format&fit=crop",
            category: "Facials",
            rating: 4.9,
            tags: ["Bestseller"]
        },
        {
            id: "s2",
            name: "Luxury Manicure & Pedicure",
            description: "Complete nail care with gel polish and hand/foot massage.",
            price: 25000,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=1000&auto=format&fit=crop",
            category: "Nails",
            rating: 4.7
        },
        {
            id: "s3",
            name: "Full Body Aromatherapy Massage",
            description: "60-minute relaxing massage with essential oils.",
            price: 55000,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1000&auto=format&fit=crop",
            category: "Massage",
            rating: 4.8
        }
    ],

    // --- REAL ESTATE ---
    "vayva-estate": [
        {
            id: "re1",
            name: "Modern Beachfront Villa",
            description: "5 bed, 6 bath luxury villa with private beach access and infinity pool.",
            price: 450000000,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1600596542815-e0138d9ac048?q=80&w=1000&auto=format&fit=crop",
            category: "Sale",
            rating: 5.0,
            tags: ["Luxury", "Waterfront"]
        },
        {
            id: "re2",
            name: "Downtown Penthouse Loft",
            description: "Industrial chic loft in the heart of the city. Floor-to-ceiling windows.",
            price: 150000000,
            originalPrice: 165000000,
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop",
            category: "Sale",
            rating: 4.8,
            tags: ["City View"]
        },
        {
            id: "re3",
            name: "Cosy Suburban Family Home",
            description: "3 bed, 2 bath with spacious garden and garage.",
            price: 65000000,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop",
            category: "Sale",
            rating: 4.6
        }
    ],

    // --- DIGITAL (SAAS/FILES) ---
    "vayva-saas-starter": [
        {
            id: "d1",
            name: "Pro Plan (Monthly)",
            description: "Advanced analytics and unlimited projects for growing teams.",
            price: 25000,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
            category: "Subscription",
            rating: 5.0,
            tags: ["Most Popular"]
        }
    ],
    "vayva-sound-wave": [
        {
            id: "au1",
            name: "Lofi Chill Beats Vol. 1",
            description: "Royalty-free lofi hip hop beats for streaming.",
            price: 5000,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1000&auto=format&fit=crop",
            category: "Audio",
            rating: 4.9
        },
        {
            id: "au2",
            name: "Cinematic Soundscapes",
            description: "Atmospheric pads and drones for film scoring.",
            price: 8000,
            originalPrice: 12000,
            image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=1000&auto=format&fit=crop",
            category: "Audio",
            rating: 5.0
        }
    ],

    // --- MARKETPLACE/NONPROFIT ---
    "vayva-giveflow": [
        {
            id: "np1",
            name: "Emergency Relief Kit",
            description: "Provides food, water, and medical supplies for a family for 1 week.",
            price: 15000,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop",
            category: "Donation",
            rating: 5.0,
            tags: ["Urgent"]
        },
        {
            id: "np2",
            name: "Educate a Child",
            description: "Sponsors school fees and books for one term.",
            price: 25000,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop",
            category: "Education",
            rating: 5.0
        }
    ]
};

// Helper to get products or fallback to generic
export function getMockProducts(slug: string): ProductData[] {
    // Try exact match first
    if (MOCK_PRODUCTS[slug]) return MOCK_PRODUCTS[slug];

    // Try partial match (e.g. if slug is 'demo-fashion' but key is 'vayva-aa-fashion')
    // Or just identifying by keywords in the slug
    if (slug.includes('fashion') || slug.includes('apparel')) return MOCK_PRODUCTS['vayva-aa-fashion'];
    if (slug.includes('gizmo') || slug.includes('tech')) return MOCK_PRODUCTS['vayva-gizmo-tech'];
    if (slug.includes('gourmet') || slug.includes('food') || slug.includes('restaurant')) return MOCK_PRODUCTS['vayva-gourmet'];
    if (slug.includes('salon') || slug.includes('beauty') || slug.includes('spa')) return MOCK_PRODUCTS['vayva-salon'];
    if (slug.includes('estate')) return MOCK_PRODUCTS['vayva-estate'];
    if (slug.includes('sound') || slug.includes('audio')) return MOCK_PRODUCTS['vayva-sound-wave'];
    if (slug.includes('give') || slug.includes('charity')) return MOCK_PRODUCTS['vayva-giveflow'];

    // Fallback Generic
    return [
        {
            id: "gen1",
            name: "Premium Sample Product",
            description: "High quality item from our collection.",
            price: 50000,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
            category: "General",
            rating: 4.5
        },
        {
            id: "gen2",
            name: "Limited Edition Item",
            description: "Exclusive release available for a short time.",
            price: 75000,
            originalPrice: 100000,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
            category: "General",
            rating: 4.8
        }
    ];
}
