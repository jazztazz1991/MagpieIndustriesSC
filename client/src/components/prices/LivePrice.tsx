"use client";

import { useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import type { CommodityPrice } from "@/hooks/usePrices";

// Our data uses slightly different names than UEX for some commodities
const UEX_NAME_MAP: Record<string, string> = {
  Quantanium: "Quantainium",
  Aluminium: "Aluminum",
};

interface LivePriceProps {
  commodityName: string;
  /** compact = just the number, full = with location */
  mode?: "compact" | "full";
}

/**
 * Fetches live commodity price from UEX on demand.
 * Shows "Check price" button, then best sell price after click.
 */
interface MarketplaceData {
  name: string;
  marketplaceBuy: number;
  marketplaceSell: number;
}

export default function LivePrice({ commodityName, mode = "compact" }: LivePriceProps) {
  const [prices, setPrices] = useState<CommodityPrice[] | null>(null);
  const [marketplace, setMarketplace] = useState<MarketplaceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchPrice = useCallback(async () => {
    setLoading(true);
    const uexName = UEX_NAME_MAP[commodityName] || commodityName;

    // Fetch both terminal prices and marketplace average in parallel
    const [terminalRes, marketRes] = await Promise.all([
      apiFetch<CommodityPrice[]>(`/api/prices/commodity/${encodeURIComponent(uexName)}`),
      apiFetch<MarketplaceData>(`/api/prices/marketplace/${encodeURIComponent(uexName)}`),
    ]);

    if (terminalRes.success && terminalRes.data) setPrices(terminalRes.data);
    if (marketRes.success && marketRes.data) setMarketplace(marketRes.data);

    setLoading(false);
    setFetched(true);
  }, [commodityName]);

  if (!fetched) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); fetchPrice(); }}
        style={{
          padding: "0.15rem 0.4rem",
          fontSize: "0.7rem",
          background: "rgba(74, 222, 128, 0.08)",
          border: "1px solid rgba(74, 222, 128, 0.2)",
          borderRadius: "3px",
          color: "#4ade80",
          cursor: "pointer",
        }}
      >
        {loading ? "..." : "$"}
      </button>
    );
  }

  if (!prices || prices.length === 0) {
    return <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>—</span>;
  }

  const terminalPrices = prices ? prices.filter((p) => p.priceBuy > 0) : [];
  const bestTerminal = terminalPrices.length > 0
    ? terminalPrices.reduce((b, p) => p.priceBuy > b.priceBuy ? p : b, terminalPrices[0])
    : null;
  const mkSell = marketplace?.marketplaceSell || 0;  // avg player listing price

  if (!bestTerminal && !mkSell) {
    return <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>No price data</span>;
  }

  if (mode === "compact") {
    return (
      <span style={{ fontSize: "0.7rem", display: "inline-flex", gap: "0.35rem", alignItems: "center" }}>
        {bestTerminal && (
          <span style={{ color: "#4ade80", fontWeight: 600 }} title={`Best terminal: sell to ${bestTerminal.locationName}`}>
            {bestTerminal.priceBuy.toLocaleString()}
          </span>
        )}
        {mkSell > 0 && (
          <span style={{ color: "#c084fc", fontWeight: 600 }} title={`UEX avg sell price: ${mkSell.toLocaleString()}`}>
            ({mkSell.toLocaleString()})
          </span>
        )}
      </span>
    );
  }

  return (
    <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
      {bestTerminal && (
        <span style={{ color: "#4ade80" }}>
          Terminal: {bestTerminal.priceBuy.toLocaleString()} aUEC/SCU at {bestTerminal.locationName}
        </span>
      )}
      {mkSell > 0 && (
        <span style={{ color: "#c084fc" }}>
          UEX Avg: {mkSell.toLocaleString()} aUEC/SCU
        </span>
      )}
      <span style={{ color: "var(--text-secondary)", fontSize: "0.65rem" }}>via UEX</span>
    </div>
  );
}
