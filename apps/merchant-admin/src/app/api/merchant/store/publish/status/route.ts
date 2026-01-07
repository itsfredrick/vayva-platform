import { NextRequest, NextResponse } from "next/server";


import { PublishService } from "@/lib/publish/publishService";
import { requireAuth } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  

  try {
    const status = await PublishService.getPublishStatus(
      user.storeId,
    );
    return NextResponse.json(status);
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
}
