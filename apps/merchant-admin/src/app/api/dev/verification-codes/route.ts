import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@vayva/db';

// DEV ONLY: Helper endpoint to retrieve verification codes
export async function GET(request: NextRequest) {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        // Return all recent OTP codes
        const otps = await prisma.otpCode.findMany({
            where: {
                expiresAt: {
                    gte: new Date()
                }
            },
            include: {
                user: {
                    select: {
                        email: true,
                        emailVerified: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10
        });

        return NextResponse.json({ otps });
    }

    // Find specific user's OTP
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            otpCodes: {
                where: {
                    expiresAt: {
                        gte: new Date()
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 1
            }
        }
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
        email: user.email,
        verificationCode: user.otpCodes[0]?.code || 'No active code',
        emailVerified: user.emailVerified
    });
}
