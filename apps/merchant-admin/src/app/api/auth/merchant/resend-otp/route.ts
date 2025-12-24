import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, updateUser } from '@/lib/mockDb';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        // Validation
        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Find user
        const user = findUserByEmail(email);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Generate new verification code
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        updateUser(user.id, { verificationCode: newCode });

        // In production, send email here
        console.log(`[DEV] New verification code for ${email}: ${newCode}`);

        return NextResponse.json({
            message: 'Verification code sent successfully'
        });

    } catch (error) {
        console.error('Resend OTP error:', error);
        return NextResponse.json(
            { error: 'Failed to resend code' },
            { status: 500 }
        );
    }
}
