import { NextRequest, NextResponse } from "next/server";


import { getReachableAudience } from "@/lib/consent/analytics";
import { requireAuth } from "@/lib/session";

enum MessageIntent {
  MARKETING = "MARKETING",
  TRANSACTIONAL = "TRANSACTIONAL",
}

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  if (!(user as any)?.storeId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (type !== "marketing" && type !== "transactional") {
    return new NextResponse("Invalid type", { status: 400 });
  }

  const intent =
    type === "marketing"
      ? MessageIntent.MARKETING
      : MessageIntent.TRANSACTIONAL;
  const audience = await getReachableAudience(
    user.storeId,
    intent as any,
  );

  return NextResponse.json(audience);
}
