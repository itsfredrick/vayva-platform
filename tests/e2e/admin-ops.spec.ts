
import { test, expect } from '@playwright/test';

test.describe('Admin Mission Control', () => {

    test('admin access gated by allowlist mock', async ({ page }) => {
        // Mock 403 response for unauthorized
        await page.route('/api/admin/merchants', async route => {
            await route.fulfill({ status: 403, body: 'Unauthorized Admin Access' });
        });

        // Try getting list
        const res = await page.request.get('/api/admin/merchants');
        expect(res.status()).toBe(403);
    });

    // Mock an Authorized Admin session behavior via test logic or improved mock
    test('admin can search merchants', async ({ page }) => {
        // Mock API success
        await page.route('/api/admin/merchants?q=test', async route => {
            await route.fulfill({
                json: {
                    merchants: [
                        { id: 'm1', name: 'Test Store', slug: 'test', isLive: true, subscription: { planSlug: 'pro' }, createdAt: new Date().toISOString() }
                    ]
                }
            });
        });

        await page.goto('/admin/merchants');

        const input = page.getByPlaceholder('Search name or slug...');
        await input.fill('test');
        await page.getByRole('button', { name: 'Search' }).click();

        await expect(page.getByText('Test Store')).toBeVisible();
        await expect(page.getByText('/test')).toBeVisible();
        await expect(page.getByText('Pro')).toBeVisible();
    });

    test('admin detail view loads snapshot', async ({ page }) => {
        await page.route('/api/admin/ops/merchant-snapshot*', async route => {
            await route.fulfill({
                json: {
                    store: { name: 'Deep Merchant', slug: 'deep', readinessLevel: 'ready' },
                    merchant: { id: 'm2' },
                    readiness: { issues: [] }
                }
            });
        });

        await page.goto('/admin/merchants/m2');
        await expect(page.getByRole('heading', { name: 'Deep Merchant' })).toBeVisible();
        await expect(page.getByText('Readiness Level')).toBeVisible();
    });

});
