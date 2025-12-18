import { test, expect } from '@playwright/test';

// Constants for deterministic test user
const TEST_USER = {
    name: 'Demo Merchant',
    email: 'demo+e2e@vayva.test',
    password: 'TestPass123!',
    otp: '123456',
    storeName: 'Golden Path Store',
    storeSlug: 'golden-path-store'
};

test.describe('Golden Path: Merchant Journey', () => {

    test('Full Walkthrough: Landing -> Signup -> Onboarding -> Dashboard -> Signout', async ({ page }) => {

        // 1. Landing Page
        await page.goto('/');
        await expect(page).toHaveTitle(/Vayva/);
        await expect(page.getByTestId('landing-get-started')).toBeVisible();

        // Click Get Started
        await page.getByTestId('landing-get-started').click();
        await expect(page).toHaveURL(/\/signup/);

        // 2. Signup Flow
        // Fill details
        await page.getByTestId('auth-signup-name').fill(TEST_USER.name);
        await page.getByTestId('auth-signup-email').fill(TEST_USER.email);
        // Note: Phone input usually has complicated selectors, try generic input or role if testid not on input
        await page.getByPlaceholder('+234 8012345678').fill('8012345678');
        await page.getByTestId('auth-signup-password').fill(TEST_USER.password);

        // Select Plan (Starter is default, maybe ensure it's selected or select it)
        await page.getByText('Starter').click(); // Assuming text visible

        // Agree to terms (checkbox)
        await page.locator('input[type="checkbox"]').check();

        // Submit
        await page.getByTestId('auth-signup-submit').click();

        // 3. Verify Flow
        await expect(page).toHaveURL(/\/verify/);

        // Check for mock OTP hint or just enter valid OTP
        // Our backdoor specific OTP is 123456 for e2e emails
        const otpInputContainer = page.getByTestId('auth-verify-otp-container');
        await expect(otpInputContainer).toBeVisible();

        // Simulate typing 123456
        // Since OTPInput is multiple inputs, we might need to fill them one by one or paste
        // Assuming the component handles pasting or we click first and type
        await page.getByTestId('auth-verify-otp-container').locator('input').first().click();
        await page.keyboard.type(TEST_USER.otp, { delay: 100 });

        // Wait for verify button enablement or auto submit
        await expect(page.getByTestId('auth-verify-submit')).toBeEnabled();
        await page.getByTestId('auth-verify-submit').click();

        // 4. Onboarding Flow
        // Expect redirection to /onboarding or /onboarding/welcome
        await expect(page).toHaveURL(/\/onboarding/); // Partial match

        // Welcome Step
        // Wait for animation
        await expect(page.getByText('Welcome')).toBeVisible();
        await page.getByTestId('onboarding-welcome-continue').click();

        // Identity Step
        // (Assuming next step is Identity if we didn't skip it, or strict order)
        // If our mock user state is fresh, it starts at default logic.
        // Let's assume manual navigation or strict flow.
        // Inspect URL to see step

        // Assuming next is Identity or Store. If Identity, fill it.
        // If logic is dynamic, check URL.
        if (page.url().includes('identity')) {
            // Fill Identity
            await page.getByLabel('Date of Birth').fill('1990-01-01');
            await page.getByLabel('NIN').fill('12345678901');
            await page.getByText('Continue').click();
        }

        // Store Details Step
        await expect(page).toHaveURL(/\/onboarding\/store/);
        await page.getByTestId('onboarding-store-name').fill(TEST_USER.storeName);
        // Check if slug auto-filled
        // Select Category
        await page.locator('select').first().selectOption('fashion');
        await page.getByPlaceholder('e.g. 12 Adetokunbo Ademola St').fill('123 Test St');
        await page.getByPlaceholder('e.g. Victoria Island').fill('Lagos');
        // Save
        await page.getByTestId('onboarding-store-submit').click();

        // Branding Step -> Delivery -> Templates
        // We might skip extensive checks here for speed, just fill required
        await expect(page).toHaveURL(/\/onboarding\/brand/);
        await page.getByText('Continue').click(); // Skip branding

        await expect(page).toHaveURL(/\/onboarding\/delivery/);
        await page.getByText('Continue').click(); // Skip delivery

        // Templates Step
        await expect(page).toHaveURL(/\/onboarding\/templates/);
        // Select Vayya Storefront (default)
        // await page.getByTestId('template-card-vayya-storefront').click(); // Already selected default
        await page.getByTestId('onboarding-template-submit').click();

        // Products Step -> Skip
        await expect(page).toHaveURL(/\/onboarding\/products/);
        await page.getByText('Skip for now').click();

        // Review Step
        await expect(page).toHaveURL(/\/onboarding\/review/);
        await page.getByText('Launch My Store').click(); // or 'Go to Dashboard'

        // 5. Dashboard
        await expect(page).toHaveURL(/\/admin\/dashboard/);

        // Check for greeting
        await expect(page.getByText(/Demo/)).toBeVisible(); // First name

        // Check Store Card
        // (Instrumented visit button)
        await expect(page.getByTestId('dashboard-visit-store')).toBeVisible();

        // 6. Wallet Gating Check (KYC Pending)
        await page.goto('/admin/wallet');
        await expect(page.getByText('Identity Verification Required')).toBeVisible();

        // 7. Account & Signout
        // Open menu
        await page.getByTestId('dashboard-avatar-menu').click();
        await expect(page.getByTestId('dashboard-signout')).toBeVisible();

        // Sign out
        await page.getByTestId('dashboard-signout').click();

        // 8. Verify Redirect
        await expect(page).toHaveURL(/\/signin/);

        // Verify Session Cleared (Try to go back to dashboard)
        await page.goto('/admin/dashboard');
        await expect(page).toHaveURL(/\/signin/); // Should redirect back to signin
    });

});

