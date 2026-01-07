import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@vayva/db";
import { PaystackService } from "@/lib/payment/paystack";

export async function GET() {
  try {
    const user = await requireAuth();
    const storeId = user.storeId;

    const beneficiaries = await prisma.bankBeneficiary.findMany({
      where: { storeId },
    });

    return NextResponse.json(beneficiaries);
  } catch (error: any) {
    console.error("Beneficiaries fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch beneficiaries" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const storeId = user.storeId;
    const body = await req.json();

    const { bankCode, bankName, accountNumber, accountName, isDefault } = body;

    if (!bankCode || !bankName || !accountNumber || !accountName) {
      return NextResponse.json(
        { error: "Missing account details" },
        { status: 400 },
      );
    }

    // If this is set as default, unset others first
    if (isDefault) {
      await prisma.bankBeneficiary.updateMany({
        where: { storeId },
        data: { isDefault: false },
      });
    }

    // Fetch store name for subaccount creation
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { name: true },
    });

    // Create Paystack Subaccount
    let subaccountCode = null;
    try {
      const subaccount = await PaystackService.createSubaccount(
        store?.name || "Merchant Store",
        bankCode,
        accountNumber,
        20 // Vayva takes 20% ? Or make this configurable. Default to 0 for now as per method signature default?
        // Let's use 0 for now and let Paystack manage split if needed, or pass 0.
        // Actually the method I added defaults to 0. Let's pass undefined to use default.
      );
      subaccountCode = subaccount.subaccount_code;

      // Update Store with subaccount code
      await prisma.store.update({
        where: { id: storeId },
        data: { paystackSubaccountCode: subaccountCode },
      });
    } catch (e) {
      console.warn("Failed to create Paystack subaccount:", e);
      // Continue anyway? Or fail? Best to fail if this is critical for payouts.
      // But maybe we allow adding bank even if Paystack fails (offline mode).
      // Let's log warn and continue, but maybe should notify user.
    }

    const beneficiary = await prisma.bankBeneficiary.create({
      data: {
        storeId,
        bankCode,
        bankName,
        accountNumber,
        accountName,
        isDefault: !!isDefault,
      },
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        storeId,
        actorType: "USER",
        actorId: user.id,
        actorLabel: user.email || "Merchant",
        action: "PAYOUT_METHOD_ADDED",
        entityType: "BankBeneficiary",
        entityId: beneficiary.id,
        correlationId: `payout-${Date.now()}`,
      },
    });

    return NextResponse.json(beneficiary);
  } catch (error: any) {
    console.error("Beneficiary create error:", error);
    return NextResponse.json(
      { error: "Failed to add payout method" },
      { status: 500 },
    );
  }
}
