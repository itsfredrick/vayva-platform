import { NextRequest, NextResponse } from "next/server";
import { PLANS } from "@/lib/billing/plans";
import { ControlCenterService } from "@/services/control-center.service";
import { requireAuth } from "@/lib/session";
import { prisma } from "@vayva/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    if (!user || !user.storeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { templateId } = body;

    if (!templateId) {
      return NextResponse.json({ error: "Template ID required" }, { status: 400 });
    }

    // Fetch store to get current plan
    const store = await prisma.store.findUnique({
      where: { id: user.storeId },
      select: { plan: true }
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Normalize plan key (db might happen to be uppercase)
    const planSlug = (store.plan || "free").toLowerCase();
    const plan = PLANS[planSlug] || PLANS["free"];
    const maxAllowed = plan.limits.maxOwnedTemplates;

    await ControlCenterService.addToLibrary(
      user.storeId,
      templateId,
      maxAllowed
    );

    return NextResponse.json({ success: true });

  } catch (error: any) {
    if (error.message === "PLAN_LIMIT_REACHED") {
      return NextResponse.json(
        { error: "Plan limit reached", code: "PLAN_LIMIT_REACHED" },
        { status: 403 }
      );
    }
    console.error("Library add error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user || !user.storeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return count AND list of owned IDs for UI state
    const themes = await prisma.merchantTheme.findMany({
      where: { storeId: user.storeId },
      select: { templateId: true }
    });

    return NextResponse.json({
      count: themes.length,
      ownedIds: themes.map(t => t.templateId)
    });
  } catch (error) {
    console.error("Library fetch error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
