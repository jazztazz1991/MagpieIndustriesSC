import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import type { Request } from "express";

export const reportsRouter = Router();

const createReportSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  type: z.enum(["BUG", "DATA_ISSUE"]),
  pageUrl: z.string().max(500).optional(),
});

const updateReportSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  adminNotes: z.string().max(5000).optional(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toReportDTO(r: any) {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    type: r.type,
    status: r.status,
    pageUrl: r.pageUrl,
    adminNotes: r.adminNotes,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    author: { id: r.author.id, username: r.author.username },
  };
}

// POST /api/reports
reportsRouter.post("/", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;
    const parsed = createReportSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const report = await prisma.report.create({
      data: { ...parsed.data, authorId: userId },
      include: { author: { select: { id: true, username: true } } },
    });

    res.status(201).json({ success: true, data: toReportDTO(report) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/reports
reportsRouter.get("/", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;
    const admin = await prisma.user.findUnique({ where: { id: userId }, select: { isAdmin: true } });
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const type = typeof req.query.type === "string" ? req.query.type : undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (!admin?.isAdmin) where.authorId = userId;
    if (status) where.status = status;
    if (type) where.type = type;

    const reports = await prisma.report.findMany({
      where,
      include: { author: { select: { id: true, username: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    res.json({ success: true, data: reports.map(toReportDTO) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/reports/:id
reportsRouter.get("/:id", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;
    const reportId = req.params.id as string;

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: { author: { select: { id: true, username: true } } },
    });

    if (!report) {
      res.status(404).json({ success: false, error: "Report not found" });
      return;
    }

    const admin = await prisma.user.findUnique({ where: { id: userId }, select: { isAdmin: true } });
    if (!admin?.isAdmin && report.authorId !== userId) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }

    res.json({ success: true, data: toReportDTO(report) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/reports/:id — admin only
reportsRouter.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const parsed = updateReportSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const reportId = req.params.id as string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {};
    if (parsed.data.status) data.status = parsed.data.status;
    if (parsed.data.adminNotes !== undefined) data.adminNotes = parsed.data.adminNotes;

    const report = await prisma.report.update({
      where: { id: reportId },
      data,
      include: { author: { select: { id: true, username: true } } },
    });

    res.json({ success: true, data: toReportDTO(report) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
