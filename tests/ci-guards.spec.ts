
import { test, expect } from '@playwright/test';

// 11.1 Navigation Freeze Test
// This ensures that the navigation structure remains EXACTLY as defined in the master prompt.
// CI should fail if any new items are added without approval.
test('Critical: Navigation Structure Lock', async ({ page }) => {
    await page.goto('/admin/dashboard');

    const navItems = await page.locator('nav > a').allInnerTexts();

    // Strict list of allowed items
    const ALLOWED_NAV = [
        'Overview',
        'Wallet',
        'WhatsApp Agent',
        'Products/Services',
        'Orders/Bookings',
        'Customers',
        'Control Center' // This might be separated visually, but must exist
    ];

    // Check exact match (ignoring icons, just text)
    // Logic: Ensure every item in nav is in ALLOWED and ALLOWED has all items.
    expect(navItems.length).toBe(ALLOWED_NAV.length);
    ALLOWED_NAV.forEach(item => {
        expect(navItems).toContain(item);
    });
});

// 11.2 Route Contract Test
test('Critical: Route Availability', async ({ page }) => {
    const routes = [
        '/admin/dashboard',
        '/admin/wallet',
        '/admin/wa-agent',
        '/admin/products',
        '/admin/orders',
        '/admin/customers',
        '/admin/control-center'
    ];

    for (const route of routes) {
        const response = await page.goto(route);
        expect(response?.status()).toBe(200);
    }
});

// 11.3 Wallet E2E Flow
test('Wallet: Withdrawal Journey', async ({ page }) => {
    await page.goto('/admin/wallet');

    // Open Modal
    await page.getByText('Withdraw Funds').click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Step 1: Eligibility Check (Mocked to Pass)
    await expect(page.getByText('Available Balance')).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 2: Amount Entry
    await page.getByPlaceholder('0.00').fill('5000');
    await page.getByRole('button', { name: 'Review' }).click();

    // Step 3: confirmation
    await expect(page.getByText('Service Fee')).toBeVisible();
    await page.getByRole('button', { name: 'Confirm Withdrawal' }).click();

    // Success State (Check for toast or update)
    await expect(page.getByRole('dialog')).not.toBeVisible();
});
