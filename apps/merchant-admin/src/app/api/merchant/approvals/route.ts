import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { prisma } from "@vayva/db";
import { EventBus } from "@/lib/events/eventBus";
import { PLANS } from "@/lib/billing/plans";

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  if (!user || !user.storeId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { actionType, entityType, entityId, payload, reason } = body;
  const storeId = user.storeId;

  // --- GATING CHECK ---
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: { plan: true }
  });

  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

  const planSlug = (store.plan || "free").toLowerCase();
  const plan = PLANS[planSlug] || PLANS["free"];

  if (!plan.features.approvals) {
    return NextResponse.json(
      { error: "Plan limit reached. Approvals are a Pro feature.", code: "PLAN_LIMIT_REACHED" },
      { status: 403 }
    );
  }
  // --------------------

  // Validate permission to REQUEST?
  // Usually ANY staff can request, but maybe restricted?
  // Using approvals.request if enforced, else open.
  // Given prompt "Authorized roles...", but maybe invitee can request?
  // We'll enforce basic membership check via session context.

  try {
    const correlationId = `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const approval = await prisma.approval.create({
      data: {
        merchantId: storeId,
        requestedByUserId: user.id,
        requestedByLabel: `${user.firstName} ${user.lastName}`,
        actionType,
        entityType,
        entityId,
        payload,
        reason,
        correlationId,
      },
    });

    // Audit & Notify
    await EventBus.publish({
      merchantId: storeId,
      type: "approvals.requested",
      payload: {
        approvalId: approval.id,
        actionType,
        requestedBy: approval.requestedByLabel,
      },
      ctx: {
        actorId: user.id,
        actorType: "user" as any,
        actorLabel: `${user.firstName} ${user.lastName}`,
        correlationId,
      },
    });

    return NextResponse.json({ ok: true, id: approval.id });
  } catch (error) {
    console.error("Approval Request Error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  if (!user || !user.storeId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const storeId = user.storeId;

  // Check View Permission
  const canView = await hasPermission(
    user.id,
    storeId,
    PERMISSIONS.APPROVALS_VIEW,
  );
  if (!canView) return new NextResponse("Forbidden", { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") || "20");
  // Cursor pagination (omit for brevity in V1, rely on limit/desc)

  const where: any = { merchantId: storeId };
  if (status && status !== "all") where.status = status;

  const items = await prisma.approval.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      // Include related entity if generic relations exist
    },
  });

  return NextResponse.json({ items });
}
