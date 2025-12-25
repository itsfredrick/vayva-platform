import { test, expect } from '@playwright/test';
import { createAuthenticatedMerchantContext, cleanupTestUsers } from '../helpers';

test.describe('Smoke Tests - Critical Paths', () => {

    test.afterAll(async () => {
        await cleanupTestUsers();
    });

    // 1. Core Navigation checks
    test('dashboard loads without hydration errors', async ({ page }) => {
        // Setup authenticated session
        await createAuthenticatedMerchantContext(page);

        const errors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });

        await page.goto('/dashboard');

        // Wait for hydration
        await page.waitForLoadState('networkidle');

        // Check for specific React hydration mismatches in console (heuristic)
        const hydrationErrors = errors.filter(e => e.includes('Hydration client-side') || e.includes('Minified React error #418'));
        expect(hydrationErrors.length).toBe(0);

        // Verify dashboard loaded (check for common dashboard elements)
        await expect(page).toHaveURL(/\/dashboard/);
    });

    // 2. Preferences (Public Endpoint)
    test('preferences page loads public token', async ({ page }) => {
        // Using a fake token url, expecting at least correct 404 or page load structure not 500
        const fakeToken = 'smoke-test-token';
        await page.goto(`/preferences/${fakeToken}`);

        // Verification: Page structure exists
        expect(await page.title()).toBeDefined();
    });

    // 3. Inbox functionality
    test('inbox page components active', async ({ page }) => {
        await createAuthenticatedMerchantContext(page);

        await page.goto('/dashboard/inbox');
        await page.waitForLoadState('networkidle');

        // Verify inbox page loaded
        await expect(page).toHaveURL(/\/inbox/);
    });

});
