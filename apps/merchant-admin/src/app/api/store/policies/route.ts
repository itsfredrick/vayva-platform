
import { NextResponse } from 'next/server';
import { getMockPolicies, updateMockPolicies } from '../../../../lib/mock-db';

export async function GET() {
    // Simulate DB fetch
    const policies = getMockPolicies();
    return NextResponse.json(policies);
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        // In a real app, validate with Zod here
        const updated = updateMockPolicies(body);
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
