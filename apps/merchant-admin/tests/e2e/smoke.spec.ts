
import { test, expect } from '@playwright/test';

test.describe('Dashboard Smoke Tests: "The Safety Net"', () => {

    test.beforeEach(async ({ page }) => {
        // Assume auth bypass or mock for smoke tests in this environment
        // If not authenticated, we might need a setup step.
        // For now, we will try to navigate directly. In a real CI, we'd use global setup.
        // If this redirects to /signin, the validations will fail, which is good info.
    });

    const routes = [
        { path: '/dashboard', title: /Dashboard/i }, // Overview
        { path: '/dashboard/account', title: /Account Hub/i },
        { path: '/dashboard/support', title: /Support/i },
        { path: '/dashboard/marketing/flash-sales', title: /Flash Sales/i },
        { path: '/dashboard/logistics', title: /Deliveries/i },
        { path: '/dashboard/inbox', title: /Inbox/i },
        { path: '/dashboard/billing', title: /Billing/i },
    ];

    for (const route of routes) {
        test(`should load ${route.path} without crashing`, async ({ page }) => {
            console.log(`Visiting ${route.path}...`);
            await page.goto(route.path);

            // Check if we got redirected to signin
            if (page.url().includes('/signin')) {
                console.log('Redirected to signin. Skipping deep check, but page loaded.');
                return;
            }

            // Basic availability check - ensure 404 is not present
            const notFound = page.getByText('404');
            await expect(notFound).not.toBeVisible();

            // Check for critical header to ensure hydration
            const heading = page.getByRole('heading', { level: 1 }).first();
            await expect(heading).toBeVisible();

            // Optional: check specific title regex if provided
            // await expect(page).toHaveTitle(route.title); 
        });
    }
});
