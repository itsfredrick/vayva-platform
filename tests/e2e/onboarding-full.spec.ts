import { test, expect } from '@playwright/test';

test.describe('Onboarding Full Flow', () => {
    test('complete onboarding from step 1 to store live', async ({ page }) => {
        // Seed: Authenticated merchant at onboarding step 1
        // (In real test, use test fixtures to create merchant + session)

        // Step 1: Welcome
        await page.goto('/onboarding?step=welcome');
        await expect(page.locator('h1')).toContainText("Let's set up your store");
        await page.click('button:has-text("Get Started")');

        // Step 2: Identity
        await expect(page).toHaveURL(/step=identity/);
        await page.fill('[name="store-name"]', 'Test Store');
        await page.fill('[name="store-slug"]', 'test-store');
        await page.selectOption('[name="category"]', 'fashion');
        await page.click('[data-testid="onboarding-continue"]');

        // Step 3: Template
        await expect(page).toHaveURL(/step=template/);
        await page.click('[data-testid="template-vayva-default"]');
        await page.click('[data-testid="onboarding-continue"]');

        // Step 4: Products
        await expect(page).toHaveURL(/step=products/);
        await page.fill('[name="product-name-0"]', 'Test Product');
        await page.fill('[name="product-price-0"]', '1000');
        await page.click('[data-testid="onboarding-continue"]');

        // Step 5: Payments
        await expect(page).toHaveURL(/step=payments/);
        await page.click('button:has-text("Set up later")');
        await page.click('[data-testid="onboarding-continue"]');

        // Step 6: Delivery
        await expect(page).toHaveURL(/step=delivery/);
        await page.click('text=Self-dispatch');
        await page.fill('[name="flat-fee"]', '500');
        await page.click('[data-testid="onboarding-continue"]');

        // Step 7: Policies
        await expect(page).toHaveURL(/step=policies/);
        await expect(page.locator('h1')).toContainText('Store policies');

        // Verify toggle is ON by default
        const toggle = page.locator('[data-testid="generate-policies-toggle"]');
        await expect(toggle).toBeChecked();

        // Publish policies
        await page.click('button:has-text("Publish policies")');

        // Should redirect to live screen
        await expect(page).toHaveURL('/onboarding/live', { timeout: 10000 });

        // Verify live screen
        await expect(page.locator('h1')).toContainText('Your store is live');
        await expect(page.locator('text=vayva.ng/test-store')).toBeVisible();

        // Verify action buttons
        await expect(page.locator('button:has-text("Open my store")')).toBeVisible();
        await expect(page.locator('button:has-text("Share on WhatsApp")')).toBeVisible();
        await expect(page.locator('text=Go to Dashboard')).toBeVisible();

        // Verify forbidden text NOT present
        await expect(page.locator('text=Book a Demo')).not.toBeVisible();
        await expect(page.locator('text=Start Free')).not.toBeVisible();

        // Test "Go to Dashboard" works
        await page.click('text=Go to Dashboard');
        await expect(page).toHaveURL('/dashboard');
    });

    test('resume onboarding from mid-point', async ({ page }) => {
        // Seed: Merchant with onboarding at step "delivery"

        await page.goto('/onboarding');

        // Should resume at delivery step
        await expect(page).toHaveURL(/step=delivery/);

        // Previous steps should show as completed in progress rail
        await expect(page.locator('[data-step="welcome"]')).toHaveClass(/completed/);
        await expect(page.locator('[data-step="identity"]')).toHaveClass(/completed/);
    });
});
