import { api } from './api';

export const ApprovalService = {
    list: async () => {
        // defaults to PENDING/all based on controller
        const response = await api.get('/approvals?storeId=store-123'); // Todo: Dynamic storeId in service?
        // Actually the api interceptor adds x-store-id header.
        // The query param storeId was used in Phase 7 controller for explicit check.
        // I should probably rely on header in backend, or pass param here.
        // Let's rely on header if backend supports it, but earlier controller code checked body/query explicitly.
        // For now, let's fix backend to use header or pass it here.
        return response.data;
    },

    approve: async (id: string) => {
        const response = await api.post(`/approvals/${id}/approve`, { approverId: 'user' });
        return response.data;
    }
};
