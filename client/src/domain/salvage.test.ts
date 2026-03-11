import { describe, it, expect } from "vitest";
import { calculateSalvageProfit } from "./salvage";
import type { ShipHull } from "@/data/salvage";

describe("calculateSalvageProfit", () => {
  const smallShip: ShipHull = {
    name: "Aurora MR",
    hullSCU: 3,
    structuralSCU: 1,
    category: "small",
  };

  const capitalShip: ShipHull = {
    name: "Javelin (derelict)",
    hullSCU: 200,
    structuralSCU: 80,
    category: "capital",
  };

  it("calculates RMC value correctly", () => {
    const result = calculateSalvageProfit(smallShip);
    // RMC price = 13500, hullSCU = 3
    expect(result.rmcValue).toBe(3 * 13500);
  });

  it("calculates construction material value correctly", () => {
    const result = calculateSalvageProfit(smallShip);
    // Construction price = 1500, structuralSCU = 1
    expect(result.constructionValue).toBe(1 * 1500);
  });

  it("total equals sum of RMC and construction values", () => {
    const result = calculateSalvageProfit(smallShip);
    expect(result.totalValue).toBe(result.rmcValue + result.constructionValue);
  });

  it("handles large ships with high SCU", () => {
    const result = calculateSalvageProfit(capitalShip);
    expect(result.rmcValue).toBe(200 * 13500);
    expect(result.constructionValue).toBe(80 * 1500);
    expect(result.totalValue).toBe(200 * 13500 + 80 * 1500);
  });

  it("handles zero SCU ship hull", () => {
    const emptyShip: ShipHull = {
      name: "Test",
      hullSCU: 0,
      structuralSCU: 0,
      category: "small",
    };
    const result = calculateSalvageProfit(emptyShip);
    expect(result.rmcValue).toBe(0);
    expect(result.constructionValue).toBe(0);
    expect(result.totalValue).toBe(0);
  });
});
