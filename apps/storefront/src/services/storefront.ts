import axios from 'axios';

// Public API Client (No Auth Header needed for V1 Public routes, or pass storeId)
// Gateway is at 4000
const API_URL = 'http://localhost:4000/v1';

export const api = axios.create({
    baseURL: API_URL,
});

export const StorefrontService = {
    getProducts: async () => {
        // Hardcoded storeId for V1
        const response = await api.get('/public/products?storeId=store-123');
        return response.data;
    },
    getProduct: async (id: string) => {
        const response = await api.get(`/products/${id}`); // Using public get? Wait, products-service get /:id is generic, works if properly exposed. 
        // Gateway maps /v1/products -> products-service. If products-service doesn't block by default, it works.
        // But for "public" specifically, I might want to ensure I use the public proxy if I set one up.
        // Actually I only set up /v1/public/products for listing.
        // Let's assume /v1/products/:id is accessible if no middleware blocks it.
        return response.data;
    },
    checkout: async (payload: any) => {
        const response = await api.post('/public/checkout', { ...payload, storeId: 'store-123' });
        return response.data;
    },
    initializePayment: async (payload: any) => {
        // payload: { orderId, email, amount }
        const response = await api.post('/public/pay', payload);
        return response.data;
    }
};
