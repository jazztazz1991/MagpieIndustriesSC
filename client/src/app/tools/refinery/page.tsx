"use client";

import { useState, useMemo } from "react";
import { ores, Ore } from "@/data/mining";
import { refineryMethods } from "@/data/refinery";
import { calculateRefineryOutput } from "@/domain/refinery";
import styles from "../tools.module.css";

export default function RefineryOptimizer() {
  const valuableOres = ores.filter((o) => o.valuePerSCU > 0);
  const [selectedOre, setSelectedOre] = useState<Ore>(valuableOres[0]);
  const [inputSCU, setInputSCU] = useState(32);

  const comparisons = useMemo(
    () =>
      refineryMethods.map((method) => ({
        method,
        result: calculateRefineryOutput(
          inputSCU,
          selectedOre.valuePerSCU,
          method
        ),
      })),
    [inputSCU, selectedOre]
  );

  const bestProfit = Math.max(...comparisons.map((c) => c.result.netProfit));
  const bestEfficiency = Math.max(
    ...comparisons.map((c) => c.result.profitPerMinute)
  );

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Refinery Optimizer</h1>
      <p className={styles.subtitle}>
        Compare refinery methods by yield, time, and profit.
      </p>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Input</h2>
        <div className={styles.inputRow}>
          <label className={styles.field}>
            <span>Ore Type</span>
            <select
              value={selectedOre.name}
              onChange={(e) =>
                setSelectedOre(
                  valuableOres.find((o) => o.name === e.target.value)!
                )
              }
              className={styles.select}
              aria-label="Select ore type"
            >
              {valuableOres.map((o) => (
                <option key={o.name} value={o.name}>
                  {o.name} — {o.valuePerSCU.toLocaleString()} aUEC/SCU
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="input-scu" className={styles.field}>
            <span>Input SCU</span>
            <input
              id="input-scu"
              type="number"
              value={inputSCU}
              onChange={(e) => setInputSCU(Number(e.target.value))}
              min={1}
              className={styles.input}
            />
          </label>
        </div>
      </div>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Method Comparison</h2>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Method</th>
                <th>Yield</th>
                <th>Output SCU</th>
                <th>Gross Value</th>
                <th>Cost</th>
                <th>Net Profit</th>
                <th>Time</th>
                <th>Profit/Min</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map(({ method, result }) => (
                <tr key={method.name}>
                  <td>
                    <strong>{method.name}</strong>
                  </td>
                  <td>{(method.yieldMultiplier * 100).toFixed(0)}%</td>
                  <td>{result.outputSCU}</td>
                  <td>{result.grossValue.toLocaleString()}</td>
                  <td>{result.processingCost.toLocaleString()}</td>
                  <td
                    className={
                      result.netProfit === bestProfit
                        ? styles.bestValue
                        : undefined
                    }
                  >
                    {result.netProfit.toLocaleString()}
                  </td>
                  <td>{result.timeMinutes} min</td>
                  <td
                    className={
                      result.profitPerMinute === bestEfficiency
                        ? styles.bestValue
                        : undefined
                    }
                  >
                    {result.profitPerMinute.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Method Details</h2>
        <div className={styles.methodGrid}>
          {refineryMethods.map((m) => (
            <div key={m.name} className={styles.methodCard}>
              <h3>{m.name}</h3>
              <p>{m.description}</p>
              <div className={styles.methodStats}>
                <span>Yield: {(m.yieldMultiplier * 100).toFixed(0)}%</span>
                <span>Speed: {(m.timeMultiplier * 100).toFixed(0)}%</span>
                <span>Cost: {m.costPerSCU} aUEC/SCU</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
