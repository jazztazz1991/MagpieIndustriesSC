import type { RefineryMethod } from "@/data/refinery";

// Seconds per CSCU — derived from in-game measurements at MIC-L1 (2026-03-31)
// These scale with relativeTime but not linearly
const SECONDS_PER_CSCU: Record<number, number> = {
  1: 0.065,   // XCR Reaction: 58s / 896 CSCU
  2: 0.136,   // Cormack Method: 122s / 920 CSCU
  3: 0.389,   // Kazen Winnowing: 349s / 896 CSCU
  4: 0.259,   // Gaskin Process: 232s / 896 CSCU
  5: 0.519,   // Electrostarolysis: 465s / 896 CSCU
  6: 1.039,   // Thermonatic (estimated from Pyrometric pattern)
  7: 1.039,   // Pyrometric Chromalysis: 931s / 896 CSCU
  8: 2.078,   // Ferron Exchange: 1862s / 896 CSCU
  9: 6.391,   // Dinyx Solventation: 5880s / 920 CSCU
};

// Cost per CSCU in aUEC at base capacity (no workload surcharge)
// Derived from in-game screenshots — costs at extreme workload were inflated,
// so these are approximate base rates from the relative cost tiers
const BASE_COST_PER_CSCU: Record<number, number> = {
  1: 0.054,   // Low cost: ~49 aUEC / 920 CSCU
  2: 0.108,   // Moderate: ~97 aUEC / 896 CSCU
  3: 0.327,   // High cost: ~293 aUEC / 896 CSCU
};

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
  const costRate = BASE_COST_PER_CSCU[method.relativeCost] ?? 0.108;
  const cost = Math.round(inputSCU * costRate);
  const netProfit = grossValue - cost;
  const secsPerCSCU = SECONDS_PER_CSCU[method.relativeTime] ?? 1;
  const timeMinutes =
    Math.round((inputSCU * secsPerCSCU / 60) * 10) / 10;
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
