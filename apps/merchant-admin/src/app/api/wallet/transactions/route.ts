import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // Mock transaction data for development
        // TODO: Implement real database integration
        const mockTransactions = [
            {
                id: 'txn_001',
                merchantId: 'merchant_001',
                type: 'PAYMENT',
                amount: 15000,
                currency: 'NGN',
                status: 'COMPLETED',
                source: 'order',
                referenceId: 'ORD-2024-001',
                description: 'Payment for Order #001',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'txn_002',
                merchantId: 'merchant_001',
                type: 'PAYMENT',
                amount: 25000,
                currency: 'NGN',
                status: 'COMPLETED',
                source: 'order',
                referenceId: 'ORD-2024-002',
                description: 'Payment for Order #002',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'txn_003',
                merchantId: 'merchant_001',
                type: 'PAYOUT',
                amount: -50000,
                currency: 'NGN',
                status: 'COMPLETED',
                source: 'bank_transfer',
                referenceId: 'PAYOUT-001',
                description: 'Withdrawal to bank account',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];

        return NextResponse.json(mockTransactions);
    } catch (error) {
        console.error("Fetch Wallet History Error:", error);
        return NextResponse.json({ error: "Failed to fetch wallet history" }, { status: 500 });
    }
}
