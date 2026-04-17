import { Router } from "express";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import type { Request } from "express";

export const wikeloGroupsRouter = Router();

function generateInviteCode(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

function getUserId(req: Request): string {
  return (req as Request & { user: AuthPayload }).user.userId;
}

// ─── Group DTOs ───

function groupToDTO(g: any) {
  return {
    id: g.id,
    name: g.name,
    inviteCode: g.inviteCode,
    ownerId: g.ownerId,
    ownerName: g.owner?.username || "",
    memberCount: g.members?.length || 0,
    members: g.members?.map((m: any) => ({
      userId: m.userId,
      username: m.user?.username || "",
      joinedAt: m.joinedAt?.toISOString(),
    })) || [],
    projectCount: g.projects?.length || 0,
    projects: g.projects?.map(projectToDTO) || [],
    createdAt: g.createdAt.toISOString(),
  };
}

function projectToDTO(p: any) {
  const materials = (p.materials || []).map((m: any) => ({
    id: m.id,
    itemName: m.itemName,
    required: m.required,
    collected: m.collected,
  }));
  const totalRequired = materials.reduce((s: number, m: any) => s + m.required, 0);
  const totalCollected = materials.reduce((s: number, m: any) => s + Math.min(m.collected, m.required), 0);
  const progress = totalRequired > 0 ? Math.round((totalCollected / totalRequired) * 100) : 0;

  return {
    id: p.id,
    contractId: p.contractId,
    name: p.displayName || p.name,
    displayName: p.displayName,
    status: p.status,
    priority: p.priority,
    progress,
    materialCount: materials.length,
    materials,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

// ─── Middleware: verify group membership ───

async function requireGroupMember(req: any, res: any, next: any) {
  const userId = getUserId(req);
  const groupId = req.params.groupId || req.params.id;

  const group = await prisma.wikeloGroup.findUnique({
    where: { id: groupId },
    include: { members: true },
  });

  if (!group) {
    res.status(404).json({ success: false, error: "Group not found" });
    return;
  }

  const isMember = group.members.some((m) => m.userId === userId) || group.ownerId === userId;
  if (!isMember) {
    res.status(403).json({ success: false, error: "Not a group member" });
    return;
  }

  (req as any).wikeloGroup = group;
  next();
}

// ─── Group CRUD ───

const createGroupSchema = z.object({
  name: z.string().min(1).max(100),
});

// POST /groups — create group
wikeloGroupsRouter.post("/", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const parsed = createGroupSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Invalid input" });
      return;
    }

    const group = await prisma.wikeloGroup.create({
      data: {
        name: parsed.data.name,
        inviteCode: generateInviteCode(),
        ownerId: userId,
        members: {
          create: { userId },  // owner auto-joins
        },
      },
      include: { members: { include: { user: true } }, owner: true, projects: { include: { materials: true } } },
    });

    res.status(201).json({ success: true, data: groupToDTO(group) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /groups — list user's groups
wikeloGroupsRouter.get("/", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req);

    const groups = await prisma.wikeloGroup.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        owner: true,
        members: { include: { user: true } },
        projects: { where: { status: "IN_PROGRESS" }, include: { materials: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.json({ success: true, data: groups.map(groupToDTO) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /groups/:id — group detail
wikeloGroupsRouter.get("/:id", requireAuth, requireGroupMember, async (req, res) => {
  try {
    const group = await prisma.wikeloGroup.findUnique({
      where: { id: req.params.id as string },
      include: {
        owner: true,
        members: { include: { user: true } },
        projects: { include: { materials: true }, orderBy: { priority: "asc" } },
      },
    });

    if (!group) {
      res.status(404).json({ success: false, error: "Group not found" });
      return;
    }

    res.json({ success: true, data: groupToDTO(group) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /groups/join — join via invite code
const joinSchema = z.object({ inviteCode: z.string().min(1) });

wikeloGroupsRouter.post("/join", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const parsed = joinSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Invalid input" });
      return;
    }

    const group = await prisma.wikeloGroup.findUnique({
      where: { inviteCode: parsed.data.inviteCode.toUpperCase() },
    });

    if (!group) {
      res.status(404).json({ success: false, error: "Invalid invite code" });
      return;
    }

    // Check if already a member
    const existing = await prisma.wikeloGroupMember.findUnique({
      where: { groupId_userId: { groupId: group.id, userId } },
    });

    if (existing) {
      res.json({ success: true, data: { groupId: group.id, alreadyMember: true } });
      return;
    }

    await prisma.wikeloGroupMember.create({
      data: { groupId: group.id, userId },
    });

    res.json({ success: true, data: { groupId: group.id, groupName: group.name } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /groups/:id/members/:userId — remove member or leave
wikeloGroupsRouter.delete("/:id/members/:memberId", requireAuth, requireGroupMember, async (req, res) => {
  try {
    const userId = getUserId(req);
    const targetId = req.params.memberId as string;
    const group = (req as any).wikeloGroup;

    // Only owner can remove others; anyone can leave (remove self)
    if (targetId !== userId && group.ownerId !== userId) {
      res.status(403).json({ success: false, error: "Only the owner can remove members" });
      return;
    }

    // Owner can't leave their own group
    if (targetId === group.ownerId) {
      res.status(400).json({ success: false, error: "Owner cannot leave. Delete the group instead." });
      return;
    }

    await prisma.wikeloGroupMember.deleteMany({
      where: { groupId: group.id, userId: targetId },
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /groups/:id — delete group (owner only)
wikeloGroupsRouter.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const group = await prisma.wikeloGroup.findUnique({ where: { id: req.params.id as string } });

    if (!group || group.ownerId !== userId) {
      res.status(403).json({ success: false, error: "Only the owner can delete the group" });
      return;
    }

    await prisma.wikeloGroup.delete({ where: { id: group.id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ─── Group Projects ───

const createProjectSchema = z.object({
  contractId: z.string().min(1).max(200),
  name: z.string().min(1).max(200),
  displayName: z.string().max(200).optional(),
  materials: z.array(z.object({
    itemName: z.string().min(1).max(200),
    required: z.number().int().min(1),
  })).min(1),
});

// POST /groups/:id/projects — create project in group
wikeloGroupsRouter.post("/:id/projects", requireAuth, requireGroupMember, async (req, res) => {
  try {
    const userId = getUserId(req);
    const parsed = createProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Invalid input" });
      return;
    }

    const { contractId, name, displayName, materials } = parsed.data;

    // Get max priority in group for ordering
    const maxPriority = await prisma.wikeloProject.aggregate({
      where: { groupId: req.params.id as string },
      _max: { priority: true },
    });

    const project = await prisma.wikeloProject.create({
      data: {
        userId,
        contractId,
        name,
        displayName: displayName || null,
        groupId: req.params.id as string,
        priority: (maxPriority._max.priority ?? -1) + 1,
        materials: {
          create: materials.map((m) => ({
            itemName: m.itemName,
            required: m.required,
          })),
        },
      },
      include: { materials: true },
    });

    res.status(201).json({ success: true, data: projectToDTO(project) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /groups/:groupId/projects/:projectId/materials/:materialId — update material + log
const updateMaterialSchema = z.object({
  collected: z.number().int().min(0),
});

wikeloGroupsRouter.patch(
  "/:groupId/projects/:projectId/materials/:materialId",
  requireAuth,
  requireGroupMember,
  async (req, res) => {
    try {
      const userId = getUserId(req);
      const parsed = updateMaterialSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, error: "Invalid input" });
        return;
      }

      // Verify project belongs to this group
      const project = await prisma.wikeloProject.findFirst({
        where: { id: req.params.projectId as string, groupId: req.params.groupId as string },
      });
      if (!project) {
        res.status(404).json({ success: false, error: "Project not found" });
        return;
      }

      const material = await prisma.wikeloProjectMaterial.findUnique({
        where: { id: req.params.materialId as string },
      });
      if (!material) {
        res.status(404).json({ success: false, error: "Material not found" });
        return;
      }

      const oldCollected = material.collected;
      const newCollected = parsed.data.collected;
      const delta = newCollected - oldCollected;

      // Update material + log contribution in a transaction
      const [updated] = await prisma.$transaction([
        prisma.wikeloProjectMaterial.update({
          where: { id: material.id },
          data: { collected: newCollected },
        }),
        prisma.wikeloContributionLog.create({
          data: {
            projectId: project.id,
            userId,
            itemName: material.itemName,
            delta,
            newTotal: newCollected,
          },
        }),
        prisma.wikeloProject.update({
          where: { id: project.id },
          data: { updatedAt: new Date() },
        }),
      ]);

      res.json({
        success: true,
        data: {
          id: updated.id,
          itemName: updated.itemName,
          required: updated.required,
          collected: updated.collected,
        },
      });
    } catch {
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
);

// PATCH /groups/:groupId/projects/:projectId — update displayName, priority, status
const updateProjectSchema = z.object({
  displayName: z.string().max(200).optional(),
  status: z.enum(["IN_PROGRESS", "COMPLETED", "ABANDONED"]).optional(),
  priority: z.number().int().optional(),
});

wikeloGroupsRouter.patch(
  "/:groupId/projects/:projectId",
  requireAuth,
  requireGroupMember,
  async (req, res) => {
    try {
      const parsed = updateProjectSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, error: "Invalid input" });
        return;
      }

      const project = await prisma.wikeloProject.findFirst({
        where: { id: req.params.projectId as string, groupId: req.params.groupId as string },
      });
      if (!project) {
        res.status(404).json({ success: false, error: "Project not found" });
        return;
      }

      const updated = await prisma.wikeloProject.update({
        where: { id: project.id },
        data: {
          ...(parsed.data.displayName !== undefined ? { displayName: parsed.data.displayName } : {}),
          ...(parsed.data.status ? { status: parsed.data.status } : {}),
          ...(parsed.data.priority !== undefined ? { priority: parsed.data.priority } : {}),
        },
        include: { materials: true },
      });

      res.json({ success: true, data: projectToDTO(updated) });
    } catch {
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
);

// POST /groups/:groupId/projects/reorder — reorder group projects
const reorderSchema = z.object({
  projectIds: z.array(z.string()).min(1),
});

wikeloGroupsRouter.post(
  "/:groupId/projects/reorder",
  requireAuth,
  requireGroupMember,
  async (req, res) => {
    try {
      const parsed = reorderSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, error: "Invalid input" });
        return;
      }

      await prisma.$transaction(
        parsed.data.projectIds.map((id, index) =>
          prisma.wikeloProject.updateMany({
            where: { id, groupId: req.params.groupId as string },
            data: { priority: index },
          })
        )
      );

      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
);

// ─── Contribution Log ───

// GET /groups/:id/log — group-wide contribution history
wikeloGroupsRouter.get("/:id/log", requireAuth, requireGroupMember, async (req, res) => {
  try {
    const groupProjects = await prisma.wikeloProject.findMany({
      where: { groupId: req.params.id as string },
      select: { id: true },
    });
    const projectIds = groupProjects.map((p) => p.id);

    const logs = await prisma.wikeloContributionLog.findMany({
      where: { projectId: { in: projectIds } },
      include: {
        user: { select: { username: true } },
        project: { select: { name: true, displayName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    res.json({
      success: true,
      data: logs.map((l) => ({
        id: l.id,
        username: l.user.username,
        projectName: l.project.displayName || l.project.name,
        itemName: l.itemName,
        delta: l.delta,
        newTotal: l.newTotal,
        createdAt: l.createdAt.toISOString(),
      })),
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /groups/:groupId/projects/:projectId/log — project contribution history
wikeloGroupsRouter.get(
  "/:groupId/projects/:projectId/log",
  requireAuth,
  requireGroupMember,
  async (req, res) => {
    try {
      const logs = await prisma.wikeloContributionLog.findMany({
        where: { projectId: req.params.projectId as string },
        include: {
          user: { select: { username: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 200,
      });

      res.json({
        success: true,
        data: logs.map((l) => ({
          id: l.id,
          username: l.user.username,
          itemName: l.itemName,
          delta: l.delta,
          newTotal: l.newTotal,
          createdAt: l.createdAt.toISOString(),
        })),
      });
    } catch {
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
);

// ─── Shopping List (group-wide aggregation) ───

// GET /groups/:id/shopping-list
wikeloGroupsRouter.get("/:id/shopping-list", requireAuth, requireGroupMember, async (req, res) => {
  try {
    const projects = await prisma.wikeloProject.findMany({
      where: { groupId: req.params.id as string, status: "IN_PROGRESS" },
      include: { materials: true },
      orderBy: { priority: "asc" },
    });

    const aggregated = new Map<string, { needed: number; collected: number }>();
    for (const project of projects) {
      for (const mat of project.materials) {
        const existing = aggregated.get(mat.itemName) || { needed: 0, collected: 0 };
        existing.needed += mat.required;
        existing.collected += mat.collected;
        aggregated.set(mat.itemName, existing);
      }
    }

    // Preserve order from first project's materials
    const seenNames = new Set<string>();
    const orderedNames: string[] = [];
    for (const project of projects) {
      for (const mat of project.materials) {
        if (!seenNames.has(mat.itemName)) {
          seenNames.add(mat.itemName);
          orderedNames.push(mat.itemName);
        }
      }
    }

    const items = orderedNames.map((name) => {
      const data = aggregated.get(name)!;
      return {
        name,
        needed: data.needed,
        collected: data.collected,
        remaining: Math.max(0, data.needed - data.collected),
      };
    });

    const totalNeeded = items.reduce((s, i) => s + i.needed, 0);
    const totalCollected = items.reduce((s, i) => s + Math.min(i.collected, i.needed), 0);
    const overallPct = totalNeeded > 0 ? Math.round((totalCollected / totalNeeded) * 100) : 100;

    res.json({
      success: true,
      data: {
        projectCount: projects.length,
        overallProgress: overallPct,
        totalRemaining: items.reduce((s, i) => s + i.remaining, 0),
        items,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ─── Contributions (who has what) ───

// GET /groups/:id/contributions — net contributions per member
wikeloGroupsRouter.get("/:id/contributions", requireAuth, requireGroupMember, async (req, res) => {
  try {
    const groupProjects = await prisma.wikeloProject.findMany({
      where: { groupId: req.params.id as string },
      select: { id: true },
    });
    const projectIds = groupProjects.map((p) => p.id);

    if (projectIds.length === 0) {
      res.json({ success: true, data: [] });
      return;
    }

    const logs = await prisma.wikeloContributionLog.findMany({
      where: { projectId: { in: projectIds } },
      include: { user: { select: { id: true, username: true } } },
    });

    // Aggregate: userId → itemName → net delta
    const byUser = new Map<string, { username: string; items: Map<string, number> }>();
    for (const log of logs) {
      let entry = byUser.get(log.userId);
      if (!entry) {
        entry = { username: log.user.username, items: new Map() };
        byUser.set(log.userId, entry);
      }
      entry.items.set(log.itemName, (entry.items.get(log.itemName) || 0) + log.delta);
    }

    const data = Array.from(byUser.entries()).map(([userId, { username, items }]) => ({
      userId,
      username,
      items: Array.from(items.entries())
        .filter(([, net]) => net !== 0)
        .map(([itemName, net]) => ({ itemName, net })),
    }));

    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
