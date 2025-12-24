
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { amount, payout_account_id } = body;

    // Simulate Processing Delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (amount > 450000) { // Hardcoded limit check against mock mock available balance
        return NextResponse.json({ error: "Insufficient available funds" }, { status: 400 });
    }

    // In real app, create PENDING payout ledger entry
    return NextResponse.json({
        success: true,
        message: "Withdrawal initiated successfully",
        reference: `wdr_${Math.floor(Math.random() * 100000)}`
    });
}
