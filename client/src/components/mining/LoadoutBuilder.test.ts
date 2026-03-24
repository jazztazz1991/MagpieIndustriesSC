import { describe, it, expect } from "vitest";
import { createDefaultLoadout, resolveHeads } from "./LoadoutBuilder";
import type { MiningShip } from "@/data/mining-ships";
import type { MiningLaser } from "@/data/mining-lasers";
import type { MiningModule } from "@/data/mining-gadgets";

const ship: MiningShip = {
  name: "MOLE",
  manufacturer: "ARGO",
  size: "medium",
  cargoSCU: 96,
  miningTurrets: 3,
  crewMin: 1,
  crewMax: 4,
  description: "",
};

const laser: MiningLaser = {
  name: "Arbor S1",
  size: 1,
  price: 5000,
  optimumRange: 30,
  maxRange: 120,
  minPower: 120,
  minPowerPct: 10,
  maxPower: 1200,
  extractPower: 600,
  moduleSlots: 2,
  resistance: -20,
  instability: 15,
  optimalChargeRate: 10,
  optimalChargeWindow: 30,
  inertMaterials: -20,
  description: "",
};

const focusMod: MiningModule = {
  name: "Focus I",
  type: "passive",
  price: 10000,
  duration: 0,
  uses: 0,
  miningLaserPower: 95,
  laserInstability: 0,
  resistance: 0,
  optimalChargeWindow: 20,
  optimalChargeRate: 0,
  overchargeRate: 0,
  shatterDamage: 0,
  extractionLaserPower: 0,
  inertMaterials: 0,
  clusterModifier: 0,
  description: "",
};

describe("createDefaultLoadout", () => {
  it("creates a loadout with correct number of heads for the ship", () => {
    const loadout = createDefaultLoadout(ship, [laser]);
    expect(loadout.shipName).toBe("MOLE");
    expect(loadout.heads).toHaveLength(3);
    expect(loadout.name).toContain("MOLE");
  });

  it("assigns the first size-1 laser to each head", () => {
    const loadout = createDefaultLoadout(ship, [laser]);
    for (const head of loadout.heads) {
      expect(head.laserName).toBe("Arbor S1");
      expect(head.modules).toHaveLength(2); // moduleSlots = 2
    }
  });

  it("generates a unique id", () => {
    const a = createDefaultLoadout(ship, [laser]);
    const b = createDefaultLoadout(ship, [laser]);
    expect(a.id).not.toBe(b.id);
  });
});

describe("resolveHeads", () => {
  it("resolves heads with correct laser and modules", () => {
    const loadout = createDefaultLoadout(ship, [laser]);
    // Set module on first head
    loadout.heads[0].modules[0] = "Focus I";

    const resolved = resolveHeads(loadout, [laser], [], [focusMod]);

    expect(resolved).toHaveLength(3);
    expect(resolved[0].laser.name).toBe("Arbor S1");
    expect(resolved[0].passiveModules).toHaveLength(1);
    expect(resolved[0].passiveModules[0].name).toBe("Focus I");
    // Other heads have no modules
    expect(resolved[1].passiveModules).toHaveLength(0);
  });

  it("filters out heads with unknown laser names", () => {
    const loadout = createDefaultLoadout(ship, [laser]);
    loadout.heads[0].laserName = "NonexistentLaser";

    const resolved = resolveHeads(loadout, [laser], [], []);
    expect(resolved).toHaveLength(2); // one filtered out
  });

  it("separates active and passive modules", () => {
    const activeMod: MiningModule = { ...focusMod, name: "Surge", type: "active", miningLaserPower: 135 };
    const loadout = createDefaultLoadout(ship, [laser]);
    loadout.heads[0].modules = ["Focus I", "Surge"];

    const resolved = resolveHeads(loadout, [laser], [activeMod], [focusMod]);

    expect(resolved[0].activeModules).toHaveLength(1);
    expect(resolved[0].activeModules[0].name).toBe("Surge");
    expect(resolved[0].passiveModules).toHaveLength(1);
    expect(resolved[0].passiveModules[0].name).toBe("Focus I");
  });
});
