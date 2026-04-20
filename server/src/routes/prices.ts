import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const pricesRouter = Router();

const UEX_API_URL = "https://api.uexcorp.space/2.0";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function getApiKey(): string {
  return process.env.UEX_API_KEY || "";
}

// --- Cache helpers ---

async function getCached<T>(key: string): Promise<T | null> {
  const entry = await prisma.priceCache.findUnique({ where: { cacheKey: key } });
  if (!entry) return null;
  if (new Date() > entry.expiresAt) {
    // Expired — delete and return null
    await prisma.priceCache.delete({ where: { cacheKey: key } }).catch(() => {});
    return null;
  }
  return entry.data as T;
}

async function setCache(key: string, data: unknown): Promise<void> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CACHE_TTL_MS);
  await prisma.priceCache.upsert({
    where: { cacheKey: key },
    update: { data: data as any, fetchedAt: now, expiresAt },
    create: { cacheKey: key, data: data as any, fetchedAt: now, expiresAt },
  });
}

async function fetchUEX(path: string): Promise<any> {
  if (!getApiKey()) {
    throw new Error("getApiKey() not configured");
  }

  const url = `${UEX_API_URL}/${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`UEX API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.status !== "ok") {
    throw new Error(`UEX API returned status: ${json.status}`);
  }

  return json.data;
}

// --- DTO mappers (never return raw UEX data) ---

interface CommodityPriceDTO {
  commodityName: string;
  terminalName: string;
  locationName: string;
  priceBuy: number;
  priceSell: number;
  scuBuy: number;
  scuSell: number;
  dateModified: string;
}

function mapCommodityPrice(raw: any): CommodityPriceDTO {
  return {
    commodityName: raw.commodity_name || "",
    terminalName: raw.terminal_name || "",
    locationName: [raw.city_name, raw.outpost_name, raw.space_station_name, raw.planet_name]
      .filter(Boolean).join(", ") || raw.terminal_name || "",
    priceBuy: raw.price_buy ?? 0,
    priceSell: raw.price_sell ?? 0,
    scuBuy: raw.scu_buy ?? 0,
    scuSell: raw.scu_sell ?? 0,
    dateModified: raw.date_modified || "",
  };
}

interface ItemPriceDTO {
  itemName: string;
  terminalName: string;
  locationName: string;
  priceBuy: number;
  priceSell: number;
  dateModified: string;
}

function mapItemPrice(raw: any): ItemPriceDTO {
  return {
    itemName: raw.item_name || "",
    terminalName: raw.terminal_name || "",
    locationName: [raw.city_name, raw.outpost_name, raw.space_station_name, raw.planet_name]
      .filter(Boolean).join(", ") || raw.terminal_name || "",
    priceBuy: raw.price_buy ?? 0,
    priceSell: raw.price_sell ?? 0,
    dateModified: raw.date_modified || "",
  };
}

// --- Endpoints (public — no auth required for price lookups) ---

// GET /api/prices/commodity/:name
pricesRouter.get("/commodity/:name", async (req, res) => {
  try {
    const name = req.params.name as string;
    if (!name || name.length < 2) {
      res.status(400).json({ success: false, error: "Name too short" });
      return;
    }

    const cacheKey = `commodity:${name.toLowerCase()}`;
    const cached = await getCached<CommodityPriceDTO[]>(cacheKey);
    if (cached) {
      res.json({ success: true, data: cached, cached: true });
      return;
    }

    const data = await fetchUEX(`commodities_prices?commodity_name=${encodeURIComponent(name)}`);
    const mapped = Array.isArray(data) ? data.map(mapCommodityPrice) : [];
    await setCache(cacheKey, mapped);

    res.json({ success: true, data: mapped, cached: false });
  } catch (err: any) {
    console.error("Price fetch error:", err.message);
    res.status(502).json({ success: false, error: "Unable to fetch prices" });
  }
});

// GET /api/prices/commodity — all commodity prices (heavy, cached aggressively)
pricesRouter.get("/commodity", async (req, res) => {
  try {
    const cacheKey = "commodity:all";
    const cached = await getCached<CommodityPriceDTO[]>(cacheKey);
    if (cached) {
      res.json({ success: true, data: cached, cached: true });
      return;
    }

    const data = await fetchUEX("commodities_prices_all");
    const mapped = Array.isArray(data) ? data.map(mapCommodityPrice) : [];
    await setCache(cacheKey, mapped);

    res.json({ success: true, data: mapped, cached: false });
  } catch (err: any) {
    console.error("Price fetch error:", err.message);
    res.status(502).json({ success: false, error: "Unable to fetch prices" });
  }
});

// GET /api/prices/item/:id
pricesRouter.get("/item/:id", async (req, res) => {
  try {
    const id = req.params.id as string;
    const cacheKey = `item:${id}`;
    const cached = await getCached<ItemPriceDTO[]>(cacheKey);
    if (cached) {
      res.json({ success: true, data: cached, cached: true });
      return;
    }

    const data = await fetchUEX(`items_prices?id_item=${encodeURIComponent(id)}`);
    const mapped = Array.isArray(data) ? data.map(mapItemPrice) : [];
    await setCache(cacheKey, mapped);

    res.json({ success: true, data: mapped, cached: false });
  } catch (err: any) {
    console.error("Price fetch error:", err.message);
    res.status(502).json({ success: false, error: "Unable to fetch prices" });
  }
});

// GET /api/prices/marketplace/:commodityName — UEX marketplace average for an item/commodity
pricesRouter.get("/marketplace/:name", async (req, res) => {
  try {
    const name = req.params.name as string;
    if (!name || name.length < 2) {
      res.status(400).json({ success: false, error: "Name too short" });
      return;
    }

    const cacheKey = `marketplace:${name.toLowerCase()}`;
    const cached = await getCached<any>(cacheKey);
    if (cached) {
      res.json({ success: true, data: cached, cached: true });
      return;
    }

    // Fetch marketplace averages and find exact name match
    const allAvgs = await fetchUEX("marketplace_averages_all");
    const nameL = name.toLowerCase();
    const match = Array.isArray(allAvgs)
      ? allAvgs.find((i: any) => i.item_name?.toLowerCase() === nameL)
      : null;

    const result = {
      name: match?.item_name || name,
      marketplaceBuy: match?.price_buy ?? 0,   // avg price players offer to buy
      marketplaceSell: match?.price_sell ?? 0,  // avg price players list to sell
    };

    await setCache(cacheKey, result);
    res.json({ success: true, data: result, cached: false });
  } catch (err: any) {
    console.error("Marketplace fetch error:", err.message);
    res.status(502).json({ success: false, error: "Unable to fetch marketplace data" });
  }
});

// GET /api/prices/marketplace-listings/:name — active player listings for a commodity
pricesRouter.get("/marketplace-listings/:name", async (req, res) => {
  try {
    const name = req.params.name as string;
    if (!name || name.length < 2) {
      res.status(400).json({ success: false, error: "Name too short" });
      return;
    }

    const cacheKey = `mk-listings:${name.toLowerCase()}`;
    const cached = await getCached<any[]>(cacheKey);
    if (cached) {
      res.json({ success: true, data: cached, cached: true });
      return;
    }

    // Fetch all active marketplace listings (limited to 500 by UEX)
    const allListings = await fetchUEX("marketplace_listings");
    const nameL = name.toLowerCase();
    const matched = Array.isArray(allListings)
      ? allListings.filter((l: any) =>
          l.title?.toLowerCase().includes(nameL) && !l.is_sold_out
        ).map((l: any) => ({
          title: l.title || "",
          price: Number(l.price) || 0,
          operation: l.operation || "",
          location: l.location || "",
          seller: l.user_name || l.user_username || "",
          quality: l.quality || 0,
          description: (l.description || "").substring(0, 200),
          dateAdded: l.date_added || 0,
        }))
      : [];

    // Also include sold out ones but mark them
    const soldOut = Array.isArray(allListings)
      ? allListings.filter((l: any) =>
          l.title?.toLowerCase().includes(nameL) && l.is_sold_out
        ).map((l: any) => ({
          title: l.title || "",
          price: Number(l.price) || 0,
          operation: l.operation || "",
          location: l.location || "",
          seller: l.user_name || l.user_username || "",
          quality: l.quality || 0,
          description: (l.description || "").substring(0, 200),
          dateAdded: l.date_added || 0,
          soldOut: true,
        }))
      : [];

    const result = [...matched, ...soldOut];
    await setCache(cacheKey, result);
    res.json({ success: true, data: result, cached: false });
  } catch (err: any) {
    console.error("Marketplace listings error:", err.message);
    res.status(502).json({ success: false, error: "Unable to fetch listings" });
  }
});

// GET /api/prices/refinery/capacities
pricesRouter.get("/refinery/capacities", async (req, res) => {
  try {
    const cacheKey = "refinery:capacities";
    const cached = await getCached<any[]>(cacheKey);
    if (cached) {
      res.json({ success: true, data: cached, cached: true });
      return;
    }

    const data = await fetchUEX("refineries_capacities");
    await setCache(cacheKey, data);

    res.json({ success: true, data, cached: false });
  } catch (err: any) {
    console.error("Price fetch error:", err.message);
    res.status(502).json({ success: false, error: "Unable to fetch refinery data" });
  }
});
