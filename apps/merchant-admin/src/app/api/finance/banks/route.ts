import { NextResponse } from "next/server";


import { PaystackService } from "@/lib/payment/paystack";
import { requireAuth } from "@/lib/session";

export async function GET() {
    try {
        const user = await requireAuth();
        

        const banks = await PaystackService.getBanks();

        // Optimize payload: only need name and code
        const simplified = banks
            .filter(b => b.active)
            .map(b => ({ name: b.name, code: b.code }));

        return NextResponse.json(simplified);
    } catch (error: any) {
        console.error("Bank List Error:", error);
        return NextResponse.json({ error: "Could not fetch banks" }, { status: 500 });
    }
}
