import { api } from './api';

export const ProductService = {
    create: async (data: any) => {
        // POST /v1/products (Proxied by Gateway)
        const response = await api.post('/products', data);
        return response.data;
    },

    list: async () => {
        const response = await api.get('/products');
        return response.data;
    },

    get: async (id: string) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    update: async (id: string, data: any) => {
        const response = await api.put(`/products/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    }
};
