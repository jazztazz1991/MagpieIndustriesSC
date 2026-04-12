import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

export interface CommodityPrice {
  terminalName: string;
  locationName: string;
  priceBuy: number;
  priceSell: number;
  scuBuy: number;
  scuSell: number;
  dateModified: string;
}

interface PriceResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  cached: boolean;
}

/**
 * Fetch commodity prices by name (e.g., "Quantanium", "Copper").
 * Results are cached server-side for 12 hours.
 */
export function useCommodityPrice(commodityName: string | null): PriceResult<CommodityPrice[]> {
  const [data, setData] = useState<CommodityPrice[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);

  useEffect(() => {
    if (!commodityName || commodityName.length < 2) {
      setData(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    apiFetch<CommodityPrice[]>(`/api/prices/commodity/${encodeURIComponent(commodityName)}`)
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data) {
          setData(res.data);
          setCached(!!(res as any).cached);
        } else {
          setError(res.error || "Failed to fetch prices");
        }
      })
      .catch(() => {
        if (!cancelled) setError("Network error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [commodityName]);

  return { data, loading, error, cached };
}

/**
 * Get the best terminal to SELL your ore at (highest priceBuy — what they pay you).
 */
export function getBestSellLocation(prices: CommodityPrice[] | null): CommodityPrice | null {
  if (!prices || prices.length === 0) return null;
  const withBuy = prices.filter((p) => p.priceBuy > 0);
  if (withBuy.length === 0) return null;
  return withBuy.reduce((best, p) =>
    p.priceBuy > best.priceBuy ? p : best
  , withBuy[0]);
}

/**
 * Get the cheapest terminal to BUY a commodity from (lowest priceSell — what they charge you).
 */
export function getCheapestBuyLocation(prices: CommodityPrice[] | null): CommodityPrice | null {
  if (!prices || prices.length === 0) return null;
  const withSell = prices.filter((p) => p.priceSell > 0);
  if (withSell.length === 0) return null;
  return withSell.reduce((best, p) =>
    p.priceSell < best.priceSell ? p : best
  , withSell[0]);
}
