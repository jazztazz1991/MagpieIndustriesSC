import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { signToken, requireAuth, AuthPayload } from "../middleware/auth.js";
import type { Request } from "express";

export const authRouter = Router();

// --- Zod Schemas ---

const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  login: z.string().min(1),
  password: z.string().min(1),
});

const discordSchema = z.object({
  accessToken: z.string().min(1),
  discordUser: z.object({
    id: z.string().min(1),
    username: z.string(),
    email: z.string().email().optional(),
    avatar: z.string().nullable().optional(),
  }),
});

const updateProfileSchema = z.object({
  rsiHandle: z.string().max(60).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
});

// --- Response DTOs (no email, no raw DB objects) ---

function toPublicUser(user: { id: string; username: string; rsiHandle: string | null; avatarUrl: string | null; bio: string | null; role: string; isAdmin: boolean }) {
  return {
    id: user.id,
    username: user.username,
    rsiHandle: user.rsiHandle,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    role: user.role,
    isAdmin: user.isAdmin,
  };
}

function toProfileUser(user: { id: string; username: string; email: string; rsiHandle: string | null; avatarUrl: string | null; bio: string | null; role: string; isAdmin: boolean; createdAt: Date }) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    rsiHandle: user.rsiHandle,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    role: user.role,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  };
}

// Register with username/password
authRouter.post("/register", async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const { username, email, password } = parsed.data;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existing) {
      res.status(409).json({ success: false, error: "Username or email already taken" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { username, email, passwordHash },
    });

    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: toPublicUser(user),
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Login with username/password
authRouter.post("/login", async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Login and password are required" });
      return;
    }

    const { login, password } = parsed.data;

    const user = await prisma.user.findFirst({
      where: { OR: [{ username: login }, { email: login }] },
    });

    if (!user || !user.passwordHash) {
      res.status(401).json({ success: false, error: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ success: false, error: "Invalid credentials" });
      return;
    }

    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    res.json({
      success: true,
      data: {
        token,
        user: toPublicUser(user),
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Discord OAuth callback
authRouter.post("/discord", async (req, res) => {
  try {
    const parsed = discordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Invalid Discord data" });
      return;
    }

    const { accessToken, discordUser } = parsed.data;

    // Find existing account link
    let account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "discord",
          providerAccountId: discordUser.id,
        },
      },
      include: { user: true },
    });

    let user;

    if (account) {
      // Update tokens
      await prisma.account.update({
        where: { id: account.id },
        data: { accessToken },
      });
      user = account.user;
    } else {
      // Create new user + account
      const username = `${discordUser.username}_${discordUser.id.slice(-4)}`;
      user = await prisma.user.create({
        data: {
          username,
          email: discordUser.email || `${discordUser.id}@discord.placeholder`,
          avatarUrl: discordUser.avatar
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : null,
          accounts: {
            create: {
              provider: "discord",
              providerAccountId: discordUser.id,
              accessToken,
            },
          },
        },
      });
    }

    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    res.json({
      success: true,
      data: {
        token,
        user: toPublicUser(user),
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Get current user profile (authenticated user can see own email)
authRouter.get("/me", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        rsiHandle: true,
        avatarUrl: true,
        bio: true,
        role: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    res.json({ success: true, data: toProfileUser(user) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Update profile
authRouter.patch("/me", requireAuth, async (req, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;

    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const { rsiHandle, bio, avatarUrl } = parsed.data;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(rsiHandle !== undefined && { rsiHandle }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        rsiHandle: true,
        avatarUrl: true,
        bio: true,
        role: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    res.json({ success: true, data: toProfileUser(user) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
