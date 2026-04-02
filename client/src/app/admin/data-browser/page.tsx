"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { components } from "@/data/loadout";
import type { ShipComponent, ComponentType } from "@/data/loadout";
import { ships } from "@/data/ships";
import type { Ship } from "@/data/ships";
import { refineryMethods, refineryStations } from "@/data/refinery";
import type { RefineryMethod, RefineryStation } from "@/data/refinery";
import { ores, rockSignatures } from "@/data/mining";
import type { Ore, RockClass } from "@/data/mining";
import { miningLasers } from "@/data/mining-lasers";
import type { MiningLaser } from "@/data/mining-lasers";
import { activeModules, passiveModules, miningGadgets } from "@/data/mining-gadgets";
import type { MiningModule, MiningGadget } from "@/data/mining-gadgets";
import { miningShips } from "@/data/mining-ships";
import type { MiningShip } from "@/data/mining-ships";
import { miningLocations } from "@/data/mining-locations";
import type { MiningLocation } from "@/data/mining-locations";
import { contracts as wikeloContracts, gatheringItems, emporiums, favorConversions, reputationTiers } from "@/data/wikelo";
import type { WikeloContract, GatheringItem, Emporium, FavorConversion } from "@/data/wikelo";
import { useOverrides, invalidateOverrideCache } from "@/hooks/useOverrides";
import type { DataOverride } from "@/hooks/useOverrides";
import styles from "../admin.module.css";

type SubTab = "weapons" | "shields" | "quantum_drives" | "power_plants" | "coolers" | "ships" | "ores" | "refinery_methods" | "refinery_stations" | "mining_lasers" | "mining_modules" | "mining_gadgets" | "mining_ships" | "mining_locations" | "rock_signatures" | "wikelo_contracts" | "wikelo_items" | "wikelo_emporiums" | "wikelo_favors" | "wikelo_rep";

const SUB_TAB_LABELS: Record<SubTab, string> = {
  weapons: "Weapons",
  shields: "Shields",
  quantum_drives: "Quantum Drives",
  power_plants: "Power Plants",
  coolers: "Coolers",
  ships: "Ships",
  ores: "Ores",
  mining_lasers: "Mining Lasers",
  mining_modules: "Mining Modules",
  mining_gadgets: "Mining Gadgets",
  mining_ships: "Mining Ships",
  mining_locations: "Mining Locations",
  rock_signatures: "Rock Signatures",
  refinery_methods: "Refinery Methods",
  refinery_stations: "Refinery Stations",
  wikelo_contracts: "Wikelo Contracts",
  wikelo_items: "Wikelo Items",
  wikelo_emporiums: "Emporiums",
  wikelo_favors: "Favor Conversions",
  wikelo_rep: "Reputation Tiers",
};

const COMPONENT_TYPE_MAP: Record<string, ComponentType> = {
  weapons: "weapon",
  shields: "shield",
  quantum_drives: "quantum_drive",
  power_plants: "power_plant",
  coolers: "cooler",
};

function componentKey(c: ShipComponent): string {
  return `${c.name}::${c.type}::${c.size}::${c.manufacturer}`;
}

function componentCategory(c: ShipComponent): string {
  return c.type;
}

function shipKey(s: Ship): string {
  return s.name;
}

function oreKey(o: Ore): string {
  return o.name;
}

function refineryMethodKey(m: RefineryMethod): string {
  return m.name;
}

function refineryStationKey(s: RefineryStation): string {
  return s.name;
}

// Stat labels for each component type
const COMPONENT_STAT_HEADERS: Record<ComponentType, string[]> = {
  weapon: ["dps", "damage", "fireRate", "speed", "powerDraw"],
  shield: ["shieldHP", "regenRate", "powerDraw"],
  quantum_drive: ["quantumSpeed", "spoolTime", "fuelRate", "powerDraw"],
  power_plant: ["powerOutput"],
  cooler: ["coolingRate", "powerDraw"],
};

interface EditState {
  category: string;
  itemKey: string;
  displayName: string;
  fields: { key: string; value: number | string; original: number | string }[];
}

export default function DataBrowserPage() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<SubTab>("weapons");
  const [search, setSearch] = useState("");
  const [editState, setEditState] = useState<EditState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { overrides, loaded, reload } = useOverrides();

  const overrideMap = useMemo(() => {
    const map = new Map<string, DataOverride>();
    for (const o of overrides) {
      map.set(`${o.category}::${o.itemKey}`, o);
    }
    return map;
  }, [overrides]);

  function getOverride(category: string, itemKey: string): DataOverride | undefined {
    return overrideMap.get(`${category}::${itemKey}`);
  }

  function applyOverride<T>(category: string, item: T, key: string): T {
    const o = getOverride(category, key);
    if (!o) return item;
    const obj = item as Record<string, unknown>;
    if (obj.stats && typeof obj.stats === "object") {
      return { ...item, stats: { ...(obj.stats as Record<string, number>), ...o.overrides } };
    }
    return { ...item, ...o.overrides } as T;
  }

  const saveOverride = useCallback(async (category: string, itemKey: string, overrideFields: Record<string, number | string>) => {
    setSubmitting(true);
    setError(null);
    const res = await apiFetch("/api/game-data/overrides", {
      method: "PUT",
      body: JSON.stringify({ category, itemKey, overrides: overrideFields }),
    });
    if (res.success) {
      invalidateOverrideCache();
      reload();
      setEditState(null);
    } else {
      setError(typeof res.error === "string" ? res.error : "Save failed");
    }
    setSubmitting(false);
  }, [reload]);

  const deleteOverride = useCallback(async (id: string) => {
    const res = await apiFetch(`/api/game-data/overrides/${id}`, { method: "DELETE" });
    if (res.success) {
      invalidateOverrideCache();
      reload();
    }
  }, [reload]);

  function openEdit(category: string, itemKey: string, displayName: string, editableFields: { key: string; value: number | string }[]) {
    setEditState({
      category,
      itemKey,
      displayName,
      fields: editableFields.map((f) => ({ ...f, original: f.value })),
    });
    setError(null);
  }

  function handleEditSave() {
    if (!editState) return;
    const changed: Record<string, number | string> = {};
    for (const f of editState.fields) {
      if (f.value !== f.original) {
        changed[f.key] = typeof f.original === "number" ? Number(f.value) : f.value;
      }
    }
    if (Object.keys(changed).length === 0) {
      setEditState(null);
      return;
    }
    saveOverride(editState.category, editState.itemKey, changed);
  }

  if (authLoading) return <div className={styles.loading}>Loading...</div>;
  if (!user?.isAdmin) return <div className={styles.denied}>Admin access required.</div>;

  const lowerSearch = search.toLowerCase();

  return (
    <div className={styles.adminPage}>
      <Link href="/admin" className={styles.backLink}>Back to Admin</Link>
      <h1 className={styles.title}>Data Browser</h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1rem" }}>
        Browse auto-extracted game data. Edits are saved as overrides and applied instantly.
        {!loaded && " Loading overrides..."}
      </p>

      <div className={styles.subTabs}>
        {(Object.keys(SUB_TAB_LABELS) as SubTab[]).map((t) => (
          <button
            key={t}
            className={`${styles.subTab} ${tab === t ? styles.subTabActive : ""}`}
            onClick={() => { setTab(t); setSearch(""); }}
          >
            {SUB_TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <div className={styles.searchBar}>
        <input
          className={styles.searchInput}
          placeholder="Filter by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Component tabs */}
      {COMPONENT_TYPE_MAP[tab] && (
        <ComponentTable
          items={components.filter((c) => c.type === COMPONENT_TYPE_MAP[tab])}
          statHeaders={COMPONENT_STAT_HEADERS[COMPONENT_TYPE_MAP[tab]]}
          search={lowerSearch}
          getOverride={getOverride}
          applyOverride={applyOverride}
          openEdit={openEdit}
          deleteOverride={deleteOverride}
        />
      )}

      {tab === "ships" && (
        <ShipTable
          items={ships}
          search={lowerSearch}
          getOverride={getOverride}
          applyOverride={applyOverride}
          openEdit={openEdit}
          deleteOverride={deleteOverride}
        />
      )}

      {tab === "ores" && (
        <OreTable
          items={ores}
          search={lowerSearch}
          getOverride={getOverride}
          applyOverride={applyOverride}
          openEdit={openEdit}
          deleteOverride={deleteOverride}
        />
      )}

      {tab === "refinery_methods" && (
        <RefineryMethodTable
          items={refineryMethods}
          search={lowerSearch}
          getOverride={getOverride}
          applyOverride={applyOverride}
          openEdit={openEdit}
          deleteOverride={deleteOverride}
        />
      )}

      {tab === "refinery_stations" && (
        <RefineryStationTable
          items={refineryStations}
          search={lowerSearch}
          getOverride={getOverride}
          applyOverride={applyOverride}
          openEdit={openEdit}
          deleteOverride={deleteOverride}
        />
      )}

      {tab === "mining_lasers" && (
        <MiningLaserTable
          items={miningLasers}
          search={lowerSearch}
          getOverride={getOverride}
          applyOverride={applyOverride}
          openEdit={openEdit}
          deleteOverride={deleteOverride}
        />
      )}

      {tab === "mining_modules" && (
        <MiningModuleTable
          items={[...activeModules, ...passiveModules]}
          search={lowerSearch}
          getOverride={getOverride}
          applyOverride={applyOverride}
          openEdit={openEdit}
          deleteOverride={deleteOverride}
        />
      )}

      {tab === "mining_gadgets" && (
        <MiningGadgetTable
          items={miningGadgets}
          search={lowerSearch}
          getOverride={getOverride}
          applyOverride={applyOverride}
          openEdit={openEdit}
          deleteOverride={deleteOverride}
        />
      )}

      {tab === "mining_ships" && (
        <MiningShipTable
          items={miningShips}
          search={lowerSearch}
          getOverride={getOverride}
          applyOverride={applyOverride}
          openEdit={openEdit}
          deleteOverride={deleteOverride}
        />
      )}

      {tab === "mining_locations" && (
        <MiningLocationTable
          items={miningLocations}
          search={lowerSearch}
          getOverride={getOverride}
          applyOverride={applyOverride}
          openEdit={openEdit}
          deleteOverride={deleteOverride}
        />
      )}

      {tab === "rock_signatures" && (
        <RockSignatureTable
          items={rockSignatures}
          search={lowerSearch}
          getOverride={getOverride}
          applyOverride={applyOverride}
          openEdit={openEdit}
          deleteOverride={deleteOverride}
        />
      )}

      {tab === "wikelo_contracts" && (
        <WikeloContractTable
          items={wikeloContracts}
          search={lowerSearch}
          getOverride={getOverride}
          applyOverride={applyOverride}
          openEdit={openEdit}
          deleteOverride={deleteOverride}
        />
      )}

      {tab === "wikelo_items" && (
        <WikeloItemTable
          items={gatheringItems}
          search={lowerSearch}
          getOverride={getOverride}
          applyOverride={applyOverride}
          openEdit={openEdit}
          deleteOverride={deleteOverride}
        />
      )}

      {tab === "wikelo_emporiums" && (
        <WikeloEmporiumTable
          items={emporiums}
          search={lowerSearch}
          getOverride={getOverride}
          applyOverride={applyOverride}
          openEdit={openEdit}
          deleteOverride={deleteOverride}
        />
      )}

      {tab === "wikelo_favors" && (
        <WikeloFavorTable
          items={favorConversions}
          search={lowerSearch}
          getOverride={getOverride}
          applyOverride={applyOverride}
          openEdit={openEdit}
          deleteOverride={deleteOverride}
        />
      )}

      {tab === "wikelo_rep" && (
        <WikeloRepTable
          items={reputationTiers}
          search={lowerSearch}
          getOverride={getOverride}
          applyOverride={applyOverride}
          openEdit={openEdit}
          deleteOverride={deleteOverride}
        />
      )}

      {/* Edit Modal */}
      {editState && (
        <div className={styles.editOverlay} onClick={(e) => { if (e.target === e.currentTarget) setEditState(null); }}>
          <div className={styles.editModal}>
            <div className={styles.editTitle}>Edit: {editState.displayName}</div>
            {error && <div style={{ color: "#ff6b6b", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{error}</div>}
            {editState.fields.map((f, i) => (
              <div key={f.key} className={styles.editField}>
                <div className={styles.editLabel}>{f.key}</div>
                <input
                  className={styles.editInput}
                  type={typeof f.original === "number" ? "number" : "text"}
                  step={typeof f.original === "number" ? "any" : undefined}
                  value={f.value}
                  onChange={(e) => {
                    setEditState((prev) => {
                      if (!prev) return prev;
                      const fields = [...prev.fields];
                      fields[i] = { ...fields[i], value: typeof fields[i].original === "number" ? Number(e.target.value) : e.target.value };
                      return { ...prev, fields };
                    });
                  }}
                />
              </div>
            ))}
            <div className={styles.editActions}>
              <button className={styles.saveBtn} onClick={handleEditSave} disabled={submitting}>
                {submitting ? "Saving..." : "Save Override"}
              </button>
              <button className={styles.toggleBtn} onClick={() => setEditState(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================
// Table Components
// =============================================

const cellStyle: React.CSSProperties = { padding: "0.4rem 0.6rem", borderBottom: "1px solid var(--border, #333)", fontSize: "0.8rem" };
const thStyle: React.CSSProperties = { ...cellStyle, textAlign: "left", color: "var(--text-secondary, #8888a0)", fontWeight: 600 };

interface TableHelpers {
  getOverride: (category: string, itemKey: string) => DataOverride | undefined;
  applyOverride: <T>(category: string, item: T, key: string) => T;
  openEdit: (category: string, itemKey: string, displayName: string, fields: { key: string; value: number | string }[]) => void;
  deleteOverride: (id: string) => void;
}

function OverrideBadge({ override, onRevert }: { override?: DataOverride; onRevert: () => void }) {
  if (!override) return null;
  return (
    <>
      <span className={styles.overrideBadge}>OVERRIDE</span>
      <button className={styles.revertBtn} onClick={onRevert} title="Revert to base data">Revert</button>
    </>
  );
}

function ComponentTable({ items, statHeaders, search, ...helpers }: { items: ShipComponent[]; statHeaders: string[]; search: string } & TableHelpers) {
  const filtered = items.filter((c) => c.name.toLowerCase().includes(search));
  return (
    <>
      <div className={styles.itemCount}>{filtered.length} items</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Size</th>
              <th style={thStyle}>Grade</th>
              <th style={thStyle}>Manufacturer</th>
              {statHeaders.map((h) => <th key={h} style={thStyle}>{h}</th>)}
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, idx) => {
              const key = componentKey(c);
              const cat = componentCategory(c);
              const override = helpers.getOverride(cat, key);
              const merged = helpers.applyOverride(cat, c, key);
              const mergedStats = merged.stats as Record<string, number>;
              return (
                <tr key={`${key}::${idx}`}>
                  <td style={cellStyle}>{c.name}</td>
                  <td style={cellStyle}>{c.size}</td>
                  <td style={cellStyle}>{c.grade}</td>
                  <td style={cellStyle}>{c.manufacturer}</td>
                  {statHeaders.map((h) => (
                    <td key={h} style={{ ...cellStyle, color: override?.overrides[h] !== undefined ? "#e0c050" : undefined }}>
                      {mergedStats[h] !== undefined ? (typeof mergedStats[h] === "number" ? mergedStats[h].toLocaleString() : mergedStats[h]) : "—"}
                    </td>
                  ))}
                  <td style={cellStyle}>
                    <button
                      onClick={() => helpers.openEdit(cat, key, `${c.name} (${c.size})`, statHeaders.filter((h) => mergedStats[h] !== undefined).map((h) => ({ key: h, value: mergedStats[h] })))}
                      style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.8rem", marginRight: "0.5rem" }}
                    >
                      Edit
                    </button>
                    <OverrideBadge override={override} onRevert={() => override && helpers.deleteOverride(override.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ShipTable({ items, search, ...helpers }: { items: Ship[]; search: string } & TableHelpers) {
  const filtered = items.filter((s) => s.name.toLowerCase().includes(search));
  return (
    <>
      <div className={styles.itemCount}>{filtered.length} items</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Manufacturer</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Size</th>
              <th style={thStyle}>Cargo</th>
              <th style={thStyle}>Crew</th>
              <th style={thStyle}>SCM</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const key = shipKey(s);
              const override = helpers.getOverride("ship", key);
              const merged = helpers.applyOverride("ship", s, key);
              return (
                <tr key={key}>
                  <td style={cellStyle}>{merged.name as string}</td>
                  <td style={cellStyle}>{merged.manufacturer as string}</td>
                  <td style={cellStyle}>{merged.role as string}</td>
                  <td style={cellStyle}>{merged.size as string}</td>
                  <td style={cellStyle}>{String(merged.cargoSCU ?? "—")}</td>
                  <td style={cellStyle}>{String(merged.crew && typeof merged.crew === "object" ? `${(merged.crew as { min: number }).min}-${(merged.crew as { max: number }).max}` : "—")}</td>
                  <td style={cellStyle}>{merged.speed && typeof merged.speed === "object" ? String((merged.speed as { scm: number }).scm) : "—"}</td>
                  <td style={cellStyle}>{merged.buyPriceAUEC ? Number(merged.buyPriceAUEC).toLocaleString() : "—"}</td>
                  <td style={cellStyle}>
                    <button
                      onClick={() => helpers.openEdit("ship", key, s.name, [
                        { key: "cargoSCU", value: Number(s.cargoSCU ?? 0) },
                        { key: "buyPriceAUEC", value: Number(s.buyPriceAUEC ?? 0) },
                      ])}
                      style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.8rem", marginRight: "0.5rem" }}
                    >
                      Edit
                    </button>
                    <OverrideBadge override={override} onRevert={() => override && helpers.deleteOverride(override.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function OreTable({ items, search, ...helpers }: { items: Ore[]; search: string } & TableHelpers) {
  const filtered = items.filter((o) => o.name.toLowerCase().includes(search));
  return (
    <>
      <div className={styles.itemCount}>{filtered.length} items</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Value/SCU</th>
              <th style={thStyle}>Instability</th>
              <th style={thStyle}>Resistance</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => {
              const key = oreKey(o);
              const override = helpers.getOverride("ore", key);
              const merged = helpers.applyOverride("ore", o, key);
              return (
                <tr key={key}>
                  <td style={cellStyle}>{merged.name as string}</td>
                  <td style={cellStyle}>{merged.type as string}</td>
                  <td style={{ ...cellStyle, color: override?.overrides.valuePerSCU !== undefined ? "#e0c050" : undefined }}>
                    {Number(merged.valuePerSCU ?? 0).toLocaleString()}
                  </td>
                  <td style={cellStyle}>{String(merged.instability ?? "—")}</td>
                  <td style={cellStyle}>{String(merged.resistance ?? "—")}%</td>
                  <td style={cellStyle}>
                    <button
                      onClick={() => helpers.openEdit("ore", key, o.name, [
                        { key: "valuePerSCU", value: Number(o.valuePerSCU ?? 0) },
                        { key: "instability", value: Number(o.instability ?? 0) },
                        { key: "resistance", value: Number(o.resistance ?? 0) },
                      ])}
                      style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.8rem", marginRight: "0.5rem" }}
                    >
                      Edit
                    </button>
                    <OverrideBadge override={override} onRevert={() => override && helpers.deleteOverride(override.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function RefineryMethodTable({ items, search, ...helpers }: { items: RefineryMethod[]; search: string } & TableHelpers) {
  const filtered = items.filter((m) => m.name.toLowerCase().includes(search));
  return (
    <>
      <div className={styles.itemCount}>{filtered.length} items</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Yield</th>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Cost</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const key = refineryMethodKey(m);
              const override = helpers.getOverride("refinery_method", key);
              const merged = helpers.applyOverride("refinery_method", m, key);
              return (
                <tr key={key}>
                  <td style={cellStyle}>{merged.name as string}</td>
                  <td style={cellStyle}>{((merged.yieldMultiplier as number) * 100).toFixed(0)}%</td>
                  <td style={cellStyle}>{String(merged.relativeTime)}/9</td>
                  <td style={cellStyle}>{String(merged.relativeCost)}/3</td>
                  <td style={cellStyle}>
                    <button
                      onClick={() => helpers.openEdit("refinery_method", key, m.name, [
                        { key: "yieldMultiplier", value: m.yieldMultiplier },
                        { key: "relativeTime", value: m.relativeTime },
                        { key: "relativeCost", value: m.relativeCost },
                      ])}
                      style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.8rem", marginRight: "0.5rem" }}
                    >
                      Edit
                    </button>
                    <OverrideBadge override={override} onRevert={() => override && helpers.deleteOverride(override.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function RefineryStationTable({ items, search, ...helpers }: { items: RefineryStation[]; search: string } & TableHelpers) {
  const filtered = items.filter((s) => s.name.toLowerCase().includes(search));
  return (
    <>
      <div className={styles.itemCount}>{filtered.length} items</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Bonuses</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const key = refineryStationKey(s);
              const override = helpers.getOverride("refinery_station", key);
              return (
                <tr key={key}>
                  <td style={cellStyle}>{s.name}</td>
                  <td style={cellStyle}>{s.location}</td>
                  <td style={{ ...cellStyle, fontSize: "0.7rem", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {Object.entries(s.bonuses).map(([ore, bonus]) => `${ore}: ${bonus > 0 ? "+" : ""}${bonus}%`).join(", ")}
                  </td>
                  <td style={cellStyle}>
                    <OverrideBadge override={override} onRevert={() => override && helpers.deleteOverride(override.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function MiningLaserTable({ items, search, ...helpers }: { items: MiningLaser[]; search: string } & TableHelpers) {
  const filtered = items.filter((l) => l.name.toLowerCase().includes(search));
  const fields = ["maxPower", "extractPower", "moduleSlots", "resistance", "instability", "optimumRange", "maxRange", "price"] as const;
  return (
    <>
      <div className={styles.itemCount}>{filtered.length} items</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Size</th>
              <th style={thStyle}>Max Power</th>
              <th style={thStyle}>Extract</th>
              <th style={thStyle}>Slots</th>
              <th style={thStyle}>Resist</th>
              <th style={thStyle}>Instab</th>
              <th style={thStyle}>Opt Range</th>
              <th style={thStyle}>Max Range</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => {
              const key = l.name;
              const override = helpers.getOverride("mining_laser", key);
              const merged = helpers.applyOverride("mining_laser", l, key);
              return (
                <tr key={key}>
                  <td style={cellStyle}>{l.name}</td>
                  <td style={cellStyle}>S{l.size}</td>
                  <td style={{ ...cellStyle, color: override?.overrides.maxPower !== undefined ? "#e0c050" : undefined }}>{merged.maxPower}</td>
                  <td style={{ ...cellStyle, color: override?.overrides.extractPower !== undefined ? "#e0c050" : undefined }}>{merged.extractPower}</td>
                  <td style={cellStyle}>{merged.moduleSlots}</td>
                  <td style={cellStyle}>{merged.resistance}%</td>
                  <td style={cellStyle}>{merged.instability}%</td>
                  <td style={cellStyle}>{merged.optimumRange}</td>
                  <td style={cellStyle}>{merged.maxRange}</td>
                  <td style={cellStyle}>{merged.price.toLocaleString()}</td>
                  <td style={cellStyle}>
                    <button
                      onClick={() => helpers.openEdit("mining_laser", key, l.name, fields.map((f) => ({ key: f, value: l[f] })))}
                      style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.8rem", marginRight: "0.5rem" }}
                    >
                      Edit
                    </button>
                    <OverrideBadge override={override} onRevert={() => override && helpers.deleteOverride(override.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function MiningModuleTable({ items, search, ...helpers }: { items: MiningModule[]; search: string } & TableHelpers) {
  const filtered = items.filter((m) => m.name.toLowerCase().includes(search));
  const fields = ["miningLaserPower", "laserInstability", "resistance", "optimalChargeWindow", "optimalChargeRate", "price"] as const;
  return (
    <>
      <div className={styles.itemCount}>{filtered.length} items</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Power</th>
              <th style={thStyle}>Instab</th>
              <th style={thStyle}>Resist</th>
              <th style={thStyle}>Charge Win</th>
              <th style={thStyle}>Charge Rate</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const key = m.name;
              const override = helpers.getOverride("mining_module", key);
              const merged = helpers.applyOverride("mining_module", m, key);
              return (
                <tr key={key}>
                  <td style={cellStyle}>{m.name}</td>
                  <td style={cellStyle}>{m.type}</td>
                  <td style={{ ...cellStyle, color: override?.overrides.miningLaserPower !== undefined ? "#e0c050" : undefined }}>{merged.miningLaserPower}%</td>
                  <td style={cellStyle}>{merged.laserInstability}%</td>
                  <td style={cellStyle}>{merged.resistance}%</td>
                  <td style={cellStyle}>{merged.optimalChargeWindow}%</td>
                  <td style={cellStyle}>{merged.optimalChargeRate}%</td>
                  <td style={cellStyle}>{merged.price.toLocaleString()}</td>
                  <td style={cellStyle}>
                    <button
                      onClick={() => helpers.openEdit("mining_module", key, m.name, fields.map((f) => ({ key: f, value: m[f] })))}
                      style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.8rem", marginRight: "0.5rem" }}
                    >
                      Edit
                    </button>
                    <OverrideBadge override={override} onRevert={() => override && helpers.deleteOverride(override.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function MiningGadgetTable({ items, search, ...helpers }: { items: MiningGadget[]; search: string } & TableHelpers) {
  const filtered = items.filter((g) => g.name.toLowerCase().includes(search));
  const fields = ["laserInstability", "resistance", "optimalChargeWindow", "optimalChargeRate", "extractionLaserPower", "price"] as const;
  return (
    <>
      <div className={styles.itemCount}>{filtered.length} items</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Instab</th>
              <th style={thStyle}>Resist</th>
              <th style={thStyle}>Charge Win</th>
              <th style={thStyle}>Charge Rate</th>
              <th style={thStyle}>Extract Pwr</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => {
              const key = g.name;
              const override = helpers.getOverride("mining_gadget", key);
              const merged = helpers.applyOverride("mining_gadget", g, key);
              return (
                <tr key={key}>
                  <td style={cellStyle}>{g.name}</td>
                  <td style={cellStyle}>{merged.laserInstability}%</td>
                  <td style={cellStyle}>{merged.resistance}%</td>
                  <td style={cellStyle}>{merged.optimalChargeWindow}%</td>
                  <td style={cellStyle}>{merged.optimalChargeRate}%</td>
                  <td style={cellStyle}>{merged.extractionLaserPower}%</td>
                  <td style={cellStyle}>{merged.price.toLocaleString()}</td>
                  <td style={cellStyle}>
                    <button
                      onClick={() => helpers.openEdit("mining_gadget", key, g.name, fields.map((f) => ({ key: f, value: g[f] })))}
                      style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.8rem", marginRight: "0.5rem" }}
                    >
                      Edit
                    </button>
                    <OverrideBadge override={override} onRevert={() => override && helpers.deleteOverride(override.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function MiningShipTable({ items, search, ...helpers }: { items: MiningShip[]; search: string } & TableHelpers) {
  const filtered = items.filter((s) => s.name.toLowerCase().includes(search));
  const fields = ["cargoSCU", "miningTurrets", "crewMin", "crewMax"] as const;
  return (
    <>
      <div className={styles.itemCount}>{filtered.length} items</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Manufacturer</th>
              <th style={thStyle}>Size</th>
              <th style={thStyle}>Cargo SCU</th>
              <th style={thStyle}>Turrets</th>
              <th style={thStyle}>Crew</th>
              <th style={thStyle}>Vehicle</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const key = s.name;
              const override = helpers.getOverride("mining_ship", key);
              const merged = helpers.applyOverride("mining_ship", s, key);
              return (
                <tr key={key}>
                  <td style={cellStyle}>{s.name}</td>
                  <td style={cellStyle}>{s.manufacturer}</td>
                  <td style={cellStyle}>{s.size}</td>
                  <td style={{ ...cellStyle, color: override?.overrides.cargoSCU !== undefined ? "#e0c050" : undefined }}>{merged.cargoSCU}</td>
                  <td style={{ ...cellStyle, color: override?.overrides.miningTurrets !== undefined ? "#e0c050" : undefined }}>{merged.miningTurrets}</td>
                  <td style={cellStyle}>{merged.crewMin}-{merged.crewMax}</td>
                  <td style={cellStyle}>{s.isVehicle ? "Yes" : "No"}</td>
                  <td style={cellStyle}>
                    <button
                      onClick={() => helpers.openEdit("mining_ship", key, s.name, fields.map((f) => ({ key: f, value: s[f] })))}
                      style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.8rem", marginRight: "0.5rem" }}
                    >
                      Edit
                    </button>
                    <OverrideBadge override={override} onRevert={() => override && helpers.deleteOverride(override.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function MiningLocationTable({ items, search, ...helpers }: { items: MiningLocation[]; search: string } & TableHelpers) {
  const filtered = items.filter((l) => l.name.toLowerCase().includes(search));
  return (
    <>
      <div className={styles.itemCount}>{filtered.length} items</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Parent</th>
              <th style={thStyle}>Gravity</th>
              <th style={thStyle}>Danger</th>
              <th style={thStyle}>Ores</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => {
              const key = l.name;
              const override = helpers.getOverride("mining_location", key);
              return (
                <tr key={key}>
                  <td style={cellStyle}>{l.name}</td>
                  <td style={cellStyle}>{l.type}</td>
                  <td style={cellStyle}>{l.parentBody}</td>
                  <td style={cellStyle}>{l.gravity}</td>
                  <td style={cellStyle}>{l.danger}</td>
                  <td style={{ ...cellStyle, fontSize: "0.7rem", maxWidth: "200px" }}>{l.ores.join(", ")}</td>
                  <td style={cellStyle}>
                    <OverrideBadge override={override} onRevert={() => override && helpers.deleteOverride(override.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function RockSignatureTable({ items, search, ...helpers }: { items: RockClass[]; search: string } & TableHelpers) {
  const filtered = items.filter((r) => r.name.toLowerCase().includes(search));
  return (
    <>
      <div className={styles.itemCount}>{filtered.length} items</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Rarity</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const key = r.name;
              const override = helpers.getOverride("rock_signature", key);
              return (
                <tr key={key}>
                  <td style={cellStyle}>{r.name}</td>
                  <td style={cellStyle}>{r.rarity}</td>
                  <td style={cellStyle}>
                    <OverrideBadge override={override} onRevert={() => override && helpers.deleteOverride(override.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function WikeloContractTable({ items, search, ...helpers }: { items: WikeloContract[]; search: string } & TableHelpers) {
  const filtered = items.filter((c) => c.name.toLowerCase().includes(search));
  return (
    <>
      <div className={styles.itemCount}>{filtered.length} items</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Tier</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Active</th>
              <th style={thStyle}>Requirements</th>
              <th style={thStyle}>Rewards</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const key = c.id;
              const override = helpers.getOverride("wikelo_contract", key);
              const merged = helpers.applyOverride("wikelo_contract", c, key);
              return (
                <tr key={key}>
                  <td style={cellStyle}>{merged.name}</td>
                  <td style={cellStyle}>{merged.tier}</td>
                  <td style={cellStyle}>{merged.category}</td>
                  <td style={cellStyle}>{merged.active ? "Yes" : "No"}</td>
                  <td style={{ ...cellStyle, fontSize: "0.7rem", maxWidth: "250px" }}>
                    {c.requirements.map((r) => `${r.quantity}x ${r.item}`).join(", ")}
                  </td>
                  <td style={{ ...cellStyle, fontSize: "0.7rem", maxWidth: "200px" }}>{c.rewards.join(", ")}</td>
                  <td style={cellStyle}>
                    <OverrideBadge override={override} onRevert={() => override && helpers.deleteOverride(override.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function WikeloItemTable({ items, search, ...helpers }: { items: GatheringItem[]; search: string } & TableHelpers) {
  const filtered = items.filter((g) => g.name.toLowerCase().includes(search));
  return (
    <>
      <div className={styles.itemCount}>{filtered.length} items</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Locations</th>
              <th style={thStyle}>Tips</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => {
              const key = g.name;
              const override = helpers.getOverride("wikelo_gathering_item", key);
              const merged = helpers.applyOverride("wikelo_gathering_item", g, key);
              return (
                <tr key={key}>
                  <td style={cellStyle}>{merged.name}</td>
                  <td style={cellStyle}>{merged.category}</td>
                  <td style={{ ...cellStyle, fontSize: "0.7rem", maxWidth: "200px" }}>{(merged.locations as string[]).join(", ")}</td>
                  <td style={{ ...cellStyle, fontSize: "0.7rem", maxWidth: "250px" }}>{merged.tips}</td>
                  <td style={cellStyle}>
                    <button
                      onClick={() => helpers.openEdit("wikelo_gathering_item", key, g.name, [
                        { key: "tips", value: g.tips },
                      ])}
                      style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.8rem", marginRight: "0.5rem" }}
                    >
                      Edit
                    </button>
                    <OverrideBadge override={override} onRevert={() => override && helpers.deleteOverride(override.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function WikeloEmporiumTable({ items, search, ...helpers }: { items: Emporium[]; search: string } & TableHelpers) {
  const filtered = items.filter((e) => e.name.toLowerCase().includes(search));
  return (
    <>
      <div className={styles.itemCount}>{filtered.length} items</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Planet</th>
              <th style={thStyle}>System</th>
              <th style={thStyle}>Tiers</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => {
              const key = e.name;
              const override = helpers.getOverride("wikelo_emporium", key);
              const merged = helpers.applyOverride("wikelo_emporium", e, key);
              return (
                <tr key={key}>
                  <td style={cellStyle}>{merged.name}</td>
                  <td style={cellStyle}>{merged.planet}{e.moon ? ` (${e.moon})` : ""}</td>
                  <td style={cellStyle}>{merged.system}</td>
                  <td style={{ ...cellStyle, fontSize: "0.7rem" }}>{(merged.tiers as string[]).join(", ")}</td>
                  <td style={cellStyle}>
                    <OverrideBadge override={override} onRevert={() => override && helpers.deleteOverride(override.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function WikeloFavorTable({ items, search, ...helpers }: { items: FavorConversion[]; search: string } & TableHelpers) {
  const filtered = items.filter((f) => f.name.toLowerCase().includes(search));
  return (
    <>
      <div className={styles.itemCount}>{filtered.length} items</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Input</th>
              <th style={thStyle}>Output</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => {
              const key = f.name;
              const override = helpers.getOverride("wikelo_favor_conversion", key);
              return (
                <tr key={key}>
                  <td style={cellStyle}>{f.name}</td>
                  <td style={{ ...cellStyle, fontSize: "0.7rem" }}>{f.input.map((i) => `${i.quantity}x ${i.item}`).join(", ")}</td>
                  <td style={cellStyle}>{f.output.quantity}x {f.output.item}</td>
                  <td style={cellStyle}>
                    <OverrideBadge override={override} onRevert={() => override && helpers.deleteOverride(override.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function WikeloRepTable({ items, search, ...helpers }: { items: { tier: string; requirement: string; benefits: string[] }[]; search: string } & TableHelpers) {
  const filtered = items.filter((t) => t.tier.toLowerCase().includes(search));
  return (
    <>
      <div className={styles.itemCount}>{filtered.length} items</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Tier</th>
              <th style={thStyle}>Requirement</th>
              <th style={thStyle}>Benefits</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => {
              const key = t.tier;
              const override = helpers.getOverride("wikelo_reputation_tier", key);
              const merged = helpers.applyOverride("wikelo_reputation_tier", t, key);
              return (
                <tr key={key}>
                  <td style={cellStyle}>{merged.tier}</td>
                  <td style={{ ...cellStyle, fontSize: "0.7rem", maxWidth: "250px" }}>{merged.requirement}</td>
                  <td style={{ ...cellStyle, fontSize: "0.7rem", maxWidth: "300px" }}>{(merged.benefits as string[]).join("; ")}</td>
                  <td style={cellStyle}>
                    <button
                      onClick={() => helpers.openEdit("wikelo_reputation_tier", key, t.tier, [
                        { key: "requirement", value: t.requirement },
                      ])}
                      style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.8rem", marginRight: "0.5rem" }}
                    >
                      Edit
                    </button>
                    <OverrideBadge override={override} onRevert={() => override && helpers.deleteOverride(override.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
