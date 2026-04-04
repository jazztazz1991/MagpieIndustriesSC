/**
 * Resolves DataForge entity UUIDs to human-readable names.
 *
 * Entity XML files have a root tag like:
 *   <EntityClassDefinition.Some_Entity_Name ... __ref="uuid" ...>
 *
 * This module builds a Map<UUID, entityName> by scanning all entity files,
 * then uses a display-name mapping to convert internal names to readable ones.
 */
import * as fs from "fs";
import * as path from "path";
import { lookupEntityDisplayName } from "./localization";

export interface ResolvedEntity {
  uuid: string;
  internalName: string;
  displayName: string;
  filePath: string;
}

/**
 * Build a UUID → entity info map by scanning entity XML files.
 * Only scans for UUIDs in the provided set (for performance).
 *
 * Resolution order for display names:
 * 1. displayNameMap (manual overrides from wikelo.json)
 * 2. localizationMap (from global.ini — item_Name_{internalName})
 * 3. prettifyEntityName (regex-based fallback)
 */
export function resolveUUIDs(
  xmlDir: string,
  uuidsToFind: Set<string>,
  displayNameMap: Map<string, string>,
  localizationMap?: Map<string, string>
): Map<string, ResolvedEntity> {
  const resolved = new Map<string, ResolvedEntity>();
  const remaining = new Set(uuidsToFind);

  const locMap = localizationMap || new Map<string, string>();

  // Scan entity directories for __ref attributes
  const entityDirs = [
    "libs/foundry/records/entities/scitem",
    "libs/foundry/records/entities/spaceships",
    "libs/foundry/records/entities/groundvehicles",
  ];

  for (const relDir of entityDirs) {
    if (remaining.size === 0) break;
    const absDir = path.join(xmlDir, relDir);
    if (!fs.existsSync(absDir)) continue;
    scanDirectory(absDir, remaining, resolved, displayNameMap, locMap);
  }

  // If still unresolved, do a broader search
  if (remaining.size > 0) {
    const broadDir = path.join(xmlDir, "libs/foundry/records");
    if (fs.existsSync(broadDir)) {
      scanDirectory(broadDir, remaining, resolved, displayNameMap, locMap);
    }
  }

  if (remaining.size > 0) {
    console.warn(`  WARNING: ${remaining.size} UUIDs could not be resolved:`);
    for (const uuid of remaining) {
      console.warn(`    - ${uuid}`);
    }
  }

  return resolved;
}

function scanDirectory(
  dir: string,
  remaining: Set<string>,
  resolved: Map<string, ResolvedEntity>,
  displayNameMap: Map<string, string>,
  localizationMap: Map<string, string>
): void {
  if (remaining.size === 0) return;

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (remaining.size === 0) return;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanDirectory(fullPath, remaining, resolved, displayNameMap, localizationMap);
    } else if (entry.name.endsWith(".xml")) {
      // Quick check: read first line to get __ref
      const fd = fs.openSync(fullPath, "r");
      const buf = Buffer.alloc(2048);
      const bytesRead = fs.readSync(fd, buf, 0, 2048, 0);
      fs.closeSync(fd);
      const header = buf.toString("utf-8", 0, bytesRead);

      const refMatch = header.match(/__ref="([0-9a-f-]{36})"/);
      if (!refMatch) continue;

      const uuid = refMatch[1];
      if (!remaining.has(uuid)) continue;

      // Extract entity name from root tag: <EntityClassDefinition.NAME or <SomeType.NAME
      const nameMatch = header.match(/<([A-Za-z_]+)\.([A-Za-z0-9_]+)/);
      const internalName = nameMatch ? nameMatch[2] : entry.name.replace(".xml", "");

      const displayName = displayNameMap.get(internalName)
        || displayNameMap.get(uuid)
        || lookupEntityDisplayName(localizationMap, internalName)
        || prettifyEntityName(internalName);

      resolved.set(uuid, {
        uuid,
        internalName,
        displayName,
        filePath: fullPath,
      });
      remaining.delete(uuid);
    }
  }
}

/**
 * Convert internal entity names to readable form.
 * e.g., "Carryable_1H_CY_banu_favour_Wikelo" → "Wikelo Favor"
 * Falls back to generic cleanup if no specific mapping.
 */
function prettifyEntityName(name: string): string {
  // Known patterns — checked in order, first match wins
  const patterns: [RegExp, (m: RegExpMatchArray) => string][] = [
    // Wikelo currencies
    [/banu_favour_wikelo_special/i, () => "Polaris Bit"],
    [/banu_favour_wikelo/i, () => "Wikelo Favor"],
    [/banu_polaris/i, () => "Polaris Bit"],

    // Creature drops
    [/quasigrazeregg_grassland/i, () => "Grassland Quasigrazer Egg"],
    [/quasigrazeregg_tundra/i, () => "Tundra Quasigrazer Egg"],
    [/quasigrazeregg_borealforest/i, () => "Boreal Forest Quasigrazer Egg"],
    [/quasigrazeregg_jungle/i, () => "Jungle Quasigrazer Egg"],
    [/quasigrazeregg/i, () => "Quasigrazer Egg"],
    [/quasigrazertongue/i, () => "Quasigrazer Tongue"],
    [/kopionhorn_tundra/i, () => "Tundra Kopion Horn"],
    [/kopiontooth_tundra/i, () => "Tundra Kopion Tooth"],
    [/yormandi.*eye/i, () => "Yormandi Eye"],
    [/yormandi.*tongue/i, () => "Yormandi Tongue"],
    [/vlk.*apex.*fang.*irradiated/i, () => "Irradiated Valakkar Apex Fang"],
    [/valakkar.*apex.*fang|vlkapexfang/i, () => "Valakkar Apex Fang"],
    [/valakkar.*adult.*fang|vlkadultfang/i, () => "Valakkar Adult Fang"],
    [/valakkar.*juvenile.*fang|vlkjuvenilefang/i, () => "Valakkar Juvenile Fang"],
    [/vlk.*pearl.*irradiated.*super|pearl.*aaa/i, () => "Irradiated Valakkar Pearl (Grade AAA)"],
    [/vlk.*pearl.*irradiated|pearl.*aa/i, () => "Irradiated Valakkar Pearl (Grade AA)"],

    // Ores and harvestables
    [/carinite.*pure/i, () => "Carinite (Pure)"],
    [/carinite/i, () => "Carinite"],
    [/saldynium/i, () => "Saldynium (Ore)"],
    [/jaclium/i, () => "Jaclium (Ore)"],
    [/quantanium/i, () => "Quantanium (24 SCU)"],
    [/vestal/i, () => "Vestal Water"],

    // Scrip and currency items
    [/scrip_merc|mg_scrip/i, () => "MG Scrip"],
    [/scrip_council|council_scrip/i, () => "Council Scrip"],

    // Loot items
    [/harddrive.*delving.*asd|asd.*secure.*drive/i, () => "ASD Secure Drive"],
    [/basl_combat_light_helmet|ace.*interceptor/i, () => "Ace Interceptor Helmet"],
    [/medal_1_pristine_b|6th.*platoon/i, () => "UEE 6th Platoon Medal (Pristine)"],
    [/medal_1_pristine_a|unification.*war.*medal/i, () => "UNE Unification War Medal (Pristine)"],
    [/medal_1_pristine_c|tevarin.*war.*marker/i, () => "Tevarin War Service Marker (Pristine)"],
    [/medal_1_pristine_d|cartography.*medal/i, () => "Government Cartography Agency Medal (Pristine)"],
    [/medal.*pristine/i, () => "Medal (Pristine)"],
    [/military.*badge/i, () => "Military Badge"],
    [/tevarin.*marker/i, () => "Tevarin Marker"],
    [/vanduul.*plating/i, () => "Vanduul Plating"],
    [/vanduul.*metal/i, () => "Vanduul Metal"],
    [/artifact.*fragment.*pristine/i, () => "Large Artifact Fragment (Pristine)"],
    [/dchs.*05|orbital.*positioning/i, () => "DCHS-05 Orbital Positioning Comp-Board"],
    [/serverblade_(\d)/i, (m) => `Pyro Serverblade ${m[1]}`],

    // Delving/ASD reward items
    [/asdreward[_]?pwl[_]?(\d)/i, (m) => `RCMBNT-PWL-${m[1]}`],
    [/asdreward[_]?rgl[_]?(\d)/i, (m) => `RCMBNT-RGL-${m[1]}`],
    [/asdreward[_]?xtl[_]?(\d)/i, (m) => `RCMBNT-XTL-${m[1]}`],

    // Module components
    [/rcmbnt.*xtl.*([a-e])/i, (m) => `RCMBNT-XTL Module ${m[1].toUpperCase()}`],

    // Weapons — match manufacturer patterns
    [/volt_lmg|volt.*lmg.*energy/i, () => "Fresnel Energy LMG"],
    [/volt_rifle|volt.*rifle.*energy/i, () => "Volt Electron Rifle"],
    [/volt_shotgun|volt.*shotgun/i, () => "VOLT Scatter Shotgun"],
    [/volt_sniper|volt.*sniper/i, () => "Zenith Sniper Rifle"],
    [/volt_smg|volt.*smg/i, () => "Volt Electron SMG"],
    [/volt_pistol|volt.*pistol/i, () => "Volt Electron Pistol"],
    [/ksar_pistol/i, () => "Coda Pistol"],
    [/ksar_rifle_energy/i, () => "Karna Plasma Rifle"],
    [/gmni_rifle_ballistic/i, () => "Parallax Energy Assault Rifle"],
    [/mxox.*neutroncannon/i, () => "MXOX Neutron Cannon"],
    [/f55.*lmg|cf_337/i, () => "F55 LMG"],

    // Vehicles
    [/argo_atls.*ikti.*geo/i, () => "ATLS IKTI (Geo Variant)"],
    [/argo_atls.*ikti/i, () => "ATLS IKTI"],
    [/argo_atls/i, () => "ATLS"],

    // Ships (resolved from vehicle entity names)
    [/misc_prospector/i, () => "MISC Prospector"],
    [/drake_vulture/i, () => "Drake Vulture"],
    [/rsi_polaris/i, () => "RSI Polaris"],
    [/aegis_idris/i, () => "Aegis Idris-P"],

    // Armor — manufacturer prefix patterns
    [/cds_armor_heavy/i, () => "CDS Heavy Armor"],
    [/cds_combat_light/i, () => "CDS Combat Armor"],
    [/kap_combat_light/i, () => "Kopion-Themed Armor"],
    [/basl_combat/i, () => "Combat Armor"],
    [/omc_utility_heavy/i, () => "OMC Utility Armor"],
    [/qrt_specialist_heavy/i, () => "Specialist Heavy Armor"],
    [/grin_utility_medium/i, () => "Utility Medium Armor"],
    [/clda_env.*heavy/i, () => "Environmental Heavy Armor"],
    [/rsi_explorer.*light/i, () => "RSI Explorer Armor"],
    [/syfb_flightsuit/i, () => "Flight Suit"],
    [/fta_medium/i, () => "FTA Medium Helmet"],
  ];

  for (const [pattern, formatter] of patterns) {
    const match = name.match(pattern);
    if (match) return formatter(match);
  }

  // Generic cleanup: remove common prefixes, convert underscores to spaces
  let cleaned = name
    // Remove common entity type prefixes
    .replace(/^(Carryable_\w+_(CY|FL|SQ)_|Carryable_TBO_|Harvestable_\w+_\w+_|FPS_Consumable_)/i, "")
    .replace(/_/g, " ")
    .trim();

  // If we stripped everything down to just a short number/letter, keep the full name
  if (cleaned.length <= 3) {
    cleaned = name.replace(/_/g, " ").trim();
  }

  return cleaned
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}
