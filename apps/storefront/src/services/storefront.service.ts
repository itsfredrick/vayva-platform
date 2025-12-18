import { PublicOrder, PublicProduct, PublicStore } from '@/types/storefront';

const API_BASE = 'http://localhost:4000/v1';

export const StorefrontService = {
    getStore: async (slug: string): Promise<PublicStore | null> => {
        try {
            // Placeholder: Normally we'd fetch /public/stores/:slug
            // For now, return mock if not found to keep UI working
            const response = await fetch(`${API_BASE}/public/stores/${slug}`);
            if (response.ok) return await response.json();

            // Fallback for demo
            if (slug === 'demo' || slug === 'test') {
                return {
                    id: 'store_123',
                    slug: 'demo',
                    name: 'Vayva Demo Store',
                    tagline: 'Premium quality goods for the modern lifestyle.',
                    theme: { primaryColor: '#000000', accentColor: '#0D1D1E' },
                    contact: { email: 'support@vayva.shop', phone: '+234 800 123 4567' },
                    policies: {
                        shipping: 'We ship nationwide within 3-5 business days.',
                        returns: 'Returns accepted within 7 days of delivery.',
                        privacy: 'Your data is safe with us.'
                    }
                };
            }
            return null;
        } catch (e) {
            console.error('getStore error', e);
            return null;
        }
    },

    getProducts: async (storeId: string): Promise<PublicProduct[]> => {
        try {
            const response = await fetch(`${API_BASE}/public/products?storeId=${storeId}`);
            if (response.ok) return await response.json();
            return [];
        } catch (e) {
            return [];
        }
    },

    getProduct: async (storeId: string, productId: string): Promise<PublicProduct | null> => {
        try {
            const response = await fetch(`${API_BASE}/public/products/${productId}`);
            if (response.ok) return await response.json();
            return null;
        } catch (e) {
            return null;
        }
    },

    createOrder: async (data: any): Promise<any> => {
        const response = await fetch(`${API_BASE}/public/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to create order');
        }
        return await response.json();
    },

    initializePayment: async (data: { orderId: string, email: string, amount: number, callbackUrl: string }): Promise<any> => {
        const response = await fetch(`${API_BASE}/public/pay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to initialize payment');
        }
        return await response.json();
    },

    getOrderStatus: async (ref: string, phone: string): Promise<any> => {
        const response = await fetch(`${API_BASE}/public/orders/status?ref=${ref}&phone=${phone}`);
        if (!response.ok) return null;
        return await response.json();
    }
};

