import { NextRequest, NextResponse } from "next/server";


import { ReportsService } from "@/lib/reports";
import { requireAuth } from "@/lib/session";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> },
) {
  const user = await requireAuth();
  

  const { type } = await params; // 'orders', 'payments', 'reconciliation'

  // Validate type
  if (!["reconciliation"].includes(type))
    return new NextResponse("Invalid Type", { status: 400 });

  const csv = await ReportsService.generateCSV(
    user.storeId,
    type as any,
    { from: new Date(0), to: new Date() }, // All time for V1 export? or parse query params
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${type}-${Date.now()}.csv"`,
    },
  });
}
