import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";


import { PaystackService } from "@/lib/payment/paystack";
import { requireAuth } from "@/lib/session";

export async function GET(req: Request) {
    try {
        const user = await requireAuth();
        

        const storeId = user.storeId;

        const wallet = await prisma.wallet.findUnique({
            where: { storeId }
        });

        if (!wallet || !wallet.vaAccountNumber) {
            // Use user user details for customer creation
            

            try {
                // 1. Ensure Customer Exists
                const customer = await PaystackService.createCustomer(
                    user.email,
                    user.firstName || "Merchant",
                    user.lastName || "Admin",
                    user.phone || "+2340000000000"
                );

                // 2. Create Dedicated Account
                const dva = await PaystackService.createDedicatedAccount(customer.customer_code);

                // 3. Update Wallet with DVA details
                // Ensure wallet exists first (upsert)
                const updatedWallet = await prisma.wallet.upsert({
                    where: { storeId },
                    create: {
                        storeId,
                        vaBankName: dva.bank.name,
                        vaAccountNumber: dva.account_number,
                        vaAccountName: dva.account_name,
                        vaStatus: "CREATED"
                    },
                    update: {
                        vaBankName: dva.bank.name,
                        vaAccountNumber: dva.account_number,
                        vaAccountName: dva.account_name,
                        vaStatus: "CREATED"
                    }
                });

                // Return the new details
                return NextResponse.json({
                    balance: updatedWallet ? Number(updatedWallet.availableKobo) / 100 : 0,
                    pending: updatedWallet ? Number(updatedWallet.pendingKobo) / 100 : 0,
                    currency: "NGN",
                    status: updatedWallet.vaStatus || "ACTIVE",
                    account_number: dva.account_number,
                    bank_name: dva.bank.name,
                    account_name: dva.account_name
                });

            } catch (e) {
                console.error("Failed to provision DVA:", e);
                // Continue to return existing wallet state if provisioning fails
            }
        }

        return NextResponse.json({
            balance: Number(wallet?.availableKobo || 0) / 100,
            pending: Number(wallet?.pendingKobo || 0) / 100,
            currency: "NGN",
            status: wallet?.vaStatus || "ACTIVE",
            account_number: wallet?.vaAccountNumber,
            bank_name: wallet?.vaBankName,
            account_name: wallet?.vaAccountName
        });

    } catch (error: any) {
        console.error("Wallet Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch wallet" }, { status: 500 });
    }
}
