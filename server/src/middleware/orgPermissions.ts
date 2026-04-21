import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { AuthPayload } from "./auth.js";

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

function getUserId(req: Request): string | null {
  const authUser = (req as Request & { user?: AuthPayload }).user;
  return authUser?.userId ?? null;
}

/**
 * Check if a user is a member of an org and has the given permission.
 * Owners always pass. Non-members / non-roled members fail.
 */
export async function hasOrgPermission(
  orgId: string,
  userId: string,
  permission: OrgPermission
): Promise<boolean> {
  const member = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId } },
    include: { role: true, org: { select: { ownerId: true } } },
  });
  if (!member) return false;
  if (member.org.ownerId === userId) return true;
  if (!member.role) return false;
  const perms = member.role.permissions as string[];
  return perms.includes(permission);
}

/**
 * Check if a user is a member of an org (any role, including no role).
 */
export async function isOrgMember(orgId: string, userId: string): Promise<boolean> {
  const member = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId } },
    select: { id: true },
  });
  return !!member;
}

/**
 * Express middleware factory: require that the authenticated user has a
 * specific permission on the org identified by req.params.orgId.
 */
export function requireOrgPermission(permission: OrgPermission) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    const orgId = (req.params as Record<string, string>).orgId;
    if (!orgId) {
      res.status(400).json({ success: false, error: "Missing org id" });
      return;
    }
    const ok = await hasOrgPermission(orgId, userId, permission);
    if (!ok) {
      res.status(403).json({ success: false, error: `Missing permission: ${permission}` });
      return;
    }
    next();
  };
}

/**
 * Middleware: require that the authenticated user is a member of the org.
 */
export async function requireOrgMember(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = getUserId(req);
  if (!userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  const orgId = (req.params as Record<string, string>).orgId;
  if (!orgId) {
    res.status(400).json({ success: false, error: "Missing org id" });
    return;
  }
  const ok = await isOrgMember(orgId, userId);
  if (!ok) {
    res.status(403).json({ success: false, error: "Not a member of this org" });
    return;
  }
  next();
}
