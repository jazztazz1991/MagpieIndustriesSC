/**
 * Generator: law.ts
 * Produces client/src/data/law.ts by extracting law system data from DataForge XML.
 *
 * Data flow:
 * 1. Scan all infraction definition XMLs in lawsystem/infractiondefinitions/
 * 2. Parse each infraction: name, isFelony, trigger, felonyMerits, lifetime, fineMultiplier
 * 3. Scan all jurisdiction XMLs in lawsystem/jurisdictions/
 * 4. Parse each jurisdiction: name, baseFine, isPrison, infractions, impound rules
 * 5. Link infraction UUIDs to crime IDs via a UUID map
 * 6. Resolve localization keys from global.ini
 * 7. Output TypeScript
 */
import * as fs from "fs";
import * as path from "path";
import { GeneratorReport, emptyReport } from "../lib/xml-utils";
import { loadLocalization } from "../lib/localization";

// ─── Raw parsed types ───

interface RawInfraction {
  id: string;
  className: string;
  nameKey: string;
  descriptionKey: string;
  uuid: string;
  isFelony: boolean;
  trigger: string;
  felonyMerits: number;
  lifetimeHours: number;
  fineMultiplier: number;
}

interface RawImpoundRule {
  trigger: string;
  timeSeconds: number;
  fineUEC: number;
}

interface RawJurisdiction {
  id: string;
  className: string;
  nameKey: string;
  uuid: string;
  parentUUID: string;
  respectsParent: boolean;
  baseFine: number;
  isPrison: boolean;
  infractionUUIDs: string[];
  impoundRules: RawImpoundRule[];
}

// ─── Parsing helpers ───

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

function resolveLocKey(locMap: Map<string, string>, key: string): string {
  if (!key || key === "@LOC_UNINITIALIZED" || key === "@LOC_EMPTY") return "";
  const cleanKey = key.startsWith("@") ? key.substring(1).toLowerCase() : key.toLowerCase();
  return locMap.get(cleanKey) || "";
}

/**
 * Convert an InfractionDefinition class name to a readable crime name.
 * e.g. "InfractionDefinition.Murder" → "Murder"
 *      "InfractionDefinition.PadRamming" → "Pad Ramming"
 */
function prettifyCrimeName(className: string): string {
  // Strip the type prefix (everything before the dot)
  const name = className.includes(".") ? className.split(".").pop()! : className;
  // Insert spaces before uppercase letters (PadRamming → Pad Ramming)
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .trim();
}

/**
 * Similarly for jurisdictions:
 * "Jurisdiction.UEE" → "UEE"
 * "Jurisdiction.Stanton_CrusaderIndustries" → "Stanton Crusader Industries"
 */
function prettifyJurisdictionName(className: string): string {
  const name = className.includes(".") ? className.split(".").pop()! : className;
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .trim();
}

// ─── Infraction parsing ───

function parseInfraction(filePath: string): RawInfraction | null {
  const content = fs.readFileSync(filePath, "utf-8");
  const fileName = path.basename(filePath, ".xml");

  // Extract class name from root tag: <InfractionDefinition.Murder ...>
  const classMatch = content.match(/<(InfractionDefinition\.\w+)/);
  if (!classMatch) return null;
  const className = classMatch[1];

  // Extract __ref UUID
  const refMatch = content.match(/__ref="([0-9a-f-]{36})"/);
  if (!refMatch) return null;

  // Extract name/description localization keys
  const nameMatch = content.match(/\bname="(@[^"]*)"/);
  const descMatch = content.match(/\bdescription="(@[^"]*)"/);

  // Extract trigger from <Enum value="..." />
  const triggerMatch = content.match(/<Enum\s+value="([^"]+)"\s*\/>/);

  // Extract defaultParameters
  const isFelonyMatch = content.match(/\bisFelony="([^"]+)"/);
  const fineMultMatch = content.match(/\bescalatedPaymentFineMultiplier="([^"]+)"/);
  const lifetimeMatch = content.match(/\blifetime="([^"]+)"/);
  const meritsMatch = content.match(/\bfelonyMerits="([^"]+)"/);

  return {
    id: fileName,
    className,
    nameKey: nameMatch?.[1] || "",
    descriptionKey: descMatch?.[1] || "",
    uuid: refMatch[1],
    isFelony: isFelonyMatch?.[1] === "1",
    trigger: triggerMatch?.[1] || "Unknown",
    felonyMerits: meritsMatch ? parseFloat(meritsMatch[1]) : 0,
    lifetimeHours: lifetimeMatch ? parseFloat(lifetimeMatch[1]) : 0,
    fineMultiplier: fineMultMatch ? parseFloat(fineMultMatch[1]) : 0,
  };
}

// ─── Jurisdiction parsing ───

function parseJurisdiction(filePath: string): RawJurisdiction | null {
  const content = fs.readFileSync(filePath, "utf-8");
  const fileName = path.basename(filePath, ".xml");

  // Extract class name: <Jurisdiction.UEE ...>
  const classMatch = content.match(/<(Jurisdiction\.\w+)/);
  if (!classMatch) return null;
  const className = classMatch[1];

  // Extract __ref UUID
  const refMatch = content.match(/__ref="([0-9a-f-]{36})"/);
  if (!refMatch) return null;

  // Extract name localization key
  const nameMatch = content.match(/\bname="(@[^"]*)"/);

  // Extract parent jurisdiction UUID
  const parentMatch = content.match(/\bparentJurisdiction="([0-9a-f-]{36})"/);

  // Extract respectsParentJurisdictionLaws
  const respectsMatch = content.match(/\brespectsParentJurisdictionLaws="([^"]+)"/);

  // Extract baseFine
  const fineMatch = content.match(/\bbaseFine="([^"]+)"/);

  // Extract isPrison
  const prisonMatch = content.match(/\bisPrison="([^"]+)"/);

  // Extract infraction definition UUIDs
  const infractionUUIDs: string[] = [];
  const infractionRegex = /<Infraction\s+definition="([0-9a-f-]{36})"/g;
  let im;
  while ((im = infractionRegex.exec(content)) !== null) {
    infractionUUIDs.push(im[1]);
  }

  // Extract impounding definitions
  const impoundRules: RawImpoundRule[] = [];
  const impoundRegex = /<ImpoundingDefinition\s+[^>]*trigger="([^"]+)"[^>]*impoundingTimeSeconds="([^"]+)"[^>]*impoundingFineUEC="([^"]+)"/g;
  let ipm;
  while ((ipm = impoundRegex.exec(content)) !== null) {
    impoundRules.push({
      trigger: ipm[1],
      timeSeconds: parseFloat(ipm[2]),
      fineUEC: parseFloat(ipm[3]),
    });
  }

  // Also try the alternate attribute order (impoundingFineUEC before impoundingTimeSeconds)
  const impoundRegex2 = /<ImpoundingDefinition\s+[^>]*trigger="([^"]+)"[^>]*impoundingFineUEC="([^"]+)"[^>]*impoundingTimeSeconds="([^"]+)"/g;
  while ((ipm = impoundRegex2.exec(content)) !== null) {
    // Avoid duplicates (check if this trigger was already added)
    const trigger = ipm[1];
    if (!impoundRules.some((r) => r.trigger === trigger)) {
      impoundRules.push({
        trigger,
        timeSeconds: parseFloat(ipm[3]),
        fineUEC: parseFloat(ipm[2]),
      });
    }
  }

  return {
    id: fileName,
    className,
    nameKey: nameMatch?.[1] || "",
    uuid: refMatch[1],
    parentUUID: parentMatch?.[1] || "",
    respectsParent: respectsMatch?.[1] === "1",
    baseFine: fineMatch ? parseFloat(fineMatch[1]) : 0,
    isPrison: prisonMatch?.[1] === "1",
    infractionUUIDs,
    impoundRules,
  };
}

// ─── Main generator ───

export function generateLaw(
  xmlDir: string,
  outputPath: string,
  version: string,
  _overridesDir: string
): { content: string; report: GeneratorReport } {
  const report = emptyReport("law");

  // Load localization
  const extractedPath = path.resolve(xmlDir, "..", "..");
  const localizationMap = loadLocalization(extractedPath);

  // Step 1: Parse infraction definitions
  const infractionDir = path.join(xmlDir, "libs/foundry/records/lawsystem/infractiondefinitions");
  const infractionFiles = walkDir(infractionDir);
  console.log(`  Found ${infractionFiles.length} infraction definition files`);
  report.found += infractionFiles.length;

  const infractions: RawInfraction[] = [];
  for (const file of infractionFiles) {
    const infraction = parseInfraction(file);
    if (infraction) {
      infractions.push(infraction);
    } else {
      report.skipped++;
    }
  }
  console.log(`  Parsed ${infractions.length} infractions (${report.skipped} skipped)`);

  // Build UUID → infraction map for jurisdiction linking
  const uuidToInfraction = new Map<string, RawInfraction>();
  for (const inf of infractions) {
    uuidToInfraction.set(inf.uuid, inf);
  }

  // Step 2: Parse jurisdictions
  const jurisdictionDir = path.join(xmlDir, "libs/foundry/records/lawsystem/jurisdictions");
  const jurisdictionFiles = walkDir(jurisdictionDir);
  console.log(`  Found ${jurisdictionFiles.length} jurisdiction files`);
  report.found += jurisdictionFiles.length;

  const jurisdictions: RawJurisdiction[] = [];
  let jurisdictionSkipped = 0;
  for (const file of jurisdictionFiles) {
    const jurisdiction = parseJurisdiction(file);
    if (jurisdiction) {
      jurisdictions.push(jurisdiction);
    } else {
      jurisdictionSkipped++;
      report.skipped++;
    }
  }
  console.log(`  Parsed ${jurisdictions.length} jurisdictions (${jurisdictionSkipped} skipped)`);

  // Step 3: Build output crimes
  const outputCrimes: any[] = [];
  for (const inf of infractions) {
    const resolvedName = resolveLocKey(localizationMap, inf.nameKey);
    const displayName = resolvedName || prettifyCrimeName(inf.className);

    outputCrimes.push({
      id: inf.id,
      name: displayName,
      isFelony: inf.isFelony,
      trigger: inf.trigger,
      felonyMerits: inf.felonyMerits,
      lifetimeHours: inf.lifetimeHours,
      fineMultiplier: inf.fineMultiplier,
    });
  }

  // Sort crimes alphabetically by name
  outputCrimes.sort((a, b) => a.name.localeCompare(b.name));

  // Build a UUID → crime ID map for jurisdiction linking
  const uuidToCrimeId = new Map<string, string>();
  for (const inf of infractions) {
    uuidToCrimeId.set(inf.uuid, inf.id);
  }

  // Step 4: Build output jurisdictions
  const outputJurisdictions: any[] = [];
  let unresolvedInfractions = 0;

  for (const jur of jurisdictions) {
    const resolvedName = resolveLocKey(localizationMap, jur.nameKey);
    const displayName = resolvedName || prettifyJurisdictionName(jur.className);

    // Resolve infraction UUIDs to crime IDs
    const crimeIds: string[] = [];
    for (const uuid of jur.infractionUUIDs) {
      const crimeId = uuidToCrimeId.get(uuid);
      if (crimeId) {
        crimeIds.push(crimeId);
      } else {
        unresolvedInfractions++;
      }
    }

    outputJurisdictions.push({
      id: jur.id,
      name: displayName,
      baseFine: jur.baseFine,
      isPrison: jur.isPrison,
      crimes: crimeIds,
      impoundRules: jur.impoundRules.map((r) => ({
        trigger: r.trigger,
        timeSeconds: r.timeSeconds,
        fineUEC: r.fineUEC,
      })),
    });
  }

  // Sort jurisdictions alphabetically by name
  outputJurisdictions.sort((a, b) => a.name.localeCompare(b.name));

  if (unresolvedInfractions > 0) {
    const msg = `${unresolvedInfractions} infraction UUID(s) could not be resolved to crime IDs`;
    console.warn(`  WARNING: ${msg}`);
    report.warnings.push(msg);
  }

  // Stats
  const felonies = outputCrimes.filter((c) => c.isFelony).length;
  const misdemeanors = outputCrimes.length - felonies;
  const prisons = outputJurisdictions.filter((j) => j.isPrison).length;
  const withImpound = outputJurisdictions.filter((j) => j.impoundRules.length > 0).length;
  console.log(`  Crimes: ${felonies} felonies, ${misdemeanors} misdemeanors`);
  console.log(`  Jurisdictions: ${outputJurisdictions.length} total, ${prisons} prisons, ${withImpound} with impound rules`);

  report.produced = outputCrimes.length + outputJurisdictions.length;

  // ─── Build output TypeScript ───
  const lines: string[] = [
    `// Auto-generated from DataForge extraction + localization — ${version}`,
    `// Run: npm run sync:generate`,
    ``,
    `export interface Crime {`,
    `  id: string;`,
    `  name: string;`,
    `  isFelony: boolean;`,
    `  trigger: string;`,
    `  felonyMerits: number;`,
    `  lifetimeHours: number;`,
    `  fineMultiplier: number;`,
    `}`,
    ``,
    `export interface ImpoundRule {`,
    `  trigger: string;`,
    `  timeSeconds: number;`,
    `  fineUEC: number;`,
    `}`,
    ``,
    `export interface Jurisdiction {`,
    `  id: string;`,
    `  name: string;`,
    `  baseFine: number;`,
    `  isPrison: boolean;`,
    `  crimes: string[];`,
    `  impoundRules: ImpoundRule[];`,
    `}`,
    ``,
    `export const crimes: Crime[] = ${JSON.stringify(outputCrimes, null, 2)};`,
    ``,
    `export const jurisdictions: Jurisdiction[] = ${JSON.stringify(outputJurisdictions, null, 2)};`,
    ``,
  ];

  return { content: lines.join("\n"), report };
}
