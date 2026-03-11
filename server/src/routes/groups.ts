import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import type { Request } from "express";

export const groupsRouter = Router();

// All routes require authentication
groupsRouter.use(requireAuth);

// --- Zod Schemas ---

const createGroupSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(500).optional(),
});

const updateGroupSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  description: z.string().max(500).optional(),
});

const addMemberSchema = z.object({
  username: z.string().min(1),
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

async function getMemberRole(
  groupId: string,
  userId: string
): Promise<string | null> {
  const member = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
    select: { role: true },
  });
  return member?.role ?? null;
}

function isLeaderOrOfficer(role: string | null): boolean {
  return role === "LEADER" || role === "OFFICER";
}

function isLeader(role: string | null): boolean {
  return role === "LEADER";
}

// --- Routes ---

// GET /api/groups — List groups the current user is a member of
groupsRouter.get("/", async (req, res) => {
  try {
    const { userId } = getUser(req);

    const memberships = await prisma.groupMember.findMany({
      where: { userId },
      select: {
        role: true,
        joinedAt: true,
        group: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            owner: {
              select: publicUserSelect,
            },
            _count: {
              select: { members: true },
            },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    const groups = memberships.map((m) => ({
      id: m.group.id,
      name: m.group.name,
      description: m.group.description,
      createdAt: m.group.createdAt,
      owner: m.group.owner,
      memberCount: m.group._count.members,
      myRole: m.role,
    }));

    res.json({ success: true, data: groups });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/groups/:id — Get group detail
groupsRouter.get("/:id", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    const memberRole = await getMemberRole(id, userId);
    if (!memberRole) {
      res.status(403).json({ success: false, error: "Not a member of this group" });
      return;
    }

    const group = await prisma.group.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: publicUserSelect,
        },
        members: {
          select: {
            role: true,
            joinedAt: true,
            user: {
              select: publicUserSelect,
            },
          },
          orderBy: { joinedAt: "asc" },
        },
        events: {
          where: {
            startsAt: { gte: new Date() },
          },
          select: {
            id: true,
            title: true,
            description: true,
            eventType: true,
            startsAt: true,
            endsAt: true,
            creator: {
              select: publicUserSelect,
            },
          },
          orderBy: { startsAt: "asc" },
          take: 10,
        },
      },
    });

    if (!group) {
      res.status(404).json({ success: false, error: "Group not found" });
      return;
    }

    const members = group.members.map((m) => ({
      ...m.user,
      groupRole: m.role,
      joinedAt: m.joinedAt,
    }));

    res.json({
      success: true,
      data: {
        id: group.id,
        name: group.name,
        description: group.description,
        ownerId: group.ownerId,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        owner: group.owner,
        members,
        events: group.events,
        myRole: memberRole,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/groups — Create a new group
groupsRouter.post("/", async (req, res) => {
  try {
    const { userId } = getUser(req);

    const parsed = createGroupSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const { name, description } = parsed.data;

    const group = await prisma.group.create({
      data: {
        name,
        description,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: "LEADER",
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        owner: {
          select: publicUserSelect,
        },
        _count: {
          select: { members: true },
        },
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        userId,
        type: "group_created",
        targetId: group.id,
        metadata: { groupName: group.name },
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: group.id,
        name: group.name,
        description: group.description,
        createdAt: group.createdAt,
        owner: group.owner,
        memberCount: group._count.members,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/groups/:id — Update group (owner/leader only)
groupsRouter.patch("/:id", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    const parsed = updateGroupSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    // Check group exists and verify permissions
    const group = await prisma.group.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!group) {
      res.status(404).json({ success: false, error: "Group not found" });
      return;
    }

    const memberRole = await getMemberRole(id, userId);
    if (group.ownerId !== userId && !isLeader(memberRole)) {
      res.status(403).json({ success: false, error: "Only the owner or a leader can update this group" });
      return;
    }

    const { name, description } = parsed.data;

    const updated = await prisma.group.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ success: true, data: updated });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/groups/:id/members — Add a member
groupsRouter.post("/:id/members", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    const parsed = addMemberSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    // Verify caller has permission
    const callerRole = await getMemberRole(id, userId);
    if (!isLeaderOrOfficer(callerRole)) {
      res.status(403).json({ success: false, error: "Only leaders and officers can add members" });
      return;
    }

    // Find group name for activity
    const group = await prisma.group.findUnique({
      where: { id },
      select: { name: true },
    });

    if (!group) {
      res.status(404).json({ success: false, error: "Group not found" });
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
    const existing = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId: id, userId: targetUser.id } },
    });

    if (existing) {
      res.status(409).json({ success: false, error: "User is already a member" });
      return;
    }

    await prisma.groupMember.create({
      data: {
        groupId: id,
        userId: targetUser.id,
        role: "MEMBER",
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        userId: targetUser.id,
        type: "group_joined",
        targetId: id,
        metadata: { groupName: group.name },
      },
    });

    res.status(201).json({ success: true, data: { message: "Member added" } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /api/groups/:id/members/:userId — Remove a member
groupsRouter.delete("/:id/members/:userId", async (req, res) => {
  try {
    const caller = getUser(req);
    const id = req.params.id as string;
    const targetUserId = req.params.userId as string;

    // Get group to check owner
    const group = await prisma.group.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!group) {
      res.status(404).json({ success: false, error: "Group not found" });
      return;
    }

    // Cannot remove the owner
    if (targetUserId === group.ownerId) {
      res.status(403).json({ success: false, error: "Cannot remove the group owner" });
      return;
    }

    const isSelf = caller.userId === targetUserId;

    if (!isSelf) {
      // Only leader/owner can remove others
      const callerRole = await getMemberRole(id, caller.userId);
      if (!isLeader(callerRole) && group.ownerId !== caller.userId) {
        res.status(403).json({ success: false, error: "Only leaders can remove members" });
        return;
      }
    }

    // Verify target is a member
    const membership = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId: id, userId: targetUserId } },
    });

    if (!membership) {
      res.status(404).json({ success: false, error: "Member not found" });
      return;
    }

    await prisma.groupMember.delete({
      where: { id: membership.id },
    });

    res.json({ success: true, data: { message: "Member removed" } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /api/groups/:id — Delete group (owner only)
groupsRouter.delete("/:id", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    const group = await prisma.group.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!group) {
      res.status(404).json({ success: false, error: "Group not found" });
      return;
    }

    if (group.ownerId !== userId) {
      res.status(403).json({ success: false, error: "Only the owner can delete this group" });
      return;
    }

    await prisma.group.delete({ where: { id } });

    res.json({ success: true, data: { message: "Group deleted" } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
