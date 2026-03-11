"use client";

import { useState, useMemo } from "react";
import { locations, locationTypes, type LocationType } from "@/data/locations";
import styles from "../guides/guides.module.css";
import locStyles from "./locations.module.css";

const typeColors: Record<LocationType, string> = {
  star: styles.tagCurrency,
  planet: styles.tagShip,
  moon: styles.tagTier2,
  city: styles.tagTier3,
  station: styles.tagWeapon,
  rest_stop: styles.tagComponent,
  outpost: styles.tagTier1,
  poi: styles.tagArmor,
};

export default function LocationsDatabase() {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterParent, setFilterParent] = useState<string>("all");
  const [search, setSearch] = useState("");

  const parents = useMemo(
    () =>
      [...new Set(locations.map((l) => l.parent).filter(Boolean))].sort() as string[],
    []
  );

  const filtered = locations.filter((l) => {
    if (filterType !== "all" && l.type !== filterType) return false;
    if (filterParent !== "all" && l.parent !== filterParent) return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Locations Database</h1>
      <p className={styles.subtitle}>
        Planets, moons, cities, stations, and points of interest in the Stanton
        system.
      </p>

      <div className={styles.filters}>
        <label htmlFor="location-search" className={locStyles.srOnly}>Search locations</label>
        <input
          id="location-search"
          type="text"
          placeholder="Search locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.input}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={styles.select}
          aria-label="Filter by location type"
        >
          <option value="all">All Types</option>
          {locationTypes.map((t) => (
            <option key={t} value={t}>
              {t.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>
        <select
          value={filterParent}
          onChange={(e) => setFilterParent(e.target.value)}
          className={styles.select}
          aria-label="Filter by parent location"
        >
          <option value="all">All Parents</option>
          {parents.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.cardGrid}>
        {filtered.map((loc) => (
          <div key={loc.name} className={styles.card}>
            <div className={styles.cardTitle}>
              {loc.name}
              <span className={`${typeColors[loc.type]} ${locStyles.typeTag}`}>
                {loc.type.replace("_", " ")}
              </span>
            </div>
            {loc.parent && (
              <div className={styles.cardMeta}>{loc.parent}</div>
            )}
            <div className={styles.cardDesc}>{loc.description}</div>
            {loc.features.length > 0 && (
              <div className={locStyles.featureList}>
                {loc.features.map((f) => (
                  <span
                    key={f}
                    className={locStyles.featureBadge}
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className={locStyles.emptyMessage}>
          No locations match your filters.
        </p>
      )}
    </div>
  );
}
