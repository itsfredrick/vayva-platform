import { api } from './api';

export const StoreService = {
    create: async (data: any) => {
        console.log('Mocking Store Create:', data);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            id: 'store_' + Date.now(),
            ...data,
            settings: { currency: 'NGN' }
        };
    },

    update: async (storeId: string, data: any) => {
        console.log('Mocking Store Update:', storeId, data);
        await new Promise(resolve => setTimeout(resolve, 500));
        return { id: storeId, ...data };
    },

    get: async (storeId: string) => {
        console.log('Mocking Store Get:', storeId);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id: storeId,
            name: 'Test Store',
            settings: { currency: 'NGN' }
        };
    }
};
