export const ORG_PERMISSIONS = [
  "manage_members",
  "manage_roles",
  "manage_fleet",
  "manage_operations",
  "manage_treasury",
  "manage_announcements",
  "manage_guides",
  "manage_recruitment",
  "manage_settings",
] as const;

export type OrgPermission = typeof ORG_PERMISSIONS[number];

export interface OrgRole {
  id: string;
  name: string;
  rank: number;
  permissions: string[];
}

export interface OrgMembershipContext {
  isOwner: boolean;
  isMember: boolean;
  role: OrgRole | null;
}

/**
 * Check if the current user has a specific permission on an org.
 * Owners always pass. Members without a role fail. Members with a role pass
 * iff the role's permissions array includes the permission.
 */
export function can(ctx: OrgMembershipContext, permission: OrgPermission): boolean {
  if (!ctx.isMember) return false;
  if (ctx.isOwner) return true;
  if (!ctx.role) return false;
  return ctx.role.permissions.includes(permission);
}

/**
 * Human-friendly label for a permission.
 */
export function permissionLabel(permission: OrgPermission): string {
  switch (permission) {
    case "manage_members": return "Manage Members";
    case "manage_roles": return "Manage Roles";
    case "manage_fleet": return "Manage Fleet";
    case "manage_operations": return "Manage Missions";
    case "manage_treasury": return "Manage Treasury";
    case "manage_announcements": return "Manage Announcements";
    case "manage_guides": return "Manage Guides";
    case "manage_recruitment": return "Manage Recruitment";
    case "manage_settings": return "Manage Settings";
  }
}
