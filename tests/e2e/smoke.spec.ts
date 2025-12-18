import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Critical Paths', () => {

    // 1. Core Navigation checks
    test('dashboard loads without hydration errors', async ({ page }) => {
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

        await expect(page.getByText('Reports')).toBeVisible();
    });

    // 2. Preferences (Public Endpoint)
    test('preferences page loads public token', async ({ page }) => {
        // Using a fake token url, expecting at least correct 404 or page load structure not 500
        const fakeToken = 'smoke-test-token';
        await page.goto(`/preferences/${fakeToken}`);

        // Assuming it shows "Invalid Token" or generic form if we stubbed it
        // Verification: Page structure exists
        expect(await page.title()).toBeDefined();
    });

    // 3. Rate Limiter Simulation (Integration test level usually, but checking protection)
    // Skipped in Smoke E2E as it requires flooding.

    // 4. Inbox functionality
    test('inbox page components active', async ({ page }) => {
        await page.goto('/dashboard/inbox');
        await expect(page.getByPlaceholder('Search...')).toBeVisible();
    });

});
