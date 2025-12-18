
import { test, expect } from '@playwright/test';
import { formatMoneyNGN } from '../../apps/merchant-admin/src/lib/billing/formatters';

const GROWTH_PRICE_STR = '₦25,000';
const PRO_PRICE_STR = '₦40,000';

test.describe('Billing Logic & Pricing Guardrails', () => {

    test('formatter output is strictly correct', () => {
        // Double check formatter in test env (Redundant to unit, but good for E2E logic confirmation)
        expect(formatMoneyNGN(25000)).toBe(GROWTH_PRICE_STR);
    });

    test('billing page displays correct locked prices', async ({ page }) => {
        // Mock billing status API to ensure page loads with default
        await page.route('/api/merchant/billing/status', async route => {
            await route.fulfill({ json: { planSlug: 'growth', status: 'active', invoices: [] } });
        });

        await page.goto('/dashboard/billing');

        const growthPrice = page.getByText(GROWTH_PRICE_STR);
        const proPrice = page.getByText(PRO_PRICE_STR);

        await expect(growthPrice).toBeVisible();
        await expect(proPrice).toBeVisible();

        // Ensure no "fake" prices like $99
        await expect(page.getByText('$')).toBeHidden();
    });

    test('upgrade flow initiation', async ({ page }) => {
        await page.route('/api/merchant/billing/status', async route => {
            await route.fulfill({ json: { planSlug: 'growth', status: 'active', invoices: [] } });
        });

        await page.route('/api/merchant/billing/subscribe', async route => {
            // Return success with checkout url
            await route.fulfill({ json: { ok: true, checkout_url: 'https://example.com/checkout' } });
        });

        await page.goto('/dashboard/billing');

        // Click Pro "Switch to Pro"
        const switchBtn = page.getByRole('button', { name: 'Switch to Pro' });
        await switchBtn.click();

        // In real test we'd check usage of window.location, in Playwright maybe we check navigation event or console
    });

});
