import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mockDb';

// DEV ONLY: Helper endpoint to clear all users from mock database
export async function POST(request: NextRequest) {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }

    const beforeCount = mockUsers.length;
    mockUsers.length = 0; // Clear the array

    return NextResponse.json({
        message: 'Mock database cleared successfully',
        usersRemoved: beforeCount
    });
}

// GET to see current user count
export async function GET(request: NextRequest) {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }

    return NextResponse.json({
        userCount: mockUsers.length,
        users: mockUsers.map(u => ({
            email: u.email,
            firstName: u.firstName,
            businessName: u.businessName,
            emailVerified: u.emailVerified
        }))
    });
}
