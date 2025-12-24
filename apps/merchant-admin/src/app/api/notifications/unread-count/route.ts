
import { NextResponse } from 'next/server';

export async function GET() {
    // Mock count
    return NextResponse.json({ count: 3 });
}
