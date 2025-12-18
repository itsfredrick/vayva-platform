import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 1. Rate Limiting Placeholder
    // In production, use Vercel KV or Redis to track requests per IP.
    // const ip = request.ip ?? '127.0.0.1';
    // const rateLimit = await checkRateLimit(ip);
    // if (!rateLimit.success) return new NextResponse('Too Many Requests', { status: 429 });

    // 2. Security Headers
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
}

export const config = {
    matcher: '/:path*',
};
