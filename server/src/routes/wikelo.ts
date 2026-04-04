import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import type { Request } from "express";

export const wikeloRouter = Router();

const createProjectSchema = z.object({
  contractId: z.string().min(1).max(200),
  name: z.string().min(1).max(200),
  materials: z.array(
    z.object({
      itemName: z.string().min(1).max(200),
      required: z.number().int().min(1),
    })
  ).min(1),
});

const updateMaterialSchema = z.object({
  collected: z.number().int().min(0),
});

const updateStatusSchema = z.object({
  status: z.enum(["IN_PROGRESS", "COMPLETED", "ABANDONED"]),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    name: p.name,
    status: p.status,
    progress,
    materialCount: materials.length,
    materials,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

// GET /api/wikelo/projects
wikeloRouter.get("/projects", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;

    const projects = await prisma.wikeloProject.findMany({
      where: { userId },
      include: { materials: true },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });

    res.json({ success: true, data: projects.map(projectToDTO) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/wikelo/projects/:id
wikeloRouter.get("/projects/:id", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;

    const project = await prisma.wikeloProject.findFirst({
      where: { id: req.params.id as string, userId },
      include: { materials: true },
    });

    if (!project) {
      res.status(404).json({ success: false, error: "Project not found" });
      return;
    }

    res.json({ success: true, data: projectToDTO(project) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/wikelo/projects
wikeloRouter.post("/projects", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;
    const parsed = createProjectSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Invalid input", details: parsed.error.flatten() });
      return;
    }

    const { contractId, name, materials } = parsed.data;

    const project = await prisma.wikeloProject.create({
      data: {
        userId,
        contractId,
        name,
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

// PATCH /api/wikelo/projects/:id/materials/:materialId
wikeloRouter.patch("/projects/:id/materials/:materialId", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;
    const parsed = updateMaterialSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Invalid input" });
      return;
    }

    // Verify project belongs to user
    const project = await prisma.wikeloProject.findFirst({
      where: { id: req.params.id as string, userId },
    });

    if (!project) {
      res.status(404).json({ success: false, error: "Project not found" });
      return;
    }

    const material = await prisma.wikeloProjectMaterial.update({
      where: { id: req.params.materialId as string },
      data: { collected: parsed.data.collected },
    });

    // Update project timestamp
    await prisma.wikeloProject.update({
      where: { id: req.params.id as string },
      data: { updatedAt: new Date() },
    });

    res.json({
      success: true,
      data: {
        id: material.id,
        itemName: material.itemName,
        required: material.required,
        collected: material.collected,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/wikelo/projects/:id
wikeloRouter.patch("/projects/:id", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;
    const parsed = updateStatusSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Invalid input" });
      return;
    }

    const project = await prisma.wikeloProject.findFirst({
      where: { id: req.params.id as string, userId },
    });

    if (!project) {
      res.status(404).json({ success: false, error: "Project not found" });
      return;
    }

    const updated = await prisma.wikeloProject.update({
      where: { id: req.params.id as string },
      data: { status: parsed.data.status },
      include: { materials: true },
    });

    res.json({ success: true, data: projectToDTO(updated) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /api/wikelo/projects/:id
wikeloRouter.delete("/projects/:id", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;

    const project = await prisma.wikeloProject.findFirst({
      where: { id: req.params.id as string, userId },
    });

    if (!project) {
      res.status(404).json({ success: false, error: "Project not found" });
      return;
    }

    await prisma.wikeloProject.delete({
      where: { id: req.params.id as string },
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
