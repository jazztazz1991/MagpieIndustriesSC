"use client";

import { useState, useMemo } from "react";
import { crimes, jurisdictions } from "@/data/law";
import shared from "../tools.module.css";

type View = "crimes" | "jurisdictions";

export default function LawPage() {
  const [view, setView] = useState<View>("crimes");
  const [search, setSearch] = useState("");
  const [filterFelony, setFilterFelony] = useState<"all" | "felony" | "misdemeanor">("all");

  const filteredCrimes = useMemo(() => {
    const q = search.toLowerCase();
    return crimes.filter((c) => {
      if (filterFelony === "felony" && !c.isFelony) return false;
      if (filterFelony === "misdemeanor" && c.isFelony) return false;
      if (q && !c.name.toLowerCase().includes(q) && !c.trigger.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, filterFelony]);

  const filteredJurisdictions = useMemo(() => {
    const q = search.toLowerCase();
    return jurisdictions.filter((j) => {
      if (q && !j.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search]);

  const felonyCount = crimes.filter((c) => c.isFelony).length;
  const misdemeanorCount = crimes.length - felonyCount;

  return (
    <div className={shared.page}>
      <h1 className={shared.title}>Law System</h1>
      <p className={shared.subtitle}>
        {crimes.length} crimes ({felonyCount} felonies, {misdemeanorCount} misdemeanors) across {jurisdictions.length} jurisdictions.
      </p>

      {/* View toggle */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button
          className={view === "crimes" ? shared.shipBtnActive + " " + shared.shipBtn : shared.shipBtn}
          onClick={() => setView("crimes")}
        >
          Crimes
        </button>
        <button
          className={view === "jurisdictions" ? shared.shipBtnActive + " " + shared.shipBtn : shared.shipBtn}
          onClick={() => setView("jurisdictions")}
        >
          Jurisdictions
        </button>
      </div>

      {/* Search + filters */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder={view === "crimes" ? "Search crimes..." : "Search jurisdictions..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={shared.input}
          style={{ flex: "1", minWidth: "200px" }}
        />
        {view === "crimes" && (
          <>
            <button
              onClick={() => setFilterFelony("all")}
              style={{
                padding: "0.35rem 0.75rem", borderRadius: "20px", border: "1px solid",
                borderColor: filterFelony === "all" ? "var(--accent)" : "var(--border)",
                background: filterFelony === "all" ? "rgba(74, 158, 255, 0.15)" : "transparent",
                color: filterFelony === "all" ? "var(--accent)" : "var(--text-secondary)",
                fontSize: "0.8rem", cursor: "pointer", fontWeight: filterFelony === "all" ? 600 : 400,
              }}
            >
              All ({crimes.length})
            </button>
            <button
              onClick={() => setFilterFelony("felony")}
              style={{
                padding: "0.35rem 0.75rem", borderRadius: "20px", border: "1px solid",
                borderColor: filterFelony === "felony" ? "#f87171" : "var(--border)",
                background: filterFelony === "felony" ? "rgba(248, 113, 113, 0.15)" : "transparent",
                color: filterFelony === "felony" ? "#f87171" : "var(--text-secondary)",
                fontSize: "0.8rem", cursor: "pointer", fontWeight: filterFelony === "felony" ? 600 : 400,
              }}
            >
              Felonies ({felonyCount})
            </button>
            <button
              onClick={() => setFilterFelony("misdemeanor")}
              style={{
                padding: "0.35rem 0.75rem", borderRadius: "20px", border: "1px solid",
                borderColor: filterFelony === "misdemeanor" ? "#facc15" : "var(--border)",
                background: filterFelony === "misdemeanor" ? "rgba(250, 204, 21, 0.15)" : "transparent",
                color: filterFelony === "misdemeanor" ? "#facc15" : "var(--text-secondary)",
                fontSize: "0.8rem", cursor: "pointer", fontWeight: filterFelony === "misdemeanor" ? 600 : 400,
              }}
            >
              Misdemeanors ({misdemeanorCount})
            </button>
          </>
        )}
      </div>

      {/* Crimes view */}
      {view === "crimes" && (
        <div className={shared.panel}>
          <div className={shared.tableWrap}>
            <table className={shared.table}>
              <thead>
                <tr>
                  <th>Crime</th>
                  <th>Type</th>
                  <th>Trigger</th>
                  <th>CrimeStat</th>
                  <th>Lifetime</th>
                  <th>Fine Multiplier</th>
                </tr>
              </thead>
              <tbody>
                {filteredCrimes.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td>
                      <span style={{
                        fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
                        padding: "0.1rem 0.4rem", borderRadius: "3px",
                        background: c.isFelony ? "rgba(248, 113, 113, 0.15)" : "rgba(250, 204, 21, 0.15)",
                        color: c.isFelony ? "#f87171" : "#facc15",
                      }}>
                        {c.isFelony ? "FELONY" : "MISDEMEANOR"}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{c.trigger}</td>
                    <td>
                      {c.felonyMerits > 0 ? (
                        <span style={{ color: "#f87171", fontWeight: 600 }}>+{c.felonyMerits.toLocaleString()}</span>
                      ) : (
                        <span style={{ color: "var(--text-secondary)" }}>—</span>
                      )}
                    </td>
                    <td>
                      {c.lifetimeHours > 0 ? (
                        `${c.lifetimeHours}h`
                      ) : (
                        <span style={{ color: "var(--text-secondary)" }}>—</span>
                      )}
                    </td>
                    <td>
                      {c.fineMultiplier > 0 ? (
                        `${c.fineMultiplier}x`
                      ) : (
                        <span style={{ color: "var(--text-secondary)" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCrimes.length === 0 && (
            <div className={shared.emptyMessage}>No crimes match your search.</div>
          )}
        </div>
      )}

      {/* Jurisdictions view */}
      {view === "jurisdictions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filteredJurisdictions.map((j) => (
            <div key={j.id} className={shared.panel}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{j.name}</h3>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {j.crimes.length} crimes enforced
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  {j.isPrison && (
                    <span style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem", background: "rgba(248, 113, 113, 0.15)", color: "#f87171", borderRadius: "4px", fontWeight: 600 }}>
                      PRISON
                    </span>
                  )}
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--accent)" }}>
                    Base Fine: {j.baseFine > 0 ? `${j.baseFine.toLocaleString()} UEC` : "None"}
                  </span>
                </div>
              </div>

              {j.impoundRules.length > 0 && (
                <div style={{ marginBottom: "0.75rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.25rem" }}>
                    Impounding Rules
                  </div>
                  {j.impoundRules.map((rule, i) => (
                    <div key={i} style={{ fontSize: "0.85rem", padding: "0.25rem 0", display: "flex", gap: "1rem" }}>
                      <span style={{ fontWeight: 500 }}>{rule.trigger}</span>
                      <span style={{ color: "#f87171" }}>{rule.fineUEC.toLocaleString()} UEC</span>
                      <span style={{ color: "var(--text-secondary)" }}>{Math.round(rule.timeSeconds / 60)} min impound</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                {j.crimes.slice(0, 15).map((crimeId) => {
                  const crime = crimes.find((c) => c.id === crimeId);
                  return (
                    <span
                      key={crimeId}
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.15rem 0.45rem",
                        borderRadius: "3px",
                        background: crime?.isFelony ? "rgba(248, 113, 113, 0.1)" : "rgba(255, 255, 255, 0.06)",
                        color: crime?.isFelony ? "#f87171" : "var(--text-secondary)",
                      }}
                    >
                      {crime?.name || crimeId}
                    </span>
                  );
                })}
                {j.crimes.length > 15 && (
                  <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", padding: "0.15rem 0.45rem" }}>
                    +{j.crimes.length - 15} more
                  </span>
                )}
              </div>
            </div>
          ))}
          {filteredJurisdictions.length === 0 && (
            <div className={shared.emptyMessage}>No jurisdictions match your search.</div>
          )}
        </div>
      )}
    </div>
  );
}
