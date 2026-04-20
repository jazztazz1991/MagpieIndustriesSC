import { describe, it, expect } from "vitest";
import type { MiningLocation } from "@/data/mining-locations";
import type { Ore } from "@/data/mining";
import {
  filterLocations,
  DEFAULT_FILTERS,
  filtersToSearchParams,
  filtersFromSearchParams,
} from "./miningLocations";

const ores: Ore[] = [
  { name: "Quantanium", abbrev: "QUAN", type: "rock", rarity: "legendary", valuePerSCU: 88000, instability: 1000, resistance: 95, description: "" },
  { name: "Bexalite", abbrev: "BEX", type: "rock", rarity: "rare", valuePerSCU: 64000, instability: 600, resistance: 60, description: "" },
  { name: "Diamond", abbrev: "DIA", type: "gem", rarity: "uncommon", valuePerSCU: 8000, instability: 0, resistance: 40, description: "" },
  { name: "Iron", abbrev: "IRON", type: "metal", rarity: "common", valuePerSCU: 1500, instability: 0, resistance: 30, description: "" },
];

const oresByName = new Map(ores.map((o) => [o.name, o]));

const locations: MiningLocation[] = [
  { name: "Aaron Halo", type: "asteroid_belt", parentBody: "Stanton", gravity: "none", atmosphere: false, danger: "high", ores: ["Quantanium", "Iron"], fpsOres: [], notes: "" },
  { name: "Daymar", type: "moon", parentBody: "Crusader", gravity: "low", atmosphere: false, danger: "medium", ores: ["Diamond", "Bexalite"], fpsOres: ["Iron"], notes: "" },
  { name: "Lyria", type: "moon", parentBody: "Crusader", gravity: "low", atmosphere: false, danger: "low", ores: ["Iron"], fpsOres: [], notes: "" },
];

describe("filterLocations", () => {
  it("returns all with default filters", () => {
    expect(filterLocations(locations, DEFAULT_FILTERS, oresByName)).toHaveLength(3);
  });

  it("filters by parent body", () => {
    const result = filterLocations(locations, { ...DEFAULT_FILTERS, parentBody: "Crusader" }, oresByName);
    expect(result.map((l) => l.name)).toEqual(["Daymar", "Lyria"]);
  });

  it("filters by danger level", () => {
    const result = filterLocations(locations, { ...DEFAULT_FILTERS, danger: "high" }, oresByName);
    expect(result.map((l) => l.name)).toEqual(["Aaron Halo"]);
  });

  it("filters by specific ore (ship and fps)", () => {
    const shipOnly = filterLocations(locations, { ...DEFAULT_FILTERS, ore: "Quantanium" }, oresByName);
    expect(shipOnly.map((l) => l.name)).toEqual(["Aaron Halo"]);

    const alsoFps = filterLocations(locations, { ...DEFAULT_FILTERS, ore: "Iron" }, oresByName);
    expect(alsoFps.map((l) => l.name)).toEqual(["Aaron Halo", "Daymar", "Lyria"]);
  });

  it("filters by search (case-insensitive)", () => {
    const result = filterLocations(locations, { ...DEFAULT_FILTERS, search: "DAY" }, oresByName);
    expect(result.map((l) => l.name)).toEqual(["Daymar"]);
  });

  it("filters by rarity tier (matches if location has any ore of that rarity)", () => {
    const legendary = filterLocations(locations, { ...DEFAULT_FILTERS, rarity: "legendary" }, oresByName);
    expect(legendary.map((l) => l.name)).toEqual(["Aaron Halo"]);

    const rare = filterLocations(locations, { ...DEFAULT_FILTERS, rarity: "rare" }, oresByName);
    expect(rare.map((l) => l.name)).toEqual(["Daymar"]);
  });

  it("filters by ore type (rock/gem/metal)", () => {
    const gems = filterLocations(locations, { ...DEFAULT_FILTERS, oreType: "gem" }, oresByName);
    expect(gems.map((l) => l.name)).toEqual(["Daymar"]);

    const metals = filterLocations(locations, { ...DEFAULT_FILTERS, oreType: "metal" }, oresByName);
    expect(metals.map((l) => l.name)).toEqual(["Aaron Halo", "Lyria"]);
  });

  it("rarity filter ignores fpsOres (consistent with ship-mining focus)", () => {
    // Iron is common; Daymar only has Iron in fpsOres, but Diamond/Bexalite in ship ores
    const common = filterLocations(locations, { ...DEFAULT_FILTERS, rarity: "common" }, oresByName);
    expect(common.map((l) => l.name)).toEqual(["Aaron Halo", "Lyria"]);
    // Daymar excluded because its ship ores (Diamond, Bexalite) aren't common
  });

  it("combines multiple filters (AND)", () => {
    const result = filterLocations(
      locations,
      { ...DEFAULT_FILTERS, parentBody: "Crusader", danger: "low" },
      oresByName
    );
    expect(result.map((l) => l.name)).toEqual(["Lyria"]);
  });
});

describe("URL search params round-trip", () => {
  it("serializes and parses filters correctly", () => {
    const original = {
      ...DEFAULT_FILTERS,
      search: "daymar",
      parentBody: "Crusader",
      danger: "high",
      rarity: "legendary",
    };
    const params = filtersToSearchParams(original);
    const roundtripped = filtersFromSearchParams(params);
    expect(roundtripped).toEqual(original);
  });

  it("omits default ('all') values from params", () => {
    const params = filtersToSearchParams(DEFAULT_FILTERS);
    expect(params.toString()).toBe("");
  });

  it("returns defaults when params are empty", () => {
    expect(filtersFromSearchParams(new URLSearchParams())).toEqual(DEFAULT_FILTERS);
  });
});
