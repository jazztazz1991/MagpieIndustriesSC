import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import type { Request } from "express";

export const treasuryRouter = Router({ mergeParams: true });

// All routes require authentication
treasuryRouter.use(requireAuth);

// --- Zod Schemas ---

const createTransactionSchema = z.object({
  type: z.enum(["DEPOSIT", "WITHDRAWAL"]),
  amount: z.number().int().min(1),
  description: z.string().max(500).optional(),
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

// --- Routes ---

// GET /api/orgs/:orgId/treasury — Get treasury summary
treasuryRouter.get("/", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;

    // Verify caller is an org member
    const membership = await prisma.orgMember.findUnique({
      where: { orgId_userId: { orgId, userId } },
    });

    if (!membership) {
      res.status(403).json({ success: false, error: "Not a member of this org" });
      return;
    }

    // Calculate balance from all transactions
    const deposits = await prisma.treasuryTransaction.aggregate({
      where: { orgId, type: "DEPOSIT" },
      _sum: { amount: true },
    });

    const withdrawals = await prisma.treasuryTransaction.aggregate({
      where: { orgId, type: "WITHDRAWAL" },
      _sum: { amount: true },
    });

    const balance = (deposits._sum.amount ?? 0) - (withdrawals._sum.amount ?? 0);

    // Fetch recent transactions
    const transactions = await prisma.treasuryTransaction.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        type: true,
        amount: true,
        description: true,
        createdAt: true,
        user: { select: publicUserSelect },
      },
    });

    res.json({
      success: true,
      data: {
        balance,
        transactions,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/orgs/:orgId/treasury — Record a transaction
treasuryRouter.post("/", async (req, res) => {
  try {
    const { userId } = getUser(req);
    const orgId = (req.params as Record<string, string>).orgId;

    // Check permission
    const permitted = await hasOrgPermission(orgId, userId, "manage_treasury");
    if (!permitted) {
      res.status(403).json({ success: false, error: "Missing manage_treasury permission" });
      return;
    }

    const parsed = createTransactionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const { type, amount, description } = parsed.data;

    const transaction = await prisma.treasuryTransaction.create({
      data: {
        orgId,
        userId,
        type,
        amount,
        description,
      },
      select: {
        id: true,
        type: true,
        amount: true,
        description: true,
        createdAt: true,
        user: { select: publicUserSelect },
      },
    });

    // Create activity record
    await prisma.activity.create({
      data: {
        userId,
        type: "treasury_transaction",
        targetId: transaction.id,
        metadata: { orgId, transactionType: type, amount },
      },
    });

    res.status(201).json({ success: true, data: transaction });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
