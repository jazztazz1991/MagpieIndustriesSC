/**
 * Main orchestrator: reads extracted XML from D:\StarCitizen\extracted\,
 * generates TypeScript data files in client/src/data/.
 *
 * Usage:
 *   npm run sync:generate                  # Normal generation
 *   npm run sync:generate -- --dry-run     # Show what would change without writing
 *   npm run sync:generate -- --validate    # Compare generated vs current files
 */
import * as path from "path";
import * as fs from "fs";
import * as dotenv from "dotenv";
import { readVersion, readExtractedAt, GeneratorReport } from "./lib/xml-utils";
import { generateMiningLasers } from "./generators/mining-lasers";
import { generateMiningGadgets } from "./generators/mining-gadgets";
import { generateMiningShips } from "./generators/mining-ships";
import { generateOres } from "./generators/ores";
import { generateShips } from "./generators/ships";
import { generateWikelo } from "./generators/wikelo";
import { generateLoadout } from "./generators/loadout";
import { generateRefinery } from "./generators/refinery";
import { generateMiningLocations } from "./generators/mining-locations";
import { generateCrafting } from "./generators/crafting";
import { generateJournal } from "./generators/journal";
import { generateLoot } from "./generators/loot";
import { generateStarmap } from "./generators/starmap";
import { generateReputation } from "./generators/reputation";
import { generateLaw } from "./generators/law";
import { generateFactions } from "./generators/factions";
import { generateAmmo } from "./generators/ammo";
import { generateMissionGivers } from "./generators/mission-givers";

// --- CLI flags ---
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const VALIDATE = args.includes("--validate");

// --- Config ---
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const SC_EXTRACTED = process.env.SC_EXTRACTED_PATH || "D:\\StarCitizen\\extracted";
const XML_DIR = path.join(SC_EXTRACTED, "parsed", "xml");
const CLIENT_DATA = path.resolve(__dirname, "..", "client", "src", "data");
const OVERRIDES_DIR = path.resolve(__dirname, "..", "data", "overrides");

if (!fs.existsSync(XML_DIR)) {
  console.error(`ERROR: XML directory not found at ${XML_DIR}`);
  console.error(`Run 'bash scripts/extract-gamedata.sh' first.`);
  process.exit(1);
}

// --- Override schema validation ---

interface SchemaField {
  type: "string" | "number" | "boolean" | "object" | "array";
  required?: boolean;
}

const OVERRIDE_SCHEMAS: Record<string, Record<string, SchemaField>> = {
  "ores.json": {
    name: { type: "string", required: true },
    abbrev: { type: "string", required: true },
    type: { type: "string", required: true },
    valuePerSCU: { type: "number", required: true },
    description: { type: "string", required: true },
  },
  "ships.json": {
    name: { type: "string", required: true },
    manufacturer: { type: "string", required: true },
    role: { type: "string", required: true },
    size: { type: "string", required: true },
    crew: { type: "object", required: true },
    cargoSCU: { type: "number", required: true },
    speed: { type: "object", required: true },
    description: { type: "string", required: true },
  },
  "refinery.json": {
    methods: { type: "array", required: true },
    stations: { type: "array", required: true },
  },
  "names.json": {
    miningLasers: { type: "object", required: true },
    miningModules: { type: "object", required: true },
    miningGadgets: { type: "object", required: true },
    miningShips: { type: "object", required: true },
    manufacturers: { type: "object", required: true },
    manufacturerPrefixes: { type: "object", required: true },
    vehicleRoles: { type: "object", required: true },
    oreNames: { type: "object", required: true },
    miningLocations: { type: "object", required: true },
    scannerOreOrder: { type: "array", required: true },
    rockSignatures: { type: "array", required: true },
  },
};

function validateOverrides(): string[] {
  const errors: string[] = [];

  for (const [filename, schema] of Object.entries(OVERRIDE_SCHEMAS)) {
    const filePath = path.join(OVERRIDES_DIR, filename);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing override file: ${filename}`);
      continue;
    }

    let data: any;
    try {
      data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch (err) {
      errors.push(`Invalid JSON in ${filename}: ${err}`);
      continue;
    }

    // For files with per-entry schemas (ores, ships), validate each entry
    if (filename === "ores.json" || filename === "ships.json") {
      for (const [key, entry] of Object.entries(data)) {
        if (key.startsWith("_")) continue;
        for (const [field, spec] of Object.entries(schema)) {
          if (spec.required && (entry as any)[field] === undefined) {
            errors.push(`${filename}[${key}]: missing required field "${field}"`);
          } else if ((entry as any)[field] !== undefined) {
            const actual = typeof (entry as any)[field];
            const expected = spec.type === "array" ? "object" : spec.type;
            if (actual !== expected) {
              errors.push(`${filename}[${key}].${field}: expected ${spec.type}, got ${actual}`);
            }
          }
        }
      }
    } else {
      // Top-level schema validation
      for (const [field, spec] of Object.entries(schema)) {
        if (spec.required && data[field] === undefined) {
          errors.push(`${filename}: missing required field "${field}"`);
        } else if (data[field] !== undefined) {
          const actual = Array.isArray(data[field]) ? "array" : typeof data[field];
          if (actual !== spec.type) {
            errors.push(`${filename}.${field}: expected ${spec.type}, got ${actual}`);
          }
        }
      }
    }
  }

  return errors;
}

// --- Generator registry ---

interface GeneratorEntry {
  name: string;
  outputFile: string;
  run: () => { content: string; report: GeneratorReport };
}

const generators: GeneratorEntry[] = [
  {
    name: "Mining Lasers",
    outputFile: "mining-lasers.ts",
    run: () => generateMiningLasers(XML_DIR, path.join(CLIENT_DATA, "mining-lasers.ts"), version, OVERRIDES_DIR),
  },
  {
    name: "Mining Modules + Gadgets",
    outputFile: "mining-gadgets.ts",
    run: () => generateMiningGadgets(XML_DIR, path.join(CLIENT_DATA, "mining-gadgets.ts"), version, OVERRIDES_DIR),
  },
  {
    name: "Mining Ships",
    outputFile: "mining-ships.ts",
    run: () => generateMiningShips(XML_DIR, path.join(CLIENT_DATA, "mining-ships.ts"), version, OVERRIDES_DIR),
  },
  {
    name: "Ores",
    outputFile: "mining.ts",
    run: () => generateOres(XML_DIR, path.join(CLIENT_DATA, "mining.ts"), version, OVERRIDES_DIR),
  },
  {
    name: "Ships",
    outputFile: "ships.ts",
    run: () => generateShips(XML_DIR, path.join(CLIENT_DATA, "ships.ts"), version, OVERRIDES_DIR),
  },
  {
    name: "Wikelo",
    outputFile: "wikelo.ts",
    run: () => generateWikelo(XML_DIR, path.join(CLIENT_DATA, "wikelo.ts"), version, OVERRIDES_DIR),
  },
  {
    name: "Loadout",
    outputFile: "loadout.ts",
    run: () => generateLoadout(XML_DIR, path.join(CLIENT_DATA, "loadout.ts"), version, OVERRIDES_DIR),
  },
  {
    name: "Refinery",
    outputFile: "refinery.ts",
    run: () => generateRefinery(XML_DIR, path.join(CLIENT_DATA, "refinery.ts"), version, OVERRIDES_DIR),
  },
  {
    name: "Mining Locations",
    outputFile: "mining-locations.ts",
    run: () => generateMiningLocations(XML_DIR, path.join(CLIENT_DATA, "mining-locations.ts"), version, OVERRIDES_DIR),
  },
  {
    name: "Crafting Blueprints",
    outputFile: "crafting.ts",
    run: () => generateCrafting(XML_DIR, path.join(CLIENT_DATA, "crafting.ts"), version, OVERRIDES_DIR),
  },
  {
    name: "Journal Entries",
    outputFile: "journal.ts",
    run: () => generateJournal(XML_DIR, path.join(CLIENT_DATA, "journal.ts"), version, OVERRIDES_DIR),
  },
  {
    name: "Loot Tables",
    outputFile: "loot.ts",
    run: () => generateLoot(XML_DIR, path.join(CLIENT_DATA, "loot.ts"), version, OVERRIDES_DIR),
  },
  {
    name: "Starmap Locations",
    outputFile: "starmap.ts",
    run: () => generateStarmap(XML_DIR, path.join(CLIENT_DATA, "starmap.ts"), version, OVERRIDES_DIR),
  },
  {
    name: "Reputation",
    outputFile: "reputation.ts",
    run: () => generateReputation(XML_DIR, path.join(CLIENT_DATA, "reputation.ts"), version, OVERRIDES_DIR),
  },
  {
    name: "Law System",
    outputFile: "law.ts",
    run: () => generateLaw(XML_DIR, path.join(CLIENT_DATA, "law.ts"), version, OVERRIDES_DIR),
  },
  {
    name: "Factions",
    outputFile: "factions.ts",
    run: () => generateFactions(XML_DIR, path.join(CLIENT_DATA, "factions.ts"), version, OVERRIDES_DIR),
  },
  {
    name: "Ammo Types",
    outputFile: "ammo.ts",
    run: () => generateAmmo(XML_DIR, path.join(CLIENT_DATA, "ammo.ts"), version, OVERRIDES_DIR),
  },
  {
    name: "Mission Givers",
    outputFile: "mission-givers.ts",
    run: () => generateMissionGivers(XML_DIR, path.join(CLIENT_DATA, "mission-givers.ts"), version, OVERRIDES_DIR),
  },
];

// --- Main ---

const version = readVersion(SC_EXTRACTED);
const extractedAt = readExtractedAt(SC_EXTRACTED);

const mode = DRY_RUN ? "DRY RUN" : VALIDATE ? "VALIDATE" : "GENERATE";
console.log(`=== ${mode}: data files ===`);
console.log(`  Version:     ${version}`);
console.log(`  Extracted:   ${extractedAt}`);
console.log(`  XML source:  ${XML_DIR}`);
console.log(`  Output:      ${CLIENT_DATA}`);
console.log(``);

// Step 1: Validate override schemas
console.log(`Validating override files...`);
const schemaErrors = validateOverrides();
if (schemaErrors.length > 0) {
  console.error(`\nOverride validation FAILED (${schemaErrors.length} errors):`);
  for (const err of schemaErrors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}
console.log(`  All override files valid.\n`);

// Step 2: Run all generators, collecting results
const results: { entry: GeneratorEntry; content: string; report: GeneratorReport }[] = [];
let failed = false;

for (let i = 0; i < generators.length; i++) {
  const entry = generators[i];
  console.log(`[${i + 1}/${generators.length}] ${entry.name}`);

  try {
    const { content, report } = entry.run();
    results.push({ entry, content, report });
  } catch (err) {
    console.error(`  FATAL: ${entry.name} failed: ${err}`);
    failed = true;
    break;
  }
}

if (failed) {
  console.error(`\nGeneration ABORTED — no files were written.`);
  process.exit(1);
}

// Step 3: Write or compare (atomic — all or nothing)
if (VALIDATE) {
  // Compare generated content with current files
  console.log(`\n=== Validation Results ===`);
  let allMatch = true;

  for (const { entry, content } of results) {
    const outputPath = path.join(CLIENT_DATA, entry.outputFile);
    if (!fs.existsSync(outputPath)) {
      console.log(`  NEW     ${entry.outputFile}`);
      allMatch = false;
      continue;
    }

    const current = fs.readFileSync(outputPath, "utf-8");
    if (current === content) {
      console.log(`  OK      ${entry.outputFile}`);
    } else {
      const currentLines = current.split("\n").length;
      const newLines = content.split("\n").length;
      const diff = newLines - currentLines;
      const diffStr = diff > 0 ? `+${diff}` : `${diff}`;
      console.log(`  CHANGED ${entry.outputFile} (${currentLines} → ${newLines} lines, ${diffStr})`);
      allMatch = false;
    }
  }

  if (allMatch) {
    console.log(`\nAll files up to date.`);
  } else {
    console.log(`\nSome files differ. Run without --validate to update.`);
  }
} else if (DRY_RUN) {
  // Show what would be written
  console.log(`\n=== Dry Run — would write: ===`);
  for (const { entry, content } of results) {
    const outputPath = path.join(CLIENT_DATA, entry.outputFile);
    const lines = content.split("\n").length;
    const exists = fs.existsSync(outputPath);
    const status = exists ? "overwrite" : "create";
    console.log(`  ${status.padEnd(10)} ${entry.outputFile} (${lines} lines)`);
  }
  console.log(`\nNo files were written.`);
} else {
  // Atomic write: write all to .tmp, then rename all at once
  const tmpFiles: { tmp: string; final: string }[] = [];

  try {
    for (const { entry, content } of results) {
      const finalPath = path.join(CLIENT_DATA, entry.outputFile);
      const tmpPath = finalPath + ".tmp";
      fs.writeFileSync(tmpPath, content);
      tmpFiles.push({ tmp: tmpPath, final: finalPath });
    }

    // All tmp files written successfully — rename atomically
    for (const { tmp, final } of tmpFiles) {
      fs.renameSync(tmp, final);
    }

    console.log(`\n  Wrote ${tmpFiles.length} files.`);
  } catch (err) {
    // Clean up any tmp files on failure
    for (const { tmp } of tmpFiles) {
      try { fs.unlinkSync(tmp); } catch {}
    }
    console.error(`\nFATAL: Write failed, no files were modified: ${err}`);
    process.exit(1);
  }
}

// Step 4: Print summary report
console.log(`\n=== Generation Report ===`);
console.log(`${"Generator".padEnd(25)} ${"Found".padStart(6)} ${"Produced".padStart(9)} ${"Skipped".padStart(8)} Warnings`);
console.log(`${"─".repeat(25)} ${"─".repeat(6)} ${"─".repeat(9)} ${"─".repeat(8)} ${"─".repeat(8)}`);

let totalFound = 0, totalProduced = 0, totalSkipped = 0, totalWarnings = 0;

for (const { report } of results) {
  const warnCount = report.warnings.length;
  console.log(
    `${report.name.padEnd(25)} ${String(report.found).padStart(6)} ${String(report.produced).padStart(9)} ${String(report.skipped).padStart(8)} ${warnCount > 0 ? `${warnCount} ⚠` : "0"}`
  );
  totalFound += report.found;
  totalProduced += report.produced;
  totalSkipped += report.skipped;
  totalWarnings += warnCount;
}

console.log(`${"─".repeat(25)} ${"─".repeat(6)} ${"─".repeat(9)} ${"─".repeat(8)} ${"─".repeat(8)}`);
console.log(
  `${"TOTAL".padEnd(25)} ${String(totalFound).padStart(6)} ${String(totalProduced).padStart(9)} ${String(totalSkipped).padStart(8)} ${totalWarnings > 0 ? `${totalWarnings} ⚠` : "0"}`
);

// Print any warnings
if (totalWarnings > 0) {
  console.log(`\n=== Warnings ===`);
  for (const { report } of results) {
    for (const w of report.warnings) {
      console.log(`  [${report.name}] ${w}`);
    }
  }
}

// Manual data files (not auto-generated):
//   trade.ts      — commodity prices per location (server-side economy)
//   locations.ts  — location descriptions (editorial)
//   salvage.ts    — hull salvage yields (not in DataForge)

console.log(`\n=== Done ===`);
