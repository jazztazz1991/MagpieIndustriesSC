import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

export const missionRecipesRouter = Router();

const objectiveSchema = z.object({
  description: z.string().min(1).max(1000),
  sortOrder: z.number().int().default(0),
  isOptional: z.boolean().default(false),
});

const rewardSchema = z.object({
  rewardType: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  quantity: z.string().max(200).optional(),
});

const createMissionSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  missionType: z.string().min(1).max(100),
  difficulty: z.string().max(50).optional(),
  minPlayers: z.number().int().min(1).default(1),
  maxPlayers: z.number().int().min(1).optional(),
  estimatedPay: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  notes: z.string().max(5000).optional(),
  objectives: z.array(objectiveSchema).default([]),
  rewards: z.array(rewardSchema).default([]),
});

const updateMissionSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  missionType: z.string().min(1).max(100).optional(),
  difficulty: z.string().max(50).optional(),
  minPlayers: z.number().int().min(1).optional(),
  maxPlayers: z.number().int().min(1).optional(),
  estimatedPay: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  notes: z.string().max(5000).optional(),
  objectives: z.array(objectiveSchema).optional(),
  rewards: z.array(rewardSchema).optional(),
});

const missionInclude = {
  objectives: {
    select: { id: true, description: true, sortOrder: true, isOptional: true },
    orderBy: { sortOrder: "asc" as const },
  },
  rewards: {
    select: { id: true, rewardType: true, description: true, quantity: true },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toMissionDTO(m: any) {
  return {
    id: m.id,
    name: m.name,
    description: m.description,
    missionType: m.missionType,
    difficulty: m.difficulty,
    minPlayers: m.minPlayers,
    maxPlayers: m.maxPlayers,
    estimatedPay: m.estimatedPay,
    location: m.location,
    notes: m.notes,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    objectives: (m.objectives || []).map((o: any) => ({
      id: o.id, description: o.description, sortOrder: o.sortOrder, isOptional: o.isOptional,
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rewards: (m.rewards || []).map((r: any) => ({
      id: r.id, rewardType: r.rewardType, description: r.description, quantity: r.quantity,
    })),
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  };
}

// GET /api/mission-recipes
missionRecipesRouter.get("/", requireAuth, async (req, res) => {
  try {
    const missionType = typeof req.query.type === "string" ? req.query.type : undefined;
    const where = missionType ? { missionType } : {};

    const missions = await prisma.missionRecipe.findMany({
      where,
      include: missionInclude,
      orderBy: { name: "asc" },
    });

    res.json({ success: true, data: missions.map(toMissionDTO) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/mission-recipes/:id
missionRecipesRouter.get("/:id", requireAuth, async (req, res) => {
  try {
    const missionId = req.params.id as string;
    const mission = await prisma.missionRecipe.findUnique({
      where: { id: missionId },
      include: missionInclude,
    });

    if (!mission) {
      res.status(404).json({ success: false, error: "Mission not found" });
      return;
    }

    res.json({ success: true, data: toMissionDTO(mission) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/mission-recipes — admin only
missionRecipesRouter.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const parsed = createMissionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const { objectives, rewards, ...data } = parsed.data;
    const mission = await prisma.missionRecipe.create({
      data: {
        ...data,
        objectives: { create: objectives },
        rewards: { create: rewards },
      },
      include: missionInclude,
    });

    res.status(201).json({ success: true, data: toMissionDTO(mission) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/mission-recipes/:id — admin only
missionRecipesRouter.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const missionId = req.params.id as string;
    const parsed = updateMissionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const { objectives, rewards, ...data } = parsed.data;

    if (objectives) {
      await prisma.missionObjective.deleteMany({ where: { missionId } });
    }
    if (rewards) {
      await prisma.missionReward.deleteMany({ where: { missionId } });
    }

    const mission = await prisma.missionRecipe.update({
      where: { id: missionId },
      data: {
        ...data,
        ...(objectives ? { objectives: { create: objectives } } : {}),
        ...(rewards ? { rewards: { create: rewards } } : {}),
      },
      include: missionInclude,
    });

    res.json({ success: true, data: toMissionDTO(mission) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /api/mission-recipes/:id — admin only
missionRecipesRouter.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const missionId = req.params.id as string;
    await prisma.missionRecipe.delete({ where: { id: missionId } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
