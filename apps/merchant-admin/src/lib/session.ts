import { prisma } from "@vayva/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  storeId: string;
  storeName: string;
  role: string;
  emailVerified: boolean;
  onboardingCompleted: boolean;
}

export interface OnboardingUser {
  id: string;
  email: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  emailVerified: boolean;
  storeId?: string;
  onboardingCompleted?: boolean;
}

/**
 * Internal helper to sync auth user user with Prisma DB
 */
async function syncUser(sessionUser: any) {
  const authId = sessionUser.id;
  const email = sessionUser.email;

  if (!email) return null;

  // Lazy sync user to Prisma
  let user = await prisma.user.findUnique({
    where: { authId },
    include: {
      memberships: {
        where: { status: "active" },
        include: { store: true },
      },
    },
  });

  if (!user) {
    // Try finding by email (migration scenario)
    user = await prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          where: { status: "active" },
          include: { store: true },
        },
      },
    });

    if (user) {
      // Link existing user to Auth
      user = await prisma.user.update({
        where: { id: user.id },
        data: { authId },
        include: {
          memberships: {
            where: { status: "active" },
            include: { store: true },
          },
        },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          authId,
          email,
          firstName: (sessionUser as any).firstName || sessionUser.name?.split(' ')[0],
          lastName: (sessionUser as any).lastName || sessionUser.name?.split(' ').slice(1).join(' '),
          isEmailVerified: sessionUser.emailVerified,
        },
        include: {
          memberships: {
            where: { status: "active" },
            include: { store: true },
          },
        },
      });
    }
  }

  return user;
}

/**
 * Get full user data from Auth user and sync with Prisma
 * Returns null if user is not authenticated or has no store membership.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const sessionData = await auth.api.getSession({
    headers: await headers()
  });

  if (!sessionData?.user) {
    return null;
  }

  const user = await syncUser(sessionData.user);
  if (!user || user.memberships.length === 0) {
    return null;
  }

  // Use the first active membership
  const membership = user.memberships[0];

  return {
    id: user.id,
    email: user.email,
    name: user.name || `${user.firstName} ${user.lastName}`.trim() || user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    storeId: membership.storeId,
    storeName: membership.store.name,
    role: membership.role,
    emailVerified: user.isEmailVerified || false,
    onboardingCompleted: membership.store.onboardingStatus === "COMPLETE",
  };
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Get user data for Onboarding context
 * PERMISSIVE: Returns user even if they have no store membership.
 */
export async function getOnboardingUser(): Promise<OnboardingUser | null> {
  const sessionData = await auth.api.getSession({
    headers: await headers()
  });

  if (!sessionData?.user) {
    return null;
  }

  const user = await syncUser(sessionData.user);
  if (!user) return null;

  const membership = user.memberships[0];

  return {
    id: user.id,
    email: user.email,
    name: user.name || `${user.firstName} ${user.lastName}`.trim() || user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    emailVerified: user.isEmailVerified || false,
    storeId: membership?.storeId,
    onboardingCompleted: membership?.store?.onboardingStatus === "COMPLETE"
  };
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const sessionData = await auth.api.getSession({
    headers: await headers()
  });
  return !!sessionData?.user;
}

/**
 * Require access to a specific store
 */
export async function requireStoreAccess(storeId: string): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.storeId !== storeId) {
    throw new Error("Forbidden: Access to this store denied");
  }
  return user;
}

// ALIASES FOR BACKWARD COMPATIBILITY
export const getSession = getSessionUser;
export type SessionPayload = SessionUser;
export const COOKIE_NAME = "better-auth.session_token";

/**
 * Higher-order function to wrap API handlers with authentication
 */
export function withAuth(
  handler: (request: Request, user: SessionUser) => Promise<NextResponse>,
) {
  return async (request: Request) => {
    try {
      const user = await requireAuth();
      return await handler(request, user);
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message.startsWith("Forbidden")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      console.error("[withAuth] Error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  };
}
