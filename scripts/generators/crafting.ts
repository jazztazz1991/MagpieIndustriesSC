/**
 * Generator: crafting.ts
 * Produces client/src/data/crafting.ts by extracting blueprint/fabricator data from DataForge XML.
 *
 * Data flow:
 * 1. Scan all blueprint XMLs in crafting/blueprints/crafting/fpsgear/
 * 2. Parse each blueprint: entity created, costs, craft time, aspect slots
 * 3. Scan mission reward pools to map blueprints → missions
 * 4. Resolve resource UUIDs and entity UUIDs to names
 * 5. Output TypeScript
 */
import * as fs from "fs";
import * as path from "path";
import { GeneratorReport, emptyReport } from "../lib/xml-utils";
import { resolveUUIDs } from "../lib/uuid-resolver";
import { loadLocalization } from "../lib/localization";

// ─── Interfaces ───

interface CraftingOverrides {
  resourceNames: Record<string, string>;
  propertyNames: Record<string, string>;
}

interface RawAspect {
  slotName: string;
  resourceUUID: string;
  quantitySCU: number;
  propertyModifiers: {
    propertyUUID: string;
    modifierAtStart: number;
    modifierAtEnd: number;
  }[];
}

interface RawBlueprint {
  id: string;
  fileName: string;
  uuid: string;
  categoryUUID: string;
  entityClassUUID: string;
  craftTimeSeconds: number;
  aspects: RawAspect[];
  itemCosts: { entityUUID: string; quantity: number }[];
  blueprintType: "weapon" | "armor" | "ammo";
  subCategory: string;
}

interface RawRewardPool {
  name: string;
  blueprintUUIDs: string[];
}

// ─── Parsing ───

function walkDir(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(full));
    } else if (entry.name.endsWith(".xml")) {
      results.push(full);
    }
  }
  return results;
}

function classifyBlueprint(filePath: string): { type: "weapon" | "armor" | "ammo"; subCategory: string } {
  const rel = filePath.replace(/\\/g, "/");
  if (rel.includes("/weapons/")) {
    const sub = rel.match(/\/weapons\/(\w+)\//);
    return { type: "weapon", subCategory: sub ? sub[1] : "unknown" };
  }
  if (rel.includes("/armour/")) {
    const sub = rel.match(/\/armour\/(\w+)\//);
    return { type: "armor", subCategory: sub ? sub[1] : "unknown" };
  }
  if (rel.includes("/ammo/")) {
    const sub = rel.match(/\/ammo\/(\w+)\//);
    return { type: "ammo", subCategory: sub ? sub[1] : "unknown" };
  }
  return { type: "weapon", subCategory: "unknown" };
}

function parseBlueprint(filePath: string): RawBlueprint | null {
  const content = fs.readFileSync(filePath, "utf-8");
  const fileName = path.basename(filePath, ".xml");

  // Extract root ref UUID
  const refMatch = content.match(/__ref="([0-9a-f-]{36})"/);
  if (!refMatch) return null;

  // Extract category UUID
  const catMatch = content.match(/category="([0-9a-f-]{36})"/);

  // Extract entity class (what the blueprint creates)
  const entityMatch = content.match(/CraftingProcess_Creation[^>]*entityClass="([0-9a-f-]{36})"/);

  // Extract craft time
  let craftTimeSeconds = 0;
  const timeMatch = content.match(
    /TimeValue_Partitioned[^>]*days="(\d+)"[^>]*hours="(\d+)"[^>]*minutes="(\d+)"[^>]*seconds="(\d+)"/
  );
  if (timeMatch) {
    craftTimeSeconds =
      parseInt(timeMatch[1]) * 86400 +
      parseInt(timeMatch[2]) * 3600 +
      parseInt(timeMatch[3]) * 60 +
      parseInt(timeMatch[4]);
  }

  // Extract aspect slots with resources and property modifiers
  const aspects: RawAspect[] = [];
  // Match each inner CraftingCost_Select (aspect slot)
  // Pattern: find debugName for slot, then resource and modifiers within that block
  const slotRegex = /<CraftingCost_Select[^>]*count="1"[^>]*>([\s\S]*?)(?=<CraftingCost_Select[^>]*count="1"|<\/options>\s*<\/CraftingCost_Select>\s*<\/mandatoryCost>)/g;
  let slotMatch;
  while ((slotMatch = slotRegex.exec(content)) !== null) {
    const slotBlock = slotMatch[1];
    const nameMatch = slotBlock.match(/debugName="([^"]+)"/);
    if (!nameMatch) continue;
    const slotName = nameMatch[1];

    // Skip the outer ASPECTS container
    if (slotName === "ASPECTS") continue;

    // Get resource
    const resMatch = slotBlock.match(/CraftingCost_Resource[^>]*resource="([0-9a-f-]{36})"[^>]*/);
    const scuMatch = slotBlock.match(/standardCargoUnits="([^"]+)"/);

    // Get property modifiers
    const modifiers: RawAspect["propertyModifiers"] = [];
    const modRegex = /gameplayPropertyRecord="([0-9a-f-]{36})"[\s\S]*?modifierAtStart="([^"]+)"[^>]*modifierAtEnd="([^"]+)"/g;
    let modMatch;
    while ((modMatch = modRegex.exec(slotBlock)) !== null) {
      modifiers.push({
        propertyUUID: modMatch[1],
        modifierAtStart: parseFloat(modMatch[2]),
        modifierAtEnd: parseFloat(modMatch[3]),
      });
    }

    if (resMatch && scuMatch) {
      aspects.push({
        slotName,
        resourceUUID: resMatch[1],
        quantitySCU: parseFloat(scuMatch[1]),
        propertyModifiers: modifiers,
      });
    }
  }

  // Extract item costs (CraftingCost_Item)
  const itemCosts: { entityUUID: string; quantity: number }[] = [];
  const itemCostRegex = /CraftingCost_Item[^>]*entityClass="([0-9a-f-]{36})"[^>]*quantity="(\d+)"/g;
  let icMatch;
  while ((icMatch = itemCostRegex.exec(content)) !== null) {
    itemCosts.push({ entityUUID: icMatch[1], quantity: parseInt(icMatch[2]) });
  }

  const classification = classifyBlueprint(filePath);

  return {
    id: fileName.replace(/^bp_craft_/, ""),
    fileName,
    uuid: refMatch[1],
    categoryUUID: catMatch?.[1] || "",
    entityClassUUID: entityMatch?.[1] || "",
    craftTimeSeconds,
    aspects,
    itemCosts,
    blueprintType: classification.type,
    subCategory: classification.subCategory,
  };
}

function parseRewardPools(xmlDir: string): RawRewardPool[] {
  const poolDir = path.join(
    xmlDir,
    "libs/foundry/records/crafting/blueprintrewards/blueprintmissionpools"
  );
  if (!fs.existsSync(poolDir)) return [];

  const pools: RawRewardPool[] = [];
  for (const file of fs.readdirSync(poolDir).filter((f) => f.endsWith(".xml"))) {
    const content = fs.readFileSync(path.join(poolDir, file), "utf-8");
    const nameMatch = content.match(/BlueprintPoolRecord\.(\S+)/);
    const name = nameMatch
      ? nameMatch[1].replace(/^BP_MISSIONREWARD_/i, "")
      : file.replace(".xml", "");

    const uuids: string[] = [];
    const rewardRegex = /blueprintRecord="([0-9a-f-]{36})"/g;
    let m;
    while ((m = rewardRegex.exec(content)) !== null) {
      uuids.push(m[1]);
    }
    pools.push({ name, blueprintUUIDs: uuids });
  }
  return pools;
}

function formatCraftTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

function prettifyBlueprintId(id: string): string {
  // e.g. "klwe_sniper_energy_01" → "Klwe Sniper Energy 01"
  // Will be overridden by entity display name resolution when possible
  return id
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

// ─── Main generator ───

export function generateCrafting(
  xmlDir: string,
  outputPath: string,
  version: string,
  overridesDir: string
): { content: string; report: GeneratorReport } {
  const report = emptyReport("crafting");

  // Load overrides
  const overridesPath = path.join(overridesDir, "crafting.json");
  let overrides: CraftingOverrides = { resourceNames: {}, propertyNames: {} };
  if (fs.existsSync(overridesPath)) {
    overrides = JSON.parse(fs.readFileSync(overridesPath, "utf-8"));
  }

  const resourceNames = new Map(Object.entries(overrides.resourceNames));
  const propertyNames = new Map(Object.entries(overrides.propertyNames));

  // Step 1: Parse all blueprints
  const bpDir = path.join(xmlDir, "libs/foundry/records/crafting/blueprints/crafting/fpsgear");
  const bpFiles = walkDir(bpDir);
  console.log(`  Found ${bpFiles.length} blueprint files`);
  report.found = bpFiles.length;

  const blueprints: RawBlueprint[] = [];
  for (const file of bpFiles) {
    const bp = parseBlueprint(file);
    if (bp) {
      blueprints.push(bp);
    } else {
      report.skipped++;
    }
  }
  console.log(`  Parsed ${blueprints.length} blueprints`);

  // Step 2: Parse mission reward pools
  const rewardPools = parseRewardPools(xmlDir);
  console.log(`  Found ${rewardPools.length} mission reward pools`);

  // Build blueprint UUID → mission names map
  const bpToMissions = new Map<string, string[]>();
  for (const pool of rewardPools) {
    for (const uuid of pool.blueprintUUIDs) {
      const existing = bpToMissions.get(uuid) || [];
      existing.push(pool.name);
      bpToMissions.set(uuid, existing);
    }
  }

  // Step 3: Resolve entity UUIDs for display names
  const entityUUIDs = new Set<string>();
  for (const bp of blueprints) {
    if (bp.entityClassUUID) entityUUIDs.add(bp.entityClassUUID);
    for (const ic of bp.itemCosts) {
      entityUUIDs.add(ic.entityUUID);
    }
  }

  const displayNameMap = new Map<string, string>();
  // Also add resource names as display names for fallback
  for (const [k, v] of resourceNames) {
    displayNameMap.set(k, v);
  }

  console.log(`  Resolving ${entityUUIDs.size} entity UUIDs...`);
  const extractedPath = path.resolve(xmlDir, "..", "..");
  const localizationMap = loadLocalization(extractedPath);
  const resolved = resolveUUIDs(xmlDir, entityUUIDs, displayNameMap, localizationMap);
  console.log(`  Resolved ${resolved.size}/${entityUUIDs.size} entity UUIDs`);

  // Step 4: Build output
  const outputBlueprints: any[] = [];
  for (const bp of blueprints) {
    const entityName = resolved.get(bp.entityClassUUID)?.displayName
      || prettifyBlueprintId(bp.id);

    const aspects = bp.aspects.map((a) => ({
      slot: a.slotName.replace(/:$/, ""),
      resource: resourceNames.get(a.resourceUUID) || `Unknown (${a.resourceUUID.substring(0, 8)})`,
      quantitySCU: a.quantitySCU,
      modifiers: a.propertyModifiers.map((m) => ({
        property: propertyNames.get(m.propertyUUID) || `Unknown (${m.propertyUUID.substring(0, 8)})`,
        range: [m.modifierAtEnd, m.modifierAtStart],
      })),
    }));

    const itemCosts = bp.itemCosts.map((ic) => ({
      item: resolved.get(ic.entityUUID)?.displayName || `Unknown (${ic.entityUUID.substring(0, 8)})`,
      quantity: ic.quantity,
    }));

    const missions = bpToMissions.get(bp.uuid) || [];

    outputBlueprints.push({
      id: bp.id,
      name: entityName,
      type: bp.blueprintType,
      subCategory: bp.subCategory,
      craftTime: formatCraftTime(bp.craftTimeSeconds),
      craftTimeSeconds: bp.craftTimeSeconds,
      aspects,
      itemCosts: itemCosts.length > 0 ? itemCosts : undefined,
      obtainedFrom: missions.length > 0 ? missions : undefined,
    });
  }

  // Sort: weapons, then armor, then ammo; within each by name
  const typeOrder = { weapon: 0, armor: 1, ammo: 2 };
  outputBlueprints.sort((a, b) => {
    const ta = typeOrder[a.type as keyof typeof typeOrder] ?? 99;
    const tb = typeOrder[b.type as keyof typeof typeOrder] ?? 99;
    if (ta !== tb) return ta - tb;
    return a.name.localeCompare(b.name);
  });

  report.produced = outputBlueprints.length;

  // Count stats for summary
  const weapons = outputBlueprints.filter((b) => b.type === "weapon").length;
  const armor = outputBlueprints.filter((b) => b.type === "armor").length;
  const ammo = outputBlueprints.filter((b) => b.type === "ammo").length;
  const withMissions = outputBlueprints.filter((b) => b.obtainedFrom).length;
  console.log(`  Blueprints: ${weapons} weapons, ${armor} armor, ${ammo} ammo`);
  console.log(`  ${withMissions} blueprints have known mission sources`);

  // ─── Build output TypeScript ───
  const lines: string[] = [
    `// Auto-generated from DataForge extraction + overrides — ${version}`,
    `// Run: npm run sync:generate`,
    ``,
    `export type BlueprintType = "weapon" | "armor" | "ammo";`,
    ``,
    `export interface AspectModifier {`,
    `  property: string;`,
    `  range: [number, number];`,
    `}`,
    ``,
    `export interface BlueprintAspect {`,
    `  slot: string;`,
    `  resource: string;`,
    `  quantitySCU: number;`,
    `  modifiers: AspectModifier[];`,
    `}`,
    ``,
    `export interface Blueprint {`,
    `  id: string;`,
    `  name: string;`,
    `  type: BlueprintType;`,
    `  subCategory: string;`,
    `  craftTime: string;`,
    `  craftTimeSeconds: number;`,
    `  aspects: BlueprintAspect[];`,
    `  itemCosts?: { item: string; quantity: number }[];`,
    `  obtainedFrom?: string[];`,
    `}`,
    ``,
    `export const blueprints: Blueprint[] = ${JSON.stringify(outputBlueprints, null, 2)};`,
    ``,
  ];

  return { content: lines.join("\n"), report };
}
