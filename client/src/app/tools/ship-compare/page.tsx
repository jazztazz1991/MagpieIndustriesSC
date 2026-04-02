"use client";

import { useState, useMemo } from "react";
import { ships as staticShips, manufacturers, sizes } from "@/data/ships";
import type { Ship } from "@/data/ships";
import { compareShips, formatAUEC, type StatComparison } from "@/domain/shipComparison";
import { useWithOverrides } from "@/hooks/useOverrides";
import tools from "../tools.module.css";
import styles from "./ship-compare.module.css";

const MAX_SHIPS = 4;

function StatRow({
  stat,
  shipCount,
}: {
  stat: StatComparison;
  shipCount: number;
}) {
  return (
    <tr>
      <td className={styles.statLabel}>{stat.label}</td>
      {stat.values.map((val, i) => (
        <td
          key={i}
          className={i === stat.bestIndex && shipCount > 1 ? styles.best : undefined}
        >
          {val === null ? (
            <span className={styles.nullValue}>&mdash;</span>
          ) : stat.unit === "aUEC" ? (
            `${formatAUEC(val)} aUEC`
          ) : stat.unit === "USD" ? (
            `$${val}`
          ) : (
            `${val}${stat.unit ? ` ${stat.unit}` : ""}`
          )}
        </td>
      ))}
      {/* Pad empty columns if fewer than MAX_SHIPS */}
      {Array.from({ length: MAX_SHIPS - shipCount }).map((_, i) => (
        <td key={`empty-${i}`} />
      ))}
    </tr>
  );
}

export default function ShipComparePage() {
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [filterManufacturer, setFilterManufacturer] = useState("");
  const [filterSize, setFilterSize] = useState("");
  const [searchText, setSearchText] = useState("");
  const { data: ships } = useWithOverrides("ship", staticShips, (s) => s.name);

  const filteredShips = useMemo(() => {
    return ships.filter((s) => {
      if (filterManufacturer && s.manufacturer !== filterManufacturer) return false;
      if (filterSize && s.size !== filterSize) return false;
      if (searchText && !s.name.toLowerCase().includes(searchText.toLowerCase())) return false;
      return true;
    });
  }, [filterManufacturer, filterSize, searchText]);

  const selectedShips: Ship[] = useMemo(() => {
    return selectedNames
      .map((name) => ships.find((s) => s.name === name))
      .filter((s): s is Ship => s !== undefined);
  }, [selectedNames]);

  const comparison = useMemo(() => compareShips(selectedShips), [selectedShips]);

  function addShip(name: string) {
    if (selectedNames.length >= MAX_SHIPS) return;
    if (selectedNames.includes(name)) return;
    setSelectedNames([...selectedNames, name]);
  }

  function removeShip(index: number) {
    setSelectedNames(selectedNames.filter((_, i) => i !== index));
  }

  return (
    <div className={tools.page}>
      <h1 className={tools.title}>Ship Comparison</h1>
      <p className={tools.subtitle}>
        Compare up to {MAX_SHIPS} ships side by side. Select ships to see stats compared.
      </p>

      {/* Filters */}
      <div className={tools.panel}>
        <div className={tools.panelTitle}>Add Ships</div>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Search</span>
            <input
              type="text"
              className={tools.input}
              placeholder="Ship name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Manufacturer</span>
            <select
              className={tools.select}
              value={filterManufacturer}
              onChange={(e) => setFilterManufacturer(e.target.value)}
            >
              <option value="">All</option>
              {manufacturers.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Size</span>
            <select
              className={tools.select}
              value={filterSize}
              onChange={(e) => setFilterSize(e.target.value)}
            >
              <option value="">All</option>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={tools.shipList}>
          {filteredShips.slice(0, 50).map((ship) => (
            <button
              key={ship.name}
              className={`${tools.shipBtn} ${selectedNames.includes(ship.name) ? tools.shipBtnActive : ""}`}
              onClick={() => addShip(ship.name)}
              disabled={selectedNames.length >= MAX_SHIPS || selectedNames.includes(ship.name)}
            >
              <span className={tools.shipName}>{ship.name}</span>
              <span className={tools.shipCategory}>
                {ship.manufacturer} &middot; {ship.size}
              </span>
            </button>
          ))}
          {filteredShips.length > 50 && (
            <p className={tools.emptyMessage}>
              Showing first 50 results. Refine your search to see more.
            </p>
          )}
          {filteredShips.length === 0 && (
            <p className={tools.emptyMessage}>No ships match your filters.</p>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      {selectedShips.length > 0 && (
        <div className={tools.panel}>
          <div className={tools.panelTitle}>Comparison</div>
          <div className={tools.tableWrap}>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th />
                  {selectedShips.map((ship, i) => (
                    <th key={ship.name}>
                      <div className={styles.shipHeader}>
                        <span>
                          {ship.name}
                          <span className={styles.sizeTag}>{ship.size}</span>
                        </span>
                        <button
                          className={styles.removeShipBtn}
                          onClick={() => removeShip(i)}
                          aria-label={`Remove ${ship.name}`}
                        >
                          &times;
                        </button>
                      </div>
                    </th>
                  ))}
                  {Array.from({ length: MAX_SHIPS - selectedShips.length }).map((_, i) => (
                    <th key={`empty-${i}`} />
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Info rows */}
                <tr>
                  <td className={styles.statLabel}>Manufacturer</td>
                  {selectedShips.map((s) => (
                    <td key={s.name} className={styles.mfrRow}>
                      {s.manufacturer}
                    </td>
                  ))}
                  {Array.from({ length: MAX_SHIPS - selectedShips.length }).map((_, i) => (
                    <td key={`empty-${i}`} />
                  ))}
                </tr>
                <tr>
                  <td className={styles.statLabel}>Role</td>
                  {selectedShips.map((s) => (
                    <td key={s.name} className={styles.roleRow}>
                      {s.role}
                    </td>
                  ))}
                  {Array.from({ length: MAX_SHIPS - selectedShips.length }).map((_, i) => (
                    <td key={`empty-${i}`} />
                  ))}
                </tr>
                <tr>
                  <td className={styles.statLabel}>Crew</td>
                  {selectedShips.map((s) => (
                    <td key={s.name}>
                      {s.crew.min === s.crew.max
                        ? s.crew.min
                        : `${s.crew.min}–${s.crew.max}`}
                    </td>
                  ))}
                  {Array.from({ length: MAX_SHIPS - selectedShips.length }).map((_, i) => (
                    <td key={`empty-${i}`} />
                  ))}
                </tr>

                {/* Stat rows with highlighting */}
                <StatRow stat={comparison.stats.cargoSCU} shipCount={selectedShips.length} />
                <StatRow stat={comparison.stats.speedSCM} shipCount={selectedShips.length} />
                <StatRow stat={comparison.stats.speedMax} shipCount={selectedShips.length} />
                <StatRow stat={comparison.stats.crewMax} shipCount={selectedShips.length} />
                <StatRow stat={comparison.stats.buyPriceAUEC} shipCount={selectedShips.length} />
                <StatRow stat={comparison.stats.pledgeUSD} shipCount={selectedShips.length} />

                {/* Description row */}
                <tr>
                  <td className={styles.statLabel}>Description</td>
                  {selectedShips.map((s) => (
                    <td key={s.name} className={tools.descCell}>
                      {s.description}
                    </td>
                  ))}
                  {Array.from({ length: MAX_SHIPS - selectedShips.length }).map((_, i) => (
                    <td key={`empty-${i}`} />
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedShips.length === 0 && (
        <div className={tools.panel}>
          <p className={tools.emptyMessage}>
            Select ships above to start comparing.
          </p>
        </div>
      )}
    </div>
  );
}
