
import { NextResponse } from 'next/server';
import { PayoutAccount } from '@vayva/shared';

let ACCOUNTS: PayoutAccount[] = [
    {
        id: 'pa_1',
        merchantId: 'mer_1',
        bankName: 'Guaranty Trust Bank',
        bankCode: '058',
        accountNumber: '******1234',
        accountName: 'FRED ADAMS STORE',
        isDefault: true
    }
];

export async function GET() {
    await new Promise(resolve => setTimeout(resolve, 400));
    return NextResponse.json(ACCOUNTS);
}

export async function POST(request: Request) {
    const body = await request.json();
    // Simulate resolving and saving
    const newAccount: PayoutAccount = {
        id: `pa_${Date.now()}`,
        merchantId: 'mer_1',
        bankName: body.bankName,
        bankCode: body.bankCode,
        accountNumber: `******${body.accountNumber.slice(-4)}`,
        accountName: body.accountName,
        isDefault: ACCOUNTS.length === 0 // First one is default
    };
    ACCOUNTS.push(newAccount);
    return NextResponse.json(newAccount);
}
