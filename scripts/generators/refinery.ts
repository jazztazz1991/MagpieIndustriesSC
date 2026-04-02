/**
 * Generator: refinery.ts
 * Reads refinery method overrides and validates against DataForge XML process types.
 * Writes client/src/data/refinery.ts.
 *
 * DataForge provides: the 9 speed/quality process type definitions (validates methods exist)
 * Overrides provide: display names, yield multipliers, time/cost ratings, descriptions,
 *                    station bonuses (community-sourced)
 */
import * as fs from "fs";
import * as path from "path";
import { findXmlFiles, GeneratorReport, emptyReport } from "../lib/xml-utils";

interface MethodOverride {
  key: string;
  name: string;
  yieldMultiplier: number;
  relativeTime: number;
  relativeCost: number;
  description: string;
}

interface StationOverride {
  name: string;
  location: string;
  bonuses: Record<string, number>;
}

interface RefineryOverrides {
  methods: MethodOverride[];
  stations: StationOverride[];
}

function loadOverrides(overridesPath: string): RefineryOverrides {
  if (!fs.existsSync(overridesPath)) {
    throw new Error(`Refinery overrides not found at ${overridesPath}`);
  }
  const raw = JSON.parse(fs.readFileSync(overridesPath, "utf-8"));
  return {
    methods: raw.methods || [],
    stations: raw.stations || [],
  };
}

export function generateRefinery(
  xmlDir: string,
  outputPath: string,
  version: string,
  overridesDir: string
): { content: string; report: GeneratorReport } {
  const report = emptyReport("refinery");
  const overrides = loadOverrides(path.join(overridesDir, "refinery.json"));

  // Validate against DataForge process types
  const processDir = path.join(xmlDir, "libs/foundry/records/refiningprocess");
  if (fs.existsSync(processDir)) {
    const xmlFiles = findXmlFiles(processDir, /\.xml$/);
    const dfKeys = xmlFiles.map((f) => path.basename(f, ".xml"));
    report.found = dfKeys.length;
    console.log(`  DataForge process types: ${dfKeys.join(", ")}`);

    // Check all override keys exist in DataForge
    for (const method of overrides.methods) {
      if (!dfKeys.includes(method.key)) {
        report.warnings.push(`Override key "${method.key}" not found in DataForge`);
      }
    }

    // Check for DataForge entries missing from overrides
    const overrideKeys = overrides.methods.map((m) => m.key);
    for (const dfKey of dfKeys) {
      if (!overrideKeys.includes(dfKey)) {
        report.warnings.push(`DataForge process "${dfKey}" has no override entry`);
      }
    }
  } else {
    report.warnings.push(`Refining process directory not found, skipping validation`);
  }

  report.produced = overrides.methods.length + overrides.stations.length;
  console.log(`  ${overrides.methods.length} refinery methods, ${overrides.stations.length} stations`);

  const lines: string[] = [
    `// Auto-generated from overrides + DataForge validation — ${version}`,
    `// Run: npm run sync:generate`,
    ``,
    `export interface RefineryMethod {`,
    `  name: string;`,
    `  yieldMultiplier: number;`,
    `  relativeTime: number;`,
    `  relativeCost: number;`,
    `  description: string;`,
    `}`,
    ``,
    `export const refineryMethods: RefineryMethod[] = [`,
  ];

  for (const method of overrides.methods) {
    lines.push(`  {`);
    lines.push(`    name: ${JSON.stringify(method.name)},`);
    lines.push(`    yieldMultiplier: ${method.yieldMultiplier},`);
    lines.push(`    relativeTime: ${method.relativeTime},`);
    lines.push(`    relativeCost: ${method.relativeCost},`);
    lines.push(`    description: ${JSON.stringify(method.description)},`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);

  // Station bonuses
  lines.push(`export interface RefineryStation {`);
  lines.push(`  name: string;`);
  lines.push(`  location: string;`);
  lines.push(`  bonuses: Record<string, number>;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export const refineryStations: RefineryStation[] = [`);

  for (const station of overrides.stations) {
    const bonusStr = Object.entries(station.bonuses)
      .map(([k, v]) => `${JSON.stringify(k)}: ${v}`)
      .join(", ");
    lines.push(`  {`);
    lines.push(`    name: ${JSON.stringify(station.name)},`);
    lines.push(`    location: ${JSON.stringify(station.location)},`);
    lines.push(`    bonuses: { ${bonusStr} },`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);

  return { content: lines.join("\n"), report };
}
