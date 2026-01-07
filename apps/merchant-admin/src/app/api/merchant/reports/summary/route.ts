import { NextRequest, NextResponse } from "next/server";


import { ReportsService } from "@/lib/reports";
import { requireAuth } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  

  const { searchParams } = new URL(req.url);
  const fromStr = searchParams.get("from");
  const toStr = searchParams.get("to");

  // Default: Last 7 days
  const to = toStr ? new Date(toStr) : new Date();
  const from = fromStr
    ? new Date(fromStr)
    : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const data = await ReportsService.getSummary(user.storeId, {
    from,
    to,
  });

  return NextResponse.json(data);
}
