import type { ShipComponent } from "@/data/loadout";

export function calculatePowerDraw(components: ShipComponent[]): number {
  return components.reduce((sum, c) => sum + (c.stats.powerDraw ?? 0), 0);
}

export function calculateLoadoutSummary(components: ShipComponent[]): {
  totalDPS: number;
  shieldHP: number;
  powerDraw: number;
  quantumSpeed: number;
  quantumRange: number;
} {
  let totalDPS = 0;
  let shieldHP = 0;
  let powerDraw = 0;
  let quantumSpeed = 0;
  let quantumRange = 0;

  for (const c of components) {
    powerDraw += c.stats.powerDraw ?? 0;

    if (c.type === "weapon") {
      totalDPS += c.stats.dps ?? 0;
    }

    if (c.type === "shield") {
      shieldHP += c.stats.shieldHP ?? 0;
    }

    if (c.type === "quantum_drive") {
      quantumSpeed += c.stats.quantumSpeed ?? 0;
      quantumRange += c.stats.quantumRange ?? 0;
    }
  }

  return {
    totalDPS: Math.round(totalDPS * 100) / 100,
    shieldHP: Math.round(shieldHP * 100) / 100,
    powerDraw: Math.round(powerDraw * 100) / 100,
    quantumSpeed: Math.round(quantumSpeed * 100) / 100,
    quantumRange: Math.round(quantumRange * 100) / 100,
  };
}
