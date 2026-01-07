import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

/**
 * BRIDGE TO NATIVE BETTER AUTH CLIENT
 * Replaces Neon JS Auth with Better Auth Client.
 */
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    plugins: [emailOTPClient()],
});

// For compatibility with code importing 'auth'
export const auth = {
    adapter: authClient
};
