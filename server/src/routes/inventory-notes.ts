import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import type { Request } from "express";

export const inventoryNotesRouter = Router();

const createNoteSchema = z.object({
  itemName: z.string().min(1).max(200),
  totalCount: z.number().int().min(0).default(0),
  sellCount: z.number().int().min(0).default(0),
  keepCount: z.number().int().min(0).default(0),
  notes: z.string().max(1000).optional(),
});

const updateNoteSchema = z.object({
  itemName: z.string().min(1).max(200).optional(),
  totalCount: z.number().int().min(0).optional(),
  sellCount: z.number().int().min(0).optional(),
  keepCount: z.number().int().min(0).optional(),
  notes: z.string().max(1000).nullable().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDTO(n: any) {
  return {
    id: n.id,
    itemName: n.itemName,
    totalCount: n.totalCount,
    sellCount: n.sellCount,
    keepCount: n.keepCount,
    notes: n.notes,
    createdAt: n.createdAt.toISOString(),
    updatedAt: n.updatedAt.toISOString(),
  };
}

// GET /api/inventory-notes
inventoryNotesRouter.get("/", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;

    const notes = await prisma.inventoryNote.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    res.json({ success: true, data: notes.map(toDTO) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/inventory-notes
inventoryNotesRouter.post("/", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;
    const parsed = createNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const note = await prisma.inventoryNote.create({
      data: { ...parsed.data, userId },
    });

    res.status(201).json({ success: true, data: toDTO(note) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/inventory-notes/:id
inventoryNotesRouter.patch("/:id", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;
    const noteId = req.params.id as string;

    const existing = await prisma.inventoryNote.findUnique({
      where: { id: noteId },
      select: { userId: true },
    });

    if (!existing) {
      res.status(404).json({ success: false, error: "Note not found" });
      return;
    }
    if (existing.userId !== userId) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }

    const parsed = updateNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const note = await prisma.inventoryNote.update({
      where: { id: noteId },
      data: parsed.data,
    });

    res.json({ success: true, data: toDTO(note) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /api/inventory-notes/:id
inventoryNotesRouter.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;
    const noteId = req.params.id as string;

    const existing = await prisma.inventoryNote.findUnique({
      where: { id: noteId },
      select: { userId: true },
    });

    if (!existing) {
      res.status(404).json({ success: false, error: "Note not found" });
      return;
    }
    if (existing.userId !== userId) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }

    await prisma.inventoryNote.delete({ where: { id: noteId } });

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
