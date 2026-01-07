import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";



export async function POST(req: Request) {
    try {
        const user = await requireAuth();
        

        const body = await req.json();
        const { amount, bankCode, accountNumber, accountName } = body;
        const storeId = user.storeId;

        // 1. Check Balance
        const wallet = await prisma.wallet.findUnique({ where: { storeId } });
        if (!wallet) return new NextResponse("Wallet not found", { status: 404 });

        const withdrawalAmountRef = BigInt(Math.round(amount * 100)); // Store as Kobo

        if (wallet.availableKobo < withdrawalAmountRef) {
            return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
        }

        // 2. Debit Wallet immediately (Escrow logic)
        // We update pendingWithdrawal or just reduce available? 
        // Usually we move to "Locked" or simply reduce available and create a Withdrawal Record
        // Reusing logic from Ops Console: Withdrawal request reduces available? 
        // Let's protect it in a transaction

        const result = await prisma.$transaction(async (tx) => {
            // Debit Wallet
            const updatedWallet = await tx.wallet.update({
                where: { storeId },
                data: {
                    availableKobo: { decrement: withdrawalAmountRef }
                }
            });

            // Create Withdrawal Request
            const withdrawal = await tx.withdrawal.create({
                data: {
                    storeId,
                    amountKobo: withdrawalAmountRef,
                    status: "PENDING",
                    referenceCode: `WD-${Date.now()}`,
                    // Note: bankName, bankCode, accountNumber, accountName are not in the Withdrawal model
                    // They should be stored via bankAccountId reference or removed
                }
            });

            // Create Ledger Entry
            await tx.ledgerEntry.create({
                data: {
                    storeId,
                    referenceType: "WITHDRAWAL",
                    referenceId: withdrawal.id,
                    direction: "DEBIT",
                    account: "WALLET",
                    amount: Number(withdrawalAmountRef) / 100, // Convert kobo to currency units
                    currency: "NGN",
                    description: `Withdrawal Request #${withdrawal.id.substring(0, 8)}`,
                }
            });

            return withdrawal;
        });

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Withdrawal Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
