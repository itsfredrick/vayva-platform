import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mockDb';

// DEV ONLY: Helper endpoint to retrieve verification codes
export async function GET(request: NextRequest) {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        // Return all users with their verification codes
        const users = mockUsers.map(u => ({
            email: u.email,
            verificationCode: u.verificationCode,
            emailVerified: u.emailVerified
        }));
        return NextResponse.json({ users });
    }

    // Find specific user
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
        email: user.email,
        verificationCode: user.verificationCode,
        emailVerified: user.emailVerified
    });
}
