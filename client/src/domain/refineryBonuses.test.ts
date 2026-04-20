import { describe, it, expect } from "vitest";
import type { RefineryStation } from "@/data/refinery";
import { mergeStationBonuses, validateSubmission } from "./refineryBonuses";

const stations: RefineryStation[] = [
  { name: "Green Glade", location: "HUR-L1", bonuses: { Quantanium: 2, Gold: -3 } },
  { name: "Pyro Station", location: "PYRO-L1", bonuses: {} },
];

describe("mergeStationBonuses", () => {
  it("returns static-only bonuses when no submissions", () => {
    const merged = mergeStationBonuses(stations, []);
    const green = merged.get("Green Glade")!;
    expect(green.get("Quantanium")).toEqual({ value: 2, source: "static" });
    expect(green.get("Gold")).toEqual({ value: -3, source: "static" });
  });

  it("adds new crowd values to stations with empty static bonuses", () => {
    const merged = mergeStationBonuses(stations, [
      { stationName: "Pyro Station", oreName: "Quantanium", bonusPct: 5 },
    ]);
    const pyro = merged.get("Pyro Station")!;
    expect(pyro.get("Quantanium")).toEqual({ value: 5, source: "crowd" });
  });

  it("overrides static with crowd when both exist", () => {
    const merged = mergeStationBonuses(stations, [
      { stationName: "Green Glade", oreName: "Quantanium", bonusPct: 7 },
    ]);
    const green = merged.get("Green Glade")!;
    expect(green.get("Quantanium")).toEqual({ value: 7, source: "crowd" });
    expect(green.get("Gold")).toEqual({ value: -3, source: "static" }); // untouched
  });

  it("ignores submissions for unknown stations", () => {
    const merged = mergeStationBonuses(stations, [
      { stationName: "Unknown Station", oreName: "Quantanium", bonusPct: 5 },
    ]);
    expect(merged.has("Unknown Station")).toBe(false);
  });
});

describe("validateSubmission", () => {
  it("accepts valid input", () => {
    expect(validateSubmission({ stationName: "A", oreName: "B", bonusPct: 5 })).toBeNull();
    expect(validateSubmission({ stationName: "A", oreName: "B", bonusPct: -100 })).toBeNull();
    expect(validateSubmission({ stationName: "A", oreName: "B", bonusPct: 100 })).toBeNull();
  });

  it("rejects empty names", () => {
    expect(validateSubmission({ stationName: "", oreName: "B", bonusPct: 5 })).toBe("Station is required");
    expect(validateSubmission({ stationName: "A", oreName: "", bonusPct: 5 })).toBe("Ore is required");
    expect(validateSubmission({ stationName: "   ", oreName: "B", bonusPct: 5 })).toBe("Station is required");
  });

  it("rejects non-integer bonus", () => {
    expect(validateSubmission({ stationName: "A", oreName: "B", bonusPct: 5.5 })).toBe("Bonus must be a whole number");
    expect(validateSubmission({ stationName: "A", oreName: "B", bonusPct: NaN })).toBe("Bonus must be a whole number");
  });

  it("rejects out-of-range values", () => {
    expect(validateSubmission({ stationName: "A", oreName: "B", bonusPct: 101 })).toBe("Bonus must be between -100 and 100");
    expect(validateSubmission({ stationName: "A", oreName: "B", bonusPct: -101 })).toBe("Bonus must be between -100 and 100");
  });
});
