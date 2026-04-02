import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

export const gameDataRouter = Router();

// =============================================
// DTO helpers (never return raw DB objects)
// =============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function oreDTO(o: any) {
  return { id: o.id, name: o.name, abbrev: o.abbrev, type: o.type, valuePerSCU: o.valuePerSCU, instability: o.instability, resistance: o.resistance, description: o.description, sortOrder: o.sortOrder };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function laserDTO(l: any) {
  return { id: l.id, name: l.name, size: l.size, price: l.price, optimumRange: l.optimumRange, maxRange: l.maxRange, minPower: l.minPower, minPowerPct: l.minPowerPct, maxPower: l.maxPower, extractPower: l.extractPower, moduleSlots: l.moduleSlots, resistance: l.resistance, instability: l.instability, optimalChargeRate: l.optimalChargeRate, optimalChargeWindow: l.optimalChargeWindow, inertMaterials: l.inertMaterials, description: l.description };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function moduleDTO(m: any) {
  return { id: m.id, name: m.name, category: m.category, price: m.price, duration: m.duration, uses: m.uses, miningLaserPower: m.miningLaserPower, laserInstability: m.laserInstability, resistance: m.resistance, optimalChargeWindow: m.optimalChargeWindow, optimalChargeRate: m.optimalChargeRate, overchargeRate: m.overchargeRate, shatterDamage: m.shatterDamage, extractionLaserPower: m.extractionLaserPower, inertMaterials: m.inertMaterials, clusterModifier: m.clusterModifier, description: m.description };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shipDTO(s: any) {
  return { id: s.id, name: s.name, manufacturer: s.manufacturer, size: s.size, cargoSCU: s.cargoSCU, miningTurrets: s.miningTurrets, crewMin: s.crewMin, crewMax: s.crewMax, isVehicle: s.isVehicle, description: s.description };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rockSigDTO(r: any) {
  return { id: r.id, name: r.name, baseRU: r.baseRU, maxMultiples: r.maxMultiples };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function refineryMethodDTO(m: any) {
  return { id: m.id, name: m.name, yieldMultiplier: m.yieldMultiplier, relativeTime: m.relativeTime, relativeCost: m.relativeCost, description: m.description };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function refineryStationDTO(s: any) {
  return { id: s.id, name: s.name, location: s.location, bonuses: s.bonuses };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function locationDTO(l: any) {
  return { id: l.id, name: l.name, type: l.type, parentBody: l.parentBody, gravity: l.gravity, atmosphere: l.atmosphere, danger: l.danger, ores: l.ores, notes: l.notes };
}

// =============================================
// PUBLIC READ endpoints (no auth required)
// =============================================

// GET /api/game-data/all — single fetch for all game data
gameDataRouter.get("/all", async (_req: Request, res: Response) => {
  try {
    const [ores, lasers, modules, ships, rockSignatures, refineryMethods, refineryStations, locations] = await Promise.all([
      prisma.gameOre.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.gameMiningLaser.findMany({ orderBy: [{ size: "asc" }, { name: "asc" }] }),
      prisma.gameMiningModule.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
      prisma.gameMiningShip.findMany({ orderBy: { name: "asc" } }),
      prisma.gameRockSignature.findMany({ orderBy: { name: "asc" } }),
      prisma.gameRefineryMethod.findMany({ orderBy: { relativeTime: "desc" } }),
      prisma.gameRefineryStation.findMany({ orderBy: { name: "asc" } }),
      prisma.gameMiningLocation.findMany({ orderBy: { name: "asc" } }),
    ]);

    res.json({
      success: true,
      data: {
        ores: ores.map(oreDTO),
        lasers: lasers.map(laserDTO),
        modules: modules.map(moduleDTO),
        ships: ships.map(shipDTO),
        rockSignatures: rockSignatures.map(rockSigDTO),
        refineryMethods: refineryMethods.map(refineryMethodDTO),
        refineryStations: refineryStations.map(refineryStationDTO),
        locations: locations.map(locationDTO),
      },
    });
  } catch (err) {
    console.error("game-data/all error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch game data" });
  }
});

// Individual collection endpoints
gameDataRouter.get("/ores", async (_req, res) => {
  const items = await prisma.gameOre.findMany({ orderBy: { sortOrder: "asc" } });
  res.json({ success: true, data: items.map(oreDTO) });
});

gameDataRouter.get("/lasers", async (_req, res) => {
  const items = await prisma.gameMiningLaser.findMany({ orderBy: [{ size: "asc" }, { name: "asc" }] });
  res.json({ success: true, data: items.map(laserDTO) });
});

gameDataRouter.get("/modules", async (_req, res) => {
  const items = await prisma.gameMiningModule.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] });
  res.json({ success: true, data: items.map(moduleDTO) });
});

gameDataRouter.get("/ships", async (_req, res) => {
  const items = await prisma.gameMiningShip.findMany({ orderBy: { name: "asc" } });
  res.json({ success: true, data: items.map(shipDTO) });
});

gameDataRouter.get("/rock-signatures", async (_req, res) => {
  const items = await prisma.gameRockSignature.findMany({ orderBy: { name: "asc" } });
  res.json({ success: true, data: items.map(rockSigDTO) });
});

gameDataRouter.get("/refinery-methods", async (_req, res) => {
  const items = await prisma.gameRefineryMethod.findMany({ orderBy: { relativeTime: "desc" } });
  res.json({ success: true, data: items.map(refineryMethodDTO) });
});

gameDataRouter.get("/refinery-stations", async (_req, res) => {
  const items = await prisma.gameRefineryStation.findMany({ orderBy: { name: "asc" } });
  res.json({ success: true, data: items.map(refineryStationDTO) });
});

gameDataRouter.get("/locations", async (_req, res) => {
  const items = await prisma.gameMiningLocation.findMany({ orderBy: { name: "asc" } });
  res.json({ success: true, data: items.map(locationDTO) });
});

// =============================================
// ADMIN CRUD endpoints (auth + admin required)
// =============================================

// --- Ores CRUD ---
const oreSchema = z.object({
  name: z.string().min(1).max(100),
  abbrev: z.string().length(4),
  type: z.enum(["ROCK", "GEM", "METAL"]),
  valuePerSCU: z.number().int().min(0),
  instability: z.number().min(0),
  resistance: z.number().min(0).max(100),
  description: z.string().max(1000),
  sortOrder: z.number().int().default(0),
});

gameDataRouter.post("/ores", requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = oreSchema.parse(req.body);
    const ore = await prisma.gameOre.create({ data });
    res.json({ success: true, data: oreDTO(ore) });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof z.ZodError ? err.issues.map(i => i.message).join(", ") : "Invalid data" });
  }
});

gameDataRouter.patch("/ores/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = oreSchema.partial().parse(req.body);
    const ore = await prisma.gameOre.update({ where: { id: req.params.id as string }, data });
    res.json({ success: true, data: oreDTO(ore) });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof z.ZodError ? err.issues.map(i => i.message).join(", ") : "Update failed" });
  }
});

gameDataRouter.delete("/ores/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.gameOre.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch {
    res.status(404).json({ success: false, error: "Not found" });
  }
});

// --- Lasers CRUD ---
const laserSchema = z.object({
  name: z.string().min(1).max(100),
  size: z.number().int().min(0).max(2),
  price: z.number().int().min(0),
  optimumRange: z.number().int().min(0),
  maxRange: z.number().int().min(0),
  minPower: z.number().int().min(0),
  minPowerPct: z.number().min(0),
  maxPower: z.number().int().min(0),
  extractPower: z.number().int().min(0),
  moduleSlots: z.number().int().min(0),
  resistance: z.number(),
  instability: z.number(),
  optimalChargeRate: z.number(),
  optimalChargeWindow: z.number(),
  inertMaterials: z.number(),
  description: z.string().max(1000),
});

gameDataRouter.post("/lasers", requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = laserSchema.parse(req.body);
    const laser = await prisma.gameMiningLaser.create({ data });
    res.json({ success: true, data: laserDTO(laser) });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof z.ZodError ? err.issues.map(i => i.message).join(", ") : "Invalid data" });
  }
});

gameDataRouter.patch("/lasers/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = laserSchema.partial().parse(req.body);
    const laser = await prisma.gameMiningLaser.update({ where: { id: req.params.id as string }, data });
    res.json({ success: true, data: laserDTO(laser) });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof z.ZodError ? err.issues.map(i => i.message).join(", ") : "Update failed" });
  }
});

gameDataRouter.delete("/lasers/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.gameMiningLaser.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch {
    res.status(404).json({ success: false, error: "Not found" });
  }
});

// --- Modules CRUD ---
const moduleSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(["ACTIVE", "PASSIVE", "GADGET"]),
  price: z.number().int().min(0),
  duration: z.number().int().min(0).default(0),
  uses: z.number().int().min(0).default(0),
  miningLaserPower: z.number().default(0),
  laserInstability: z.number().default(0),
  resistance: z.number().default(0),
  optimalChargeWindow: z.number().default(0),
  optimalChargeRate: z.number().default(0),
  overchargeRate: z.number().default(0),
  shatterDamage: z.number().default(0),
  extractionLaserPower: z.number().default(0),
  inertMaterials: z.number().default(0),
  clusterModifier: z.number().default(0),
  description: z.string().max(1000),
});

gameDataRouter.post("/modules", requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = moduleSchema.parse(req.body);
    const mod = await prisma.gameMiningModule.create({ data });
    res.json({ success: true, data: moduleDTO(mod) });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof z.ZodError ? err.issues.map(i => i.message).join(", ") : "Invalid data" });
  }
});

gameDataRouter.patch("/modules/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = moduleSchema.partial().parse(req.body);
    const mod = await prisma.gameMiningModule.update({ where: { id: req.params.id as string }, data });
    res.json({ success: true, data: moduleDTO(mod) });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof z.ZodError ? err.issues.map(i => i.message).join(", ") : "Update failed" });
  }
});

gameDataRouter.delete("/modules/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.gameMiningModule.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch {
    res.status(404).json({ success: false, error: "Not found" });
  }
});

// --- Ships CRUD ---
const shipSchema = z.object({
  name: z.string().min(1).max(100),
  manufacturer: z.string().min(1).max(100),
  size: z.string().min(1).max(20),
  cargoSCU: z.number().min(0),
  miningTurrets: z.number().int().min(0),
  crewMin: z.number().int().min(1),
  crewMax: z.number().int().min(1),
  isVehicle: z.boolean().default(false),
  description: z.string().max(1000),
});

gameDataRouter.post("/ships", requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = shipSchema.parse(req.body);
    const ship = await prisma.gameMiningShip.create({ data });
    res.json({ success: true, data: shipDTO(ship) });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof z.ZodError ? err.issues.map(i => i.message).join(", ") : "Invalid data" });
  }
});

gameDataRouter.patch("/ships/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = shipSchema.partial().parse(req.body);
    const ship = await prisma.gameMiningShip.update({ where: { id: req.params.id as string }, data });
    res.json({ success: true, data: shipDTO(ship) });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof z.ZodError ? err.issues.map(i => i.message).join(", ") : "Update failed" });
  }
});

gameDataRouter.delete("/ships/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.gameMiningShip.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch {
    res.status(404).json({ success: false, error: "Not found" });
  }
});

// --- Rock Signatures CRUD ---
const rockSigSchema = z.object({
  name: z.string().min(1).max(100),
  baseRU: z.number().int().min(0),
  maxMultiples: z.number().int().min(1),
});

gameDataRouter.post("/rock-signatures", requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = rockSigSchema.parse(req.body);
    const sig = await prisma.gameRockSignature.create({ data });
    res.json({ success: true, data: rockSigDTO(sig) });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof z.ZodError ? err.issues.map(i => i.message).join(", ") : "Invalid data" });
  }
});

gameDataRouter.patch("/rock-signatures/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = rockSigSchema.partial().parse(req.body);
    const sig = await prisma.gameRockSignature.update({ where: { id: req.params.id as string }, data });
    res.json({ success: true, data: rockSigDTO(sig) });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof z.ZodError ? err.issues.map(i => i.message).join(", ") : "Update failed" });
  }
});

gameDataRouter.delete("/rock-signatures/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.gameRockSignature.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch {
    res.status(404).json({ success: false, error: "Not found" });
  }
});

// --- Refinery Methods CRUD ---
const refineryMethodSchema = z.object({
  name: z.string().min(1).max(100),
  yieldMultiplier: z.number().min(0).max(1),
  relativeTime: z.number().int().min(1).max(9),
  relativeCost: z.number().int().min(1).max(3),
  description: z.string().max(1000),
});

gameDataRouter.post("/refinery-methods", requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = refineryMethodSchema.parse(req.body);
    const method = await prisma.gameRefineryMethod.create({ data });
    res.json({ success: true, data: refineryMethodDTO(method) });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof z.ZodError ? err.issues.map(i => i.message).join(", ") : "Invalid data" });
  }
});

gameDataRouter.patch("/refinery-methods/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = refineryMethodSchema.partial().parse(req.body);
    const method = await prisma.gameRefineryMethod.update({ where: { id: req.params.id as string }, data });
    res.json({ success: true, data: refineryMethodDTO(method) });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof z.ZodError ? err.issues.map(i => i.message).join(", ") : "Update failed" });
  }
});

gameDataRouter.delete("/refinery-methods/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.gameRefineryMethod.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch {
    res.status(404).json({ success: false, error: "Not found" });
  }
});

// --- Refinery Stations CRUD ---
const refineryStationSchema = z.object({
  name: z.string().min(1).max(100),
  location: z.string().min(1).max(100),
  bonuses: z.record(z.string(), z.number()),
});

gameDataRouter.post("/refinery-stations", requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = refineryStationSchema.parse(req.body);
    const station = await prisma.gameRefineryStation.create({ data });
    res.json({ success: true, data: refineryStationDTO(station) });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof z.ZodError ? err.issues.map(i => i.message).join(", ") : "Invalid data" });
  }
});

gameDataRouter.patch("/refinery-stations/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = refineryStationSchema.partial().parse(req.body);
    const station = await prisma.gameRefineryStation.update({ where: { id: req.params.id as string }, data });
    res.json({ success: true, data: refineryStationDTO(station) });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof z.ZodError ? err.issues.map(i => i.message).join(", ") : "Update failed" });
  }
});

gameDataRouter.delete("/refinery-stations/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.gameRefineryStation.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch {
    res.status(404).json({ success: false, error: "Not found" });
  }
});

// --- Mining Locations CRUD ---
const locationSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.string().min(1).max(50),
  parentBody: z.string().min(1).max(100),
  gravity: z.string().min(1).max(20),
  atmosphere: z.boolean(),
  danger: z.string().min(1).max(20),
  ores: z.array(z.string()),
  notes: z.string().max(1000),
});

gameDataRouter.post("/locations", requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = locationSchema.parse(req.body);
    const loc = await prisma.gameMiningLocation.create({ data });
    res.json({ success: true, data: locationDTO(loc) });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof z.ZodError ? err.issues.map(i => i.message).join(", ") : "Invalid data" });
  }
});

gameDataRouter.patch("/locations/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = locationSchema.partial().parse(req.body);
    const loc = await prisma.gameMiningLocation.update({ where: { id: req.params.id as string }, data });
    res.json({ success: true, data: locationDTO(loc) });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof z.ZodError ? err.issues.map(i => i.message).join(", ") : "Update failed" });
  }
});

gameDataRouter.delete("/locations/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.gameMiningLocation.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch {
    res.status(404).json({ success: false, error: "Not found" });
  }
});

// =============================================
// Data Overrides — runtime patches over static TS data
// =============================================

const VALID_CATEGORIES = [
  "weapon", "shield", "quantum_drive", "power_plant", "cooler",
  "ship", "refinery_method", "refinery_station", "ore",
  "mining_laser", "mining_module", "mining_gadget", "mining_ship",
  "mining_location", "rock_signature",
  "wikelo_contract", "wikelo_gathering_item", "wikelo_emporium",
  "wikelo_favor_conversion", "wikelo_reputation_tier",
] as const;

function overrideDTO(o: { id: string; category: string; itemKey: string; overrides: unknown; updatedAt: Date }) {
  return { id: o.id, category: o.category, itemKey: o.itemKey, overrides: o.overrides, updatedAt: o.updatedAt.toISOString() };
}

// Public: tools pages fetch active overrides to merge with static data
gameDataRouter.get("/overrides", async (_req: Request, res: Response) => {
  try {
    const items = await prisma.gameDataOverride.findMany({
      select: { id: true, category: true, itemKey: true, overrides: true, updatedAt: true },
    });
    res.json({ success: true, data: items.map(overrideDTO) });
  } catch (err) {
    console.error("overrides fetch error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch overrides" });
  }
});

// Admin: upsert an override (create or update)
const overrideSchema = z.object({
  category: z.enum(VALID_CATEGORIES),
  itemKey: z.string().min(1).max(200),
  overrides: z.record(z.string(), z.union([z.number(), z.string()])),
});

gameDataRouter.put("/overrides", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const data = overrideSchema.parse(req.body);
    const item = await prisma.gameDataOverride.upsert({
      where: { category_itemKey: { category: data.category, itemKey: data.itemKey } },
      create: data,
      update: { overrides: data.overrides },
    });
    res.json({ success: true, data: overrideDTO(item) });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof z.ZodError ? err.issues.map(i => i.message).join(", ") : "Invalid data" });
  }
});

// Admin: delete an override (revert to static data)
gameDataRouter.delete("/overrides/:id", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    await prisma.gameDataOverride.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch {
    res.status(404).json({ success: false, error: "Not found" });
  }
});
