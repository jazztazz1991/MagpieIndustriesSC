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
    name: p.displayName || p.name,
    displayName: p.displayName || null,
    status: p.status,
    groupId: p.groupId || null,
    priority: p.priority ?? 0,
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
      where: { userId, groupId: null },
      include: { materials: true },
      orderBy: [{ priority: "asc" }, { updatedAt: "desc" }],
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

    // Get current value for delta calculation
    const currentMaterial = await prisma.wikeloProjectMaterial.findUnique({
      where: { id: req.params.materialId as string },
    });
    if (!currentMaterial) {
      res.status(404).json({ success: false, error: "Material not found" });
      return;
    }

    const delta = parsed.data.collected - currentMaterial.collected;

    // Update material + log contribution in a transaction
    const [material] = await prisma.$transaction([
      prisma.wikeloProjectMaterial.update({
        where: { id: currentMaterial.id },
        data: { collected: parsed.data.collected },
      }),
      prisma.wikeloContributionLog.create({
        data: {
          projectId: project.id,
          userId,
          itemName: currentMaterial.itemName,
          delta,
          newTotal: parsed.data.collected,
        },
      }),
      prisma.wikeloProject.update({
        where: { id: req.params.id as string },
        data: { updatedAt: new Date() },
      }),
    ]);

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

// GET /api/wikelo/projects/:id/log — personal project contribution log
wikeloRouter.get("/projects/:id/log", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;
    const project = await prisma.wikeloProject.findFirst({
      where: { id: req.params.id as string, userId },
    });

    if (!project) {
      res.status(404).json({ success: false, error: "Project not found" });
      return;
    }

    const logs = await prisma.wikeloContributionLog.findMany({
      where: { projectId: project.id },
      include: { user: { select: { username: true } } },
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
});

// PATCH /api/wikelo/projects/:id — update displayName, status, priority
const updateProjectSchema = z.object({
  displayName: z.string().max(200).optional(),
  status: z.enum(["IN_PROGRESS", "COMPLETED", "ABANDONED"]).optional(),
  priority: z.number().int().optional(),
});

wikeloRouter.patch("/projects/:id", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;
    const parsed = updateProjectSchema.safeParse(req.body);

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
});

// POST /api/wikelo/projects/reorder — reorder personal projects
const reorderSchema = z.object({
  projectIds: z.array(z.string()).min(1),
});

wikeloRouter.post("/projects/reorder", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;
    const parsed = reorderSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Invalid input" });
      return;
    }

    // Update priority for each project in order
    await prisma.$transaction(
      parsed.data.projectIds.map((id, index) =>
        prisma.wikeloProject.updateMany({
          where: { id, userId, groupId: null },
          data: { priority: index },
        })
      )
    );

    res.json({ success: true });
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
