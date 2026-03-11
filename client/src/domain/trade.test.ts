import { describe, it, expect } from "vitest";
import { findTradeRoutes } from "./trade";

describe("findTradeRoutes", () => {
  it("returns an array with at least 10 profitable routes", () => {
    const routes = findTradeRoutes();
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBeGreaterThanOrEqual(10);
  });

  it("every route has required fields", () => {
    const routes = findTradeRoutes();
    for (const route of routes) {
      expect(route).toHaveProperty("from");
      expect(route).toHaveProperty("to");
      expect(route).toHaveProperty("commodity");
      expect(route).toHaveProperty("buyPrice");
      expect(route).toHaveProperty("sellPrice");
      expect(route).toHaveProperty("profitPerSCU");
    }
  });

  it("all routes have positive profit", () => {
    const routes = findTradeRoutes();
    for (const route of routes) {
      expect(route.profitPerSCU).toBeGreaterThan(0);
    }
  });

  it("sell price is always greater than buy price", () => {
    const routes = findTradeRoutes();
    for (const route of routes) {
      expect(route.sellPrice).toBeGreaterThan(route.buyPrice);
    }
  });

  it("routes are sorted by profitPerSCU descending", () => {
    const routes = findTradeRoutes();
    for (let i = 1; i < routes.length; i++) {
      expect(routes[i - 1].profitPerSCU).toBeGreaterThanOrEqual(routes[i].profitPerSCU);
    }
  });

  it("no route has same from and to location", () => {
    const routes = findTradeRoutes();
    for (const route of routes) {
      expect(route.from).not.toBe(route.to);
    }
  });

  it("profitPerSCU is correctly calculated", () => {
    const routes = findTradeRoutes();
    for (const route of routes) {
      const expected = Math.round((route.sellPrice - route.buyPrice) * 100) / 100;
      expect(route.profitPerSCU).toBe(expected);
    }
  });
});
