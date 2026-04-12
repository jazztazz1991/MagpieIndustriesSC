"use client";

import { useState, useMemo } from "react";
import { organizations } from "@/data/reputation";
import shared from "../tools.module.css";

export default function ReputationPage() {
  const [search, setSearch] = useState("");
  const [expandedOrg, setExpandedOrg] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return organizations;
    const q = search.toLowerCase();
    return organizations.filter((org) =>
      org.name.toLowerCase().includes(q) ||
      org.scopes.some((s) => s.displayName.toLowerCase().includes(q))
    );
  }, [search]);

  const toggleOrg = (name: string) => {
    setExpandedOrg((prev) => (prev === name ? null : name));
  };

  return (
    <div className={shared.page}>
      <h1 className={shared.title}>Reputation</h1>
      <p className={shared.subtitle}>
        Browse {organizations.length} organizations, their reputation scopes, and tier thresholds.
      </p>

      <input
        type="text"
        placeholder="Search organizations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={shared.input}
        style={{ marginBottom: "1.5rem", width: "100%", maxWidth: "400px" }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {filtered.map((org) => {
          const expanded = expandedOrg === org.name;
          const totalTiers = org.scopes.reduce((s, sc) => s + sc.tiers.length, 0);

          return (
            <div key={org.name}>
              <div
                onClick={() => toggleOrg(org.name)}
                style={{
                  padding: "0.75rem 1rem",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  borderRadius: expanded ? "8px 8px 0 0" : "8px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "border-color 0.15s",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "1rem" }}>{org.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.1rem" }}>
                    {org.scopes.length} scope{org.scopes.length !== 1 ? "s" : ""} · {totalTiers} tiers
                  </div>
                </div>
                <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", transition: "transform 0.2s", transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}>
                  &#9654;
                </span>
              </div>

              {expanded && (
                <div style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  borderTop: "none",
                  borderRadius: "0 0 8px 8px",
                  padding: "1rem",
                }}>
                  {org.scopes.map((scope) => (
                    <div key={scope.name} style={{ marginBottom: "1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--accent)" }}>
                          {scope.displayName}
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                          Ceiling: {scope.reputationCeiling.toLocaleString()}
                        </span>
                      </div>

                      <div className={shared.tableWrap}>
                        <table className={shared.table} style={{ fontSize: "0.85rem" }}>
                          <thead>
                            <tr>
                              <th>Tier</th>
                              <th>Min Reputation</th>
                              <th>Gated</th>
                              {scope.tiers.some((t) => t.driftReputation) && <th>Drift</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {scope.tiers.map((tier, i) => (
                              <tr key={i}>
                                <td style={{ fontWeight: 500 }}>{tier.name}</td>
                                <td>{tier.minReputation.toLocaleString()}</td>
                                <td>
                                  {tier.gated && (
                                    <span style={{ fontSize: "0.7rem", padding: "0.1rem 0.4rem", background: "rgba(250, 204, 21, 0.15)", color: "#facc15", borderRadius: "3px" }}>
                                      GATED
                                    </span>
                                  )}
                                </td>
                                {scope.tiers.some((t) => t.driftReputation) && (
                                  <td style={{ color: "var(--text-secondary)" }}>
                                    {tier.driftReputation ? `${tier.driftReputation > 0 ? "+" : ""}${tier.driftReputation} / ${tier.driftTimeHours}h` : "—"}
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className={shared.emptyMessage}>No organizations match your search.</div>
        )}
      </div>
    </div>
  );
}
