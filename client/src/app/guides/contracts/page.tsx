"use client";

import { useMemo, useState } from "react";
import { contractTemplates } from "@/data/contracts";
import {
  categoryLabel,
  filterContracts,
  groupByCategory,
  type ContractCategory,
} from "@/domain/contracts";
import shared from "../../tools/tools.module.css";

type LawFilter = "all" | "lawful" | "unlawful";

export default function ContractsGuidePage() {
  const [category, setCategory] = useState<ContractCategory | "all">("all");
  const [lawFilter, setLawFilter] = useState<LawFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return filterContracts(contractTemplates, {
      category,
      illegal: lawFilter === "all" ? "all" : lawFilter === "unlawful",
      search,
    });
  }, [category, lawFilter, search]);

  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);

  const availableCategories = useMemo(() => {
    const counts = new Map<ContractCategory, number>();
    for (const c of contractTemplates) {
      counts.set(c.category, (counts.get(c.category) || 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  return (
    <div className={shared.page}>
      <h1 className={shared.title}>Contract Types</h1>
      <p className={shared.subtitle}>
        Every mission template the game ships with, grouped by category and
        issuer. {contractTemplates.length} contracts across {availableCategories.length} categories.
      </p>

      <div className={shared.panel}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search contracts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={shared.input}
            style={{ flex: 1, minWidth: 200 }}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ContractCategory | "all")}
            className={shared.select}
          >
            <option value="all">All categories</option>
            {availableCategories.map(([cat, count]) => (
              <option key={cat} value={cat}>
                {categoryLabel(cat)} ({count})
              </option>
            ))}
          </select>
          <select
            value={lawFilter}
            onChange={(e) => setLawFilter(e.target.value as LawFilter)}
            className={shared.select}
          >
            <option value="all">Lawful + Unlawful</option>
            <option value="lawful">Lawful only</option>
            <option value="unlawful">Unlawful only</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={shared.emptyMessage}>No contracts match those filters.</div>
      ) : (
        grouped.map((group) => (
          <section key={group.category} style={{ marginTop: "1.5rem" }}>
            <h2 className={shared.panelTitle}>
              {categoryLabel(group.category)}
              <span style={{ fontWeight: 400, fontSize: "0.85rem", color: "var(--text-secondary)", marginLeft: "0.5rem" }}>
                ({group.contracts.length})
              </span>
            </h2>
            <div className={shared.methodGrid}>
              {group.contracts.map((c) => (
                <div key={c.id} className={shared.methodCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.35rem", gap: "0.5rem" }}>
                    <h3 style={{ margin: 0, fontSize: "0.95rem", wordBreak: "break-word" }}>{c.name}</h3>
                    {c.illegal && (
                      <span style={{
                        fontSize: "0.65rem",
                        padding: "0.1rem 0.4rem",
                        background: "rgba(248, 113, 113, 0.12)",
                        border: "1px solid rgba(248, 113, 113, 0.3)",
                        color: "#f87171",
                        borderRadius: 4,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}>
                        Unlawful
                      </span>
                    )}
                  </div>
                  <code style={{ fontSize: "0.7rem", color: "var(--text-secondary)", wordBreak: "break-all" }}>
                    {c.id}
                  </code>
                  {c.issuers.length > 0 ? (
                    <div style={{ marginTop: "0.6rem", display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                      {c.issuers.map((issuer) => (
                        <span
                          key={issuer}
                          style={{
                            fontSize: "0.7rem",
                            padding: "0.1rem 0.4rem",
                            background: "rgba(74, 158, 255, 0.12)",
                            border: "1px solid rgba(74, 158, 255, 0.25)",
                            color: "var(--accent)",
                            borderRadius: 4,
                          }}
                        >
                          {issuer}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div style={{ marginTop: "0.6rem", fontSize: "0.7rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                      No direct issuer mapping
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
