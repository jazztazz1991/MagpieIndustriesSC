/**
 * Generator: ores.ts
 * Reads DataForge XML for mineable elements, merges with overrides,
 * writes client/src/data/mining.ts (ores section).
 *
 * DataForge provides: instability, resistance, clusterFactor, explosionMultiplier
 * Overrides provide: name, abbrev, type, valuePerSCU, description
 *
 * scannerOreOrder and rockSignatures stay manual (not in DataForge).
 */
import * as fs from "fs";
import * as path from "path";
import { parseXmlFile, findXmlFiles, getRootEntity, loadNames, GeneratorReport, emptyReport } from "../lib/xml-utils";

type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

interface OreOverride {
  name: string;
  abbrev: string;
  type: "rock" | "gem" | "metal";
  rarity?: Rarity;
  valuePerSCU: number;
  description: string;
  miningType?: "ship" | "fps" | "ground";
}

interface ParsedOre {
  name: string;
  abbrev: string;
  type: "rock" | "gem" | "metal";
  rarity: Rarity;
  valuePerSCU: number;
  instability: number;
  resistance: number;
  description: string;
}

const SKIP_PATTERNS = [/template/, /test/];

function shouldSkip(filename: string): boolean {
  return SKIP_PATTERNS.some((p) => p.test(filename));
}

function loadOverrides(overridesPath: string): Record<string, OreOverride> {
  if (!fs.existsSync(overridesPath)) return {};
  const raw = JSON.parse(fs.readFileSync(overridesPath, "utf-8"));
  // Strip _comment key
  const result: Record<string, OreOverride> = {};
  for (const [key, val] of Object.entries(raw)) {
    if (key.startsWith("_")) continue;
    result[key] = val as OreOverride;
  }
  return result;
}

/**
 * Convert DataForge resistance float to percentage.
 * DataForge uses -1 to 1 scale; we convert to 0-100 percentage.
 * Negative resistance means easier to mine (mapped to 0 or low values).
 */
function resistanceToPercent(raw: number): number {
  return Math.round(Math.max(0, raw * 100));
}

export function parseOre(
  filePath: string,
  overrides: Record<string, OreOverride>
): ParsedOre | null {
  const baseName = path.basename(filePath, ".xml");
  if (shouldSkip(baseName)) return null;

  const override = overrides[baseName];
  if (!override) return null; // Skip ores without override data (unknown ores)

  const parsed = parseXmlFile(filePath);
  const root = getRootEntity(parsed);
  if (!root) return null;

  // MineableElement files are self-closing with all data in attributes
  const instability = Number(root["@_elementInstability"]) || 0;
  const resistance = Number(root["@_elementResistance"]) || 0;

  return {
    name: override.name,
    abbrev: override.abbrev,
    type: override.type,
    rarity: override.rarity || "common",
    valuePerSCU: override.valuePerSCU,
    instability: Math.round(instability),
    resistance: resistanceToPercent(resistance),
    description: override.description,
  };
}

export function generateOres(
  xmlDir: string,
  outputPath: string,
  version: string,
  overridesDir: string
): { content: string; report: GeneratorReport } {
  const report = emptyReport("ores");

  // Load manual constants from names.json instead of hardcoding
  const names = loadNames(overridesDir);
  const SCANNER_ORE_ORDER: string[] = names.scannerOreOrder || [];
  const ROCK_SIGNATURES: { name: string; rarity: string }[] = names.rockSignatures || [];

  const elementDir = path.join(xmlDir, "libs/foundry/records/mining/mineableelements");
  const files = findXmlFiles(elementDir, /\.xml$/);
  const overrides = loadOverrides(path.join(overridesDir, "ores.json"));

  report.found = files.length;
  console.log(`  Found ${files.length} mineable element XML files`);
  console.log(`  Loaded ${Object.keys(overrides).length} ore overrides`);

  const ores: ParsedOre[] = [];
  // Add "Inert Material" manually — it's not in DataForge
  ores.push({
    name: "Inert Material",
    abbrev: "INER",
    type: "rock",
    rarity: "common" as Rarity,
    valuePerSCU: 0,
    instability: 0,
    resistance: 0,
    description: "Worthless filler found in all rock deposits.",
  });

  for (const file of files) {
    try {
      const ore = parseOre(file, overrides);
      if (ore) {
        ores.push(ore);
      } else {
        report.skipped++;
      }
    } catch (err) {
      report.warnings.push(`Failed to parse ${path.basename(file)}: ${err}`);
    }
  }

  // Sort by value descending (high-value first), matching existing file order
  ores.sort((a, b) => b.valuePerSCU - a.valuePerSCU);

  // Separate ship ores from fps/ground ores
  const shipOres = ores.filter((o) => {
    const override = Object.values(overrides).find((ov) => ov.name === o.name);
    return !override?.miningType || override.miningType === "ship";
  });

  report.produced = shipOres.length;
  console.log(`  Parsed ${shipOres.length} ship-mineable ores (${ores.length} total)`);

  const lines: string[] = [
    `// Auto-generated from Data.p4k — ${version}`,
    `// Run: npm run sync:generate`,
    ``,
    `export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";`,
    ``,
    `export interface Ore {`,
    `  name: string;`,
    `  abbrev: string; // 4-letter scanner abbreviation`,
    `  type: "rock" | "gem" | "metal";`,
    `  rarity: Rarity; // 4.7.0 rarity tier — rocks named by primary element`,
    `  valuePerSCU: number; // aUEC per SCU`,
    `  instability: number; // raw DataForge value (0-1000+)`,
    `  resistance: number; // percentage (0-100)`,
    `  description: string;`,
    `}`,
    ``,
    `export const ores: Ore[] = [`,
  ];

  for (const ore of shipOres) {
    lines.push(`  {`);
    lines.push(`    name: ${JSON.stringify(ore.name)},`);
    lines.push(`    abbrev: ${JSON.stringify(ore.abbrev)},`);
    lines.push(`    type: ${JSON.stringify(ore.type)},`);
    lines.push(`    rarity: ${JSON.stringify(ore.rarity)},`);
    lines.push(`    valuePerSCU: ${ore.valuePerSCU},`);
    lines.push(`    instability: ${ore.instability},`);
    lines.push(`    resistance: ${ore.resistance},`);
    lines.push(`    description: ${JSON.stringify(ore.description)},`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);

  // Scanner ore order (manual)
  lines.push(`// Scanner ore grid order (matches in-game layout)`);
  lines.push(`export const scannerOreOrder: string[] = [`);
  for (let i = 0; i < SCANNER_ORE_ORDER.length; i += 6) {
    const chunk = SCANNER_ORE_ORDER.slice(i, i + 6)
      .map((s) => JSON.stringify(s))
      .join(", ");
    lines.push(`  ${chunk},`);
  }
  lines.push(`];`);
  lines.push(``);

  // Rock classes — 4.7.0 rocks are named by primary element
  lines.push(`export interface RockClass {`);
  lines.push(`  name: string;`);
  lines.push(`  rarity: Rarity;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export const rockSignatures: RockClass[] = [`);
  for (const sig of ROCK_SIGNATURES) {
    lines.push(`  { name: ${JSON.stringify(sig.name)}, rarity: ${JSON.stringify(sig.rarity)} },`);
  }
  lines.push(`];`);
  lines.push(``);
  lines.push(`export const rockClasses = rockSignatures.map((r) => r.name);`);
  lines.push(``);

  return { content: lines.join("\n"), report };
}
