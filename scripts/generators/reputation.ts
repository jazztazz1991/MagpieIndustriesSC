/**
 * Generator: reputation.ts
 * Produces client/src/data/reputation.ts by extracting reputation hierarchy from DataForge XML.
 *
 * Data flow:
 * 1. Parse all standing XMLs (reputation tiers with minReputation thresholds)
 * 2. Parse all scope XMLs (rep types: Bounty, Courier, etc.) and link to standings via UUID
 * 3. Parse all context XMLs (orgs: Advocacy, BountyHuntersGuild, etc.) and link to scopes via UUID
 * 4. Resolve display names from localization
 * 5. Output TypeScript
 *
 * Hierarchy: Context (org) → Scope (rep type) → Standing (tier)
 */
import * as fs from "fs";
import * as path from "path";
import { GeneratorReport, emptyReport } from "../lib/xml-utils";
import { loadLocalization } from "../lib/localization";

// ─── Raw parsed types ───

interface RawStanding {
  uuid: string;
  className: string;
  name: string;
  displayNameKey: string;
  perkDescriptionKey: string;
  minReputation: number;
  driftReputation: number;
  driftTimeHours: number;
  gated: boolean;
}

interface RawScope {
  uuid: string;
  className: string;
  scopeName: string;
  displayNameKey: string;
  reputationCeiling: number;
  initialReputation: number;
  standingUUIDs: string[];
}

interface RawContext {
  uuid: string;
  className: string;
  contextName: string;
  primaryScopeUUID: string;
  additionalScopeUUIDs: string[];
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
  if (!key || key === "@LOC_PLACEHOLDER" || key === "@LOC_UNINITIALIZED" || key === "@blank_space") {
    return "";
  }
  const cleanKey = key.startsWith("@") ? key.substring(1).toLowerCase() : key.toLowerCase();
  return locMap.get(cleanKey) || "";
}

function extractClassName(content: string): string {
  // Root tag is like <SReputationStandingParams.ReputationStanding_Bounty_Agent ...>
  // Extract the part after the dot
  const match = content.match(/<S\w+\.(\S+)\s/);
  return match ? match[1] : "";
}

function prettifyName(className: string, prefix: string): string {
  // Strip known prefixes and convert underscores to spaces
  let name = className;
  if (prefix && name.startsWith(prefix)) {
    name = name.substring(prefix.length);
  }
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

// ─── Step 1: Parse Standings ───

function parseStanding(filePath: string): RawStanding | null {
  const content = fs.readFileSync(filePath, "utf-8");

  const refMatch = content.match(/__ref="([0-9a-f-]{36})"/);
  if (!refMatch) return null;

  const className = extractClassName(content);
  const nameMatch = content.match(/\bname="([^"]*)"/);
  const displayMatch = content.match(/\bdisplayName="([^"]*)"/);
  const perkMatch = content.match(/\bperkDescription="([^"]*)"/);
  const minRepMatch = content.match(/\bminReputation="(-?[\d.]+)"/);
  const driftRepMatch = content.match(/\bdriftReputation="(-?[\d.]+)"/);
  const driftTimeMatch = content.match(/\bdriftTimeHours="(-?[\d.]+)"/);
  const gatedMatch = content.match(/\bgated="([01])"/);

  return {
    uuid: refMatch[1],
    className,
    name: nameMatch?.[1] || "",
    displayNameKey: displayMatch?.[1] || "",
    perkDescriptionKey: perkMatch?.[1] || "",
    minReputation: minRepMatch ? parseFloat(minRepMatch[1]) : 0,
    driftReputation: driftRepMatch ? parseFloat(driftRepMatch[1]) : 0,
    driftTimeHours: driftTimeMatch ? parseFloat(driftTimeMatch[1]) : 0,
    gated: gatedMatch?.[1] === "1",
  };
}

// ─── Step 2: Parse Scopes ───

function parseScope(filePath: string): RawScope | null {
  const content = fs.readFileSync(filePath, "utf-8");

  const refMatch = content.match(/__ref="([0-9a-f-]{36})"/);
  if (!refMatch) return null;

  const className = extractClassName(content);
  const scopeNameMatch = content.match(/\bscopeName="([^"]*)"/);
  const displayMatch = content.match(/\bdisplayName="([^"]*)"/);
  const ceilingMatch = content.match(/\breputationCeiling="(-?[\d.]+)"/);
  const initialMatch = content.match(/\binitialReputation="(-?[\d.]+)"/);

  // Extract standing Reference UUIDs
  const standingUUIDs: string[] = [];
  const refRegex = /<Reference\s+value="([0-9a-f-]{36})"\s*\/>/g;
  let m;
  while ((m = refRegex.exec(content)) !== null) {
    standingUUIDs.push(m[1]);
  }

  return {
    uuid: refMatch[1],
    className,
    scopeName: scopeNameMatch?.[1] || "",
    displayNameKey: displayMatch?.[1] || "",
    reputationCeiling: ceilingMatch ? parseFloat(ceilingMatch[1]) : 0,
    initialReputation: initialMatch ? parseFloat(initialMatch[1]) : 0,
    standingUUIDs,
  };
}

// ─── Step 3: Parse Contexts ───

function parseContext(filePath: string): RawContext | null {
  const content = fs.readFileSync(filePath, "utf-8");

  const refMatch = content.match(/__ref="([0-9a-f-]{36})"/);
  if (!refMatch) return null;

  const className = extractClassName(content);

  // Extract context name from class name: ReputationContext_Advocacy → Advocacy
  const contextName = className.replace(/^ReputationContext_/, "");

  // Primary scope UUID
  const primaryMatch = content.match(/<primaryScopeContext\s+scope="([0-9a-f-]{36})"/);

  // Additional scopes in scopeContextList
  const additionalUUIDs: string[] = [];
  const scopeListMatch = content.match(/<scopeContextList>([\s\S]*?)<\/scopeContextList>/);
  if (scopeListMatch) {
    const listContent = scopeListMatch[1];
    const scopeRegex = /scope="([0-9a-f-]{36})"/g;
    let sm;
    while ((sm = scopeRegex.exec(listContent)) !== null) {
      additionalUUIDs.push(sm[1]);
    }
  }

  return {
    uuid: refMatch[1],
    className,
    contextName,
    primaryScopeUUID: primaryMatch?.[1] || "",
    additionalScopeUUIDs: additionalUUIDs,
  };
}

// ─── Main generator ───

export function generateReputation(
  xmlDir: string,
  outputPath: string,
  version: string,
  _overridesDir: string
): { content: string; report: GeneratorReport } {
  const report = emptyReport("reputation");

  // Load localization
  const extractedPath = path.resolve(xmlDir, "..", "..");
  const localizationMap = loadLocalization(extractedPath);

  const repDir = path.join(xmlDir, "libs/foundry/records/reputation");

  // Step 1: Parse all standings
  const standingsDir = path.join(repDir, "standings");
  const standingFiles = walkDir(standingsDir);
  console.log(`  Found ${standingFiles.length} standing files`);

  const standingsByUUID = new Map<string, RawStanding>();
  let standingSkipped = 0;
  for (const file of standingFiles) {
    const standing = parseStanding(file);
    if (standing) {
      standingsByUUID.set(standing.uuid, standing);
    } else {
      standingSkipped++;
    }
  }
  console.log(`  Parsed ${standingsByUUID.size} standings (${standingSkipped} skipped)`);

  // Step 2: Parse all scopes (including new/ subdirectory)
  const scopesDir = path.join(repDir, "scopes");
  const scopeFiles = walkDir(scopesDir);
  console.log(`  Found ${scopeFiles.length} scope files`);

  const scopesByUUID = new Map<string, RawScope>();
  let scopeSkipped = 0;
  for (const file of scopeFiles) {
    const scope = parseScope(file);
    if (scope) {
      scopesByUUID.set(scope.uuid, scope);
    } else {
      scopeSkipped++;
    }
  }
  console.log(`  Parsed ${scopesByUUID.size} scopes (${scopeSkipped} skipped)`);

  // Step 3: Parse all contexts (including new/ subdirectory)
  const contextsDir = path.join(repDir, "contexts");
  const contextFiles = walkDir(contextsDir);
  console.log(`  Found ${contextFiles.length} context files`);

  const contexts: RawContext[] = [];
  let contextSkipped = 0;
  for (const file of contextFiles) {
    const ctx = parseContext(file);
    if (ctx) {
      contexts.push(ctx);
    } else {
      contextSkipped++;
    }
  }
  console.log(`  Parsed ${contexts.length} contexts (${contextSkipped} skipped)`);

  report.found = contextFiles.length + scopeFiles.length + standingFiles.length;

  // Step 4: Link and build output
  function buildScope(scopeUUID: string): any | null {
    const scope = scopesByUUID.get(scopeUUID);
    if (!scope) {
      report.warnings.push(`Scope UUID ${scopeUUID} not found`);
      return null;
    }

    // Resolve scope display name
    const resolvedDisplayName = resolveLocKey(localizationMap, scope.displayNameKey);
    const displayName = resolvedDisplayName || prettifyName(scope.scopeName, "");

    // Build tier list from standing UUIDs
    const tiers: any[] = [];
    for (const standingUUID of scope.standingUUIDs) {
      const standing = standingsByUUID.get(standingUUID);
      if (!standing) {
        report.warnings.push(`Standing UUID ${standingUUID} not found (scope: ${scope.scopeName})`);
        continue;
      }

      // Resolve standing display name: try the displayName key first, then fall back to name-based lookup
      let tierName = resolveLocKey(localizationMap, standing.displayNameKey);
      if (!tierName && standing.name) {
        // Try localization key based on the name attribute, e.g. "BountyHunter_MidLevel" → "RepStanding_BountyHunter_MidLevel_Name"
        const nameKey = `repstanding_${standing.name}_name`.toLowerCase();
        tierName = localizationMap.get(nameKey) || "";
      }
      if (!tierName) {
        tierName = prettifyName(standing.className, "ReputationStanding_");
      }

      tiers.push({
        name: tierName,
        minReputation: standing.minReputation,
        gated: standing.gated,
        ...(standing.driftReputation > 0 ? { driftReputation: standing.driftReputation } : {}),
        ...(standing.driftTimeHours > 0 ? { driftTimeHours: standing.driftTimeHours } : {}),
      });
    }

    // Sort tiers by minReputation ascending
    tiers.sort((a, b) => a.minReputation - b.minReputation);

    return {
      name: scope.scopeName,
      displayName,
      reputationCeiling: scope.reputationCeiling,
      tiers,
    };
  }

  // Internal system contexts that aren't player-facing orgs
  const INTERNAL_CONTEXTS = new Set([
    "Affinity", "Affinity_Reliability", "Guild", "Faction", "FactionReputation",
  ]);

  // Display name overrides for org names that don't resolve from localization
  const ORG_DISPLAY_NAMES: Record<string, string> = {
    "AdagioHoldings": "Adagio Holdings",
    "Advocacy": "Advocacy",
    "Assassination": "Assassination Guild",
    "Bounty-Security": "Bounty & Security",
    "BountyHuntersGuild": "Bounty Hunters Guild",
    "CitizensForProsperity": "Citizens for Prosperity",
    "HeadHunters": "Headhunters",
    "HiredMuscle": "Hired Muscle",
    "HiredMuscle-Assassination": "Hired Muscle (Assassination)",
    "HiredMuscle_Assassination": "Hired Muscle (Assassination)",
    "HurstonSecurity": "Hurston Security",
    "KlescherRehabilitationServices": "Klescher Rehabilitation Services",
    "MicrotechProtectionServices": "microTech Protection Services",
    "Northrock": "Northrock Group",
    "RacingGuild": "Racing Guild",
    "RoughAndReady": "Rough & Ready",
    "Salvage": "Salvage Guild",
    "ShubinInterstellar": "Shubin Interstellar",
    "Technician": "Technician Guild",
    "Transport": "Transport Guild",
    "UDM": "UDM",
    "Wikelo": "Wikelo",
    "Xenothreat": "Xenothreat",
  };

  const outputOrgs: any[] = [];
  for (const ctx of contexts) {
    // Skip internal system contexts
    if (INTERNAL_CONTEXTS.has(ctx.contextName)) {
      report.skipped++;
      continue;
    }

    const allScopeUUIDs = [ctx.primaryScopeUUID, ...ctx.additionalScopeUUIDs].filter(Boolean);
    const scopes: any[] = [];

    for (const scopeUUID of allScopeUUIDs) {
      const scope = buildScope(scopeUUID);
      if (scope) {
        scopes.push(scope);
      }
    }

    if (scopes.length === 0) {
      report.skipped++;
      continue;
    }

    // Resolve org display name: try localization, then override map, then prettify
    const locName = resolveLocKey(localizationMap, `@${ctx.contextName}_RepUI_Name`);
    const displayName = locName
      || ORG_DISPLAY_NAMES[ctx.contextName]
      || prettifyName(ctx.contextName, "");

    outputOrgs.push({
      name: displayName,
      scopes,
    });
  }

  // Sort orgs by name
  outputOrgs.sort((a, b) => a.name.localeCompare(b.name));

  report.produced = outputOrgs.length;

  // Summary stats
  const totalScopes = outputOrgs.reduce((sum, org) => sum + org.scopes.length, 0);
  const totalTiers = outputOrgs.reduce(
    (sum, org) => sum + org.scopes.reduce((s: number, sc: any) => s + sc.tiers.length, 0),
    0
  );
  console.log(`  Output: ${outputOrgs.length} orgs, ${totalScopes} scopes, ${totalTiers} tiers`);

  // ─── Build output TypeScript ───
  const lines: string[] = [
    `// Auto-generated from DataForge extraction + localization — ${version}`,
    `// Run: npm run sync:generate`,
    ``,
    `export interface ReputationTier {`,
    `  name: string;`,
    `  minReputation: number;`,
    `  gated: boolean;`,
    `  driftReputation?: number;`,
    `  driftTimeHours?: number;`,
    `}`,
    ``,
    `export interface ReputationScope {`,
    `  name: string;`,
    `  displayName: string;`,
    `  reputationCeiling: number;`,
    `  tiers: ReputationTier[];`,
    `}`,
    ``,
    `export interface ReputationOrg {`,
    `  name: string;`,
    `  scopes: ReputationScope[];`,
    `}`,
    ``,
    `export const organizations: ReputationOrg[] = ${JSON.stringify(outputOrgs, null, 2)};`,
    ``,
  ];

  return { content: lines.join("\n"), report };
}
