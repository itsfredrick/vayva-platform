import { api } from './api';

export interface OrderItem {
    id: string;
    title: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    customer: any;
    items: OrderItem[];
    total: number;
    status: string;
    createdAt: string;
}

export const OrderService = {
    list: async (storeId: string) => {
        // Pass storeId as query param as required by controller
        // AND x-store-id header is handled by interceptor, but controller checks `req.query.storeId`
        // I should probably align them. Controller expects req.query.storeId.
        const response = await api.get(`/orders?storeId=${storeId}`);
        return response.data;
    },

    get: async (id: string) => {
        // Missing get single order endpoint in Phase 7 controller?
        // I only saw listOrdersHandler and createOrderHandler.
        // I likely check list for now or I need to add `getOrderHandler`.
        // Let's check controller again.
        // List handler filters by storeId. 
        // If I don't have get single, I might need to filter list or Add endpoint.
        // Plan: Add `GET /:id` to orders-service.
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    updateStatus: async (id: string, status: string, note?: string) => {
        const response = await api.post(`/orders/${id}/status`, { status, note });
        return response.data;
    }
};
