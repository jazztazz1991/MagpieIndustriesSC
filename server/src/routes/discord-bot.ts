import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

export const discordBotRouter = Router();

// Shared secret between bot and API — must match BOT_API_SECRET in both .env files
const BOT_SECRET = process.env.DISCORD_BOT_SECRET || "";

function requireBotAuth(req: any, res: any, next: any) {
  const auth = req.headers.authorization;
  if (!BOT_SECRET || auth !== `Bot ${BOT_SECRET}`) {
    res.status(403).json({ success: false, error: "Unauthorized" });
    return;
  }
  next();
}

// --- Link Discord account ---
// POST /api/discord-bot/link
// Bot sends this when a user runs /wikelo link <username>
const linkSchema = z.object({
  discordId: z.string().min(1),
  username: z.string().min(1),
});

discordBotRouter.post("/link", requireBotAuth, async (req, res) => {
  try {
    const parsed = linkSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Invalid input" });
      return;
    }

    const { discordId, username } = parsed.data;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { discordId },
    });

    res.json({ success: true, data: { username: user.username } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// --- Get user's wikelo projects ---
// GET /api/discord-bot/projects/:discordId
discordBotRouter.get("/projects/:discordId", requireBotAuth, async (req, res) => {
  try {
    const discordId = req.params.discordId as string;
    const user = await prisma.user.findUnique({ where: { discordId } });
    if (!user) {
      res.status(404).json({ success: false, error: "Account not linked" });
      return;
    }

    const projects = await prisma.wikeloProject.findMany({
      where: { userId: user.id, status: "IN_PROGRESS" },
      include: { materials: true },
      orderBy: { updatedAt: "desc" },
    });

    const data = projects.map((p) => {
      const totalReq = p.materials.reduce((s, m) => s + m.required, 0);
      const totalCol = p.materials.reduce((s, m) => s + Math.min(m.collected, m.required), 0);
      const progress = totalReq > 0 ? Math.round((totalCol / totalReq) * 100) : 0;
      return {
        id: p.id,
        name: p.name,
        progress,
        materials: p.materials.map((m) => ({
          id: m.id,
          itemName: m.itemName,
          required: m.required,
          collected: m.collected,
        })),
      };
    });

    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// --- Add items to projects ---
// POST /api/discord-bot/add-items
const addItemsSchema = z.object({
  discordId: z.string().min(1),
  itemName: z.string().min(1),
  quantity: z.number().int().min(1),
});

discordBotRouter.post("/add-items", requireBotAuth, async (req, res) => {
  try {
    const parsed = addItemsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Invalid input" });
      return;
    }

    const { discordId, itemName, quantity } = parsed.data;
    const user = await prisma.user.findUnique({ where: { discordId } });
    if (!user) {
      res.status(404).json({ success: false, error: "Account not linked" });
      return;
    }

    // Find all in-progress projects that need this item
    const projects = await prisma.wikeloProject.findMany({
      where: { userId: user.id, status: "IN_PROGRESS" },
      include: { materials: true },
    });

    // Find materials that match and still need items
    const matchingMaterials = projects.flatMap((p) =>
      p.materials
        .filter((m) => m.itemName.toLowerCase() === itemName.toLowerCase() && m.collected < m.required)
        .map((m) => ({ projectId: p.id, projectName: p.name, material: m }))
    );

    if (matchingMaterials.length === 0) {
      res.json({ success: true, data: { updated: 0, message: `No active projects need "${itemName}"` } });
      return;
    }

    // Distribute quantity across projects (fill first incomplete project first)
    let remaining = quantity;
    const updates: { projectName: string; itemName: string; oldCount: number; newCount: number }[] = [];

    for (const { projectName, material } of matchingMaterials) {
      if (remaining <= 0) break;
      const canAdd = material.required - material.collected;
      const toAdd = Math.min(remaining, canAdd);
      const newCollected = material.collected + toAdd;

      await prisma.wikeloProjectMaterial.update({
        where: { id: material.id },
        data: { collected: newCollected },
      });

      updates.push({
        projectName,
        itemName: material.itemName,
        oldCount: material.collected,
        newCount: newCollected,
      });

      remaining -= toAdd;
    }

    // If there's still remaining, add to the first project even if it overflows
    if (remaining > 0 && matchingMaterials.length > 0) {
      const first = matchingMaterials[0];
      const newCollected = first.material.collected + quantity; // full amount to first
      await prisma.wikeloProjectMaterial.update({
        where: { id: first.material.id },
        data: { collected: newCollected },
      });
      // Already tracked in updates
    }

    res.json({
      success: true,
      data: {
        updated: updates.length,
        totalAdded: quantity - remaining,
        updates,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// --- Shopping list (aggregated across all projects) ---
// GET /api/discord-bot/shopping-list/:discordId
discordBotRouter.get("/shopping-list/:discordId", requireBotAuth, async (req, res) => {
  try {
    const discordId = req.params.discordId as string;
    const user = await prisma.user.findUnique({ where: { discordId } });
    if (!user) {
      res.status(404).json({ success: false, error: "Account not linked" });
      return;
    }

    const projects = await prisma.wikeloProject.findMany({
      where: { userId: user.id, status: "IN_PROGRESS" },
      include: { materials: true },
    });

    // Aggregate materials
    const aggregated = new Map<string, { needed: number; collected: number }>();
    for (const project of projects) {
      for (const mat of project.materials) {
        const existing = aggregated.get(mat.itemName) || { needed: 0, collected: 0 };
        existing.needed += mat.required;
        existing.collected += mat.collected;
        aggregated.set(mat.itemName, existing);
      }
    }

    const items = [...aggregated.entries()]
      .map(([name, { needed, collected }]) => ({
        name,
        needed,
        collected,
        remaining: Math.max(0, needed - collected),
      }))
      .sort((a, b) => b.remaining - a.remaining);

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

// ─── Group endpoints for Discord bot ───

// GET /api/discord-bot/groups/:discordId — list user's groups
discordBotRouter.get("/groups/:discordId", requireBotAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { discordId: req.params.discordId as string } });
    if (!user) { res.status(404).json({ success: false, error: "Account not linked" }); return; }

    const groups = await prisma.wikeloGroup.findMany({
      where: { members: { some: { userId: user.id } } },
      include: { members: true, projects: { where: { status: "IN_PROGRESS" }, include: { materials: true } } },
    });

    res.json({
      success: true,
      data: groups.map((g) => ({
        id: g.id,
        name: g.name,
        inviteCode: g.inviteCode,
        memberCount: g.members.length,
        projectCount: g.projects.length,
      })),
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/discord-bot/groups/create — create group from Discord
const createGroupSchema = z.object({
  discordId: z.string().min(1),
  name: z.string().min(1).max(100),
});

discordBotRouter.post("/groups/create", requireBotAuth, async (req, res) => {
  try {
    const parsed = createGroupSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ success: false, error: "Invalid input" }); return; }

    const user = await prisma.user.findUnique({ where: { discordId: parsed.data.discordId } });
    if (!user) { res.status(404).json({ success: false, error: "Account not linked" }); return; }

    const { randomBytes } = await import("crypto");
    const inviteCode = randomBytes(4).toString("hex").toUpperCase();

    const group = await prisma.wikeloGroup.create({
      data: {
        name: parsed.data.name,
        inviteCode,
        ownerId: user.id,
        members: { create: { userId: user.id } },
      },
    });

    res.json({ success: true, data: { id: group.id, name: group.name, inviteCode: group.inviteCode } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/discord-bot/groups/join — join group from Discord
const joinGroupSchema = z.object({
  discordId: z.string().min(1),
  inviteCode: z.string().min(1),
});

discordBotRouter.post("/groups/join", requireBotAuth, async (req, res) => {
  try {
    const parsed = joinGroupSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ success: false, error: "Invalid input" }); return; }

    const user = await prisma.user.findUnique({ where: { discordId: parsed.data.discordId } });
    if (!user) { res.status(404).json({ success: false, error: "Account not linked" }); return; }

    const group = await prisma.wikeloGroup.findUnique({ where: { inviteCode: parsed.data.inviteCode.toUpperCase() } });
    if (!group) { res.status(404).json({ success: false, error: "Invalid invite code" }); return; }

    const existing = await prisma.wikeloGroupMember.findUnique({
      where: { groupId_userId: { groupId: group.id, userId: user.id } },
    });

    if (!existing) {
      await prisma.wikeloGroupMember.create({ data: { groupId: group.id, userId: user.id } });
    }

    res.json({ success: true, data: { groupId: group.id, groupName: group.name, alreadyMember: !!existing } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/discord-bot/groups/:groupId/shopping-list/:discordId — group shopping list
discordBotRouter.get("/groups/:groupId/shopping-list/:discordId", requireBotAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { discordId: req.params.discordId as string } });
    if (!user) { res.status(404).json({ success: false, error: "Account not linked" }); return; }

    // Verify membership
    const member = await prisma.wikeloGroupMember.findUnique({
      where: { groupId_userId: { groupId: req.params.groupId as string, userId: user.id } },
    });
    if (!member) { res.status(403).json({ success: false, error: "Not a group member" }); return; }

    const projects = await prisma.wikeloProject.findMany({
      where: { groupId: req.params.groupId as string, status: "IN_PROGRESS" },
      include: { materials: true },
      orderBy: { priority: "asc" },
    });

    const aggregated = new Map<string, { needed: number; collected: number }>();
    for (const p of projects) {
      for (const m of p.materials) {
        const e = aggregated.get(m.itemName) || { needed: 0, collected: 0 };
        e.needed += m.required;
        e.collected += m.collected;
        aggregated.set(m.itemName, e);
      }
    }

    const items = [...aggregated.entries()].map(([name, { needed, collected }]) => ({
      name, needed, collected, remaining: Math.max(0, needed - collected),
    }));

    const totalNeeded = items.reduce((s, i) => s + i.needed, 0);
    const totalCollected = items.reduce((s, i) => s + Math.min(i.collected, i.needed), 0);

    res.json({
      success: true,
      data: {
        projectCount: projects.length,
        overallProgress: totalNeeded > 0 ? Math.round((totalCollected / totalNeeded) * 100) : 100,
        totalRemaining: items.reduce((s, i) => s + i.remaining, 0),
        items,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/discord-bot/groups/:groupId/add-items — add items to group projects
const groupAddSchema = z.object({
  discordId: z.string().min(1),
  itemName: z.string().min(1),
  quantity: z.number().int().min(1),
});

discordBotRouter.post("/groups/:groupId/add-items", requireBotAuth, async (req, res) => {
  try {
    const parsed = groupAddSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ success: false, error: "Invalid input" }); return; }

    const user = await prisma.user.findUnique({ where: { discordId: parsed.data.discordId } });
    if (!user) { res.status(404).json({ success: false, error: "Account not linked" }); return; }

    const member = await prisma.wikeloGroupMember.findUnique({
      where: { groupId_userId: { groupId: req.params.groupId as string, userId: user.id } },
    });
    if (!member) { res.status(403).json({ success: false, error: "Not a group member" }); return; }

    const projects = await prisma.wikeloProject.findMany({
      where: { groupId: req.params.groupId as string, status: "IN_PROGRESS" },
      include: { materials: true },
      orderBy: { priority: "asc" },
    });

    const matchingMaterials = projects.flatMap((p) =>
      p.materials
        .filter((m) => m.itemName.toLowerCase() === parsed.data.itemName.toLowerCase() && m.collected < m.required)
        .map((m) => ({ projectId: p.id, projectName: (p as any).displayName || p.name, material: m }))
    );

    if (matchingMaterials.length === 0) {
      res.json({ success: true, data: { updated: 0, message: `No group projects need "${parsed.data.itemName}"` } });
      return;
    }

    let remaining = parsed.data.quantity;
    const updates: { projectName: string; itemName: string; oldCount: number; newCount: number }[] = [];

    for (const { projectId, projectName, material } of matchingMaterials) {
      if (remaining <= 0) break;
      const canAdd = material.required - material.collected;
      const toAdd = Math.min(remaining, canAdd);
      const newCollected = material.collected + toAdd;

      await prisma.$transaction([
        prisma.wikeloProjectMaterial.update({ where: { id: material.id }, data: { collected: newCollected } }),
        prisma.wikeloContributionLog.create({
          data: { projectId, userId: user.id, itemName: material.itemName, delta: toAdd, newTotal: newCollected },
        }),
      ]);

      updates.push({ projectName, itemName: material.itemName, oldCount: material.collected, newCount: newCollected });
      remaining -= toAdd;
    }

    res.json({ success: true, data: { updated: updates.length, totalAdded: parsed.data.quantity - remaining, updates } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Natural sort comparator — alphabetical with numeric segments sorted numerically
function naturalCompare(a: string, b: string): number {
  const re = /(\d+|\D+)/g;
  const aParts = a.match(re) || [];
  const bParts = b.match(re) || [];
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const ap = aParts[i] || "";
    const bp = bParts[i] || "";
    const aNum = /^\d+$/.test(ap);
    const bNum = /^\d+$/.test(bp);
    if (aNum && bNum) {
      const diff = parseInt(ap, 10) - parseInt(bp, 10);
      if (diff !== 0) return diff;
    } else {
      const cmp = ap.localeCompare(bp, undefined, { sensitivity: "base" });
      if (cmp !== 0) return cmp;
    }
  }
  return 0;
}

// GET /api/discord-bot/groups/:groupId/detail/:discordId — full group detail
discordBotRouter.get("/groups/:groupId/detail/:discordId", requireBotAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { discordId: req.params.discordId as string } });
    if (!user) { res.status(404).json({ success: false, error: "Account not linked" }); return; }

    const groupId = req.params.groupId as string;
    const member = await prisma.wikeloGroupMember.findUnique({
      where: { groupId_userId: { groupId, userId: user.id } },
    });
    if (!member) { res.status(403).json({ success: false, error: "Not a member of this group" }); return; }

    const group = await prisma.wikeloGroup.findUnique({
      where: { id: groupId },
      include: {
        owner: { select: { username: true } },
        members: { include: { user: { select: { id: true, username: true } } } },
        projects: { include: { materials: true }, orderBy: { priority: "asc" } },
      },
    });
    if (!group) { res.status(404).json({ success: false, error: "Not a member of this group" }); return; }

    // Owner first, then alphabetical
    const members = group.members
      .map((m) => ({
        id: m.user.id,
        username: m.user.username,
        joinedAt: m.joinedAt.toISOString(),
        isOwner: m.user.id === group.ownerId,
      }))
      .sort((a, b) => {
        if (a.isOwner !== b.isOwner) return a.isOwner ? -1 : 1;
        return a.username.localeCompare(b.username);
      });

    const projects = group.projects.map((p) => {
      const totalReq = p.materials.reduce((s, m) => s + m.required, 0);
      const totalCol = p.materials.reduce((s, m) => s + Math.min(m.collected, m.required), 0);
      const progress = totalReq > 0 ? Math.round((totalCol / totalReq) * 100) : 0;
      return {
        id: p.id,
        name: p.displayName || p.name,
        progress,
        status: p.status.toLowerCase(),
        materials: p.materials
          .map((m) => ({ itemName: m.itemName, collected: m.collected, required: m.required }))
          .sort((a, b) => naturalCompare(a.itemName, b.itemName)),
      };
    });

    res.json({
      success: true,
      data: {
        id: group.id,
        name: group.name,
        inviteCode: group.inviteCode,
        ownerId: group.ownerId,
        ownerName: group.owner?.username || "",
        memberCount: members.length,
        members,
        projects,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/discord-bot/groups/:groupId/log/:discordId?limit=20 — activity log
discordBotRouter.get("/groups/:groupId/log/:discordId", requireBotAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { discordId: req.params.discordId as string } });
    if (!user) { res.status(404).json({ success: false, error: "Account not linked" }); return; }

    const groupId = req.params.groupId as string;
    const member = await prisma.wikeloGroupMember.findUnique({
      where: { groupId_userId: { groupId, userId: user.id } },
    });
    if (!member) { res.status(403).json({ success: false, error: "Not a member of this group" }); return; }

    const limitRaw = parseInt(String(req.query.limit || "20"), 10);
    const limit = Math.min(50, Math.max(1, isNaN(limitRaw) ? 20 : limitRaw));

    const groupProjects = await prisma.wikeloProject.findMany({
      where: { groupId },
      select: { id: true },
    });
    const projectIds = groupProjects.map((p) => p.id);

    if (projectIds.length === 0) {
      res.json({ success: true, data: [] });
      return;
    }

    const logs = await prisma.wikeloContributionLog.findMany({
      where: { projectId: { in: projectIds } },
      include: {
        user: { select: { username: true } },
        project: { select: { name: true, displayName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    res.json({
      success: true,
      data: logs.map((l) => ({
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

// GET /api/discord-bot/groups/:groupId/contributions/:discordId — who has what
discordBotRouter.get("/groups/:groupId/contributions/:discordId", requireBotAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { discordId: req.params.discordId as string } });
    if (!user) { res.status(404).json({ success: false, error: "Account not linked" }); return; }

    const groupId = req.params.groupId as string;
    const member = await prisma.wikeloGroupMember.findUnique({
      where: { groupId_userId: { groupId, userId: user.id } },
    });
    if (!member) { res.status(403).json({ success: false, error: "Not a member of this group" }); return; }

    const groupProjects = await prisma.wikeloProject.findMany({
      where: { groupId },
      select: { id: true },
    });
    const projectIds = groupProjects.map((p) => p.id);

    if (projectIds.length === 0) {
      res.json({ success: true, data: { members: [] } });
      return;
    }

    const logs = await prisma.wikeloContributionLog.findMany({
      where: { projectId: { in: projectIds } },
      include: { user: { select: { username: true } } },
    });

    const byUser = new Map<string, { username: string; items: Map<string, number> }>();
    for (const log of logs) {
      let entry = byUser.get(log.userId);
      if (!entry) {
        entry = { username: log.user.username, items: new Map() };
        byUser.set(log.userId, entry);
      }
      entry.items.set(log.itemName, (entry.items.get(log.itemName) || 0) + log.delta);
    }

    const members = Array.from(byUser.values())
      .map(({ username, items }) => ({
        username,
        items: Array.from(items.entries())
          .filter(([, netTotal]) => netTotal !== 0)
          .map(([itemName, netTotal]) => ({ itemName, netTotal }))
          .sort((a, b) => naturalCompare(a.itemName, b.itemName)),
      }))
      .sort((a, b) => a.username.localeCompare(b.username));

    res.json({ success: true, data: { members } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/discord-bot/groups/:groupId/leave — leave a group
const leaveGroupSchema = z.object({
  discordId: z.string().min(1),
});

discordBotRouter.post("/groups/:groupId/leave", requireBotAuth, async (req, res) => {
  try {
    const parsed = leaveGroupSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ success: false, error: "Invalid input" }); return; }

    const user = await prisma.user.findUnique({ where: { discordId: parsed.data.discordId } });
    if (!user) { res.status(404).json({ success: false, error: "Account not linked" }); return; }

    const groupId = req.params.groupId as string;
    const group = await prisma.wikeloGroup.findUnique({ where: { id: groupId } });
    if (!group) { res.status(404).json({ success: false, error: "Not a member of this group" }); return; }

    if (group.ownerId === user.id) {
      res.status(400).json({ success: false, error: "Owner cannot leave — delete the group instead" });
      return;
    }

    const member = await prisma.wikeloGroupMember.findUnique({
      where: { groupId_userId: { groupId, userId: user.id } },
    });
    if (!member) { res.status(403).json({ success: false, error: "Not a member of this group" }); return; }

    await prisma.wikeloGroupMember.deleteMany({
      where: { groupId, userId: user.id },
    });

    res.json({ success: true, data: { groupName: group.name } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
