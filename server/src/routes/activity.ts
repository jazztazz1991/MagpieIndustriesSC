import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import type { Request } from "express";

export const activityRouter = Router();

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

// GET /api/activity — Activity feed for current user + accepted friends
activityRouter.get("/", requireAuth, async (req, res) => {
  try {
    const { userId } = getUser(req);

    // Find accepted friend IDs
    const friendships = await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      select: {
        requesterId: true,
        addresseeId: true,
      },
    });

    const friendIds = friendships.map((f) =>
      f.requesterId === userId ? f.addresseeId : f.requesterId
    );

    const userIds = [userId, ...friendIds];

    const activities = await prisma.activity.findMany({
      where: { userId: { in: userIds } },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        type: true,
        targetId: true,
        metadata: true,
        createdAt: true,
        user: { select: publicUserSelect },
      },
    });

    res.json({ success: true, data: activities });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/activity/me — Only current user's activities
activityRouter.get("/me", requireAuth, async (req, res) => {
  try {
    const { userId } = getUser(req);

    const activities = await prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        type: true,
        targetId: true,
        metadata: true,
        createdAt: true,
        user: { select: publicUserSelect },
      },
    });

    res.json({ success: true, data: activities });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
