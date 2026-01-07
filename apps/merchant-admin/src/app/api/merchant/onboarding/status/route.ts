import { NextRequest, NextResponse } from "next/server";
import { getOnboardingUser } from "@/lib/session";
import { prisma } from "@vayva/db";

export async function GET(req: NextRequest) {
    try {
        const user = await getOnboardingUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!user.storeId) {
            return NextResponse.json({
                completed: false,
                completionPercentage: 0,
                missingSteps: ["Create Store"],
                canLaunch: false
            });
        }

        const store = await prisma.store.findUnique({
            where: { id: user.storeId },
        });

        if (!store) {
            return NextResponse.json({
                completed: false,
                completionPercentage: 0,
                missingSteps: ["Create Store"],
                canLaunch: false
            });
        }

        const settings = store.settings as any || {};
        const missingSteps: string[] = [];
        let score = 0;
        const totalWeight = 4; // Business, Identity, Products, Payments

        // Check Business Info
        if (settings.business?.category && settings.business?.location) {
            score++;
        } else {
            missingSteps.push("Business Info");
        }

        // Check Identity (Simulated check)
        if (store.onboardingLastStep === "identity" || settings.identity) {
            // If passed identity step or has data
            score++;
        } else {
            // heuristic: if last step is before identity
            if (store.onboardingLastStep === "business-info") missingSteps.push("Verify Identity");
        }

        // Check Products
        if (settings.products?.count > 0) {
            score++;
        } else if (settings.products?.skipped) {
            // It's "done" for onboarding flow, but "missing" for AI readiness
            missingSteps.push("Add Products");
            // We don't give the full point for AI readiness if skipped
        } else {
            missingSteps.push("Add Products");
        }

        // Check Payments
        if (settings.payments?.configured) {
            score++;
        } else if (settings.payments?.skipped) {
            missingSteps.push("Setup Payments");
        }

        // Determine if strictly "complete" for launch vs AI ready
        const isLaunchReady = store.onboardingCompleted;

        // AI Readiness Percentage
        const completionPercentage = Math.round((score / totalWeight) * 100);

        return NextResponse.json({
            completed: isLaunchReady && missingSteps.length === 0,
            launchReady: isLaunchReady,
            completionPercentage,
            missingSteps,
            canLaunch: isLaunchReady
        });

    } catch (error) {
        console.error("[ONBOARDING_STATUS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
