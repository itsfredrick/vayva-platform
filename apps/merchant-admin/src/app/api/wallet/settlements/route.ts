import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Mock settlement data for development
        // TODO: Implement real database integration
        const mockSettlements = [
            {
                id: 'settlement_001',
                amount: 250000,
                currency: 'NGN',
                status: 'PENDING',
                payoutDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
                referenceId: 'SETTLE-2024-001',
                description: 'Next scheduled payout'
            },
            {
                id: 'settlement_002',
                amount: 500000,
                currency: 'NGN',
                status: 'COMPLETED',
                payoutDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                referenceId: 'SETTLE-2024-002',
                description: 'Last payout - Dec 21'
            }
        ];

        return NextResponse.json(mockSettlements);
    } catch (error: any) {
        console.error("Fetch Settlements Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
