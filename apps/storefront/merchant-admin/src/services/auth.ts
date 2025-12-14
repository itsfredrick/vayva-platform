import { api } from './api';

export const AuthService = {
    login: async (credentials: any) => {
        const { data } = await api.post('/auth/merchant/login', credentials);
        return data;
    },

    register: async (payload: any) => {
        // Current register endpoint is simplified
        const { data } = await api.post('/auth/merchant/register', payload);
        return data;
    },

    // TODO: Logout, Refresh, Forgot Password
};
