import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import type { Request } from "express";

export const eventsRouter = Router();

// --- Zod Schemas ---

const createEventSchema = z.object({
  groupId: z.string().min(1),
  title: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  eventType: z.enum(["mining", "salvage", "combat", "trade", "social", "other"]),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
});

const updateEventSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().max(1000).optional(),
  eventType: z.enum(["mining", "salvage", "combat", "trade", "social", "other"]).optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
});

const rsvpSchema = z.object({
  status: z.enum(["GOING", "MAYBE", "NOT_GOING"]),
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

// GET /api/events — List upcoming events for current user's groups
eventsRouter.get("/", requireAuth, async (req, res) => {
  try {
    const { userId } = getUser(req);

    // Find all groups the user is a member of
    const memberships = await prisma.groupMember.findMany({
      where: { userId },
      select: { groupId: true },
    });

    const groupIds = memberships.map((m) => m.groupId);

    if (groupIds.length === 0) {
      res.json({ success: true, data: [] });
      return;
    }

    const events = await prisma.event.findMany({
      where: {
        groupId: { in: groupIds },
        startsAt: { gte: new Date() },
      },
      select: {
        id: true,
        title: true,
        eventType: true,
        startsAt: true,
        endsAt: true,
        createdAt: true,
        creator: { select: publicUserSelect },
        group: { select: { id: true, name: true } },
        _count: { select: { attendees: true } },
      },
      orderBy: { startsAt: "asc" },
    });

    const data = events.map((e) => ({
      id: e.id,
      title: e.title,
      eventType: e.eventType,
      startsAt: e.startsAt,
      endsAt: e.endsAt,
      createdAt: e.createdAt,
      creator: toPublicUser(e.creator),
      group: e.group,
      attendeeCount: e._count.attendees,
    }));

    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/events/:id — Get event detail
eventsRouter.get("/:id", requireAuth, async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    const event = await prisma.event.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        eventType: true,
        startsAt: true,
        endsAt: true,
        createdAt: true,
        groupId: true,
        creatorId: true,
        creator: { select: publicUserSelect },
        group: { select: { id: true, name: true } },
        attendees: {
          select: {
            id: true,
            status: true,
            user: { select: publicUserSelect },
          },
        },
      },
    });

    if (!event) {
      res.status(404).json({ success: false, error: "Event not found" });
      return;
    }

    // Verify user is member of the event's group (group events only)
    if (event.groupId) {
      const membership = await prisma.groupMember.findUnique({
        where: {
          groupId_userId: { groupId: event.groupId, userId },
        },
      });

      if (!membership) {
        res.status(403).json({ success: false, error: "Forbidden" });
        return;
      }
    }

    const data = {
      id: event.id,
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      createdAt: event.createdAt,
      creatorId: event.creatorId,
      creator: toPublicUser(event.creator),
      group: event.group,
      attendees: event.attendees.map((a) => ({
        id: a.id,
        status: a.status,
        user: toPublicUser(a.user),
      })),
    };

    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/events — Create event
eventsRouter.post("/", requireAuth, async (req, res) => {
  try {
    const { userId } = getUser(req);

    const parsed = createEventSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const { groupId, title, description, eventType, startsAt, endsAt } =
      parsed.data;

    // Verify user is member of the group
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: { groupId, userId },
      },
    });

    if (!membership) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }

    // Get group name for activity metadata
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { name: true },
    });

    if (!group) {
      res.status(404).json({ success: false, error: "Group not found" });
      return;
    }

    // Create event + auto-RSVP creator as GOING
    const event = await prisma.event.create({
      data: {
        groupId,
        creatorId: userId,
        title,
        description,
        eventType,
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : undefined,
        attendees: {
          create: {
            userId,
            status: "GOING",
          },
        },
      },
      select: {
        id: true,
        title: true,
        eventType: true,
        startsAt: true,
        endsAt: true,
        createdAt: true,
        creator: { select: publicUserSelect },
        group: { select: { id: true, name: true } },
        _count: { select: { attendees: true } },
      },
    });

    // Create activity record
    await prisma.activity.create({
      data: {
        userId,
        type: "event_created",
        targetId: event.id,
        metadata: { eventTitle: title, groupName: group.name },
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: event.id,
        title: event.title,
        eventType: event.eventType,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
        createdAt: event.createdAt,
        creator: toPublicUser(event.creator),
        group: event.group,
        attendeeCount: event._count.attendees,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/events/:id/rsvp — RSVP to event
eventsRouter.post("/:id/rsvp", requireAuth, async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    const parsed = rsvpSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const { status } = parsed.data;

    // Get event to check group membership
    const event = await prisma.event.findUnique({
      where: { id },
      select: { id: true, groupId: true },
    });

    if (!event) {
      res.status(404).json({ success: false, error: "Event not found" });
      return;
    }

    // Verify user is member of the event's group (group events only)
    if (event.groupId) {
      const membership = await prisma.groupMember.findUnique({
        where: {
          groupId_userId: { groupId: event.groupId, userId },
        },
      });

      if (!membership) {
        res.status(403).json({ success: false, error: "Forbidden" });
        return;
      }
    }

    // Upsert RSVP record
    const rsvp = await prisma.eventRSVP.upsert({
      where: {
        eventId_userId: { eventId: id, userId },
      },
      update: { status },
      create: { eventId: id, userId, status },
      select: { id: true, status: true },
    });

    res.json({ success: true, data: { id: rsvp.id, status: rsvp.status } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/events/:id — Update event (creator only)
eventsRouter.patch("/:id", requireAuth, async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    const parsed = updateEventSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const event = await prisma.event.findUnique({
      where: { id },
      select: { id: true, creatorId: true },
    });

    if (!event) {
      res.status(404).json({ success: false, error: "Event not found" });
      return;
    }

    if (event.creatorId !== userId) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }

    const { title, description, eventType, startsAt, endsAt } = parsed.data;

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(eventType !== undefined && { eventType }),
        ...(startsAt !== undefined && { startsAt: new Date(startsAt) }),
        ...(endsAt !== undefined && { endsAt: new Date(endsAt) }),
      },
      select: {
        id: true,
        title: true,
        description: true,
        eventType: true,
        startsAt: true,
        endsAt: true,
        createdAt: true,
        creatorId: true,
        creator: { select: publicUserSelect },
        group: { select: { id: true, name: true } },
        _count: { select: { attendees: true } },
      },
    });

    res.json({
      success: true,
      data: {
        id: updated.id,
        title: updated.title,
        description: updated.description,
        eventType: updated.eventType,
        startsAt: updated.startsAt,
        endsAt: updated.endsAt,
        createdAt: updated.createdAt,
        creatorId: updated.creatorId,
        creator: toPublicUser(updated.creator),
        group: updated.group,
        attendeeCount: updated._count.attendees,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /api/events/:id — Delete event (creator or group leader only)
eventsRouter.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { userId } = getUser(req);
    const id = req.params.id as string;

    const event = await prisma.event.findUnique({
      where: { id },
      select: { id: true, creatorId: true, groupId: true },
    });

    if (!event) {
      res.status(404).json({ success: false, error: "Event not found" });
      return;
    }

    // Allow creator or group leader to delete
    if (event.creatorId !== userId) {
      let isGroupLeader = false;
      if (event.groupId) {
        const membership = await prisma.groupMember.findUnique({
          where: {
            groupId_userId: { groupId: event.groupId, userId },
          },
          select: { role: true },
        });
        isGroupLeader = membership?.role === "LEADER";
      }

      if (!isGroupLeader) {
        res.status(403).json({ success: false, error: "Forbidden" });
        return;
      }
    }

    await prisma.event.delete({ where: { id } });

    res.json({ success: true, data: { deleted: true } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
