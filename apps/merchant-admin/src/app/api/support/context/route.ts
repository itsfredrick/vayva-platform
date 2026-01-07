import { NextResponse } from "next/server";

 // Adjust path as per repo structure
import { SupportContextService } from "@/lib/support/support-context.service";
import { requireAuth } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const user = await requireAuth();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const storeId = user.storeId;
    const context = await SupportContextService.getMerchantSnapshot(storeId);

    if (!context) {
      return NextResponse.json(
        { error: "Store context not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(context);
  } catch (error) {
    console.error("[SupportContext] Error fetching context", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
