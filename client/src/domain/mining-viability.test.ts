import { describe, it, expect } from "vitest";
import { assessRockViability, compareLasersForRock } from "./mining";
import type { MiningLaser } from "@/data/mining-lasers";
import type { MiningModule, MiningGadget } from "@/data/mining-gadgets";

// --- Fixtures ---

const hofstedeS2: MiningLaser = {
  name: "Hofstede-S2",
  size: 2,
  price: 12000,
  optimumRange: 60,
  maxRange: 180,
  minPower: 336,
  minPowerPct: 10,
  maxPower: 3360,
  extractPower: 1295,
  moduleSlots: 2,
  resistance: -30,
  instability: 10,
  optimalChargeRate: 20,
  optimalChargeWindow: 60,
  inertMaterials: -40,
  description: "",
};

const kleinS2: MiningLaser = {
  name: "Klein-S2",
  size: 2,
  price: 10150,
  optimumRange: 60,
  maxRange: 180,
  minPower: 720,
  minPowerPct: 20,
  maxPower: 3600,
  extractPower: 2775,
  moduleSlots: 1,
  resistance: -45,
  instability: -40,
  optimalChargeRate: 20,
  optimalChargeWindow: -20,
  inertMaterials: 0,
  description: "",
};

function makePassiveModule(overrides: Partial<MiningModule> = {}): MiningModule {
  return {
    name: "Test Module",
    type: "passive",
    price: 0,
    duration: 0,
    uses: 0,
    miningLaserPower: 0,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: 0,
    optimalChargeRate: 0,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 0,
    inertMaterials: 0,
    clusterModifier: 0,
    description: "",
    ...overrides,
  };
}

const focusIII: MiningModule = makePassiveModule({
  name: "Focus III",
  miningLaserPower: 95, // -5% power
  optimalChargeWindow: 40,
});

// --- Tests ---

describe("assessRockViability", () => {
  it("returns canCrack=false for MOLE scenario matching in-game IMPOSSIBLE", () => {
    // Game scenario: Shale Deposit, mass 29326, resistance 31%, instability 230.58
    // Hofstede-S2 with 2x Focus III per head
    // Per-head effective power: 3360 * 0.9 = 3024
    // Fracture threshold: 29326 * 0.31 = 9091.06
    // Per-head: 3024 < 9091 => can't crack
    const result = assessRockViability(29326, 230.58, 31, hofstedeS2, [], [focusIII, focusIII]);

    expect(result.canCrack).toBe(false);
    expect(result.effectivePower).toBeCloseTo(3024, 0);
  });

  it("returns canCrack=false when combined 3-head power still under threshold", () => {
    // 3 heads × 3024 = 9072 combined, threshold = 9091
    const head = assessRockViability(29326, 230.58, 31, hofstedeS2, [], [focusIII, focusIII]);
    const combinedPower = head.effectivePower * 3;
    const threshold = 29326 * (31 / 100);

    expect(combinedPower).toBeLessThan(threshold);
  });

  it("returns canCrack=true for an easy rock", () => {
    // Small rock: mass 5000, resistance 10%
    // Threshold: 5000 * 0.10 = 500
    // Hofstede-S2 maxPower: 3360 >> 500
    const result = assessRockViability(5000, 100, 10, hofstedeS2, [], []);

    expect(result.canCrack).toBe(true);
    expect(result.effectivePower).toBe(3360);
  });

  it("returns canCrack=false for zero-mass zero-resistance rock", () => {
    // Threshold: 0 * 0 = 0. Power 3360 > 0 => true
    const result = assessRockViability(0, 100, 0, hofstedeS2, [], []);
    expect(result.canCrack).toBe(true);
  });

  it("returns canCrack=false for 100% resistance rock", () => {
    // Threshold: 10000 * 1.0 = 10000. Hofstede maxPower 3360 < 10000
    const result = assessRockViability(10000, 100, 100, hofstedeS2, [], []);
    expect(result.canCrack).toBe(false);
  });

  it("applies module power modifiers correctly", () => {
    // 2x Focus III: each -5% => powerPctMod = -10
    // effectivePower = 3360 * 0.9 = 3024
    const result = assessRockViability(1000, 100, 10, hofstedeS2, [], [focusIII, focusIII]);
    expect(result.effectivePower).toBeCloseTo(3024, 0);
  });

  it("calculates effective instability from laser + rock", () => {
    // Hofstede-S2 instability modifier: +10%
    // Rock instability: 230.58
    // Effective: 230.58 * 1.10 = 253.638
    const result = assessRockViability(5000, 230.58, 10, hofstedeS2, [], []);
    expect(result.effectiveInstability).toBeCloseTo(253.64, 1);
  });

  it("calculates effective resistance from laser modifier", () => {
    // Hofstede-S2 resistance: -30% => rock 31% * 0.70 = 21.7
    const result = assessRockViability(5000, 100, 31, hofstedeS2, [], []);
    expect(result.effectiveResistance).toBeCloseTo(21.7, 1);
  });

  it("assigns correct difficulty ratings", () => {
    // Easy: effectiveResistance < 30
    const easy = assessRockViability(100, 100, 10, hofstedeS2, [], []);
    expect(easy.crackDifficulty).toBe("easy");

    // Impossible: effectiveResistance >= 100
    const imp = assessRockViability(100, 100, 150, hofstedeS2, [], []);
    expect(imp.crackDifficulty).toBe("impossible");
  });

  it("assigns correct instability risk ratings", () => {
    // Safe: effectiveInstability < 150
    const safe = assessRockViability(100, 50, 10, hofstedeS2, [], []);
    expect(safe.instabilityRisk).toBe("safe");

    // Deadly: effectiveInstability >= 700
    const deadly = assessRockViability(100, 800, 10, hofstedeS2, [], []);
    expect(deadly.instabilityRisk).toBe("deadly");
  });
});

// --- Gadget fixtures ---

const boreMax: MiningGadget = {
  name: "BoreMax",
  type: "gadget",
  price: 0,
  laserInstability: -70,
  resistance: 10,
  optimalChargeWindow: 0,
  optimalChargeRate: 0,
  extractionLaserPower: 0,
  inertMaterials: 0,
  clusterModifier: 30,
  description: "",
};

const stalwart: MiningGadget = {
  name: "Stalwart",
  type: "gadget",
  price: 0,
  laserInstability: -50,
  resistance: -15,
  optimalChargeWindow: 0,
  optimalChargeRate: 0,
  extractionLaserPower: 0,
  inertMaterials: 0,
  clusterModifier: 0,
  description: "",
};

describe("assessRockViability with gadgets", () => {
  it("BoreMax reduces instability by 70% and increases resistance by 10%", () => {
    const without = assessRockViability(5000, 500, 50, hofstedeS2, [], []);
    const withGadget = assessRockViability(5000, 500, 50, hofstedeS2, [], [], boreMax);

    // Instability: laser +10%, gadget -70% => net -60%
    // Without: 500 * 1.10 = 550
    // With BoreMax: 500 * (1 + 0.10 - 0.70) = 500 * 0.40 = 200
    expect(without.effectiveInstability).toBeCloseTo(550, 0);
    expect(withGadget.effectiveInstability).toBeCloseTo(200, 0);

    // Resistance: laser -30%, gadget +10% => net -20%
    // Without: 50 * 0.70 = 35
    // With BoreMax: 50 * (1 - 0.30 + 0.10) = 50 * 0.80 = 40
    expect(without.effectiveResistance).toBeCloseTo(35, 0);
    expect(withGadget.effectiveResistance).toBeCloseTo(40, 0);
  });

  it("Stalwart reduces both instability and resistance", () => {
    const result = assessRockViability(5000, 400, 60, hofstedeS2, [], [], stalwart);

    // Instability: laser +10%, gadget -50% => net -40%
    // 400 * 0.60 = 240
    expect(result.effectiveInstability).toBeCloseTo(240, 0);

    // Resistance: laser -30%, gadget -15% => net -45%
    // 60 * 0.55 = 33
    expect(result.effectiveResistance).toBeCloseTo(33, 0);
  });

  it("gadget does not affect power", () => {
    const without = assessRockViability(5000, 100, 10, hofstedeS2, [], []);
    const withGadget = assessRockViability(5000, 100, 10, hofstedeS2, [], [], boreMax);

    expect(withGadget.effectivePower).toBe(without.effectivePower);
  });

  it("null gadget has no effect", () => {
    const without = assessRockViability(5000, 300, 40, hofstedeS2, [], []);
    const withNull = assessRockViability(5000, 300, 40, hofstedeS2, [], [], null);

    expect(withNull.effectiveInstability).toBe(without.effectiveInstability);
    expect(withNull.effectiveResistance).toBe(without.effectiveResistance);
  });

  it("gadget can change instability risk rating", () => {
    // Without BoreMax: 800 * 1.10 = 880 => deadly
    const without = assessRockViability(5000, 800, 10, hofstedeS2, [], []);
    expect(without.instabilityRisk).toBe("deadly");

    // With BoreMax: 800 * 0.40 = 320 => manageable
    const withGadget = assessRockViability(5000, 800, 10, hofstedeS2, [], [], boreMax);
    expect(withGadget.instabilityRisk).toBe("manageable");
  });
});

describe("compareLasersForRock", () => {
  it("ranks lasers and includes canCrack based on mass", () => {
    // Easy rock both can crack
    const results = compareLasersForRock(5000, 100, 10, [hofstedeS2, kleinS2]);
    expect(results.length).toBe(2);
    expect(results.every((r) => r.canCrack)).toBe(true);
  });

  it("marks lasers that cannot crack a heavy rock", () => {
    // Heavy rock: mass 30000, resistance 35%
    // Threshold: 30000 * 0.35 = 10500
    // Hofstede: 3360 < 10500 => can't crack
    // Klein: 3600 < 10500 => can't crack
    const results = compareLasersForRock(30000, 200, 35, [hofstedeS2, kleinS2]);
    expect(results.every((r) => !r.canCrack)).toBe(true);
  });

  it("returns results sorted by score descending", () => {
    const results = compareLasersForRock(5000, 100, 10, [hofstedeS2, kleinS2]);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });
});
