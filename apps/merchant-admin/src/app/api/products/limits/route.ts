import { NextResponse } from "next/server";

 // Adjust import path as needed
import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";

export async function GET(req: Request) {
    const user = await requireAuth();

    // Use storeId from user or header (depending on auth strategy)
    // Assuming user.storeId exists based on project patterns
    const storeId = (user as any)?.storeId;

    if (!storeId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // 1. Get Plan
        const subscription = await prisma.merchantAiSubscription.findUnique({
            where: { storeId },
            select: { planKey: true },
        });
        const planKey = subscription?.planKey || "STARTER";

        // 2. Count Products
        const used = await prisma.product.count({
            where: { storeId, status: { not: "ARCHIVED" } },
        });

        // 3. Determine Limit
        let limit: number | "unlimited" = 50; // Starter
        if (planKey === "GROWTH") limit = 500;
        if (planKey === "PRO") limit = "unlimited";

        return NextResponse.json({
            used,
            limit,
            plan: planKey.toLowerCase(),
        });

    } catch (error) {
        console.error("[PRODUCTS_LIMITS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
