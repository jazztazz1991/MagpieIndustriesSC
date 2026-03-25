/**
 * Syncs mining data from the scunpacked-data repo (community-extracted Star Citizen game files).
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' scripts/sync-mining-data.ts
 *
 * What it does:
 *   1. Clones or pulls the latest scunpacked-data repo to a temp directory
 *   2. Parses mining lasers, modules, gadgets, and ships from the JSON files
 *   3. Writes updated TypeScript data files to client/src/data/
 *   4. Prints a diff summary of what changed
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

// --- Config ---

const REPO_URL = "https://github.com/StarCitizenWiki/scunpacked-data.git";
const REPO_DIR = path.join(require("os").tmpdir(), "scunpacked-data");
const DATA_DIR = path.resolve(__dirname, "../client/src/data");

// --- Helpers ---

function run(cmd: string, cwd?: string): string {
  return execSync(cmd, { cwd, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
}

function cloneOrPull(): string {
  if (fs.existsSync(path.join(REPO_DIR, ".git"))) {
    console.log("Pulling latest scunpacked-data...");
    run("git pull --ff-only", REPO_DIR);
  } else {
    console.log("Cloning scunpacked-data (shallow)...");
    run(`git clone --depth 1 ${REPO_URL} "${REPO_DIR}"`);
  }
  const hash = run("git log -1 --format=%H", REPO_DIR);
  const msg = run("git log -1 --format=%s", REPO_DIR);
  console.log(`Data version: ${msg} (${hash.slice(0, 8)})`);
  return msg;
}

function readItem(filename: string): any {
  const filepath = path.join(REPO_DIR, "items", filename);
  if (!fs.existsSync(filepath)) return null;
  return JSON.parse(fs.readFileSync(filepath, "utf8"));
}

function readShip(filename: string): any {
  const filepath = path.join(REPO_DIR, "ships", filename);
  if (!fs.existsSync(filepath)) return null;
  return JSON.parse(fs.readFileSync(filepath, "utf8"));
}

function listItems(prefix: string): string[] {
  const dir = path.join(REPO_DIR, "items");
  return fs.readdirSync(dir).filter((f) => f.startsWith(prefix) && f.endsWith(".json"));
}

// --- Extracted types ---

interface ExtractedLaser {
  name: string;
  size: number;
  maxPower: number;
  minPower: number;
  minPowerPct: number;
  extractPower: number;
  moduleSlots: number;
  resistance: number;
  instability: number;
  optimalChargeRate: number;
  optimalChargeWindow: number;
  inertMaterials: number;
  optimumRange: number;
  maxRange: number;
}

interface ExtractedModule {
  name: string;
  type: "active" | "passive";
  charges: number;
  duration: number;
  miningLaserPower: number;
  extractionLaserPower: number;
  laserInstability: number;
  resistance: number;
  optimalChargeWindow: number;
  optimalChargeRate: number;
  overchargeRate: number;
  shatterDamage: number;
  inertMaterials: number;
  clusterModifier: number;
}

interface ExtractedGadget {
  name: string;
  laserInstability: number;
  resistance: number;
  optimalChargeWindow: number;
  optimalChargeRate: number;
  extractionLaserPower: number;
  inertMaterials: number;
  clusterModifier: number;
}

interface ExtractedShip {
  name: string;
  manufacturer: string;
  cargo: number;
  crew: number;
  isVehicle: boolean;
  isSpaceship: boolean;
  role: string;
  miningTurrets: number;
}

// --- Extractors ---

function extractLasers(): ExtractedLaser[] {
  const files = listItems("mining_laser_").filter(
    (f) => !f.includes("test") && !f.includes("template") && !f.includes("mpuv")
  );

  const lasers: ExtractedLaser[] = [];
  const seen = new Set<string>();

  for (const file of files) {
    const data = readItem(file);
    if (!data) continue;

    const item = data.Item;
    const name = item?.name;
    const size = item?.size;
    if (!name || size === undefined || seen.has(name)) continue;
    seen.add(name);

    const comps = data.Raw?.Entity?.Components || {};
    const mining = comps.SEntityComponentMiningLaserParams;
    const weapon = comps.SCItemWeaponComponentParams;

    // Power from fire actions
    const fractureAction = weapon?.fireActions?.[0];
    const extractAction = weapon?.fireActions?.[1];
    const maxPower = fractureAction?.damagePerSecond?.DamageInfo?.DamageEnergy || 0;
    const extractPower = extractAction?.damagePerSecond?.DamageInfo?.DamageEnergy || 0;

    // Throttle minimum
    const throttleMin = mining?.throttleMinimum || 0;
    const minPower = Math.round(maxPower * throttleMin);
    const minPowerPct = Math.round(throttleMin * 100);

    // Mining modifiers
    const mods = mining?.miningLaserModifiers || {};
    const resistance = mods.resistanceModifier?.FloatModifierMultiplicative?.value ?? 0;
    const instability = mods.laserInstability?.FloatModifierMultiplicative?.value ?? 0;
    const optimalChargeRate = mods.optimalChargeWindowRateModifier?.FloatModifierMultiplicative?.value ?? 0;
    const optimalChargeWindow = mods.optimalChargeWindowSizeModifier?.FloatModifierMultiplicative?.value ?? 0;
    const inertMaterials = -(mining?.filterParams?.filterModifier?.FloatModifierMultiplicative?.value ?? 0);

    // Module slots (count ports with type MiningModifier)
    const ports = item?.stdItem?.Ports || [];
    const moduleSlots = ports.filter((p: any) =>
      p.Types?.some((t: string) => t.startsWith("MiningModifier"))
    ).length;

    // Range
    const optimumRange = fractureAction?.fullDamageRange || 0;
    const maxRange = fractureAction?.zeroDamageRange || 0;

    // Skip S0 lasers with no fracture power (ROC-mounted display-only)
    if (maxPower === 0 && size === 0) continue;

    // Clean name: strip " Mining Laser" suffix for shorter display names
    const cleanName = name.replace(/ Mining Laser$/i, "");

    lasers.push({
      name: cleanName, size, maxPower, minPower, minPowerPct, extractPower,
      moduleSlots, resistance, instability, optimalChargeRate, optimalChargeWindow,
      inertMaterials, optimumRange, maxRange,
    });
  }

  lasers.sort((a, b) => a.size - b.size || a.name.localeCompare(b.name));
  return lasers;
}

function extractModules(): ExtractedModule[] {
  const files = listItems("mining_modules_").filter(
    (f) => !f.includes("vehiclemod") && !f.endsWith("mining_modules.json")
  );

  const modules: ExtractedModule[] = [];
  const seen = new Set<string>();

  for (const file of files) {
    const data = readItem(file);
    if (!data) continue;

    const item = data.Item;
    const name = item?.name;
    if (!name || seen.has(name)) continue;
    seen.add(name);

    const isActive = file.includes("_active_");
    const comps = data.Raw?.Entity?.Components || {};
    const attachMod = comps.EntityComponentAttachableModifierParams;
    const mods = attachMod?.modifiers || {};

    // Charges and duration
    const charges = attachMod?.charges ?? 0;
    const duration = mods?.["0"]?.modifierLifetime?.ItemModifierTimedLife?.lifetime
      ?? mods?.ItemMiningModifierParams?.modifierLifetime?.ItemModifierTimedLife?.lifetime
      ?? 0;

    // Power multipliers from weapon stats (fire action 0 = fracture, 1 = extraction)
    const fractureDmgMult = mods?.["0"]?.weaponModifier?.weaponStats?.damageMultiplier ?? 1;
    const extractDmgMult = mods?.["1"]?.weaponModifier?.weaponStats?.damageMultiplier ?? 1;

    // Mining laser modifiers (under ItemMiningModifierParams.MiningLaserModifier)
    const miningMod = mods?.ItemMiningModifierParams?.MiningLaserModifier || {};
    const laserInstability = miningMod.laserInstability?.FloatModifierMultiplicative?.value ?? 0;
    const resistance = miningMod.resistanceModifier?.FloatModifierMultiplicative?.value ?? 0;
    const optimalChargeWindow = miningMod.optimalChargeWindowSizeModifier?.FloatModifierMultiplicative?.value ?? 0;
    const optimalChargeRate = miningMod.optimalChargeWindowRateModifier?.FloatModifierMultiplicative?.value ?? 0;
    const overchargeRate = miningMod.catastrophicChargeWindowRateModifier?.FloatModifierMultiplicative?.value ?? 0;
    const shatterDamage = miningMod.shatterdamageModifier?.FloatModifierMultiplicative?.value ?? 0;
    const clusterModifier = miningMod.clusterFactorModifier?.FloatModifierMultiplicative?.value ?? 0;

    // Inert materials filter (under MiningFilterItemModifierParams)
    const filterVal = mods?.MiningFilterItemModifierParams?.filterParams?.filterModifier?.FloatModifierMultiplicative?.value ?? 0;
    const inertMaterials = filterVal > 0 ? -filterVal : filterVal; // positive in data = reduces inert, store as negative

    // Strip " Module" suffix from display name
    const cleanName = name.replace(/ Module$/i, "");

    modules.push({
      name: cleanName,
      type: isActive ? "active" : "passive",
      charges: isActive ? charges : 0,
      duration,
      miningLaserPower: Math.round(fractureDmgMult * 100),
      extractionLaserPower: Math.round(extractDmgMult * 100),
      laserInstability, resistance, optimalChargeWindow, optimalChargeRate,
      overchargeRate, shatterDamage, inertMaterials, clusterModifier,
    });
  }

  modules.sort((a, b) => {
    if (a.type !== b.type) return a.type === "active" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return modules;
}

function extractGadgets(): ExtractedGadget[] {
  const files = listItems("mining_gadget_");

  const gadgets: ExtractedGadget[] = [];
  const seen = new Set<string>();

  for (const file of files) {
    const data = readItem(file);
    if (!data) continue;

    const item = data.Item;
    const name = item?.name;
    if (!name || seen.has(name)) continue;
    seen.add(name);

    const comps = data.Raw?.Entity?.Components || {};
    const attachMod = comps.EntityComponentAttachableModifierParams;
    const mods = attachMod?.modifiers || {};

    // Gadget modifiers are under ItemMineableRockModifierParams.MiningLaserModifier
    const rockMod = mods?.ItemMineableRockModifierParams?.MiningLaserModifier || {};
    const laserInstability = rockMod.laserInstability?.FloatModifierMultiplicative?.value ?? 0;
    const resistance = rockMod.resistanceModifier?.FloatModifierMultiplicative?.value ?? 0;
    const optimalChargeWindow = rockMod.optimalChargeWindowSizeModifier?.FloatModifierMultiplicative?.value ?? 0;
    const optimalChargeRate = rockMod.optimalChargeWindowRateModifier?.FloatModifierMultiplicative?.value ?? 0;
    const extractionLaserPower = rockMod.extractionLaserPowerModifier?.FloatModifierMultiplicative?.value ?? 0;
    const inertMaterials = rockMod.filterModifier?.FloatModifierMultiplicative?.value ?? 0;
    const clusterModifier = rockMod.clusterFactorModifier?.FloatModifierMultiplicative?.value ?? 0;

    gadgets.push({
      name, laserInstability, resistance, optimalChargeWindow, optimalChargeRate,
      extractionLaserPower, inertMaterials, clusterModifier,
    });
  }

  gadgets.sort((a, b) => a.name.localeCompare(b.name));
  return gadgets;
}

// Map long manufacturer names to short display names
const MANUFACTURER_SHORT: Record<string, string> = {
  "Musashi Industrial & Starflight Concern": "MISC",
  "Argo Astronautics": "ARGO",
  "Greycat Industrial": "Greycat Industrial",
};

// Map full ship names to short display names used in the UI
const SHIP_SHORT_NAME: Record<string, string> = {
  "MISC Prospector": "Prospector",
  "Argo MOLE": "MOLE",
  "Greycat ROC": "ROC",
  "Greycat ROC-DS": "ROC-DS",
};

function extractShips(): ExtractedShip[] {
  const shipFiles = [
    "misc_prospector.json",
    "argo_mole.json",
    "grin_roc.json",
    "grin_roc_ds.json",
  ];

  const ships: ExtractedShip[] = [];

  for (const file of shipFiles) {
    const data = readShip(file);
    if (!data) continue;

    // Count mining turrets from loadout entries that reference mining lasers
    const loadout = data.Loadout || {};
    let miningTurrets = 0;
    for (const val of Object.values(loadout)) {
      if (val && typeof val === "object" && JSON.stringify(val).includes("mining_laser")) {
        miningTurrets++;
      }
    }
    // MOLE reports 4 (3 turrets + 1 pilot seat controller), cap at known values
    if (data.Name?.includes("MOLE")) miningTurrets = 3;
    if (data.Name?.includes("ROC-DS") || data.Name?.includes("ROC_DS")) miningTurrets = 2;
    if (data.Name?.includes("ROC") && !data.Name?.includes("DS") && !data.Name?.includes("MOLE")) {
      if (miningTurrets > 1) miningTurrets = 1;
    }

    const fullName = data.Name || "";
    const fullMfr = data.Manufacturer?.Name || "";

    ships.push({
      name: SHIP_SHORT_NAME[fullName] || fullName,
      manufacturer: MANUFACTURER_SHORT[fullMfr] || fullMfr,
      cargo: data.Cargo ?? 0,
      crew: data.Crew ?? 1,
      isVehicle: data.IsVehicle ?? false,
      isSpaceship: data.IsSpaceship ?? false,
      role: data.Role || "",
      miningTurrets,
    });
  }

  ships.sort((a, b) => a.name.localeCompare(b.name));
  return ships;
}

// --- Output generators ---

function generateLasersFile(lasers: ExtractedLaser[], version: string): string {
  const lines: string[] = [
    `// Auto-generated from scunpacked-data — ${version}`,
    `// Run: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/sync-mining-data.ts`,
    ``,
    `export interface MiningLaser {`,
    `  name: string;`,
    `  size: 0 | 1 | 2;`,
    `  price: number;`,
    `  optimumRange: number;`,
    `  maxRange: number;`,
    `  minPower: number;`,
    `  minPowerPct: number;`,
    `  maxPower: number;`,
    `  extractPower: number;`,
    `  moduleSlots: number;`,
    `  resistance: number;`,
    `  instability: number;`,
    `  optimalChargeRate: number;`,
    `  optimalChargeWindow: number;`,
    `  inertMaterials: number;`,
    `  description: string;`,
    `}`,
    ``,
    `export const miningLasers: MiningLaser[] = [`,
  ];

  for (const l of lasers) {
    lines.push(`  {`);
    lines.push(`    name: ${JSON.stringify(l.name)},`);
    lines.push(`    size: ${l.size} as 0 | 1 | 2,`);
    lines.push(`    price: 0,`);
    lines.push(`    optimumRange: ${l.optimumRange},`);
    lines.push(`    maxRange: ${l.maxRange},`);
    lines.push(`    minPower: ${l.minPower},`);
    lines.push(`    minPowerPct: ${l.minPowerPct},`);
    lines.push(`    maxPower: ${l.maxPower},`);
    lines.push(`    extractPower: ${l.extractPower},`);
    lines.push(`    moduleSlots: ${l.moduleSlots},`);
    lines.push(`    resistance: ${l.resistance},`);
    lines.push(`    instability: ${l.instability},`);
    lines.push(`    optimalChargeRate: ${l.optimalChargeRate},`);
    lines.push(`    optimalChargeWindow: ${l.optimalChargeWindow},`);
    lines.push(`    inertMaterials: ${l.inertMaterials},`);
    lines.push(`    description: "",`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);
  return lines.join("\n");
}

function generateModulesFile(modules: ExtractedModule[], gadgets: ExtractedGadget[], version: string): string {
  const lines: string[] = [
    `// Auto-generated from scunpacked-data — ${version}`,
    `// Run: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/sync-mining-data.ts`,
    ``,
    `export interface MiningModule {`,
    `  name: string;`,
    `  type: "active" | "passive";`,
    `  price: number;`,
    `  duration: number;`,
    `  uses: number;`,
    `  miningLaserPower: number;`,
    `  laserInstability: number;`,
    `  resistance: number;`,
    `  optimalChargeWindow: number;`,
    `  optimalChargeRate: number;`,
    `  overchargeRate: number;`,
    `  shatterDamage: number;`,
    `  extractionLaserPower: number;`,
    `  inertMaterials: number;`,
    `  clusterModifier: number;`,
    `  description: string;`,
    `}`,
    ``,
    `export interface MiningGadget {`,
    `  name: string;`,
    `  type: "gadget";`,
    `  price: number;`,
    `  laserInstability: number;`,
    `  resistance: number;`,
    `  optimalChargeWindow: number;`,
    `  optimalChargeRate: number;`,
    `  extractionLaserPower: number;`,
    `  inertMaterials: number;`,
    `  clusterModifier: number;`,
    `  description: string;`,
    `}`,
    ``,
    `// --- Active Modules ---`,
    `export const activeModules: MiningModule[] = [`,
  ];

  const active = modules.filter((m) => m.type === "active");
  const passive = modules.filter((m) => m.type === "passive");

  for (const m of active) {
    lines.push(`  {`);
    lines.push(`    name: ${JSON.stringify(m.name)},`);
    lines.push(`    type: "active",`);
    lines.push(`    price: 0,`);
    lines.push(`    duration: ${m.duration},`);
    lines.push(`    uses: ${m.charges},`);
    lines.push(`    miningLaserPower: ${m.miningLaserPower},`);
    lines.push(`    laserInstability: ${m.laserInstability},`);
    lines.push(`    resistance: ${m.resistance},`);
    lines.push(`    optimalChargeWindow: ${m.optimalChargeWindow},`);
    lines.push(`    optimalChargeRate: ${m.optimalChargeRate},`);
    lines.push(`    overchargeRate: ${m.overchargeRate},`);
    lines.push(`    shatterDamage: ${m.shatterDamage},`);
    lines.push(`    extractionLaserPower: ${m.extractionLaserPower},`);
    lines.push(`    inertMaterials: ${m.inertMaterials},`);
    lines.push(`    clusterModifier: ${m.clusterModifier},`);
    lines.push(`    description: "",`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);
  lines.push(`// --- Passive Modules ---`);
  lines.push(`export const passiveModules: MiningModule[] = [`);

  for (const m of passive) {
    lines.push(`  {`);
    lines.push(`    name: ${JSON.stringify(m.name)},`);
    lines.push(`    type: "passive",`);
    lines.push(`    price: 0,`);
    lines.push(`    duration: 0,`);
    lines.push(`    uses: 0,`);
    lines.push(`    miningLaserPower: ${m.miningLaserPower},`);
    lines.push(`    laserInstability: ${m.laserInstability},`);
    lines.push(`    resistance: ${m.resistance},`);
    lines.push(`    optimalChargeWindow: ${m.optimalChargeWindow},`);
    lines.push(`    optimalChargeRate: ${m.optimalChargeRate},`);
    lines.push(`    overchargeRate: ${m.overchargeRate},`);
    lines.push(`    shatterDamage: ${m.shatterDamage},`);
    lines.push(`    extractionLaserPower: ${m.extractionLaserPower},`);
    lines.push(`    inertMaterials: ${m.inertMaterials},`);
    lines.push(`    clusterModifier: ${m.clusterModifier},`);
    lines.push(`    description: "",`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);
  lines.push(`// --- Gadgets (consumable, slot on mining head) ---`);
  lines.push(`export const miningGadgets: MiningGadget[] = [`);

  for (const g of gadgets) {
    lines.push(`  {`);
    lines.push(`    name: ${JSON.stringify(g.name)},`);
    lines.push(`    type: "gadget",`);
    lines.push(`    price: 0,`);
    lines.push(`    laserInstability: ${g.laserInstability},`);
    lines.push(`    resistance: ${g.resistance},`);
    lines.push(`    optimalChargeWindow: ${g.optimalChargeWindow},`);
    lines.push(`    optimalChargeRate: ${g.optimalChargeRate},`);
    lines.push(`    extractionLaserPower: ${g.extractionLaserPower},`);
    lines.push(`    inertMaterials: ${g.inertMaterials},`);
    lines.push(`    clusterModifier: ${g.clusterModifier},`);
    lines.push(`    description: "",`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);
  lines.push(`// Legacy compat: combined list for simple iterations`);
  lines.push(`export type MiningEquipment = MiningModule | MiningGadget;`);
  lines.push(``);
  return lines.join("\n");
}

function generateShipsFile(ships: ExtractedShip[], version: string): string {
  const lines: string[] = [
    `// Auto-generated from scunpacked-data — ${version}`,
    `// Run: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/sync-mining-data.ts`,
    ``,
    `export interface MiningShip {`,
    `  name: string;`,
    `  manufacturer: string;`,
    `  size: "small" | "medium";`,
    `  cargoSCU: number;`,
    `  miningTurrets: number;`,
    `  description: string;`,
    `  crewMin: number;`,
    `  crewMax: number;`,
    `  isVehicle?: boolean;`,
    `}`,
    ``,
    `export const miningShips: MiningShip[] = [`,
  ];

  for (const s of ships) {
    const size = s.isVehicle ? "small" : (s.cargo > 50 ? "medium" : "small");
    const crewMin = 1;
    const crewMax = s.crew;
    lines.push(`  {`);
    lines.push(`    name: ${JSON.stringify(s.name)},`);
    lines.push(`    manufacturer: ${JSON.stringify(s.manufacturer)},`);
    lines.push(`    size: ${JSON.stringify(size)},`);
    lines.push(`    cargoSCU: ${s.cargo},`);
    lines.push(`    miningTurrets: ${s.miningTurrets},`);
    lines.push(`    crewMin: ${crewMin},`);
    lines.push(`    crewMax: ${crewMax},`);
    if (s.isVehicle) {
      lines.push(`    isVehicle: true,`);
    }
    lines.push(`    description: "",`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);
  return lines.join("\n");
}

// --- Diff helpers ---

function diffNames(label: string, existingFile: string, newNames: string[]) {
  const existingNames = existingFile.match(/name: "([^"]+)"/g)?.map((m) => m.slice(7, -1)) || [];
  const added = newNames.filter((n) => !existingNames.includes(n));
  const removed = existingNames.filter((n) => !newNames.includes(n));

  console.log(`\n--- ${label} Changes ---`);
  if (added.length) console.log(`  Added: ${added.join(", ")}`);
  if (removed.length) console.log(`  Removed: ${removed.join(", ")}`);
  if (!added.length && !removed.length) console.log(`  No name changes (values may have updated)`);
}

// --- Main ---

function main() {
  console.log("=== Mining Data Sync ===\n");

  const version = cloneOrPull();
  console.log();

  // Extract all data
  const lasers = extractLasers();
  console.log(`Extracted ${lasers.length} mining lasers`);

  const modules = extractModules();
  const activeCount = modules.filter((m) => m.type === "active").length;
  const passiveCount = modules.filter((m) => m.type === "passive").length;
  console.log(`Extracted ${modules.length} mining modules (${activeCount} active, ${passiveCount} passive)`);

  const gadgets = extractGadgets();
  console.log(`Extracted ${gadgets.length} mining gadgets`);

  const ships = extractShips();
  console.log(`Extracted ${ships.length} mining ships`);

  // --- Generate and write laser file ---
  const laserContent = generateLasersFile(lasers, version);
  const laserPath = path.join(DATA_DIR, "mining-lasers.ts");
  const existingLaser = fs.existsSync(laserPath) ? fs.readFileSync(laserPath, "utf8") : "";
  diffNames("Laser", existingLaser, lasers.map((l) => l.name));
  fs.writeFileSync(laserPath, laserContent, "utf8");
  console.log(`Wrote ${laserPath}`);

  // --- Generate and write modules/gadgets file ---
  const modulesContent = generateModulesFile(modules, gadgets, version);
  const modulesPath = path.join(DATA_DIR, "mining-gadgets.ts");
  const existingModules = fs.existsSync(modulesPath) ? fs.readFileSync(modulesPath, "utf8") : "";
  diffNames("Module", existingModules, modules.map((m) => m.name));
  diffNames("Gadget", existingModules, gadgets.map((g) => g.name));
  fs.writeFileSync(modulesPath, modulesContent, "utf8");
  console.log(`Wrote ${modulesPath}`);

  // --- Generate and write ships file ---
  const shipsContent = generateShipsFile(ships, version);
  const shipsPath = path.join(DATA_DIR, "mining-ships.ts");
  const existingShips = fs.existsSync(shipsPath) ? fs.readFileSync(shipsPath, "utf8") : "";
  diffNames("Ship", existingShips, ships.map((s) => s.name));
  fs.writeFileSync(shipsPath, shipsContent, "utf8");
  console.log(`Wrote ${shipsPath}`);

  // --- Summary table ---
  console.log(`\n=== Extracted Data Summary ===`);
  console.log(`\nLasers:`);
  for (const l of lasers) {
    console.log(`  S${l.size} ${l.name}: ${l.maxPower} power, ${l.extractPower} extract, ${l.moduleSlots} slots`);
  }

  console.log(`\nActive Modules:`);
  for (const m of modules.filter((m) => m.type === "active")) {
    const stats: string[] = [];
    if (m.miningLaserPower !== 100) stats.push(`power:${m.miningLaserPower}%`);
    if (m.extractionLaserPower !== 100) stats.push(`extract:${m.extractionLaserPower}%`);
    if (m.laserInstability) stats.push(`instab:${m.laserInstability}`);
    if (m.resistance) stats.push(`resist:${m.resistance}`);
    if (m.overchargeRate) stats.push(`overcharge:${m.overchargeRate}`);
    if (m.shatterDamage) stats.push(`shatter:${m.shatterDamage}`);
    if (m.optimalChargeRate) stats.push(`chargeRate:${m.optimalChargeRate}`);
    console.log(`  ${m.name}: ${m.charges} uses, ${m.duration}s — ${stats.join(", ")}`);
  }

  console.log(`\nPassive Modules:`);
  for (const m of modules.filter((m) => m.type === "passive")) {
    const stats: string[] = [];
    if (m.miningLaserPower !== 100) stats.push(`power:${m.miningLaserPower}%`);
    if (m.extractionLaserPower !== 100) stats.push(`extract:${m.extractionLaserPower}%`);
    if (m.optimalChargeWindow) stats.push(`window:${m.optimalChargeWindow}`);
    if (m.optimalChargeRate) stats.push(`chargeRate:${m.optimalChargeRate}`);
    if (m.inertMaterials) stats.push(`inert:${m.inertMaterials}`);
    console.log(`  ${m.name}: ${stats.join(", ")}`);
  }

  console.log(`\nGadgets:`);
  for (const g of gadgets) {
    const stats: string[] = [];
    if (g.laserInstability) stats.push(`instab:${g.laserInstability}`);
    if (g.resistance) stats.push(`resist:${g.resistance}`);
    if (g.optimalChargeWindow) stats.push(`window:${g.optimalChargeWindow}`);
    if (g.optimalChargeRate) stats.push(`chargeRate:${g.optimalChargeRate}`);
    if (g.clusterModifier) stats.push(`cluster:${g.clusterModifier}`);
    if (g.inertMaterials) stats.push(`inert:${g.inertMaterials}`);
    console.log(`  ${g.name}: ${stats.join(", ")}`);
  }

  console.log(`\nShips:`);
  for (const s of ships) {
    console.log(`  ${s.name}: ${s.cargo} SCU, ${s.miningTurrets} turrets, crew ${s.crew}${s.isVehicle ? " (vehicle)" : ""}`);
  }

  console.log("\nDone! Review the changes and run tests.");
}

main();
