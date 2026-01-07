import { NextRequest, NextResponse } from "next/server";


import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { prisma } from "@vayva/db";
import { EventBus } from "@/lib/events/eventBus";
import { requireAuth } from "@/lib/session";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth();
  

  const { id } = await params;

  const request = await prisma.approval.findUnique({ where: { id } });
  if (!request) return new NextResponse("Not Found", { status: 404 });
  if (request.merchantId !== user.storeId)
    return new NextResponse("Forbidden", { status: 403 });
  if (request.status !== "PENDING")
    return new NextResponse("Request not pending", { status: 400 });

  // Check Permission
  const canDecide = await hasPermission(
    user.id,
    request.merchantId,
    PERMISSIONS.APPROVALS_DECIDE,
  );
  if (!canDecide) return new NextResponse("Forbidden", { status: 403 });

  // We don't strictly enforce action-specific permission for rejection, but safe to keep consistent.
  // Usually rejection is easier. We'll enforce decide only.

  const body = await req.json().catch(() => ({}));
  const reason = body?.decisionReason;

  await prisma.approval.update({
    where: { id },
    data: {
      status: "REJECTED",
      decidedByUserId: user.id,
      decidedByLabel: `${user.firstName} ${user.lastName}`,
      decidedAt: new Date(),
      decisionReason: reason,
    },
  });

  await EventBus.publish({
    merchantId: request.merchantId,
    type: "approvals.rejected",
    payload: { approvalId: id, reason },
    ctx: {
      actorId: user.id,
      actorType: "user" as any,
      actorLabel: `${user.firstName} ${user.lastName}`,
      correlationId: request.correlationId || `req_${id}`,
    },
  });

  return NextResponse.json({ ok: true, status: "rejected" });
}
