import type { Ore } from "@/data/mining";

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
