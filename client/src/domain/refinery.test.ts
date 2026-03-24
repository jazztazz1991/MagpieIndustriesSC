import { describe, it, expect } from "vitest";
import { calculateRefineryOutput } from "./refinery";
import type { RefineryMethod } from "@/data/refinery";

// relativeTime 1-9 maps to multiplier: 0.3 + (t-1) * (2.2/8)
// relativeCost 1-3 maps to costPerSCU: 80 + (c-1) * 60

const cormack: RefineryMethod = {
  name: "Cormack Method",
  yieldMultiplier: 0.60,
  relativeTime: 2,
  relativeCost: 2,
  description: "Low yield fast method",
};

const dinyx: RefineryMethod = {
  name: "Dinyx Solventation",
  yieldMultiplier: 0.85,
  relativeTime: 9,
  relativeCost: 1,
  description: "High yield slow method",
};

describe("calculateRefineryOutput", () => {
  it("applies yield multiplier correctly", () => {
    const result = calculateRefineryOutput(10, 28000, cormack);
    // 10 * 0.60 = 6.00 SCU
    expect(result.outputSCU).toBe(6);
    expect(result.grossValue).toBe(Math.round(6 * 28000));
  });

  it("calculates processing cost from relativeCost", () => {
    const result = calculateRefineryOutput(10, 28000, cormack);
    // relativeCost 2 -> 80 + (2-1)*60 = 140 aUEC/SCU
    expect(result.processingCost).toBe(1400);
  });

  it("calculates time from relativeTime", () => {
    const result = calculateRefineryOutput(10, 28000, cormack);
    // relativeTime 2 -> 0.3 + (2-1) * 2.2/8 = 0.3 + 0.275 = 0.575
    // 10 * 12 * 0.575 = 69.0
    expect(result.timeMinutes).toBe(69);
  });

  it("calculates net profit correctly", () => {
    const result = calculateRefineryOutput(10, 28000, cormack);
    expect(result.netProfit).toBe(result.grossValue - result.processingCost);
  });

  it("calculates profit per minute", () => {
    const result = calculateRefineryOutput(10, 28000, cormack);
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
