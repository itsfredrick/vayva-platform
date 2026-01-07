import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";

// This route should be called by Vercel Cron or an external scheduler
// Schedule: Daily
export async function GET(req: NextRequest) {
    // 1. Verify Vercel Cron Signature
    if (process.env.CRON_SECRET && req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const now = new Date();
        const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

        // Promise: "account will be paused" at end of trial
        // We update the Subscription status
        const expiredTrials = await prisma.merchantAiSubscription.updateMany({
            where: {
                trialExpiresAt: { lt: now },
                status: "TRIAL_ACTIVE",
            },
            data: {
                status: "TRIAL_EXPIRED_GRACE"
            }
        });

        // Promise: "deleted after 3 days" (if no subscription)
        // Find stores with expired grace period
        const toDeleteSubscriptions = await prisma.merchantAiSubscription.findMany({
            where: {
                trialExpiresAt: { lt: threeDaysAgo },
                status: { in: ["TRIAL_EXPIRED_GRACE", "TRIAL_ACTIVE"] },
                planKey: "STARTER" // Only delete starter/trials
            },
            select: { storeId: true }
        });

        const storeIdsToDelete = toDeleteSubscriptions.map((s: { storeId: string }) => s.storeId);

        if (storeIdsToDelete.length > 0) {
            console.log(`[CRON] Deleting ${storeIdsToDelete.length} expired trial stores:`, storeIdsToDelete);

            // Execute Deletion of STORES
            await prisma.store.deleteMany({
                where: {
                    id: { in: storeIdsToDelete }
                }
            });
        }

        return NextResponse.json({
            paused: expiredTrials.count,
            deleted: storeIdsToDelete.length,
            ok: true
        });
    } catch (error: any) {
        console.error("[CRON] Job failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
