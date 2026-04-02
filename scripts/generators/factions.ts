/**
 * Generator: factions.ts
 * Produces client/src/data/factions.ts by extracting faction data from DataForge XML.
 *
 * Data flow:
 * 1. Scan all faction XMLs in factions/ (skip legacy/ and factionreputation/ subdirs)
 * 2. Build a UUID → faction name map for resolving allied/enemy references
 * 3. Parse each faction: name, type, reaction, arrest/police flags, allies, enemies
 * 4. Resolve @-prefixed name keys from localization
 * 5. Resolve allied/enemy UUIDs to human-readable faction names
 * 6. Output TypeScript
 */
import * as fs from "fs";
import * as path from "path";
import { GeneratorReport, emptyReport } from "../lib/xml-utils";
import { loadLocalization } from "../lib/localization";

// ─── Interfaces ───

interface RawFaction {
  id: string;
  nameKey: string;
  descriptionKey: string;
  defaultReaction: string;
  factionType: string;
  ableToArrest: boolean;
  policesCriminality: boolean;
  uuid: string;
  alliedUUIDs: string[];
  enemyUUIDs: string[];
}

// ─── Parsing ───

/** List XML files directly in a directory (non-recursive, skips subdirectories). */
function listXmlFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => !e.isDirectory() && e.name.endsWith(".xml"))
    .map((e) => path.join(dir, e.name));
}

function parseFaction(filePath: string): RawFaction | null {
  const content = fs.readFileSync(filePath, "utf-8");
  const fileName = path.basename(filePath, ".xml");

  // Extract __ref UUID
  const refMatch = content.match(/__ref="([0-9a-f-]{36})"/);
  if (!refMatch) return null;

  // Extract attributes from the root Faction element
  const nameMatch = content.match(/\bname="([^"]*)"/);
  const descMatch = content.match(/\bdescription="([^"]*)"/);
  const reactionMatch = content.match(/\bdefaultReaction="([^"]*)"/);
  const typeMatch = content.match(/\bfactionType="([^"]*)"/);
  const arrestMatch = content.match(/\bableToArrest="([01])"/);
  const policeMatch = content.match(/\bpolicesCriminality="([01])"/);

  const nameKey = nameMatch?.[1] || "";
  if (!nameKey || nameKey === "@LOC_UNINITIALIZED") return null;

  // Extract allied faction UUIDs
  const alliedUUIDs: string[] = [];
  const alliedBlock = content.match(/<alliedFactions>([\s\S]*?)<\/alliedFactions>/);
  if (alliedBlock) {
    const refRegex = /value="([0-9a-f-]{36})"/g;
    let m;
    while ((m = refRegex.exec(alliedBlock[1])) !== null) {
      alliedUUIDs.push(m[1]);
    }
  }

  // Extract enemy faction UUIDs
  const enemyUUIDs: string[] = [];
  const enemyBlock = content.match(/<enemyFactions>([\s\S]*?)<\/enemyFactions>/);
  if (enemyBlock) {
    const refRegex = /value="([0-9a-f-]{36})"/g;
    let m;
    while ((m = refRegex.exec(enemyBlock[1])) !== null) {
      enemyUUIDs.push(m[1]);
    }
  }

  return {
    id: fileName,
    nameKey,
    descriptionKey: descMatch?.[1] || "",
    defaultReaction: reactionMatch?.[1] || "Neutral",
    factionType: typeMatch?.[1] || "Unknown",
    ableToArrest: arrestMatch?.[1] === "1",
    policesCriminality: policeMatch?.[1] === "1",
    uuid: refMatch[1],
    alliedUUIDs,
    enemyUUIDs,
  };
}

function resolveLocKey(locMap: Map<string, string>, key: string): string {
  if (!key || key === "@LOC_UNINITIALIZED" || key === "@LOC_EMPTY") return "";
  const cleanKey = key.startsWith("@") ? key.substring(1).toLowerCase() : key.toLowerCase();
  return locMap.get(cleanKey) || "";
}

function prettifyFactionId(id: string): string {
  return id
    .replace(/^faction_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

// ─── Main generator ───

export function generateFactions(
  xmlDir: string,
  outputPath: string,
  version: string,
  overridesDir: string
): { content: string; report: GeneratorReport } {
  const report = emptyReport("factions");

  // Load localization
  const extractedPath = path.resolve(xmlDir, "..", "..");
  const localizationMap = loadLocalization(extractedPath);

  // Scan faction XMLs — only top-level files, skip legacy/ and factionreputation/ subdirs
  const factionsDir = path.join(xmlDir, "libs/foundry/records/factions");
  const files = listXmlFiles(factionsDir);
  console.log(`  Found ${files.length} faction files`);
  report.found = files.length;

  // Step 1: Parse all factions and build UUID → name map
  const rawFactions: RawFaction[] = [];
  const uuidToName = new Map<string, string>();

  for (const file of files) {
    const faction = parseFaction(file);
    if (faction) {
      rawFactions.push(faction);
      // Resolve display name for the UUID map
      const displayName =
        resolveLocKey(localizationMap, faction.nameKey) || prettifyFactionId(faction.id);
      uuidToName.set(faction.uuid, displayName);
    } else {
      report.skipped++;
    }
  }
  console.log(`  Parsed ${rawFactions.length} factions (${report.skipped} skipped)`);

  // Step 2: Build output with resolved allies/enemies
  const output: any[] = [];

  for (const faction of rawFactions) {
    const name =
      resolveLocKey(localizationMap, faction.nameKey) || prettifyFactionId(faction.id);

    const allies = faction.alliedUUIDs
      .map((uuid) => uuidToName.get(uuid))
      .filter((n): n is string => !!n)
      .sort();

    const enemies = faction.enemyUUIDs
      .map((uuid) => uuidToName.get(uuid))
      .filter((n): n is string => !!n)
      .sort();

    output.push({
      id: faction.id,
      name,
      type: faction.factionType,
      defaultReaction: faction.defaultReaction,
      canArrest: faction.ableToArrest,
      policesCrime: faction.policesCriminality,
      allies,
      enemies,
    });
  }

  // Sort alphabetically by name
  output.sort((a, b) => a.name.localeCompare(b.name));

  report.produced = output.length;

  // Count by faction type
  const typeCounts = new Map<string, number>();
  for (const f of output) {
    typeCounts.set(f.type, (typeCounts.get(f.type) || 0) + 1);
  }
  for (const [type, count] of [...typeCounts.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`    ${type}: ${count}`);
  }

  // ─── Build output TypeScript ───
  const lines: string[] = [
    `// Auto-generated from DataForge extraction + localization — ${version}`,
    `// Run: npm run sync:generate`,
    ``,
    `export interface Faction {`,
    `  id: string;`,
    `  name: string;`,
    `  type: string;`,
    `  defaultReaction: string;`,
    `  canArrest: boolean;`,
    `  policesCrime: boolean;`,
    `  allies: string[];`,
    `  enemies: string[];`,
    `}`,
    ``,
    `export const factions: Faction[] = ${JSON.stringify(output, null, 2)};`,
    ``,
  ];

  return { content: lines.join("\n"), report };
}
