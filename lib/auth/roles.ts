

export const SYSTEM_ROLES = ["admin", "user"] as const;
export type SystemRole = (typeof SYSTEM_ROLES)[number];

export const ORG_MEMBERSHIP_ROLES = ["owner", "member"] as const;
/** Không có trong JWT — chỉ dùng kết quả `getOrgMembershipRole`. */
export type OrgMembershipRole = (typeof ORG_MEMBERSHIP_ROLES)[number];

export function isSystemRole(value: string): value is SystemRole {
  return (SYSTEM_ROLES as readonly string[]).includes(value);
}

/** Các role hệ thống xuất hiện trong JWT (bỏ qua giá trị lạ nếu có). */
export function pickSystemRoles(roles: readonly string[] | undefined): SystemRole[] {
  if (!roles?.length) return [];
  return roles.filter(isSystemRole);
}

export function isSystemAdmin(roles: readonly string[] | undefined): boolean {
  return pickSystemRoles(roles).includes("admin");
}

export function isSystemUser(roles: readonly string[] | undefined): boolean {
  return pickSystemRoles(roles).includes("user");
}

/**
 * Vai trò org của user hiện tại — **không** lấy từ JWT; so `org.ownerId` với `currentUserId`.
 */
export function getOrgMembershipRole(
  org: { ownerId: string | null },
  currentUserId: string | null | undefined
): OrgMembershipRole {
  if (currentUserId && org.ownerId && org.ownerId === currentUserId) {
    return "owner";
  }
  return "member";
}
