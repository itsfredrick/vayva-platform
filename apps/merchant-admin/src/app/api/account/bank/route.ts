
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        accounts: [
            {
                id: 'acc_123',
                bankName: 'Guaranty Trust Bank',
                accountNumber: '0123456789',
                accountName: 'Vayva Demo Store',
                isDefault: true
            }
        ]
    });
}

export async function POST(request: Request) {
    // Logic to add/update bank
    return NextResponse.json({ success: true, message: 'Payout account updated' });
}
