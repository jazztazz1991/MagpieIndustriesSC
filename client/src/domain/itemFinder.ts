/**
 * Cross-references all data sources to answer "where do I find X?"
 */
import { blueprints } from "@/data/crafting";
import { lootTables } from "@/data/loot";
import { contracts } from "@/data/wikelo";
import { ores } from "@/data/mining";
import { miningLocations } from "@/data/mining-locations";

const SOURCE_NAMES: Record<string, string> = {
  ASD2A: "ASD Delving Phase 2A",
  ASD2B: "ASD Delving Phase 2B",
  ASD2C: "ASD Delving Phase 2C",
  ASD2D: "ASD Delving Phase 2D",
  ASD3: "ASD Delving Phase 3",
  BHG_ASDFacilityDelving_EngineeringWing_EliminateSpecific: "BHG: ASD Facility — Engineering Wing",
  BHG_ASDFacilityDelving_ResearchWing_EliminateSpecific: "BHG: ASD Facility — Research Wing",
  BitZeros_BlackBoxRecovery: "Bit Zero's: Black Box Recovery",
  BitZeros_RecoverItem_PyroNyx: "Bit Zero's: Item Recovery (Pyro/Nyx)",
  BitZeros_RecoverItem_Stanton: "Bit Zero's: Item Recovery (Stanton)",
  BountyHuntersGuild_PAF_EliminateSpecific: "Bounty Hunters Guild: PAF Elimination",
  CFP_ChainElim_1and2: "Citizens for Prosperity: Chain Elimination 1-2",
  CFP_ChainElim_3: "Citizens for Prosperity: Chain Elimination 3",
  CFP_Outpost_RegionAB: "Citizens for Prosperity: Outpost (Region A/B)",
  CFP_Outpost_RegionC: "Citizens for Prosperity: Outpost (Region C)",
  CFP_Outpost_RegionD: "Citizens for Prosperity: Outpost (Region D)",
  CitizensForProsperityDestroyItems_AB: "Citizens for Prosperity: Destroy Items (A/B)",
  CitizensForProsperityDestroyItems_CD: "Citizens for Prosperity: Destroy Items (C/D)",
  CitizensForProsperityRecoverCargo_Pyro: "Citizens for Prosperity: Recover Cargo (Pyro)",
  FoxwellEnforcement_Ambush: "Foxwell Enforcement: Ambush",
  FoxwellEnforcement_EscortShips: "Foxwell Enforcement: Escort Ships",
  FoxwellEnforcement_Generator: "Foxwell Enforcement: Generator",
  FoxwellEnforcement_Patrol: "Foxwell Enforcement: Patrol",
  Foxwell_DefendEntitiesAndEscort: "Foxwell: Defend & Escort",
  HeadHunters_MercenaryFPS_EliminateALL_RegionAB: "Headhunters: FPS Eliminate All (Region A/B)",
  HeadHunters_MercenaryFPS_EliminateALL_RegionCD: "Headhunters: FPS Eliminate All (Region C/D)",
  HeadHunters_MercenaryFPS_EliminateBoss: "Headhunters: FPS Eliminate Boss",
  HeadHunters_MercenaryFPS_EliminateSpecific_RegionAB: "Headhunters: FPS Elimination (Region A/B)",
  HeadHunters_MercenaryFPS_EliminateSpecific_RegionCD: "Headhunters: FPS Elimination (Region C/D)",
  IDS_RecoverEncryptedData: "IDS: Recover Encrypted Data",
  InterSec_DefendShip: "InterSec: Defend Ship",
  InterSec_Patrol: "InterSec: Patrol",
  InterSec_ResourceGathering: "InterSec: Resource Gathering",
  NorthRockFPSKill_EliminateBoss: "Northrock: FPS Eliminate Boss",
  RDC_Boss: "Rough & Ready: Boss Bounty",
  RDC_Exclusive: "Rough & Ready: Exclusive",
  RDC_Generic: "Rough & Ready: Bounty",
  Rayari_RecoverItem_HathorLoot: "Rayari: Hathor Loot Recovery",
  Rayari_RecoverItem_Irradiated: "Rayari: Irradiated Item Recovery",
  Shubin_ResourceGathering_FPSMining_Pyro: "Shubin: FPS Mining (Pyro)",
  Shubin_ResourceGathering_FPSMining_Stanton: "Shubin: FPS Mining (Stanton)",
  Shubin_ResourceGathering_ShipMining_PyroNyx: "Shubin: Ship Mining (Pyro/Nyx)",
  Shubin_ResourceGathering_ShipMining_Stanton: "Shubin: Ship Mining (Stanton)",
  VaughnGenerator_EliminateBoss: "Vaughn: Eliminate Boss",
  VaughnGenerator_EliminateSpecific: "Vaughn: Elimination",
};

export function prettifySource(raw: string): string {
  return SOURCE_NAMES[raw] || raw.replace(/_/g, " ");
}

export interface ItemSource {
  type: "craftable" | "loot" | "wikelo_reward" | "wikelo_requirement" | "ore" | "blueprint_drop";
  name: string;
  detail: string;
  subDetail?: string;
  link?: string;
}

const MAX_RESULTS = 50;

export function findItem(query: string): ItemSource[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  const results: ItemSource[] = [];

  // 1. Craftable items (blueprints)
  for (const bp of blueprints) {
    if (results.length >= MAX_RESULTS) break;
    if (!bp.name.toLowerCase().includes(q)) continue;

    const materials = bp.aspects.map((a) => `${a.quantitySCU} SCU ${a.resource}`).join(", ");
    const source = bp.obtainedFrom?.length
      ? `Blueprint from: ${bp.obtainedFrom.map(prettifySource).join(", ")}`
      : "Blueprint source unknown";

    results.push({
      type: "craftable",
      name: bp.name,
      detail: `Craft time: ${bp.craftTime}. Materials: ${materials}`,
      subDetail: source,
      link: "/tools/crafting",
    });
  }

  // 2. Loot drops
  for (const table of lootTables) {
    if (results.length >= MAX_RESULTS) break;
    // Search table name and entry names
    const tableMatch = table.name.toLowerCase().includes(q);
    const matchingEntries = table.entries.filter((e) => e.name.toLowerCase().includes(q));

    if (tableMatch || matchingEntries.length > 0) {
      const totalWeight = table.entries.reduce((s, e) => s + e.weight, 0);
      const entryInfo = (tableMatch ? table.entries : matchingEntries)
        .slice(0, 5)
        .map((e) => {
          const pct = totalWeight > 0 ? Math.round((e.weight / totalWeight) * 100) : 0;
          return `${e.name} (${pct}%)`;
        })
        .join(", ");

      results.push({
        type: "loot",
        name: table.name,
        detail: `${table.locationType} — ${table.rarity}. ${table.entries.length} items`,
        subDetail: entryInfo,
      });
    }
  }

  // 3. Wikelo contract rewards
  for (const contract of contracts) {
    if (results.length >= MAX_RESULTS) break;
    const rewardMatch = contract.rewards.some((r) => r.toLowerCase().includes(q));
    const nameMatch = contract.name.toLowerCase().includes(q);

    if (rewardMatch || nameMatch) {
      results.push({
        type: "wikelo_reward",
        name: contract.name,
        detail: `Tier: ${contract.tier}. Rewards: ${contract.rewards.join(", ")}`,
        subDetail: `Requires: ${contract.requirements.map((r) => `${r.quantity}x ${r.item}`).join(", ")}`,
        link: "/tools/wikelo-tracker",
      });
    }
  }

  // 4. Wikelo contract requirements (things you need to bring)
  const reqContracts = new Map<string, string[]>();
  for (const contract of contracts) {
    for (const req of contract.requirements) {
      if (req.item.toLowerCase().includes(q)) {
        const existing = reqContracts.get(req.item) || [];
        existing.push(`${contract.name} (${req.quantity}x)`);
        reqContracts.set(req.item, existing);
      }
    }
  }
  for (const [item, contractNames] of reqContracts) {
    if (results.length >= MAX_RESULTS) break;
    results.push({
      type: "wikelo_requirement",
      name: item,
      detail: `Needed for ${contractNames.length} contract${contractNames.length > 1 ? "s" : ""}`,
      subDetail: contractNames.slice(0, 5).join(", ") + (contractNames.length > 5 ? ` +${contractNames.length - 5} more` : ""),
      link: "/guides/wikelo",
    });
  }

  // 5. Mineable ores
  for (const ore of ores) {
    if (results.length >= MAX_RESULTS) break;
    if (!ore.name.toLowerCase().includes(q)) continue;

    const shipLocs = miningLocations
      .filter((loc) => loc.ores.includes(ore.name))
      .slice(0, 5)
      .map((loc) => loc.name);
    const fpsLocs = miningLocations
      .filter((loc) => loc.fpsOres.includes(ore.name))
      .slice(0, 5)
      .map((loc) => loc.name);

    const locParts: string[] = [];
    if (shipLocs.length > 0) locParts.push(`Ship: ${shipLocs.join(", ")}`);
    if (fpsLocs.length > 0) locParts.push(`FPS: ${fpsLocs.join(", ")}`);

    results.push({
      type: "ore",
      name: ore.name,
      detail: `${ore.valuePerSCU.toLocaleString()} aUEC/SCU — ${ore.rarity} ${ore.type}`,
      subDetail: locParts.length > 0 ? locParts.join(" | ") : "No known mining locations",
      link: "/tools/mining-locations",
    });
  }

  // 6. Blueprint drops (search by mission source name)
  const missionBlueprints = new Map<string, string[]>();
  for (const bp of blueprints) {
    if (!bp.obtainedFrom) continue;
    for (const source of bp.obtainedFrom) {
      if (source.toLowerCase().includes(q)) {
        const existing = missionBlueprints.get(source) || [];
        existing.push(bp.name);
        missionBlueprints.set(source, existing);
      }
    }
  }
  for (const [source, bpNames] of missionBlueprints) {
    if (results.length >= MAX_RESULTS) break;
    results.push({
      type: "blueprint_drop",
      name: source,
      detail: `Drops ${bpNames.length} blueprint${bpNames.length > 1 ? "s" : ""}`,
      subDetail: bpNames.slice(0, 5).join(", ") + (bpNames.length > 5 ? ` +${bpNames.length - 5} more` : ""),
      link: "/tools/crafting",
    });
  }

  return results;
}
