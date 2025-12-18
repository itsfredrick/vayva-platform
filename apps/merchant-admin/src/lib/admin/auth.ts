
import { getServerSession } from 'next-auth'; // Or mock
import { authOptions } from '@/lib/auth';

export const ADMIN_PERMISSIONS = {
    VIEW: 'admin.view',
    OVERRIDE: 'admin.override',
    BILLING_GRANT: 'admin.billing.grant',
    STORE_PUBLISH: 'admin.store.publish',
    WEBHOOK_REPLAY: 'admin.webhook.replay',
    JOBS_MANAGE: 'admin.jobs.manage',
};

export const ADMIN_ALLOWLIST = (process.env.ADMIN_ALLOWLIST || '').split(',').map(e => e.trim());

// For V1, simple check: is user email in allowlist?
export async function getAdminSession() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) return null;

    // Safety: If allowlist empty, no admins allowed (fail closed)
    if (ADMIN_ALLOWLIST.length === 0) return null;

    if (!ADMIN_ALLOWLIST.includes(session.user.email)) {
        // Also allow local dev override if needed, but safer to rely on env
        return null;
    }

    return {
        ...session,
        user: {
            ...session.user,
            isAdmin: true,
            permissions: Object.values(ADMIN_PERMISSIONS) // Super admin for V1 allowlisted users
        }
    };
}

export async function checkAdminAccess(permission?: string) {
    const session = await getAdminSession();
    if (!session) throw new Error('Unauthorized Admin Access');

    // In V1 everyone in allowlist has all permissions, but structure is ready
    if (permission && !session.user.permissions.includes(permission)) {
        throw new Error(`Missing permission: ${permission}`);
    }

    return session;
}
