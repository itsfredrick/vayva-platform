
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt'; // Assuming NextAuth for V1
// In real world, we might decode custom tokens or session cookies directly if NextAuth is mocked.
// For V1, we will trust a header x-tenant-id if in DEV/TEST, or session.

export interface TenantContext {
    userId: string;
    merchantId: string;
    storeId?: string;
    roles: string[];
}

export async function getTenantContext(req: NextRequest): Promise<TenantContext> {
    // 1. Try Session (Best Practice)
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // MOCK for Development/Integration Speed until Auth is 100% wired:
    // Check headers for test injection (ONLY IN TEST ENV)
    if (process.env.NODE_ENV === 'test' || process.env.VAYVA_Mock_Auth === 'true') {
        const mockMid = req.headers.get('x-mock-merchant-id');
        if (mockMid) {
            return {
                userId: req.headers.get('x-mock-user-id') || 'test_user',
                merchantId: mockMid,
                storeId: req.headers.get('x-mock-store-id') || undefined,
                roles: ['owner']
            };
        }
    }

    // Default Fallback / Safe Guard
    // In production, this MUST throw if no session found.
    // throw new Error("Unauthorized");

    // Logic for "Active Store" via Cookie
    const storeIdCookie = req.cookies.get('x-active-store-id')?.value;

    return {
        userId: 'stub_user_id', // Replace with real auth
        merchantId: 'stub_default_merchant', // Replace with real auth validation
        storeId: storeIdCookie,
        roles: ['admin'] // Replace
    };
}

export function requireMerchant(ctx: TenantContext) {
    if (!ctx.merchantId) throw new Error("Merchant Context Required");
    return ctx.merchantId;
}

export function requireStore(ctx: TenantContext) {
    if (!ctx.storeId) throw new Error("Store Context Required");
    return ctx.storeId;
}
