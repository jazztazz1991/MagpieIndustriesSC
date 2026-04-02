"use client";

import { useState, useMemo } from "react";
import { ores as staticOres } from "@/data/mining";
import { miningLocations as staticLocations } from "@/data/mining-locations";
import { useWithOverrides } from "@/hooks/useOverrides";
import shared from "../tools.module.css";

type View = "locations" | "by-ore";

const dangerColor: Record<string, string> = {
  low: "#4ade80",
  medium: "#facc15",
  high: "#f87171",
};

const gravityLabel: Record<string, string> = {
  none: "Zero-G",
  low: "Low",
  medium: "Medium",
  high: "High",
};

export default function MiningLocationsPage() {
  const { data: ores } = useWithOverrides("ore", staticOres, (o) => o.name);
  const { data: miningLocations } = useWithOverrides("mining_location", staticLocations, (l) => l.name);

  const [view, setView] = useState<View>("locations");
  const [filterParent, setFilterParent] = useState("all");
  const [filterDanger, setFilterDanger] = useState("all");
  const [filterOre, setFilterOre] = useState("all");
  const [search, setSearch] = useState("");

  const parents = useMemo(
    () => [...new Set(miningLocations.map((l) => l.parentBody))].sort(),
    [miningLocations]
  );

  const mineableOres = useMemo(
    () =>
      ores
        .filter((o) => o.valuePerSCU > 0)
        .sort((a, b) => b.valuePerSCU - a.valuePerSCU),
    [ores]
  );

  const filtered = useMemo(() => {
    return miningLocations.filter((loc) => {
      if (filterParent !== "all" && loc.parentBody !== filterParent) return false;
      if (filterDanger !== "all" && loc.danger !== filterDanger) return false;
      if (filterOre !== "all" && !loc.ores.includes(filterOre) && !loc.fpsOres.includes(filterOre)) return false;
      if (search && !loc.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filterParent, filterDanger, filterOre, search, miningLocations]);

  const locationsForOre = (oreName: string) =>
    miningLocations.filter((loc) => loc.ores.includes(oreName));

  const fpsLocationsForOre = (oreName: string) =>
    miningLocations.filter((loc) => loc.fpsOres.includes(oreName));

  // All unique FPS ore names for the By Ore table
  const allFpsOreNames = useMemo(() => {
    const names = new Set<string>();
    miningLocations.forEach((loc) => loc.fpsOres.forEach((o) => names.add(o)));
    return [...names].sort();
  }, [miningLocations]);

  return (
    <div className={shared.page}>
      <h1 className={shared.title}>Where to Mine</h1>
      <p className={shared.subtitle}>
        Mining locations across Stanton, Pyro, and Nyx with ore availability, danger ratings, and tips.
      </p>

      {/* View toggle */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button
          className={view === "locations" ? shared.shipBtnActive + " " + shared.shipBtn : shared.shipBtn}
          onClick={() => setView("locations")}
        >
          By Location
        </button>
        <button
          className={view === "by-ore" ? shared.shipBtnActive + " " + shared.shipBtn : shared.shipBtn}
          onClick={() => setView("by-ore")}
        >
          By Ore
        </button>
      </div>

      {/* ========== By Location View ========== */}
      {view === "locations" && (
        <>
          {/* Filters */}
          <div className={shared.panel}>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Search locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={shared.input}
                style={{ flex: "1", minWidth: "180px" }}
                aria-label="Search locations"
              />
              <select
                value={filterParent}
                onChange={(e) => setFilterParent(e.target.value)}
                className={shared.select}
                aria-label="Filter by parent body"
              >
                <option value="all">All Systems</option>
                {parents.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <select
                value={filterDanger}
                onChange={(e) => setFilterDanger(e.target.value)}
                className={shared.select}
                aria-label="Filter by danger"
              >
                <option value="all">All Danger</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                value={filterOre}
                onChange={(e) => setFilterOre(e.target.value)}
                className={shared.select}
                aria-label="Filter by ore"
              >
                <option value="all">All Ores</option>
                {mineableOres.map((o) => (
                  <option key={o.name} value={o.name}>{o.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Cards */}
          <div className={shared.methodGrid}>
            {filtered.map((loc) => (
              <div key={loc.name} className={shared.methodCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{loc.name}</h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      {loc.type.replace("_", " ")} — {loc.parentBody}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: dangerColor[loc.danger],
                      padding: "0.15rem 0.5rem",
                      border: `1px solid ${dangerColor[loc.danger]}`,
                      borderRadius: "4px",
                    }}
                  >
                    {loc.danger} danger
                  </span>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                  <span>Gravity: {gravityLabel[loc.gravity]}</span>
                  <span>Atmo: {loc.atmosphere ? "Yes" : "No"}</span>
                </div>

                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0 0 0.75rem", lineHeight: 1.5 }}>
                  {loc.notes}
                </p>

                {loc.ores.length > 0 && (
                  <>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: "0.25rem" }}>
                      Ship Mining
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.5rem" }}>
                      {loc.ores.map((oreName) => {
                        const ore = ores.find((o) => o.name === oreName);
                        const isHighValue = ore && ore.valuePerSCU >= 20000;
                        return (
                          <span
                            key={oreName}
                            style={{
                              fontSize: "0.7rem",
                              padding: "0.15rem 0.45rem",
                              borderRadius: "3px",
                              background: isHighValue
                                ? "rgba(74, 158, 255, 0.15)"
                                : "rgba(255, 255, 255, 0.06)",
                              color: isHighValue ? "var(--accent)" : "var(--text-secondary)",
                              fontWeight: isHighValue ? 600 : 400,
                            }}
                          >
                            {oreName}
                          </span>
                        );
                      })}
                    </div>
                  </>
                )}

                {loc.fpsOres.length > 0 && (
                  <>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: "0.25rem" }}>
                      FPS / Hand Mining
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                      {loc.fpsOres.map((oreName) => (
                        <span
                          key={oreName}
                          style={{
                            fontSize: "0.7rem",
                            padding: "0.15rem 0.45rem",
                            borderRadius: "3px",
                            background: "rgba(74, 222, 128, 0.1)",
                            color: "#4ade80",
                          }}
                        >
                          {oreName}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className={shared.emptyMessage}>No locations match your filters.</div>
          )}
        </>
      )}

      {/* ========== By Ore View ========== */}
      {view === "by-ore" && (
        <div className={shared.panel}>
          <h2 className={shared.panelTitle}>Locations by Ore</h2>
          <div className={shared.tableWrap}>
            <table className={shared.table}>
              <thead>
                <tr>
                  <th>Ore</th>
                  <th>Value/SCU</th>
                  <th>Locations</th>
                </tr>
              </thead>
              <tbody>
                {mineableOres.map((ore) => {
                  const locs = locationsForOre(ore.name);
                  return (
                    <tr key={ore.name}>
                      <td>
                        <strong>{ore.name}</strong>
                        <br />
                        <span className={shared.tag}>{ore.type}</span>
                      </td>
                      <td>{ore.valuePerSCU.toLocaleString()}</td>
                      <td>
                        {locs.length === 0 ? (
                          <span style={{ color: "var(--text-secondary)" }}>—</span>
                        ) : (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                            {locs.map((loc) => (
                              <span
                                key={loc.name}
                                style={{
                                  fontSize: "0.75rem",
                                  padding: "0.15rem 0.45rem",
                                  borderRadius: "3px",
                                  background: "rgba(255, 255, 255, 0.06)",
                                  color: dangerColor[loc.danger],
                                }}
                              >
                                {loc.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {/* FPS-only ores (not in ship mining ore list) */}
                {allFpsOreNames.map((oreName) => {
                  // Skip if already shown in ship ores above
                  if (mineableOres.some((o) => o.name === oreName)) return null;
                  const locs = fpsLocationsForOre(oreName);
                  return (
                    <tr key={oreName}>
                      <td>
                        <strong>{oreName}</strong>
                        <br />
                        <span className={shared.tag} style={{ background: "rgba(74, 222, 128, 0.1)", color: "#4ade80" }}>fps</span>
                      </td>
                      <td style={{ color: "var(--text-secondary)" }}>—</td>
                      <td>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                          {locs.map((loc) => (
                            <span
                              key={loc.name}
                              style={{
                                fontSize: "0.75rem",
                                padding: "0.15rem 0.45rem",
                                borderRadius: "3px",
                                background: "rgba(74, 222, 128, 0.06)",
                                color: "#4ade80",
                              }}
                            >
                              {loc.name}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
