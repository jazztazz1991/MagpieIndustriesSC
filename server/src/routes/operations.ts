import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import type { Request } from "express";
import type {
  OperationSummaryDTO,
  OperationDetailDTO,
} from "@magpie/shared";

export const operationsRouter = Router({ mergeParams: true });

// All routes require authentication
operationsRouter.use(requireAuth);

// --- Zod Schemas ---

const createOperationSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).nullable().optional(),
  operationType: z.string().min(1),
  startsAt: z.string().datetime().nullable().optional(),
  endsAt: z.string().datetime().nullable().optional(),
});

const updateOperationSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  status: z.enum(["PLANNING", "ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
  startsAt: z.string().datetime().nullable().optional(),
  endsAt: z.string().datetime().nullable().optional(),
});

const addShipSchema = z.object({
  fleetShipId: z.string().min(1),
});

const assignCrewSchema = z.object({
  userId: z.string().min(1),
  position: z.string().min(1).max(100),
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

// GET /api/orgs/:orgId/operations — List operations for org
operationsRouter.get("/", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;

    if (!(await isOrgMember(orgId, userId))) {
      res.status(403).json({ success: false, error: "Not a member of this org" });
      return;
    }

    const operations = await prisma.operation.findMany({
      where: { orgId },
      select: {
        id: true,
        title: true,
        operationType: true,
        status: true,
        startsAt: true,
        endsAt: true,
        createdAt: true,
        creator: {
          select: publicUserSelect,
        },
        _count: {
          select: {
            ships: true,
          },
        },
        ships: {
          select: {
            _count: {
              select: { crewAssignments: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const data: OperationSummaryDTO[] = operations.map((op) => ({
      id: op.id,
      title: op.title,
      operationType: op.operationType,
      status: op.status as OperationSummaryDTO["status"],
      startsAt: op.startsAt?.toISOString() ?? null,
      endsAt: op.endsAt?.toISOString() ?? null,
      creator: op.creator,
      shipCount: op._count.ships,
      crewCount: op.ships.reduce((sum, s) => sum + s._count.crewAssignments, 0),
      createdAt: op.createdAt.toISOString(),
    }));

    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/orgs/:orgId/operations — Create operation
operationsRouter.post("/", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;

    if (!(await hasOrgPermission(orgId, userId, "manage_operations"))) {
      res.status(403).json({ success: false, error: "You do not have permission to manage operations" });
      return;
    }

    const parsed = createOperationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const { title, description, operationType, startsAt, endsAt } = parsed.data;

    const operation = await prisma.operation.create({
      data: {
        orgId,
        creatorId: userId,
        title,
        description,
        operationType,
        startsAt: startsAt ? new Date(startsAt) : undefined,
        endsAt: endsAt ? new Date(endsAt) : undefined,
      },
      select: {
        id: true,
        title: true,
        description: true,
        operationType: true,
        status: true,
        startsAt: true,
        endsAt: true,
        createdAt: true,
        creator: {
          select: publicUserSelect,
        },
      },
    });

    // Create activity record
    await prisma.activity.create({
      data: {
        userId,
        type: "operation_created",
        targetId: operation.id,
        metadata: { operationTitle: operation.title, orgId },
      },
    });

    res.status(201).json({ success: true, data: operation });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/orgs/:orgId/operations/:id — Get operation detail
operationsRouter.get("/:id", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;
    const id = req.params.id as string;

    if (!(await isOrgMember(orgId, userId))) {
      res.status(403).json({ success: false, error: "Not a member of this org" });
      return;
    }

    const operation = await prisma.operation.findUnique({
      where: { id },
      select: {
        id: true,
        orgId: true,
        title: true,
        description: true,
        operationType: true,
        status: true,
        startsAt: true,
        endsAt: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: publicUserSelect,
        },
        ships: {
          select: {
            id: true,
            fleetShip: {
              select: {
                id: true,
                shipId: true,
                shipName: true,
                nickname: true,
                status: true,
                owner: {
                  select: publicUserSelect,
                },
              },
            },
            crewAssignments: {
              select: {
                id: true,
                position: true,
                createdAt: true,
                orgMember: {
                  select: {
                    id: true,
                    user: {
                      select: publicUserSelect,
                    },
                  },
                },
              },
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });

    if (!operation || operation.orgId !== orgId) {
      res.status(404).json({ success: false, error: "Operation not found" });
      return;
    }

    const data: OperationDetailDTO = {
      id: operation.id,
      title: operation.title,
      description: operation.description,
      operationType: operation.operationType,
      status: operation.status as OperationDetailDTO["status"],
      startsAt: operation.startsAt?.toISOString() ?? null,
      endsAt: operation.endsAt?.toISOString() ?? null,
      createdAt: operation.createdAt.toISOString(),
      updatedAt: operation.updatedAt.toISOString(),
      creatorId: operation.creator.id,
      creatorUsername: operation.creator.username,
      ships: operation.ships.map((s) => ({
        id: s.id,
        shipId: s.fleetShip.id,
        shipName: s.fleetShip.shipName,
        nickname: s.fleetShip.nickname,
        crew: s.crewAssignments.map((c) => ({
          id: c.id,
          userId: c.orgMember.user.id,
          username: c.orgMember.user.username,
          position: c.position,
        })),
      })),
    };

    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/orgs/:orgId/operations/:id — Update operation
operationsRouter.patch("/:id", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;
    const id = req.params.id as string;

    if (!(await hasOrgPermission(orgId, userId, "manage_operations"))) {
      res.status(403).json({ success: false, error: "You do not have permission to manage operations" });
      return;
    }

    const parsed = updateOperationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const existing = await prisma.operation.findUnique({
      where: { id },
      select: { orgId: true },
    });

    if (!existing || existing.orgId !== orgId) {
      res.status(404).json({ success: false, error: "Operation not found" });
      return;
    }

    const { title, description, status, startsAt, endsAt } = parsed.data;

    const updated = await prisma.operation.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(startsAt !== undefined && { startsAt: startsAt ? new Date(startsAt) : null }),
        ...(endsAt !== undefined && { endsAt: endsAt ? new Date(endsAt) : null }),
      },
      select: {
        id: true,
        title: true,
        description: true,
        operationType: true,
        status: true,
        startsAt: true,
        endsAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ success: true, data: updated });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /api/orgs/:orgId/operations/:id — Delete operation
operationsRouter.delete("/:id", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;
    const id = req.params.id as string;

    if (!(await hasOrgPermission(orgId, userId, "manage_operations"))) {
      res.status(403).json({ success: false, error: "You do not have permission to manage operations" });
      return;
    }

    const existing = await prisma.operation.findUnique({
      where: { id },
      select: { orgId: true },
    });

    if (!existing || existing.orgId !== orgId) {
      res.status(404).json({ success: false, error: "Operation not found" });
      return;
    }

    await prisma.operation.delete({ where: { id } });

    res.json({ success: true, data: { message: "Operation deleted" } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/orgs/:orgId/operations/:id/ships — Add ship to operation
operationsRouter.post("/:id/ships", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;
    const id = req.params.id as string;

    if (!(await hasOrgPermission(orgId, userId, "manage_operations"))) {
      res.status(403).json({ success: false, error: "You do not have permission to manage operations" });
      return;
    }

    const parsed = addShipSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    // Verify operation belongs to this org
    const operation = await prisma.operation.findUnique({
      where: { id },
      select: { orgId: true },
    });

    if (!operation || operation.orgId !== orgId) {
      res.status(404).json({ success: false, error: "Operation not found" });
      return;
    }

    // Verify fleet ship belongs to this org
    const fleetShip = await prisma.fleetShip.findUnique({
      where: { id: parsed.data.fleetShipId },
      select: { orgId: true },
    });

    if (!fleetShip || fleetShip.orgId !== orgId) {
      res.status(404).json({ success: false, error: "Fleet ship not found" });
      return;
    }

    // Check if already assigned
    const existing = await prisma.operationShip.findUnique({
      where: {
        operationId_fleetShipId: {
          operationId: id,
          fleetShipId: parsed.data.fleetShipId,
        },
      },
    });

    if (existing) {
      res.status(409).json({ success: false, error: "Ship is already assigned to this operation" });
      return;
    }

    const operationShip = await prisma.operationShip.create({
      data: {
        operationId: id,
        fleetShipId: parsed.data.fleetShipId,
      },
      select: {
        id: true,
        fleetShip: {
          select: {
            id: true,
            shipId: true,
            shipName: true,
            nickname: true,
            status: true,
            owner: {
              select: publicUserSelect,
            },
          },
        },
      },
    });

    res.status(201).json({ success: true, data: operationShip });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /api/orgs/:orgId/operations/:id/ships/:shipId — Remove ship from operation
operationsRouter.delete("/:id/ships/:shipId", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;
    const id = req.params.id as string;
    const shipId = req.params.shipId as string;

    if (!(await hasOrgPermission(orgId, userId, "manage_operations"))) {
      res.status(403).json({ success: false, error: "You do not have permission to manage operations" });
      return;
    }

    // Verify operation belongs to this org
    const operation = await prisma.operation.findUnique({
      where: { id },
      select: { orgId: true },
    });

    if (!operation || operation.orgId !== orgId) {
      res.status(404).json({ success: false, error: "Operation not found" });
      return;
    }

    const operationShip = await prisma.operationShip.findUnique({
      where: { id: shipId },
      select: { id: true, operationId: true },
    });

    if (!operationShip || operationShip.operationId !== id) {
      res.status(404).json({ success: false, error: "Ship assignment not found" });
      return;
    }

    await prisma.operationShip.delete({ where: { id: shipId } });

    res.json({ success: true, data: { message: "Ship removed from operation" } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/orgs/:orgId/operations/:id/ships/:shipId/crew — Assign crew member
operationsRouter.post("/:id/ships/:shipId/crew", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;
    const id = req.params.id as string;
    const shipId = req.params.shipId as string;

    if (!(await hasOrgPermission(orgId, userId, "manage_operations"))) {
      res.status(403).json({ success: false, error: "You do not have permission to manage operations" });
      return;
    }

    const parsed = assignCrewSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    // Verify operation belongs to this org
    const operation = await prisma.operation.findUnique({
      where: { id },
      select: { orgId: true },
    });

    if (!operation || operation.orgId !== orgId) {
      res.status(404).json({ success: false, error: "Operation not found" });
      return;
    }

    // Verify operation ship exists and belongs to this operation
    const operationShip = await prisma.operationShip.findUnique({
      where: { id: shipId },
      select: { id: true, operationId: true },
    });

    if (!operationShip || operationShip.operationId !== id) {
      res.status(404).json({ success: false, error: "Ship assignment not found" });
      return;
    }

    // Look up org membership from userId
    const orgMember = await prisma.orgMember.findUnique({
      where: { orgId_userId: { orgId, userId: parsed.data.userId } },
      select: { id: true },
    });

    if (!orgMember) {
      res.status(404).json({ success: false, error: "Org member not found" });
      return;
    }

    // Check if already assigned to this ship
    const existing = await prisma.crewAssignment.findUnique({
      where: {
        operationShipId_orgMemberId: {
          operationShipId: shipId,
          orgMemberId: orgMember.id,
        },
      },
    });

    if (existing) {
      res.status(409).json({ success: false, error: "Member is already assigned to this ship" });
      return;
    }

    const assignment = await prisma.crewAssignment.create({
      data: {
        operationShipId: shipId,
        orgMemberId: orgMember.id,
        position: parsed.data.position,
      },
      select: {
        id: true,
        position: true,
        createdAt: true,
        orgMember: {
          select: {
            id: true,
            user: {
              select: publicUserSelect,
            },
          },
        },
      },
    });

    res.status(201).json({ success: true, data: assignment });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /api/orgs/:orgId/operations/:id/crew/:assignmentId — Remove crew assignment
operationsRouter.delete("/:id/crew/:assignmentId", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;
    const id = req.params.id as string;
    const assignmentId = req.params.assignmentId as string;

    if (!(await hasOrgPermission(orgId, userId, "manage_operations"))) {
      res.status(403).json({ success: false, error: "You do not have permission to manage operations" });
      return;
    }

    // Verify operation belongs to this org
    const operation = await prisma.operation.findUnique({
      where: { id },
      select: { orgId: true },
    });

    if (!operation || operation.orgId !== orgId) {
      res.status(404).json({ success: false, error: "Operation not found" });
      return;
    }

    // Verify assignment exists and belongs to this operation
    const assignment = await prisma.crewAssignment.findUnique({
      where: { id: assignmentId },
      select: {
        id: true,
        operationShip: {
          select: { operationId: true },
        },
      },
    });

    if (!assignment || assignment.operationShip.operationId !== id) {
      res.status(404).json({ success: false, error: "Crew assignment not found" });
      return;
    }

    await prisma.crewAssignment.delete({ where: { id: assignmentId } });

    res.json({ success: true, data: { message: "Crew assignment removed" } });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
