import type { RefineryMethod } from "@/data/refinery";

// Base refinery time in minutes per SCU
const BASE_TIME_PER_SCU = 12;

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
  const processingCost = Math.round(inputSCU * method.costPerSCU);
  const netProfit = grossValue - processingCost;
  const timeMinutes =
    Math.round(inputSCU * BASE_TIME_PER_SCU * method.timeMultiplier * 10) / 10;
  const profitPerMinute =
    timeMinutes > 0 ? Math.round(netProfit / timeMinutes) : 0;

  return {
    outputSCU,
    grossValue,
    processingCost,
    netProfit,
    timeMinutes,
    profitPerMinute,
  };
}
