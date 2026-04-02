/**
 * Generator: loot.ts
 * Produces client/src/data/loot.ts by extracting loot table data from DataForge XML.
 *
 * Data flow:
 * 1. Scan all loot archetype XMLs to build a UUID → name map
 * 2. Scan all loot table XMLs (both V1 LootTable and V3 LootTableV3Record formats)
 * 3. Parse each table: entries with weights, optional data (chanceToExist, choiceLimit)
 * 4. Parse global params for special events (Christmas, Halloween, etc.)
 * 5. Derive location type from directory structure
 * 6. Output TypeScript
 */
import * as fs from "fs";
import * as path from "path";
import { GeneratorReport, emptyReport } from "../lib/xml-utils";

// ─── Interfaces ───

interface RawLootEntry {
  name: string;
  weight: number;
  chanceToExist?: number;
  minResults?: number;
  maxResults?: number;
  choiceLimit?: number;
  dupeLimit?: number;
}

interface RawLootTable {
  id: string;
  name: string;
  locationType: string;
  rarity: string;
  format: "v1" | "v3";
  entries: RawLootEntry[];
}

interface RawSpecialEvent {
  name: string;
  probabilityPerContainer: number;
  minEntries: number;
  maxEntries: number;
}

// ─── Helpers ───

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

/** Derive a location type from the file path relative to the loottables/ directory. */
function classifyLocation(filePath: string): string {
  const rel = filePath.replace(/\\/g, "/");
  if (rel.includes("/contestedzone/")) return "contestedzone";
  if (rel.includes("/derelict/")) return "derelict";
  if (rel.includes("/ugf/")) return "ugf";
  if (rel.includes("/distributioncenters/")) return "distributioncenters";
  if (rel.includes("/animals/")) return "animals";
  return "general";
}

/** Extract rarity from filename: common, uncommon, rare, legendary, or "mixed". */
function classifyRarity(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.includes("legendary")) return "legendary";
  if (lower.includes("rare") && !lower.includes("uncommon")) return "rare";
  if (lower.includes("uncommon")) return "uncommon";
  if (lower.includes("common")) return "common";
  return "mixed";
}

/** Convert XML class name to a readable table name. e.g. "LootTable.DerelictCommon" → "DerelictCommon" */
function extractTableName(content: string): string {
  // V3 format: <LootTableV3Record.V3LootTable_Mining ...>
  const v3Match = content.match(/<LootTableV3Record\.(\S+)/);
  if (v3Match) return v3Match[1];

  // V1 format: <LootTable.Ammo ...>
  const v1Match = content.match(/<LootTable\.(\S+)/);
  if (v1Match) return v1Match[1];

  return "Unknown";
}

// ─── Archetype UUID map ───

/** Build a map of archetype UUID → human-readable name from archetype XML files. */
function buildArchetypeMap(xmlDir: string): Map<string, string> {
  const archetypeDir = path.join(
    xmlDir,
    "libs/foundry/records/lootgeneration/lootarchetypes"
  );
  const map = new Map<string, string>();
  if (!fs.existsSync(archetypeDir)) return map;

  const files = fs.readdirSync(archetypeDir).filter((f) => f.endsWith(".xml"));
  for (const file of files) {
    const content = fs.readFileSync(path.join(archetypeDir, file), "utf-8");
    const refMatch = content.match(/__ref="([0-9a-f-]{36})"/);
    // Extract the name from the XML element: <LootArchetype.LootArchetype_AmmoCache_Common ...>
    const nameMatch = content.match(/<LootArchetype\.(\S+)/);
    if (refMatch && nameMatch) {
      // Clean up: strip "LootArchetype_" or "LootArchetypes_" prefix
      let name = nameMatch[1];
      name = name.replace(/^LootArchetype[s]?_/i, "");
      map.set(refMatch[1], name);
    }
  }
  return map;
}

// ─── V1 LootTable parser ───

function parseV1LootTable(
  content: string,
  filePath: string,
  archetypeMap: Map<string, string>
): RawLootTable | null {
  const tableName = extractTableName(content);
  const fileName = path.basename(filePath, ".xml");

  // Extract all WeightedLootArchetype entries
  const entries: RawLootEntry[] = [];
  const entryRegex =
    /WeightedLootArchetype[^>]*archetype="([0-9a-f-]{36})"[^>]*weight="([^"]+)"[^>]*>[\s\S]*?<numberOfResultsConstraints[^>]*minResults="([^"]+)"[^>]*maxResults="([^"]+)"/g;
  let match;
  while ((match = entryRegex.exec(content)) !== null) {
    const uuid = match[1];
    const weight = parseFloat(match[2]);
    const minResults = parseInt(match[3]);
    const maxResults = parseInt(match[4]);

    const name = archetypeMap.get(uuid) || `Unknown (${uuid.substring(0, 8)})`;
    entries.push({
      name,
      weight,
      minResults: minResults > 0 ? minResults : undefined,
      maxResults: maxResults > 0 ? maxResults : undefined,
    });
  }

  // Skip tables with no entries
  if (entries.length === 0) return null;

  return {
    id: fileName,
    name: tableName,
    locationType: classifyLocation(filePath),
    rarity: classifyRarity(fileName),
    format: "v1",
    entries,
  };
}

// ─── V3 LootTable parser ───

function parseV3LootTable(content: string, filePath: string): RawLootTable | null {
  const tableName = extractTableName(content);
  const fileName = path.basename(filePath, ".xml");

  // Extract all LootTableV3Entry elements
  const entries: RawLootEntry[] = [];
  const entryRegex =
    /<LootTableV3Entry\s+name="([^"]+)"\s+weight="([^"]+)"[^>]*>([\s\S]*?)(?=<LootTableV3Entry\s|<\/lootArchetypes>)/g;
  let match;
  while ((match = entryRegex.exec(content)) !== null) {
    const name = match[1];
    const weight = parseFloat(match[2]);
    const block = match[3];

    // Check for optional data
    let chanceToExist: number | undefined;
    const chanceMatch = block.match(/chanceToExist="([^"]+)"/);
    if (chanceMatch) chanceToExist = parseFloat(chanceMatch[1]);

    let choiceLimit: number | undefined;
    const choiceLimitMatch = block.match(/choiceLimit="(\d+)"/);
    if (choiceLimitMatch) choiceLimit = parseInt(choiceLimitMatch[1]);

    let dupeLimit: number | undefined;
    const dupeLimitMatch = block.match(/dupeLimit="(\d+)"/);
    if (dupeLimitMatch) dupeLimit = parseInt(dupeLimitMatch[1]);

    const entry: RawLootEntry = { name, weight };
    if (chanceToExist !== undefined) entry.chanceToExist = chanceToExist;
    if (choiceLimit !== undefined) entry.choiceLimit = choiceLimit;
    if (dupeLimit !== undefined) entry.dupeLimit = dupeLimit;
    entries.push(entry);
  }

  if (entries.length === 0) return null;

  return {
    id: fileName,
    name: tableName,
    locationType: classifyLocation(filePath),
    rarity: classifyRarity(fileName),
    format: "v3",
    entries,
  };
}

// ─── Global params parser ───

function parseGlobalParams(xmlDir: string): RawSpecialEvent[] {
  const filePath = path.join(
    xmlDir,
    "libs/foundry/records/lootgeneration/lootgenerationglobalparams.xml"
  );
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, "utf-8");
  const events: RawSpecialEvent[] = [];

  const eventRegex =
    /LootGenerationSpecialEventArchetype[^>]*eventString="([^"]+)"[^>]*probabilityPerContainer="([^"]+)"[^>]*minEntriesPerContainer="([^"]+)"[^>]*maxEntriesPerContainer="([^"]+)"/g;
  let match;
  while ((match = eventRegex.exec(content)) !== null) {
    events.push({
      name: match[1],
      probabilityPerContainer: parseFloat(match[2]),
      minEntries: parseInt(match[3]),
      maxEntries: parseInt(match[4]),
    });
  }
  return events;
}

// ─── Main generator ───

export function generateLoot(
  xmlDir: string,
  outputPath: string,
  version: string,
  overridesDir: string
): { content: string; report: GeneratorReport } {
  const report = emptyReport("loot");

  // Step 1: Build archetype UUID → name map
  const archetypeMap = buildArchetypeMap(xmlDir);
  console.log(`  Built archetype map: ${archetypeMap.size} entries`);

  // Step 2: Parse all loot table files
  const tableDir = path.join(
    xmlDir,
    "libs/foundry/records/lootgeneration/loottables"
  );
  const tableFiles = walkDir(tableDir);
  console.log(`  Found ${tableFiles.length} loot table files`);
  report.found = tableFiles.length;

  const lootTables: RawLootTable[] = [];
  for (const file of tableFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const isV3 = content.includes("LootTableV3Record");

    let table: RawLootTable | null;
    if (isV3) {
      table = parseV3LootTable(content, file);
    } else {
      table = parseV1LootTable(content, file, archetypeMap);
    }

    if (table) {
      lootTables.push(table);
    } else {
      report.skipped++;
    }
  }
  console.log(`  Parsed ${lootTables.length} loot tables (${report.skipped} skipped)`);

  // Step 3: Parse special events from global params
  const specialEvents = parseGlobalParams(xmlDir);
  console.log(`  Found ${specialEvents.length} special events`);

  // Step 4: Sort tables by location type, then by name
  lootTables.sort((a, b) => {
    if (a.locationType !== b.locationType) return a.locationType.localeCompare(b.locationType);
    return a.name.localeCompare(b.name);
  });

  report.produced = lootTables.length;

  // Count stats
  const v1Count = lootTables.filter((t) => t.format === "v1").length;
  const v3Count = lootTables.filter((t) => t.format === "v3").length;
  const byLocation = new Map<string, number>();
  for (const t of lootTables) {
    byLocation.set(t.locationType, (byLocation.get(t.locationType) || 0) + 1);
  }
  console.log(`  Format: ${v1Count} v1, ${v3Count} v3`);
  for (const [loc, count] of byLocation) {
    console.log(`    ${loc}: ${count}`);
  }

  // ─── Build output TypeScript ───
  const outputTables = lootTables.map((t) => ({
    id: t.id,
    name: t.name,
    locationType: t.locationType,
    rarity: t.rarity,
    entries: t.entries,
  }));

  const outputEvents = specialEvents.map((e) => ({
    name: e.name,
    probabilityPerContainer: e.probabilityPerContainer,
    minEntries: e.minEntries,
    maxEntries: e.maxEntries,
  }));

  const lines: string[] = [
    `// Auto-generated from DataForge extraction — ${version}`,
    `// Run: npm run sync:generate`,
    ``,
    `export interface LootTableEntry {`,
    `  name: string;`,
    `  weight: number;`,
    `  chanceToExist?: number;`,
    `  minResults?: number;`,
    `  maxResults?: number;`,
    `  choiceLimit?: number;`,
    `  dupeLimit?: number;`,
    `}`,
    ``,
    `export interface LootTable {`,
    `  id: string;`,
    `  name: string;`,
    `  locationType: string;`,
    `  rarity: string;`,
    `  entries: LootTableEntry[];`,
    `}`,
    ``,
    `export interface SpecialEvent {`,
    `  name: string;`,
    `  probabilityPerContainer: number;`,
    `  minEntries: number;`,
    `  maxEntries: number;`,
    `}`,
    ``,
    `export const lootTables: LootTable[] = ${JSON.stringify(outputTables, null, 2)};`,
    ``,
    `export const specialEvents: SpecialEvent[] = ${JSON.stringify(outputEvents, null, 2)};`,
    ``,
  ];

  return { content: lines.join("\n"), report };
}
