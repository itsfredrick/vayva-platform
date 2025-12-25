import { Page } from '@playwright/test';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const COOKIE_NAME = 'vayva_session';

/**
 * Test user credentials
 */
export const TEST_USERS = {
    merchant: {
        email: 'test-merchant@vayva.test',
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'Merchant',
    },
    // Admin removed for now as schema changed - reimplement if Ops tests needed
};

/**
 * Create a test merchant user with store and owner membership
 */
export async function createTestMerchant(overrides?: Partial<typeof TEST_USERS.merchant>) {
    const user = { ...TEST_USERS.merchant, ...overrides };

    // Check existing user first to avoid unique constraint errors
    const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { memberships: { include: { store: true } } },
    });

    if (existingUser) {
        if (existingUser.memberships.length > 0) {
            return {
                user: existingUser,
                store: existingUser.memberships[0].store,
            };
        } else {
            // User exists but has no store/membership - dirty state. Clean up.
            await prisma.membership.deleteMany({ where: { userId: existingUser.id } });
            await prisma.merchantSession.deleteMany({ where: { userId: existingUser.id } });
            await prisma.user.delete({ where: { id: existingUser.id } });
        }
    }

    const passwordHash = await bcrypt.hash(user.password, 10);

    // Create merchant user
    const merchantUser = await prisma.user.create({
        data: {
            email: user.email,
            password: passwordHash,
            firstName: user.firstName,
            lastName: user.lastName,
            isEmailVerified: true,
            createdAt: new Date(),
        },
    });

    // Create store for merchant
    const store = await prisma.store.create({
        data: {
            name: `${user.firstName}'s Store`,
            slug: `test-store-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            onboardingStatus: 'COMPLETE',
            onboardingCompleted: true,
            createdAt: new Date(),
        },
    });

    // Link User to Store via Membership (Role = OWNER)
    await prisma.membership.create({
        data: {
            userId: merchantUser.id,
            storeId: store.id,
            role: 'owner',
            role_enum: 'OWNER',
            status: 'active'
        }
    });

    return { user: merchantUser, store };
}

/**
 * Login as merchant via UI
 */
export async function loginAsMerchant(page: Page, credentials = TEST_USERS.merchant) {
    await page.goto('/signin');
    await page.waitForLoadState('networkidle');

    // Fill in login form
    await page.fill('input[name="email"], input[type="email"]', credentials.email);
    await page.fill('input[name="password"], input[type="password"]', credentials.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL(/\/(dashboard|admin)/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
}


/**
 * Setup authenticated session via API (faster than UI login)
 * Mirrors src/lib/session.ts logic
 */
export async function setupAuthenticatedSession(page: Page, userEmail: string) {
    // Get user from database with membership
    const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: { memberships: { include: { store: true } } },
    });

    if (!user || user.memberships.length === 0) {
        throw new Error(`User not found or has no store: ${userEmail}`);
    }

    const membership = user.memberships[0];

    // JWT Payload
    const payload = {
        userId: user.id,
        email: user.email,
        storeId: membership.storeId,
        storeName: membership.store.name,
        role: membership.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    // Calculate expiration date (1 day)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    // Create MerchantSession in database
    await prisma.merchantSession.create({
        data: {
            userId: user.id,
            token,
            expiresAt,
            createdAt: new Date(),
        },
    });

    // Set session cookie
    await page.context().addCookies([
        {
            name: COOKIE_NAME,
            value: token,
            domain: 'localhost',
            path: '/',
            expires: Math.floor(expiresAt.getTime() / 1000),
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
        },
    ]);

    return { user, sessionToken: token };
}

/**
 * Cleanup test users
 */
export async function cleanupTestUsers() {
    const testEmails = Object.values(TEST_USERS).map((u) => u.email);

    // Get Users
    const users = await prisma.user.findMany({
        where: { email: { in: testEmails } },
        select: { id: true }
    });
    const userIds = users.map(u => u.id);

    // Delete sessions
    await prisma.merchantSession.deleteMany({
        where: { userId: { in: userIds } }
    });

    // Delete memberships
    await prisma.membership.deleteMany({
        where: { userId: { in: userIds } }
    });

    // Delete stores (Cascades usually? If not, delete manually)
    // Finding stores owned by these users (via membership) is hard if membership is gone.
    // Assuming Clean DB or manual cleanup.

    // Delete users
    await prisma.user.deleteMany({
        where: {
            email: { in: testEmails },
        },
    });
}

/**
 * Create authenticated merchant context (use in beforeEach)
 */
export async function createAuthenticatedMerchantContext(page: Page) {
    // Create test merchant if doesn't exist
    const { user, store } = await createTestMerchant();

    // Setup session
    await setupAuthenticatedSession(page, user.email);

    return { user, store };
}

/**
 * Verify user is authenticated
 */
export async function verifyAuthenticated(page: Page) {
    // Check if session cookie exists
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find((c) => c.name === COOKIE_NAME);

    return !!sessionCookie;
}

/**
 * Logout user
 */
export async function logout(page: Page) {
    await page.goto('/api/auth/signout');
    await page.waitForLoadState('networkidle');
}
