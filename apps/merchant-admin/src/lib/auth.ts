
import { NextRequest } from 'next/server';

// MOCK AUTH for Development
// Since NextAuth is not set up, we mock the session retrieval.
// In production, this should parse the JWT from headers or cookies.

export const authOptions = {}; // Placeholder

export async function getServerSession(options?: any) {
    // Return a mock user session with a fixed storeId for development/testing
    // This allows us to verify Readiness/Publish logic without full Auth stack.
    return {
        user: {
            id: 'user_mock_1',
            email: 'demo@vayva.ng',
            name: 'Demo Merchant',
            storeId: 'store_mock_1',
            isAdmin: true
        }
    };
}
