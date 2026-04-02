/**
 * Generator: wikelo.ts
 * Produces client/src/data/wikelo.ts by extracting contract data from DataForge XML.
 *
 * Data flow:
 * 1. Parse thecollector.xml (contract generator) → get all contracts with:
 *    - debugName, notForRelease, template UUID, reward entity UUIDs
 * 2. Parse each contract template → get hauling orders (requirements):
 *    - entityClass UUIDs + minAmount for each required item
 * 3. Resolve all entity UUIDs to human-readable names
 * 4. Merge with editorial overrides (notes, tips, locations, emporiums, etc.)
 * 5. Output TypeScript
 *
 * The override JSON (data/overrides/wikelo.json) provides:
 * - Display name mappings for entities (UUID or internal name → readable name)
 * - Editorial content: emporiums, gathering items, reputation tiers, favor tips, notes
 * - Category classification for contracts
 * - Reputation tier assignment
 */
import * as fs from "fs";
import { GeneratorReport, emptyReport } from "../lib/xml-utils";
import * as path from "path";
import { resolveUUIDs } from "../lib/uuid-resolver";
import { loadLocalization } from "../lib/localization";

// ─── Interfaces ───

interface RawContract {
  debugName: string;
  id: string;
  notForRelease: boolean;
  templateUUID: string;
  templateFile: string | null;
  rewardEntityUUIDs: string[];
  rewardWeighted: boolean;
  requirements: { entityUUID: string; minAmount: number }[];
}

interface WikeloOverrides {
  reputationTiers: {
    tier: string;
    requirement: string;
    benefits: string[];
  }[];
  emporiums: {
    name: string;
    planet: string;
    moon?: string;
    system: string;
    coordinates: string;
    description: string;
    howToGet: string[];
    tiers: string[];
  }[];
  favorConversions?: {
    name: string;
    input: { item: string; quantity: number }[];
    output: { item: string; quantity: number };
  }[];
  contracts?: any[];
  gatheringItems: {
    name: string;
    category: string;
    locations: string[];
    tips: string;
  }[];
  favorTips: string[];
  displayNames?: Record<string, string>;
  contractMeta?: Record<string, {
    name?: string;
    tier?: string;
    category?: string;
    notes?: string;
  }>;
}

// ─── Parsing ───

/**
 * Parse thecollector.xml to extract all contracts.
 * Uses raw string parsing since fast-xml-parser struggles with the deeply nested structure.
 */
function parseGeneratorContracts(xmlDir: string): RawContract[] {
  const generatorFile = path.join(
    xmlDir,
    "libs/foundry/records/contracts/contractgenerator/thecollector.xml"
  );
  if (!fs.existsSync(generatorFile)) {
    console.warn("  WARNING: thecollector.xml not found");
    return [];
  }

  const content = fs.readFileSync(generatorFile, "utf-8");
  const contracts: RawContract[] = [];

  // Match each <Contract ...> block
  const contractRegex = /<Contract\s+id="([^"]*)"[^>]*notForRelease="([01])"[^>]*debugName="([^"]*)"[^>]*template="([^"]*)"[^>]*>/g;
  let match;
  while ((match = contractRegex.exec(content)) !== null) {
    const contractStart = match.index;
    // Find the closing </Contract> or next <Contract
    const closingIdx = content.indexOf("</Contract>", contractStart);
    const block = closingIdx > 0
      ? content.substring(contractStart, closingIdx + 11)
      : content.substring(contractStart, contractStart + 5000);

    // Extract reward entity UUIDs from ContractResult_Item
    const rewardUUIDs: string[] = [];
    let rewardWeighted = false;
    const itemResultRegex = /ContractResult_Item[^>]*entityClass="([^"]*)"/g;
    let rm;
    while ((rm = itemResultRegex.exec(block)) !== null) {
      rewardUUIDs.push(rm[1]);
    }
    // Check for weighted rewards
    if (block.includes("ContractResult_ItemsWeighting")) {
      rewardWeighted = true;
      const weightedRegex = /ItemAwardEntityClass[^>]*entityClass="([^"]*)"/g;
      while ((rm = weightedRegex.exec(block)) !== null) {
        rewardUUIDs.push(rm[1]);
      }
    }

    // Also check for inline hauling requirements in the contract block itself
    const inlineReqs = parseInlineHaulingOrders(block);

    contracts.push({
      debugName: match[3],
      id: match[1],
      notForRelease: match[2] === "1",
      templateUUID: match[4],
      templateFile: null,
      rewardEntityUUIDs: rewardUUIDs,
      rewardWeighted,
      requirements: inlineReqs,
    });
  }

  return contracts;
}

/**
 * Resolve template UUIDs to file paths.
 */
function resolveTemplates(
  xmlDir: string,
  contracts: RawContract[]
): void {
  const templateDir = path.join(
    xmlDir,
    "libs/foundry/records/contracts/contracttemplates"
  );
  if (!fs.existsSync(templateDir)) return;

  // Build UUID → file map from template files
  const templateMap = new Map<string, string>();
  const files = fs.readdirSync(templateDir).filter((f) => f.endsWith(".xml"));
  for (const file of files) {
    const filePath = path.join(templateDir, file);
    const fd = fs.openSync(filePath, "r");
    const buf = Buffer.alloc(1024);
    const bytesRead = fs.readSync(fd, buf, 0, 1024, 0);
    fs.closeSync(fd);
    const header = buf.toString("utf-8", 0, bytesRead);
    const refMatch = header.match(/__ref="([0-9a-f-]{36})"/);
    if (refMatch) {
      templateMap.set(refMatch[1], filePath);
    }
  }

  for (const contract of contracts) {
    contract.templateFile = templateMap.get(contract.templateUUID) || null;
  }
}

/**
 * Extract entity UUID + amount from a hauling order XML tag.
 * Handles both EntityClass (entityClass + minAmount) and Resource (resource + minSCU) variants.
 */
function extractHaulingEntry(tag: string): { entityUUID: string; minAmount: number } | null {
  // Try entityClass + minAmount (standard hauling orders)
  const entityMatch = tag.match(/entityClass="([0-9a-f-]{36})"/);
  const amountMatch = tag.match(/minAmount="(\d+)"/);
  if (entityMatch && amountMatch) {
    return { entityUUID: entityMatch[1], minAmount: parseInt(amountMatch[1], 10) };
  }

  // Try resource + minSCU (resource-based hauling orders, e.g. Polaris Quantanium)
  const resourceMatch = tag.match(/resource="([0-9a-f-]{36})"/);
  const scuMatch = tag.match(/minSCU="(\d+)"/);
  if (resourceMatch && scuMatch) {
    return { entityUUID: resourceMatch[1], minAmount: parseInt(scuMatch[1], 10) };
  }

  return null;
}

/**
 * Parse hauling orders from a contract template file.
 * Only matches HaulingOrder_EntityClass and HaulingOrder_Resource — NOT HaulingOrderContent_*
 * which are override/variant entries.
 */
function parseTemplateHaulingOrders(
  content: string
): { entityUUID: string; minAmount: number }[] {
  const requirements: { entityUUID: string; minAmount: number }[] = [];
  const regex = /<HaulingOrder_(EntityClass|Resource)\s[^>]*>/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const entry = extractHaulingEntry(match[0]);
    if (entry) requirements.push(entry);
  }
  return requirements;
}

/**
 * Parse inline hauling orders from a contract block in the generator XML.
 * Matches HaulingOrderContent_EntityClass and HaulingOrderContent_Resource
 * which are the inline requirement elements.
 */
function parseInlineHaulingOrders(
  content: string
): { entityUUID: string; minAmount: number }[] {
  const requirements: { entityUUID: string; minAmount: number }[] = [];
  const regex = /<HaulingOrderContent_(EntityClass|Resource)\s[^>]*>/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const entry = extractHaulingEntry(match[0]);
    if (entry) requirements.push(entry);
  }
  return requirements;
}

/**
 * Parse hauling orders (requirements) from a contract template file.
 */
function parseTemplateRequirements(
  templateFile: string
): { entityUUID: string; minAmount: number }[] {
  const content = fs.readFileSync(templateFile, "utf-8");
  return parseTemplateHaulingOrders(content);
}

/**
 * Collect all unique entity UUIDs that need resolution.
 */
function collectAllUUIDs(contracts: RawContract[]): Set<string> {
  const uuids = new Set<string>();
  for (const c of contracts) {
    for (const req of c.requirements) {
      uuids.add(req.entityUUID);
    }
    for (const rUUID of c.rewardEntityUUIDs) {
      uuids.add(rUUID);
    }
  }
  return uuids;
}

// ─── Category / Tier classification ───

function classifyCategory(debugName: string, rewardNames: string[]): string {
  const dn = debugName.toLowerCase();
  if (dn.includes("favour") || dn.includes("favor")) return "currency";
  if (dn.includes("vehicle_ground") || dn.includes("atls")) return "vehicle";
  if (dn.includes("vehicle") || dn.includes("polaris") || dn.includes("idris")) return "ship";
  if (dn.includes("arm") || dn.includes("armor") || dn.includes("suit")) return "armor";
  if (dn.includes("volt") || dn.includes("orb") || dn.includes("lightnin") || dn.includes("weapon")
      || dn.includes("lmg") || dn.includes("gun") || dn.includes("pistol") || dn.includes("battle")
      || dn.includes("booma") || dn.includes("zap") || dn.includes("hush")
      || dn.includes("molten") || dn.includes("thwack")) return "weapon";
  if (dn.includes("intro") || dn.includes("icansee") || dn.includes("foodorder")) return "utility";
  if (dn.includes("gg_")) return "weapon"; // Store exclusive items
  // Fallback: check reward names
  const rn = rewardNames.join(" ").toLowerCase();
  if (rn.includes("ship") || rn.includes("prospector") || rn.includes("vulture")
      || rn.includes("wolf") || rn.includes("zeus") || rn.includes("scorpius")
      || rn.includes("polaris") || rn.includes("idris")) return "ship";
  if (rn.includes("armor") || rn.includes("armour") || rn.includes("suit")) return "armor";
  if (rn.includes("rifle") || rn.includes("pistol") || rn.includes("lmg")
      || rn.includes("shotgun") || rn.includes("cannon") || rn.includes("weapon")) return "weapon";
  return "utility";
}

function classifyTier(debugName: string, requirements: { item: string; quantity: number }[]): string {
  const dn = debugName.toLowerCase();
  // Top tier: Polaris, Idris, super expensive
  if (dn.includes("polaris") || dn.includes("idris") || dn.includes("super")
      || dn.includes("toptier") || dn.includes("asgard") || dn.includes("large_crusader")) {
    return "Very Best Customer";
  }
  // Mid tier: medium/large vehicles, complex armor
  if (dn.includes("vehicle_large") || dn.includes("vehicle_medium")
      || dn.includes("ao_") || dn.includes("gg_xanthule")) {
    return "Very Good Customer";
  }
  // Check total favor requirement
  const favorReq = requirements.find((r) => r.item === "Wikelo Favor");
  if (favorReq && favorReq.quantity >= 25) return "Very Best Customer";
  if (favorReq && favorReq.quantity >= 5) return "Very Good Customer";
  return "New Customer";
}

// ─── Main generator ───

export function generateWikelo(
  xmlDir: string,
  outputPath: string,
  version: string,
  overridesDir: string
): { content: string; report: GeneratorReport } {
  const report = emptyReport("wikelo");

  // Load overrides for editorial content
  const overridesPath = path.join(overridesDir, "wikelo.json");
  let overrides: WikeloOverrides | null = null;
  if (fs.existsSync(overridesPath)) {
    overrides = JSON.parse(fs.readFileSync(overridesPath, "utf-8"));
  }
  if (!overrides) {
    report.warnings.push("Cannot generate wikelo.ts without overrides file");
    return { content: "", report };
  }

  // Step 1: Parse contracts from generator XML
  const rawContracts = parseGeneratorContracts(xmlDir);
  console.log(`  Parsed ${rawContracts.length} contracts from thecollector.xml`);

  // Step 2: Resolve template files and parse requirements
  // Template requirements take priority over inline requirements from the contract block
  resolveTemplates(xmlDir, rawContracts);
  for (const contract of rawContracts) {
    if (contract.templateFile) {
      const templateReqs = parseTemplateRequirements(contract.templateFile);
      if (templateReqs.length > 0) {
        contract.requirements = templateReqs;
      }
    }
  }

  // Step 3: Build display name map from overrides
  const displayNameMap = new Map<string, string>();
  if (overrides.displayNames) {
    for (const [key, value] of Object.entries(overrides.displayNames)) {
      displayNameMap.set(key, value);
    }
  }

  // Step 4: Load localization (optional — falls back gracefully)
  const extractedPath = path.resolve(xmlDir, "..", "..");
  const localizationMap = loadLocalization(extractedPath);

  // Step 5: Resolve all entity UUIDs
  const allUUIDs = collectAllUUIDs(rawContracts);
  console.log(`  Resolving ${allUUIDs.size} entity UUIDs...`);
  const resolved = resolveUUIDs(xmlDir, allUUIDs, displayNameMap, localizationMap);

  // Fallback: resolve any remaining UUIDs directly from displayNames
  // (handles resource UUIDs that don't have entity files)
  for (const uuid of allUUIDs) {
    if (!resolved.has(uuid) && displayNameMap.has(uuid)) {
      resolved.set(uuid, {
        uuid,
        internalName: uuid,
        displayName: displayNameMap.get(uuid)!,
        filePath: "",
      });
    }
  }
  console.log(`  Resolved ${resolved.size}/${allUUIDs.size} UUIDs`);

  // Step 6: Build contract metadata from overrides
  const contractMeta = overrides.contractMeta || {};

  // Step 7: Assemble final contracts
  const contracts: any[] = [];
  for (const raw of rawContracts) {
    // Resolve requirements
    const requirements = raw.requirements.map((req) => {
      const entity = resolved.get(req.entityUUID);
      return {
        item: entity?.displayName || `Unknown (${req.entityUUID.substring(0, 8)})`,
        quantity: req.minAmount,
      };
    });

    // Resolve rewards
    const rewards = raw.rewardEntityUUIDs.map((uuid) => {
      const entity = resolved.get(uuid);
      return entity?.displayName || `Unknown Reward (${uuid.substring(0, 8)})`;
    });

    // Get override metadata
    const meta = contractMeta[raw.debugName] || {};
    const category = meta.category || classifyCategory(raw.debugName, rewards);
    const tier = meta.tier || classifyTier(raw.debugName, requirements);
    const name = meta.name || raw.debugName
      .replace(/^TheCollector_/, "")
      .replace(/\(DO_NOT_USE.*\)/, "")
      .replace(/_/g, " ")
      .trim();

    contracts.push({
      id: raw.debugName,
      name,
      tier,
      category,
      requirements,
      rewards: rewards.length > 0 ? rewards : ["Unknown"],
      active: !raw.notForRelease,
      ...(meta.notes ? { notes: meta.notes } : {}),
    });
  }

  // Sort: active first, then by tier, then by category
  const tierOrder: Record<string, number> = {
    "New Customer": 0,
    "Very Good Customer": 1,
    "Very Best Customer": 2,
  };
  contracts.sort((a, b) => {
    if (a.active !== b.active) return a.active ? -1 : 1;
    const ta = tierOrder[a.tier] ?? 99;
    const tb = tierOrder[b.tier] ?? 99;
    if (ta !== tb) return ta - tb;
    return a.name.localeCompare(b.name);
  });

  // Favor conversions: extract from contracts that are "forfavours" type
  const favorConversions: any[] = [];
  for (const raw of rawContracts) {
    if (!raw.debugName.toLowerCase().includes("favour")) continue;
    const reqs = raw.requirements.map((req) => {
      const entity = resolved.get(req.entityUUID);
      return { item: entity?.displayName || `Unknown`, quantity: req.minAmount };
    });
    const rewards = raw.rewardEntityUUIDs.map((uuid) => {
      const entity = resolved.get(uuid);
      return entity?.displayName || "Unknown";
    });
    const meta = contractMeta[raw.debugName] || {};

    if (reqs.length === 0) {
      console.warn(`  WARNING: favour contract "${raw.debugName}" has no requirements`);
      console.warn(`    templateUUID: ${raw.templateUUID || "(none)"}`);
      console.warn(`    templateFile: ${raw.templateFile || "(none)"}`);
      report.warnings.push(`Favour contract "${raw.debugName}" has empty input requirements`);
    }

    favorConversions.push({
      name: meta.name || raw.debugName.replace(/^TheCollector_/, "").replace(/_/g, " "),
      input: reqs,
      output: { item: rewards[0] || "Wikelo Favor", quantity: 1 },
    });
  }

  console.log(`  Contracts: ${contracts.length} (${contracts.filter((c) => c.active).length} active)`);
  console.log(`  Favor conversions: ${favorConversions.length}`);
  console.log(`  Gathering items: ${overrides.gatheringItems.length}`);
  console.log(`  Emporiums: ${overrides.emporiums.length}`);

  // ─── Build output TypeScript ───
  const lines: string[] = [
    `// Auto-generated from DataForge extraction + overrides — ${version}`,
    `// Run: npm run sync:generate`,
    ``,
    `export type ReputationTier = "New Customer" | "Very Good Customer" | "Very Best Customer";`,
    ``,
    `export type ContractCategory = "currency" | "utility" | "weapon" | "armor" | "vehicle" | "ship" | "component";`,
    ``,
    `export interface WikeloContract {`,
    `  id: string;`,
    `  name: string;`,
    `  tier: ReputationTier;`,
    `  category: ContractCategory;`,
    `  requirements: { item: string; quantity: number }[];`,
    `  rewards: string[];`,
    `  active: boolean;`,
    `  notes?: string;`,
    `}`,
    ``,
    `export interface GatheringItem {`,
    `  name: string;`,
    `  category: "ore" | "harvestable" | "creature_drop" | "scrip" | "loot" | "component" | "commodity";`,
    `  locations: string[];`,
    `  tips: string;`,
    `}`,
    ``,
    `export interface Emporium {`,
    `  name: string;`,
    `  planet: string;`,
    `  moon?: string;`,
    `  system: string;`,
    `  coordinates: string;`,
    `  description: string;`,
    `  howToGet: string[];`,
    `  tiers: ReputationTier[];`,
    `}`,
    ``,
    `export interface FavorConversion {`,
    `  name: string;`,
    `  input: { item: string; quantity: number }[];`,
    `  output: { item: string; quantity: number };`,
    `}`,
    ``,
  ];

  // Reputation tiers (from overrides — editorial)
  lines.push(`export const reputationTiers: {`);
  lines.push(`  tier: ReputationTier;`);
  lines.push(`  requirement: string;`);
  lines.push(`  benefits: string[];`);
  lines.push(`}[] = ${JSON.stringify(overrides.reputationTiers, null, 2)};`);
  lines.push(``);

  // Emporiums (from overrides — editorial)
  lines.push(`export const emporiums: Emporium[] = ${JSON.stringify(overrides.emporiums, null, 2)};`);
  lines.push(``);

  // Favor conversions (extracted from DataForge)
  lines.push(`export const favorConversions: FavorConversion[] = ${JSON.stringify(favorConversions, null, 2)};`);
  lines.push(``);

  // Contracts (extracted from DataForge)
  lines.push(`export const contracts: WikeloContract[] = ${JSON.stringify(contracts, null, 2)};`);
  lines.push(``);

  // Gathering items (from overrides — editorial)
  lines.push(`export const gatheringItems: GatheringItem[] = ${JSON.stringify(overrides.gatheringItems, null, 2)};`);
  lines.push(``);

  // Favor tips (from overrides — editorial)
  lines.push(`export const favorTips = ${JSON.stringify(overrides.favorTips, null, 2)};`);
  lines.push(``);

  report.produced = contracts.length;

  return { content: lines.join("\n"), report };
}
