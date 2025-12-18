# Vayva System Architecture

## Overview
Vayva is a multi-tenant e-commerce platform built as a monorepo using **TurboRepo**.

## Applications (`apps/`)

### 1. Merchant Admin (`apps/merchant-admin`) - Port 3000
- **Tech**: Next.js (App Router), Tailwind CSS.
- **Role**: The dashboard for merchants to manage products, orders, and settings.
- **Key Modules**: Onboarding, Products, WhatsApp Agent, Analytics.

### 2. Storefront (`apps/storefront`) - Port 3001
- **Tech**: Next.js (App Router).
- **Role**: The public-facing store for customers.
- **Routing**: Supports `?store={slug}` for dev and subdomain routing for prod.
- **State**: Uses `localStorage` for cart persistence.

### 3. Marketplace (`apps/marketplace`) - Port 3002
- **Tech**: Next.js.
- **Role**: A centralized "Jiji-style" marketplace (Currently "Coming Soon").
- **Features**: Waitlist, Category browsing.

### 4. Ops Console (`apps/ops-console`) - Port 3003
- **Tech**: Next.js.
- **Role**: Internal tool for Vayva staff.
- **Features**: KYC Approval, Dispute Resolution, Refund Management.

## Shared Packages (`packages/`)

- **`ui`**: Shared React components (Buttons, Inputs, Shells).
- **`theme`**: Brand definitions, colors, and Tailwind presets.
- **`schemas`**: Zod schemas shared between frontend and backend.
- **`api-client`**: Typed wrappers for API calls.

## Data Flow
Currently, the system uses **Mock Services** (`OpsService`, `StorefrontService`) to simulate backend behavior for rapid UI development. Real backend integration will replace these service layers.
