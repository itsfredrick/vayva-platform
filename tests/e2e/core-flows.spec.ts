import { test, expect } from '@playwright/test';

test.describe('Core E2E Flows', () => {

    test.describe('Merchant Onboarding', () => {
        test('complete signup and onboarding wizard', async ({ page }) => {
            await page.goto('/signup');
            await expect(page).toHaveURL(/signup/);

            // Fill signup form
            await page.fill('[data-testid="email-input"]', 'test@example.com');
            await page.fill('[data-testid="password-input"]', 'SecurePass123!');
            await page.click('[data-testid="signup-button"]');

            // Should redirect to onboarding
            await expect(page).toHaveURL(/onboarding/);
        });

        test('complete onboarding steps', async ({ page }) => {
            // Authenticated merchant
            await page.goto('/onboarding/business');
            await expect(page.locator('h1')).toContainText('Business');
        });
    });

    test.describe('Product & Checkout Flow', () => {
        test('create product and checkout', async ({ page }) => {
            // Create product
            await page.goto('/admin/products/new');
            await page.fill('[data-testid="product-name"]', 'Test Product');
            await page.fill('[data-testid="product-price"]', '5000');
            await page.click('[data-testid="save-product"]');

            // Verify product created
            await expect(page).toHaveURL(/admin\/products/);
        });

        test('customer checkout flow', async ({ page }) => {
            await page.goto('/products/test-product');
            await page.click('[data-testid="add-to-cart"]');
            await page.goto('/checkout');

            // Fill checkout form
            await page.fill('[data-testid="customer-phone"]', '+2348012345678');
            await page.fill('[data-testid="customer-address"]', 'Lagos, Nigeria');
            await page.click('[data-testid="place-order"]');

            // Should show confirmation
            await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
        });
    });

    test.describe('Order Management', () => {
        test('view and manage orders', async ({ page }) => {
            await page.goto('/admin/orders');
            await expect(page.locator('h1')).toContainText('Orders');
        });

        test('dispatch order (self-dispatch)', async ({ page }) => {
            await page.goto('/admin/orders/test-order-id');
            await page.click('[data-testid="create-dispatch"]');
            await page.selectOption('[data-testid="dispatch-method"]', 'self');
            await page.click('[data-testid="confirm-dispatch"]');

            await expect(page.locator('[data-testid="dispatch-status"]')).toContainText('Dispatched');
        });
    });

    test.describe('WhatsApp Inbox', () => {
        test('view inbox and conversations', async ({ page }) => {
            await page.goto('/admin/inbox');
            await expect(page.locator('h1')).toContainText('Inbox');
        });

        test('send message with approval', async ({ page }) => {
            await page.goto('/admin/inbox/test-conversation');
            await page.fill('[data-testid="message-input"]', 'Thank you for your order!');
            await page.click('[data-testid="send-message"]');
        });
    });

    test.describe('Refund Flow', () => {
        test('request and approve refund', async ({ page }) => {
            await page.goto('/admin/orders/test-order-id');
            await page.click('[data-testid="request-refund"]');
            await page.fill('[data-testid="refund-reason"]', 'Customer request');
            await page.click('[data-testid="submit-refund"]');

            // Should show pending approval
            await expect(page.locator('[data-testid="refund-status"]')).toContainText('Pending');
        });
    });

    test.describe('Campaign Flow', () => {
        test('create and send campaign', async ({ page }) => {
            await page.goto('/admin/marketing/campaigns/new');
            await page.fill('[data-testid="campaign-name"]', 'Test Campaign');
            await page.click('[data-testid="save-draft"]');

            await expect(page.locator('[data-testid="campaign-status"]')).toContainText('Draft');
        });
    });

    test.describe('PWA Features', () => {
        test('PWA is installable', async ({ page }) => {
            await page.goto('/admin');
            const manifest = await page.evaluate(() => {
                const link = document.querySelector('link[rel="manifest"]');
                return link ? link.getAttribute('href') : null;
            });
            expect(manifest).toBeTruthy();
        });
    });
});

test.describe('Nigeria Scenarios', () => {
    test('bank transfer mark-paid flow', async ({ page }) => {
        await page.goto('/admin/orders/pending-payment');
        await page.click('[data-testid="mark-paid"]');
        await page.fill('[data-testid="payment-reference"]', 'REF123456');
        await page.click('[data-testid="confirm-mark-paid"]');
    });

    test('COD order flow', async ({ page }) => {
        await page.goto('/checkout');
        await page.click('[data-testid="payment-cod"]');
        await page.click('[data-testid="place-order"]');
        await expect(page.locator('[data-testid="payment-method"]')).toContainText('Cash on Delivery');
    });
});
