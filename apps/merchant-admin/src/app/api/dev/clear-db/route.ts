import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@vayva/db';

// DEV ONLY: Helper endpoint to clear database (use with caution!)
export async function POST(request: NextRequest) {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }

    // Clear test data (be very careful with this!)
    const deletedUsers = await prisma.user.deleteMany({
        where: {
            email: {
                contains: 'test'
            }
        }
    });

    return NextResponse.json({
        message: 'Test users cleared successfully',
        usersRemoved: deletedUsers.count
    });
}

// GET to see current user count
export async function GET(request: NextRequest) {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }

    const userCount = await prisma.user.count();
    const users = await prisma.user.findMany({
        select: {
            email: true,
            firstName: true,
            emailVerified: true
        },
        take: 10
    });

    return NextResponse.json({
        userCount,
        users
    });
}
