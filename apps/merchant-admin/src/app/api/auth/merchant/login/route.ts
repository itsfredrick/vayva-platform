import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { prisma } from '@vayva/db';
import { createSession } from '@/lib/session';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user with memberships
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            include: {
                memberships: {
                    where: { status: 'active' },
                    include: { store: true },
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await compare(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            return NextResponse.json(
                { error: 'Please verify your email first' },
                { status: 403 }
            );
        }

        // Get user's store membership
        const membership = user.memberships[0];
        if (!membership) {
            return NextResponse.json(
                { error: 'No active store membership found' },
                { status: 500 }
            );
        }

        // Get onboarding status
        const onboarding = await prisma.merchantOnboarding.findUnique({
            where: { storeId: membership.storeId },
        });

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

        // Return user and merchant data
        return NextResponse.json({
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: membership.role,
                emailVerified: user.isEmailVerified,
                phoneVerified: user.isPhoneVerified || false,
                createdAt: user.createdAt,
            },
            merchant: {
                merchantId: user.id,
                storeId: membership.storeId,
                storeName: membership.store.name,
                onboardingStatus: onboarding?.status || 'IN_PROGRESS',
                onboardingLastStep: membership.store.onboardingLastStep || 'welcome',
                onboardingCompleted: membership.store.onboardingCompleted || false,
                onboardingUpdatedAt: onboarding?.updatedAt || new Date(),
                plan: 'STARTER', // TODO: Get from subscription
            },
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }
}
