import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { AuthPayload } from "./auth.js";

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authUser = (req as Request & { user: AuthPayload }).user;
  if (!authUser) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.userId },
    select: { isAdmin: true },
  });

  if (!user?.isAdmin) {
    res.status(403).json({ success: false, error: "Admin access required" });
    return;
  }

  next();
}
