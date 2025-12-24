import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@vayva/db';

// DEV ONLY: Helper endpoint to reset user password
export async function POST(request: NextRequest) {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }

    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
        return NextResponse.json({ error: 'Email and newPassword required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);

    // Update password
    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
    });

    return NextResponse.json({
        message: 'Password reset successfully',
        email: email
    });
}
