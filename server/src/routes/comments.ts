import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import type { Request } from "express";

export const commentsRouter = Router();

const publicUserSelect = {
  id: true,
  username: true,
  rsiHandle: true,
  avatarUrl: true,
  bio: true,
  role: true,
} as const;

function getUser(req: Request): AuthPayload {
  return (req as Request & { user: AuthPayload }).user;
}

// Allowlist of valid guide paths
const ALLOWED_GUIDE_PATHS = [
  "/guides/beginner",
  "/guides/wikelo",
  "/guides/wikelo/reputation",
  "/guides/wikelo/items",
  "/guides/wikelo/emporiums",
  "/guides/wikelo/rewards",
  "/guides/wikelo/favors",
  "/guides/wikelo/tracker",
] as const;

// --- Zod Schemas ---

const getCommentsSchema = z.object({
  guidePath: z.string().min(1),
});

const createCommentSchema = z.object({
  guidePath: z.string().refine(
    (val) => (ALLOWED_GUIDE_PATHS as readonly string[]).includes(val),
    { message: "Invalid guide path" }
  ),
  content: z.string().min(1, "Comment cannot be empty").max(2000, "Comment too long"),
});

// GET /api/comments?guidePath=/guides/wikelo — Public, no auth required
commentsRouter.get("/", async (req, res) => {
  try {
    const parsed = getCommentsSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "guidePath query parameter is required" });
      return;
    }

    const { guidePath } = parsed.data;

    const comments = await prisma.comment.findMany({
      where: { guidePath },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        content: true,
        guidePath: true,
        createdAt: true,
        updatedAt: true,
        user: { select: publicUserSelect },
      },
    });

    res.json({ success: true, data: comments });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/comments — Requires auth
commentsRouter.post("/", requireAuth, async (req, res) => {
  try {
    const { userId } = getUser(req);

    const parsed = createCommentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const { guidePath, content } = parsed.data;

    const comment = await prisma.comment.create({
      data: {
        userId,
        guidePath,
        content,
      },
      select: {
        id: true,
        content: true,
        guidePath: true,
        createdAt: true,
        updatedAt: true,
        user: { select: publicUserSelect },
      },
    });

    // Create activity record
    await prisma.activity.create({
      data: {
        userId,
        type: "comment_posted",
        targetId: comment.id,
        metadata: { guidePath },
      },
    });

    res.status(201).json({ success: true, data: comment });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /api/comments/:id — Requires auth, own comment or admin
commentsRouter.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { userId, role } = getUser(req);
    const id = req.params.id as string;

    const comment = await prisma.comment.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!comment) {
      res.status(404).json({ success: false, error: "Comment not found" });
      return;
    }

    if (comment.userId !== userId && role !== "ADMIN") {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }

    await prisma.comment.delete({ where: { id } });

    res.json({ success: true, data: { deleted: true } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
