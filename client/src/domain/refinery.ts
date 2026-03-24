import type { RefineryMethod } from "@/data/refinery";

// Base refinery time in minutes per SCU
const BASE_TIME_PER_SCU = 12;

// Convert relative time (1-9) to a time multiplier
// Relative time 1 = fastest (0.3x), 9 = slowest (2.5x)
function timeMultiplier(relativeTime: number): number {
  return 0.3 + (relativeTime - 1) * (2.2 / 8);
}

// Convert relative cost (1-3) to cost per SCU in aUEC
// 1 = cheapest (80 aUEC/SCU), 3 = most expensive (200 aUEC/SCU)
function costPerSCU(relativeCost: number): number {
  return 80 + (relativeCost - 1) * 60;
}

export function calculateRefineryOutput(
  inputSCU: number,
  valuePerSCU: number,
  method: RefineryMethod
): {
  outputSCU: number;
  grossValue: number;
  processingCost: number;
  netProfit: number;
  timeMinutes: number;
  profitPerMinute: number;
} {
  const outputSCU =
    Math.round(inputSCU * method.yieldMultiplier * 100) / 100;
  const grossValue = Math.round(outputSCU * valuePerSCU);
  const cost = Math.round(inputSCU * costPerSCU(method.relativeCost));
  const netProfit = grossValue - cost;
  const timeMult = timeMultiplier(method.relativeTime);
  const timeMinutes =
    Math.round(inputSCU * BASE_TIME_PER_SCU * timeMult * 10) / 10;
  const profitPerMinute =
    timeMinutes > 0 ? Math.round(netProfit / timeMinutes) : 0;

  return {
    outputSCU,
    grossValue,
    processingCost: cost,
    netProfit,
    timeMinutes,
    profitPerMinute,
  };
}
