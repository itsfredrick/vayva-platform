import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@vayva/db';

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
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Generate new OTP code
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Create new OTP
        await prisma.otpCode.create({
            data: {
                userId: user.id,
                code: newCode,
                type: 'EMAIL_VERIFICATION',
                expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
            }
        });

        // Send email via Resend
        const { ResendEmailService } = await import('@/lib/email/resend');
        await ResendEmailService.sendOTPEmail(email, newCode, user.firstName);

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[DEV] New verification code for ${email}: ${newCode}`);
        }

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
