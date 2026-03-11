"use client";

import { useState, useMemo } from "react";
import {
  salvageableShips,
  salvageMaterials,
  ShipHull,
} from "@/data/salvage";
import { calculateSalvageProfit } from "@/domain/salvage";
import styles from "../tools.module.css";

export default function SalvageCalculator() {
  const [selectedShip, setSelectedShip] = useState<ShipHull>(
    salvageableShips[0]
  );
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filteredShips =
    filterCategory === "all"
      ? salvageableShips
      : salvageableShips.filter((s) => s.category === filterCategory);

  const profit = useMemo(
    () => calculateSalvageProfit(selectedShip),
    [selectedShip]
  );

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Salvage Calculator</h1>
      <p className={styles.subtitle}>
        Estimate RMC and material yields from ship wrecks.
      </p>

      <div className={styles.grid}>
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Select Wreck</h2>

          <label className={styles.field}>
            <span>Filter by size</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={styles.select}
            >
              <option value="all">All Sizes</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="capital">Capital</option>
            </select>
          </label>

          <div className={styles.shipList}>
            {filteredShips.map((ship) => (
              <button
                key={ship.name}
                onClick={() => setSelectedShip(ship)}
                className={`${styles.shipBtn} ${
                  selectedShip.name === ship.name ? styles.shipBtnActive : ""
                }`}
                aria-label={`Select ${ship.name}`}
              >
                <span className={styles.shipName}>{ship.name}</span>
                <span className={styles.shipCategory}>{ship.category}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>
            Salvage Yield — {selectedShip.name}
          </h2>

          <div className={styles.statGrid}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>RMC Yield</span>
              <span className={styles.statValue}>
                {selectedShip.hullSCU} SCU
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Construction Materials</span>
              <span className={styles.statValue}>
                {selectedShip.structuralSCU} SCU
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>RMC Value</span>
              <span className={styles.statValue}>
                {profit.rmcValue.toLocaleString()} aUEC
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Construction Value</span>
              <span className={styles.statValue}>
                {profit.constructionValue.toLocaleString()} aUEC
              </span>
            </div>
            <div className={`${styles.stat} ${styles.statHighlight}`}>
              <span className={styles.statLabel}>Total Profit</span>
              <span className={styles.statValue}>
                {profit.totalValue.toLocaleString()} aUEC
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Material Prices</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Material</th>
              <th>Value/SCU (aUEC)</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {salvageMaterials.map((m) => (
              <tr key={m.name}>
                <td>{m.name}</td>
                <td>{m.valuePerSCU.toLocaleString()}</td>
                <td className={styles.descCell}>{m.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
