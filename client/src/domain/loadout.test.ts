import { describe, it, expect } from "vitest";
import { calculatePowerDraw, calculateLoadoutSummary } from "./loadout";
import type { ShipComponent } from "@/data/loadout";

const weapon: ShipComponent = {
  name: "Mantis GT-220",
  type: "weapon",
  size: "S2",
  manufacturer: "Apocalypse Arms",
  grade: "A",
  stats: { dps: 225, range: 2100, powerDraw: 2.5, speed: 2100 },
  description: "Test weapon",
};

const shield: ShipComponent = {
  name: "Shimmer",
  type: "shield",
  size: "S1",
  manufacturer: "Seal Corp",
  grade: "A",
  stats: { shieldHP: 2400, regenRate: 120, powerDraw: 2.0 },
  description: "Test shield",
};

const quantumDrive: ShipComponent = {
  name: "Atlas",
  type: "quantum_drive",
  size: "S1",
  manufacturer: "RSI",
  grade: "A",
  stats: { quantumSpeed: 283, quantumRange: 108, spoolTime: 4.8, powerDraw: 2.5 },
  description: "Test quantum drive",
};

const powerPlant: ShipComponent = {
  name: "Regulus",
  type: "power_plant",
  size: "S1",
  manufacturer: "APC",
  grade: "A",
  stats: { powerOutput: 15, powerDraw: 0 },
  description: "Test power plant",
};

const cooler: ShipComponent = {
  name: "Bracer",
  type: "cooler",
  size: "S1",
  manufacturer: "J-Span",
  grade: "A",
  stats: { coolingRate: 180000, powerDraw: 0.8 },
  description: "Test cooler",
};

describe("calculatePowerDraw", () => {
  it("returns 0 for empty array", () => {
    expect(calculatePowerDraw([])).toBe(0);
  });

  it("sums powerDraw from all components", () => {
    const result = calculatePowerDraw([weapon, shield, quantumDrive, powerPlant, cooler]);
    // 2.5 + 2.0 + 2.5 + 0 + 0.8 = 7.8
    expect(result).toBeCloseTo(7.8, 2);
  });

  it("handles multiple weapons", () => {
    const result = calculatePowerDraw([weapon, weapon, weapon]);
    expect(result).toBeCloseTo(7.5, 2);
  });
});

describe("calculateLoadoutSummary", () => {
  it("returns zeros for empty loadout", () => {
    const result = calculateLoadoutSummary([]);
    expect(result).toEqual({
      totalDPS: 0,
      shieldHP: 0,
      powerDraw: 0,
      quantumSpeed: 0,
      quantumRange: 0,
    });
  });

  it("calculates summary for a full loadout", () => {
    const result = calculateLoadoutSummary([weapon, weapon, shield, quantumDrive, powerPlant, cooler]);
    expect(result.totalDPS).toBe(450); // 225 * 2
    expect(result.shieldHP).toBe(2400);
    expect(result.powerDraw).toBeCloseTo(10.3, 2); // 2.5+2.5+2.0+2.5+0+0.8
    expect(result.quantumSpeed).toBe(283);
    expect(result.quantumRange).toBe(108);
  });

  it("sums shield HP from multiple shields", () => {
    const result = calculateLoadoutSummary([shield, shield]);
    expect(result.shieldHP).toBe(4800);
  });

  it("only counts weapon DPS for totalDPS", () => {
    const result = calculateLoadoutSummary([shield, quantumDrive]);
    expect(result.totalDPS).toBe(0);
  });
});
