/**
 * Generator: mission-givers.ts
 * Produces client/src/data/mission-givers.ts by extracting mission giver data from DataForge XML.
 *
 * Data flow:
 * 1. Scan all mission giver XMLs in missiongiver/ (recursive, includes subdirectories)
 * 2. Parse each mission giver: displayName, description, headquarters
 * 3. Resolve @-prefixed keys from localization
 * 4. Skip entries with unresolved/placeholder localization
 * 5. Output TypeScript
 */
import * as fs from "fs";
import * as path from "path";
import { GeneratorReport, emptyReport } from "../lib/xml-utils";
import { loadLocalization } from "../lib/localization";

// ─── Interfaces ───

interface RawMissionGiver {
  id: string;
  displayNameKey: string;
  descriptionKey: string;
  headquartersKey: string;
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

function parseMissionGiver(filePath: string): RawMissionGiver | null {
  const content = fs.readFileSync(filePath, "utf-8");
  const fileName = path.basename(filePath, ".xml");

  // Extract root element name (e.g., MissionGiver.CDF)
  const rootMatch = content.match(/<MissionGiver\.(\S+)\s/);
  if (!rootMatch) return null;

  const id = rootMatch[1];

  // Extract attributes
  const displayNameMatch = content.match(/\bdisplayName="([^"]*)"/);
  const descriptionMatch = content.match(/\bdescription="([^"]*)"/);
  const headquartersMatch = content.match(/\bheadquarters="([^"]*)"/);

  const displayNameKey = displayNameMatch?.[1] || "";

  // Skip entries with no display name or uninitialized placeholders
  if (!displayNameKey || displayNameKey === "@LOC_UNINITIALIZED") return null;

  return {
    id,
    displayNameKey,
    descriptionKey: descriptionMatch?.[1] || "",
    headquartersKey: headquartersMatch?.[1] || "",
  };
}

function resolveLocKey(locMap: Map<string, string>, key: string): string {
  if (!key || key === "@LOC_UNINITIALIZED" || key === "@LOC_EMPTY") return "";
  const cleanKey = key.startsWith("@") ? key.substring(1).toLowerCase() : key.toLowerCase();
  return locMap.get(cleanKey) || "";
}

function prettifyMissionGiverId(id: string): string {
  return id
    .replace(/^missiongiver_?/i, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

// ─── Main generator ───

export function generateMissionGivers(
  xmlDir: string,
  outputPath: string,
  version: string,
  overridesDir: string
): { content: string; report: GeneratorReport } {
  const report = emptyReport("mission-givers");

  // Load localization
  const extractedPath = path.resolve(xmlDir, "..", "..");
  const localizationMap = loadLocalization(extractedPath);

  // Scan all mission giver XMLs (recursive to catch subdirectories)
  const missionGiverDir = path.join(xmlDir, "libs/foundry/records/missiongiver");
  const files = walkDir(missionGiverDir);
  console.log(`  Found ${files.length} mission giver files`);
  report.found = files.length;

  // Parse entries
  const rawGivers: RawMissionGiver[] = [];
  for (const file of files) {
    const giver = parseMissionGiver(file);
    if (giver) {
      rawGivers.push(giver);
    } else {
      report.skipped++;
    }
  }
  console.log(`  Parsed ${rawGivers.length} mission givers (${report.skipped} skipped)`);

  // Resolve and build output
  const output: any[] = [];
  let resolvedNames = 0;

  for (const giver of rawGivers) {
    const name =
      resolveLocKey(localizationMap, giver.displayNameKey) || prettifyMissionGiverId(giver.id);
    const description = resolveLocKey(localizationMap, giver.descriptionKey);
    const headquarters = resolveLocKey(localizationMap, giver.headquartersKey);

    if (resolveLocKey(localizationMap, giver.displayNameKey)) resolvedNames++;

    output.push({
      id: giver.id,
      name,
      description: description || undefined,
      headquarters: headquarters || undefined,
    });
  }

  // Sort alphabetically by name
  output.sort((a, b) => a.name.localeCompare(b.name));

  report.produced = output.length;

  console.log(`  Resolved ${resolvedNames}/${rawGivers.length} display names from localization`);

  // ─── Build output TypeScript ───
  const lines: string[] = [
    `// Auto-generated from DataForge extraction + localization — ${version}`,
    `// Run: npm run sync:generate`,
    ``,
    `export interface MissionGiver {`,
    `  id: string;`,
    `  name: string;`,
    `  description?: string;`,
    `  headquarters?: string;`,
    `}`,
    ``,
    `export const missionGivers: MissionGiver[] = ${JSON.stringify(output, null, 2)};`,
    ``,
  ];

  return { content: lines.join("\n"), report };
}
