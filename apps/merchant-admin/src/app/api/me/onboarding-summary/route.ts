import { NextResponse } from "next/server";


import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await requireAuth();

    if (!user || !user) {
      return NextResponse.json({});
    }

    
    const storeId = user.storeId;

    if (!storeId) {
      return NextResponse.json({});
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return NextResponse.json({});
    }

    // Resolve Onboarding Data
    // Checking common locations for industry category
    const industryCategory =
      (store as any).industryCategory ||
      (store as any).category ||
      (store.settings as any)?.industryCategory ||
      null;

    // Check onboarding completion status
    // can be explicit flag or derived
    const onboardingCompleted =
      store.onboardingCompleted ||
      (store.onboardingStatus as any) === "COMPLETED" ||
      !!industryCategory;

    return NextResponse.json({
      industryCategory,
      onboardingCompleted,
    });
  } catch (error) {
    console.error("API /me/onboarding-summary error:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
