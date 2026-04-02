"use client";

import { useState, useMemo } from "react";
import type { Ore } from "@/data/mining";
import { ores as staticOres } from "@/data/mining";
import { refineryMethods as staticRefineryMethods } from "@/data/refinery";
import { useWithOverrides } from "@/hooks/useOverrides";
import { calculateRefineryOutput } from "@/domain/refinery";
import { qualityMultiplier } from "@/domain/mining";
import styles from "../tools.module.css";

interface OreEntry {
  ore: Ore;
  scu: number;
  quality: number;
}

export default function RefineryOptimizer() {
  const { data: ores } = useWithOverrides("ore", staticOres, (o) => o.name);
  const { data: refineryMethods } = useWithOverrides("refinery_method", staticRefineryMethods, (m) => m.name);

  const valuableOres = useMemo(() => ores.filter((o) => o.valuePerSCU > 0), [ores]);

  const [batch, setBatch] = useState<OreEntry[]>([]);
  // Initialize batch when ores load
  const initBatch = batch.length === 0 && valuableOres.length > 0;
  if (initBatch) {
    setBatch([{ ore: valuableOres[0], scu: 32, quality: 500 }]);
  }

  const addOre = () => {
    const unused = valuableOres.find(
      (o) => !batch.some((b) => b.ore.name === o.name)
    );
    if (unused) setBatch([...batch, { ore: unused, scu: 8, quality: 500 }]);
  };

  const removeOre = (index: number) => {
    setBatch(batch.filter((_, i) => i !== index));
  };

  const updateOre = (index: number, oreName: string) => {
    const ore = valuableOres.find((o) => o.name === oreName)!;
    const updated = [...batch];
    updated[index] = { ...updated[index], ore };
    setBatch(updated);
  };

  const updateSCU = (index: number, scu: number) => {
    const updated = [...batch];
    updated[index] = { ...updated[index], scu };
    setBatch(updated);
  };

  const updateQuality = (index: number, quality: number) => {
    const updated = [...batch];
    updated[index] = { ...updated[index], quality };
    setBatch(updated);
  };

  // Calculate totals per method across all ores in the batch
  const comparisons = useMemo(
    () =>
      refineryMethods.map((method) => {
        const perOre = batch.map((entry) => {
          const adjustedValue = entry.ore.valuePerSCU * qualityMultiplier(entry.quality);
          return {
            ore: entry.ore.name,
            scu: entry.scu,
            quality: entry.quality,
            result: calculateRefineryOutput(entry.scu, adjustedValue, method),
          };
        });

        const totalOutputSCU = perOre.reduce((s, p) => s + p.result.outputSCU, 0);
        const totalGross = perOre.reduce((s, p) => s + p.result.grossValue, 0);
        const totalCost = perOre.reduce((s, p) => s + p.result.processingCost, 0);
        const totalProfit = totalGross - totalCost;
        const maxTime = Math.max(...perOre.map((p) => p.result.timeMinutes));
        const profitPerMinute = maxTime > 0 ? Math.round(totalProfit / maxTime) : 0;

        return { method, perOre, totalOutputSCU, totalGross, totalCost, totalProfit, maxTime, profitPerMinute };
      }),
    [batch, refineryMethods]
  );

  const bestProfit = Math.max(...comparisons.map((c) => c.totalProfit));
  const bestEfficiency = Math.max(...comparisons.map((c) => c.profitPerMinute));
  const totalInputSCU = batch.reduce((s, b) => s + b.scu, 0);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Refinery Optimizer</h1>
      <p className={styles.subtitle}>
        Compare refinery methods by yield, time, and profit. Add multiple ores for batch processing.
      </p>

      {/* Batch Input */}
      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Ore Batch</h2>

        <div className={styles.compositionList}>
          {batch.map((entry, i) => (
            <div key={i} className={styles.compositionRow}>
              <select
                value={entry.ore.name}
                onChange={(e) => updateOre(i, e.target.value)}
                className={styles.select}
                aria-label={`Select ore ${i + 1}`}
              >
                {valuableOres.map((o) => (
                  <option key={o.name} value={o.name}>
                    {o.name} — {o.valuePerSCU.toLocaleString()} aUEC/SCU
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={entry.scu}
                onChange={(e) => updateSCU(i, Number(e.target.value))}
                min={0.1}
                step={0.1}
                className={styles.pctInput}
                aria-label={`SCU for ${entry.ore.name}`}
              />
              <span className={styles.pctLabel}>SCU</span>
              <input
                type="number"
                value={entry.quality}
                onChange={(e) => updateQuality(i, Number(e.target.value))}
                min={0}
                max={1000}
                step={1}
                className={styles.pctInput}
                style={{ width: "80px" }}
                aria-label={`Quality for ${entry.ore.name}`}
              />
              <span className={styles.pctLabel}>RAW</span>
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
          <button onClick={addOre} className={styles.addBtn} aria-label="Add ore to batch">
            + Add Ore
          </button>
          <span className={styles.budget}>Total: {totalInputSCU.toFixed(1)} SCU</span>
        </div>
      </div>

      {/* Method Comparison */}
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
              {comparisons.map(({ method, totalOutputSCU, totalGross, totalCost, totalProfit, maxTime, profitPerMinute }) => (
                <tr key={method.name}>
                  <td>
                    <strong>{method.name}</strong>
                  </td>
                  <td>{(method.yieldMultiplier * 100).toFixed(0)}%</td>
                  <td>{totalOutputSCU.toFixed(2)}</td>
                  <td>{totalGross.toLocaleString()}</td>
                  <td>{totalCost.toLocaleString()}</td>
                  <td
                    className={totalProfit === bestProfit ? styles.bestValue : undefined}
                  >
                    {totalProfit.toLocaleString()}
                  </td>
                  <td>{maxTime} min</td>
                  <td
                    className={profitPerMinute === bestEfficiency ? styles.bestValue : undefined}
                  >
                    {profitPerMinute.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-Ore Breakdown (shown when multiple ores) */}
      {batch.length > 1 && (
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Per-Ore Breakdown (Best Method)</h2>
          {(() => {
            const best = comparisons.reduce((a, b) =>
              a.totalProfit > b.totalProfit ? a : b
            );
            return (
              <>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                  Using <strong>{best.method.name}</strong> — highest net profit
                </p>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Ore</th>
                        <th>Input SCU</th>
                        <th>Output SCU</th>
                        <th>Gross Value</th>
                        <th>Cost</th>
                        <th>Net Profit</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {best.perOre.map((p) => (
                        <tr key={p.ore}>
                          <td>{p.ore}</td>
                          <td>{p.scu}</td>
                          <td>{p.result.outputSCU}</td>
                          <td>{p.result.grossValue.toLocaleString()}</td>
                          <td>{p.result.processingCost.toLocaleString()}</td>
                          <td>{p.result.netProfit.toLocaleString()}</td>
                          <td>{p.result.timeMinutes} min</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className={styles.totalRow}>
                        <td>Total</td>
                        <td>{totalInputSCU.toFixed(1)}</td>
                        <td>{best.totalOutputSCU.toFixed(2)}</td>
                        <td>{best.totalGross.toLocaleString()}</td>
                        <td>{best.totalCost.toLocaleString()}</td>
                        <td>{best.totalProfit.toLocaleString()}</td>
                        <td>{best.maxTime} min</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Method Details */}
      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Method Details</h2>
        <div className={styles.methodGrid}>
          {refineryMethods.map((m) => (
            <div key={m.name} className={styles.methodCard}>
              <h3>{m.name}</h3>
              <p>{m.description}</p>
              <div className={styles.methodStats}>
                <span>Yield: {(m.yieldMultiplier * 100).toFixed(0)}%</span>
                <span>Speed: {m.relativeTime}/9</span>
                <span>Cost: {m.relativeCost}/3</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
