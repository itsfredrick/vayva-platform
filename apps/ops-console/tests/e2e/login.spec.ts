
import { test, expect } from '@playwright/test';

test.describe('Ops Console Authentication', () => {

    test('should redirect unauthenticated users to login', async ({ page }) => {
        await page.goto('/ops');
        await expect(page).toHaveURL(/\/ops\/login/);
        await expect(page.getByRole('heading', { name: /Ops Portal/i })).toBeVisible();
    });

    test('should load login page elements', async ({ page }) => {
        await page.goto('/ops/login');
        // Ops login usually asks for Email and Password
        await expect(page.getByPlaceholder('ops@vayva.ng')).toBeVisible();
        await expect(page.getByPlaceholder('••••••••')).toBeVisible();
        await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
    });

});
