import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@vayva/db";
import { AuthMeResponse, UserRole, OnboardingStatus, SubscriptionPlan, BusinessType } from "@vayva/shared";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sessionUser = await requireAuth();

    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch up-to-date store context
    // We use findFirst to be safe, though ID should be unique.
    const store = await prisma.store.findUnique({
      where: { id: sessionUser.storeId },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Map to AuthMeResponse
    const response: AuthMeResponse = {
      user: {
        id: sessionUser.id,
        firstName: sessionUser.firstName || "",
        lastName: sessionUser.lastName || "",
        email: sessionUser.email,
        emailVerified: sessionUser.emailVerified,
        phoneVerified: false, // Session doesn't track this yet
        role: sessionUser.role as UserRole,
        storeId: sessionUser.storeId,
        createdAt: new Date().toISOString(), // Fallback
      },
      merchant: {
        merchantId: store.id,
        storeId: store.id,
        businessType: (store.category?.toUpperCase() as BusinessType) || BusinessType.RETAIL,
        onboardingStatus: store.onboardingStatus as OnboardingStatus,
        onboardingLastStep: store.onboardingLastStep || "START",
        onboardingUpdatedAt: store.onboardingUpdatedAt.toISOString(),
        plan: store.plan as SubscriptionPlan,
        templateConfig: {},
        // logoUrl and businessName removed as they don't exist in MerchantContext
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[API] Merchant Me Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const sessionUser = await requireAuth();

    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Update user fields
    const updatedUser = await prisma.user.update({
      where: { id: sessionUser.id },
      data: {
        ...(body.firstName && { firstName: body.firstName }),
        ...(body.lastName && { lastName: body.lastName }),
        ...(body.phone && { phone: body.phone }),
        // If fullName is provided, try to split it if first/last aren't explicit
        ...(!body.firstName && body.fullName && {
          firstName: body.fullName.split(" ")[0],
          lastName: body.fullName.split(" ").slice(1).join(" ") || "",
        }),
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("[API] Merchant Me Update Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
