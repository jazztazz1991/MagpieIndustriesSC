import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import type { Request } from "express";
import type { OrgActivityDTO } from "@magpie/shared";

export const orgActivityRouter = Router({ mergeParams: true });

orgActivityRouter.use(requireAuth);

// --- Helpers ---

type AuthRequest = Request & { user: AuthPayload };

function getUser(req: Request): AuthPayload {
  return (req as AuthRequest).user;
}

// --- Routes ---

// GET /api/orgs/:orgId/activity — Get recent org activity
orgActivityRouter.get("/", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;

    // Verify caller is a member
    const membership = await prisma.orgMember.findUnique({
      where: { orgId_userId: { orgId, userId } },
    });
    if (!membership) {
      res.status(403).json({ success: false, error: "Not a member of this org" });
      return;
    }

    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));

    const activities = await prisma.activity.findMany({
      where: { orgId },
      select: {
        id: true,
        userId: true,
        type: true,
        targetId: true,
        metadata: true,
        createdAt: true,
        user: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const data: OrgActivityDTO[] = activities.map((a) => ({
      id: a.id,
      userId: a.userId,
      type: a.type,
      targetId: a.targetId,
      metadata: a.metadata as Record<string, unknown> | null,
      createdAt: a.createdAt.toISOString(),
      user: a.user,
    }));

    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
