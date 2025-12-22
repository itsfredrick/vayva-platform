export interface ProductVariant {
    id: string;
    name: string; // e.g. "Size: M / Color: Red"
    price: number;
    inventory: number;
    sku: string;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    status: 'active' | 'draft' | 'archived';
    price: number;
    compareAtPrice?: number;
    inventory: number; // Total across variants
    category: string;
    images: string[];
    variants: ProductVariant[];
    updatedAt: string;
}

export interface ProductLimit {
    used: number;
    limit: number | 'unlimited';
    plan: 'starter' | 'growth' | 'pro';
}

// Initial Mock Data
let MOCK_PRODUCTS: Product[] = [
    {
        id: 'prod_1',
        name: 'Vintage Denim Jacket',
        status: 'active',
        price: 15000,
        inventory: 12,
        category: 'Fashion',
        images: ['https://placehold.co/400x400'],
        variants: [
            { id: 'var_1', name: 'Size: M', price: 15000, inventory: 5, sku: 'VDJ-M' },
            { id: 'var_2', name: 'Size: L', price: 15000, inventory: 7, sku: 'VDJ-L' }
        ],
        updatedAt: new Date().toISOString()
    },
    {
        id: 'prod_2',
        name: 'Classic White Tee',
        status: 'draft',
        price: 5000,
        inventory: 50,
        category: 'Fashion',
        images: ['https://placehold.co/400x400'],
        variants: [],
        updatedAt: new Date(Date.now() - 86400000).toISOString()
    }
];

export const ProductsService = {
    // 1. Get Limits (Plan Gating)
    getLimits: async (): Promise<ProductLimit> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        // Mocking 'Starter' plan behavior (Limit 5)
        return { used: MOCK_PRODUCTS.length, limit: 5, plan: 'starter' };
    },

    // 2. Get Products
    getProducts: async ({ search, status }: { search?: string, status?: string } = {}): Promise<Product[]> => {
        await new Promise(resolve => setTimeout(resolve, 600));
        let results = [...MOCK_PRODUCTS];
        if (search) {
            results = results.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }
        if (status && status !== 'all') {
            results = results.filter(p => p.status === status);
        }
        return results;
    },

    // 3. Get Single Product
    getProduct: async (id: string): Promise<Product | null> => {
        await new Promise(resolve => setTimeout(resolve, 400));
        return MOCK_PRODUCTS.find(p => p.id === id) || null;
    },

    // 4. Create Product
    createProduct: async (data: Partial<Product>): Promise<{ success: boolean; error?: string; product?: Product }> => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Enforce Limits
        const limitInfo = await ProductsService.getLimits();
        if (limitInfo.limit !== 'unlimited' && limitInfo.used >= limitInfo.limit) {
            return { success: false, error: 'PLAN_LIMIT_REACHED' };
        }

        const newProduct: Product = {
            id: 'prod_' + Math.random().toString(36).substr(2, 9),
            name: data.name!,
            description: data.description || '',
            status: data.status || 'draft',
            price: data.price || 0,
            compareAtPrice: data.compareAtPrice,
            inventory: data.inventory || 0,
            category: data.category || 'Uncategorized',
            images: data.images || [],
            variants: data.variants || [],
            updatedAt: new Date().toISOString()
        };

        MOCK_PRODUCTS.unshift(newProduct);
        return { success: true, product: newProduct };
    },

    // 5. Update Product
    updateProduct: async (id: string, data: Partial<Product>): Promise<Product | null> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
        if (index === -1) return null;

        MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...data, updatedAt: new Date().toISOString() };
        return MOCK_PRODUCTS[index];
    },

    // 6. Delete/Archive
    deleteProduct: async (id: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        MOCK_PRODUCTS = MOCK_PRODUCTS.filter(p => p.id !== id);
        return true;
    }
};

// Export alias for compatibility
export const ProductService = ProductsService;

