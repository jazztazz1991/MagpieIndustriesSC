/**
 * Generator: mining-locations.ts
 * Extracts mining location data from DataForge HPP (HarvestableProviderPreset) files.
 * Traces the chain: HPP → harvestable preset UUID → ore name (from filename).
 *
 * HPP files live at: libs/foundry/records/harvestable/providerpresets/system/{system}/
 * Harvestable presets: libs/foundry/records/harvestable/harvestablepresets/mining_*.xml
 */
import * as fs from "fs";
import * as path from "path";
import { loadNames, GeneratorReport, emptyReport } from "../lib/xml-utils";

// --- HPP filename → location info mapping ---
interface LocationMeta {
  name: string;
  type: "moon" | "planet" | "asteroid_belt" | "asteroid_field" | "lagrange";
  parentBody: string;
  gravity: "none" | "low" | "medium" | "high";
  atmosphere: boolean;
  danger: "low" | "medium" | "high";
}

/**
 * Step 1: Build UUID → ore name map from harvestable preset filenames.
 * Each mining_*.xml file has a __ref UUID and an ore in its filename.
 */
function buildPresetUuidMap(xmlDir: string, ORE_NAME_MAP: Record<string, string>): Map<string, string> {
  const presetsDir = path.join(xmlDir, "libs/foundry/records/harvestable/harvestablepresets");
  const map = new Map<string, string>();

  if (!fs.existsSync(presetsDir)) {
    console.warn("  WARNING: harvestablepresets directory not found");
    return map;
  }

  const files = fs.readdirSync(presetsDir).filter(
    (f) => f.startsWith("mining_") && f.endsWith(".xml") && !f.includes("template")
  );

  for (const file of files) {
    const fullPath = path.join(presetsDir, file);
    // Read first 500 bytes for __ref
    const fd = fs.openSync(fullPath, "r");
    const buf = Buffer.alloc(500);
    const bytesRead = fs.readSync(fd, buf, 0, 500, 0);
    fs.closeSync(fd);
    const header = buf.toString("utf-8", 0, bytesRead);

    const refMatch = header.match(/__ref="([0-9a-f-]{36})"/);
    if (!refMatch) continue;
    const uuid = refMatch[1];

    // Extract ore name from filename
    const oreName = extractOreFromFilename(file, ORE_NAME_MAP);
    if (oreName) {
      map.set(uuid, oreName);
    }
  }

  return map;
}

/**
 * Extract the ore name from a harvestable preset filename.
 * Examples:
 *   mining_asteroidcommon_aluminum.xml → "Aluminium"
 *   mining_shale_copper.xml → "Copper"
 *   mining_rare_bexalite.xml → "Bexalite"
 *   mining_asteroidlegendary_quantainium.xml → "Quantanium"
 *   mining_shale.xml → null (no ore suffix, generic rock type)
 */
function extractOreFromFilename(filename: string, ORE_NAME_MAP: Record<string, string>): string | null {
  const base = filename.replace(".xml", "").replace("mining_", "");

  // Known patterns with ore as last segment
  const patterns = [
    // Rarity-based: asteroidcommon_X, asteroidrare_X, asteroidepic_X, etc.
    /^asteroid(?:common|uncommon|rare|epic|legendary)_(\w+)$/,
    // Surface deposit types with element: shale_X, felsic_X, granite_X, etc.
    /^(?:shale|felsic|obsidian|atacamite|quartzite|gneiss|granite|igneous)_(\w+)$/,
    // Asteroid sub-types with element: asteroidctype_X, asteroidstype_X, etc.
    /^asteroid[cseimpq]type_(\w+)$/,
    // Simple rarity: common_X, uncommon_X, rare_X, epic_X, legendary_X
    /^(?:common|uncommon|rare|epic|legendary)_(\w+)$/,
    // Standalone: quantanium (special case)
    /^(quantanium)$/,
    // Gold only
    /^asteroid(gold)only$/,
  ];

  for (const pat of patterns) {
    const m = base.match(pat);
    if (m) {
      const raw = m[1].toLowerCase();
      return ORE_NAME_MAP[raw] || null;
    }
  }

  return null;
}

/**
 * Build UUID → ore name map for FPS and ground vehicle mining presets.
 * Filenames: fpsmining_hadanite.xml, groundvehiclemining_carinite.xml, etc.
 */
function buildFpsPresetUuidMap(xmlDir: string): Map<string, string> {
  const presetsDir = path.join(xmlDir, "libs/foundry/records/harvestable/harvestablepresets");
  const map = new Map<string, string>();
  if (!fs.existsSync(presetsDir)) return map;

  const FPS_ORE_MAP: Record<string, string> = {
    hadanite: "Hadanite",
    aphorite: "Aphorite",
    dolivine: "Dolivine",
    carinite: "Carinite",
    janalite: "Janalite",
    jaclium: "Jaclium",
    saldynium: "Saldynium",
    beradom: "Beradon",
    feynmaline: "Feynmaline",
    glacosite: "Glacosite",
  };

  const files = fs.readdirSync(presetsDir).filter(
    (f) => (f.startsWith("fpsmining_") || f.startsWith("groundvehiclemining_")) && f.endsWith(".xml")
  );

  for (const file of files) {
    const fullPath = path.join(presetsDir, file);
    const fd = fs.openSync(fullPath, "r");
    const buf = Buffer.alloc(500);
    const bytesRead = fs.readSync(fd, buf, 0, 500, 0);
    fs.closeSync(fd);
    const header = buf.toString("utf-8", 0, bytesRead);

    const refMatch = header.match(/__ref="([0-9a-f-]{36})"/);
    if (!refMatch) continue;

    // Extract ore from filename: fpsmining_hadanite.xml, fpsmining_carinite_large.xml
    const base = file.replace(".xml", "").replace(/^(fpsmining|groundvehiclemining)_/, "");
    // Remove size suffixes and other qualifiers
    const oreKey = base.replace(/_(small|large|pure_small|template|common|low|medium|high|super)$/, "")
      .replace(/^asteroid_base_/, "");

    const oreName = FPS_ORE_MAP[oreKey];
    if (oreName) {
      map.set(refMatch[1], oreName);
    }
  }

  return map;
}

interface HppOreEntry {
  oreName: string;
  relativeProbability: number;
}

/**
 * Step 2: Parse an HPP file and extract ore entries from SpaceShip_Mineables group.
 */
function parseHpp(filePath: string, presetMap: Map<string, string>): HppOreEntry[] {
  const content = fs.readFileSync(filePath, "utf-8");

  // Find the SpaceShip_Mineables group
  const shipGroup = content.match(
    /groupName="SpaceShip_Mineables"[\s\S]*?<\/HarvestableElementGroup>/
  );
  if (!shipGroup) return [];

  const entries: HppOreEntry[] = [];
  const elementRegex = /harvestable="([0-9a-f-]{36})"[^>]*relativeProbability="([^"]+)"/g;
  let match;
  while ((match = elementRegex.exec(shipGroup[0])) !== null) {
    const uuid = match[1];
    const prob = parseFloat(match[2]);
    const oreName = presetMap.get(uuid);
    if (oreName && prob > 0) {
      entries.push({ oreName, relativeProbability: prob });
    }
  }

  return entries;
}

/**
 * Aggregate ore entries: combine probabilities for the same ore, deduplicate.
 */
function aggregateOres(entries: HppOreEntry[]): { name: string; weight: number }[] {
  const byOre = new Map<string, number>();
  for (const e of entries) {
    byOre.set(e.oreName, (byOre.get(e.oreName) || 0) + e.relativeProbability);
  }
  return Array.from(byOre.entries())
    .map(([name, weight]) => ({ name, weight }))
    .sort((a, b) => b.weight - a.weight);
}

export function generateMiningLocations(
  xmlDir: string,
  outputPath: string,
  version: string,
  overridesDir: string,
): { content: string; report: GeneratorReport } {
  const report = emptyReport("mining-locations");
  const names = loadNames(overridesDir);
  const ORE_NAME_MAP: Record<string, string> = names.oreNames || {};
  const HPP_LOCATION_MAP: Record<string, LocationMeta> = names.miningLocations || {};

  console.log("  Building harvestable preset UUID → ore map...");
  const presetMap = buildPresetUuidMap(xmlDir, ORE_NAME_MAP);
  console.log(`  Mapped ${presetMap.size} harvestable presets to ore names`);

  // Find all HPP files across systems
  const systems = ["stanton", "pyro", "nyx"];
  const locations: {
    meta: LocationMeta;
    ores: string[];
    fpsOres: string[];
    notes: string;
  }[] = [];

  for (const system of systems) {
    const baseDir = path.join(xmlDir, `libs/foundry/records/harvestable/providerpresets/system/${system}`);
    if (!fs.existsSync(baseDir)) continue;

    // Scan both base dir and subdirectories
    const hppFiles: string[] = [];
    const scanDir = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          scanDir(path.join(dir, entry.name));
        } else if (entry.name.startsWith("hpp_") && entry.name.endsWith(".xml")) {
          hppFiles.push(path.join(dir, entry.name));
        }
      }
    };
    scanDir(baseDir);

    report.found += hppFiles.length;

    for (const hppFile of hppFiles) {
      const hppName = path.basename(hppFile, ".xml");
      const meta = HPP_LOCATION_MAP[hppName];
      if (!meta) {
        report.skipped++;
        continue; // Skip unmapped HPPs (ship graveyard, derelicts, etc.)
      }

      const entries = parseHpp(hppFile, presetMap);
      if (entries.length === 0) {
        report.skipped++;
        report.warnings.push(`No SpaceShip_Mineables entries in ${hppName}`);
        continue;
      }

      const aggregated = aggregateOres(entries);
      const oreNames = aggregated.map((o) => o.name);

      // Auto-generate notes from the data
      const topOres = aggregated.slice(0, 3).map((o) => o.name);
      const totalWeight = aggregated.reduce((sum, o) => sum + o.weight, 0);
      const topPct = aggregated.slice(0, 3).map((o) => Math.round((o.weight / totalWeight) * 100));
      const notesParts: string[] = [];
      if (topOres.length > 0) {
        const topStr = topOres.map((n, i) => `${n} (${topPct[i]}%)`).join(", ");
        notesParts.push(`Highest spawn rates: ${topStr}.`);
      }
      notesParts.push(`${oreNames.length} ore types found.`);

      locations.push({
        meta,
        ores: oreNames,
        fpsOres: [],
        notes: notesParts.join(" "),
      });
    }
  }

  // --- FPS / Ground Vehicle Mining ---
  // Parse cave_*.xml slot presets to find which FPS ores spawn on each moon
  const fpsPresetMap = buildFpsPresetUuidMap(xmlDir);
  console.log(`  Mapped ${fpsPresetMap.size} FPS/ground mining presets to ore names`);

  const slotPresetsDir = path.join(xmlDir, "libs/foundry/records/harvestable/slotpresets");
  if (fs.existsSync(slotPresetsDir)) {
    // cave_aberdeen_rich.xml, cave_daymar_medium.xml, etc.
    const caveFiles = fs.readdirSync(slotPresetsDir).filter(
      (f) => f.startsWith("cave_") && f.endsWith(".xml") && !f.includes("test") && !f.includes("prison")
    );

    for (const file of caveFiles) {
      // Parse moon name and richness from filename: cave_aberdeen_rich.xml
      const nameMatch = file.replace(".xml", "").match(/^cave_(\w+?)_(poor|medium|rich)$/);
      if (!nameMatch) continue;

      const moonKey = nameMatch[1].toLowerCase();
      const richness = nameMatch[2];

      // Find the matching location in our existing list
      const location = locations.find((loc) =>
        loc.meta.name.toLowerCase() === moonKey ||
        loc.meta.name.toLowerCase().startsWith(moonKey)
      );
      if (!location) continue;

      // Parse harvestable UUIDs from the cave file
      const content = fs.readFileSync(path.join(slotPresetsDir, file), "utf-8");
      const entryRegex = /harvestable="([0-9a-f-]{36})"[^>]*relativeProbability="([^"]+)"/g;
      let match;
      while ((match = entryRegex.exec(content)) !== null) {
        const uuid = match[1];
        const oreName = fpsPresetMap.get(uuid);
        if (oreName && !location.fpsOres.includes(oreName)) {
          location.fpsOres.push(oreName);
        }
      }
    }
  }

  // Also parse caves/ subdirectory for system-wide cave biome ores
  // Files like: loot_caves_unoccupied_sand_stanton.xml, loot_caves_unoccupied_rock_pyro.xml
  const cavesDir = path.join(slotPresetsDir, "caves");
  if (fs.existsSync(cavesDir)) {
    const caveSystemFiles = fs.readdirSync(cavesDir).filter(
      (f) => f.startsWith("loot_caves_") && f.endsWith(".xml")
    );

    // Map system names to location matches
    const systemToMoons: Record<string, string[]> = {
      stanton: ["Hurston", "Aberdeen", "Arial", "Ita", "Magda", "Cellin", "Daymar", "Yela", "Lyria", "Wala", "Calliope", "Clio", "Euterpe", "microTech"],
      pyro: ["Pyro I", "Monox", "Bloom", "Pyro IV", "Pyro VI", "Adir", "Fairo", "Fuego", "Ignis", "Vatra", "Vuur"],
    };

    for (const file of caveSystemFiles) {
      // Extract system from filename: loot_caves_unoccupied_sand_stanton.xml → stanton
      // Biome is one of: sand, rock, acidic
      const nameMatch = file.replace(".xml", "").match(/loot_caves_(?:un)?occupied_(?:sand|rock|acidic)_(\w+?)(?:_orbageddon)?$/);
      if (!nameMatch) continue;
      const system = nameMatch[1].toLowerCase();

      const moonNames = systemToMoons[system];
      if (!moonNames) continue;

      const content = fs.readFileSync(path.join(cavesDir, file), "utf-8");
      const entryRegex = /harvestable="([0-9a-f-]{36})"/g;
      let m;
      const caveFpsOres: string[] = [];
      while ((m = entryRegex.exec(content)) !== null) {
        const oreName = fpsPresetMap.get(m[1]);
        if (oreName && !caveFpsOres.includes(oreName)) {
          caveFpsOres.push(oreName);
        }
      }

      if (caveFpsOres.length > 0) {
        // Add these ores to all moons/planets in this system that have surfaces
        for (const location of locations) {
          if (moonNames.some((mn) => location.meta.name.startsWith(mn)) && location.meta.type !== "asteroid_belt" && location.meta.type !== "asteroid_field" && location.meta.type !== "lagrange") {
            for (const ore of caveFpsOres) {
              if (!location.fpsOres.includes(ore)) {
                location.fpsOres.push(ore);
              }
            }
          }
        }
      }
    }
  }

  const fpsLocCount = locations.filter((l) => l.fpsOres.length > 0).length;
  console.log(`  Found FPS mining data for ${fpsLocCount} locations`);

  // Sort: asteroid belts first, then planets, then moons by parent body
  const typeOrder: Record<string, number> = {
    asteroid_belt: 0, asteroid_field: 1, lagrange: 2, planet: 3, moon: 4,
  };
  locations.sort((a, b) => {
    const ta = typeOrder[a.meta.type] ?? 5;
    const tb = typeOrder[b.meta.type] ?? 5;
    if (ta !== tb) return ta - tb;
    return a.meta.name.localeCompare(b.meta.name);
  });

  report.produced = locations.length;
  console.log(`  Generated ${locations.length} mining locations`);

  // Build output
  const lines: string[] = [
    `// Auto-generated from Data.p4k HPP files — ${version}`,
    `// Run: npm run sync:generate`,
    ``,
    `export interface MiningLocation {`,
    `  name: string;`,
    `  type: "moon" | "planet" | "asteroid_belt" | "asteroid_field" | "lagrange";`,
    `  parentBody: string;`,
    `  gravity: "none" | "low" | "medium" | "high";`,
    `  atmosphere: boolean;`,
    `  danger: "low" | "medium" | "high";`,
    `  ores: string[];`,
    `  fpsOres: string[];`,
    `  notes: string;`,
    `}`,
    ``,
    `export const miningLocations: MiningLocation[] = [`,
  ];

  for (const loc of locations) {
    lines.push(`  {`);
    lines.push(`    name: ${JSON.stringify(loc.meta.name)},`);
    lines.push(`    type: ${JSON.stringify(loc.meta.type)},`);
    lines.push(`    parentBody: ${JSON.stringify(loc.meta.parentBody)},`);
    lines.push(`    gravity: ${JSON.stringify(loc.meta.gravity)},`);
    lines.push(`    atmosphere: ${loc.meta.atmosphere},`);
    lines.push(`    danger: ${JSON.stringify(loc.meta.danger)},`);
    lines.push(`    ores: ${JSON.stringify(loc.ores)},`);
    lines.push(`    fpsOres: ${JSON.stringify(loc.fpsOres)},`);
    lines.push(`    notes: ${JSON.stringify(loc.notes)},`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);
  lines.push(`// Quick lookup: which locations have a given ore`);
  lines.push(`export function locationsForOre(oreName: string): MiningLocation[] {`);
  lines.push(`  return miningLocations.filter((loc) => loc.ores.includes(oreName));`);
  lines.push(`}`);
  lines.push(``);

  return { content: lines.join("\n"), report };
}
