"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import styles from "../admin.module.css";

// --- Types matching API DTOs ---
interface GameOre { id: string; name: string; abbrev: string; type: string; valuePerSCU: number; instability: number; resistance: number; description: string; sortOrder: number; }
interface GameLaser { id: string; name: string; size: number; price: number; optimumRange: number; maxRange: number; minPower: number; minPowerPct: number; maxPower: number; extractPower: number; moduleSlots: number; resistance: number; instability: number; optimalChargeRate: number; optimalChargeWindow: number; inertMaterials: number; description: string; }
interface GameModule { id: string; name: string; category: string; price: number; duration: number; uses: number; miningLaserPower: number; laserInstability: number; resistance: number; optimalChargeWindow: number; optimalChargeRate: number; overchargeRate: number; shatterDamage: number; extractionLaserPower: number; inertMaterials: number; clusterModifier: number; description: string; }
interface GameShip { id: string; name: string; manufacturer: string; size: string; cargoSCU: number; miningTurrets: number; crewMin: number; crewMax: number; isVehicle: boolean; description: string; }
interface GameRockSig { id: string; name: string; baseRU: number; maxMultiples: number; }
interface GameRefineryMethod { id: string; name: string; yieldMultiplier: number; relativeTime: number; relativeCost: number; description: string; }
interface GameRefineryStation { id: string; name: string; location: string; bonuses: Record<string, number>; }
interface GameLocation { id: string; name: string; type: string; parentBody: string; gravity: string; atmosphere: boolean; danger: string; ores: string[]; notes: string; }

type TabKey = "ores" | "lasers" | "modules" | "ships" | "rocks" | "refinery" | "stations" | "locations";

const TAB_LABELS: Record<TabKey, string> = {
  ores: "Ores", lasers: "Lasers", modules: "Modules", ships: "Ships",
  rocks: "Rock Types", refinery: "Refinery Methods", stations: "Refinery Stations", locations: "Locations",
};

export default function GameDataPage() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<TabKey>("ores");
  const [loading, setLoading] = useState(true);

  // Data state
  const [ores, setOres] = useState<GameOre[]>([]);
  const [lasers, setLasers] = useState<GameLaser[]>([]);
  const [modules, setModules] = useState<GameModule[]>([]);
  const [ships, setShips] = useState<GameShip[]>([]);
  const [rockSigs, setRockSigs] = useState<GameRockSig[]>([]);
  const [refineryMethods, setRefineryMethods] = useState<GameRefineryMethod[]>([]);
  const [refineryStations, setRefineryStations] = useState<GameRefineryStation[]>([]);
  const [locations, setLocations] = useState<GameLocation[]>([]);

  // Edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const res = await apiFetch<{
      ores: GameOre[]; lasers: GameLaser[]; modules: GameModule[];
      ships: GameShip[]; rockSignatures: GameRockSig[];
      refineryMethods: GameRefineryMethod[]; refineryStations: GameRefineryStation[];
      locations: GameLocation[];
    }>("/api/game-data/all");
    if (res.success && res.data) {
      setOres(res.data.ores);
      setLasers(res.data.lasers);
      setModules(res.data.modules);
      setShips(res.data.ships);
      setRockSigs(res.data.rockSignatures);
      setRefineryMethods(res.data.refineryMethods);
      setRefineryStations(res.data.refineryStations);
      setLocations(res.data.locations);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.isAdmin) { setLoading(false); return; }
    fetchAll();
  }, [authLoading, user, fetchAll]);

  function resetForm() {
    setEditId(null); setShowForm(false); setFormData({}); setError(null);
  }

  function setField(key: string, value: unknown) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  // API path mapping
  function apiPath(): string {
    const map: Record<TabKey, string> = {
      ores: "ores", lasers: "lasers", modules: "modules", ships: "ships",
      rocks: "rock-signatures", refinery: "refinery-methods", stations: "refinery-stations", locations: "locations",
    };
    return map[tab];
  }

  async function handleSave() {
    setSubmitting(true); setError(null);
    const path = `/api/game-data/${apiPath()}`;
    const res = editId
      ? await apiFetch(`${path}/${editId}`, { method: "PATCH", body: JSON.stringify(formData) })
      : await apiFetch(path, { method: "POST", body: JSON.stringify(formData) });
    if (res.success) { resetForm(); fetchAll(); }
    else { setError(typeof res.error === "string" ? res.error : "Save failed"); }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    await apiFetch(`/api/game-data/${apiPath()}/${id}`, { method: "DELETE" });
    fetchAll();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function startEdit(item: any) {
    const { id, ...rest } = item;
    setEditId(id); setFormData(rest); setShowForm(true); setError(null);
  }

  function startNew() {
    resetForm(); setShowForm(true);
  }

  if (authLoading || loading) return <div className={styles.loading}>Loading...</div>;
  if (!user?.isAdmin) return <div className={styles.denied}>Admin access required.</div>;

  return (
    <div className={styles.adminPage}>
      <Link href="/admin" className={styles.backLink}>Back to Admin</Link>
      <h1 className={styles.title}>Game Data Manager</h1>

      <div className={styles.tabs}>
        {(Object.keys(TAB_LABELS) as TabKey[]).map((t) => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabActive : ""}`}
            onClick={() => { setTab(t); resetForm(); }}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <button className={styles.saveBtn} onClick={startNew}>
          + New {TAB_LABELS[tab].replace(/s$/, "")}
        </button>
      </div>

      {showForm && (
        <div className={styles.queueCard} style={{ marginBottom: "1rem" }}>
          <div className={styles.queueTitle}>{editId ? "Edit" : "New"} {TAB_LABELS[tab].replace(/s$/, "")}</div>
          {error && <div style={{ color: "#ff6b6b", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{error}</div>}
          <FormFields tab={tab} formData={formData} setField={setField} />
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <button className={styles.saveBtn} onClick={handleSave} disabled={submitting}>
              {submitting ? "Saving..." : editId ? "Update" : "Create"}
            </button>
            <button className={styles.toggleBtn} onClick={resetForm}>Cancel</button>
          </div>
        </div>
      )}

      {/* Data Tables */}
      {tab === "ores" && <OresTable items={ores} onEdit={startEdit} onDelete={handleDelete} />}
      {tab === "lasers" && <LasersTable items={lasers} onEdit={startEdit} onDelete={handleDelete} />}
      {tab === "modules" && <ModulesTable items={modules} onEdit={startEdit} onDelete={handleDelete} />}
      {tab === "ships" && <ShipsTable items={ships} onEdit={startEdit} onDelete={handleDelete} />}
      {tab === "rocks" && <RockSigsTable items={rockSigs} onEdit={startEdit} onDelete={handleDelete} />}
      {tab === "refinery" && <RefineryMethodsTable items={refineryMethods} onEdit={startEdit} onDelete={handleDelete} />}
      {tab === "stations" && <RefineryStationsTable items={refineryStations} onEdit={startEdit} onDelete={handleDelete} />}
      {tab === "locations" && <LocationsTable items={locations} onEdit={startEdit} onDelete={handleDelete} />}
    </div>
  );
}

// =============================================
// Form fields per tab
// =============================================

function FormFields({ tab, formData, setField }: { tab: TabKey; formData: Record<string, unknown>; setField: (k: string, v: unknown) => void }) {
  const str = (k: string) => (formData[k] as string) ?? "";
  const num = (k: string) => (formData[k] as number) ?? 0;
  const bool = (k: string) => (formData[k] as boolean) ?? false;

  const inputStyle: React.CSSProperties = { background: "var(--bg-darker, #1a1a2e)", border: "1px solid var(--border, #333)", color: "var(--text-primary, #e0e0e0)", padding: "0.4rem 0.6rem", borderRadius: "4px", width: "100%" };
  const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" };
  const labelStyle: React.CSSProperties = { fontSize: "0.75rem", color: "var(--text-secondary, #8888a0)", marginBottom: "0.15rem" };

  function field(label: string, key: string, type: "text" | "number" | "checkbox" = "text") {
    return (
      <div>
        <div style={labelStyle}>{label}</div>
        {type === "checkbox" ? (
          <input type="checkbox" checked={bool(key)} onChange={(e) => setField(key, e.target.checked)} />
        ) : (
          <input type={type} value={type === "number" ? num(key) : str(key)} onChange={(e) => setField(key, type === "number" ? Number(e.target.value) : e.target.value)} style={inputStyle} />
        )}
      </div>
    );
  }

  function selectField(label: string, key: string, options: string[]) {
    return (
      <div>
        <div style={labelStyle}>{label}</div>
        <select value={str(key)} onChange={(e) => setField(key, e.target.value)} style={inputStyle}>
          <option value="">Select...</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    );
  }

  function textArea(label: string, key: string) {
    return (
      <div style={{ gridColumn: "1 / -1" }}>
        <div style={labelStyle}>{label}</div>
        <textarea value={str(key)} onChange={(e) => setField(key, e.target.value)} style={{ ...inputStyle, minHeight: "60px" }} />
      </div>
    );
  }

  switch (tab) {
    case "ores":
      return (
        <div style={gridStyle}>
          {field("Name", "name")} {field("Abbreviation (4 chars)", "abbrev")}
          {selectField("Type", "type", ["ROCK", "GEM", "METAL"])}
          {field("Value per SCU", "valuePerSCU", "number")}
          {field("Instability", "instability", "number")} {field("Resistance %", "resistance", "number")}
          {field("Sort Order", "sortOrder", "number")}
          {textArea("Description", "description")}
        </div>
      );
    case "lasers":
      return (
        <div style={gridStyle}>
          {field("Name", "name")} {field("Size (0/1/2)", "size", "number")}
          {field("Price", "price", "number")} {field("Module Slots", "moduleSlots", "number")}
          {field("Min Power", "minPower", "number")} {field("Min Power %", "minPowerPct", "number")}
          {field("Max Power", "maxPower", "number")} {field("Extract Power", "extractPower", "number")}
          {field("Optimum Range", "optimumRange", "number")} {field("Max Range", "maxRange", "number")}
          {field("Resistance %", "resistance", "number")} {field("Instability %", "instability", "number")}
          {field("Charge Rate %", "optimalChargeRate", "number")} {field("Charge Window %", "optimalChargeWindow", "number")}
          {field("Inert Materials %", "inertMaterials", "number")}
          {textArea("Description", "description")}
        </div>
      );
    case "modules":
      return (
        <div style={gridStyle}>
          {field("Name", "name")} {selectField("Category", "category", ["ACTIVE", "PASSIVE", "GADGET"])}
          {field("Price", "price", "number")} {field("Duration (sec)", "duration", "number")}
          {field("Uses", "uses", "number")} {field("Mining Laser Power", "miningLaserPower", "number")}
          {field("Laser Instability %", "laserInstability", "number")} {field("Resistance %", "resistance", "number")}
          {field("Charge Window %", "optimalChargeWindow", "number")} {field("Charge Rate %", "optimalChargeRate", "number")}
          {field("Overcharge Rate %", "overchargeRate", "number")} {field("Shatter Damage %", "shatterDamage", "number")}
          {field("Extraction Power", "extractionLaserPower", "number")} {field("Inert Materials %", "inertMaterials", "number")}
          {field("Cluster Modifier %", "clusterModifier", "number")}
          {textArea("Description", "description")}
        </div>
      );
    case "ships":
      return (
        <div style={gridStyle}>
          {field("Name", "name")} {field("Manufacturer", "manufacturer")}
          {selectField("Size", "size", ["small", "medium", "large"])}
          {field("Cargo SCU", "cargoSCU", "number")} {field("Mining Turrets", "miningTurrets", "number")}
          {field("Crew Min", "crewMin", "number")} {field("Crew Max", "crewMax", "number")}
          <div>
            <div style={labelStyle}>Is Vehicle?</div>
            <input type="checkbox" checked={bool("isVehicle")} onChange={(e) => setField("isVehicle", e.target.checked)} />
          </div>
          {textArea("Description", "description")}
        </div>
      );
    case "rocks":
      return (
        <div style={gridStyle}>
          {field("Name", "name")} {field("Base RU", "baseRU", "number")}
          {field("Max Multiples", "maxMultiples", "number")}
        </div>
      );
    case "refinery":
      return (
        <div style={gridStyle}>
          {field("Name", "name")} {field("Yield Multiplier (0-1)", "yieldMultiplier", "number")}
          {field("Relative Time (1-9)", "relativeTime", "number")} {field("Relative Cost (1-3)", "relativeCost", "number")}
          {textArea("Description", "description")}
        </div>
      );
    case "stations":
      return (
        <div style={gridStyle}>
          {field("Name", "name")} {field("Location", "location")}
          <div style={{ gridColumn: "1 / -1" }}>
            <div style={labelStyle}>Bonuses (JSON: {`{"Quantanium": 2, "Gold": -3}`})</div>
            <textarea
              value={typeof formData.bonuses === "string" ? formData.bonuses as string : JSON.stringify(formData.bonuses ?? {}, null, 2)}
              onChange={(e) => {
                try { setField("bonuses", JSON.parse(e.target.value)); } catch { setField("bonuses", e.target.value); }
              }}
              style={{ ...inputStyle, minHeight: "80px", fontFamily: "monospace", fontSize: "0.8rem" }}
            />
          </div>
        </div>
      );
    case "locations":
      return (
        <div style={gridStyle}>
          {field("Name", "name")} {selectField("Type", "type", ["moon", "planet", "asteroid_belt", "station_adjacent"])}
          {field("Parent Body", "parentBody")} {selectField("Gravity", "gravity", ["none", "low", "medium", "high"])}
          {selectField("Danger", "danger", ["low", "medium", "high"])}
          <div>
            <div style={labelStyle}>Atmosphere?</div>
            <input type="checkbox" checked={bool("atmosphere")} onChange={(e) => setField("atmosphere", e.target.checked)} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <div style={labelStyle}>Ores (comma-separated)</div>
            <input
              value={Array.isArray(formData.ores) ? (formData.ores as string[]).join(", ") : str("ores")}
              onChange={(e) => setField("ores", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              style={inputStyle}
            />
          </div>
          {textArea("Notes", "notes")}
        </div>
      );
  }
}

// =============================================
// Data tables
// =============================================

interface TableProps<T> { items: T[]; onEdit: (item: T) => void; onDelete: (id: string) => void; }

const cellStyle: React.CSSProperties = { padding: "0.4rem 0.6rem", borderBottom: "1px solid var(--border, #333)", fontSize: "0.8rem" };
const actionBtns = (onEdit: () => void, onDelete: () => void) => (
  <td style={cellStyle}>
    <button onClick={onEdit} style={{ background: "none", border: "none", color: "var(--accent, #7c5cbf)", cursor: "pointer", marginRight: "0.5rem", fontSize: "0.8rem" }}>Edit</button>
    <button onClick={onDelete} style={{ background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", fontSize: "0.8rem" }}>Del</button>
  </td>
);

function TableWrapper({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>{headers.map((h) => <th key={h} style={{ ...cellStyle, textAlign: "left", color: "var(--text-secondary, #8888a0)", fontWeight: 600 }}>{h}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function OresTable({ items, onEdit, onDelete }: TableProps<GameOre>) {
  return (
    <TableWrapper headers={["Abbrev", "Name", "Type", "Value/SCU", "Instability", "Resistance", "Actions"]}>
      {items.map((o) => (
        <tr key={o.id}>
          <td style={{ ...cellStyle, fontWeight: 600 }}>{o.abbrev}</td>
          <td style={cellStyle}>{o.name}</td>
          <td style={cellStyle}>{o.type}</td>
          <td style={cellStyle}>{o.valuePerSCU.toLocaleString()}</td>
          <td style={cellStyle}>{o.instability}</td>
          <td style={cellStyle}>{o.resistance}%</td>
          {actionBtns(() => onEdit(o), () => onDelete(o.id))}
        </tr>
      ))}
    </TableWrapper>
  );
}

function LasersTable({ items, onEdit, onDelete }: TableProps<GameLaser>) {
  return (
    <TableWrapper headers={["Name", "Size", "Max Power", "Extract", "Slots", "Resist", "Instab", "Price", "Actions"]}>
      {items.map((l) => (
        <tr key={l.id}>
          <td style={cellStyle}>{l.name}</td>
          <td style={cellStyle}>S{l.size}</td>
          <td style={cellStyle}>{l.maxPower.toLocaleString()}</td>
          <td style={cellStyle}>{l.extractPower.toLocaleString()}</td>
          <td style={cellStyle}>{l.moduleSlots}</td>
          <td style={cellStyle}>{l.resistance}%</td>
          <td style={cellStyle}>{l.instability}%</td>
          <td style={cellStyle}>{l.price.toLocaleString()}</td>
          {actionBtns(() => onEdit(l), () => onDelete(l.id))}
        </tr>
      ))}
    </TableWrapper>
  );
}

function ModulesTable({ items, onEdit, onDelete }: TableProps<GameModule>) {
  return (
    <TableWrapper headers={["Name", "Category", "Price", "Dur", "Uses", "Power", "Instab", "Resist", "Actions"]}>
      {items.map((m) => (
        <tr key={m.id}>
          <td style={cellStyle}>{m.name}</td>
          <td style={cellStyle}>{m.category}</td>
          <td style={cellStyle}>{m.price.toLocaleString()}</td>
          <td style={cellStyle}>{m.duration || "—"}</td>
          <td style={cellStyle}>{m.uses || "—"}</td>
          <td style={cellStyle}>{m.miningLaserPower || "—"}</td>
          <td style={cellStyle}>{m.laserInstability || "—"}</td>
          <td style={cellStyle}>{m.resistance || "—"}</td>
          {actionBtns(() => onEdit(m), () => onDelete(m.id))}
        </tr>
      ))}
    </TableWrapper>
  );
}

function ShipsTable({ items, onEdit, onDelete }: TableProps<GameShip>) {
  return (
    <TableWrapper headers={["Name", "Manufacturer", "SCU", "Turrets", "Crew", "Vehicle", "Actions"]}>
      {items.map((s) => (
        <tr key={s.id}>
          <td style={cellStyle}>{s.name}</td>
          <td style={cellStyle}>{s.manufacturer}</td>
          <td style={cellStyle}>{s.cargoSCU}</td>
          <td style={cellStyle}>{s.miningTurrets}</td>
          <td style={cellStyle}>{s.crewMin}-{s.crewMax}</td>
          <td style={cellStyle}>{s.isVehicle ? "Yes" : "No"}</td>
          {actionBtns(() => onEdit(s), () => onDelete(s.id))}
        </tr>
      ))}
    </TableWrapper>
  );
}

function RockSigsTable({ items, onEdit, onDelete }: TableProps<GameRockSig>) {
  return (
    <TableWrapper headers={["Name", "Base RU", "Max Multiples", "Actions"]}>
      {items.map((r) => (
        <tr key={r.id}>
          <td style={cellStyle}>{r.name}</td>
          <td style={cellStyle}>{r.baseRU.toLocaleString()}</td>
          <td style={cellStyle}>{r.maxMultiples}</td>
          {actionBtns(() => onEdit(r), () => onDelete(r.id))}
        </tr>
      ))}
    </TableWrapper>
  );
}

function RefineryMethodsTable({ items, onEdit, onDelete }: TableProps<GameRefineryMethod>) {
  return (
    <TableWrapper headers={["Name", "Yield", "Time", "Cost", "Actions"]}>
      {items.map((m) => (
        <tr key={m.id}>
          <td style={cellStyle}>{m.name}</td>
          <td style={cellStyle}>{(m.yieldMultiplier * 100).toFixed(0)}%</td>
          <td style={cellStyle}>{m.relativeTime}/9</td>
          <td style={cellStyle}>{m.relativeCost}/3</td>
          {actionBtns(() => onEdit(m), () => onDelete(m.id))}
        </tr>
      ))}
    </TableWrapper>
  );
}

function RefineryStationsTable({ items, onEdit, onDelete }: TableProps<GameRefineryStation>) {
  return (
    <TableWrapper headers={["Name", "Location", "Bonuses", "Actions"]}>
      {items.map((s) => (
        <tr key={s.id}>
          <td style={cellStyle}>{s.name}</td>
          <td style={cellStyle}>{s.location}</td>
          <td style={{ ...cellStyle, fontSize: "0.7rem", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
            {Object.entries(s.bonuses).map(([ore, bonus]) => `${ore}: ${bonus > 0 ? "+" : ""}${bonus}%`).join(", ")}
          </td>
          {actionBtns(() => onEdit(s), () => onDelete(s.id))}
        </tr>
      ))}
    </TableWrapper>
  );
}

function LocationsTable({ items, onEdit, onDelete }: TableProps<GameLocation>) {
  return (
    <TableWrapper headers={["Name", "Type", "Parent", "Gravity", "Danger", "Ores", "Actions"]}>
      {items.map((l) => (
        <tr key={l.id}>
          <td style={cellStyle}>{l.name}</td>
          <td style={cellStyle}>{l.type}</td>
          <td style={cellStyle}>{l.parentBody}</td>
          <td style={cellStyle}>{l.gravity}</td>
          <td style={cellStyle}>{l.danger}</td>
          <td style={{ ...cellStyle, fontSize: "0.7rem", maxWidth: "200px" }}>{(l.ores as string[]).join(", ")}</td>
          {actionBtns(() => onEdit(l), () => onDelete(l.id))}
        </tr>
      ))}
    </TableWrapper>
  );
}
