/**
 * Generator: mining-lasers.ts
 * Reads DataForge XML for mining laser entities, writes client/src/data/mining-lasers.ts
 */
import * as path from "path";
import { parseXmlFile, findXmlFiles, getRootEntity, loadNames, GeneratorReport, emptyReport } from "../lib/xml-utils";

interface ParsedMiningLaser {
  name: string;
  size: 0 | 1 | 2;
  price: number;
  optimumRange: number;
  maxRange: number;
  minPower: number;
  minPowerPct: number;
  maxPower: number;
  extractPower: number;
  moduleSlots: number;
  resistance: number;
  instability: number;
  optimalChargeRate: number;
  optimalChargeWindow: number;
  inertMaterials: number;
  description: string;
}

const SKIP_PATTERNS = [/template/, /test/, /mpuv_arm/];

function shouldSkip(filename: string): boolean {
  return SKIP_PATTERNS.some((p) => p.test(filename));
}

function extractSizeFromFilename(filename: string): 0 | 1 | 2 {
  const match = filename.match(/_s(\d)/);
  if (match) return parseInt(match[1]) as 0 | 1 | 2;
  return 1;
}

function getDisplayName(filename: string, locName: string, nameMap: Record<string, string>): string {
  const baseName = path.basename(filename, ".xml");
  if (nameMap[baseName]) return nameMap[baseName];
  // Fallback: clean up the localization name
  return locName.replace(/^@item_Mining_MiningLaser_/, "").replace(/_/g, " ");
}

/** Walk the parsed XML to find a component by polymorphicType. */
function findComp(components: any, type: string): any {
  if (!components) return undefined;
  for (const key of Object.keys(components)) {
    const val = components[key];
    if (val?.["@___polymorphicType"] === type) return val;
    if (key === type) return val;
  }
  return undefined;
}

/** Ensure value is an array (unforge may collapse single-element arrays). */
function asArray(val: any): any[] {
  if (val == null) return [];
  if (Array.isArray(val)) return val;
  return [val];
}

/** Count module slots by counting SItemPortDef entries with Type="MiningModifier". */
function countModuleSlots(components: any): number {
  const portManager = findComp(components, "SItemPortContainerComponentParams");
  if (!portManager) return 0;

  const ports = portManager?.Ports?.SItemPortDef;
  if (!ports) return 0;

  const portList = asArray(ports);
  return portList.filter((p: any) => {
    const types = p?.Types?.SItemPortDefTypes;
    if (!types) return false;
    const typeList = asArray(types);
    return typeList.some((t: any) => t?.["@_Type"] === "MiningModifier");
  }).length;
}

function getFloatModValue(container: any): number {
  if (!container) return 0;
  const mod = container?.FloatModifierMultiplicative;
  if (mod) return Number(mod["@_value"]) || 0;
  return 0;
}

export function parseMiningLaser(filePath: string, nameMap: Record<string, string> = {}): ParsedMiningLaser | null {
  const baseName = path.basename(filePath, ".xml");
  if (shouldSkip(baseName)) return null;

  const parsed = parseXmlFile(filePath);
  const root = getRootEntity(parsed);
  if (!root) return null;

  const components = root.Components;
  if (!components) return null;

  // AttachDef (for name, size, localization)
  const attachable = findComp(components, "SAttachableComponentParams");
  const attachDef = attachable?.AttachDef;
  const size = Number(attachDef?.["@_Size"]) as 0 | 1 | 2 || extractSizeFromFilename(baseName);
  const locName = attachDef?.Localization?.["@_Name"] || "";

  // Fire actions (fracture beam + extraction beam)
  const weapon = findComp(components, "SCItemWeaponComponentParams");
  const fireActions = asArray(weapon?.fireActions?.SWeaponActionFireBeamParams);

  let maxPower = 0;
  let extractPower = 0;
  let optimumRange = 0;
  let maxRange = 0;

  for (const fa of fireActions) {
    const damage = fa?.damagePerSecond?.DamageInfo;
    const energy = Number(damage?.["@_DamageEnergy"]) || 0;
    const fullRange = Number(fa?.["@_fullDamageRange"]) || 0;
    const zeroRange = Number(fa?.["@_zeroDamageRange"]) || 0;
    const hitType = String(fa?.["@_hitType"] || "");

    if (hitType === "Extraction" || hitType === "extraction") {
      extractPower = energy;
    } else {
      maxPower = energy;
      optimumRange = fullRange;
      maxRange = zeroRange;
    }
  }

  // Mining laser params
  const miningParams = findComp(components, "SEntityComponentMiningLaserParams");
  const throttleMin = Number(miningParams?.["@_throttleMinimum"]) || 0;
  const modifiers = miningParams?.miningLaserModifiers;

  const resistance = getFloatModValue(modifiers?.resistanceModifier);
  const instability = getFloatModValue(modifiers?.laserInstability);
  const optimalChargeWindow = getFloatModValue(modifiers?.optimalChargeWindowSizeModifier);
  const optimalChargeRate = getFloatModValue(modifiers?.optimalChargeWindowRateModifier);

  const filterParams = miningParams?.filterParams;
  const inertMaterials = -getFloatModValue(filterParams?.filterModifier);

  // Module slots
  const moduleSlots = countModuleSlots(components);

  // Derived values
  const minPower = Math.round(throttleMin * maxPower);
  const minPowerPct = Math.round(throttleMin * 100);

  return {
    name: getDisplayName(baseName, locName, nameMap),
    size,
    price: 0, // TODO: cross-ref with shop data
    optimumRange,
    maxRange,
    minPower,
    minPowerPct,
    maxPower,
    extractPower,
    moduleSlots,
    resistance,
    instability,
    optimalChargeRate,
    optimalChargeWindow,
    inertMaterials,
    description: "",
  };
}

export function generateMiningLasers(xmlDir: string, outputPath: string, version: string, overridesDir: string): { content: string; report: GeneratorReport } {
  const report = emptyReport("mining-lasers");
  const names = loadNames(overridesDir);
  const NAME_MAP: Record<string, string> = names.miningLasers || {};

  const laserDir = path.join(xmlDir, "libs/foundry/records/entities/scitem/ships/weapons");
  const files = findXmlFiles(laserDir, /^mining_laser_/);
  report.found = files.length;

  console.log(`  Found ${files.length} mining laser XML files`);

  const lasers: ParsedMiningLaser[] = [];
  for (const file of files) {
    try {
      const laser = parseMiningLaser(file, NAME_MAP);
      if (laser) {
        lasers.push(laser);
      } else {
        report.skipped++;
      }
    } catch (err) {
      report.warnings.push(`Failed to parse ${path.basename(file)}: ${err}`);
    }
  }

  // Sort by size then name
  lasers.sort((a, b) => a.size - b.size || a.name.localeCompare(b.name));
  report.produced = lasers.length;

  console.log(`  Parsed ${lasers.length} mining lasers`);

  // Generate TypeScript
  const lines: string[] = [
    `// Auto-generated from Data.p4k — ${version}`,
    `// Run: npm run sync:generate`,
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

  for (const laser of lasers) {
    lines.push(`  {`);
    lines.push(`    name: ${JSON.stringify(laser.name)},`);
    lines.push(`    size: ${laser.size} as 0 | 1 | 2,`);
    lines.push(`    price: ${laser.price},`);
    lines.push(`    optimumRange: ${laser.optimumRange},`);
    lines.push(`    maxRange: ${laser.maxRange},`);
    lines.push(`    minPower: ${laser.minPower},`);
    lines.push(`    minPowerPct: ${laser.minPowerPct},`);
    lines.push(`    maxPower: ${laser.maxPower},`);
    lines.push(`    extractPower: ${laser.extractPower},`);
    lines.push(`    moduleSlots: ${laser.moduleSlots},`);
    lines.push(`    resistance: ${laser.resistance},`);
    lines.push(`    instability: ${laser.instability},`);
    lines.push(`    optimalChargeRate: ${laser.optimalChargeRate},`);
    lines.push(`    optimalChargeWindow: ${laser.optimalChargeWindow},`);
    lines.push(`    inertMaterials: ${laser.inertMaterials},`);
    lines.push(`    description: ${JSON.stringify(laser.description)},`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);

  return { content: lines.join("\n"), report };
}
