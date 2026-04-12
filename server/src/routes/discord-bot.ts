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
