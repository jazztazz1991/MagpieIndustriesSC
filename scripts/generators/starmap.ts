/**
 * Generator: starmap.ts
 * Produces client/src/data/starmap.ts by extracting location data from DataForge XML
 * starmap records and resolving names from the localization file.
 *
 * Data flow:
 * 1. Walk all XML files in libs/foundry/records/starmap/ (skip demo/)
 * 2. Extract location data: name key, ref UUID, parent UUID, size, navIcon, etc.
 * 3. Resolve @-prefixed name keys from global.ini localization
 * 4. Build parent-child hierarchy using UUID references
 * 5. Classify by navIcon into location types
 * 6. Skip entries with hideInStarmap="1"
 * 7. Output TypeScript
 */
import * as fs from "fs";
import * as path from "path";
import { GeneratorReport, emptyReport } from "../lib/xml-utils";
import { loadLocalization } from "../lib/localization";

// ─── Interfaces ───

interface RawStarmapEntry {
  id: string;
  nameKey: string;
  refUUID: string;
  parentUUID: string;
  size: number;
  navIcon: string;
  type: string;
  hideInStarmap: boolean;
  scannable: boolean;
  amenityCount: number;
  qtArrivalRadius: number | undefined;
  qtObstructionRadius: number | undefined;
}

// ─── NavIcon → LocationType mapping ───

const NAV_ICON_TYPE_MAP: Record<string, string> = {
  Star: "star",
  Planet: "planet",
  Moon: "moon",
  Station: "station",
  LandingZone: "landing_zone",
  RestStop: "station",
  Outpost: "outpost",
  Default: "poi",
};

function classifyNavIcon(navIcon: string): string {
  return NAV_ICON_TYPE_MAP[navIcon] || "poi";
}

// ─── Parsing ───

function walkDir(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip demo directory
      if (entry.name.toLowerCase() === "demo") continue;
      results.push(...walkDir(full));
    } else if (entry.name.endsWith(".xml")) {
      results.push(full);
    }
  }
  return results;
}

function parseStarmapEntry(filePath: string): RawStarmapEntry | null {
  const content = fs.readFileSync(filePath, "utf-8");

  // Extract root element tag name (e.g., StarMapObject.StantonStar)
  const rootTagMatch = content.match(/<(StarMapObject\.\w+)/);
  if (!rootTagMatch) return null;

  const type = rootTagMatch[1];

  // Extract __ref UUID
  const refMatch = content.match(/__ref="([0-9a-f-]{36})"/);
  if (!refMatch) return null;

  // Extract name (localization key)
  const nameMatch = content.match(/\bname="([^"]*)"/);
  const nameKey = nameMatch?.[1] || "";

  // Extract parent UUID
  const parentMatch = content.match(/\bparent="([0-9a-f-]{36})"/);
  const parentUUID = parentMatch?.[1] || "";

  // Extract size
  const sizeMatch = content.match(/\bsize="([^"]*)"/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) : 0;

  // Extract navIcon
  const navIconMatch = content.match(/\bnavIcon="([^"]*)"/);
  const navIcon = navIconMatch?.[1] || "Default";

  // Extract hideInStarmap
  const hideMatch = content.match(/\bhideInStarmap="([^"]*)"/);
  const hideInStarmap = hideMatch?.[1] === "1";

  // Extract isScannable
  const scannableMatch = content.match(/\bisScannable="([^"]*)"/);
  const scannable = scannableMatch?.[1] === "1";

  // Count amenities (Reference elements inside amenities block)
  const amenitiesBlock = content.match(/<amenities>([\s\S]*?)<\/amenities>/);
  let amenityCount = 0;
  if (amenitiesBlock) {
    const refRegex = /<Reference\s+value="[0-9a-f-]{36}"\s*\/>/g;
    const matches = amenitiesBlock[1].match(refRegex);
    amenityCount = matches ? matches.length : 0;
  }

  // Extract quantum travel data
  let qtArrivalRadius: number | undefined;
  let qtObstructionRadius: number | undefined;
  const qtMatch = content.match(/StarMapQuantumTravelDataParams[^>]*arrivalRadius="([^"]*)"/)
    || content.match(/arrivalRadius="([^"]*)"/);
  if (qtMatch) {
    qtArrivalRadius = parseFloat(qtMatch[1]);
  }
  const qtObsMatch = content.match(/StarMapQuantumTravelDataParams[^>]*obstructionRadius="([^"]*)"/)
    || content.match(/obstructionRadius="([^"]*)"/);
  if (qtObsMatch) {
    qtObstructionRadius = parseFloat(qtObsMatch[1]);
  }

  return {
    id: path.basename(filePath, ".xml"),
    nameKey,
    refUUID: refMatch[1],
    parentUUID,
    size,
    navIcon,
    type,
    hideInStarmap,
    scannable,
    amenityCount,
    qtArrivalRadius: qtArrivalRadius || undefined,
    qtObstructionRadius: qtObstructionRadius || undefined,
  };
}

function resolveLocKey(locMap: Map<string, string>, key: string): string {
  if (!key) return "";
  // Strip leading @
  const cleanKey = key.replace(/^@/, "").toLowerCase();
  return locMap.get(cleanKey) || "";
}

// ─── Main generator ───

export function generateStarmap(
  xmlDir: string,
  outputPath: string,
  version: string,
  overridesDir: string
): { content: string; report: GeneratorReport } {
  const report = emptyReport("starmap");

  // Load localization
  const extractedPath = path.resolve(xmlDir, "..", "..");
  const localizationMap = loadLocalization(extractedPath);

  // Scan all starmap XMLs
  const starmapDir = path.join(xmlDir, "libs/foundry/records/starmap");
  const files = walkDir(starmapDir);
  console.log(`  Found ${files.length} starmap files`);
  report.found = files.length;

  // Parse entries
  const rawEntries: RawStarmapEntry[] = [];
  for (const file of files) {
    const entry = parseStarmapEntry(file);
    if (!entry) {
      report.skipped++;
      continue;
    }
    if (entry.hideInStarmap) {
      report.skipped++;
      continue;
    }
    rawEntries.push(entry);
  }
  console.log(`  Parsed ${rawEntries.length} entries (${report.skipped} skipped)`);

  // Build UUID → name map for parent resolution
  const uuidToName = new Map<string, string>();
  for (const entry of rawEntries) {
    const resolvedName = resolveLocKey(localizationMap, entry.nameKey) || entry.id;
    uuidToName.set(entry.refUUID, resolvedName);
  }

  // Build output
  const output: any[] = [];
  for (const entry of rawEntries) {
    const name = resolveLocKey(localizationMap, entry.nameKey) || entry.id;
    const parentName = uuidToName.get(entry.parentUUID) || "";
    const locationType = classifyNavIcon(entry.navIcon);

    const loc: any = {
      id: entry.id,
      name,
      type: locationType,
      parentId: entry.parentUUID,
      parentName,
      size: entry.size,
      navIcon: entry.navIcon,
      scannable: entry.scannable,
      amenityCount: entry.amenityCount,
    };

    if (entry.qtArrivalRadius !== undefined) {
      loc.qtArrivalRadius = entry.qtArrivalRadius;
    }

    output.push(loc);
  }

  // Sort by type order (stars first, then planets, moons, stations, etc.), then alphabetically
  const typeOrder: Record<string, number> = {
    star: 0,
    planet: 1,
    moon: 2,
    station: 3,
    landing_zone: 4,
    outpost: 5,
    poi: 6,
  };

  output.sort((a, b) => {
    const ta = typeOrder[a.type] ?? 99;
    const tb = typeOrder[b.type] ?? 99;
    if (ta !== tb) return ta - tb;
    return a.name.localeCompare(b.name);
  });

  report.produced = output.length;

  // Count by type for logging
  const typeCounts = new Map<string, number>();
  for (const loc of output) {
    typeCounts.set(loc.type, (typeCounts.get(loc.type) || 0) + 1);
  }
  for (const [type, count] of [...typeCounts.entries()].sort((a, b) => {
    return (typeOrder[a[0]] ?? 99) - (typeOrder[b[0]] ?? 99);
  })) {
    console.log(`    ${type}: ${count}`);
  }

  // ─── Build output TypeScript ───
  const lines: string[] = [
    `// Auto-generated from DataForge extraction + localization — ${version}`,
    `// Run: npm run sync:generate`,
    ``,
    `export type LocationType = "star" | "planet" | "moon" | "station" | "landing_zone" | "outpost" | "poi";`,
    ``,
    `export interface StarmapLocation {`,
    `  id: string;`,
    `  name: string;`,
    `  type: LocationType;`,
    `  parentId: string;`,
    `  parentName: string;`,
    `  size: number;`,
    `  navIcon: string;`,
    `  scannable: boolean;`,
    `  amenityCount: number;`,
    `  qtArrivalRadius?: number;`,
    `}`,
    ``,
    `export const locations: StarmapLocation[] = ${JSON.stringify(output, null, 2)};`,
    ``,
  ];

  return { content: lines.join("\n"), report };
}
