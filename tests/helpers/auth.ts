import { Page } from '@playwright/test';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

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
    admin: {
        email: 'test-admin@vayva.test',
        password: 'AdminPassword123!',
        firstName: 'Test',
        lastName: 'Admin',
    },
    customer: {
        email: 'test-customer@vayva.test',
        password: 'CustomerPassword123!',
        firstName: 'Test',
        lastName: 'Customer',
    },
};

/**
 * Create a test merchant user with store
 */
export async function createTestMerchant(overrides?: Partial<typeof TEST_USERS.merchant>) {
    const user = { ...TEST_USERS.merchant, ...overrides };
    const passwordHash = await bcrypt.hash(user.password, 10);

    try {
        // Create merchant user
        const merchantUser = await prisma.user.create({
            data: {
                email: user.email,
                passwordHash,
                firstName: user.firstName,
                lastName: user.lastName,
                role: 'MERCHANT',
                isVerified: true,
                createdAt: new Date(),
            },
        });

        // Create store for merchant
        const store = await prisma.store.create({
            data: {
                name: `${user.firstName}'s Store`,
                slug: `test-store-${Date.now()}`,
                ownerId: merchantUser.id,
                status: 'ACTIVE',
                createdAt: new Date(),
            },
        });

        return { user: merchantUser, store };
    } catch (error: any) {
        // If user already exists, fetch it
        if (error.code === 'P2002') {
            const existingUser = await prisma.user.findUnique({
                where: { email: user.email },
                include: { ownedStores: true },
            });

            if (existingUser) {
                return {
                    user: existingUser,
                    store: existingUser.ownedStores[0] || null,
                };
            }
        }
        throw error;
    }
}

/**
 * Create a test admin user
 */
export async function createTestAdmin(overrides?: Partial<typeof TEST_USERS.admin>) {
    const user = { ...TEST_USERS.admin, ...overrides };
    const passwordHash = await bcrypt.hash(user.password, 10);

    try {
        const adminUser = await prisma.user.create({
            data: {
                email: user.email,
                passwordHash,
                firstName: user.firstName,
                lastName: user.lastName,
                role: 'ADMIN',
                isVerified: true,
                createdAt: new Date(),
            },
        });

        return { user: adminUser };
    } catch (error: any) {
        if (error.code === 'P2002') {
            const existingUser = await prisma.user.findUnique({
                where: { email: user.email },
            });
            if (existingUser) {
                return { user: existingUser };
            }
        }
        throw error;
    }
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
 * Login as admin via UI
 */
export async function loginAsAdmin(page: Page, credentials = TEST_USERS.admin) {
    await page.goto('/ops/login');
    await page.waitForLoadState('networkidle');

    // Fill in login form
    await page.fill('input[name="email"], input[type="email"]', credentials.email);
    await page.fill('input[name="password"], input[type="password"]', credentials.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to ops dashboard
    await page.waitForURL(/\/ops/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
}

/**
 * Setup authenticated session via API (faster than UI login)
 */
export async function setupAuthenticatedSession(page: Page, userEmail: string) {
    // Get user from database
    const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: { ownedStores: true },
    });

    if (!user) {
        throw new Error(`User not found: ${userEmail}`);
    }

    // Create session token
    const sessionToken = `test-session-${Date.now()}-${Math.random()}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Create session in database
    await prisma.session.create({
        data: {
            userId: user.id,
            token: sessionToken,
            expiresAt,
            createdAt: new Date(),
        },
    });

    // Set session cookie
    await page.context().addCookies([
        {
            name: 'next-auth.session-token',
            value: sessionToken,
            domain: 'localhost',
            path: '/',
            expires: Math.floor(expiresAt.getTime() / 1000),
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
        },
    ]);

    return { user, sessionToken };
}

/**
 * Cleanup test users
 */
export async function cleanupTestUsers() {
    const testEmails = Object.values(TEST_USERS).map((u) => u.email);

    // Delete sessions first
    await prisma.session.deleteMany({
        where: {
            user: {
                email: { in: testEmails },
            },
        },
    });

    // Delete stores
    await prisma.store.deleteMany({
        where: {
            owner: {
                email: { in: testEmails },
            },
        },
    });

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
 * Create authenticated admin context (use in beforeEach)
 */
export async function createAuthenticatedAdminContext(page: Page) {
    // Create test admin if doesn't exist
    const { user } = await createTestAdmin();

    // Setup session
    await setupAuthenticatedSession(page, user.email);

    return { user };
}

/**
 * Verify user is authenticated
 */
export async function verifyAuthenticated(page: Page) {
    // Check if session cookie exists
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(
        (c) => c.name === 'next-auth.session-token' || c.name === '__Secure-next-auth.session-token'
    );

    return !!sessionCookie;
}

/**
 * Logout user
 */
export async function logout(page: Page) {
    await page.goto('/api/auth/signout');
    await page.waitForLoadState('networkidle');
}
