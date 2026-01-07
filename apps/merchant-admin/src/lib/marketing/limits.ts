import { prisma } from "@vayva/db";
import { PLANS, PlanKey } from "@/lib/billing/plans";
import { startOfMonth, endOfMonth } from "date-fns";

/**
 * Checks if a store has reached its monthly campaign send limit.
 * @param storeId The ID of the store to check.
 * @param count The number of messages the user intends to send.
 * @throws Error if the limit would be exceeded.
 */
export async function checkCampaignLimits(storeId: string, count: number) {
    // 1. Get Store Plan
    const store = await prisma.store.findUnique({
        where: { id: storeId },
        select: { plan: true }
    });

    if (!store) {
        throw new Error("Store not found");
    }

    const planKey = (store.plan?.toLowerCase() || "free") as PlanKey;
    const limit = PLANS[planKey]?.limits?.monthlyCampaignSends || 0;

    // 2. Count usage for current month
    const now = new Date();
    const currentUsage = await prisma.campaignSend.count({
        where: {
            storeId,
            createdAt: {
                gte: startOfMonth(now),
                lte: endOfMonth(now)
            }
        }
    });

    // 3. Check Limit
    if (currentUsage + count > limit) {
        throw new Error(
            `Campaign limit exceeded. Your plan (${planKey}) allows ${limit} sends per month. You have used ${currentUsage}.`
        );
    }

    return true;
}
