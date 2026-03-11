import { describe, it, expect } from "vitest";
import {
  getItemProgress,
  getContractProgress,
  calculateFavorsFromInventory,
  type TrackerInventory,
} from "./wikeloTracker";

describe("getItemProgress", () => {
  it("returns complete when inventory meets requirement", () => {
    const inventory: TrackerInventory = { Carinite: 50 };
    const result = getItemProgress(inventory, { item: "Carinite", quantity: 50 });

    expect(result).toEqual({
      item: "Carinite",
      have: 50,
      need: 50,
      complete: true,
    });
  });

  it("returns complete when inventory exceeds requirement", () => {
    const inventory: TrackerInventory = { Carinite: 100 };
    const result = getItemProgress(inventory, { item: "Carinite", quantity: 50 });

    expect(result).toEqual({
      item: "Carinite",
      have: 100,
      need: 50,
      complete: true,
    });
  });

  it("returns incomplete when inventory is short", () => {
    const inventory: TrackerInventory = { Carinite: 10 };
    const result = getItemProgress(inventory, { item: "Carinite", quantity: 50 });

    expect(result).toEqual({
      item: "Carinite",
      have: 10,
      need: 50,
      complete: false,
    });
  });

  it("returns 0 have when item is missing from inventory", () => {
    const inventory: TrackerInventory = {};
    const result = getItemProgress(inventory, { item: "Carinite", quantity: 50 });

    expect(result).toEqual({
      item: "Carinite",
      have: 0,
      need: 50,
      complete: false,
    });
  });
});

describe("getContractProgress", () => {
  it("calculates correct percentage with mixed progress", () => {
    const inventory: TrackerInventory = {
      Carinite: 20,
      "Saldynium (Ore)": 10,
    };
    const requirements = [
      { item: "Carinite", quantity: 20 },
      { item: "Saldynium (Ore)", quantity: 30 },
    ];
    const result = getContractProgress(inventory, requirements);

    expect(result.items).toHaveLength(2);
    expect(result.items[0].complete).toBe(true);
    expect(result.items[1].complete).toBe(false);
    // (20 + 10) / (20 + 30) = 30/50 = 60%
    expect(result.overallPercent).toBe(60);
    expect(result.allComplete).toBe(false);
  });

  it("returns 100% when all items are complete", () => {
    const inventory: TrackerInventory = {
      Carinite: 20,
      "Saldynium (Ore)": 30,
    };
    const requirements = [
      { item: "Carinite", quantity: 20 },
      { item: "Saldynium (Ore)", quantity: 30 },
    ];
    const result = getContractProgress(inventory, requirements);

    expect(result.overallPercent).toBe(100);
    expect(result.allComplete).toBe(true);
  });

  it("caps item contribution at required amount so overstocking does not inflate percentage", () => {
    const inventory: TrackerInventory = {
      Carinite: 200, // way more than needed
      "Saldynium (Ore)": 0,
    };
    const requirements = [
      { item: "Carinite", quantity: 20 },
      { item: "Saldynium (Ore)", quantity: 30 },
    ];
    const result = getContractProgress(inventory, requirements);

    // (20 + 0) / (20 + 30) = 40%
    expect(result.overallPercent).toBe(40);
    expect(result.allComplete).toBe(false);
  });

  it("handles empty requirements list", () => {
    const inventory: TrackerInventory = {};
    const result = getContractProgress(inventory, []);

    expect(result.items).toHaveLength(0);
    expect(result.overallPercent).toBe(100);
    expect(result.allComplete).toBe(true);
  });
});

describe("calculateFavorsFromInventory", () => {
  it("calculates correct favor count from multiple conversions", () => {
    const inventory: TrackerInventory = {
      Carinite: 150,
      "MG Scrip": 100,
    };
    const conversions = [
      { item: "Carinite", quantity: 50, favorsEarned: 1 },
      { item: "MG Scrip", quantity: 50, favorsEarned: 1 },
    ];
    // 150/50 = 3 favors from Carinite, 100/50 = 2 favors from MG Scrip = 5 total
    expect(calculateFavorsFromInventory(inventory, conversions)).toBe(5);
  });

  it("floors partial conversions", () => {
    const inventory: TrackerInventory = {
      Carinite: 75, // 1 full conversion (50), 25 left over
    };
    const conversions = [{ item: "Carinite", quantity: 50, favorsEarned: 1 }];

    expect(calculateFavorsFromInventory(inventory, conversions)).toBe(1);
  });

  it("returns 0 when inventory has no convertible items", () => {
    const inventory: TrackerInventory = {};
    const conversions = [{ item: "Carinite", quantity: 50, favorsEarned: 1 }];

    expect(calculateFavorsFromInventory(inventory, conversions)).toBe(0);
  });

  it("handles conversions with different favor yields", () => {
    const inventory: TrackerInventory = {
      "Irradiated Valakkar Pearl (Grade AAA)": 24,
    };
    const conversions = [
      { item: "Irradiated Valakkar Pearl (Grade AAA)", quantity: 12, favorsEarned: 1 },
    ];

    expect(calculateFavorsFromInventory(inventory, conversions)).toBe(2);
  });
});
