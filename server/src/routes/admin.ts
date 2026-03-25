import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthPayload } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import type { Request } from "express";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

// GET /api/admin/stats
adminRouter.get("/stats", async (_req, res) => {
  try {
    const [userCount, orgCount, openReports, pendingSuggestions, craftRecipeCount, missionRecipeCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.org.count(),
        prisma.report.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
        prisma.suggestion.count({ where: { status: "PENDING" } }),
        prisma.craftRecipe.count(),
        prisma.missionRecipe.count(),
      ]);

    res.json({
      success: true,
      data: { userCount, orgCount, openReports, pendingSuggestions, craftRecipeCount, missionRecipeCount },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/admin/users
adminRouter.get("/users", async (req, res) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : "";
    const page = Math.max(1, parseInt(String(req.query.page || "1")));
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || "50"))));
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { username: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, username: true, email: true, isAdmin: true, role: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        users: users.map((u) => ({
          id: u.id,
          username: u.username,
          email: u.email,
          isAdmin: u.isAdmin,
          role: u.role,
          createdAt: u.createdAt.toISOString(),
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

const toggleAdminSchema = z.object({ isAdmin: z.boolean() });

// PATCH /api/admin/users/:userId — super admin only
adminRouter.patch("/users/:userId", async (req, res) => {
  try {
    const { userId: requesterId } = (req as unknown as Request & { user: AuthPayload }).user;

    const requester = await prisma.user.findUnique({
      where: { id: requesterId },
      select: { isSuperAdmin: true },
    });

    if (!requester?.isSuperAdmin) {
      res.status(403).json({ success: false, error: "Super admin access required" });
      return;
    }

    const targetId = req.params.userId as string;

    if (targetId === requesterId) {
      res.status(400).json({ success: false, error: "Cannot change your own admin status" });
      return;
    }

    const parsed = toggleAdminSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "isAdmin boolean required" });
      return;
    }

    const user = await prisma.user.update({
      where: { id: targetId },
      data: { isAdmin: parsed.data.isAdmin },
      select: { id: true, username: true, email: true, isAdmin: true, role: true, createdAt: true },
    });

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
