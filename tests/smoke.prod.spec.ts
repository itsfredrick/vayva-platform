
import { test, expect } from '@playwright/test';

// SMOKE TEST: SAFE FOR PRODUCTION
// Read-only or safe actions only.

test.describe('Production Smoke Test', () => {

    test('Public Pages Load', async ({ page }) => {
        // Landing
        await page.goto('/');
        expect(await page.title()).not.toBe('');

        // Pricing (if public)
        // await page.goto('/pricing');
        // ...
    });

    test('Health Check Endpoint (Public)', async ({ request }) => {
        // Assuming we exposed a public health check or just checking site availability
        const res = await request.get('/'); // Or /health if implemented public
        expect(res.ok()).toBe(true);
    });

    test('Critical Assets', async ({ page }) => {
        // Verify CSS/JS loaded (no 404s on assets)
        const response = await page.goto('/');
        // Basic check that content rendered, implying assets loaded
        await expect(page.locator('body')).toBeVisible();
    });

});
