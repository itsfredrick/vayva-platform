import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { MerchantRescueService } from "@/lib/rescue/merchant-rescue-service";

export async function POST(req: NextRequest) {
    const user = await requireAuth();

    if (!user) {
        // We allow anonymous reporting for critical UI crashes where session might be lost/unavailable
        // BUT ideally we prefer auth. For now, let's proceed but mark user as anonymous.
    }

    try {
        const body = await req.json();
        const { route, errorMessage, stackHash, fingerprint } = body;

        if (!errorMessage) {
            return NextResponse.json({ error: "No error message" }, { status: 400 });
        }

        const incident = await MerchantRescueService.reportIncident({
            route: route || "unknown",
            errorMessage,
            stackHash,
            fingerprint,
            storeId: user?.storeId,
            userId: user?.id,
        });

        return NextResponse.json({
            incidentId: incident.id,
            status: incident.status,
            message: "Rescue initiated"
        });

    } catch (error: any) {
        console.error("Rescue Report API Error:", error);
        return NextResponse.json({ error: "Failed to report" }, { status: 500 });
    }
}
