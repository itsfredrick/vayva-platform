import { NextRequest, NextResponse } from "next/server";
import { getOnboardingUser } from "@/lib/session";
import { prisma } from "@vayva/db";
import { PaystackService } from "@/lib/payment/paystack";

export async function POST(req: NextRequest) {
    try {
        const user = await getOnboardingUser();
        if (!user || !user.storeId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { bvn, method } = body;

        if (!bvn && !body.nin && !body.registrationNumber) {
            return NextResponse.json({ error: "Missing identifier for verification" }, { status: 400 });
        }

        // 1. Get Onboarding State (specifically Bank Details and Business Name) from DB
        const store = await prisma.store.findUnique({
            where: { id: user.storeId },
            include: { merchantOnboarding: true }
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        const merchantData = (store.merchantOnboarding?.data || {}) as Record<string, any>;
        const settlementBank = merchantData.payments?.settlementBank;
        const businessName = store.name || merchantData.business?.name;

        // 2. Perform Verification based on method
        let isMatched = false;
        let errorMessage = "Verification failed";

        if (method === "bvn") {
            if (!settlementBank || !settlementBank.accountNumber || !settlementBank.bankCode) {
                return NextResponse.json({ error: "Bank details missing. Please complete the Payments step first." }, { status: 400 });
            }
            const result = await PaystackService.matchBVN(bvn, settlementBank.accountNumber, settlementBank.bankCode);
            isMatched = result.is_matched;
            errorMessage = result.reason || "BVN details do not match the provided bank account.";
        } else if (method === "nin") {
            if (!settlementBank || !settlementBank.accountNumber || !settlementBank.bankCode) {
                return NextResponse.json({ error: "Bank details missing. Please complete the Payments step first." }, { status: 400 });
            }
            const result = await PaystackService.matchNIN(body.nin, settlementBank.accountNumber, settlementBank.bankCode);
            isMatched = result.is_matched;
            errorMessage = result.reason || "NIN details do not match the provided bank account.";
        } else if (method === "cac") {
            if (!businessName) {
                return NextResponse.json({ error: "Official business name missing. Please complete Business Details." }, { status: 400 });
            }
            const result = await PaystackService.verifyCAC(body.registrationNumber, businessName);
            isMatched = result.is_matched;
            errorMessage = result.reason || "CAC Registration does not match your official business name.";
        }

        if (isMatched) {
            // CRITICAL: Save status to DB
            await prisma.store.update({
                where: { id: user.storeId },
                data: {
                    settings: {
                        ...((store.settings as any) || {}),
                        kycMethod: method,
                        kyVerifiedAt: new Date().toISOString()
                    } as any
                }
            });

            // Update Wallet status
            await prisma.wallet.update({
                where: { storeId: user.storeId },
                data: { kycStatus: "VERIFIED" }
            });

            return NextResponse.json({
                success: true,
                message: `${method.toUpperCase()} Verified`,
                data: {
                    kycStatus: "verified"
                }
            });
        } else {
            return NextResponse.json({
                success: false,
                error: errorMessage
            }, { status: 400 });
        }

    } catch (error: any) {
        console.error("KYC Verification Error:", error);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}
