import { NextResponse } from "next/server";
import { getIntegrationHealth } from "@/lib/integration-health";
import { requireAuth } from "@/lib/session";



export async function GET() {
  try {
    const user = await requireAuth();
    if (!user || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const storeId = user.storeId;

    // Ensure env var is set for library logic
    process.env.OPS_INTEGRATION_HEALTH_ENABLED = "true";

    const health = await getIntegrationHealth(storeId);

    return NextResponse.json({ health });
  } catch (error: any) {
    console.error("Integration health error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
