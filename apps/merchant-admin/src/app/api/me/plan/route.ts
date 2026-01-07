import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@vayva/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const sessionUser = await requireAuth();

    if (!sessionUser) {
      return NextResponse.json({
        plan: "free",
        source: "fallback",
        isAuthenticated: false,
      });
    }

    const storeId = sessionUser.storeId;

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return NextResponse.json({
        plan: "free",
        source: "fallback_store_not_found",
        isAuthenticated: true,
      });
    }

    // Determine Plan
    let dbPlan = "free";
    let source = "store_fallback";

    if (store.plan) {
      dbPlan = (store.plan as string).toLowerCase();
      source = "store_settings";
    }

    // Normalized to BillingPlan (free | growth | pro)
    let normalizedPlan = "free";

    switch (dbPlan) {
      case "free":
        normalizedPlan = "free";
        break;
      case "growth":
        normalizedPlan = "growth";
        break;
      case "pro":
        normalizedPlan = "pro";
        break;
      case "business":
        normalizedPlan = "pro";
        break; // Deprecated -> Pro
      case "enterprise":
        normalizedPlan = "pro";
        break; // Deprecated -> Pro
      default:
        normalizedPlan = "free";
    }

    return NextResponse.json({
      plan: normalizedPlan,
      source,
      isAuthenticated: true,
    });
  } catch (error) {
    console.error("API /me/plan error:", error);
    return NextResponse.json(
      { plan: "free", source: "error", isAuthenticated: false },
      { status: 500 },
    );
  }
}
