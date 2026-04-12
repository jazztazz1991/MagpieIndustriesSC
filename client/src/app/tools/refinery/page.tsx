"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { Ore } from "@/data/mining";
import { ores as staticOres } from "@/data/mining";
import { refineryMethods as staticRefineryMethods } from "@/data/refinery";
import { useWithOverrides } from "@/hooks/useOverrides";
import { calculateRefineryOutput } from "@/domain/refinery";
import { qualityMultiplier } from "@/domain/mining";
import LivePrice from "@/components/prices/LivePrice";
import { apiFetch } from "@/lib/api";
import type { CommodityPrice } from "@/hooks/usePrices";
import styles from "../tools.module.css";

const UEX_NAME_MAP: Record<string, string> = {
  Quantanium: "Quantainium",
  Aluminium: "Aluminum",
};

interface OreEntry {
  ore: Ore;
  scu: number;
  quality: number;
}

interface MarketplaceListing {
  title: string;
  price: number;
  operation: string;
  location: string;
  seller: string;
  quality: number;
  description: string;
  dateAdded: number;
  soldOut?: boolean;
}

export default function RefineryOptimizer() {
  const { data: ores } = useWithOverrides("ore", staticOres, (o) => o.name);
  const { data: refineryMethods } = useWithOverrides("refinery_method", staticRefineryMethods, (m) => m.name);

  const valuableOres = useMemo(() => ores.filter((o) => o.valuePerSCU > 0), [ores]);

  const [batch, setBatch] = useState<OreEntry[]>([]);
  const [useLivePrices, setUseLivePrices] = useState(false);
  const [marketplaceModal, setMarketplaceModal] = useState<{ oreName: string; listings: MarketplaceListing[]; loading: boolean } | null>(null);

  const openMarketplace = useCallback(async (oreName: string) => {
    setMarketplaceModal({ oreName, listings: [], loading: true });
    const uexName = UEX_NAME_MAP[oreName] || oreName;
    const res = await apiFetch<MarketplaceListing[]>(`/api/prices/marketplace-listings/${encodeURIComponent(uexName)}`);
    setMarketplaceModal({
      oreName,
      listings: res.success && res.data ? res.data : [],
      loading: false,
    });
  }, []);
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [loadingPrices, setLoadingPrices] = useState(false);

  // Initialize batch when ores load
  const initBatch = batch.length === 0 && valuableOres.length > 0;
  if (initBatch) {
    setBatch([{ ore: valuableOres[0], scu: 32, quality: 500 }]);
  }

  // Fetch live prices for all ores in the batch
  const fetchLivePrices = useCallback(async () => {
    setLoadingPrices(true);
    const oreNames = [...new Set(batch.map((b) => b.ore.name))];
    const prices: Record<string, number> = {};

    await Promise.all(oreNames.map(async (name) => {
      const uexName = UEX_NAME_MAP[name] || name;
      const res = await apiFetch<CommodityPrice[]>(`/api/prices/commodity/${encodeURIComponent(uexName)}`);
      if (res.success && res.data) {
        const buyPrices = res.data.filter((p) => p.priceBuy > 0);
        if (buyPrices.length > 0) {
          const best = buyPrices.reduce((b, p) => p.priceBuy > b.priceBuy ? p : b, buyPrices[0]);
          prices[name] = best.priceBuy;
        }
      }
    }));

    setLivePrices(prices);
    setLoadingPrices(false);
  }, [batch]);

  // Fetch when toggle is turned on
  useEffect(() => {
    if (useLivePrices && Object.keys(livePrices).length === 0) {
      fetchLivePrices();
    }
  }, [useLivePrices]); // eslint-disable-line react-hooks/exhaustive-deps

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
          const baseValue = useLivePrices && livePrices[entry.ore.name]
            ? livePrices[entry.ore.name]
            : entry.ore.valuePerSCU;
          const adjustedValue = baseValue * qualityMultiplier(entry.quality);
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
    [batch, refineryMethods, useLivePrices, livePrices]
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <h2 className={styles.panelTitle} style={{ margin: 0 }}>Ore Batch</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", color: useLivePrices ? "#4ade80" : "var(--text-secondary)", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={useLivePrices}
                onChange={(e) => setUseLivePrices(e.target.checked)}
                style={{ accentColor: "#4ade80" }}
              />
              Use live prices
            </label>
            {useLivePrices && (
              <button
                onClick={fetchLivePrices}
                disabled={loadingPrices}
                style={{ padding: "0.2rem 0.5rem", fontSize: "0.7rem", background: "rgba(74, 222, 128, 0.1)", border: "1px solid rgba(74, 222, 128, 0.3)", borderRadius: "4px", color: "#4ade80", cursor: "pointer" }}
              >
                {loadingPrices ? "..." : "Refresh"}
              </button>
            )}
          </div>
        </div>

        {useLivePrices && Object.keys(livePrices).length > 0 && (
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.5rem", padding: "0.4rem 0.6rem", background: "rgba(74, 222, 128, 0.05)", borderRadius: "4px", border: "1px solid rgba(74, 222, 128, 0.15)" }}>
            Using live terminal prices:{" "}
            {Object.entries(livePrices).map(([name, price]) => (
              <span key={name} style={{ marginRight: "0.75rem" }}>
                <span style={{ color: "#4ade80", fontWeight: 600 }}>{name}</span>: {price.toLocaleString()} aUEC/SCU
              </span>
            ))}
          </div>
        )}

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
              <LivePrice commodityName={entry.ore.name} />
              <button
                onClick={() => openMarketplace(entry.ore.name)}
                style={{ padding: "0.2rem 0.45rem", fontSize: "0.65rem", background: "rgba(192, 132, 252, 0.1)", border: "1px solid rgba(192, 132, 252, 0.25)", borderRadius: "3px", color: "#c084fc", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                Marketplace
              </button>
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
      {/* Marketplace Modal */}
      {marketplaceModal && (
        <div
          onClick={() => setMarketplaceModal(null)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "var(--bg-secondary, #1a1d27)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", maxWidth: "600px", width: "90%", maxHeight: "80vh", overflowY: "auto" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
                Marketplace — {marketplaceModal.oreName}
              </h3>
              <button onClick={() => setMarketplaceModal(null)} style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: "1.3rem", cursor: "pointer" }}>&times;</button>
            </div>

            {marketplaceModal.loading ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading listings...</div>
            ) : marketplaceModal.listings.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>No marketplace listings found for {marketplaceModal.oreName}.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {marketplaceModal.listings.map((listing, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "0.75rem",
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      borderLeft: `3px solid ${listing.soldOut ? "var(--text-secondary)" : listing.operation === "sell" ? "#4ade80" : "#60a5fa"}`,
                      opacity: listing.soldOut ? 0.5 : 1,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{listing.title}</div>
                      <span style={{
                        fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
                        padding: "0.1rem 0.4rem", borderRadius: "3px",
                        background: listing.soldOut ? "rgba(255,255,255,0.06)" : listing.operation === "sell" ? "rgba(74,222,128,0.15)" : "rgba(96,165,250,0.15)",
                        color: listing.soldOut ? "var(--text-secondary)" : listing.operation === "sell" ? "#4ade80" : "#60a5fa",
                      }}>
                        {listing.soldOut ? "SOLD OUT" : listing.operation.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "#facc15", marginTop: "0.25rem" }}>
                      {listing.price.toLocaleString()} UEC
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem", display: "flex", gap: "1rem" }}>
                      <span>Seller: {listing.seller}</span>
                      {listing.location && <span>Location: {listing.location}</span>}
                    </div>
                    {listing.description && (
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.3rem", opacity: 0.7, lineHeight: 1.4 }}>
                        {listing.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
