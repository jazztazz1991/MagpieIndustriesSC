"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  findBestRoutes,
  filterByMinProfit,
  filterByStart,
  type CommodityPriceRow,
} from "@/domain/hauling";
import shared from "../tools.module.css";

export default function CargoHaulingPage() {
  const [prices, setPrices] = useState<CommodityPriceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cargoCapacity, setCargoCapacity] = useState(96);
  const [minProfit, setMinProfit] = useState(0);
  const [startFilter, setStartFilter] = useState("");

  useEffect(() => {
    apiFetch<CommodityPriceRow[]>("/api/prices/commodity")
      .then((res) => {
        if (res.success && res.data) {
          setPrices(res.data);
        } else {
          setError("Price data unavailable. UEX may be down or rate-limited.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch prices.");
        setLoading(false);
      });
  }, []);

  const routes = useMemo(() => {
    const base = findBestRoutes(prices, cargoCapacity);
    const byProfit = filterByMinProfit(base, minProfit);
    return filterByStart(byProfit, startFilter);
  }, [prices, cargoCapacity, minProfit, startFilter]);

  return (
    <div className={shared.page}>
      <h1 className={shared.title}>Cargo Hauling Routes</h1>
      <p className={shared.subtitle}>
        Ranked buy/sell routes using live UEX prices. Pick a route, fly it, profit.
      </p>

      {/* Controls */}
      <div className={shared.panel}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              Cargo capacity (SCU)
            </span>
            <input
              type="number"
              min={1}
              max={9999}
              value={cargoCapacity}
              onChange={(e) => setCargoCapacity(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className={shared.input}
              style={{ width: "120px" }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              Min profit/SCU
            </span>
            <input
              type="number"
              min={0}
              value={minProfit}
              onChange={(e) => setMinProfit(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className={shared.input}
              style={{ width: "120px" }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1, minWidth: "200px" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              Starting location (contains)
            </span>
            <input
              type="text"
              value={startFilter}
              onChange={(e) => setStartFilter(e.target.value)}
              placeholder="e.g. Port Tressler, Area18..."
              className={shared.input}
            />
          </label>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className={shared.emptyMessage}>Loading live prices...</div>
      ) : error ? (
        <div className={shared.emptyMessage} style={{ color: "#f87171" }}>{error}</div>
      ) : routes.length === 0 ? (
        <div className={shared.emptyMessage}>No routes match your filters.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Showing {routes.length} route{routes.length !== 1 ? "s" : ""} (best first)
          </div>
          {routes.slice(0, 100).map((route, idx) => (
            <div
              key={`${route.commodityName}-${route.buyTerminalName}-${route.sellTerminalName}`}
              className={shared.methodCard}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    #{idx + 1}
                  </div>
                  <h3 style={{ margin: 0 }}>{route.commodityName}</h3>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4ade80" }}>
                    {route.profitPerRun.toLocaleString()} aUEC
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    {route.profitPerScu.toLocaleString()} / SCU × {route.runScu} SCU
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "0.75rem", alignItems: "center", marginTop: "0.5rem" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                    Buy at
                  </div>
                  <div style={{ fontWeight: 600 }}>{route.buyTerminalName}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {route.buyLocationName}
                  </div>
                  <div style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
                    <span style={{ color: "#fb923c" }}>{route.buyPrice.toLocaleString()}</span>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}> / SCU</span>
                    <span style={{ color: "var(--text-secondary)", marginLeft: "0.5rem", fontSize: "0.75rem" }}>
                      (stock: {route.buyStock.toLocaleString()})
                    </span>
                  </div>
                </div>
                <div style={{ color: "var(--accent)", fontSize: "1.5rem" }}>→</div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                    Sell at
                  </div>
                  <div style={{ fontWeight: 600 }}>{route.sellTerminalName}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {route.sellLocationName}
                  </div>
                  <div style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
                    <span style={{ color: "#4ade80" }}>{route.sellPrice.toLocaleString()}</span>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}> / SCU</span>
                    <span style={{ color: "var(--text-secondary)", marginLeft: "0.5rem", fontSize: "0.75rem" }}>
                      (demand: {route.sellDemand.toLocaleString()})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {routes.length > 100 && (
            <div className={shared.emptyMessage} style={{ fontSize: "0.8rem" }}>
              Showing top 100 of {routes.length}. Narrow filters to see more.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
