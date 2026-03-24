import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import type { Request } from "express";

export const suggestionsRouter = Router();

const createSuggestionSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
});

const updateSuggestionSchema = z.object({
  status: z.enum(["PENDING", "UNDER_REVIEW", "PLANNED", "DECLINED"]).optional(),
  adminNotes: z.string().max(5000).optional(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSuggestionDTO(s: any, hasVoted: boolean) {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    status: s.status,
    adminNotes: s.adminNotes,
    voteCount: s._count?.votes ?? 0,
    hasVoted,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    author: { id: s.author.id, username: s.author.username },
  };
}

const suggestionInclude = (userId: string) => ({
  author: { select: { id: true, username: true } },
  _count: { select: { votes: true } },
  votes: { where: { userId }, select: { id: true } },
});

// POST /api/suggestions
suggestionsRouter.post("/", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;
    const parsed = createSuggestionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const suggestion = await prisma.suggestion.create({
      data: { ...parsed.data, authorId: userId },
      include: suggestionInclude(userId),
    });

    res.status(201).json({ success: true, data: toSuggestionDTO(suggestion, false) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/suggestions
suggestionsRouter.get("/", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const sort = req.query.sort === "votes" ? "votes" : "newest";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (status) where.status = status;

    const suggestions = await prisma.suggestion.findMany({
      where,
      include: suggestionInclude(userId),
      orderBy: sort === "votes"
        ? { votes: { _count: "desc" as const } }
        : { createdAt: "desc" as const },
      take: 100,
    });

    res.json({
      success: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: suggestions.map((s: any) => toSuggestionDTO(s, s.votes.length > 0)),
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/suggestions/:id/vote — toggle vote
suggestionsRouter.post("/:id/vote", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;
    const suggestionId = req.params.id as string;

    const existing = await prisma.suggestionVote.findUnique({
      where: { suggestionId_userId: { suggestionId, userId } },
    });

    if (existing) {
      await prisma.suggestionVote.delete({ where: { id: existing.id } });
    } else {
      await prisma.suggestionVote.create({ data: { suggestionId, userId } });
    }

    const suggestion = await prisma.suggestion.findUnique({
      where: { id: suggestionId },
      include: suggestionInclude(userId),
    });

    if (!suggestion) {
      res.status(404).json({ success: false, error: "Suggestion not found" });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const s = suggestion as any;
    res.json({ success: true, data: toSuggestionDTO(s, s.votes.length > 0) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/suggestions/:id — admin update
suggestionsRouter.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;
    const parsed = updateSuggestionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const suggestionId = req.params.id as string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {};
    if (parsed.data.status) data.status = parsed.data.status;
    if (parsed.data.adminNotes !== undefined) data.adminNotes = parsed.data.adminNotes;

    const suggestion = await prisma.suggestion.update({
      where: { id: suggestionId },
      data,
      include: suggestionInclude(userId),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const s = suggestion as any;
    res.json({ success: true, data: toSuggestionDTO(s, s.votes.length > 0) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
