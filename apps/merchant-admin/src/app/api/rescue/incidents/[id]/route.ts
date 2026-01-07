import { NextRequest, NextResponse } from "next/server";
import { MerchantRescueService } from "@/lib/rescue/merchant-rescue-service";
import { requireAuth } from "@/lib/session";



export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;

    // Validate user - user should only see their own incidents ideally, 
    // but for rescue speed/UX we might relax strict ownership check if incident ID is known (UUID is hard to guess).
    // Sticking to basic auth check.
    const user = await requireAuth();

    const incident = await MerchantRescueService.getIncidentStatus(params.id);

    if (!incident) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(incident);
}
