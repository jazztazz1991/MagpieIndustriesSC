import { describe, it, expect } from "vitest";
import { calculateRefineryOutput } from "./refinery";
import type { RefineryMethod } from "@/data/refinery";

// Updated yield values from in-game verification (2026-03-31)
// Time/cost use measured rates per CSCU

const cormack: RefineryMethod = {
  name: "Cormack Method",
  yieldMultiplier: 0.31,
  relativeTime: 2,
  relativeCost: 2,
  description: "Low yield fast method",
};

const dinyx: RefineryMethod = {
  name: "Dinyx Solventation",
  yieldMultiplier: 0.44,
  relativeTime: 9,
  relativeCost: 1,
  description: "High yield slow method",
};

describe("calculateRefineryOutput", () => {
  it("applies yield multiplier correctly", () => {
    const result = calculateRefineryOutput(10, 28000, cormack);
    // 10 * 0.31 = 3.10 SCU
    expect(result.outputSCU).toBe(3.1);
    expect(result.grossValue).toBe(Math.round(3.1 * 28000));
  });

  it("calculates processing cost from relativeCost", () => {
    const result = calculateRefineryOutput(10, 28000, cormack);
    // relativeCost 2 -> 0.108 aUEC/CSCU -> 10 * 0.108 = 1 (rounded)
    expect(result.processingCost).toBe(1);
  });

  it("calculates time from measured rates", () => {
    const result = calculateRefineryOutput(896, 28000, cormack);
    // relativeTime 2 -> 0.136 s/CSCU -> 896 * 0.136 / 60 = 2.0 min
    expect(result.timeMinutes).toBeCloseTo(2.0, 0);
  });

  it("calculates net profit correctly", () => {
    const result = calculateRefineryOutput(10, 28000, cormack);
    expect(result.netProfit).toBe(result.grossValue - result.processingCost);
  });

  it("calculates profit per minute", () => {
    const result = calculateRefineryOutput(100, 28000, cormack);
    expect(result.profitPerMinute).toBe(Math.round(result.netProfit / result.timeMinutes));
  });

  it("handles zero input SCU", () => {
    const result = calculateRefineryOutput(0, 28000, cormack);
    expect(result.outputSCU).toBe(0);
    expect(result.grossValue).toBe(0);
    expect(result.processingCost).toBe(0);
    expect(result.netProfit).toBe(0);
    expect(result.timeMinutes).toBe(0);
    expect(result.profitPerMinute).toBe(0);
  });

  it("handles zero value ore", () => {
    const result = calculateRefineryOutput(10, 0, cormack);
    expect(result.grossValue).toBe(0);
    expect(result.netProfit).toBe(-result.processingCost);
  });

  it("high yield method produces more output", () => {
    const resultDinyx = calculateRefineryOutput(10, 28000, dinyx);
    const resultCormack = calculateRefineryOutput(10, 28000, cormack);
    expect(resultDinyx.outputSCU).toBeGreaterThan(resultCormack.outputSCU);
  });
});
