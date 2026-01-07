import { NextRequest, NextResponse } from "next/server";


import { getConsentStats } from "@/lib/consent/analytics";
import { requireAuth } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  if (!(user as any)?.storeId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getConsentStats(user.storeId);
  return NextResponse.json(stats);
}
