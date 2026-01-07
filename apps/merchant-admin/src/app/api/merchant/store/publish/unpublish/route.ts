import { NextRequest, NextResponse } from "next/server";


import { PublishService } from "@/lib/publish/publishService";
import { requireAuth } from "@/lib/session";

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  

  const body = await req.json();

  try {
    await PublishService.unpublish(
      user.storeId,
      user.id,
      user.name || "Merchant",
      body.reason || "No reason provided",
    );
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
}
