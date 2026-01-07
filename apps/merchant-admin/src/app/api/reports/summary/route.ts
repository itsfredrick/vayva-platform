import { NextRequest, NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth/tenantContext";
import { ReportsService } from "@/lib/reports";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
    try {
        const ctx = await getTenantContext(req);
        const { range } = await req.json();

        if (!range || !range.from || !range.to) {
            return NextResponse.json({ error: "Date range is required" }, { status: 400 });
        }

        const summary = await ReportsService.getSummary(ctx.merchantId, {
            from: new Date(range.from),
            to: new Date(range.to)
        });

        return NextResponse.json(summary);
    } catch (error: any) {
        logger.error("[API] Report Summary failed", { error: error.message });
        return NextResponse.json(
            { error: "Failed to fetch summary" },
            { status: 500 }
        );
    }
}
