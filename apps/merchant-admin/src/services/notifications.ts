import { api } from './api';

export const NotificationService = {
    list: async () => {
        const response = await api.get('/notifications');
        return response.data;
    },

    markRead: async (id: string) => {
        // Todo: implement in backend if needed
    }
};
