import { NextRequest, NextResponse } from "next/server";
import { getOnboardingUser } from "@/lib/session";
import { prisma } from "@vayva/db";

export async function PUT(req: NextRequest) {
    try {
        const user = await getOnboardingUser();

        console.log('[ONBOARDING_COMPLETE] User:', {
            userId: user?.id,
            storeId: user?.storeId,
            hasUser: !!user
        });

        if (!user) {
            console.error('[ONBOARDING_COMPLETE] No user found in session');
            return new NextResponse("Unauthorized - No user", { status: 401 });
        }

        if (!user.storeId) {
            console.error('[ONBOARDING_COMPLETE] User has no storeId:', user);
            return new NextResponse("Unauthorized - No store", { status: 401 });
        }

        // Update store to mark onboarding as complete
        const updatedStore = await prisma.store.update({
            where: { id: user.storeId },
            data: {
                onboardingCompleted: true,
                onboardingStatus: "COMPLETE",
            }
        });

        console.log('[ONBOARDING_COMPLETE] Successfully completed for store:', updatedStore.id);

        return NextResponse.json({ success: true, storeId: updatedStore.id });

    } catch (error) {
        console.error("[ONBOARDING_COMPLETE_PUT] Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
