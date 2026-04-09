import { describe, it, expect } from "vitest";
import { findItem, type ItemSource } from "./itemFinder";

describe("findItem", () => {
  it("returns empty array for empty query", () => {
    expect(findItem("")).toEqual([]);
  });

  it("returns empty array for very short query", () => {
    expect(findItem("a")).toEqual([]);
  });

  it("finds Quantanium as a mineable ore", () => {
    const results = findItem("Quantanium");
    const oreResults = results.filter((r) => r.type === "ore");
    expect(oreResults.length).toBeGreaterThan(0);
    expect(oreResults[0].name).toBe("Quantanium");
  });

  it("finds Arrowhead as craftable", () => {
    const results = findItem("Arrowhead");
    const craftable = results.filter((r) => r.type === "craftable");
    expect(craftable.length).toBeGreaterThan(0);
    expect(craftable[0].name).toContain("Arrowhead");
  });

  it("finds Wikelo Favor as a wikelo requirement", () => {
    const results = findItem("Wikelo Favor");
    const reqs = results.filter((r) => r.type === "wikelo_requirement");
    expect(reqs.length).toBeGreaterThan(0);
  });

  it("finds items case-insensitively", () => {
    const results = findItem("arrowhead");
    expect(results.length).toBeGreaterThan(0);
  });

  it("finds partial matches", () => {
    const results = findItem("Arrow");
    const craftable = results.filter((r) => r.type === "craftable");
    expect(craftable.length).toBeGreaterThan(0);
  });

  it("returns multiple source types for items that appear in multiple systems", () => {
    // Copper is an ore AND a wikelo requirement (for crafting)
    const results = findItem("Copper");
    const types = new Set(results.map((r) => r.type));
    expect(types.size).toBeGreaterThan(1);
  });

  it("limits results to prevent UI overload", () => {
    // Very broad search should still return a reasonable number
    const results = findItem("ADP");
    expect(results.length).toBeLessThanOrEqual(50);
  });
});
