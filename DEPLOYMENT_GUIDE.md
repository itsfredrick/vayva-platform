# 🚀 Vayva Platform Deployment Guide

This guide covers how to deploy the Vayva platform (Merchant Admin & Storefront) to Vercel and prepare your codebase for GitHub.

## 📦 1. Pre-Deployment Check
Your codebase has been validated and is ready for deployment.
- **Linting:** Passed ✅
- **Build:** Passed (Merchant Admin & Storefront) ✅
- **Tests:** E2E Tests Passed ✅

## ☁️ 2. Vercel Deployment

You will need to deploy two separate projects on Vercel: **Merchant Admin** (the dashboard) and **Storefront** (the customer-facing site).

### Project A: Merchant Admin (Dashboard)
This is the main application where merchants manage their stores.

1. **Import Repository**: Select your `vayva` repository in Vercel.
2. **Framework Preset**: `Next.js`
3. **Root Directory**: `apps/merchant-admin` (Important!)
4. **Build Command**: Leave as default (`turbo run build` is handled automatically if Vercel detects Monorepo, or specifically `cd ../.. && turbo run build --filter=merchant-admin`)
   - *Recommendation:* Vercel's default "Next.js" output settings usually work. If configured via `vercel.json` (which is present), it should auto-detect.

5. **Environment Variables**:
   Add the following variables in the Vercel Project Settings:

   | Variable | Value / Description |
   |----------|---------------------|
   | `DATABASE_URL` | Your production PostgreSQL URL (e.g., from Neon/Supabase) |
   | `NEXT_PUBLIC_APP_URL` | The domain of this app (e.g., `https://dashboard.vayva.com`) |
   | `NEXTAUTH_URL` | Same as `NEXT_PUBLIC_APP_URL` |
   | `NEXTAUTH_SECRET` | A secure random string (generate with `openssl rand -base64 32`) |
   | `RESEND_API_KEY` | Your Resend API Key |
   | `GROQ_API_KEY` | Your Groq AI API Key |
   | `PAYSTACK_PUBLIC_KEY` | Your Paystack Live Public Key |
   | `PAYSTACK_SECRET_KEY` | Your Paystack Live Secret Key |
   | `BLOB_READ_WRITE_TOKEN`| (Optional) If using Vercel Blob for uploads |

### Project B: Storefront (Optional)
This is the customized storefront for customers.

1. **Import Repository**: Select the same `vayva` repository again.
2. **Root Directory**: `apps/storefront`
3. **Environment Variables**:
   | Variable | Value / Description |
   |----------|---------------------|
   | `DATABASE_URL` | Same as Merchant Admin |
   | `NEXT_PUBLIC_API_URL` | The URL of your Merchant Admin (e.g., `https://dashboard.vayva.com`) |

---

## 🛠️ 3. GitHub Push

Your project structure is clean and secrets are ignored.

1. **Review Changes**:
   ```bash
   git status
   ```

2. **Stage & Commit**:
   ```bash
   git add .
   git commit -m "chore: prepare platform for deployment (fix configs, verify builds)"
   ```

3. **Push**:
   ```bash
   git push origin main
   ```

## 📝 4. Post-Deployment

1. **Database Migration**:
   After connecting Vercel to your production database, ensure you run migrations:
   - You may need to run this locally pointing to prod DB, or add a `postinstall` script.
   - Command: `DATABASE_URL='prod_url' pnpm db:migrate`

2. **Verify Setup**:
   - Log in to the Merchant Admin.
   - Configure a store.
   - Visit the Storefront.

---
**Status:** ✅ Ready for Launch
