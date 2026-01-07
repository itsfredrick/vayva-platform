import { auth } from "./auth";
import { headers } from "next/headers";

/**
 * BRIDGE TO NATIVE BETTER AUTH
 * Maintains the 'authServer' export name but uses our custom configuration.
 */
export const authServer = {
    /**
     * Replicates the getSession behavior expected by session.ts
     */
    getSession: async () => {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        // Neon Auth expected { data: { user, session } }
        return {
            data: session
        };
    },

    // Proxy other api methods if needed
    api: auth.api
};
