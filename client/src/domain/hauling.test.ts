import { describe, it, expect } from "vitest";
import {
  findBestRoutes,
  filterByMinProfit,
  filterByStart,
  type CommodityPriceRow,
} from "./hauling";

function row(overrides: Partial<CommodityPriceRow>): CommodityPriceRow {
  return {
    commodityName: "Laranite",
    terminalName: "Terminal A",
    locationName: "Location A",
    priceBuy: 0,
    priceSell: 0,
    scuBuy: 0,
    scuSell: 0,
    ...overrides,
  };
}

describe("findBestRoutes", () => {
  it("picks cheapest seller and highest buyer for each commodity", () => {
    const prices: CommodityPriceRow[] = [
      row({ terminalName: "A", priceSell: 3000, scuSell: 100 }),
      row({ terminalName: "B", priceSell: 2800, scuSell: 200 }),
      row({ terminalName: "C", priceBuy: 3500, scuBuy: 150 }),
      row({ terminalName: "D", priceBuy: 3600, scuBuy: 100 }),
    ];
    const routes = findBestRoutes(prices, 100);
    expect(routes).toHaveLength(1);
    expect(routes[0].buyTerminalName).toBe("B");
    expect(routes[0].buyPrice).toBe(2800);
    expect(routes[0].sellTerminalName).toBe("D");
    expect(routes[0].sellPrice).toBe(3600);
    expect(routes[0].profitPerScu).toBe(800);
  });

  it("caps runScu by min(buyStock, sellDemand, cargoCapacity)", () => {
    const prices: CommodityPriceRow[] = [
      row({ terminalName: "A", priceSell: 2000, scuSell: 50 }),
      row({ terminalName: "B", priceBuy: 3000, scuBuy: 80 }),
    ];
    const routes = findBestRoutes(prices, 200);
    expect(routes[0].runScu).toBe(50); // buyStock is the limiter
    expect(routes[0].profitPerRun).toBe(1000 * 50);
  });

  it("cargo capacity can be the limiter", () => {
    const prices: CommodityPriceRow[] = [
      row({ terminalName: "A", priceSell: 2000, scuSell: 500 }),
      row({ terminalName: "B", priceBuy: 3000, scuBuy: 500 }),
    ];
    const routes = findBestRoutes(prices, 32);
    expect(routes[0].runScu).toBe(32);
    expect(routes[0].profitPerRun).toBe(1000 * 32);
  });

  it("skips commodities with no profitable route", () => {
    const prices: CommodityPriceRow[] = [
      row({ commodityName: "X", terminalName: "A", priceSell: 5000, scuSell: 100 }),
      row({ commodityName: "X", terminalName: "B", priceBuy: 4000, scuBuy: 100 }),
    ];
    expect(findBestRoutes(prices, 100)).toHaveLength(0);
  });

  it("skips terminals with zero stock (seller) or zero demand (buyer)", () => {
    const prices: CommodityPriceRow[] = [
      row({ terminalName: "A", priceSell: 2000, scuSell: 0 }), // no stock — skip
      row({ terminalName: "B", priceSell: 2500, scuSell: 100 }),
      row({ terminalName: "C", priceBuy: 3500, scuBuy: 0 }), // no demand — skip
      row({ terminalName: "D", priceBuy: 3000, scuBuy: 100 }),
    ];
    const routes = findBestRoutes(prices, 100);
    expect(routes).toHaveLength(1);
    expect(routes[0].buyTerminalName).toBe("B");
    expect(routes[0].sellTerminalName).toBe("D");
  });

  it("skips self-routes (same terminal)", () => {
    const prices: CommodityPriceRow[] = [
      row({ terminalName: "Same", locationName: "Loc", priceSell: 2000, scuSell: 100, priceBuy: 3000, scuBuy: 100 }),
    ];
    expect(findBestRoutes(prices, 100)).toHaveLength(0);
  });

  it("sorts by profit per run descending", () => {
    const prices: CommodityPriceRow[] = [
      row({ commodityName: "Cheap", terminalName: "A", priceSell: 100, scuSell: 100 }),
      row({ commodityName: "Cheap", terminalName: "B", priceBuy: 200, scuBuy: 100 }),
      row({ commodityName: "Expensive", terminalName: "C", priceSell: 5000, scuSell: 100 }),
      row({ commodityName: "Expensive", terminalName: "D", priceBuy: 8000, scuBuy: 100 }),
    ];
    const routes = findBestRoutes(prices, 100);
    expect(routes[0].commodityName).toBe("Expensive");
    expect(routes[1].commodityName).toBe("Cheap");
  });

  it("ignores rows with blank commodity name", () => {
    const prices: CommodityPriceRow[] = [
      row({ commodityName: "", terminalName: "A", priceSell: 100, scuSell: 100 }),
      row({ commodityName: "", terminalName: "B", priceBuy: 200, scuBuy: 100 }),
    ];
    expect(findBestRoutes(prices, 100)).toHaveLength(0);
  });
});

describe("filterByMinProfit", () => {
  it("keeps only routes meeting threshold", () => {
    const routes = [
      { profitPerScu: 500 } as any,
      { profitPerScu: 1000 } as any,
      { profitPerScu: 100 } as any,
    ];
    expect(filterByMinProfit(routes, 500)).toHaveLength(2);
  });
});

describe("filterByStart", () => {
  it("filters routes by start location substring", () => {
    const routes = [
      { buyLocationName: "Port Tressler" } as any,
      { buyLocationName: "Area18" } as any,
      { buyLocationName: "Lorville" } as any,
    ];
    expect(filterByStart(routes, "port")).toHaveLength(1);
    expect(filterByStart(routes, "")).toHaveLength(3);
  });
});
