import { describe, it, expect } from "vitest";
import { calculateRefineryOutput } from "./refinery";
import type { RefineryMethod } from "@/data/refinery";

const cormack: RefineryMethod = {
  name: "Cormack Method",
  yieldMultiplier: 1.0,
  timeMultiplier: 1.0,
  costPerSCU: 160,
  description: "Balanced method",
};

const dinyx: RefineryMethod = {
  name: "Dinyx Solventation",
  yieldMultiplier: 0.86,
  timeMultiplier: 0.6,
  costPerSCU: 120,
  description: "Fast method",
};

describe("calculateRefineryOutput", () => {
  it("calculates 100% yield with Cormack method", () => {
    const result = calculateRefineryOutput(10, 28000, cormack);
    expect(result.outputSCU).toBe(10);
    expect(result.grossValue).toBe(280000);
    expect(result.processingCost).toBe(1600);
    expect(result.netProfit).toBe(278400);
  });

  it("applies yield multiplier correctly", () => {
    const result = calculateRefineryOutput(10, 28000, dinyx);
    expect(result.outputSCU).toBe(8.6);
    expect(result.grossValue).toBe(Math.round(8.6 * 28000));
  });

  it("calculates time based on BASE_TIME_PER_SCU (12 min)", () => {
    const result = calculateRefineryOutput(10, 28000, cormack);
    // 10 * 12 * 1.0 = 120 minutes
    expect(result.timeMinutes).toBe(120);
  });

  it("applies time multiplier correctly", () => {
    const result = calculateRefineryOutput(10, 28000, dinyx);
    // 10 * 12 * 0.6 = 72 minutes
    expect(result.timeMinutes).toBe(72);
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
    expect(result.netProfit).toBe(-1600);
  });
});
