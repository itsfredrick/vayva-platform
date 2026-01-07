"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/neon-auth";
import { apiClient } from "@vayva/api-client";
import {
  User,
  MerchantContext,
  UserRole,
  OnboardingStatus,
} from "@vayva/shared";

import { InactivityListener } from "@/components/auth/InactivityListener";

interface AuthContextType {
  user: User | null;
  merchant: MerchantContext | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Use Better Auth hook
  const { data: session, isPending: isSessionLoading } = authClient.useSession();

  const sessionUser = session;
  const isSignedIn = !!sessionUser;

  const [profile, setProfile] = useState<{ user: User | null; merchant: MerchantContext | null }>({
    user: null,
    merchant: null,
  });
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  // Configure API Client - Better Auth uses cookies by default on same-domain
  useEffect(() => {
    if (isSignedIn) {
      // If we needed a token, we could get it here. 
      // For now, we assume cookies are handled by browser.
    }
  }, [isSignedIn]);

  const fetchProfile = async () => {
    if (!isSignedIn) {
      setProfile({ user: null, merchant: null });
      setIsProfileLoading(false);
      return;
    }

    try {
      const data = await apiClient.auth.me();
      setProfile({
        user: data.user,
        merchant: data.merchant || null,
      });
    } catch (error) {
      console.warn('Profile fetch failed:', error);
      // Fallback to basic session data if backend sync fails/hasn't happened yet
      if (sessionUser) {
        setProfile(prev => ({
          ...prev,
          user: prev.user || {
            id: sessionUser.user.id,
            email: sessionUser.user.email,
            // Map Better Auth user fields to our User type
            firstName: sessionUser.user.name?.split(' ')[0] || "",
            lastName: sessionUser.user.name?.split(' ').slice(1).join(' ') || "",
            avatarUrl: sessionUser.user.image || "",
            authId: sessionUser.user.id,
            isEmailVerified: sessionUser.user.emailVerified,
            createdAt: sessionUser.user.createdAt,
            updatedAt: sessionUser.user.updatedAt,
          } as any
        }));
      }
    } finally {
      setIsProfileLoading(false);
    }
  };

  useEffect(() => {
    if (!isSessionLoading) {
      fetchProfile();
    }
  }, [isSessionLoading, isSignedIn, sessionUser?.user.id]);

  const logout = async () => {
    await authClient.signOut();
    router.push("/signin");
  };

  const isLoading = isSessionLoading || (isSignedIn && isProfileLoading);

  // Route Guard & Redirection Logic
  useEffect(() => {
    if (isLoading) return;

    const publicRoutes = [
      "/signin",
      "/signup",
      "/forgot-password",
      "/reset-password",
      "/verify",
      "/features",
      "/marketplace",
      "/pricing",
      "/templates",
    ];

    const isPublicRoute = publicRoutes.some(
      (p) => pathname === p || (p !== "/" && pathname.startsWith(p + "/")),
    );
    const isAuthRoute = ["/signin", "/signup", "/verify"].includes(pathname);

    if (!isSignedIn && !isPublicRoute) {
      const hasAccount = localStorage.getItem("vayva_has_account") === "true";
      const rememberedEmail = localStorage.getItem("vayva_remembered_email");

      if (hasAccount || rememberedEmail) {
        router.push("/signin");
      } else {
        router.push("/signup");
      }
      return;
    }

    if (isSignedIn && profile.user && profile.merchant) {
      if (isAuthRoute) {
        if (profile.merchant?.onboardingStatus === OnboardingStatus.COMPLETE) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding/resume");
        }
        return;
      }

      // Enhanced Onboarding Gating
      if (profile.merchant) {
        const isConfigured = [
          OnboardingStatus.COMPLETE,
          OnboardingStatus.REQUIRED_COMPLETE,
          OnboardingStatus.OPTIONAL_INCOMPLETE,
        ].includes(profile.merchant.onboardingStatus);

        if (pathname.startsWith("/admin") && !isConfigured) {
          router.push("/onboarding/resume");
          return;
        }

        if (
          pathname.startsWith("/onboarding") &&
          isConfigured &&
          pathname !== "/onboarding/resume"
        ) {
          const allowedOptionalRoutes = [
            "/onboarding/whatsapp",
            "/onboarding/order-flow",
            "/onboarding/payments",
            "/onboarding/delivery",
            "/onboarding/team",
            "/onboarding/kyc",
          ];

          const isOptionalStep = allowedOptionalRoutes.some((p) =>
            pathname.startsWith(p),
          );
          if (!isOptionalStep) {
            router.push("/dashboard");
            return;
          }
        }
      }
    }
  }, [isSignedIn, profile, isLoading, pathname]);

  const value = useMemo(() => ({
    user: profile.user,
    merchant: profile.merchant,
    isLoading,
    isAuthenticated: isSignedIn,
    logout,
    refreshProfile: fetchProfile,
  }), [profile.user, profile.merchant, isLoading, isSignedIn]);

  return (
    <AuthContext.Provider value={value}>
      <InactivityListener />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
