"use client";

import { useState, useMemo, useCallback } from "react";
import { blueprints as staticBlueprints, type Blueprint } from "@/data/crafting";
import { miningLocations as staticLocations } from "@/data/mining-locations";
import shared from "../tools.module.css";
import cs from "./crafting.module.css";

type ViewMode = "individual" | "sets";
type TypeFilter = "all" | "weapon" | "armor" | "ammo";

const TYPE_BADGES: Record<string, string> = {
  weapon: cs.badgeWeapon,
  armor: cs.badgeArmor,
  ammo: cs.badgeAmmo,
};

const DANGER_CLASS: Record<string, string> = {
  low: cs.dangerLow,
  medium: cs.dangerMedium,
  high: cs.dangerHigh,
};

const MAX_LOCATIONS_SHOWN = 3;

function prettifySource(raw: string): string {
  const MAP: Record<string, string> = {
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
  return MAP[raw] || raw.replace(/_/g, " ");
}

// Group armor by set name (strip piece suffix like "Arms", "Core", "Helmet", "Legs", "Backpack")
function getSetName(name: string): string {
  return name
    .replace(/\s+(Arms|Core|Helmet|Legs|Backpack|Undersuit)(\s|$)/, "$2")
    .trim();
}

interface ArmorSet {
  setName: string;
  pieces: Blueprint[];
  subCategory: string;
  craftTime: string;
  obtainedFrom?: string[];
  allResources: { slot: string; resource: string; quantitySCU: number }[];
}

export default function CraftingPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [subFilter, setSubFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("sets");
  const [sourceOnly, setSourceOnly] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [locationModal, setLocationModal] = useState<{ resource: string; locations: typeof staticLocations } | null>(null);

  // Get locations for a resource
  const locationsForResource = useCallback((resource: string) => {
    return staticLocations.filter(
      (loc) => loc.ores.includes(resource) || loc.fpsOres.includes(resource)
    );
  }, []);

  // Filter blueprints
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return staticBlueprints.filter((bp) => {
      if (typeFilter !== "all" && bp.type !== typeFilter) return false;
      if (subFilter !== "all" && bp.subCategory !== subFilter) return false;
      if (sourceOnly && (!bp.obtainedFrom || bp.obtainedFrom.length === 0)) return false;
      if (q) {
        const matchName = bp.name.toLowerCase().includes(q);
        const matchResource = bp.aspects.some((a) => a.resource.toLowerCase().includes(q));
        const matchSource = bp.obtainedFrom?.some((s) => s.toLowerCase().includes(q));
        const matchSub = bp.subCategory.toLowerCase().includes(q);
        if (!matchName && !matchResource && !matchSource && !matchSub) return false;
      }
      return true;
    });
  }, [search, typeFilter, subFilter, sourceOnly]);

  // Get unique subcategories for current type filter
  const subCategories = useMemo(() => {
    const subs = new Set<string>();
    const pool = typeFilter === "all" ? staticBlueprints : staticBlueprints.filter((bp) => bp.type === typeFilter);
    pool.forEach((bp) => subs.add(bp.subCategory));
    return [...subs].sort();
  }, [typeFilter]);

  // Build armor sets
  const armorSets = useMemo(() => {
    if (viewMode !== "sets") return [];
    const armorBPs = filtered.filter((bp) => bp.type === "armor");
    const groups = new Map<string, Blueprint[]>();
    for (const bp of armorBPs) {
      const setName = getSetName(bp.name);
      const existing = groups.get(setName) || [];
      existing.push(bp);
      groups.set(setName, existing);
    }
    return [...groups.entries()].map(([setName, pieces]): ArmorSet => {
      const allResources: ArmorSet["allResources"] = [];
      const seenSlots = new Map<string, { resource: string; quantitySCU: number }>();
      for (const bp of pieces) {
        for (const aspect of bp.aspects) {
          const key = `${aspect.slot}:${aspect.resource}`;
          const existing = seenSlots.get(key);
          if (existing) {
            existing.quantitySCU += aspect.quantitySCU;
          } else {
            const entry = { slot: aspect.slot, resource: aspect.resource, quantitySCU: aspect.quantitySCU };
            seenSlots.set(key, entry);
            allResources.push(entry);
          }
        }
      }
      return {
        setName,
        pieces,
        subCategory: pieces[0].subCategory,
        craftTime: pieces[0].craftTime,
        obtainedFrom: pieces[0].obtainedFrom,
        allResources,
      };
    }).sort((a, b) => a.setName.localeCompare(b.setName));
  }, [filtered, viewMode]);

  // Non-armor or individual view
  const nonArmorBPs = useMemo(
    () => filtered.filter((bp) => bp.type !== "armor"),
    [filtered]
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderLocations = (resource: string) => {
    const locs = locationsForResource(resource);
    if (locs.length === 0) return <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>—</span>;
    const shown = locs.slice(0, MAX_LOCATIONS_SHOWN);
    const remaining = locs.length - MAX_LOCATIONS_SHOWN;
    return (
      <>
        {shown.map((loc) => (
          <span key={loc.name} className={cs.locationChip}>
            <span className={DANGER_CLASS[loc.danger]}>{loc.name}</span>
          </span>
        ))}
        {remaining > 0 && (
          <button
            className={cs.showMore}
            onClick={(e) => { e.stopPropagation(); setLocationModal({ resource, locations: locs }); }}
          >
            +{remaining} more
          </button>
        )}
      </>
    );
  };

  const renderMaterialsTable = (aspects: Blueprint["aspects"], itemCosts?: Blueprint["itemCosts"]) => (
    <table className={cs.materialsTable}>
      <thead>
        <tr>
          <th>Slot</th>
          <th>Resource</th>
          <th>SCU</th>
          <th>Where to Mine</th>
        </tr>
      </thead>
      <tbody>
        {aspects.map((a, i) => (
          <tr key={i}>
            <td>{a.slot}</td>
            <td style={{ fontWeight: 500 }}>{a.resource}</td>
            <td>{a.quantitySCU}</td>
            <td>{renderLocations(a.resource)}</td>
          </tr>
        ))}
        {itemCosts?.map((ic, i) => (
          <tr key={`ic-${i}`}>
            <td>ITEM</td>
            <td style={{ fontWeight: 500 }}>{ic.item}</td>
            <td>{ic.quantity}x</td>
            <td />
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderModifiers = (aspects: Blueprint["aspects"]) => {
    const allMods = aspects.flatMap((a) =>
      a.modifiers.map((m) => ({ slot: a.slot, ...m }))
    );
    if (allMods.length === 0) return null;
    return (
      <div className={cs.detail}>
        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.35rem" }}>
          Quality Modifiers
        </div>
        {allMods.map((m, i) => (
          <div key={i} className={cs.modifierRow}>
            <span className={cs.modProp}>{m.slot}: {m.property}</span>
            <span className={cs.modRange}>{m.range[0].toFixed(2)}x — {m.range[1].toFixed(2)}x</span>
          </div>
        ))}
      </div>
    );
  };

  const renderBlueprintCard = (bp: Blueprint) => {
    const expanded = expandedIds.has(bp.id);
    return (
      <div key={bp.id} className={cs.card}>
        <div className={cs.cardHeader} onClick={() => toggleExpand(bp.id)}>
          <div>
            <div className={cs.cardName}>{bp.name}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.1rem" }}>
              {bp.subCategory}
            </div>
          </div>
          <div className={cs.cardMeta}>
            <span className={cs.craftTime}>{bp.craftTime}</span>
            <span className={`${cs.badge} ${TYPE_BADGES[bp.type]}`}>{bp.type}</span>
          </div>
        </div>

        {renderMaterialsTable(bp.aspects, bp.itemCosts)}

        {bp.obtainedFrom && bp.obtainedFrom.length > 0 && (
          <div className={cs.source}>
            <span className={cs.sourceLabel}>Blueprint from:</span>
            {bp.obtainedFrom.map(prettifySource).join(", ")}
          </div>
        )}

        {expanded && renderModifiers(bp.aspects)}
      </div>
    );
  };

  const renderSetCard = (set: ArmorSet) => {
    const expanded = expandedIds.has(`set:${set.setName}`);
    return (
      <div key={set.setName}>
        <div
          className={cs.setHeader}
          onClick={() => toggleExpand(`set:${set.setName}`)}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div className={cs.setName}>{set.setName}</div>
              <div className={cs.setPieces}>
                {set.pieces.length} pieces: {set.pieces.map((p) => {
                  const piece = p.name.replace(set.setName, "").trim() || p.name;
                  return piece;
                }).join(", ")}
              </div>
            </div>
            <div className={cs.cardMeta}>
              <span className={cs.craftTime}>{set.craftTime} each</span>
              <span className={`${cs.badge} ${cs.badgeArmor}`}>{set.subCategory}</span>
            </div>
          </div>
        </div>

        {expanded && (
          <div className={cs.setExpanded}>
            <table className={cs.materialsTable}>
              <thead>
                <tr>
                  <th>Slot</th>
                  <th>Resource</th>
                  <th>Total SCU</th>
                  <th>Where to Mine</th>
                </tr>
              </thead>
              <tbody>
                {set.allResources.map((r, i) => (
                  <tr key={i}>
                    <td>{r.slot}</td>
                    <td style={{ fontWeight: 500 }}>{r.resource}</td>
                    <td>{r.quantitySCU.toFixed(2)}</td>
                    <td>{renderLocations(r.resource)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {set.obtainedFrom && set.obtainedFrom.length > 0 && (
              <div className={cs.source}>
                <span className={cs.sourceLabel}>Blueprint from:</span>
                {set.obtainedFrom.map(prettifySource).join(", ")}
              </div>
            )}

            <div style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.35rem" }}>
              Individual Pieces
            </div>
            {set.pieces.map((bp) => (
              <div key={bp.id} style={{ fontSize: "0.85rem", padding: "0.2rem 0", color: "var(--text-primary)" }}>
                {bp.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const totalResults = viewMode === "sets"
    ? armorSets.length + nonArmorBPs.length
    : filtered.length;

  return (
    <div className={shared.page}>
      <h1 className={shared.title}>Crafting Blueprints</h1>
      <p className={shared.subtitle}>
        Search {staticBlueprints.length} blueprints. See materials, mining locations, and blueprint sources.
      </p>

      {/* Filters */}
      <div className={cs.filters}>
        <input
          type="text"
          placeholder="Search by name, resource, source..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cs.searchInput}
        />
        {(["all", "weapon", "armor", "ammo"] as TypeFilter[]).map((t) => (
          <button
            key={t}
            className={typeFilter === t ? cs.filterPillActive : cs.filterPill}
            onClick={() => { setTypeFilter(t); setSubFilter("all"); }}
          >
            {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
            {t !== "all" && ` (${staticBlueprints.filter((bp) => bp.type === t).length})`}
          </button>
        ))}
      </div>

      <div className={cs.filters}>
        {subCategories.length > 1 && (
          <select
            value={subFilter}
            onChange={(e) => setSubFilter(e.target.value)}
            className={cs.searchInput}
            style={{ flex: "none", width: "180px" }}
          >
            <option value="all">All subcategories</option>
            {subCategories.map((sc) => (
              <option key={sc} value={sc}>{sc}</option>
            ))}
          </select>
        )}
        <label className={cs.filterPill} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <input
            type="checkbox"
            checked={sourceOnly}
            onChange={(e) => setSourceOnly(e.target.checked)}
            style={{ accentColor: "var(--accent)" }}
          />
          Has blueprint source
        </label>
        {(typeFilter === "all" || typeFilter === "armor") && (
          <div className={cs.viewToggle}>
            <button
              className={viewMode === "sets" ? cs.viewBtnActive : cs.viewBtn}
              onClick={() => setViewMode("sets")}
            >
              By Set
            </button>
            <button
              className={viewMode === "individual" ? cs.viewBtnActive : cs.viewBtn}
              onClick={() => setViewMode("individual")}
            >
              Individual
            </button>
          </div>
        )}
      </div>

      <div className={cs.resultCount}>
        {totalResults} result{totalResults !== 1 ? "s" : ""}
      </div>

      {/* Results */}
      {viewMode === "sets" ? (
        <>
          {nonArmorBPs.map(renderBlueprintCard)}
          {armorSets.length > 0 && nonArmorBPs.length > 0 && (
            <div style={{ borderTop: "1px solid var(--border)", margin: "1rem 0", paddingTop: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 600 }}>
                Armor Sets ({armorSets.length})
              </span>
            </div>
          )}
          {armorSets.map(renderSetCard)}
        </>
      ) : (
        filtered.map(renderBlueprintCard)
      )}

      {totalResults === 0 && (
        <div className={shared.emptyMessage}>
          No blueprints match your search.
        </div>
      )}

      {/* Location Modal */}
      {locationModal && (
        <div className={cs.modalOverlay} onClick={() => setLocationModal(null)}>
          <div className={cs.modal} onClick={(e) => e.stopPropagation()}>
            <button className={cs.modalClose} onClick={() => setLocationModal(null)}>&times;</button>
            <div className={cs.modalTitle}>Mining Locations for {locationModal.resource}</div>
            {locationModal.locations.map((loc) => (
              <div key={loc.name} className={cs.modalLocationRow}>
                <div>
                  <span style={{ fontWeight: 500 }}>{loc.name}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginLeft: "0.5rem" }}>
                    {loc.type.replace("_", " ")} — {loc.parentBody}
                  </span>
                </div>
                <span className={DANGER_CLASS[loc.danger]} style={{ fontSize: "0.8rem" }}>
                  {loc.danger}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
