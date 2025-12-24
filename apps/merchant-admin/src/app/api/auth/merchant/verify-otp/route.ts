import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { createSession } from '@/lib/session';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, code } = body;

        // Validation
        if (!email || !code) {
            return NextResponse.json(
                { error: 'Email and verification code are required' },
                { status: 400 }
            );
        }

        // Find user with OTP codes
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            include: {
                otpCodes: {
                    where: {
                        type: 'email_verification',
                        isUsed: false,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1,
                },
                memberships: {
                    where: { status: 'active' },
                    include: { store: true },
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if already verified
        if (user.isEmailVerified) {
            return NextResponse.json(
                { error: 'Email already verified' },
                { status: 400 }
            );
        }

        // Get the most recent OTP
        const otpRecord = user.otpCodes[0];
        if (!otpRecord) {
            return NextResponse.json(
                { error: 'No verification code found. Please request a new one.' },
                { status: 404 }
            );
        }

        // Check if OTP has expired
        if (otpRecord.expiresAt < new Date()) {
            return NextResponse.json(
                { error: 'Verification code has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Verify code
        if (otpRecord.code !== code) {
            return NextResponse.json(
                { error: 'Invalid verification code' },
                { status: 400 }
            );
        }

        // Update user and mark OTP as used in a transaction
        await prisma.$transaction([
            // Mark email as verified
            prisma.user.update({
                where: { id: user.id },
                data: { isEmailVerified: true },
            }),
            // Mark OTP as used
            prisma.otpCode.update({
                where: { id: otpRecord.id },
                data: { isUsed: true },
            }),
        ]);

        // Get user's store for session
        const membership = user.memberships[0];
        if (!membership) {
            return NextResponse.json(
                { error: 'No store membership found' },
                { status: 500 }
            );
        }

        // Create session
        const sessionUser = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            storeId: membership.storeId,
            storeName: membership.store.name,
            role: membership.role,
        };

        await createSession(sessionUser);

        return NextResponse.json({
            message: 'Email verified successfully',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                emailVerified: true,
            },
        });

    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            { error: 'Verification failed' },
            { status: 500 }
        );
    }
}
