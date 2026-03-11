import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import type { Request } from "express";
import type { OrgAnnouncementDTO } from "@magpie/shared";

export const orgAnnouncementsRouter = Router({ mergeParams: true });

orgAnnouncementsRouter.use(requireAuth);

// --- Zod Schemas ---

const createAnnouncementSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  isPinned: z.boolean().optional(),
});

const updateAnnouncementSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(10000).optional(),
  isPinned: z.boolean().optional(),
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

const announcementSelect = {
  id: true,
  title: true,
  content: true,
  isPinned: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { id: true, username: true } },
} as const;

function toDTO(a: {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: { id: string; username: string };
}): OrgAnnouncementDTO {
  return {
    id: a.id,
    title: a.title,
    content: a.content,
    isPinned: a.isPinned,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    author: a.author,
  };
}

// --- Routes ---

// GET /api/orgs/:orgId/announcements — List announcements (pinned first, then by date)
orgAnnouncementsRouter.get("/", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;

    const membership = await prisma.orgMember.findUnique({
      where: { orgId_userId: { orgId, userId } },
    });
    if (!membership) {
      res.status(403).json({ success: false, error: "Not a member of this org" });
      return;
    }

    const announcements = await prisma.orgAnnouncement.findMany({
      where: { orgId },
      select: announcementSelect,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: 50,
    });

    const data: OrgAnnouncementDTO[] = announcements.map(toDTO);

    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/orgs/:orgId/announcements — Create an announcement
orgAnnouncementsRouter.post("/", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;

    const canManage = await hasOrgPermission(orgId, userId, "manage_announcements");
    if (!canManage) {
      res.status(403).json({ success: false, error: "Missing manage_announcements permission" });
      return;
    }

    const parsed = createAnnouncementSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const { title, content, isPinned } = parsed.data;

    const announcement = await prisma.orgAnnouncement.create({
      data: {
        orgId,
        authorId: userId,
        title,
        content,
        isPinned: isPinned ?? false,
      },
      select: announcementSelect,
    });

    // Create org activity
    await prisma.activity.create({
      data: {
        userId,
        orgId,
        type: "announcement_created",
        targetId: announcement.id,
        metadata: { title },
      },
    });

    res.status(201).json({ success: true, data: toDTO(announcement) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/orgs/:orgId/announcements/:announcementId — Update
orgAnnouncementsRouter.patch("/:announcementId", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;
    const announcementId = req.params.announcementId as string;

    const canManage = await hasOrgPermission(orgId, userId, "manage_announcements");
    if (!canManage) {
      res.status(403).json({ success: false, error: "Missing manage_announcements permission" });
      return;
    }

    const parsed = updateAnnouncementSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const existing = await prisma.orgAnnouncement.findUnique({
      where: { id: announcementId },
      select: { orgId: true },
    });
    if (!existing || existing.orgId !== orgId) {
      res.status(404).json({ success: false, error: "Announcement not found" });
      return;
    }

    const { title, content, isPinned } = parsed.data;

    const announcement = await prisma.orgAnnouncement.update({
      where: { id: announcementId },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(isPinned !== undefined && { isPinned }),
      },
      select: announcementSelect,
    });

    res.json({ success: true, data: toDTO(announcement) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /api/orgs/:orgId/announcements/:announcementId — Delete
orgAnnouncementsRouter.delete("/:announcementId", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;
    const announcementId = req.params.announcementId as string;

    const canManage = await hasOrgPermission(orgId, userId, "manage_announcements");
    if (!canManage) {
      res.status(403).json({ success: false, error: "Missing manage_announcements permission" });
      return;
    }

    const existing = await prisma.orgAnnouncement.findUnique({
      where: { id: announcementId },
      select: { orgId: true },
    });
    if (!existing || existing.orgId !== orgId) {
      res.status(404).json({ success: false, error: "Announcement not found" });
      return;
    }

    await prisma.orgAnnouncement.delete({ where: { id: announcementId } });

    res.json({ success: true, data: { message: "Announcement deleted" } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
