export interface PublicStore {
    id: string;
    slug: string;
    name: string;
    tagline?: string;
    logoUrl?: string;
    theme: {
        primaryColor: string;
        accentColor: string;
    };
    contact: {
        phone?: string;
        email?: string;
        whatsapp?: string;
    };
    policies: {
        shipping: string;
        returns: string;
        privacy: string;
    };
}

export interface PublicProduct {
    id: string;
    storeId: string;
    name: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    images: string[];
    variants: ProductVariant[];
    inStock: boolean;
    category?: string;
}

export interface ProductVariant {
    id: string;
    name: string; // e.g. "Size"
    options: string[]; // e.g. ["S", "M", "L"]
}

export interface CartItem {
    productId: string;
    variantId?: string; // composite key of selected options if complex
    quantity: number;
    price: number;
    productName: string;
    image?: string;
}

export interface PublicOrder {
    ref: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    items: CartItem[];
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    createdAt: string;
}
