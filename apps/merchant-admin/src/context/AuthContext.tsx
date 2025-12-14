"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    user: any | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string, user: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedToken = Cookies.get('vayva_token');
        const storedUser = Cookies.get('vayva_user'); // V1 simple storage

        if (storedToken) {
            setToken(storedToken);
            if (storedUser) setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string, newUser: any) => {
        setToken(newToken);
        setUser(newUser);
        Cookies.set('vayva_token', newToken, { expires: 1, sameSite: 'Strict' });
        Cookies.set('vayva_user', JSON.stringify(newUser), { expires: 1 });

        // Store Selection Logic
        const memberships = newUser.memberships || [];

        if (memberships.length === 0) {
            router.push('/onboarding');
        } else if (memberships.length === 1) {
            // Auto-select
            Cookies.set('vayva_store_id', memberships[0], { expires: 1 });
            router.push('/admin/dashboard');
        } else {
            // Multiple stores
            router.push('/admin/select-store');
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        Cookies.remove('vayva_token');
        Cookies.remove('vayva_user');
        Cookies.remove('vayva_store_id');
        router.push('/signin');
    };

    // Basic Route Guard
    useEffect(() => {
        const isPublicRoute = ['/signin', '/signup', '/forgot-password'].some(p => pathname.startsWith(p));

        if (!isLoading && !token && !isPublicRoute) {
            // Redirect to signin if accessing protected route
            router.push('/signin');
        }

        if (!isLoading && token && isPublicRoute) {
            // Redirect to dashboard if accessing public route while logged in
            router.push('/admin/dashboard');
        }
    }, [token, isLoading, pathname, router]);

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
