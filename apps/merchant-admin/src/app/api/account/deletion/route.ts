import { NextRequest, NextResponse } from "next/server";


import { DeletionService } from "@/services/DeletionService";
import { requireAuth } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  

  const status = await DeletionService.getStatus(user.storeId);
  return NextResponse.json({ status });
}

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  if (!user?.storeId || !user.id)
    return new NextResponse("Unauthorized", { status: 401 });

  // Verify Owner Role
  const userRole = user.role;
  if (userRole !== "OWNER") {
    return new NextResponse("Forbidden - Only Owner can request deletion", {
      status: 403,
    });
  }

  try {
    const body = await req.json();
    const { reason } = body;

    const result = await DeletionService.requestDeletion(
      user.storeId,
      user.id,
      reason,
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, blockers: result.blockers },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      scheduledFor: result.scheduledFor,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await requireAuth();
  if (!user?.storeId || !user.id)
    return new NextResponse("Unauthorized", { status: 401 });

  try {
    const result = await DeletionService.cancelDeletion(
      user.storeId,
      user.id,
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
