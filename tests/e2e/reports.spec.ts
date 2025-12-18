import { test, expect } from '@playwright/test';

test.describe('Reports & Reconciliation', () => {

    test('navigate to reports dashboard', async ({ page }) => {
        await page.goto('/dashboard/reports');
        await expect(page.getByText('Reports & Reconciliation')).toBeVisible();
        await expect(page.getByText('Financial truth for your store')).toBeVisible();
    });

    test('verify summary cards layout', async ({ page }) => {
        await page.goto('/dashboard/reports');

        // Check for card labels
        await expect(page.getByText('GROSS SALES')).toBeVisible();
        await expect(page.getByText('NET SALES')).toBeVisible();
        await expect(page.getByText('DELIVERY SUCCESS')).toBeVisible();
    });

    test('reconciliation table headers', async ({ page }) => {
        await page.goto('/dashboard/reports');

        await expect(page.getByRole('columnheader', { name: 'Date' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Order Ref' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Discrepancy' })).toBeVisible();
    });

    // Check export button existence
    test('export button verification', async ({ page }) => {
        await page.goto('/dashboard/reports');
        const exportBtn = page.getByText('Export');
        await expect(exportBtn).toBeVisible();
    });

});
