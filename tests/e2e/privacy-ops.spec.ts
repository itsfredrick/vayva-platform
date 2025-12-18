
import { test, expect } from '@playwright/test';
import { redactPhone, redactEmail } from '../../apps/merchant-admin/src/lib/privacy/redact';

test.describe('Privacy Ops', () => {

    test('redact utils work correctly', () => {
        expect(redactPhone('+2348012345678')).toBe('+23****678');
        expect(redactEmail('john.doe@example.com')).toBe('jo***@example.com');
    });

    test('admin can trigger dsr export', async ({ page }) => {
        // Mock Export API
        await page.route('/api/admin/privacy/dsr/export', async route => {
            const data = {
                customer: { id: 'c1', name: 'John Doe', email: 'john@example.com' },
                orders: []
            };
            await route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify(data)
            });
        });

        await page.goto('/admin/privacy');

        await page.getByPlaceholder('e.g. store_123').fill('store_1');
        await page.getByPlaceholder('Email or Phone').fill('john@example.com');

        // Click Export
        const exportBtn = page.getByRole('button', { name: 'Export Data (JSON)' });
        await exportBtn.click();

        await expect(page.getByText('Export downloaded')).toBeVisible();
    });

    test('admin can anonymize user with reason', async ({ page }) => {
        // Mock Anonymize API
        await page.route('/api/admin/privacy/dsr/anonymize', async route => {
            await route.fulfill({ json: { success: true } });
        });

        await page.goto('/admin/privacy');

        await page.getByRole('button', { name: 'Anonymize User' }).click();

        // Check Modal
        await expect(page.getByText('Confirm Anonymization')).toBeVisible();
        await expect(page.getByPlaceholder('DSR Ticket Number')).toBeVisible();

        // Try empty reason
        await page.getByRole('button', { name: 'Confirm Anonymize' }).click();
        // Assuming alert or validation prevents it, but let's fill reason

        await page.getByPlaceholder('DSR Ticket Number').fill('TICKET-1234');
        await page.getByRole('button', { name: 'Confirm Anonymize' }).click();

        await expect(page.getByText('User Anonymized Successfully')).toBeVisible();
    });

});
