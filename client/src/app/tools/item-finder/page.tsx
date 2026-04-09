"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { findItem, type ItemSource } from "@/domain/itemFinder";
import shared from "../tools.module.css";

const TYPE_CONFIG: Record<ItemSource["type"], { label: string; color: string; bg: string; icon: string }> = {
  craftable: { label: "Craftable", color: "#fb923c", bg: "rgba(251, 146, 60, 0.1)", icon: "🔧" },
  loot: { label: "Loot Drop", color: "#facc15", bg: "rgba(250, 204, 21, 0.1)", icon: "📦" },
  wikelo_reward: { label: "Wikelo Reward", color: "#c084fc", bg: "rgba(192, 132, 252, 0.1)", icon: "🎁" },
  wikelo_requirement: { label: "Wikelo Requirement", color: "#f472b6", bg: "rgba(244, 114, 182, 0.1)", icon: "📋" },
  ore: { label: "Mineable Ore", color: "#4ade80", bg: "rgba(74, 222, 128, 0.1)", icon: "⛏" },
  blueprint_drop: { label: "Blueprint Source", color: "#60a5fa", bg: "rgba(96, 165, 250, 0.1)", icon: "📜" },
};

const TYPE_ORDER: ItemSource["type"][] = ["ore", "craftable", "loot", "wikelo_reward", "wikelo_requirement", "blueprint_drop"];

export default function ItemFinderPage() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ItemSource["type"] | "all">("all");

  const results = useMemo(() => findItem(query), [query]);

  const filtered = useMemo(() => {
    if (typeFilter === "all") return results;
    return results.filter((r) => r.type === typeFilter);
  }, [results, typeFilter]);

  // Group by type for display
  const grouped = useMemo(() => {
    const groups = new Map<ItemSource["type"], ItemSource[]>();
    for (const result of filtered) {
      const existing = groups.get(result.type) || [];
      existing.push(result);
      groups.set(result.type, existing);
    }
    return TYPE_ORDER
      .filter((t) => groups.has(t))
      .map((t) => ({ type: t, items: groups.get(t)! }));
  }, [filtered]);

  // Count per type for filter pills
  const typeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of results) {
      counts.set(r.type, (counts.get(r.type) || 0) + 1);
    }
    return counts;
  }, [results]);

  return (
    <div className={shared.page}>
      <h1 className={shared.title}>Item Finder</h1>
      <p className={shared.subtitle}>
        Search across crafting, loot, missions, mining, and Wikelo contracts.
      </p>

      {/* Search */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search for any item, ore, weapon, mission..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            fontSize: "1.1rem",
            background: "var(--bg-primary)",
            border: "2px solid var(--border)",
            borderRadius: "8px",
            color: "var(--text-primary)",
            outline: "none",
          }}
          onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; }}
          onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
        />
      </div>

      {/* Type filter pills */}
      {results.length > 0 && (
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <button
            onClick={() => setTypeFilter("all")}
            style={{
              padding: "0.3rem 0.65rem",
              borderRadius: "20px",
              border: "1px solid",
              borderColor: typeFilter === "all" ? "var(--accent)" : "var(--border)",
              background: typeFilter === "all" ? "rgba(74, 158, 255, 0.15)" : "transparent",
              color: typeFilter === "all" ? "var(--accent)" : "var(--text-secondary)",
              fontSize: "0.8rem",
              cursor: "pointer",
              fontWeight: typeFilter === "all" ? 600 : 400,
            }}
          >
            All ({results.length})
          </button>
          {TYPE_ORDER.filter((t) => typeCounts.has(t)).map((t) => {
            const config = TYPE_CONFIG[t];
            const active = typeFilter === t;
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(active ? "all" : t)}
                style={{
                  padding: "0.3rem 0.65rem",
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: active ? config.color : "var(--border)",
                  background: active ? config.bg : "transparent",
                  color: active ? config.color : "var(--text-secondary)",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {config.icon} {config.label} ({typeCounts.get(t)})
              </button>
            );
          })}
        </div>
      )}

      {/* Results */}
      {query.length >= 2 && results.length === 0 && (
        <div className={shared.emptyMessage}>
          No results for &quot;{query}&quot;. Try a different search term.
        </div>
      )}

      {query.length === 1 && (
        <div className={shared.emptyMessage}>
          Type at least 2 characters to search.
        </div>
      )}

      {grouped.map(({ type, items }) => {
        const config = TYPE_CONFIG[type];
        return (
          <div key={type} style={{ marginBottom: "1.5rem" }}>
            <div style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: config.color,
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}>
              {config.icon} {config.label} ({items.length})
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {items.map((item, i) => (
                <div
                  key={`${type}-${i}`}
                  style={{
                    padding: "0.75rem 1rem",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    borderLeft: `3px solid ${config.color}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                      {item.name}
                    </div>
                    {item.link && (
                      <Link
                        href={item.link}
                        style={{ fontSize: "0.75rem", color: "var(--accent)", whiteSpace: "nowrap" }}
                      >
                        Open tool →
                      </Link>
                    )}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem", lineHeight: 1.5 }}>
                    {item.detail}
                  </div>
                  {item.subDetail && (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.2rem", opacity: 0.8 }}>
                      {item.subDetail}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
