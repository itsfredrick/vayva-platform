import { test, expect } from '@playwright/test';

const ROUTES = {
    home: '/',
    templates: '/templates',
    pricing: '/pricing',
    terms: '/legal/terms',
    privacy: '/legal/privacy',
    signup: '/signup',
    login: '/login',
} as const;

// Use Playwright baseURL if configured; fall back for local dev.
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3005';
const abs = (path: string) => new URL(path, BASE_URL).toString();

test.describe('Site-Wide Navigation', () => {
    test('should navigate via global header', async ({ page }) => {
        await page.goto(abs(ROUTES.home));

        // Scope to header only (avoid footer/body collisions)
        const header = page.locator('header');

        await header.getByRole('link', { name: /^Templates$/ }).click();
        await expect(page).toHaveURL(abs(ROUTES.templates));

        await page.goto(abs(ROUTES.home));
        await header.getByRole('link', { name: /^Pricing$/ }).click();
        await expect(page).toHaveURL(abs(ROUTES.pricing));
    });

    test('should verify Header CTAs', async ({ page }) => {
        await page.goto(abs(ROUTES.home));
        const header = page.locator('header');

        const loginLink = header.getByRole('link', { name: /^Log in$/ });
        await expect(loginLink).toBeVisible();
        await expect(loginLink).toHaveAttribute('href', ROUTES.login);

        const getStartedLink = header.getByRole('link', { name: /^Get Started$/ });
        await expect(getStartedLink).toBeVisible();
        await expect(getStartedLink).toHaveAttribute('href', ROUTES.signup);

        // FAILSAFE: removed items must not exist anywhere in header
        await expect(header.getByText(/Start Free/i)).toHaveCount(0);
        await expect(header.getByText(/Book a Demo/i)).toHaveCount(0);
    });

    test('should verify Footer Links', async ({ page }) => {
        await page.goto(abs(ROUTES.home));
        const footer = page.locator('footer');

        await expect(footer.getByText(/Store Directory/i)).toHaveCount(0);
        await expect(footer.getByText(/Book a Demo/i)).toHaveCount(0);
    });

    test('should verify Landing Page CTAs', async ({ page }) => {
        await page.goto(abs(ROUTES.home));

        // Scope to main content (excludes header CTAs)
        const main = page.locator('main');

        // Hero CTA: first "Get Started" inside main
        const heroGetStarted = main.getByRole('link', { name: /^Get Started$/ }).first();
        await expect(heroGetStarted).toBeVisible();
        await expect(heroGetStarted).toHaveAttribute('href', ROUTES.signup);

        // Final CTA: pick the LAST "Get Started" inside main (more stable than section.last())
        const allMainGetStarted = main.getByRole('link', { name: /^Get Started$/ });
        const count = await allMainGetStarted.count();
        expect(count).toBeGreaterThan(0);

        const finalGetStarted = allMainGetStarted.nth(count - 1);
        await expect(finalGetStarted).toBeVisible();

        // FAILSAFE: Book a Demo must not exist anywhere on landing
        await expect(page.getByText(/Book a Demo/i)).toHaveCount(0);
    });
});
