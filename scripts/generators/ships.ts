/**
 * Generator: ships.ts
 * Auto-discovers ships from DataForge XML entities, enriches with override
 * data where available. Writes client/src/data/ships.ts.
 *
 * DataForge provides: entity key, manufacturer (UUID), vehicleRole, crewSize
 * Overrides provide: name, role, size, cargoSCU, prices, speed, description
 *
 * Ships WITH overrides get full curated data.
 * Ships WITHOUT overrides get auto-extracted basics (name from entity key,
 * manufacturer from UUID map, role from vehicleRole, etc.)
 */
import * as fs from "fs";
import * as path from "path";
import { loadNames, GeneratorReport, emptyReport } from "../lib/xml-utils";

interface ShipOverride {
  name: string;
  manufacturer: string;
  role: string;
  size: "small" | "medium" | "large" | "capital";
  crew: { min: number; max: number };
  cargoSCU: number;
  buyPriceAUEC: number | null;
  pledgeUSD: number | null;
  speed: { scm: number; max: number };
  description: string;
}

interface ParsedShip {
  name: string;
  manufacturer: string;
  role: string;
  size: "small" | "medium" | "large" | "capital";
  crew: { min: number; max: number };
  cargoSCU: number;
  buyPriceAUEC: number | null;
  pledgeUSD: number | null;
  speed: { scm: number; max: number };
  description: string;
}

// Patterns to exclude from auto-discovery (AI, templates, derelicts, etc.)
const EXCLUDE_PATTERNS = [
  /_pu_ai/,
  /_ea_ai/,
  /_ai_template/,
  /_ai_override/,
  /_ai_nt_/,
  /_ai_ea/,
  /_ai_dropship/,
  /_unmanned/,
  /_showdown/,
  /_shipshowdown/,
  /_teach/,
  /_exec/,
  /_mission/,
  /_template/,
  /_bis2/,
  /_dunlevy/,
  /_pirate/,
  /_pirates/,
  /_salvage/,
  /_crim/,
  /_bh/,
  /_civ/,
  /_sec_/,
  /_uee/,
  /_advocacy/,
  /^probe_/,
  /_sentry/,
  /_tutorial/,
  /_derelict/,
  /_wreck/,
  /_hijacked/,
  /_swarm/,
  /_indestructible/,
  /_fleetweek/,
  /_gamemaster/,
  /_invictus/,
  /_bombless/,
  /_s3bombs/,
  /_drug_/,
  /_nointerior/,
  /_medicalrescue/,
  /_nodebris/,
  /_halfcargo/,
  /_nocargo/,
  /_piano/,
  /_fw_25/,
  /_fw22/,
  /_tier_/,
  /ea_outlaws/,
  /ea_pir/,
  /^eaobject/,
];

// Paint/skin variants to exclude (keep base models and meaningful sub-variants)
const SKIN_PATTERNS = [
  /_citizencon/,
  /_pink$/,
  /_yellow$/,
  /_emerald$/,
  /_carbon$/,
  /_talus$/,
  /_kue$/,
  /_plat$/,
  /_ox$/,
];

function shouldExclude(entityKey: string): boolean {
  return EXCLUDE_PATTERNS.some((p) => p.test(entityKey)) ||
    SKIN_PATTERNS.some((p) => p.test(entityKey));
}

function extractXmlAttribute(xmlContent: string, attr: string): string | null {
  // Match attribute="value" — handles long single-line XML
  const regex = new RegExp(`${attr}="([^"]*)"`, "g");
  const matches: string[] = [];
  let m;
  while ((m = regex.exec(xmlContent)) !== null) {
    matches.push(m[1]);
  }
  // For manufacturer, skip the zero UUID from insurance display params
  if (attr === "manufacturer") {
    return matches.find((v) => v !== "00000000-0000-0000-0000-000000000000") || null;
  }
  return matches[0] || null;
}

function entityKeyToName(key: string): string {
  // Remove manufacturer prefix (e.g., "aegs_", "drak_")
  const parts = key.split("_");
  const prefixEnd = parts[0].length <= 4 ? 1 : 0;
  const nameParts = parts.slice(prefixEnd);
  // Title-case each part
  return nameParts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

interface DiscoveredShip {
  entityKey: string;
  manufacturerUUID: string | null;
  vehicleRole: string | null;
  crewSize: number;
}

function discoverShips(xmlDir: string, warnings: string[]): DiscoveredShip[] {
  const shipDir = path.join(xmlDir, "libs/foundry/records/entities/spaceships");
  if (!fs.existsSync(shipDir)) {
    const msg = `Ship entity directory not found: ${shipDir}`;
    console.warn(`  WARNING: ${msg}`);
    warnings.push(msg);
    return [];
  }

  const files = fs.readdirSync(shipDir).filter((f) => f.endsWith(".xml"));
  const ships: DiscoveredShip[] = [];

  for (const file of files) {
    const entityKey = file.replace(".xml", "");
    if (shouldExclude(entityKey)) continue;

    const content = fs.readFileSync(path.join(shipDir, file), "utf-8");
    // Must have VehicleComponentParams to be a real ship
    if (!content.includes("VehicleComponentParams")) continue;

    const manufacturerUUID = extractXmlAttribute(content, "manufacturer");
    const vehicleRole = extractXmlAttribute(content, "vehicleRole");
    const crewSizeStr = extractXmlAttribute(content, "crewSize");

    ships.push({
      entityKey,
      manufacturerUUID,
      vehicleRole,
      crewSize: crewSizeStr ? parseInt(crewSizeStr, 10) : 1,
    });
  }

  return ships;
}

function loadOverrides(overridesPath: string): Record<string, ShipOverride> {
  if (!fs.existsSync(overridesPath)) return {};
  const raw = JSON.parse(fs.readFileSync(overridesPath, "utf-8"));
  const result: Record<string, ShipOverride> = {};
  for (const [key, val] of Object.entries(raw)) {
    if (key.startsWith("_")) continue;
    result[key] = val as ShipOverride;
  }
  return result;
}

export function generateShips(
  xmlDir: string,
  outputPath: string,
  version: string,
  overridesDir: string
): { content: string; report: GeneratorReport } {
  const report = emptyReport("ships");

  // Load name maps from names.json (for future auto-discovery use)
  const names = loadNames(overridesDir);
  const MANUFACTURER_MAP: Record<string, string> = names.manufacturers || {};
  const MANUFACTURER_PREFIX_MAP: Record<string, string> = names.manufacturerPrefixes || {};
  const ROLE_MAP: Record<string, { role: string; size: string }> = names.vehicleRoles || {};

  const overrides = loadOverrides(path.join(overridesDir, "ships.json"));
  const discovered = discoverShips(xmlDir, report.warnings);

  report.found = discovered.length;

  console.log(`  Discovered ${discovered.length} ship entities in DataForge`);
  console.log(`  Loaded ${Object.keys(overrides).length} ship overrides`);

  const ships: ParsedShip[] = [];
  let skipped = 0;

  // Process discovered ships, enriching with overrides where available
  for (const disc of discovered) {
    const override = overrides[disc.entityKey];

    if (override) {
      // Full curated data from override
      ships.push({
        name: override.name,
        manufacturer: override.manufacturer,
        role: override.role,
        size: override.size,
        crew: override.crew,
        cargoSCU: override.cargoSCU,
        buyPriceAUEC: override.buyPriceAUEC,
        pledgeUSD: override.pledgeUSD,
        speed: override.speed,
        description: override.description,
      });
    } else {
      // Ships without overrides are skipped — we only output curated ships
      skipped++;
    }
  }

  // Also add override-only ships not in DataForge (e.g., ground vehicles)
  for (const [key, override] of Object.entries(overrides)) {
    if (!discovered.find((d) => d.entityKey === key)) {
      ships.push({
        name: override.name,
        manufacturer: override.manufacturer,
        role: override.role,
        size: override.size,
        crew: override.crew,
        cargoSCU: override.cargoSCU,
        buyPriceAUEC: override.buyPriceAUEC,
        pledgeUSD: override.pledgeUSD,
        speed: override.speed,
        description: override.description,
      });
    }
  }

  report.produced = ships.length;
  report.skipped = skipped;

  // Sort by size order then name
  const sizeOrder: Record<string, number> = { small: 0, medium: 1, large: 2, capital: 3 };
  ships.sort((a, b) => sizeOrder[a.size] - sizeOrder[b.size] || a.name.localeCompare(b.name));

  const overrideCount = Object.keys(overrides).length;
  console.log(`  Generated ${ships.length} ships (${overrideCount} curated)`);

  const lines: string[] = [
    `// Auto-generated from Data.p4k + overrides — ${version}`,
    `// Run: npm run sync:generate`,
    ``,
    `export interface Ship {`,
    `  name: string;`,
    `  manufacturer: string;`,
    `  role: string;`,
    `  size: "small" | "medium" | "large" | "capital";`,
    `  crew: { min: number; max: number };`,
    `  cargoSCU: number;`,
    `  buyPriceAUEC: number | null; // null = not purchasable in-game`,
    `  pledgeUSD: number | null;`,
    `  speed: { scm: number; max: number }; // m/s`,
    `  description: string;`,
    `}`,
    ``,
    `export const ships: Ship[] = [`,
  ];

  for (const ship of ships) {
    lines.push(`  {`);
    lines.push(`    name: ${JSON.stringify(ship.name)},`);
    lines.push(`    manufacturer: ${JSON.stringify(ship.manufacturer)},`);
    lines.push(`    role: ${JSON.stringify(ship.role)},`);
    lines.push(`    size: ${JSON.stringify(ship.size)},`);
    lines.push(`    crew: { min: ${ship.crew.min}, max: ${ship.crew.max} },`);
    lines.push(`    cargoSCU: ${ship.cargoSCU},`);
    lines.push(`    buyPriceAUEC: ${ship.buyPriceAUEC === null ? "null" : ship.buyPriceAUEC},`);
    lines.push(`    pledgeUSD: ${ship.pledgeUSD === null ? "null" : ship.pledgeUSD},`);
    lines.push(`    speed: { scm: ${ship.speed.scm}, max: ${ship.speed.max} },`);
    lines.push(`    description:`);
    lines.push(`      ${JSON.stringify(ship.description)},`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);
  lines.push(`export const manufacturers = [`);
  lines.push(`  ...new Set(ships.map((s) => s.manufacturer)),`);
  lines.push(`].sort();`);
  lines.push(`export const roles = [...new Set(ships.map((s) => s.role))].sort();`);
  lines.push(`export const sizes: Ship["size"][] = ["small", "medium", "large", "capital"];`);
  lines.push(``);

  return { content: lines.join("\n"), report };
}
