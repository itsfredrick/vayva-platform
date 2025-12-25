import { test, expect } from '@playwright/test';
import { createAuthenticatedMerchantContext } from '../helpers/auth';

test.describe('Onboarding Smoke Test', () => {
    test('onboarding welcome page loads', async ({ page }) => {
        await createAuthenticatedMerchantContext(page);
        await page.goto('/onboarding');

        // Smoke Test: Verify Page Loads content (Heading or identifiable text)
        await expect(page.getByText(/Welcome/i).first()).toBeVisible();
    });
});
