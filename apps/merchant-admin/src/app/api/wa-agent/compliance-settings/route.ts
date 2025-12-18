
import { NextResponse } from 'next/server';

let mockSettings = {
    onlyInitiatedChat: true,
    requireApprovalForPayments: true,
    updatedAt: new Date().toISOString()
};

export async function GET() {
    return NextResponse.json(mockSettings);
}

export async function PATCH(request: Request) {
    const body = await request.json();
    mockSettings = { ...mockSettings, ...body, updatedAt: new Date().toISOString() };
    return NextResponse.json(mockSettings);
}
