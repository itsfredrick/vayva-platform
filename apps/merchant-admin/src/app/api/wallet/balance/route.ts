import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';

export async function GET() {
    try {
        // Require authentication
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized - Please login' },
                { status: 401 }
            );
        }

        // Mock wallet balance data for development
        // TODO: Replace with real database query for user.storeId
        const balance = {
            storeId: user.storeId,
            available: 250000,
            pending: 75000,
            total: 325000,
            blocked: 0,
            currency: 'NGN',
            lastUpdated: new Date().toISOString()
        };

        return NextResponse.json(balance);
    } catch (error) {
        console.error("Fetch Balance Error:", error);
        return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 });
    }
}
