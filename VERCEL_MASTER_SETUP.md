# 🚀 Vercel Master Setup Guide

This guide contains everything you need to set up your Vayva Merchant Admin project on Vercel from scratch.

## 1️⃣ Create New Project

1.  **Dashboard**: Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** -> **"Project"**.
2.  **Import**: Select your `vayva` repository.
3.  **Project Name**: `vayva-admin` (or your preferred name).
4.  **Framework Preset**: Select **Next.js**.
5.  **Root Directory**: Click "Edit" and select `apps/merchant-admin`. **(Crucial Step!)**

## 2️⃣ Build Settings (Expand "Build and Output Settings")

*   **Build Command**: Leave default (empty/auto) or set to `cd ../.. && turbo run build --filter=merchant-admin` if auto-detection fails. (Default usually works).
*   **Output Directory**: Leave default (`.next`).
*   **Install Command**: Leave default.

## 3️⃣ Environment Variables (The Critical Part)

Copy and paste these exact values into the **Environment Variables** section.

### 🔴 Values You Must Update (Do not use localhost!)

| Key | Value Description |
|-----|-------------------|
| `DATABASE_URL` | **REQUIRED**. Connection string to your hosted PostgreSQL (e.g., Vercel Postgres, Neon, Supabase). **You cannot use localhost.** |
| `REDIS_URL` | **RECOMMENDED**. Connection string to hosted Redis (e.g., Vercel KV, Upstash). |
| `NEXT_PUBLIC_APP_URL` | `https://your-project-name.vercel.app` (Update this after deployment generates the URL) |
| `NEXTAUTH_URL` | Same as `NEXT_PUBLIC_APP_URL` |
| `NEXT_PUBLIC_API_URL` | `https://your-project-name.vercel.app/api` |
| `NEXTAUTH_SECRET` | Generate a new random secure string (e.g., `openssl rand -base64 32`). |
| `JWT_SECRET` | Same as `NEXTAUTH_SECRET` (used for custom sessions). |

### 🟢 Values to Copy (From your local setup)

These are your API keys. I have mapped your **Live** Paystack keys here for production.

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | `<YOUR_GROQ_API_KEY>` (Get from local .env) |
| `RESEND_API_KEY` | `<YOUR_RESEND_API_KEY>` (Get from local .env) |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` (Or your verified domain email) |
| `PAYSTACK_SECRET_KEY` | `<YOUR_PAYSTACK_LIVE_SECRET_KEY>` (Get from local .env as PAYSTACK_LIVE_SECRET_KEY) |
| `PAYSTACK_PUBLIC_KEY` | `<YOUR_PAYSTACK_LIVE_PUBLIC_KEY>` (Get from local .env as PAYSTACK_LIVE_PUBLIC_KEY) |
| `PAYMENT_MODE` | `live` |
| `NODE_ENV` | `production` |
| `AI_MODEL` | `llama-3.1-70b-versatile` |
| `ENABLE_AI_ASSISTANT` | `true` |
| `ENABLE_EMAIL_NOTIFICATIONS`| `true` |

### 🟡 Optional (Leave empty if not ready)

| Key | Value |
|-----|-------|
| `WHATSAPP_PHONE_NUMBER_ID` | (Empty) |
| `WHATSAPP_ACCESS_TOKEN` | (Empty) |
| `WHATSAPP_BUSINESS_ACCOUNT_ID`| (Empty) |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN`| `vayva_webhook_verify_token_2024` |

---

## 4️⃣ Deploy

1.  Click **Deploy**.
2.  Wait for the build to finish.
3.  **Important:** Once deployed, copy the generated domain (e.g., `vayva-admin.vercel.app`).
4.  Go to **Settings** -> **Environment Variables**.
5.  Update `NEXT_PUBLIC_APP_URL`, `NEXTAUTH_URL`, and `NEXT_PUBLIC_API_URL` with your actual domain.
6.  **Redeploy** (Go to Deployments -> ... -> Redeploy) for changes to take effect.
