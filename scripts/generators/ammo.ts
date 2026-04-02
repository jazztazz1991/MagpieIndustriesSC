/**
 * Generator: ammo.ts
 * Produces client/src/data/ammo.ts by extracting ammo parameters from DataForge XML.
 *
 * Data flow:
 * 1. Scan all ammo XMLs in ammoparams/fps/ and ammoparams/vehicle/
 * 2. Classify each as "fps" or "vehicle" based on subdirectory
 * 3. Extract speed, lifetime, damage types, damage drop values
 * 4. Output TypeScript
 */
import * as fs from "fs";
import * as path from "path";
import { GeneratorReport, emptyReport } from "../lib/xml-utils";
import { loadLocalization } from "../lib/localization";

// ─── Interfaces ───

interface DamageValues {
  physical: number;
  energy: number;
  distortion: number;
  thermal: number;
  biochemical: number;
  stun: number;
}

interface RawAmmo {
  id: string;
  name: string;
  category: "fps" | "vehicle";
  speed: number;
  lifetime: number;
  damage: DamageValues;
  damageDropMinDistance?: { physical: number; energy: number };
  damageDropPerMeter?: { physical: number; energy: number };
}

// ─── Parsing ───

function listXmlFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => !e.isDirectory() && e.name.endsWith(".xml"))
    .map((e) => path.join(dir, e.name));
}

function parseDamageInfo(content: string, blockName: string): DamageValues | null {
  // Find the DamageInfo within the specific block
  const blockRegex = new RegExp(
    `<${blockName}>[\\s\\S]*?<DamageInfo([^/>]*)/>[\\s\\S]*?</${blockName}>`
  );
  const blockMatch = content.match(blockRegex);
  if (!blockMatch) return null;

  const attrs = blockMatch[1];
  return {
    physical: parseFloat(attrs.match(/DamagePhysical="([^"]*)"/)![1]) || 0,
    energy: parseFloat(attrs.match(/DamageEnergy="([^"]*)"/)![1]) || 0,
    distortion: parseFloat(attrs.match(/DamageDistortion="([^"]*)"/)![1]) || 0,
    thermal: parseFloat(attrs.match(/DamageThermal="([^"]*)"/)![1]) || 0,
    biochemical: parseFloat(attrs.match(/DamageBiochemical="([^"]*)"/)![1]) || 0,
    stun: parseFloat(attrs.match(/DamageStun="([^"]*)"/)![1]) || 0,
  };
}

function parseDamageDropInfo(
  content: string,
  blockName: string
): { physical: number; energy: number } | null {
  const blockRegex = new RegExp(
    `<${blockName}>[\\s\\S]*?<DamageInfo([^/>]*)/>[\\s\\S]*?</${blockName}>`
  );
  const blockMatch = content.match(blockRegex);
  if (!blockMatch) return null;

  const attrs = blockMatch[1];
  const physical = parseFloat(attrs.match(/DamagePhysical="([^"]*)"/)![1]) || 0;
  const energy = parseFloat(attrs.match(/DamageEnergy="([^"]*)"/)![1]) || 0;

  // Only include if at least one value is non-zero
  if (physical === 0 && energy === 0) return null;
  return { physical, energy };
}

function parseAmmo(filePath: string, category: "fps" | "vehicle"): RawAmmo | null {
  const content = fs.readFileSync(filePath, "utf-8");
  const fileName = path.basename(filePath, ".xml");

  // Extract root element name (e.g., AmmoParams.12g_ballistic_1)
  const rootMatch = content.match(/<AmmoParams\.(\S+)\s/);
  if (!rootMatch) return null;

  const id = rootMatch[1];

  // Extract top-level attributes
  const speedMatch = content.match(/\bspeed="([^"]*)"/);
  const lifetimeMatch = content.match(/\blifetime="([^"]*)"/);

  const speed = speedMatch ? parseFloat(speedMatch[1]) : 0;
  const lifetime = lifetimeMatch ? parseFloat(lifetimeMatch[1]) : 0;

  // Extract base damage from <damage> block
  const damage = parseDamageInfo(content, "damage");
  if (!damage) return null;

  // Extract damage drop values
  const damageDropMinDistance = parseDamageDropInfo(content, "damageDropMinDistance");
  const damageDropPerMeter = parseDamageDropInfo(content, "damageDropPerMeter");

  // Prettify name from ID: remove prefixes, underscores → spaces, title case
  const name = id
    .replace(/^ammoparams\./i, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

  return {
    id,
    name,
    category,
    speed,
    lifetime,
    damage,
    ...(damageDropMinDistance ? { damageDropMinDistance } : {}),
    ...(damageDropPerMeter ? { damageDropPerMeter } : {}),
  };
}

// ─── Main generator ───

export function generateAmmo(
  xmlDir: string,
  outputPath: string,
  version: string,
  overridesDir: string
): { content: string; report: GeneratorReport } {
  const report = emptyReport("ammo");

  const ammoDir = path.join(xmlDir, "libs/foundry/records/ammoparams");
  const fpsDir = path.join(ammoDir, "fps");
  const vehicleDir = path.join(ammoDir, "vehicle");

  const fpsFiles = listXmlFiles(fpsDir);
  const vehicleFiles = listXmlFiles(vehicleDir);
  const totalFiles = fpsFiles.length + vehicleFiles.length;
  console.log(`  Found ${totalFiles} ammo files (${fpsFiles.length} fps, ${vehicleFiles.length} vehicle)`);
  report.found = totalFiles;

  // Parse all ammo
  const ammoList: RawAmmo[] = [];

  for (const file of fpsFiles) {
    const ammo = parseAmmo(file, "fps");
    if (ammo) {
      ammoList.push(ammo);
    } else {
      report.skipped++;
    }
  }

  for (const file of vehicleFiles) {
    const ammo = parseAmmo(file, "vehicle");
    if (ammo) {
      ammoList.push(ammo);
    } else {
      report.skipped++;
    }
  }

  console.log(`  Parsed ${ammoList.length} ammo types (${report.skipped} skipped)`);

  // Build output
  const output: any[] = ammoList.map((a) => ({
    id: a.id,
    name: a.name,
    category: a.category,
    speed: a.speed,
    lifetime: a.lifetime,
    damage: a.damage,
    ...(a.damageDropMinDistance ? { damageDropMinDistance: a.damageDropMinDistance } : {}),
    ...(a.damageDropPerMeter ? { damageDropPerMeter: a.damageDropPerMeter } : {}),
  }));

  // Sort: fps first then vehicle, then alphabetically by name
  output.sort((a, b) => {
    if (a.category !== b.category) return a.category === "fps" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  report.produced = output.length;

  const fpsCount = output.filter((a) => a.category === "fps").length;
  const vehicleCount = output.filter((a) => a.category === "vehicle").length;
  console.log(`  Ammo types: ${fpsCount} fps, ${vehicleCount} vehicle`);

  // ─── Build output TypeScript ───
  const lines: string[] = [
    `// Auto-generated from DataForge extraction — ${version}`,
    `// Run: npm run sync:generate`,
    ``,
    `export interface AmmoDamage {`,
    `  physical: number;`,
    `  energy: number;`,
    `  distortion: number;`,
    `  thermal: number;`,
    `  biochemical: number;`,
    `  stun: number;`,
    `}`,
    ``,
    `export interface AmmoType {`,
    `  id: string;`,
    `  name: string;`,
    `  category: "fps" | "vehicle";`,
    `  speed: number;`,
    `  lifetime: number;`,
    `  damage: AmmoDamage;`,
    `  damageDropMinDistance?: { physical: number; energy: number };`,
    `  damageDropPerMeter?: { physical: number; energy: number };`,
    `}`,
    ``,
    `export const ammoTypes: AmmoType[] = ${JSON.stringify(output, null, 2)};`,
    ``,
  ];

  return { content: lines.join("\n"), report };
}
