"use client";

import { useState, useMemo } from "react";
import { ores, Ore } from "@/data/mining";
import { calculateMiningProfit } from "@/domain/mining";
import styles from "../tools.module.css";

interface CompositionEntry {
  ore: Ore;
  percentage: number;
}

export default function MiningCalculator() {
  const [totalSCU, setTotalSCU] = useState(32);
  const [composition, setComposition] = useState<CompositionEntry[]>([
    { ore: ores[0], percentage: 30 },
  ]);

  const totalPercentage = composition.reduce(
    (sum, c) => sum + c.percentage,
    0
  );

  const results = useMemo(
    () => calculateMiningProfit(composition, totalSCU),
    [composition, totalSCU]
  );

  const totalValue = results.reduce((sum, r) => sum + r.value, 0);

  const addOre = () => {
    const unused = ores.find(
      (o) => !composition.some((c) => c.ore.name === o.name)
    );
    if (unused) {
      setComposition([...composition, { ore: unused, percentage: 10 }]);
    }
  };

  const removeOre = (index: number) => {
    setComposition(composition.filter((_, i) => i !== index));
  };

  const updateOre = (index: number, oreName: string) => {
    const ore = ores.find((o) => o.name === oreName)!;
    const updated = [...composition];
    updated[index] = { ...updated[index], ore };
    setComposition(updated);
  };

  const updatePercentage = (index: number, pct: number) => {
    const updated = [...composition];
    updated[index] = { ...updated[index], percentage: pct };
    setComposition(updated);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Mining Calculator</h1>
      <p className={styles.subtitle}>
        Input your rock composition to calculate profit per SCU.
      </p>

      <div className={styles.grid}>
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Rock Composition</h2>

          <label htmlFor="cargo-scu" className={styles.field}>
            <span>Cargo Capacity (SCU)</span>
            <input
              id="cargo-scu"
              type="number"
              value={totalSCU}
              onChange={(e) => setTotalSCU(Number(e.target.value))}
              min={1}
              className={styles.input}
            />
          </label>

          <div className={styles.compositionList}>
            {composition.map((entry, i) => (
              <div key={i} className={styles.compositionRow}>
                <select
                  value={entry.ore.name}
                  onChange={(e) => updateOre(i, e.target.value)}
                  className={styles.select}
                  aria-label={`Select ore ${i + 1}`}
                >
                  {ores.map((o) => (
                    <option key={o.name} value={o.name}>
                      {o.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={entry.percentage}
                  onChange={(e) => updatePercentage(i, Number(e.target.value))}
                  min={0}
                  max={100}
                  className={styles.pctInput}
                  aria-label={`Percentage for ${entry.ore.name}`}
                />
                <span className={styles.pctLabel}>%</span>
                <button
                  onClick={() => removeOre(i)}
                  className={styles.removeBtn}
                  aria-label={`Remove ${entry.ore.name}`}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className={styles.compositionFooter}>
            <button onClick={addOre} className={styles.addBtn} aria-label="Add ore to composition">
              + Add Ore
            </button>
            <span
              className={
                totalPercentage > 100 ? styles.overBudget : styles.budget
              }
            >
              Total: {totalPercentage}%
            </span>
          </div>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Profit Breakdown</h2>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ore</th>
                <th>SCU</th>
                <th>Value (aUEC)</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.ore}>
                  <td>{r.ore}</td>
                  <td>{r.scu}</td>
                  <td>{r.value.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={styles.totalRow}>
                <td>Total</td>
                <td>{results.reduce((s, r) => s + r.scu, 0).toFixed(2)}</td>
                <td>{totalValue.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Ore Reference</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Value/SCU</th>
              <th>Instability</th>
              <th>Resistance</th>
            </tr>
          </thead>
          <tbody>
            {ores
              .filter((o) => o.valuePerSCU > 0)
              .sort((a, b) => b.valuePerSCU - a.valuePerSCU)
              .map((o) => (
                <tr key={o.name}>
                  <td>{o.name}</td>
                  <td className={styles.tag}>{o.type}</td>
                  <td>{o.valuePerSCU.toLocaleString()}</td>
                  <td>{(o.instability * 100).toFixed(0)}%</td>
                  <td>{(o.resistance * 100).toFixed(0)}%</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
