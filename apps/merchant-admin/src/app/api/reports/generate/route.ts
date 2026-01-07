import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { ReportsService } from "@/lib/reports";
import { prisma } from "@vayva/db";
import { PLANS } from "@/lib/billing/plans";

export async function POST(req: Request) {
    try {
        const user = await requireAuth();

        if (!user || !user.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { type, range } = body; // range: { from, to }

        if (!["orders", "payments", "reconciliation", "customers", "finances"].includes(type)) {
            return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
        }

        if (!range || !range.from || !range.to) {
            return NextResponse.json({ error: "Date range required" }, { status: 400 });
        }

        // --- GATING CHECK ---
        const store = await prisma.store.findUnique({
            where: { id: user.storeId },
            select: { plan: true }
        });

        if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

        const planSlug = (store.plan || "free").toLowerCase();
        const plan = PLANS[planSlug] || PLANS["free"];

        if (!plan.features.advancedAnalytics) {
            return NextResponse.json(
                { error: "Plan limit reached. Upgrade to access advanced reports.", code: "PLAN_LIMIT_REACHED" },
                { status: 403 }
            );
        }
        // --------------------

        const dateRange = {
            from: new Date(range.from),
            to: new Date(range.to)
        };

        const csvData = await ReportsService.generateCSV(
            user.storeId,
            type as any,
            dateRange
        );

        const filename = `${type}_report_${new Date().toISOString().split("T")[0]}.csv`;

        return new NextResponse(csvData, {
            status: 200,
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="${filename}"`
            }
        });

    } catch (error: any) {
        console.error("Report Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate report" },
            { status: 500 }
        );
    }
}
