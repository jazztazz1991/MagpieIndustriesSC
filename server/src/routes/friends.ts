import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import type { Request } from "express";

export const friendsRouter = Router();

// --- Zod Schemas ---

const sendRequestSchema = z.object({
  username: z.string().min(1).max(30),
});

// --- DTO helpers ---

const publicUserSelect = {
  id: true,
  username: true,
  rsiHandle: true,
  avatarUrl: true,
  bio: true,
  role: true,
} as const;

function toPublicUser(user: {
  id: string;
  username: string;
  rsiHandle: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
}) {
  return {
    id: user.id,
    username: user.username,
    rsiHandle: user.rsiHandle,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    role: user.role,
  };
}

// --- Helper to extract auth payload ---

function getUser(req: Request): AuthPayload {
  return (req as Request & { user: AuthPayload }).user;
}

// GET /api/friends — List accepted friends for current user
friendsRouter.get("/", requireAuth, async (req, res) => {
  try {
    const { userId } = getUser(req);

    const friendships = await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      select: {
        id: true,
        createdAt: true,
        requester: { select: publicUserSelect },
        addressee: { select: publicUserSelect },
      },
    });

    const friends = friendships.map((f) => {
      const friend =
        f.requester.id === userId ? f.addressee : f.requester;
      return {
        friendshipId: f.id,
        since: f.createdAt,
        user: toPublicUser(friend),
      };
    });

    res.json({ success: true, data: friends });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/friends/requests — List pending friend requests received
friendsRouter.get("/requests", requireAuth, async (req, res) => {
  try {
    const { userId } = getUser(req);

    const requests = await prisma.friendship.findMany({
      where: {
        addresseeId: userId,
        status: "PENDING",
      },
      select: {
        id: true,
        createdAt: true,
        requester: { select: publicUserSelect },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = requests.map((r) => ({
      friendshipId: r.id,
      createdAt: r.createdAt,
      user: toPublicUser(r.requester),
    }));

    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/friends/request — Send friend request
friendsRouter.post("/request", requireAuth, async (req, res) => {
  try {
    const { userId } = getUser(req);

    const parsed = sendRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const { username } = parsed.data;

    // Find target user
    const targetUser = await prisma.user.findUnique({
      where: { username },
      select: publicUserSelect,
    });

    if (!targetUser) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    // Can't friend yourself
    if (targetUser.id === userId) {
      res
        .status(400)
        .json({ success: false, error: "Cannot send a friend request to yourself" });
      return;
    }

    // Check for existing friendship in either direction
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: targetUser.id },
          { requesterId: targetUser.id, addresseeId: userId },
        ],
      },
    });

    if (existing) {
      if (existing.status === "ACCEPTED") {
        res
          .status(409)
          .json({ success: false, error: "Already friends with this user" });
        return;
      }
      if (existing.status === "PENDING") {
        res
          .status(409)
          .json({ success: false, error: "A friend request already exists" });
        return;
      }
      // REJECTED — allow resending by deleting old record
      await prisma.friendship.delete({ where: { id: existing.id } });
    }

    const friendship = await prisma.friendship.create({
      data: {
        requesterId: userId,
        addresseeId: targetUser.id,
        status: "PENDING",
      },
      select: { id: true, createdAt: true },
    });

    // Create activity record
    await prisma.activity.create({
      data: {
        userId,
        type: "friend_request_sent",
        targetId: targetUser.id,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        friendshipId: friendship.id,
        createdAt: friendship.createdAt,
        user: toPublicUser(targetUser),
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/friends/:id/accept — Accept a friend request
friendsRouter.patch("/:id/accept", requireAuth, async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    const friendship = await prisma.friendship.findUnique({
      where: { id },
      select: {
        id: true,
        addresseeId: true,
        requesterId: true,
        status: true,
        requester: { select: publicUserSelect },
      },
    });

    if (!friendship) {
      res.status(404).json({ success: false, error: "Friend request not found" });
      return;
    }

    if (friendship.addresseeId !== userId) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }

    if (friendship.status !== "PENDING") {
      res
        .status(400)
        .json({ success: false, error: "Request is no longer pending" });
      return;
    }

    await prisma.friendship.update({
      where: { id },
      data: { status: "ACCEPTED" },
    });

    // Create activity record
    await prisma.activity.create({
      data: {
        userId,
        type: "friend_added",
        targetId: friendship.requesterId,
        metadata: { friendUsername: friendship.requester.username },
      },
    });

    res.json({ success: true, data: { friendshipId: id, status: "ACCEPTED" } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/friends/:id/reject — Reject a friend request
friendsRouter.patch("/:id/reject", requireAuth, async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    const friendship = await prisma.friendship.findUnique({
      where: { id },
      select: { id: true, addresseeId: true, status: true },
    });

    if (!friendship) {
      res.status(404).json({ success: false, error: "Friend request not found" });
      return;
    }

    if (friendship.addresseeId !== userId) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }

    if (friendship.status !== "PENDING") {
      res
        .status(400)
        .json({ success: false, error: "Request is no longer pending" });
      return;
    }

    await prisma.friendship.update({
      where: { id },
      data: { status: "REJECTED" },
    });

    res.json({ success: true, data: { friendshipId: id, status: "REJECTED" } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /api/friends/:id — Remove a friend / cancel request
friendsRouter.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    const friendship = await prisma.friendship.findUnique({
      where: { id },
      select: { id: true, requesterId: true, addresseeId: true },
    });

    if (!friendship) {
      res.status(404).json({ success: false, error: "Friendship not found" });
      return;
    }

    if (
      friendship.requesterId !== userId &&
      friendship.addresseeId !== userId
    ) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }

    await prisma.friendship.delete({ where: { id } });

    res.json({ success: true, data: { deleted: true } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
