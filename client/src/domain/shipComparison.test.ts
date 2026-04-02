import { describe, it, expect } from "vitest";
import {
  compareShips,
  getStatWinner,
  formatAUEC,
  type ShipForComparison,
} from "./shipComparison";

const aurora: ShipForComparison = {
  name: "Aurora MR",
  manufacturer: "RSI",
  role: "Starter / Light Freight",
  size: "small",
  crew: { min: 1, max: 1 },
  cargoSCU: 6,
  buyPriceAUEC: 235000,
  pledgeUSD: 30,
  speed: { scm: 185, max: 1170 },
  description: "Starter ship",
};

const freelancer: ShipForComparison = {
  name: "Freelancer",
  manufacturer: "MISC",
  role: "Medium Freight",
  size: "medium",
  crew: { min: 1, max: 4 },
  cargoSCU: 66,
  buyPriceAUEC: 1800000,
  pledgeUSD: 110,
  speed: { scm: 155, max: 980 },
  description: "Multi-role freighter",
};

const caterpillar: ShipForComparison = {
  name: "Caterpillar",
  manufacturer: "Drake",
  role: "Heavy Freight",
  size: "large",
  crew: { min: 1, max: 5 },
  cargoSCU: 576,
  buyPriceAUEC: null,
  pledgeUSD: 295,
  speed: { scm: 130, max: 870 },
  description: "Large hauler",
};

describe("compareShips", () => {
  it("compares two ships and identifies advantages", () => {
    const result = compareShips([aurora, freelancer]);

    expect(result.ships).toHaveLength(2);
    expect(result.ships[0].name).toBe("Aurora MR");
    expect(result.ships[1].name).toBe("Freelancer");

    expect(result.stats).toBeDefined();
    expect(result.stats.cargoSCU).toBeDefined();
    expect(result.stats.speedSCM).toBeDefined();
    expect(result.stats.speedMax).toBeDefined();
    expect(result.stats.crewMax).toBeDefined();
  });

  it("handles a single ship", () => {
    const result = compareShips([aurora]);

    expect(result.ships).toHaveLength(1);
    expect(result.stats.cargoSCU.values).toEqual([6]);
    expect(result.stats.cargoSCU.bestIndex).toBe(0);
  });

  it("handles three ships", () => {
    const result = compareShips([aurora, freelancer, caterpillar]);

    expect(result.ships).toHaveLength(3);
    expect(result.stats.cargoSCU.values).toEqual([6, 66, 576]);
    expect(result.stats.cargoSCU.bestIndex).toBe(2);
  });

  it("handles empty array", () => {
    const result = compareShips([]);
    expect(result.ships).toHaveLength(0);
  });
});

describe("getStatWinner", () => {
  it("returns the index of the highest value for higher-is-better stats", () => {
    expect(getStatWinner([6, 66, 576], "higher")).toBe(2);
  });

  it("returns the index of the lowest value for lower-is-better stats", () => {
    expect(getStatWinner([235000, 1800000], "lower")).toBe(0);
  });

  it("returns -1 when all values are null", () => {
    expect(getStatWinner([null, null], "lower")).toBe(-1);
  });

  it("ignores null values when finding the best", () => {
    expect(getStatWinner([null, 1800000], "lower")).toBe(1);
  });

  it("returns first index on tie", () => {
    expect(getStatWinner([100, 100, 200], "higher")).toBe(2);
    expect(getStatWinner([100, 100], "higher")).toBe(0);
  });
});

describe("formatAUEC", () => {
  it("formats thousands", () => {
    expect(formatAUEC(235000)).toBe("235,000");
  });

  it("formats millions", () => {
    expect(formatAUEC(1800000)).toBe("1,800,000");
  });

  it("returns dash for null", () => {
    expect(formatAUEC(null)).toBe("—");
  });

  it("formats zero", () => {
    expect(formatAUEC(0)).toBe("0");
  });
});
