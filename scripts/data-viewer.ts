/**
 * Standalone data viewer — generates a self-contained HTML file for verifying
 * extracted game data. Not part of the Next.js site.
 *
 * Usage:
 *   npm run data:view
 */
import * as path from "path";
import * as fs from "fs";

// --- Import all generated data files ---
const DATA = path.resolve(__dirname, "..", "client", "src", "data");

// We require() the .ts files — ts-node compiles them on the fly
const mining = require(path.join(DATA, "mining"));
const miningLasers = require(path.join(DATA, "mining-lasers"));
const miningGadgets = require(path.join(DATA, "mining-gadgets"));
const miningShips = require(path.join(DATA, "mining-ships"));
const miningLocations = require(path.join(DATA, "mining-locations"));
const ships = require(path.join(DATA, "ships"));
const loadout = require(path.join(DATA, "loadout"));
const refinery = require(path.join(DATA, "refinery"));
const wikelo = require(path.join(DATA, "wikelo"));
const crafting = require(path.join(DATA, "crafting"));
const journal = require(path.join(DATA, "journal"));
const loot = require(path.join(DATA, "loot"));
const starmap = require(path.join(DATA, "starmap"));
const reputation = require(path.join(DATA, "reputation"));
const law = require(path.join(DATA, "law"));
const factions = require(path.join(DATA, "factions"));
const ammo = require(path.join(DATA, "ammo"));
const missionGivers = require(path.join(DATA, "mission-givers"));

// --- Loot table name prettifier ---
const LOOT_NAME_MAP: [RegExp, string][] = [
  // Contested Zone pools
  [/^CZ_Armour_([ABCD])$/i, "Tier $1 Armor Set"],
  [/^CZ_Armor_Firerat$/i, "Fire Rat Faction Armor"],
  [/^CZ_Armor_Horizon$/i, "Horizon Guard Armor"],
  [/^CZ_Weapons_([ABCD])$/i, "Tier $1 Weapon Pool"],
  [/^CZ_WeaponAttachment_([ABCD])$/i, "Tier $1 Weapon Attachments"],
  // Weapons
  [/^Weapon_Pistol_(Common|UnCommon|Rare)$/i, "$1 Pistol"],
  [/^Weapon_Shouldered_(Common|UnCommon|Rare)$/i, "$1 Rifle/SMG/LMG"],
  [/^Weapon_Attachments_(Common|UnCommon|Rare)$/i, "$1 Weapon Attachment"],
  [/^Weapons_Melee$/i, "Melee Weapon"],
  [/^Weapons_NoPistolsNoMelee_Common$/i, "Common Long Gun"],
  [/^Weapons_WithRareChance$/i, "Weapon (Rare Chance)"],
  [/^Weapons_HighChance_Sniper$/i, "Sniper Rifle (High Chance)"],
  [/^Weapons_AndRandomLoot$/i, "Weapon + Random Loot"],
  [/^Weapons_Attachments$/i, "Weapon Attachments"],
  [/^Weapons$/i, "Random Weapon"],
  [/^WeaponsCache_(Common|UnCommon|Rare)$/i, "$1 Weapons Cache"],
  [/^Pistol_(Common|UnCommon|Rare)$/i, "$1 Pistol"],
  [/^SniperCache_Common$/i, "Common Sniper Cache"],
  [/^SecurityOutpost_GrenadeLauncherCache$/i, "Grenade Launcher Cache"],
  [/^SecurityOutpost_HeavyWeaponCache$/i, "Heavy Weapon Cache"],
  [/^SecurityOutpost_Loot$/i, "Security Outpost Loot"],
  [/^ContrabandPico_Ammo$/i, "Contraband Ammo"],
  [/^Firepower_resources$/i, "Firepower Resources"],
  // Armor
  [/^Armor$/i, "Random Armor Piece"],
  [/^ArmorCache_(Common|UnCommon|Rare)$/i, "$1 Armor Cache"],
  [/^ArmorSurvival$/i, "Survival Armor"],
  [/^Armor_Jumptown$/i, "Jumptown Armor"],
  [/^Armor_Survival$/i, "Survival Armor"],
  [/^Arms$/i, "Arm Armor"],
  [/^Backpack$/i, "Backpack"],
  [/^Clothing$/i, "Clothing"],
  [/^Large_Armour_Legendary_Orbageddon$/i, "Legendary Orbageddon Armor"],
  // Ammo
  [/^Ammo$/i, "Random Ammo"],
  [/^Ammo_Pistol_Common$/i, "Common Pistol Ammo"],
  [/^Ammo_Shouldered$/i, "Rifle/SMG Ammo"],
  [/^Ammo_Stocked$/i, "Assorted Ammo"],
  [/^AmmoCache_Common$/i, "Common Ammo Cache"],
  // Attachments
  [/^Attachment_Size0?1$/i, "Small Attachment (Optic/Barrel)"],
  [/^Attachment_Size0?2$/i, "Medium Attachment"],
  [/^Attachment_Size0?3$/i, "Large Attachment"],
  [/^Attachments_(Common|UnCommon|Rare)$/i, "$1 Attachment"],
  // Medical
  [/^Medical_NoDrug_NoMedPen$/i, "Medical Supplies (No Drugs)"],
  [/^MedicalMultitool_Refill$/i, "Medical Multitool Refill"],
  [/^MedicalWeapons_Refill$/i, "Medical Weapon Refill"],
  [/^MedPen_Only$/i, "MedPen"],
  [/^DrugsCache_(Medical|Narcotics)$/i, "$1 Drugs"],
  [/^DrinksCache_Common$/i, "Common Drinks"],
  // Food & Consumables
  [/^FoodCache_(Common|Pyro)$/i, "$1 Food"],
  [/^Consumables$/i, "Consumables"],
  [/^Harvestables_Food_Drinks$/i, "Harvestable Food & Drinks"],
  [/^Harvestables_Glowsticks$/i, "Harvestable Glowsticks"],
  [/^HarvestableCache_Common$/i, "Common Harvestables"],
  // Mining & Salvage
  [/^Gem_Rare$/i, "Rare Gem"],
  [/^Minerals_Derelict_(Common|Uncommon|Rare|Epic)$/i, "$1 Derelict Minerals"],
  [/^MineablesCache_Common$/i, "Common Mineables"],
  [/^Salvage$/i, "Salvage Material"],
  [/^ScrapLoot$/i, "Scrap"],
  [/^Radiation_Only$/i, "Radiation Item"],
  // Tools & Misc
  [/^Tools_(Common|UnCommon|Rare|Stocked)$/i, "$1 Tools"],
  [/^Tools_TractorBeam$/i, "Tractor Beam"],
  [/^FPS_Stocked$/i, "FPS Equipment"],
  [/^FuseCell_\d+$/i, "Fuse Cell"],
  [/^Glowsticks$/i, "Glowsticks"],
  [/^Binoculars$/i, "Binoculars"],
  [/^Antiques$/i, "Antiques"],
  [/^AntiquesAndStuff$/i, "Antiques & Misc"],
  [/^Kopion$/i, "Kopion Drops"],
  [/^GrenadesCache_Common$/i, "Common Grenades"],
  [/^GeneralLoot_AmmoAndMedics$/i, "Ammo & Medical Supplies"],
  [/^GeneralLoot_Outpost$/i, "Outpost General Loot"],
  [/^RandomLoot_Common$/i, "Common Random Loot"],
  // Actor / NPC loot
  [/^Actor_AcePilot_Medals$/i, "Ace Pilot Medals"],
  [/^Actor_AcePilot_Scrip$/i, "Ace Pilot Scrip"],
  [/^Carryable_1H_CY_armor_vanduul_1$/i, "Vanduul Armor Piece"],
  // Prison
  [/^Prison_Chip$/i, "Prison Hacking Chip"],
  [/^Prison_Knife$/i, "Prison Shiv"],
  [/^Prison_Loot$/i, "Prison Loot"],
  [/^Prison_Misc$/i, "Prison Misc Items"],
  [/^Prison_Stash$/i, "Prison Stash"],
  // Location-specific
  [/^UGF_(Common|Uncommon|Rare)$/i, "$1 Bunker Loot"],
  [/^DC_(Common|Uncommon|Rare)$/i, "$1 Distribution Center Loot"],
  [/^ASD_specimin_vial$/i, "ASD Specimen Vial"],
  // Containers
  [/^Container_ASDSpeciminVial$/i, "ASD Specimen Vial Container"],
  [/^Container_Large_Weapons_Ammo_(Common|Rare)$/i, "$1 Large Weapon/Ammo Crate"],
  [/^Container_Attachments_ContestedZones$/i, "CZ Attachment Crate"],
  [/^Container_Antiques_(Common|Uncommon|Rare)$/i, "$1 Antiques Crate"],
  [/^Container_Armour_(Arms|Backpack|Core|Helmet|Legs)_ASDDelving$/i, "ASD Delving $1 Armor"],
  [/^Container_Armour_ContestedZones$/i, "CZ Armor Container"],
  [/^Container_Armour_DistributionCentres$/i, "DC Armor Container"],
  [/^Container_Backpack_Heavy_(Common|Uncommon|Rare)$/i, "$1 Heavy Backpack"],
  [/^Container_Undersuit_(Common|Uncommon|Rare)$/i, "$1 Undersuit"],
  [/^Container_Weapons_Ageddons$/i, "Ageddon Weapons Container"],
];

function prettifyLootName(raw: string): string {
  for (const [pattern, replacement] of LOOT_NAME_MAP) {
    if (pattern.test(raw)) {
      return raw.replace(pattern, replacement);
    }
  }
  // Fallback: clean up generic names
  return raw
    .replace(/^(LootTable_|V3LootTable_|LootArchetype_|V3LootArchetype_)/, "")
    .replace(/^Container_/, "Container: ")
    .replace(/^CZ_/, "CZ ")
    .replace(/_/g, " ")
    .replace(/\b(UnCommon)\b/gi, "Uncommon")
    .trim();
}

function prettifyTableName(raw: string): string {
  let name = raw
    .replace(/^(LootTable_|V3LootTable_)/, "")
    .replace(/^Container_/, "")
    .replace(/^container_/, "");

  // Translate known table patterns
  const tablePatterns: [RegExp, string][] = [
    [/^([ABCD])_Armor_(\d+)$/i, "Tier $1 Armor #$2"],
    [/^([ABCD])_Armor_Firerat_(\d+)$/i, "Tier $1 Fire Rat Armor #$2"],
    [/^([ABCD])_Armor_Horizon_(\d+)$/i, "Tier $1 Horizon Armor #$2"],
    [/^([ABCD])_Armor_Xenothreat_(\d+)$/i, "Tier $1 Xenothreat Armor #$2"],
    [/^([ABCD])_Weapon_(\d+)$/i, "Tier $1 Weapons #$2"],
    [/^([ABCD])_Ammo_(\d+)$/i, "Tier $1 Ammo #$2"],
    [/^([ABCD])_Food_(\d+)$/i, "Tier $1 Food #$2"],
    [/^([ABCD])_Junk_(\d+)$/i, "Tier $1 Junk/Scrap #$2"],
    [/^([ABCD])_Medical_(\d+)$/i, "Tier $1 Medical #$2"],
    [/^([ABCD])_Generic_(\d+)$/i, "Tier $1 Mixed Loot #$2"],
    [/^CZ_Grade_([ABCD])$/i, "Contested Zone Grade $1 (Master Table)"],
    [/^CZ_Grade_([ABCD])_(\d+)$/i, "CZ Grade $1 #$2"],
    [/^Generic_(Large|Medium|Small)$/i, "$1 Generic Container"],
    [/^Armour_(Large|Medium|Small)$/i, "$1 Armor Container"],
    [/^Weapons_(Large|Medium|Small)$/i, "$1 Weapon Container"],
    [/^Food_(Small)$/i, "$1 Food Container"],
    [/^Medical_(Common|Uncommon|Rare)$/i, "$1 Medical Container"],
    [/^Repair_(Medium|Small)$/i, "$1 Repair Kit"],
    [/^Mining$/i, "Mining Supplies"],
    [/^Personal$/i, "Personal Effects"],
    [/^Harvestables$/i, "Harvestable Items"],
    [/^Harvestables_ASDDelving$/i, "ASD Delving Harvestables"],
    [/^Event_(Arms|Backpack|Core|Helmet|Legs|FullArmour)$/i, "Event $1"],
    [/^Actor_Prisoner$/i, "Prisoner Loot"],
    [/^Kaboos_Corpse$/i, "Kaboo Corpse Loot"],
  ];

  for (const [pattern, replacement] of tablePatterns) {
    if (pattern.test(name)) {
      return name.replace(pattern, replacement);
    }
  }

  return name.replace(/_/g, " ").replace(/\b(UnCommon)\b/gi, "Uncommon");
}

function prettifyLootTable(t: any): any {
  // Extract grade from name pattern
  const gradeMatch = t.name.match(/(?:_([ABCD])_|_Grade_([ABCD]))/i);
  const grade = gradeMatch ? (gradeMatch[1] || gradeMatch[2]).toUpperCase() : "—";

  // Calculate total weight for percentages
  const totalWeight = t.entries.reduce((sum: number, e: any) => sum + e.weight, 0);

  const contents = t.entries.map((e: any) => {
    const pct = totalWeight > 0 ? ((e.weight / totalWeight) * 100).toFixed(0) : "?";
    const name = prettifyLootName(e.name);
    const chance = e.chanceToExist != null ? ` [${(e.chanceToExist * 100).toFixed(0)}% spawn]` : "";
    return `${name} (${pct}%)${chance}`;
  }).join(", ");

  return {
    name: prettifyTableName(t.name),
    grade,
    entryCount: t.entries.length,
    contents,
  };
}

// --- Build data payload ---
interface DataCategory {
  label: string;
  group: string;
  data: any[];
  columns?: string[]; // explicit column order (optional)
}

const categories: Record<string, DataCategory> = {
  ores: {
    label: "Ores",
    group: "Mining",
    data: mining.ores,
    columns: ["name", "abbrev", "type", "rarity", "valuePerSCU", "instability", "resistance", "description"],
  },
  rockSignatures: {
    label: "Rock Signatures",
    group: "Mining",
    data: mining.rockSignatures,
    columns: ["name", "rarity"],
  },
  scannerOreOrder: {
    label: "Scanner Ore Order",
    group: "Mining",
    data: mining.scannerOreOrder.map((name: string, i: number) => ({ position: i + 1, name })),
    columns: ["position", "name"],
  },
  miningLasers: {
    label: "Mining Lasers",
    group: "Mining",
    data: miningLasers.miningLasers,
    columns: [
      "name", "size", "price", "optimumRange", "maxRange",
      "minPower", "minPowerPct", "maxPower", "extractPower",
      "moduleSlots", "resistance", "instability",
      "optimalChargeRate", "optimalChargeWindow", "inertMaterials", "description",
    ],
  },
  activeModules: {
    label: "Active Modules",
    group: "Mining",
    data: miningGadgets.activeModules,
  },
  passiveModules: {
    label: "Passive Modules",
    group: "Mining",
    data: miningGadgets.passiveModules,
  },
  miningGadgets: {
    label: "Mining Gadgets",
    group: "Mining",
    data: miningGadgets.miningGadgets,
  },
  miningShips: {
    label: "Mining Ships",
    group: "Mining",
    data: miningShips.miningShips,
    columns: ["name", "manufacturer", "size", "cargoSCU", "miningTurrets", "crewMin", "crewMax", "isVehicle", "description"],
  },
  miningLocations: {
    label: "Mining Locations",
    group: "Mining",
    data: miningLocations.miningLocations,
    columns: ["name", "type", "parentBody", "gravity", "atmosphere", "danger", "ores", "notes"],
  },
  ships: {
    label: "Ships",
    group: "Ships",
    data: ships.ships,
    columns: ["name", "manufacturer", "role", "size", "crew", "cargoSCU", "buyPriceAUEC", "pledgeUSD", "speed", "description"],
  },
  components: {
    label: "Ship Components",
    group: "Ships",
    data: loadout.components,
    columns: ["name", "type", "size", "manufacturer", "grade", "stats"],
  },
  shipLoadouts: {
    label: "Ship Loadouts",
    group: "Ships",
    data: loadout.shipLoadouts,
    columns: ["shipName", "slots"],
  },
  refineryMethods: {
    label: "Refinery Methods",
    group: "Refinery",
    data: refinery.refineryMethods,
    columns: ["name", "yieldMultiplier", "relativeTime", "relativeCost", "description"],
  },
  refineryStations: {
    label: "Refinery Stations",
    group: "Refinery",
    data: refinery.refineryStations,
    columns: ["name", "location", "bonuses"],
  },
  wikeloContracts: {
    label: "Contracts",
    group: "Wikelo",
    data: wikelo.contracts,
    columns: ["id", "name", "tier", "category", "requirements", "rewards", "active", "notes"],
  },
  gatheringItems: {
    label: "Gathering Items",
    group: "Wikelo",
    data: wikelo.gatheringItems,
    columns: ["name", "category", "locations", "tips"],
  },
  emporiums: {
    label: "Emporiums",
    group: "Wikelo",
    data: wikelo.emporiums,
    columns: ["name", "planet", "moon", "system", "coordinates", "description", "howToGet", "tiers"],
  },
  favorConversions: {
    label: "Favor Conversions",
    group: "Wikelo",
    data: wikelo.favorConversions,
    columns: ["name", "input", "output"],
  },
  reputationTiers: {
    label: "Reputation Tiers",
    group: "Wikelo",
    data: wikelo.reputationTiers,
    columns: ["tier", "requirement", "benefits"],
  },
  favorTips: {
    label: "Favor Tips",
    group: "Wikelo",
    data: wikelo.favorTips.map((t: any) =>
      typeof t === "string" ? { tip: t } : t
    ),
  },
  weaponBlueprints: {
    label: "Weapon Blueprints",
    group: "Crafting",
    data: crafting.blueprints
      .filter((b: any) => b.type === "weapon")
      .map((b: any) => ({
        name: b.name,
        subCategory: b.subCategory,
        craftTime: b.craftTime,
        materials: b.aspects.map((a: any) => `${a.slot}: ${a.quantitySCU} SCU ${a.resource}`).join(", "),
        obtainedFrom: b.obtainedFrom || [],
      })),
    columns: ["name", "subCategory", "craftTime", "materials", "obtainedFrom"],
  },
  armorBlueprints: {
    label: "Armor Blueprints",
    group: "Crafting",
    data: crafting.blueprints
      .filter((b: any) => b.type === "armor")
      .map((b: any) => ({
        name: b.name,
        subCategory: b.subCategory,
        craftTime: b.craftTime,
        materials: b.aspects.map((a: any) => `${a.slot}: ${a.quantitySCU} SCU ${a.resource}`).join(", "),
        obtainedFrom: b.obtainedFrom || [],
      })),
    columns: ["name", "subCategory", "craftTime", "materials", "obtainedFrom"],
  },
  ammoBlueprints: {
    label: "Ammo Blueprints",
    group: "Crafting",
    data: crafting.blueprints
      .filter((b: any) => b.type === "ammo")
      .map((b: any) => ({
        name: b.name,
        subCategory: b.subCategory,
        craftTime: b.craftTime,
        materials: b.aspects.map((a: any) => `${a.slot}: ${a.quantitySCU} SCU ${a.resource}`).join(", "),
        obtainedFrom: b.obtainedFrom || [],
      })),
    columns: ["name", "subCategory", "craftTime", "materials", "obtainedFrom"],
  },
  blueprintSources: {
    label: "Blueprint Sources",
    group: "Crafting",
    data: crafting.blueprints
      .filter((b: any) => b.obtainedFrom && b.obtainedFrom.length > 0)
      .map((b: any) => ({
        name: b.name,
        type: b.type,
        missions: b.obtainedFrom,
      })),
    columns: ["name", "type", "missions"],
  },
  journalGuides: {
    label: "Guides",
    group: "Journal",
    data: journal.journalEntries
      .filter((e: any) => e.category === "Guides")
      .map((e: any) => ({
        title: e.title,
        author: e.author || "",
        type: e.type,
        body: e.body || "",
      })),
    columns: ["title", "author", "type", "body"],
  },
  journalLore: {
    label: "Lore & Datapads",
    group: "Journal",
    data: journal.journalEntries
      .filter((e: any) => ["Investigation", "Ship Logs", "Black Box", "Siege of Orison",
        "Missing Bennys", "Contested Zones", "Prison", "Crusader", "Lore", "Datapads", "Misc"].includes(e.category))
      .map((e: any) => ({
        title: e.title,
        category: e.category,
        author: e.author || "",
        type: e.type,
        body: e.body || "",
        missionSpecific: e.missionSpecific || false,
      })),
    columns: ["title", "category", "author", "type", "body", "missionSpecific"],
  },
  journalJurisdiction: {
    label: "Jurisdiction",
    group: "Journal",
    data: journal.journalEntries
      .filter((e: any) => e.category === "Jurisdiction")
      .map((e: any) => ({
        title: e.title,
        body: e.body || "",
      })),
    columns: ["title", "body"],
  },
  journalReputation: {
    label: "Reputation Updates",
    group: "Journal",
    data: journal.journalEntries
      .filter((e: any) => e.category === "Reputation")
      .map((e: any) => ({
        title: e.title,
        author: e.author || "",
        body: e.body || "",
      })),
    columns: ["title", "author", "body"],
  },
  // --- Loot ---
  lootContestedZone: {
    label: "Contested Zone Loot",
    group: "Loot",
    data: loot.lootTables
      .filter((t: any) => t.locationType === "contestedzone")
      .map((t: any) => prettifyLootTable(t)),
    columns: ["name", "grade", "entryCount", "contents"],
  },
  lootDerelict: {
    label: "Derelict Loot",
    group: "Loot",
    data: loot.lootTables
      .filter((t: any) => t.locationType === "derelict")
      .map((t: any) => prettifyLootTable(t)),
    columns: ["name", "grade", "entryCount", "contents"],
  },
  lootUGF: {
    label: "Bunker (UGF) Loot",
    group: "Loot",
    data: loot.lootTables
      .filter((t: any) => t.locationType === "ugf")
      .map((t: any) => prettifyLootTable(t)),
    columns: ["name", "grade", "entryCount", "contents"],
  },
  lootDistributionCenters: {
    label: "Distribution Center Loot",
    group: "Loot",
    data: loot.lootTables
      .filter((t: any) => t.locationType === "distributioncenters")
      .map((t: any) => prettifyLootTable(t)),
    columns: ["name", "grade", "entryCount", "contents"],
  },
  lootGeneral: {
    label: "General Container Loot",
    group: "Loot",
    data: loot.lootTables
      .filter((t: any) => t.locationType === "general" || t.locationType === "animals")
      .map((t: any) => prettifyLootTable(t)),
    columns: ["name", "grade", "entryCount", "contents"],
  },
  specialEvents: {
    label: "Special Events",
    group: "Loot",
    data: loot.specialEvents.map((e: any) => ({
      ...e,
      dropChance: `${(e.probabilityPerContainer * 100).toFixed(1)}%`,
    })),
    columns: ["name", "dropChance", "minEntries", "maxEntries"],
  },
  // --- Starmap ---
  starmapLocations: {
    label: "Locations",
    group: "Starmap",
    data: starmap.locations,
    columns: ["name", "type", "parentName", "navIcon", "size", "scannable", "amenityCount", "qtArrivalRadius"],
  },
  // --- Reputation ---
  reputationOrgs: {
    label: "Organizations",
    group: "Reputation",
    data: reputation.organizations.map((org: any) => ({
      name: org.name,
      scopes: org.scopes.map((s: any) => s.displayName || s.name).join(", "),
      scopeCount: org.scopes.length,
      totalTiers: org.scopes.reduce((sum: number, s: any) => sum + s.tiers.length, 0),
    })),
    columns: ["name", "scopes", "scopeCount", "totalTiers"],
  },
  repTierDetail: {
    label: "Reputation Tiers",
    group: "Reputation",
    data: reputation.organizations.flatMap((org: any) =>
      org.scopes.flatMap((scope: any) =>
        scope.tiers.map((tier: any) => ({
          org: org.name,
          scope: scope.displayName || scope.name,
          tier: tier.name,
          minReputation: tier.minReputation,
          ceiling: scope.reputationCeiling,
          gated: tier.gated,
        }))
      )
    ),
    columns: ["org", "scope", "tier", "minReputation", "ceiling", "gated"],
  },
  // --- Law ---
  crimes: {
    label: "Crimes",
    group: "Law",
    data: law.crimes,
    columns: ["name", "isFelony", "trigger", "felonyMerits", "lifetimeHours", "fineMultiplier"],
  },
  jurisdictions: {
    label: "Jurisdictions",
    group: "Law",
    data: law.jurisdictions.map((j: any) => ({
      name: j.name,
      baseFine: j.baseFine,
      isPrison: j.isPrison,
      crimeCount: j.crimes.length,
      impoundRules: j.impoundRules.map((r: any) => `${r.trigger}: ${r.fineUEC} UEC / ${r.timeSeconds}s`).join(", "),
    })),
    columns: ["name", "baseFine", "isPrison", "crimeCount", "impoundRules"],
  },
  // --- Factions ---
  factionsList: {
    label: "Factions",
    group: "Factions",
    data: factions.factions,
    columns: ["name", "type", "defaultReaction", "canArrest", "policesCrime", "allies", "enemies"],
  },
  // --- Ammo ---
  fpsAmmo: {
    label: "FPS Ammo",
    group: "Weapons",
    data: ammo.ammoTypes
      .filter((a: any) => a.category === "fps")
      .map((a: any) => ({
        name: a.name,
        speed: a.speed,
        lifetime: a.lifetime,
        physical: a.damage.physical,
        energy: a.damage.energy,
        distortion: a.damage.distortion,
        thermal: a.damage.thermal,
        biochemical: a.damage.biochemical,
        stun: a.damage.stun,
      })),
    columns: ["name", "speed", "lifetime", "physical", "energy", "distortion", "thermal", "biochemical", "stun"],
  },
  vehicleAmmo: {
    label: "Vehicle Ammo",
    group: "Weapons",
    data: ammo.ammoTypes
      .filter((a: any) => a.category === "vehicle")
      .map((a: any) => ({
        name: a.name,
        speed: a.speed,
        lifetime: a.lifetime,
        physical: a.damage.physical,
        energy: a.damage.energy,
        distortion: a.damage.distortion,
      })),
    columns: ["name", "speed", "lifetime", "physical", "energy", "distortion"],
  },
  // --- Mission Givers ---
  missionGiversList: {
    label: "Mission Givers",
    group: "Missions",
    data: missionGivers.missionGivers,
    columns: ["name", "description", "headquarters"],
  },
};

// --- Read version from the first data file ---
const versionMatch = fs
  .readFileSync(path.join(DATA, "mining.ts"), "utf-8")
  .match(/sc-alpha-[\d.\-\w]+/);
const version = versionMatch ? versionMatch[0] : "unknown";

// --- Generate HTML ---
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Magpie Data Viewer — ${version}</title>
<style>
  :root {
    --bg: #0f1117;
    --surface: #1a1d27;
    --surface2: #242736;
    --border: #2e3246;
    --text: #e1e4ed;
    --text-muted: #8b90a5;
    --accent: #5b8def;
    --accent-dim: #3d6bc7;
    --green: #4ade80;
    --yellow: #facc15;
    --red: #f87171;
    --orange: #fb923c;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: var(--bg);
    color: var(--text);
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  /* --- Sidebar --- */
  .sidebar {
    width: 240px;
    min-width: 240px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    overflow-y: auto;
    padding: 16px 0;
    display: flex;
    flex-direction: column;
  }
  .sidebar h1 {
    font-size: 14px;
    padding: 0 16px 12px;
    color: var(--accent);
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .sidebar .version {
    font-size: 11px;
    color: var(--text-muted);
    padding: 0 16px 16px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 8px;
  }
  .sidebar .group-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-muted);
    padding: 12px 16px 4px;
  }
  .sidebar button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border: none;
    background: none;
    color: var(--text);
    font-size: 13px;
    padding: 6px 16px;
    cursor: pointer;
    text-align: left;
  }
  .sidebar button:hover { background: var(--surface2); }
  .sidebar button.active {
    background: var(--accent-dim);
    color: #fff;
  }
  .sidebar button .count {
    font-size: 11px;
    color: var(--text-muted);
    background: var(--surface2);
    padding: 1px 6px;
    border-radius: 8px;
  }
  .sidebar button.active .count {
    background: rgba(255,255,255,0.15);
    color: #fff;
  }

  /* --- Main --- */
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .toolbar h2 {
    font-size: 16px;
    font-weight: 600;
  }
  .toolbar .stats {
    font-size: 12px;
    color: var(--text-muted);
  }
  .toolbar input {
    margin-left: auto;
    padding: 6px 12px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    font-size: 13px;
    width: 260px;
    outline: none;
  }
  .toolbar input:focus { border-color: var(--accent); }
  .toolbar input::placeholder { color: var(--text-muted); }

  /* --- Table --- */
  .table-wrap {
    flex: 1;
    overflow: auto;
    padding: 0;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  thead { position: sticky; top: 0; z-index: 2; }
  th {
    background: var(--surface2);
    padding: 8px 12px;
    text-align: left;
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-muted);
    border-bottom: 2px solid var(--border);
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
  }
  th:hover { color: var(--accent); }
  th .sort-arrow { margin-left: 4px; font-size: 10px; }
  td {
    padding: 6px 12px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
    max-width: 400px;
  }
  tr:hover td { background: var(--surface); }
  tr.hidden { display: none; }

  /* --- Cell types --- */
  .cell-num { text-align: right; font-variant-numeric: tabular-nums; }
  th.th-num { text-align: right; }
  .cell-null { color: var(--text-muted); font-style: italic; }
  .cell-bool-true { color: var(--green); text-align: center; }
  .cell-bool-false { color: var(--red); text-align: center; }
  .cell-obj {
    font-family: 'Cascadia Code', 'Consolas', monospace;
    font-size: 11px;
    color: var(--text-muted);
    max-width: 350px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
  .cell-obj:hover { white-space: normal; word-break: break-word; }
  .cell-list { font-size: 12px; line-height: 1.6; }
  .cell-list span { display: inline; }
  .cell-arr { line-height: 1.8; }
  .chip {
    background: var(--surface2);
    border: 1px solid var(--border);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    white-space: nowrap;
    display: inline-block;
    margin: 1px 2px;
  }
  .cell-desc {
    max-width: 350px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cell-desc:hover { white-space: normal; }

  /* --- Rarity colors --- */
  .rarity-common { color: #94a3b8; }
  .rarity-uncommon { color: var(--green); }
  .rarity-rare { color: var(--accent); }
  .rarity-epic { color: #c084fc; }
  .rarity-legendary { color: var(--orange); }
</style>
</head>
<body>

<nav class="sidebar">
  <h1>Magpie Data</h1>
  <div class="version">${version}</div>
  <div id="nav"></div>
</nav>

<main class="main">
  <div class="toolbar">
    <h2 id="title">Select a category</h2>
    <span class="stats" id="stats"></span>
    <input type="text" id="search" placeholder="Search rows..." />
  </div>
  <div class="table-wrap">
    <table>
      <thead id="thead"></thead>
      <tbody id="tbody"></tbody>
    </table>
  </div>
</main>

<script>
// --- Embedded data ---
const DATA = ${JSON.stringify(categories, null, 0)};

// --- State ---
let currentKey = null;
let sortCol = null;
let sortAsc = true;

// --- Build sidebar ---
const nav = document.getElementById("nav");
const groups = {};
for (const [key, cat] of Object.entries(DATA)) {
  if (!groups[cat.group]) groups[cat.group] = [];
  groups[cat.group].push(key);
}
for (const [group, keys] of Object.entries(groups)) {
  const label = document.createElement("div");
  label.className = "group-label";
  label.textContent = group;
  nav.appendChild(label);
  for (const key of keys) {
    const btn = document.createElement("button");
    btn.dataset.key = key;
    btn.innerHTML = DATA[key].label + '<span class="count">' + DATA[key].data.length + "</span>";
    btn.onclick = () => showCategory(key);
    nav.appendChild(btn);
  }
}

// --- Show category ---
function showCategory(key) {
  currentKey = key;
  sortCol = null;
  sortAsc = true;
  document.getElementById("search").value = "";

  // Update sidebar active state
  nav.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.key === key));

  const cat = DATA[key];
  document.getElementById("title").textContent = cat.label;

  renderTable(cat);
}

function renderTable(cat) {
  const data = cat.data;
  if (!data.length) {
    document.getElementById("thead").innerHTML = "";
    document.getElementById("tbody").innerHTML = "<tr><td>No data</td></tr>";
    document.getElementById("stats").textContent = "0 rows";
    return;
  }

  // Determine columns
  const cols = cat.columns || Object.keys(data[0]);

  // Sort data if needed
  let sorted = [...data];
  if (sortCol !== null) {
    sorted.sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (va == null) va = "";
      if (vb == null) vb = "";
      if (typeof va === "number" && typeof vb === "number") return sortAsc ? va - vb : vb - va;
      va = String(va).toLowerCase();
      vb = String(vb).toLowerCase();
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });
  }

  // Detect numeric columns by checking the first non-null value
  const numCols = new Set();
  for (const c of cols) {
    const sample = data.find((r) => r[c] != null && r[c] !== "");
    if (sample && typeof sample[c] === "number") numCols.add(c);
  }

  // Build thead
  const thead = document.getElementById("thead");
  thead.innerHTML =
    "<tr>" +
    cols
      .map((c) => {
        const arrow = sortCol === c ? (sortAsc ? " ▲" : " ▼") : "";
        const cls = numCols.has(c) ? ' class="th-num"' : "";
        return '<th data-col="' + c + '"' + cls + '>' + c + '<span class="sort-arrow">' + arrow + "</span></th>";
      })
      .join("") +
    "</tr>";

  // Column click handlers
  thead.querySelectorAll("th").forEach((th) => {
    th.onclick = () => {
      const col = th.dataset.col;
      if (sortCol === col) {
        sortAsc = !sortAsc;
      } else {
        sortCol = col;
        sortAsc = true;
      }
      renderTable(DATA[currentKey]);
    };
  });

  // Build tbody
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = sorted
    .map(
      (row) =>
        "<tr>" +
        cols.map((c) => renderCell(row[c], c)).join("") +
        "</tr>"
    )
    .join("");

  updateStats();
}

function renderCell(val, colName) {
  if (val === null || val === undefined || val === "") {
    return '<td class="cell-null">—</td>';
  }
  if (typeof val === "boolean") {
    return '<td class="cell-bool-' + val + '">' + (val ? "✓" : "✗") + "</td>";
  }
  if (typeof val === "number") {
    const formatted = Number.isInteger(val) ? val.toLocaleString() : val;
    return '<td class="cell-num">' + formatted + "</td>";
  }
  if (colName === "rarity") {
    return '<td class="rarity-' + val + '">' + val + "</td>";
  }
  if (colName === "description" || colName === "notes" || colName === "tips" || colName === "requirement") {
    return '<td class="cell-desc" title="' + esc(String(val)) + '">' + esc(String(val)) + "</td>";
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return '<td class="cell-null">—</td>';
    // Array of objects — render as readable list (e.g. "3x Wikelo Favor")
    if (typeof val[0] === "object") {
      const items = val.map((v) => {
        if (v.item && v.quantity !== undefined) return esc(v.quantity + "x " + v.item);
        if (v.item) return esc(v.item);
        return esc(JSON.stringify(v));
      });
      return '<td class="cell-list">' + items.join(", ") + "</td>";
    }
    // Array of strings — comma-separated chips
    return (
      '<td class="cell-arr">' +
      val.map((v) => '<span class="chip">' + esc(String(v)) + "</span>").join(" ") +
      "</td>"
    );
  }
  if (typeof val === "object") {
    // Objects with known shapes — render readably
    if (val.item && val.quantity !== undefined) {
      return "<td>" + esc(val.quantity + "x " + val.item) + "</td>";
    }
    if (val.min !== undefined && val.max !== undefined) {
      return "<td>" + val.min + " – " + val.max + "</td>";
    }
    if (val.scm !== undefined && val.max !== undefined) {
      return "<td>" + val.scm + " / " + val.max + "</td>";
    }
    const json = JSON.stringify(val);
    return '<td class="cell-obj" title="' + esc(JSON.stringify(val, null, 2)) + '">' + esc(json) + "</td>";
  }
  return "<td>" + esc(String(val)) + "</td>";
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// --- Search ---
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();
  const rows = document.querySelectorAll("#tbody tr");
  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.classList.toggle("hidden", q && !text.includes(q));
  });
  updateStats();
});

function updateStats() {
  const total = document.querySelectorAll("#tbody tr").length;
  const visible = document.querySelectorAll("#tbody tr:not(.hidden)").length;
  const statsEl = document.getElementById("stats");
  if (total === visible) {
    statsEl.textContent = total + " rows";
  } else {
    statsEl.textContent = visible + " / " + total + " rows";
  }
}

// --- Keyboard shortcut ---
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
  }
  if (e.key === "Escape") {
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("input"));
    searchInput.blur();
  }
});

// --- Auto-select first category ---
const firstKey = Object.keys(DATA)[0];
if (firstKey) showCategory(firstKey);
</script>

</body>
</html>`;

// --- Write HTML ---
const outPath = path.resolve(__dirname, "..", "data", "viewer.html");
fs.writeFileSync(outPath, html);

// Count totals
let totalItems = 0;
for (const cat of Object.values(categories)) {
  totalItems += cat.data.length;
}

console.log(`Data viewer generated: ${outPath}`);
console.log(`  ${Object.keys(categories).length} categories, ${totalItems} total items`);
console.log(`  Version: ${version}`);
console.log(`\nOpen in browser to view.`);
