
import { NextResponse } from 'next/server';
import { UnifiedOrderStatus, WalletTransactionType, WalletTransactionStatus } from '@vayva/shared';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    const { amount, reason } = body;

    if (!amount || amount <= 0) {
        return NextResponse.json({ error: 'Invalid refund amount' }, { status: 400 });
    }

    // Simulate Ledger Entry creation (would happen in DB transaction)
    const ledgerEntry = {
        id: `txn_${Date.now()}`,
        type: WalletTransactionType.REFUND,
        amount: -amount, // Debit
        status: WalletTransactionStatus.COMPLETED,
        referenceId: id,
        description: `Refund for Order #${id}: ${reason}`,
        createdAt: new Date().toISOString()
    };

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
        id,
        status: UnifiedOrderStatus.REFUNDED,
        refund_id: `rf_${Date.now()}`,
        wallet_ledger_entry_id: ledgerEntry.id,
        updated_at: new Date().toISOString()
    });
}
