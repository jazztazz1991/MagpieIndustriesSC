import type { Ore } from "@/data/mining";
import type { MiningLaser } from "@/data/mining-lasers";
import type { MiningModule } from "@/data/mining-gadgets";

// --- Profit Calculation ---

export function calculateMiningProfit(
  composition: { ore: Ore; percentage: number }[],
  totalSCU: number
): { ore: string; scu: number; value: number }[] {
  return composition.map(({ ore, percentage }) => {
    const scu = totalSCU * (percentage / 100);
    const value = scu * ore.valuePerSCU;
    return { ore: ore.name, scu: Math.round(scu * 100) / 100, value: Math.round(value) };
  });
}

// --- Rock Viability ---
// Laser stats use percentage modifiers (e.g. resistance: -30 means reduces resistance by 30%)
// Module stats use percentage modifiers in the same way

export interface RockViability {
  canCrack: boolean;
  effectivePower: number;
  effectiveInstability: number;
  effectiveResistance: number;
  crackDifficulty: "easy" | "moderate" | "hard" | "extreme" | "impossible";
  instabilityRisk: "safe" | "manageable" | "dangerous" | "deadly";
  recommendation: string;
}

export function assessRockViability(
  rockInstability: number,
  rockResistance: number,
  laser: MiningLaser,
  activeModules: MiningModule[],
  passiveModules: MiningModule[]
): RockViability {
  // Start with laser's base modifiers (percentage)
  let powerPctMod = 0; // cumulative percentage modifier from modules
  let instabilityPctMod = laser.instability; // laser's own instability modifier
  let resistancePctMod = laser.resistance; // laser's own resistance modifier

  for (const m of [...passiveModules, ...activeModules]) {
    // miningLaserPower: 135 means set to 135% (active), or additive for passives
    // For simplicity, we treat all module modifiers as additive percentage changes
    if (m.miningLaserPower !== 0) {
      // Active modules express power as a percentage of base (135 = +35%)
      // Passive modules also express as percentage (115 = +15%, 85 = -15%)
      powerPctMod += (m.miningLaserPower - 100);
    }
    instabilityPctMod += m.laserInstability;
    resistancePctMod += m.resistance;
  }

  // Apply modifiers
  const effectivePower = laser.maxPower * (1 + powerPctMod / 100);
  const effectiveInstability = rockInstability * (1 + instabilityPctMod / 100);
  const effectiveResistance = rockResistance * (1 + resistancePctMod / 100);

  // Can crack if effective power exceeds half of effective resistance
  // (resistance is a percentage 0-100, power is raw units 0-4000+)
  // We compare power against resistance as a fraction of power needed
  const canCrack = effectivePower > 0 && effectiveResistance < 100;

  let crackDifficulty: RockViability["crackDifficulty"];
  if (effectiveResistance <= 0) crackDifficulty = "easy";
  else if (effectiveResistance < 30) crackDifficulty = "easy";
  else if (effectiveResistance < 50) crackDifficulty = "moderate";
  else if (effectiveResistance < 75) crackDifficulty = "hard";
  else if (effectiveResistance < 100) crackDifficulty = "extreme";
  else crackDifficulty = "impossible";

  let instabilityRisk: RockViability["instabilityRisk"];
  if (effectiveInstability < 150) instabilityRisk = "safe";
  else if (effectiveInstability < 400) instabilityRisk = "manageable";
  else if (effectiveInstability < 700) instabilityRisk = "dangerous";
  else instabilityRisk = "deadly";

  let recommendation = "";
  if (!canCrack) {
    recommendation = "This rock is too resistant for your current setup. Use a higher-power laser or Surge/Stampede modules.";
  } else if (instabilityRisk === "deadly" && crackDifficulty !== "easy") {
    recommendation = "Extremely dangerous. Use Brandt or Lifeline to stabilize, or switch to Klein laser for Quantanium.";
  } else if (instabilityRisk === "dangerous") {
    recommendation = "High instability. Feather your throttle carefully. Consider Brandt module for safety.";
  } else if (crackDifficulty === "hard" || crackDifficulty === "extreme") {
    recommendation = "Tough rock. Use Surge or Stampede to boost power. Time your charge window carefully.";
  } else {
    recommendation = "Should be a clean crack. Mine with confidence.";
  }

  return {
    canCrack,
    effectivePower: Math.round(effectivePower * 100) / 100,
    effectiveInstability: Math.round(effectiveInstability * 100) / 100,
    effectiveResistance: Math.round(effectiveResistance * 100) / 100,
    crackDifficulty,
    instabilityRisk,
    recommendation,
  };
}

// --- Should I Mine This Rock? ---

export interface RockAnalysis {
  totalValue: number;
  valuePerSCU: number;
  profitBreakdown: { ore: string; percentage: number; value: number }[];
  worthMining: boolean;
  reason: string;
}

export function analyzeRock(
  composition: { ore: Ore; percentage: number }[],
  totalSCU: number,
  minimumValuePerSCU: number = 5000
): RockAnalysis {
  const breakdown = composition.map(({ ore, percentage }) => {
    const scu = totalSCU * (percentage / 100);
    const value = scu * ore.valuePerSCU;
    return { ore: ore.name, percentage, value: Math.round(value) };
  });

  const totalValue = breakdown.reduce((sum, b) => sum + b.value, 0);
  const usedSCU = composition.reduce((sum, c) => sum + totalSCU * (c.percentage / 100), 0);
  const valuePerSCU = usedSCU > 0 ? Math.round(totalValue / usedSCU) : 0;

  const worthMining = valuePerSCU >= minimumValuePerSCU;
  let reason: string;
  if (valuePerSCU >= 40000) reason = "Exceptional rock. Mine immediately.";
  else if (valuePerSCU >= 20000) reason = "Great rock. Definitely worth mining.";
  else if (valuePerSCU >= minimumValuePerSCU) reason = "Decent rock. Worth the time if nothing better nearby.";
  else reason = `Below your ${minimumValuePerSCU.toLocaleString()} aUEC/SCU threshold. Skip it.`;

  return { totalValue, valuePerSCU, profitBreakdown: breakdown, worthMining, reason };
}

// --- Laser Comparison ---

export interface LaserComparison {
  laser: MiningLaser;
  effectivePower: number;
  effectiveInstability: number;
  effectiveResistance: number;
  canCrack: boolean;
  score: number;
}

export function compareLasersForRock(
  rockInstability: number,
  rockResistance: number,
  lasers: MiningLaser[],
  activeModules: MiningModule[] = [],
  passiveModules: MiningModule[] = []
): LaserComparison[] {
  return lasers
    .map((laser) => {
      const viability = assessRockViability(rockInstability, rockResistance, laser, activeModules, passiveModules);
      // Score: power contribution minus instability penalty
      const score = viability.effectivePower * 0.01 - viability.effectiveInstability * 0.05 + (viability.canCrack ? 50 : 0);
      return {
        laser,
        effectivePower: viability.effectivePower,
        effectiveInstability: viability.effectiveInstability,
        effectiveResistance: viability.effectiveResistance,
        canCrack: viability.canCrack,
        score: Math.round(score),
      };
    })
    .sort((a, b) => b.score - a.score);
}
