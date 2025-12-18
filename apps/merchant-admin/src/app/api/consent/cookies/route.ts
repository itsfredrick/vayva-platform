
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    console.log('Consent Save:', body);
    return NextResponse.json({ success: true, ...body, updatedAt: new Date().toISOString() });
}

export async function GET() {
    return NextResponse.json({
        necessary: true,
        analytics: true,
        marketing: true,
        updatedAt: new Date().toISOString()
    });
}
