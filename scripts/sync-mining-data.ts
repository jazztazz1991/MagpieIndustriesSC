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

function listItems(prefix: string): string[] {
  const dir = path.join(REPO_DIR, "items");
  return fs.readdirSync(dir).filter((f) => f.startsWith(prefix) && f.endsWith(".json"));
}

// --- Extractors ---

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
      name: cleanName,
      size,
      maxPower,
      minPower,
      minPowerPct,
      extractPower,
      moduleSlots,
      resistance,
      instability,
      optimalChargeRate,
      optimalChargeWindow,
      inertMaterials,
      optimumRange,
      maxRange,
    });
  }

  // Sort: S0, S1, S2, then alphabetical
  lasers.sort((a, b) => a.size - b.size || a.name.localeCompare(b.name));
  return lasers;
}

interface ExtractedModule {
  name: string;
  type: "active" | "passive";
  damageMultiplier: number;
  miningLaserPower: number; // as percentage (95 = 95% of base)
  description: Record<string, string>;
}

function extractModules(): ExtractedModule[] {
  const files = listItems("mining_modules_").filter((f) => !f.includes("vehiclemod"));

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
    const attachMods = comps.EntityComponentAttachableModifierParams?.modifiers;

    // damageMultiplier from weapon stats (fire action 0 = fracture)
    const damageMultiplier = attachMods?.["0"]?.weaponModifier?.weaponStats?.damageMultiplier ?? 1;

    const desc = item?.stdItem?.DescriptionData || {};

    modules.push({
      name,
      type: isActive ? "active" : "passive",
      damageMultiplier,
      miningLaserPower: Math.round(damageMultiplier * 100),
      description: desc,
    });
  }

  modules.sort((a, b) => {
    if (a.type !== b.type) return a.type === "active" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return modules;
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

// --- Main ---

function main() {
  console.log("=== Mining Data Sync ===\n");

  const version = cloneOrPull();
  console.log();

  // Extract
  const lasers = extractLasers();
  console.log(`Extracted ${lasers.length} mining lasers`);

  const modules = extractModules();
  console.log(`Extracted ${modules.length} mining modules`);

  // Generate laser file
  const laserContent = generateLasersFile(lasers, version);
  const laserPath = path.join(DATA_DIR, "mining-lasers.ts");

  // Read existing and compare
  const existingLaser = fs.existsSync(laserPath) ? fs.readFileSync(laserPath, "utf8") : "";

  // Count differences
  const existingNames = existingLaser.match(/name: "([^"]+)"/g)?.map((m) => m.slice(7, -1)) || [];
  const newNames = lasers.map((l) => l.name);
  const added = newNames.filter((n) => !existingNames.includes(n));
  const removed = existingNames.filter((n) => !newNames.includes(n));

  console.log(`\n--- Laser Changes ---`);
  if (added.length) console.log(`  Added: ${added.join(", ")}`);
  if (removed.length) console.log(`  Removed: ${removed.join(", ")}`);
  if (!added.length && !removed.length) console.log(`  No name changes (values may have updated)`);

  // Write
  fs.writeFileSync(laserPath, laserContent, "utf8");
  console.log(`\nWrote ${laserPath}`);

  // Print module damageMultiplier summary for manual review
  console.log(`\n--- Module Power Multipliers (for manual review) ---`);
  for (const m of modules) {
    if (m.damageMultiplier !== 1) {
      console.log(`  ${m.name}: ${m.damageMultiplier} (${m.miningLaserPower}%)`);
    }
  }

  // Print all modules with their description data
  console.log(`\n--- All Module Descriptions ---`);
  for (const m of modules) {
    const descEntries = Object.entries(m.description)
      .filter(([k]) => k !== "Manufacturer" && k !== "Item Type")
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    console.log(`  ${m.name} (${m.type}): ${descEntries || "no stats"}`);
  }

  console.log("\nDone! Review the changes and run tests.");
}

main();
