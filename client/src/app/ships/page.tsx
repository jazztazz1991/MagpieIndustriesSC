"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ships, manufacturers, sizes } from "@/data/ships";
import ShipCard from "@/components/ships/ShipCard";
import styles from "./ships.module.css";
import toolStyles from "../tools/tools.module.css";

export default function ShipDatabase() {
  const [search, setSearch] = useState("");
  const [filterMfg, setFilterMfg] = useState("all");
  const [filterSize, setFilterSize] = useState("all");
  const [sortBy, setSortBy] = useState<
    "name" | "price" | "cargo" | "speed"
  >("name");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = ships.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (filterMfg !== "all" && s.manufacturer !== filterMfg) return false;
      if (filterSize !== "all" && s.size !== filterSize) return false;
      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return (b.buyPriceAUEC ?? 0) - (a.buyPriceAUEC ?? 0);
        case "cargo":
          return b.cargoSCU - a.cargoSCU;
        case "speed":
          return b.speed.scm - a.speed.scm;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [search, filterMfg, filterSize, sortBy]);

  return (
    <div className={toolStyles.page}>
      <div className={styles.titleRow}>
        <h1 className={toolStyles.title}>Ship Database</h1>
        <Link href="/ships/compare" className={styles.compareLink}>
          Compare Ships
        </Link>
      </div>
      <p className={toolStyles.subtitle}>
        Browse specs, pricing, and comparisons for Star Citizen ships.
      </p>

      <div className={toolStyles.panel}>
        <div className={styles.filters}>
          <label htmlFor="ship-search" className={styles.srOnly}>Search ships</label>
          <input
            id="ship-search"
            type="text"
            placeholder="Search ships..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={toolStyles.input}
          />
          <select
            value={filterMfg}
            onChange={(e) => setFilterMfg(e.target.value)}
            className={toolStyles.select}
            aria-label="Filter by manufacturer"
          >
            <option value="all">All Manufacturers</option>
            {manufacturers.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={filterSize}
            onChange={(e) => setFilterSize(e.target.value)}
            className={toolStyles.select}
            aria-label="Filter by size"
          >
            <option value="all">All Sizes</option>
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className={toolStyles.select}
            aria-label="Sort ships"
          >
            <option value="name">Sort: Name</option>
            <option value="price">Sort: Price</option>
            <option value="cargo">Sort: Cargo</option>
            <option value="speed">Sort: Speed</option>
          </select>
        </div>
      </div>

      <div className={styles.shipGrid}>
        {filtered.map((ship) => (
          <ShipCard
            key={ship.name}
            ship={ship}
            expanded={expanded === ship.name}
            onToggle={() =>
              setExpanded(expanded === ship.name ? null : ship.name)
            }
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className={styles.empty}>No ships match your filters.</p>
      )}
    </div>
  );
}
