"use client";

import { useState, useMemo } from "react";
import { tradeLocations, commodities } from "@/data/trade";
import { findTradeRoutes } from "@/domain/trade";
import styles from "../tools.module.css";

export default function TradeRoutePlanner() {
  const [cargoSCU, setCargoSCU] = useState(46);
  const [filterCommodity, setFilterCommodity] = useState("all");
  const [filterFrom, setFilterFrom] = useState("all");

  const allRoutes = useMemo(() => findTradeRoutes(), []);

  const filtered = allRoutes.filter((r) => {
    if (filterCommodity !== "all" && r.commodity !== filterCommodity) return false;
    if (filterFrom !== "all" && r.from !== filterFrom) return false;
    return true;
  });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Trade Route Planner</h1>
      <p className={styles.subtitle}>
        Find the most profitable trade routes based on commodity prices across
        Stanton.
      </p>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Filters</h2>
        <div className={styles.inputRow}>
          <label htmlFor="trade-cargo-scu" className={styles.field}>
            <span>Cargo Capacity (SCU)</span>
            <input
              id="trade-cargo-scu"
              type="number"
              value={cargoSCU}
              onChange={(e) => setCargoSCU(Number(e.target.value))}
              min={1}
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span>Commodity</span>
            <select
              value={filterCommodity}
              onChange={(e) => setFilterCommodity(e.target.value)}
              className={styles.select}
              aria-label="Filter by commodity"
            >
              <option value="all">All Commodities</option>
              {commodities.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                  {c.illegal ? " (illegal)" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span>Depart From</span>
            <select
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
              className={styles.select}
              aria-label="Filter by departure location"
            >
              <option value="all">Anywhere</option>
              {tradeLocations.map((l) => (
                <option key={l.name} value={l.name}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>
          Best Routes ({filtered.length} found)
        </h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Commodity</th>
                <th>Buy At</th>
                <th>Sell At</th>
                <th>Buy Price</th>
                <th>Sell Price</th>
                <th>Profit/SCU</th>
                <th>Total Profit ({cargoSCU} SCU)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 25).map((route, i) => (
                <tr key={`${route.from}-${route.to}-${route.commodity}-${i}`}>
                  <td>
                    <strong>{route.commodity}</strong>
                  </td>
                  <td>{route.from}</td>
                  <td>{route.to}</td>
                  <td>{route.buyPrice.toFixed(2)}</td>
                  <td>{route.sellPrice.toFixed(2)}</td>
                  <td className={styles.bestValue}>
                    {route.profitPerSCU.toFixed(2)}
                  </td>
                  <td className={styles.bestValue}>
                    {(route.profitPerSCU * cargoSCU).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}{" "}
                    aUEC
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className={styles.emptyMessage}>
            No profitable routes found for these filters.
          </p>
        )}
      </div>
    </div>
  );
}
