import { api } from './api';

export const StoreService = {
    create: async (data: any) => {
        // POST /v1/stores (Need to ensure this endpoint exists in auth-service or gateway proxy? 
        // Actually store management might be in auth-service or a new "merchant-service"?)
        // In Phase 7 I didn't explicitly build a "merchant-service" for store management beyond auth.
        // Auth Service manages authentication. "Stores" are in the DB.
        // I likely need a "Store Management" set of endpoints.
        // I'll put them in 'api-gateway' directly? No, microservices.
        // 'auth-service' has the user/store relation. 
        // Let's assume I add /v1/stores to `auth-service` (since it owns the Store model in my V1 schema often, or it should be its own service).
        // Let's check `services/auth-service/src/merchant/routes.ts`.

        // If not, I'll add receiving endpoint to `auth-service` now.
        const response = await api.post('/auth/merchant/stores', data);
        return response.data;
    },

    update: async (storeId: string, data: any) => {
        const response = await api.put(`/auth/merchant/stores/${storeId}`, data);
        return response.data;
    },

    get: async (storeId: string) => {
        const response = await api.get(`/auth/merchant/stores/${storeId}`);
        return response.data;
    }
};
