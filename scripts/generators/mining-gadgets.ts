/**
 * Generator: mining-gadgets.ts
 * Reads DataForge XML for mining modules (active + passive) and gadgets,
 * writes client/src/data/mining-gadgets.ts
 */
import * as path from "path";
import { parseXmlFile, findXmlFiles, getRootEntity, loadNames, GeneratorReport, emptyReport } from "../lib/xml-utils";

interface ParsedMiningModule {
  name: string;
  type: "active" | "passive";
  price: number;
  duration: number;
  uses: number;
  miningLaserPower: number;
  laserInstability: number;
  resistance: number;
  optimalChargeWindow: number;
  optimalChargeRate: number;
  overchargeRate: number;
  shatterDamage: number;
  extractionLaserPower: number;
  inertMaterials: number;
  clusterModifier: number;
  description: string;
}

interface ParsedMiningGadget {
  name: string;
  type: "gadget";
  price: number;
  laserInstability: number;
  resistance: number;
  optimalChargeWindow: number;
  optimalChargeRate: number;
  extractionLaserPower: number;
  inertMaterials: number;
  clusterModifier: number;
  description: string;
}

const SKIP_PATTERNS = [/template/, /test/, /vehiclemod/, /argo_mpuv/, /misc_/, /drak_golem/];

function shouldSkip(filename: string): boolean {
  return SKIP_PATTERNS.some((p) => p.test(filename));
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

/** Ensure value is an array. */
function asArray(val: any): any[] {
  if (val == null) return [];
  if (Array.isArray(val)) return val;
  return [val];
}

/** Get FloatModifierMultiplicative value from a modifier container. */
function getFloatModValue(container: any): number {
  if (!container) return 0;
  const mod = container?.FloatModifierMultiplicative;
  if (mod) return Number(mod["@_value"]) || 0;
  return 0;
}

/** Extract mining laser modifier fields from a MiningLaserModifier element. */
function extractMiningLaserModifiers(miningMod: any) {
  return {
    laserInstability: getFloatModValue(miningMod?.laserInstability),
    resistance: getFloatModValue(miningMod?.resistanceModifier),
    optimalChargeWindow: getFloatModValue(miningMod?.optimalChargeWindowSizeModifier),
    optimalChargeRate: getFloatModValue(miningMod?.optimalChargeWindowRateModifier),
    overchargeRate: getFloatModValue(miningMod?.catastrophicChargeWindowRateModifier),
    shatterDamage: getFloatModValue(miningMod?.shatterdamageModifier),
    clusterModifier: getFloatModValue(miningMod?.clusterFactorModifier),
  };
}

/**
 * Extract weapon damage multipliers from ItemWeaponModifiersParams entries.
 * fireActionIndex 0 = mining laser power, fireActionIndex 1 = extraction laser power.
 * Values are stored as multipliers (1.0 = 100%), we convert to percentage.
 */
function extractWeaponModifiers(modifiers: any): { miningLaserPower: number; extractionLaserPower: number } {
  const weaponMods = asArray(modifiers?.ItemWeaponModifiersParams);

  let miningLaserPower = 100;
  let extractionLaserPower = 100;

  for (const wm of weaponMods) {
    const index = Number(wm?.["@_fireActionIndex"]) || 0;
    const dmgMult = Number(wm?.weaponModifier?.weaponStats?.["@_damageMultiplier"]) || 1;
    const pct = Math.round(dmgMult * 100);

    if (index === 0) {
      miningLaserPower = pct;
    } else if (index === 1) {
      extractionLaserPower = pct;
    }
  }

  return { miningLaserPower, extractionLaserPower };
}

export function parseMiningModule(filePath: string, moduleType: "active" | "passive", MODULE_NAME_MAP: Record<string, string>): ParsedMiningModule | null {
  const baseName = path.basename(filePath, ".xml");
  if (shouldSkip(baseName)) return null;

  const parsed = parseXmlFile(filePath);
  const root = getRootEntity(parsed);
  if (!root) return null;

  const components = root.Components;
  if (!components) return null;

  const attachModifier = findComp(components, "EntityComponentAttachableModifierParams");
  if (!attachModifier) return null;

  const modifiers = attachModifier.modifiers;
  if (!modifiers) return null;

  const miningModParams = modifiers.ItemMiningModifierParams;

  // Active modules: charges + lifetime from EntityComponentAttachableModifierParams + ItemModifierTimedLife
  // Passive modules use ActivateOnAttach and don't have meaningful charges/duration
  const isActive = moduleType === "active";
  const charges = isActive ? (Number(attachModifier["@_charges"]) || 0) : 0;

  let lifetime = 0;
  if (isActive && miningModParams) {
    const timedLife = miningModParams.modifierLifetime?.ItemModifierTimedLife;
    if (timedLife) {
      lifetime = Number(timedLife["@_lifetime"]) || 0;
    }
  }

  // Mining laser modifiers
  const miningMod = miningModParams?.MiningLaserModifier;
  const laserMods = extractMiningLaserModifiers(miningMod);

  // Filter modifier (inert materials)
  const filterParams = modifiers.MiningFilterItemModifierParams;
  const inertMaterials = -getFloatModValue(filterParams?.filterParams?.filterModifier);

  // Weapon modifiers (laser power / extraction power)
  const { miningLaserPower, extractionLaserPower } = extractWeaponModifiers(modifiers);

  const name = MODULE_NAME_MAP[baseName] || baseName.replace(/^mining_modules_(active|passive)_/, "");

  return {
    name,
    type: moduleType,
    price: 0,
    duration: lifetime,
    uses: charges,
    miningLaserPower,
    laserInstability: laserMods.laserInstability,
    resistance: laserMods.resistance,
    optimalChargeWindow: laserMods.optimalChargeWindow,
    optimalChargeRate: laserMods.optimalChargeRate,
    overchargeRate: laserMods.overchargeRate,
    shatterDamage: laserMods.shatterDamage,
    extractionLaserPower,
    inertMaterials,
    clusterModifier: laserMods.clusterModifier,
    description: "",
  };
}

export function parseMiningGadget(filePath: string, GADGET_NAME_MAP: Record<string, string>): ParsedMiningGadget | null {
  const baseName = path.basename(filePath, ".xml");
  if (shouldSkip(baseName)) return null;

  const parsed = parseXmlFile(filePath);
  const root = getRootEntity(parsed);
  if (!root) return null;

  const components = root.Components;
  if (!components) return null;

  const attachModifier = findComp(components, "EntityComponentAttachableModifierParams");
  if (!attachModifier) return null;

  const modifiers = attachModifier.modifiers;
  if (!modifiers) return null;

  // Gadgets use ItemMineableRockModifierParams (not ItemMiningModifierParams)
  const rockModParams = modifiers.ItemMineableRockModifierParams;
  const miningMod = rockModParams?.MiningLaserModifier;
  const laserMods = extractMiningLaserModifiers(miningMod);

  const name = GADGET_NAME_MAP[baseName] || baseName.replace(/^mining_gadget_\w+_/, "");

  return {
    name,
    type: "gadget",
    price: 0,
    laserInstability: laserMods.laserInstability,
    resistance: laserMods.resistance,
    optimalChargeWindow: laserMods.optimalChargeWindow,
    optimalChargeRate: laserMods.optimalChargeRate,
    extractionLaserPower: 0, // Gadgets don't modify extraction power
    inertMaterials: 0, // Gadgets don't have filter params
    clusterModifier: laserMods.clusterModifier,
    description: "",
  };
}

export function generateMiningGadgets(xmlDir: string, outputPath: string, version: string, overridesDir: string): { content: string; report: GeneratorReport } {
  const report = emptyReport("mining-gadgets");

  const names = loadNames(overridesDir);
  const MODULE_NAME_MAP: Record<string, string> = names.miningModules || {};
  const GADGET_NAME_MAP: Record<string, string> = names.miningGadgets || {};

  const moduleDir = path.join(xmlDir, "libs/foundry/records/entities/scitem/ships/utility/mining/miningarm");
  const gadgetDir = path.join(xmlDir, "libs/foundry/records/entities/scitem/weapons/devices");

  const activeFiles = findXmlFiles(moduleDir, /^mining_modules_active_/);
  const passiveFiles = findXmlFiles(moduleDir, /^mining_modules_passive_/);
  const gadgetFiles = findXmlFiles(gadgetDir, /^mining_gadget_/);

  report.found = activeFiles.length + passiveFiles.length + gadgetFiles.length;

  console.log(`  Found ${activeFiles.length} active, ${passiveFiles.length} passive, ${gadgetFiles.length} gadget XML files`);

  const activeModules: ParsedMiningModule[] = [];
  const passiveModules: ParsedMiningModule[] = [];
  const gadgets: ParsedMiningGadget[] = [];

  for (const file of activeFiles) {
    try {
      const mod = parseMiningModule(file, "active", MODULE_NAME_MAP);
      if (mod) {
        activeModules.push(mod);
      } else {
        report.skipped++;
      }
    } catch (err) {
      report.warnings.push(`Failed to parse ${path.basename(file)}: ${err}`);
    }
  }

  for (const file of passiveFiles) {
    try {
      const mod = parseMiningModule(file, "passive", MODULE_NAME_MAP);
      if (mod) {
        passiveModules.push(mod);
      } else {
        report.skipped++;
      }
    } catch (err) {
      report.warnings.push(`Failed to parse ${path.basename(file)}: ${err}`);
    }
  }

  for (const file of gadgetFiles) {
    try {
      const gad = parseMiningGadget(file, GADGET_NAME_MAP);
      if (gad) {
        gadgets.push(gad);
      } else {
        report.skipped++;
      }
    } catch (err) {
      report.warnings.push(`Failed to parse ${path.basename(file)}: ${err}`);
    }
  }

  activeModules.sort((a, b) => a.name.localeCompare(b.name));
  passiveModules.sort((a, b) => a.name.localeCompare(b.name));
  gadgets.sort((a, b) => a.name.localeCompare(b.name));

  report.produced = activeModules.length + passiveModules.length + gadgets.length;

  console.log(`  Parsed ${activeModules.length} active, ${passiveModules.length} passive, ${gadgets.length} gadgets`);

  // Generate TypeScript
  const lines: string[] = [
    `// Auto-generated from Data.p4k — ${version}`,
    `// Run: npm run sync:generate`,
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
  ];

  // Active modules
  lines.push(`// --- Active Modules ---`);
  lines.push(`export const activeModules: MiningModule[] = [`);
  for (const mod of activeModules) {
    lines.push(`  {`);
    lines.push(`    name: ${JSON.stringify(mod.name)},`);
    lines.push(`    type: "active",`);
    lines.push(`    price: ${mod.price},`);
    lines.push(`    duration: ${mod.duration},`);
    lines.push(`    uses: ${mod.uses},`);
    lines.push(`    miningLaserPower: ${mod.miningLaserPower},`);
    lines.push(`    laserInstability: ${mod.laserInstability},`);
    lines.push(`    resistance: ${mod.resistance},`);
    lines.push(`    optimalChargeWindow: ${mod.optimalChargeWindow},`);
    lines.push(`    optimalChargeRate: ${mod.optimalChargeRate},`);
    lines.push(`    overchargeRate: ${mod.overchargeRate},`);
    lines.push(`    shatterDamage: ${mod.shatterDamage},`);
    lines.push(`    extractionLaserPower: ${mod.extractionLaserPower},`);
    lines.push(`    inertMaterials: ${mod.inertMaterials},`);
    lines.push(`    clusterModifier: ${mod.clusterModifier},`);
    lines.push(`    description: ${JSON.stringify(mod.description)},`);
    lines.push(`  },`);
  }
  lines.push(`];`);
  lines.push(``);

  // Passive modules
  lines.push(`// --- Passive Modules ---`);
  lines.push(`export const passiveModules: MiningModule[] = [`);
  for (const mod of passiveModules) {
    lines.push(`  {`);
    lines.push(`    name: ${JSON.stringify(mod.name)},`);
    lines.push(`    type: "passive",`);
    lines.push(`    price: ${mod.price},`);
    lines.push(`    duration: ${mod.duration},`);
    lines.push(`    uses: ${mod.uses},`);
    lines.push(`    miningLaserPower: ${mod.miningLaserPower},`);
    lines.push(`    laserInstability: ${mod.laserInstability},`);
    lines.push(`    resistance: ${mod.resistance},`);
    lines.push(`    optimalChargeWindow: ${mod.optimalChargeWindow},`);
    lines.push(`    optimalChargeRate: ${mod.optimalChargeRate},`);
    lines.push(`    overchargeRate: ${mod.overchargeRate},`);
    lines.push(`    shatterDamage: ${mod.shatterDamage},`);
    lines.push(`    extractionLaserPower: ${mod.extractionLaserPower},`);
    lines.push(`    inertMaterials: ${mod.inertMaterials},`);
    lines.push(`    clusterModifier: ${mod.clusterModifier},`);
    lines.push(`    description: ${JSON.stringify(mod.description)},`);
    lines.push(`  },`);
  }
  lines.push(`];`);
  lines.push(``);

  // Gadgets
  lines.push(`// --- Gadgets (consumable, slot on mining head) ---`);
  lines.push(`export const miningGadgets: MiningGadget[] = [`);
  for (const gad of gadgets) {
    lines.push(`  {`);
    lines.push(`    name: ${JSON.stringify(gad.name)},`);
    lines.push(`    type: "gadget",`);
    lines.push(`    price: ${gad.price},`);
    lines.push(`    laserInstability: ${gad.laserInstability},`);
    lines.push(`    resistance: ${gad.resistance},`);
    lines.push(`    optimalChargeWindow: ${gad.optimalChargeWindow},`);
    lines.push(`    optimalChargeRate: ${gad.optimalChargeRate},`);
    lines.push(`    extractionLaserPower: ${gad.extractionLaserPower},`);
    lines.push(`    inertMaterials: ${gad.inertMaterials},`);
    lines.push(`    clusterModifier: ${gad.clusterModifier},`);
    lines.push(`    description: ${JSON.stringify(gad.description)},`);
    lines.push(`  },`);
  }
  lines.push(`];`);
  lines.push(``);

  // Legacy compat
  lines.push(`// Legacy compat: combined list for simple iterations`);
  lines.push(`export type MiningEquipment = MiningModule | MiningGadget;`);
  lines.push(``);

  return { content: lines.join("\n"), report };
}
