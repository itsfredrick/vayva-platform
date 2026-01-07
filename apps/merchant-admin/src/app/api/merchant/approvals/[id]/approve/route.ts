import { NextRequest, NextResponse } from "next/server";


import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { prisma } from "@vayva/db";
import { executeApproval } from "@/lib/approvals/execute";
import { EventBus } from "@/lib/events/eventBus";
import { requireAuth } from "@/lib/session";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth();
  

  const { id } = await params;

  // Fetch request to check merchantId
  const request = await prisma.approval.findUnique({
    where: { id },
  });
  if (!request) return new NextResponse("Not Found", { status: 404 });
  if (request.merchantId !== user.storeId)
    return new NextResponse("Forbidden", { status: 403 });
  if (request.status !== "PENDING")
    return new NextResponse("Request not pending", { status: 400 });

  // Check DECIDE Permission
  const canDecide = await hasPermission(
    user.id,
    request.merchantId,
    PERMISSIONS.APPROVALS_DECIDE,
  );
  if (!canDecide)
    return new NextResponse("Forbidden: No Decide Permission", { status: 403 });

  // Check ACTION-SPECIFIC Permission
  let actionPerm: any = null;
  switch (request.actionType) {
    case "refund.issue":
      actionPerm = PERMISSIONS.REFUNDS_APPROVE;
      break;
    case "campaign.send":
      actionPerm = PERMISSIONS.CAMPAIGNS_APPROVE;
      break;
    case "policies.publish":
      actionPerm = PERMISSIONS.POLICIES_APPROVE;
      break;
    case "delivery.dispatch":
      actionPerm = PERMISSIONS.DELIVERY_APPROVE;
      break;
  }

  if (actionPerm) {
    const canApproveAction = await hasPermission(
      user.id,
      request.merchantId,
      actionPerm,
    );
    if (!canApproveAction)
      return new NextResponse("Forbidden: Missing Action Permission", {
        status: 403,
      });
  }

  // Approve
  const body = await req.json().catch(() => ({}));
  const reason = body?.decisionReason;

  const updated = await prisma.approval.update({
    where: { id },
    data: {
      status: "APPROVED",
      decidedByUserId: user.id,
      decidedByLabel: `${user.firstName} ${user.lastName}`,
      decidedAt: new Date(),
      decisionReason: reason,
    },
  });

  // Audit
  await EventBus.publish({
    merchantId: request.merchantId,
    type: "approvals.approved",
    payload: { approvalId: id },
    ctx: {
      actorId: user.id,
      actorType: "user" as any,
      actorLabel: `${user.firstName} ${user.lastName}`,
      correlationId: request.correlationId || `req_${id}`,
    },
  });

  // EXECUTE (Inline for V1)
  // In production, this might queue a job. Here we call execution engine.
  try {
    await executeApproval(
      id,
      user.id,
      request.correlationId || `req_${id}`,
    );
  } catch (err: any) {
    console.error("Execution Failed Immediately", err);
    // Status updated to failed inside executeApproval usually, or we catch here.
    // If executeApproval throws, it might have failed.
  }

  return NextResponse.json({ ok: true, status: "approved" });
}
