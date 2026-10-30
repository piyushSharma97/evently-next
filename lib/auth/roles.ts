export type UserRole = 'admin' | 'creator' | 'user';

export const ROLES = {
  ADMIN: 'admin' as UserRole,
  CREATOR: 'creator' as UserRole,
  USER: 'user' as UserRole,
} as const;

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 3,
  creator: 2,
  user: 1,
};

export const PERMISSIONS = {
  EVENT_CREATE: ['admin', 'creator'] as UserRole[],
  EVENT_UPDATE_OWN: ['admin', 'creator'] as UserRole[],
  EVENT_DELETE_ANY: ['admin'] as UserRole[],
  ADMIN_PANEL_ACCESS: ['admin'] as UserRole[],
  QR_SCAN_ACCESS: ['admin', 'creator'] as UserRole[],
} as const;

/**
 * Checks whether the user's role satisfies the required roles.
 */
export function hasRole(userRole: UserRole | undefined | null, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

/**
 * Checks whether userRole is at or above a minimum hierarchy level.
 */
export function hasMinimumRole(userRole: UserRole | undefined | null, minRole: UserRole): boolean {
  if (!userRole) return false;
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[minRole] ?? 0);
}

