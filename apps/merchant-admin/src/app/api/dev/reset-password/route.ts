import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { mockUsers } from '@/lib/mockDb';

// DEV ONLY: Helper endpoint to reset user password
export async function POST(request: NextRequest) {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }

    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
        return NextResponse.json({ error: 'Email and newPassword required' }, { status: 400 });
    }

    const userIndex = mockUsers.findIndex(u => u.email === email);
    if (userIndex === -1) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);

    // Update password
    mockUsers[userIndex].password = hashedPassword;

    return NextResponse.json({
        message: 'Password reset successfully',
        email: email
    });
}
