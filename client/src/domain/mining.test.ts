import { describe, it, expect } from "vitest";
import { calculateMiningProfit, qualityMultiplier, calculateMiningProfitWithQuality } from "./mining";
import type { Ore } from "@/data/mining";

const quantanium: Ore = {
  name: "Quantanium",
  abbrev: "QUAN",
  type: "rock",
  rarity: "legendary",
  valuePerSCU: 88000,
  instability: 850,
  resistance: 60,
  description: "Test ore",
};

const inert: Ore = {
  name: "Inert Material",
  abbrev: "INER",
  type: "rock",
  rarity: "common",
  valuePerSCU: 0,
  instability: 0,
  resistance: 0,
  description: "Worthless",
};

describe("calculateMiningProfit", () => {
  it("calculates profit for a single ore at 100%", () => {
    const result = calculateMiningProfit(
      [{ ore: quantanium, percentage: 100 }],
      32
    );
    expect(result).toHaveLength(1);
    expect(result[0].ore).toBe("Quantanium");
    expect(result[0].scu).toBe(32);
    expect(result[0].value).toBe(32 * 88000);
  });

  it("calculates profit for mixed composition", () => {
    const result = calculateMiningProfit(
      [
        { ore: quantanium, percentage: 40 },
        { ore: inert, percentage: 60 },
      ],
      100
    );
    expect(result).toHaveLength(2);
    expect(result[0].scu).toBe(40);
    expect(result[0].value).toBe(40 * 88000);
    expect(result[1].scu).toBe(60);
    expect(result[1].value).toBe(0);
  });

  it("returns empty array for empty composition", () => {
    const result = calculateMiningProfit([], 50);
    expect(result).toEqual([]);
  });

  it("handles zero SCU", () => {
    const result = calculateMiningProfit(
      [{ ore: quantanium, percentage: 50 }],
      0
    );
    expect(result[0].scu).toBe(0);
    expect(result[0].value).toBe(0);
  });

  it("rounds SCU to 2 decimal places", () => {
    const result = calculateMiningProfit(
      [{ ore: quantanium, percentage: 33.33 }],
      10
    );
    // 10 * 33.33/100 = 3.333 -> rounded to 3.33
    expect(result[0].scu).toBe(3.33);
  });

  it("rounds value to nearest integer", () => {
    const ore: Ore = { ...quantanium, valuePerSCU: 3 };
    const result = calculateMiningProfit(
      [{ ore, percentage: 33.33 }],
      10
    );
    // scu=3.33, value=3.33*3=9.99 -> 10
    expect(result[0].value).toBe(10);
  });
});

// --- Quality System Tests ---

describe("qualityMultiplier", () => {
  it("returns 1.0 at baseline quality 500", () => {
    expect(qualityMultiplier(500)).toBe(1);
  });

  it("returns 2.0 at max quality 1000", () => {
    expect(qualityMultiplier(1000)).toBe(2);
  });

  it("returns 0 at quality 0", () => {
    expect(qualityMultiplier(0)).toBe(0);
  });

  it("returns 0.5 at quality 250", () => {
    expect(qualityMultiplier(250)).toBe(0.5);
  });

  it("returns 1.5 at quality 750", () => {
    expect(qualityMultiplier(750)).toBe(1.5);
  });

  it("clamps negative quality to 0", () => {
    expect(qualityMultiplier(-100)).toBe(0);
  });

  it("clamps quality above 1000 to 2.0", () => {
    expect(qualityMultiplier(1500)).toBe(2);
  });
});

describe("calculateMiningProfitWithQuality", () => {
  it("adjusts value based on quality", () => {
    const result = calculateMiningProfitWithQuality(
      [{ ore: quantanium, percentage: 100, quality: 500 }],
      32
    );
    expect(result).toHaveLength(1);
    expect(result[0].ore).toBe("Quantanium");
    expect(result[0].scu).toBe(32);
    expect(result[0].value).toBe(32 * 88000); // quality 500 = 1.0x
    expect(result[0].quality).toBe(500);
  });

  it("doubles value at quality 1000", () => {
    const result = calculateMiningProfitWithQuality(
      [{ ore: quantanium, percentage: 100, quality: 1000 }],
      32
    );
    expect(result[0].value).toBe(32 * 88000 * 2);
  });

  it("halves value at quality 250", () => {
    const result = calculateMiningProfitWithQuality(
      [{ ore: quantanium, percentage: 100, quality: 250 }],
      32
    );
    expect(result[0].value).toBe(32 * 88000 * 0.5);
  });

  it("handles same ore at different qualities", () => {
    const result = calculateMiningProfitWithQuality(
      [
        { ore: quantanium, percentage: 4, quality: 18 },
        { ore: quantanium, percentage: 83, quality: 202 },
      ],
      54
    );
    expect(result).toHaveLength(2);
    // Row 1: 54 * 0.04 = 2.16 SCU, quality 18 = 0.036x, value = 2.16 * 88000 * 0.036 = 6842
    expect(result[0].scu).toBe(2.16);
    expect(result[0].quality).toBe(18);
    // Row 2: 54 * 0.83 = 44.82 SCU, quality 202 = 0.404x, value = 44.82 * 88000 * 0.404 = 1,593,327
    expect(result[1].scu).toBe(44.82);
    expect(result[1].quality).toBe(202);
    // Both values should be positive and different
    expect(result[0].value).toBeLessThan(result[1].value);
    expect(result[0].value).toBeGreaterThan(0);
    expect(result[1].value).toBeGreaterThan(0);
  });

  it("inert materials at quality 0 return zero value", () => {
    const result = calculateMiningProfitWithQuality(
      [{ ore: inert, percentage: 100, quality: 0 }],
      32
    );
    expect(result[0].value).toBe(0);
  });

  it("defaults quality to 500 when not provided", () => {
    const result = calculateMiningProfitWithQuality(
      [{ ore: quantanium, percentage: 100 }],
      32
    );
    expect(result[0].value).toBe(32 * 88000);
    expect(result[0].quality).toBe(500);
  });
});
