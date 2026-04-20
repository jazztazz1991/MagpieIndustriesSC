import { Router } from "express";
import type { Request } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

export const refinerySubmissionsRouter = Router();

function getUserId(req: Request): string {
  return (req as Request & { user: AuthPayload }).user.userId;
}

const submitSchema = z.object({
  stationName: z.string().min(1).max(100),
  oreName: z.string().min(1).max(100),
  bonusPct: z.number().int().min(-100).max(100),
  notes: z.string().max(500).optional(),
});

// POST /api/refinery-submissions — submit a bonus (auth required)
refinerySubmissionsRouter.post("/", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const parsed = submitSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Invalid input" });
      return;
    }

    const submission = await prisma.refinerySubmission.create({
      data: {
        userId,
        stationName: parsed.data.stationName,
        oreName: parsed.data.oreName,
        bonusPct: parsed.data.bonusPct,
        notes: parsed.data.notes,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: submission.id,
        status: submission.status,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/refinery-submissions/approved — public: approved submissions only
refinerySubmissionsRouter.get("/approved", async (_req, res) => {
  try {
    const approved = await prisma.refinerySubmission.findMany({
      where: { status: "APPROVED" },
      select: {
        stationName: true,
        oreName: true,
        bonusPct: true,
        reviewedAt: true,
      },
      orderBy: { reviewedAt: "desc" },
    });
    res.json({ success: true, data: approved });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/refinery-submissions — admin: list all with filter
refinerySubmissionsRouter.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    const where = status && ["PENDING", "APPROVED", "REJECTED"].includes(status.toUpperCase())
      ? { status: status.toUpperCase() as "PENDING" | "APPROVED" | "REJECTED" }
      : {};

    const submissions = await prisma.refinerySubmission.findMany({
      where,
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    res.json({
      success: true,
      data: submissions.map((s) => ({
        id: s.id,
        username: s.user.username,
        stationName: s.stationName,
        oreName: s.oreName,
        bonusPct: s.bonusPct,
        notes: s.notes,
        status: s.status,
        reviewedAt: s.reviewedAt?.toISOString() || null,
        createdAt: s.createdAt.toISOString(),
      })),
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/refinery-submissions/:id — admin approve/reject
const reviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

refinerySubmissionsRouter.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const adminId = getUserId(req);
    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Invalid input" });
      return;
    }

    const submission = await prisma.refinerySubmission.findUnique({
      where: { id: req.params.id as string },
    });
    if (!submission) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }

    const updated = await prisma.refinerySubmission.update({
      where: { id: submission.id },
      data: {
        status: parsed.data.status,
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
    });

    res.json({
      success: true,
      data: {
        id: updated.id,
        status: updated.status,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
