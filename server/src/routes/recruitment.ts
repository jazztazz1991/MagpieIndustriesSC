import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import type { Request } from "express";

export const recruitmentRouter = Router();

// --- Zod Schemas ---

const createRecruitmentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  requirements: z.string().max(2000).optional(),
});

const updateRecruitmentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(5000).optional(),
  requirements: z.string().max(2000).optional(),
  isOpen: z.boolean().optional(),
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

// --- Routes ---

// GET /api/recruitment — List all open recruitment posts (public, no auth)
recruitmentRouter.get("/", async (_req, res) => {
  try {
    const posts = await prisma.recruitmentPost.findMany({
      where: {
        isOpen: true,
        org: { isPublic: true },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orgId: true,
        title: true,
        description: true,
        requirements: true,
        isOpen: true,
        createdAt: true,
        org: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            _count: { select: { members: true } },
          },
        },
      },
    });

    const data = posts.map((p) => ({
      id: p.id,
      orgId: p.orgId,
      org: {
        id: p.org.id,
        name: p.org.name,
        slug: p.org.slug,
        logoUrl: p.org.logoUrl,
        memberCount: p.org._count.members,
      },
      title: p.title,
      description: p.description,
      requirements: p.requirements,
      isOpen: p.isOpen,
      createdAt: p.createdAt,
    }));

    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/orgs/:orgId/recruitment — List recruitment posts for an org (members only)
recruitmentRouter.get("/org/:orgId", requireAuth, async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = req.params.orgId as string;

    // Verify caller is an org member
    const membership = await prisma.orgMember.findUnique({
      where: { orgId_userId: { orgId, userId } },
    });

    if (!membership) {
      res.status(403).json({ success: false, error: "Not a member of this org" });
      return;
    }

    const posts = await prisma.recruitmentPost.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orgId: true,
        title: true,
        description: true,
        requirements: true,
        isOpen: true,
        createdAt: true,
      },
    });

    res.json({ success: true, data: posts });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/orgs/:orgId/recruitment — Create recruitment post
recruitmentRouter.post("/org/:orgId", requireAuth, async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = req.params.orgId as string;

    const permitted = await hasOrgPermission(orgId, userId, "manage_recruitment");
    if (!permitted) {
      res.status(403).json({ success: false, error: "Missing manage_recruitment permission" });
      return;
    }

    const parsed = createRecruitmentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const { title, description, requirements } = parsed.data;

    const post = await prisma.recruitmentPost.create({
      data: {
        orgId,
        title,
        description,
        requirements,
      },
      select: {
        id: true,
        orgId: true,
        title: true,
        description: true,
        requirements: true,
        isOpen: true,
        createdAt: true,
      },
    });

    res.status(201).json({ success: true, data: post });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/orgs/:orgId/recruitment/:id — Update recruitment post
recruitmentRouter.patch("/org/:orgId/:id", requireAuth, async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = req.params.orgId as string;
    const id = req.params.id as string;

    const permitted = await hasOrgPermission(orgId, userId, "manage_recruitment");
    if (!permitted) {
      res.status(403).json({ success: false, error: "Missing manage_recruitment permission" });
      return;
    }

    const parsed = updateRecruitmentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    // Verify post belongs to this org
    const existing = await prisma.recruitmentPost.findUnique({
      where: { id },
      select: { orgId: true },
    });

    if (!existing || existing.orgId !== orgId) {
      res.status(404).json({ success: false, error: "Recruitment post not found" });
      return;
    }

    const { title, description, requirements, isOpen } = parsed.data;

    const updated = await prisma.recruitmentPost.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(requirements !== undefined && { requirements }),
        ...(isOpen !== undefined && { isOpen }),
      },
      select: {
        id: true,
        orgId: true,
        title: true,
        description: true,
        requirements: true,
        isOpen: true,
        createdAt: true,
      },
    });

    res.json({ success: true, data: updated });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /api/orgs/:orgId/recruitment/:id — Delete recruitment post
recruitmentRouter.delete("/org/:orgId/:id", requireAuth, async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = req.params.orgId as string;
    const id = req.params.id as string;

    const permitted = await hasOrgPermission(orgId, userId, "manage_recruitment");
    if (!permitted) {
      res.status(403).json({ success: false, error: "Missing manage_recruitment permission" });
      return;
    }

    // Verify post belongs to this org
    const existing = await prisma.recruitmentPost.findUnique({
      where: { id },
      select: { orgId: true },
    });

    if (!existing || existing.orgId !== orgId) {
      res.status(404).json({ success: false, error: "Recruitment post not found" });
      return;
    }

    await prisma.recruitmentPost.delete({ where: { id } });

    res.json({ success: true, data: { message: "Recruitment post deleted" } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
