import { api } from './api';

export interface PaymentTransaction {
    id: string;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
    order: {
        id: string;
        customer?: {
            name: string;
            email: string;
        };
    };
}

export const PaymentService = {
    listTransactions: async () => {
        // GET /v1/payments/transactions
        // Headers (x-store-id) handled by interceptor
        const response = await api.get('/payments/transactions');
        return response.data;
    },

    // Future: listPayouts, getPayout, verify, etc.
};
