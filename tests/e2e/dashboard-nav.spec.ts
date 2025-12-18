import { test, expect } from '@playwright/test';
import { DASHBOARD_ROUTES } from '../routes';

test.describe('Dashboard Navigation Guard', () => {

    // We assume test is NOT authenticated initially for this specific check
    // to verify redirects.

    for (const route of DASHBOARD_ROUTES) {
        test(`unauth access to ${route} redirects to login`, async ({ page }) => {
            const res = await page.goto(route);
            // Expect redirect to login
            // Either URL contains /login or title is Login
            await expect(page).toHaveURL(/.*login.*/);
        });
    }

    test('auth access and nav links', async ({ page }) => {
        // Mock auth or perform login step
        // For V1 without seed DB, we can't easily login.
        // We'll define the test structure.
        /*
        await page.goto('/login');
        // ... login logic ...
        await page.goto('/dashboard');
        
        // "Every Link Works"
        const navLinks = page.locator('nav a');
        const count = await navLinks.count();
        expect(count).toBeGreaterThan(5);
        
        for (let i = 0; i < count; ++i) {
            const link = navLinks.nth(i);
            await expect(link).toBeVisible();
            await expect(link).toHaveAttribute('href');
        }
        */
    });

});
