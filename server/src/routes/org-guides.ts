import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import type { Request } from "express";
import type { OrgGuideDTO } from "@magpie/shared";

export const orgGuidesRouter = Router({ mergeParams: true });

orgGuidesRouter.use(requireAuth);

// --- Zod Schemas ---

const guideCategories = ["RANKS", "OPERATIONS", "TREASURY", "RULES", "GENERAL"] as const;

const createGuideSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(50000),
  category: z.enum(guideCategories).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

const updateGuideSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(50000).optional(),
  category: z.enum(guideCategories).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

// --- Helpers ---

type AuthRequest = Request & { user: AuthPayload };

function getUser(req: Request): AuthPayload {
  return (req as AuthRequest).user;
}

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

const guideSelect = {
  id: true,
  title: true,
  content: true,
  category: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { id: true, username: true } },
} as const;

// --- Routes ---

// GET /api/orgs/:orgId/guides — List all guides for an org (grouped by category)
orgGuidesRouter.get("/", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;

    // Verify caller is a member
    const membership = await prisma.orgMember.findUnique({
      where: { orgId_userId: { orgId, userId } },
    });
    if (!membership) {
      res.status(403).json({ success: false, error: "Not a member of this org" });
      return;
    }

    const guides = await prisma.orgGuide.findMany({
      where: { orgId },
      select: guideSelect,
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    });

    const data: OrgGuideDTO[] = guides.map((g) => ({
      id: g.id,
      title: g.title,
      content: g.content,
      category: g.category,
      sortOrder: g.sortOrder,
      createdAt: g.createdAt.toISOString(),
      updatedAt: g.updatedAt.toISOString(),
      author: g.author,
    }));

    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/orgs/:orgId/guides/:guideId — Get a single guide
orgGuidesRouter.get("/:guideId", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;
    const guideId = req.params.guideId as string;

    const membership = await prisma.orgMember.findUnique({
      where: { orgId_userId: { orgId, userId } },
    });
    if (!membership) {
      res.status(403).json({ success: false, error: "Not a member of this org" });
      return;
    }

    const guide = await prisma.orgGuide.findUnique({
      where: { id: guideId },
      select: { ...guideSelect, orgId: true },
    });

    if (!guide || guide.orgId !== orgId) {
      res.status(404).json({ success: false, error: "Guide not found" });
      return;
    }

    const data: OrgGuideDTO = {
      id: guide.id,
      title: guide.title,
      content: guide.content,
      category: guide.category,
      sortOrder: guide.sortOrder,
      createdAt: guide.createdAt.toISOString(),
      updatedAt: guide.updatedAt.toISOString(),
      author: guide.author,
    };

    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/orgs/:orgId/guides — Create a guide
orgGuidesRouter.post("/", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;

    const canManage = await hasOrgPermission(orgId, userId, "manage_guides");
    if (!canManage) {
      res.status(403).json({ success: false, error: "Missing manage_guides permission" });
      return;
    }

    const parsed = createGuideSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const { title, content, category, sortOrder } = parsed.data;

    const guide = await prisma.orgGuide.create({
      data: {
        orgId,
        authorId: userId,
        title,
        content,
        category: category || "GENERAL",
        sortOrder: sortOrder || 0,
      },
      select: guideSelect,
    });

    const data: OrgGuideDTO = {
      id: guide.id,
      title: guide.title,
      content: guide.content,
      category: guide.category,
      sortOrder: guide.sortOrder,
      createdAt: guide.createdAt.toISOString(),
      updatedAt: guide.updatedAt.toISOString(),
      author: guide.author,
    };

    res.status(201).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/orgs/:orgId/guides/:guideId — Update a guide
orgGuidesRouter.patch("/:guideId", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;
    const guideId = req.params.guideId as string;

    const canManage = await hasOrgPermission(orgId, userId, "manage_guides");
    if (!canManage) {
      res.status(403).json({ success: false, error: "Missing manage_guides permission" });
      return;
    }

    const parsed = updateGuideSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const existing = await prisma.orgGuide.findUnique({
      where: { id: guideId },
      select: { orgId: true },
    });
    if (!existing || existing.orgId !== orgId) {
      res.status(404).json({ success: false, error: "Guide not found" });
      return;
    }

    const { title, content, category, sortOrder } = parsed.data;

    const guide = await prisma.orgGuide.update({
      where: { id: guideId },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(category !== undefined && { category }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
      select: guideSelect,
    });

    const data: OrgGuideDTO = {
      id: guide.id,
      title: guide.title,
      content: guide.content,
      category: guide.category,
      sortOrder: guide.sortOrder,
      createdAt: guide.createdAt.toISOString(),
      updatedAt: guide.updatedAt.toISOString(),
      author: guide.author,
    };

    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /api/orgs/:orgId/guides/:guideId — Delete a guide
orgGuidesRouter.delete("/:guideId", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;
    const guideId = req.params.guideId as string;

    const canManage = await hasOrgPermission(orgId, userId, "manage_guides");
    if (!canManage) {
      res.status(403).json({ success: false, error: "Missing manage_guides permission" });
      return;
    }

    const existing = await prisma.orgGuide.findUnique({
      where: { id: guideId },
      select: { orgId: true },
    });
    if (!existing || existing.orgId !== orgId) {
      res.status(404).json({ success: false, error: "Guide not found" });
      return;
    }

    await prisma.orgGuide.delete({ where: { id: guideId } });

    res.json({ success: true, data: { message: "Guide deleted" } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
