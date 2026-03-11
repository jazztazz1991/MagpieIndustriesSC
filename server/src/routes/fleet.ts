import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import type { Request } from "express";
import type { FleetShipDTO } from "@magpie/shared";

export const fleetRouter = Router({ mergeParams: true });

// All routes require authentication
fleetRouter.use(requireAuth);

// --- Zod Schemas ---

const addShipSchema = z.object({
  shipId: z.string().min(1).optional(),
  shipName: z.string().min(1).max(100),
  nickname: z.string().max(100).optional(),
});

const updateShipSchema = z.object({
  nickname: z.string().max(100).nullable().optional(),
  status: z.enum(["ACTIVE", "DESTROYED", "LOANED", "IN_REPAIR"]).optional(),
});

// --- Helpers ---

type AuthRequest = Request & { user: AuthPayload };

function getUser(req: Request): AuthPayload {
  return (req as AuthRequest).user;
}

const publicUserSelect = {
  id: true,
  username: true,
  rsiHandle: true,
  avatarUrl: true,
  bio: true,
  role: true,
} as const;

async function hasOrgPermission(
  orgId: string,
  userId: string,
  permission: string
): Promise<boolean> {
  const member = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId } },
    include: { role: true, org: { select: { ownerId: true } } },
  });
  if (!member) return false;
  if (member.org.ownerId === userId) return true;
  if (!member.role) return false;
  const perms = member.role.permissions as string[];
  return perms.includes(permission);
}

async function isOrgMember(orgId: string, userId: string): Promise<boolean> {
  const member = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId } },
    select: { id: true },
  });
  return !!member;
}

// --- Routes ---

// GET /api/orgs/:orgId/fleet — List all ships in org fleet
fleetRouter.get("/", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;

    if (!(await isOrgMember(orgId, userId))) {
      res.status(403).json({ success: false, error: "Not a member of this org" });
      return;
    }

    const raw = await prisma.fleetShip.findMany({
      where: { orgId },
      select: {
        id: true,
        shipId: true,
        shipName: true,
        nickname: true,
        status: true,
        createdAt: true,
        owner: {
          select: publicUserSelect,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const ships: FleetShipDTO[] = raw.map((s) => ({
      id: s.id,
      shipId: s.shipId,
      shipName: s.shipName,
      nickname: s.nickname,
      status: s.status as FleetShipDTO["status"],
      createdAt: s.createdAt.toISOString(),
      owner: s.owner,
    }));

    res.json({ success: true, data: ships });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/orgs/:orgId/fleet — Add ship to fleet
fleetRouter.post("/", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;

    if (!(await isOrgMember(orgId, userId))) {
      res.status(403).json({ success: false, error: "Not a member of this org" });
      return;
    }

    const parsed = addShipSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const { shipId, shipName, nickname } = parsed.data;

    const ship = await prisma.fleetShip.create({
      data: {
        orgId,
        ownerId: userId,
        shipId: shipId || shipName,
        shipName,
        nickname,
      },
      select: {
        id: true,
        shipId: true,
        shipName: true,
        nickname: true,
        status: true,
        createdAt: true,
        owner: {
          select: publicUserSelect,
        },
      },
    });

    res.status(201).json({ success: true, data: ship });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/orgs/:orgId/fleet/:id — Update ship (nickname, status)
fleetRouter.patch("/:id", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;
    const id = req.params.id as string;

    const parsed = updateShipSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const ship = await prisma.fleetShip.findUnique({
      where: { id },
      select: { orgId: true, ownerId: true },
    });

    if (!ship || ship.orgId !== orgId) {
      res.status(404).json({ success: false, error: "Ship not found" });
      return;
    }

    const isOwner = ship.ownerId === userId;
    const canManage = await hasOrgPermission(orgId, userId, "manage_fleet");

    if (!isOwner && !canManage) {
      res.status(403).json({ success: false, error: "Only the ship owner or fleet managers can update this ship" });
      return;
    }

    const { nickname, status } = parsed.data;

    const updated = await prisma.fleetShip.update({
      where: { id },
      data: {
        ...(nickname !== undefined && { nickname }),
        ...(status !== undefined && { status }),
      },
      select: {
        id: true,
        shipId: true,
        shipName: true,
        nickname: true,
        status: true,
        createdAt: true,
        owner: {
          select: publicUserSelect,
        },
      },
    });

    res.json({ success: true, data: updated });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /api/orgs/:orgId/fleet/:id — Remove ship
fleetRouter.delete("/:id", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;
    const id = req.params.id as string;

    const ship = await prisma.fleetShip.findUnique({
      where: { id },
      select: { orgId: true, ownerId: true },
    });

    if (!ship || ship.orgId !== orgId) {
      res.status(404).json({ success: false, error: "Ship not found" });
      return;
    }

    const isOwner = ship.ownerId === userId;
    const canManage = await hasOrgPermission(orgId, userId, "manage_fleet");

    if (!isOwner && !canManage) {
      res.status(403).json({ success: false, error: "Only the ship owner or fleet managers can remove this ship" });
      return;
    }

    await prisma.fleetShip.delete({ where: { id } });

    res.json({ success: true, data: { message: "Ship removed" } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
