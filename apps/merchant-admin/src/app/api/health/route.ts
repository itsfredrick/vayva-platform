import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';

export async function GET() {
    let dbStatus = 'unknown';
    try {
        // Quick check
        await prisma.$queryRaw`SELECT 1`;
        dbStatus = 'ok';
    } catch (e: any) {
        dbStatus = 'error';
        console.error('Health Check DB Fail:', e.message);
    }

    return NextResponse.json({
        status: dbStatus === 'ok' ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        services: {
            database: dbStatus
        },
        env: process.env.NODE_ENV
    }, { status: dbStatus === 'ok' ? 200 : 503 });
}
