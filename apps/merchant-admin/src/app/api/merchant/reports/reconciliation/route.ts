import { NextRequest, NextResponse } from "next/server";


import { ReportsService } from "@/lib/reports";
import { requireAuth } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") || undefined;
  const limit = parseInt(searchParams.get("limit") || "20");

  const data = await ReportsService.getReconciliation(
    user.storeId,
    limit,
    cursor,
  );

  return NextResponse.json(data);
}
