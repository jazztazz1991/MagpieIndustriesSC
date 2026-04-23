import { describe, it, expect } from "vitest";
import {
  categorize,
  prettifyContractId,
  categoryLabel,
  groupByCategory,
  filterContracts,
  type ContractTemplate,
} from "./contracts";

describe("categorize", () => {
  it("classifies bounty variants", () => {
    expect(categorize("bounty")).toBe("bounty");
    expect(categorize("bounty_nearlocation")).toBe("bounty");
    expect(categorize("huntthepolaris")).toBe("bounty");
    expect(categorize("acepilot")).toBe("bounty");
  });

  it("classifies combat types", () => {
    expect(categorize("eliminateall")).toBe("combat");
    expect(categorize("antibombingrun")).toBe("combat");
    expect(categorize("shipwaveattack")).toBe("combat");
    expect(categorize("destroysatellite")).toBe("combat");
    expect(categorize("boardship")).toBe("combat");
    expect(categorize("hijackedship")).toBe("combat");
  });

  it("classifies defend vs escort separately", () => {
    expect(categorize("defend")).toBe("defend");
    expect(categorize("defendlocationspace")).toBe("defend");
    expect(categorize("supportattackedship")).toBe("defend");
    expect(categorize("escortshipfromlandingarea")).toBe("escort");
  });

  it("classifies courier, delivery, cargo, salvage", () => {
    expect(categorize("courier")).toBe("courier");
    expect(categorize("courier_goto_unlawful")).toBe("courier");
    expect(categorize("deliverypilot_1pickup_1dropoff_2items")).toBe("delivery");
    expect(categorize("haulcargo")).toBe("cargo");
    expect(categorize("salvage_something")).toBe("salvage");
    expect(categorize("recovercargo")).toBe("salvage");
  });

  it("classifies Wikelo and tutorial", () => {
    expect(categorize("thecollector_quantanium")).toBe("wikelo");
    expect(categorize("tutorial_part1")).toBe("tutorial");
  });

  it("defaults to other for unknown prefixes", () => {
    expect(categorize("zzunknown_mission")).toBe("other");
    expect(categorize("missingperson")).toBe("other");
    expect(categorize("handyman")).toBe("other");
  });
});

describe("prettifyContractId", () => {
  it("title-cases segments and joins with em-dash after the head", () => {
    expect(prettifyContractId("bounty_nearlocation")).toBe("Bounty — Nearlocation");
    expect(prettifyContractId("courier_goto_shipcombatencounter_exclocker_lawful")).toBe(
      "Courier — Goto Shipcombatencounter Exclocker Lawful"
    );
  });

  it("handles single-segment ids", () => {
    expect(prettifyContractId("bounty")).toBe("Bounty");
    expect(prettifyContractId("salvage")).toBe("Salvage");
  });

  it("returns input for empty", () => {
    expect(prettifyContractId("")).toBe("");
  });
});

describe("categoryLabel", () => {
  it("returns readable labels", () => {
    expect(categoryLabel("bounty")).toBe("Bounty");
    expect(categoryLabel("cargo")).toBe("Cargo Hauling");
    expect(categoryLabel("wikelo")).toBe("Wikelo");
    expect(categoryLabel("other")).toBe("Other");
  });
});

const sample = (overrides: Partial<ContractTemplate>): ContractTemplate => ({
  id: overrides.id ?? "m",
  name: overrides.name ?? "Mission",
  category: overrides.category ?? "other",
  illegal: overrides.illegal ?? false,
  issuers: overrides.issuers ?? [],
});

describe("groupByCategory", () => {
  it("groups contracts and preserves display order", () => {
    const contracts = [
      sample({ id: "1", category: "cargo" }),
      sample({ id: "2", category: "bounty" }),
      sample({ id: "3", category: "bounty" }),
      sample({ id: "4", category: "salvage" }),
    ];
    const groups = groupByCategory(contracts);
    expect(groups.map((g) => g.category)).toEqual(["bounty", "cargo", "salvage"]);
    expect(groups[0].contracts).toHaveLength(2);
  });
});

describe("filterContracts", () => {
  const contracts = [
    sample({ id: "bounty", name: "Bounty", category: "bounty", illegal: false, issuers: ["CDF"] }),
    sample({ id: "bounty_unlaw", name: "Unlawful Bounty", category: "bounty", illegal: true, issuers: ["FreedomFighters"] }),
    sample({ id: "courier", name: "Courier", category: "courier", illegal: false }),
    sample({ id: "antibombing", name: "Anti-Bombing Run", category: "combat", illegal: false }),
  ];

  it("filters by category", () => {
    expect(filterContracts(contracts, { category: "bounty" })).toHaveLength(2);
    expect(filterContracts(contracts, { category: "courier" })).toHaveLength(1);
    expect(filterContracts(contracts, { category: "all" })).toHaveLength(4);
  });

  it("filters by lawfulness", () => {
    const lawful = filterContracts(contracts, { illegal: false });
    expect(lawful).toHaveLength(3);
    const unlawful = filterContracts(contracts, { illegal: true });
    expect(unlawful).toHaveLength(1);
  });

  it("filters by search across name, id, and issuers", () => {
    expect(filterContracts(contracts, { search: "bounty" })).toHaveLength(2);
    expect(filterContracts(contracts, { search: "Freedom" })).toHaveLength(1);
    expect(filterContracts(contracts, { search: "antibombing" })).toHaveLength(1);
  });

  it("combines filters", () => {
    const result = filterContracts(contracts, { category: "bounty", illegal: true });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("bounty_unlaw");
  });
});
