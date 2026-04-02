/**
 * Generator: mining-ships.ts
 * Reads DataForge XML for mining-capable ships/vehicles,
 * writes client/src/data/mining-ships.ts
 */
import * as fs from "fs";
import * as path from "path";
import { parseXmlFile, getRootEntity, loadNames, GeneratorReport, emptyReport } from "../lib/xml-utils";

interface ParsedMiningShip {
  name: string;
  manufacturer: string;
  size: "small" | "medium";
  cargoSCU: number;
  miningTurrets: number;
  crewMin: number;
  crewMax: number;
  isVehicle?: boolean;
  description: string;
}

interface MiningShipConfig {
  file: string;
  dir: "spaceships" | "groundvehicles";
  name: string;
  manufacturer: string;
  size: "small" | "medium";
  cargoSCU: number;
  isVehicle?: boolean;
  crewMin: number;
}

/** Walk the parsed XML to find a component by polymorphicType. */
function findComp(components: any, type: string): any {
  if (!components) return undefined;
  for (const key of Object.keys(components)) {
    const val = components[key];
    if (val?.["@___polymorphicType"] === type) return val;
    if (key === type) return val;
  }
  return undefined;
}

/** Count mining turrets by counting hardpoint_weapon_mining or hardpoint_mining_laser entries in loadout. */
function countMiningTurrets(root: any): number {
  const components = root?.Components;
  if (!components) return 0;

  const loadout = findComp(components, "SEntityComponentDefaultLoadoutParams");
  if (!loadout) return 0;

  // Stringify and count occurrences of hardpoint_weapon_mining or hardpoint_mining_laser
  const json = JSON.stringify(loadout);
  const weaponMining = (json.match(/hardpoint_weapon_mining/g) || []).length;
  const miningLaser = (json.match(/hardpoint_mining_laser/g) || []).length;
  return Math.max(weaponMining, miningLaser);
}

function parseMiningShip(
  xmlDir: string,
  config: MiningShipConfig,
  report: GeneratorReport
): ParsedMiningShip | null {
  const filePath = path.join(
    xmlDir,
    "libs/foundry/records/entities",
    config.dir,
    config.file
  );

  if (!fs.existsSync(filePath)) {
    report.warnings.push(`Ship file not found: ${config.file}`);
    return null;
  }

  const parsed = parseXmlFile(filePath);
  const root = getRootEntity(parsed);
  if (!root) return null;

  const components = root.Components;
  const vehicleParams = findComp(components, "VehicleComponentParams");

  const crewMax = Number(vehicleParams?.["@_crewSize"]) || config.crewMin;
  const miningTurrets = countMiningTurrets(root);

  return {
    name: config.name,
    manufacturer: config.manufacturer,
    size: config.size,
    cargoSCU: config.cargoSCU,
    miningTurrets: miningTurrets || 1,
    crewMin: config.crewMin,
    crewMax,
    isVehicle: config.isVehicle,
    description: "",
  };
}

export function generateMiningShips(
  xmlDir: string,
  outputPath: string,
  version: string,
  overridesDir: string
): { content: string; report: GeneratorReport } {
  const report = emptyReport("mining-ships");

  const names = loadNames(overridesDir);
  const miningShipConfigs: Record<string, any> = names.miningShips || {};

  const MINING_SHIPS: MiningShipConfig[] = Object.entries(miningShipConfigs).map(([key, cfg]: [string, any]) => ({
    file: key + ".xml",
    dir: cfg.isVehicle ? "groundvehicles" as const : "spaceships" as const,
    name: cfg.name,
    manufacturer: cfg.manufacturer,
    size: cfg.size as "small" | "medium",
    cargoSCU: cfg.cargoSCU,
    isVehicle: cfg.isVehicle,
    crewMin: cfg.crewMin,
  }));

  report.found = MINING_SHIPS.length;
  console.log(`  Processing ${MINING_SHIPS.length} mining ships`);

  const ships: ParsedMiningShip[] = [];
  for (const config of MINING_SHIPS) {
    try {
      const ship = parseMiningShip(xmlDir, config, report);
      if (ship) {
        ships.push(ship);
      } else {
        report.skipped++;
      }
    } catch (err) {
      report.warnings.push(`Failed to parse ${config.file}: ${err}`);
      report.skipped++;
    }
  }

  ships.sort((a, b) => a.name.localeCompare(b.name));
  report.produced = ships.length;

  console.log(`  Parsed ${ships.length} mining ships`);

  const lines: string[] = [
    `// Auto-generated from Data.p4k — ${version}`,
    `// Run: npm run sync:generate`,
    ``,
    `export interface MiningShip {`,
    `  name: string;`,
    `  manufacturer: string;`,
    `  size: "small" | "medium";`,
    `  cargoSCU: number;`,
    `  miningTurrets: number;`,
    `  description: string;`,
    `  crewMin: number;`,
    `  crewMax: number;`,
    `  isVehicle?: boolean;`,
    `}`,
    ``,
    `export const miningShips: MiningShip[] = [`,
  ];

  for (const ship of ships) {
    lines.push(`  {`);
    lines.push(`    name: ${JSON.stringify(ship.name)},`);
    lines.push(`    manufacturer: ${JSON.stringify(ship.manufacturer)},`);
    lines.push(`    size: ${JSON.stringify(ship.size)},`);
    lines.push(`    cargoSCU: ${ship.cargoSCU},`);
    lines.push(`    miningTurrets: ${ship.miningTurrets},`);
    lines.push(`    crewMin: ${ship.crewMin},`);
    lines.push(`    crewMax: ${ship.crewMax},`);
    if (ship.isVehicle) {
      lines.push(`    isVehicle: true,`);
    }
    lines.push(`    description: ${JSON.stringify(ship.description)},`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);

  return { content: lines.join("\n"), report };
}
