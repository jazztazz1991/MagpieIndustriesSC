import { describe, it, expect } from "vitest";
import { calculateMiningProfit } from "./mining";
import type { Ore } from "@/data/mining";

const quantanium: Ore = {
  name: "Quantanium",
  type: "rock",
  valuePerSCU: 88000,
  instability: 0.95,
  resistance: 0.6,
  description: "Test ore",
};

const inert: Ore = {
  name: "Inert Material",
  type: "rock",
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
