
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    // Receive mock status updates (delivered, read)
    return new NextResponse('OK', { status: 200 });
}
