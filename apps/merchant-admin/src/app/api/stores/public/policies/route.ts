
import { NextResponse } from 'next/server';
import { getMockPolicies } from '../../../../../lib/mock-db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    // In real app, look up by slug. For now return the singleton mock
    if (!slug && !searchParams.get('storeId')) {
        // Allow fetching if just testing endpoint, but ideally require context
    }

    const policies = getMockPolicies();

    // Add lastUpdated timestamp if not present
    return NextResponse.json({
        ...policies,
        lastUpdated: new Date().toISOString()
    });
}
