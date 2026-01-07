import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { user } = await OpsAuthService.requireSession();
    const { id } = await params;

    // Only Admin/Finance should process payouts
    if (!["OPS_OWNER", "OPS_ADMIN", "OPS_FINANCE"].includes(user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { action, reason } = body; // action: "APPROVE" | "REJECT"

    if (!["APPROVE", "REJECT"].includes(action)) {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const withdrawal = await prisma.withdrawal.findUnique({
        where: { id },
    });

    if (!withdrawal) {
        return NextResponse.json({ error: "Withdrawal not found" }, { status: 404 });
    }

    if (withdrawal.status !== "PENDING") {
        return NextResponse.json({ error: "Withdrawal already processed" }, { status: 400 });
    }

    try {
        if (action === "REJECT") {
            // Refund the wallet
            await prisma.$transaction([
                prisma.withdrawal.update({
                    where: { id },
                    data: {
                        status: "REJECTED",
                        rejectionReason: reason || "Rejected by Ops",
                        processedAt: new Date(),
                        processedBy: user.id
                    }
                }),
                prisma.wallet.update({
                    where: { storeId: withdrawal.storeId },
                    data: {
                        availableKobo: { increment: withdrawal.amountKobo }
                    }
                }),
                prisma.ledgerEntry.create({
                    data: {
                        storeId: withdrawal.storeId,
                        referenceType: "WITHDRAWAL",
                        referenceId: withdrawal.id,
                        direction: "CREDIT",
                        account: "WALLET",
                        amount: Number(withdrawal.amountKobo) / 100, // Normalized
                        currency: "NGN",
                        description: `Withdrawal Rejected: ${reason || "No reason provided"}`
                    }
                })
            ]);
        } else {
            // APPROVE (Mark as Processed)
            // Assumes manual transfer was done outside system
            await prisma.withdrawal.update({
                where: { id },
                data: {
                    status: "PROCESSED",
                    processedAt: new Date(),
                    processedBy: user.id
                }
            });
            // No ledger entry needed here because debit happened at REQUEST time.
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("Payout Process Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
