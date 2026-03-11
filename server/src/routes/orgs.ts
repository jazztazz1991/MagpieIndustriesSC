import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import type { Request } from "express";

export const orgsRouter = Router();

// All routes require authentication
orgsRouter.use(requireAuth);

// --- Zod Schemas ---

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const createOrgSchema = z.object({
  name: z.string().min(3).max(100),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(slugRegex, "Slug must be lowercase alphanumeric with hyphens only"),
  description: z.string().max(1000).optional(),
  spectrumId: z.string().max(100).optional(),
  logoUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  isPublic: z.boolean().optional(),
});

const updateOrgSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(slugRegex, "Slug must be lowercase alphanumeric with hyphens only")
    .optional(),
  description: z.string().max(1000).nullable().optional(),
  spectrumId: z.string().max(100).nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
  bannerUrl: z.string().url().nullable().optional(),
  isPublic: z.boolean().optional(),
  motd: z.string().max(2000).nullable().optional(),
});

const addMemberSchema = z.object({
  username: z.string().min(1),
});

const changeRoleSchema = z.object({
  roleId: z.string().nullable(),
});

const validPermissions = [
  "manage_members",
  "manage_roles",
  "manage_fleet",
  "manage_operations",
  "manage_treasury",
  "manage_events",
  "manage_recruitment",
  "manage_guides",
  "manage_announcements",
] as const;

const createRoleSchema = z.object({
  name: z.string().min(1).max(50),
  rank: z.number().int().min(0),
  permissions: z.array(z.enum(validPermissions)),
});

const updateRoleSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  rank: z.number().int().min(0).optional(),
  permissions: z.array(z.enum(validPermissions)).optional(),
});

// --- Helpers ---

type AuthRequest = Request & { user: AuthPayload };

function getUser(req: Request): AuthPayload {
  return (req as AuthRequest).user;
}

const publicUserSelect = {
  id: true,
  username: true,
  rsiHandle: true,
  avatarUrl: true,
  bio: true,
  role: true,
} as const;

async function hasOrgPermission(
  orgId: string,
  userId: string,
  permission: string
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

async function isOrgOwner(orgId: string, userId: string): Promise<boolean> {
  const org = await prisma.org.findUnique({
    where: { id: orgId },
    select: { ownerId: true },
  });
  return org?.ownerId === userId;
}

// --- Routes ---

// GET /api/orgs — List orgs the current user is a member of
orgsRouter.get("/", async (req, res) => {
  try {
    const { userId } = getUser(req);

    const memberships = await prisma.orgMember.findMany({
      where: { userId },
      select: {
        joinedAt: true,
        role: {
          select: { id: true, name: true, rank: true, permissions: true },
        },
        org: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            logoUrl: true,
            isPublic: true,
            owner: { select: publicUserSelect },
            _count: { select: { members: true } },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    const orgs = memberships.map((m) => ({
      id: m.org.id,
      name: m.org.name,
      slug: m.org.slug,
      description: m.org.description,
      logoUrl: m.org.logoUrl,
      isPublic: m.org.isPublic,
      owner: m.org.owner,
      memberCount: m.org._count.members,
      myRole: m.role
        ? { id: m.role.id, name: m.role.name, rank: m.role.rank, permissions: m.role.permissions }
        : null,
    }));

    res.json({ success: true, data: orgs });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/orgs/discover — List public orgs the user is NOT a member of
orgsRouter.get("/discover", async (req, res) => {
  try {
    const { userId } = getUser(req);

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const [orgs, total] = await Promise.all([
      prisma.org.findMany({
        where: {
          isPublic: true,
          members: { none: { userId } },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          logoUrl: true,
          isPublic: true,
          owner: { select: publicUserSelect },
          _count: { select: { members: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.org.count({
        where: {
          isPublic: true,
          members: { none: { userId } },
        },
      }),
    ]);

    const data = orgs.map((o) => ({
      id: o.id,
      name: o.name,
      slug: o.slug,
      description: o.description,
      logoUrl: o.logoUrl,
      isPublic: o.isPublic,
      owner: o.owner,
      memberCount: o._count.members,
    }));

    res.json({
      success: true,
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/orgs/:id — Get org detail
orgsRouter.get("/:id", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    // Support lookup by ID or slug (CUIDs are 25+ chars starting with 'c')
    const isCuid = id.length >= 25 && id.startsWith("c");
    const whereClause = isCuid ? { id } : { slug: id };
    const org = await prisma.org.findUnique({
      where: whereClause,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        spectrumId: true,
        logoUrl: true,
        bannerUrl: true,
        isPublic: true,
        motd: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
        owner: { select: publicUserSelect },
        members: {
          select: {
            joinedAt: true,
            user: { select: publicUserSelect },
            role: {
              select: { id: true, name: true, rank: true, permissions: true },
            },
          },
          orderBy: { joinedAt: "asc" },
        },
        roles: {
          select: {
            id: true,
            name: true,
            rank: true,
            permissions: true,
            createdAt: true,
          },
          orderBy: { rank: "desc" },
        },
      },
    });

    if (!org) {
      res.status(404).json({ success: false, error: "Org not found" });
      return;
    }

    // Check access: public orgs visible to all, private only to members
    const membership = org.members.find((m) => m.user.id === userId);
    if (!org.isPublic && !membership) {
      res.status(403).json({ success: false, error: "This org is private" });
      return;
    }

    const members = org.members.map((m) => ({
      ...m.user,
      role: m.role
        ? { id: m.role.id, name: m.role.name, rank: m.role.rank, permissions: m.role.permissions }
        : null,
      joinedAt: m.joinedAt,
    }));

    // Check if user has a pending join request
    let joinRequestStatus: string | null = null;
    if (!membership) {
      const joinRequest = await prisma.joinRequest.findUnique({
        where: { orgId_userId: { orgId: org.id, userId } },
        select: { status: true },
      });
      joinRequestStatus = joinRequest?.status ?? null;
    }

    res.json({
      success: true,
      data: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        description: org.description,
        spectrumId: org.spectrumId,
        logoUrl: org.logoUrl,
        bannerUrl: org.bannerUrl,
        isPublic: org.isPublic,
        motd: org.motd,
        ownerId: org.ownerId,
        createdAt: org.createdAt,
        updatedAt: org.updatedAt,
        owner: org.owner,
        members,
        memberCount: org.members.length,
        roles: org.roles,
        isMember: !!membership,
        joinRequestStatus,
        myRole: membership?.role
          ? {
              id: membership.role.id,
              name: membership.role.name,
              rank: membership.role.rank,
              permissions: membership.role.permissions,
            }
          : null,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/orgs — Create org
orgsRouter.post("/", async (req, res) => {
  try {
    const { userId } = getUser(req);

    const parsed = createOrgSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const { name, slug, description, spectrumId, logoUrl, bannerUrl, isPublic } = parsed.data;

    // Check slug uniqueness
    const existingSlug = await prisma.org.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (existingSlug) {
      res.status(409).json({ success: false, error: "Slug is already taken" });
      return;
    }

    // Create org with Leader role and owner as first member
    const org = await prisma.org.create({
      data: {
        name,
        slug,
        description,
        spectrumId,
        logoUrl,
        bannerUrl,
        isPublic: isPublic ?? true,
        ownerId: userId,
        roles: {
          create: {
            name: "Leader",
            rank: 100,
            permissions: [
              "manage_members",
              "manage_roles",
              "manage_fleet",
              "manage_operations",
              "manage_treasury",
              "manage_events",
              "manage_recruitment",
              "manage_guides",
              "manage_announcements",
            ],
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logoUrl: true,
        isPublic: true,
        createdAt: true,
        owner: { select: publicUserSelect },
        roles: { select: { id: true } },
      },
    });

    // Assign leader role to creator
    const leaderRoleId = org.roles[0].id;
    await prisma.orgMember.create({
      data: {
        orgId: org.id,
        userId,
        roleId: leaderRoleId,
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        userId,
        type: "org_created",
        targetId: org.id,
        metadata: { orgName: org.name },
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        description: org.description,
        logoUrl: org.logoUrl,
        isPublic: org.isPublic,
        createdAt: org.createdAt,
        owner: org.owner,
        memberCount: 1,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/orgs/:id — Update org (owner only)
orgsRouter.patch("/:id", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    const parsed = updateOrgSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    if (!(await isOrgOwner(id, userId))) {
      res.status(403).json({ success: false, error: "Only the owner can update this org" });
      return;
    }

    const { name, slug, description, spectrumId, logoUrl, bannerUrl, isPublic, motd } = parsed.data;

    // If slug is changing, check uniqueness
    if (slug) {
      const existingSlug = await prisma.org.findUnique({
        where: { slug },
        select: { id: true },
      });
      if (existingSlug && existingSlug.id !== id) {
        res.status(409).json({ success: false, error: "Slug is already taken" });
        return;
      }
    }

    const updated = await prisma.org.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(spectrumId !== undefined && { spectrumId }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(bannerUrl !== undefined && { bannerUrl }),
        ...(isPublic !== undefined && { isPublic }),
        ...(motd !== undefined && { motd }),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        spectrumId: true,
        logoUrl: true,
        bannerUrl: true,
        isPublic: true,
        motd: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ success: true, data: updated });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /api/orgs/:id — Delete org (owner only)
orgsRouter.delete("/:id", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    if (!(await isOrgOwner(id, userId))) {
      res.status(403).json({ success: false, error: "Only the owner can delete this org" });
      return;
    }

    await prisma.org.delete({ where: { id } });

    res.json({ success: true, data: { message: "Org deleted" } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/orgs/:id/join — Request to join a public org
orgsRouter.post("/:id/join", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    const messageSchema = z.object({ message: z.string().max(500).optional() });
    const parsed = messageSchema.safeParse(req.body);
    const message = parsed.success ? parsed.data.message : undefined;

    const org = await prisma.org.findUnique({
      where: { id },
      select: { id: true, name: true, isPublic: true },
    });
    if (!org) {
      res.status(404).json({ success: false, error: "Org not found" });
      return;
    }

    if (!org.isPublic) {
      res.status(403).json({ success: false, error: "This organization is private" });
      return;
    }

    // Check if already a member
    const existingMember = await prisma.orgMember.findUnique({
      where: { orgId_userId: { orgId: id, userId } },
    });
    if (existingMember) {
      res.status(409).json({ success: false, error: "You are already a member" });
      return;
    }

    // Check if there's already a pending request
    const existingRequest = await prisma.joinRequest.findUnique({
      where: { orgId_userId: { orgId: id, userId } },
    });
    if (existingRequest) {
      if (existingRequest.status === "PENDING") {
        res.status(409).json({ success: false, error: "You already have a pending request" });
        return;
      }
      // If previously denied, allow re-request by updating
      await prisma.joinRequest.update({
        where: { id: existingRequest.id },
        data: { status: "PENDING", message },
      });
      res.status(201).json({ success: true, data: { message: "Join request submitted" } });
      return;
    }

    await prisma.joinRequest.create({
      data: { orgId: id, userId, message },
    });

    res.status(201).json({ success: true, data: { message: "Join request submitted" } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/orgs/:id/join-requests — List pending join requests (manage_members permission)
orgsRouter.get("/:id/join-requests", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    const canManage = await hasOrgPermission(id, userId, "manage_members");
    if (!canManage) {
      res.status(403).json({ success: false, error: "Missing manage_members permission" });
      return;
    }

    const requests = await prisma.joinRequest.findMany({
      where: { orgId: id, status: "PENDING" },
      select: {
        id: true,
        message: true,
        status: true,
        createdAt: true,
        user: { select: publicUserSelect },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: requests });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/orgs/:id/join-requests/:requestId — Approve or deny a join request
orgsRouter.patch("/:id/join-requests/:requestId", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;
    const requestId = req.params.requestId as string;

    const actionSchema = z.object({ action: z.enum(["approve", "deny"]) });
    const parsed = actionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Action must be 'approve' or 'deny'" });
      return;
    }

    const canManage = await hasOrgPermission(id, userId, "manage_members");
    if (!canManage) {
      res.status(403).json({ success: false, error: "Missing manage_members permission" });
      return;
    }

    const request = await prisma.joinRequest.findUnique({
      where: { id: requestId },
      select: { id: true, orgId: true, userId: true, status: true },
    });
    if (!request || request.orgId !== id) {
      res.status(404).json({ success: false, error: "Join request not found" });
      return;
    }
    if (request.status !== "PENDING") {
      res.status(400).json({ success: false, error: "This request has already been processed" });
      return;
    }

    if (parsed.data.action === "approve") {
      // Add user as member and update request status
      await prisma.$transaction([
        prisma.joinRequest.update({
          where: { id: requestId },
          data: { status: "APPROVED" },
        }),
        prisma.orgMember.create({
          data: { orgId: id, userId: request.userId },
        }),
      ]);

      const org = await prisma.org.findUnique({
        where: { id },
        select: { name: true },
      });
      await prisma.activity.create({
        data: {
          userId: request.userId,
          type: "org_joined",
          targetId: id,
          metadata: { orgName: org?.name || "" },
        },
      });

      res.json({ success: true, data: { message: "Request approved" } });
    } else {
      await prisma.joinRequest.update({
        where: { id: requestId },
        data: { status: "DENIED" },
      });
      res.json({ success: true, data: { message: "Request denied" } });
    }
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/orgs/:id/transfer — Transfer ownership to another member (owner only)
orgsRouter.post("/:id/transfer", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    const transferSchema = z.object({ newOwnerId: z.string().min(1) });
    const parsed = transferSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "newOwnerId is required" });
      return;
    }

    // Only the current owner can transfer
    if (!(await isOrgOwner(id, userId))) {
      res.status(403).json({ success: false, error: "Only the owner can transfer ownership" });
      return;
    }

    const { newOwnerId } = parsed.data;

    // Verify the new owner is a member of this org
    const newOwnerMember = await prisma.orgMember.findUnique({
      where: { orgId_userId: { orgId: id, userId: newOwnerId } },
    });
    if (!newOwnerMember) {
      res.status(404).json({ success: false, error: "New owner must be a member of this org" });
      return;
    }

    await prisma.org.update({
      where: { id },
      data: { ownerId: newOwnerId },
    });

    res.json({ success: true, data: { message: "Ownership transferred" } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/orgs/:id/members — List org members
orgsRouter.get("/:id/members", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    // Verify caller is a member
    const callerMembership = await prisma.orgMember.findUnique({
      where: { orgId_userId: { orgId: id, userId } },
    });
    if (!callerMembership) {
      res.status(403).json({ success: false, error: "You are not a member of this org" });
      return;
    }

    const members = await prisma.orgMember.findMany({
      where: { orgId: id },
      select: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        role: { select: { id: true, name: true, rank: true } },
        joinedAt: true,
      },
      orderBy: { joinedAt: "asc" },
    });

    const data = members.map((m) => ({
      id: m.user.id,
      username: m.user.username,
      avatarUrl: m.user.avatarUrl,
      role: m.role ? { id: m.role.id, name: m.role.name, rank: m.role.rank } : null,
      joinedAt: m.joinedAt,
    }));

    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/orgs/:id/members — Add member by username
orgsRouter.post("/:id/members", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    const parsed = addMemberSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    // Verify caller has permission
    const canManage = await hasOrgPermission(id, userId, "manage_members");
    if (!canManage) {
      res.status(403).json({ success: false, error: "You do not have permission to manage members" });
      return;
    }

    // Verify org exists
    const org = await prisma.org.findUnique({
      where: { id },
      select: { name: true },
    });
    if (!org) {
      res.status(404).json({ success: false, error: "Org not found" });
      return;
    }

    // Find user by username
    const targetUser = await prisma.user.findUnique({
      where: { username: parsed.data.username },
      select: { id: true, username: true },
    });
    if (!targetUser) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    // Check if already a member
    const existing = await prisma.orgMember.findUnique({
      where: { orgId_userId: { orgId: id, userId: targetUser.id } },
    });
    if (existing) {
      res.status(409).json({ success: false, error: "User is already a member" });
      return;
    }

    await prisma.orgMember.create({
      data: {
        orgId: id,
        userId: targetUser.id,
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        userId: targetUser.id,
        type: "org_joined",
        targetId: id,
        metadata: { orgName: org.name },
      },
    });

    res.status(201).json({ success: true, data: { message: "Member added" } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /api/orgs/:id/members/:userId — Remove member
orgsRouter.delete("/:id/members/:userId", async (req, res) => {
  try {
    const caller = getUser(req);
    const id = req.params.id as string;
    const targetUserId = req.params.userId as string;

    // Get org to check owner
    const org = await prisma.org.findUnique({
      where: { id },
      select: { ownerId: true },
    });
    if (!org) {
      res.status(404).json({ success: false, error: "Org not found" });
      return;
    }

    // Cannot remove the owner
    if (targetUserId === org.ownerId) {
      res.status(403).json({ success: false, error: "Cannot remove the org owner" });
      return;
    }

    const isSelf = caller.userId === targetUserId;

    if (!isSelf) {
      // Only owner or members with manage_members can remove others
      const canManage = await hasOrgPermission(id, caller.userId, "manage_members");
      if (!canManage) {
        res.status(403).json({ success: false, error: "You do not have permission to remove members" });
        return;
      }
    }

    // Verify target is a member
    const membership = await prisma.orgMember.findUnique({
      where: { orgId_userId: { orgId: id, userId: targetUserId } },
    });
    if (!membership) {
      res.status(404).json({ success: false, error: "Member not found" });
      return;
    }

    await prisma.orgMember.delete({ where: { id: membership.id } });

    res.json({ success: true, data: { message: "Member removed" } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/orgs/:id/members/:userId/role — Change member's role
orgsRouter.patch("/:id/members/:userId/role", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;
    const targetUserId = req.params.userId as string;

    const parsed = changeRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    // Only owner can change roles
    if (!(await isOrgOwner(id, userId))) {
      res.status(403).json({ success: false, error: "Only the owner can change member roles" });
      return;
    }

    // Verify target is a member
    const membership = await prisma.orgMember.findUnique({
      where: { orgId_userId: { orgId: id, userId: targetUserId } },
    });
    if (!membership) {
      res.status(404).json({ success: false, error: "Member not found" });
      return;
    }

    // If roleId is provided, verify it belongs to this org
    const { roleId } = parsed.data;
    if (roleId !== null) {
      const role = await prisma.orgRole.findUnique({
        where: { id: roleId },
        select: { orgId: true },
      });
      if (!role || role.orgId !== id) {
        res.status(404).json({ success: false, error: "Role not found in this org" });
        return;
      }
    }

    await prisma.orgMember.update({
      where: { id: membership.id },
      data: { roleId },
    });

    res.json({ success: true, data: { message: "Member role updated" } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/orgs/:id/roles — Create custom role
orgsRouter.post("/:id/roles", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    const parsed = createRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    // Only owner can create roles
    if (!(await isOrgOwner(id, userId))) {
      res.status(403).json({ success: false, error: "Only the owner can create roles" });
      return;
    }

    const { name, rank, permissions } = parsed.data;

    // Check for duplicate role name within org
    const existingRole = await prisma.orgRole.findUnique({
      where: { orgId_name: { orgId: id, name } },
    });
    if (existingRole) {
      res.status(409).json({ success: false, error: "A role with this name already exists" });
      return;
    }

    const role = await prisma.orgRole.create({
      data: {
        orgId: id,
        name,
        rank,
        permissions,
      },
      select: {
        id: true,
        name: true,
        rank: true,
        permissions: true,
        createdAt: true,
      },
    });

    res.status(201).json({ success: true, data: role });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/orgs/:id/roles/:roleId — Update role
orgsRouter.patch("/:id/roles/:roleId", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;
    const roleId = req.params.roleId as string;

    const parsed = updateRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    // Only owner can update roles
    if (!(await isOrgOwner(id, userId))) {
      res.status(403).json({ success: false, error: "Only the owner can update roles" });
      return;
    }

    // Verify role belongs to this org
    const existingRole = await prisma.orgRole.findUnique({
      where: { id: roleId },
      select: { orgId: true },
    });
    if (!existingRole || existingRole.orgId !== id) {
      res.status(404).json({ success: false, error: "Role not found in this org" });
      return;
    }

    const { name, rank, permissions } = parsed.data;

    // If renaming, check for duplicate
    if (name) {
      const duplicateName = await prisma.orgRole.findUnique({
        where: { orgId_name: { orgId: id, name } },
        select: { id: true },
      });
      if (duplicateName && duplicateName.id !== roleId) {
        res.status(409).json({ success: false, error: "A role with this name already exists" });
        return;
      }
    }

    const updated = await prisma.orgRole.update({
      where: { id: roleId },
      data: {
        ...(name !== undefined && { name }),
        ...(rank !== undefined && { rank }),
        ...(permissions !== undefined && { permissions }),
      },
      select: {
        id: true,
        name: true,
        rank: true,
        permissions: true,
        createdAt: true,
      },
    });

    res.json({ success: true, data: updated });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /api/orgs/:id/roles/:roleId — Delete role (sets members with that role to null)
orgsRouter.delete("/:id/roles/:roleId", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;
    const roleId = req.params.roleId as string;

    // Only owner can delete roles
    if (!(await isOrgOwner(id, userId))) {
      res.status(403).json({ success: false, error: "Only the owner can delete roles" });
      return;
    }

    // Verify role belongs to this org
    const existingRole = await prisma.orgRole.findUnique({
      where: { id: roleId },
      select: { orgId: true },
    });
    if (!existingRole || existingRole.orgId !== id) {
      res.status(404).json({ success: false, error: "Role not found in this org" });
      return;
    }

    // Prisma onDelete: SetNull handles setting members' roleId to null
    await prisma.orgRole.delete({ where: { id: roleId } });

    res.json({ success: true, data: { message: "Role deleted" } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
