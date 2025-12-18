import axios from 'axios';

// Public API Client (No Auth Header needed for V1 Public routes, or pass storeId)
// Gateway is at 4000
const API_URL = 'http://localhost:4000/v1';

export const api = axios.create({
    baseURL: API_URL,
});

export const StorefrontService = {
    getProducts: async () => {
        // Mock implementation
        console.log('Mocking Storefront Products');
        await new Promise(resolve => setTimeout(resolve, 800));
        return [
            {
                id: '1',
                name: 'Premium Wireless Headphones',
                description: 'High-fidelity audio with noise cancellation.',
                variants: [{ price: 45000 }]
            },
            {
                id: '2',
                name: 'Ergonomic Office Chair',
                description: 'Comfortable chair for long work sessions.',
                variants: [{ price: 120000 }]
            },
            {
                id: '3',
                name: 'Mechanical Keyboard',
                description: 'Tactile switches with RGB lighting.',
                variants: [{ price: 35000 }]
            }
        ];
    },
    getProduct: async (id: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id,
            name: 'Premium Product',
            description: 'Detailed description here.',
            variants: [{ price: 50000 }]
        };
    },
    checkout: async (payload: any) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
    },
    initializePayment: async (payload: any) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { authorization_url: 'https://checkout.paystack.com/mock' };
    }
};
