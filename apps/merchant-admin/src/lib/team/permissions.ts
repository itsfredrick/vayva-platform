
export const PERMISSIONS = {
    TEAM_MANAGE: 'team:manage',
    REFUNDS_MANAGE: 'refunds:manage',
    SETTINGS_VIEW: 'settings:view',
    VIEWER: 'viewer'
};

export const ROLES = {
    OWNER: 'owner',
    ADMIN: 'admin',
    FINANCE: 'finance',
    SUPPORT: 'support',
    VIEWER: 'viewer'
};

const ROLE_PERMISSIONS: Record<string, string[]> = {
    [ROLES.OWNER]: ['*'], // wildcard
    [ROLES.ADMIN]: [PERMISSIONS.TEAM_MANAGE, PERMISSIONS.REFUNDS_MANAGE, PERMISSIONS.SETTINGS_VIEW],
    [ROLES.FINANCE]: [PERMISSIONS.REFUNDS_MANAGE, PERMISSIONS.SETTINGS_VIEW],
    [ROLES.SUPPORT]: [PERMISSIONS.SETTINGS_VIEW],
    [ROLES.VIEWER]: [PERMISSIONS.VIEWER]
};

export function can(role: string, action: string): boolean {
    const perms = ROLE_PERMISSIONS[role] || [];
    if (perms.includes('*')) return true;
    return perms.includes(action);
}
