import { NextResponse } from "next/server";


import { PaystackService } from "@/lib/payment/paystack";
import { requireAuth } from "@/lib/session";

export async function POST(req: Request) {
    try {
        const user = await requireAuth();
        

        const body = await req.json();
        const { accountNumber, bankCode } = body;

        if (!accountNumber || !bankCode) {
            return NextResponse.json({ error: "Missing account details" }, { status: 400 });
        }

        const resolved = await PaystackService.resolveAccount(accountNumber, bankCode);

        return NextResponse.json(resolved);

    } catch (error: any) {
        console.error("Verification Error:", error);
        return NextResponse.json({ error: "Could not resolve account name. Check details." }, { status: 400 });
    }
}
