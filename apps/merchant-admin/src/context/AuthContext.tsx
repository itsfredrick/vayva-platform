"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient } from '@vayva/api-client';
import { User, MerchantContext, UserRole, OnboardingStatus } from '@vayva/shared';

interface AuthContextType {
    user: User | null;
    merchant: MerchantContext | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (token: string, user: User, merchant?: MerchantContext) => void;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [merchant, setMerchant] = useState<MerchantContext | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();
    const pathname = usePathname();

    const fetchProfile = async () => {
        try {
            const data = await apiClient.auth.me();
            setUser(data.user);
            setMerchant(data.merchant || null);
        } catch (error) {
            // API not available in development or user not authenticated - this is expected
            // console.warn('Profile fetch skipped:', error instanceof Error ? error.message : 'API unavailable');
            setUser(null);
            setMerchant(null);
        }
    };

    useEffect(() => {
        // Since we use httpOnly cookies, we just try to fetch /me on mount
        fetchProfile().finally(() => setIsLoading(false));
    }, []);

    const login = (newToken: string, newUser: User, newMerchant?: MerchantContext) => {
        // Token is handled by gateway cookie, but we still update local state
        setUser(newUser);
        setMerchant(newMerchant || null);

        if (newMerchant?.onboardingStatus === OnboardingStatus.COMPLETE) {
            router.push('/admin/dashboard');
        } else {
            router.push('/onboarding/resume');
        }
    };

    const logout = async () => {
        try {
            await apiClient.auth.logout();
        } catch (e) {
            console.error('Logout error', e);
        }
        setUser(null);
        setMerchant(null);
        router.push('/signin');
    };

    // Route Guard & Redirection Logic
    useEffect(() => {
        if (isLoading) return;

        const publicRoutes = [
            '/signin', '/signup', '/forgot-password', '/reset-password', '/verify',
            '/', '/features', '/marketplace', '/pricing', '/templates', '/help',
            '/legal', '/contact', '/about', '/how-it-works', '/status'
        ];

        const isPublicRoute = publicRoutes.some(p => pathname === p || (p !== '/' && pathname.startsWith(p + '/')));
        const isAuthRoute = ['/signin', '/signup', '/verify'].includes(pathname);

        if (!user && !isPublicRoute) {
            router.push('/signin');
            return;
        }

        if (user) {
            if (isAuthRoute) {
                if (merchant?.onboardingStatus === OnboardingStatus.COMPLETE) {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/onboarding/resume');
                }
                return;
            }

            // Onboarding Gating
            if (pathname.startsWith('/admin') && merchant?.onboardingStatus !== OnboardingStatus.COMPLETE) {
                router.push('/onboarding/resume');
            }
        }
    }, [user, merchant, isLoading, pathname]);

    const value = {
        user,
        merchant,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshProfile: fetchProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
