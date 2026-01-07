import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";


import { logAuditEvent, AuditEventType } from "@/lib/audit";
import { requireAuth } from "@/lib/session";

/**
 * Real Payout Accounts Implementation
 * Replaces in-memory mock with BankBeneficiary DB model.
 */

export async function GET() {
  const user = await requireAuth();
  

  try {
    const accounts = await prisma.bankBeneficiary.findMany({
      where: { storeId: user.storeId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(accounts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payout accounts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  

  try {
    const body = await req.json();
    const storeId = user.storeId;
    const userId = user.id;

    const { bankName, bankCode, accountNumber, accountName, isDefault } = body;

    if (!bankCode || !accountNumber || !accountName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // If setting as default, unset others first
    if (isDefault) {
      await prisma.bankBeneficiary.updateMany({
        where: { storeId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await prisma.bankBeneficiary.create({
      data: {
        storeId,
        bankName: bankName || "Unknown Bank",
        bankCode,
        accountNumber,
        accountName,
        isDefault: isDefault || false,
      },
    });

    // Audit Log
    await logAuditEvent(storeId, userId, AuditEventType.PAYOUT_SETTING_CHANGED, {
      accountId: account.id,
      bank: account.bankName,
      accountLast4: account.accountNumber.slice(-4),
    });

    return NextResponse.json(account);
  } catch (error: any) {
    console.error("Payout accounts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save payout account" },
      { status: 500 }
    );
  }
}
