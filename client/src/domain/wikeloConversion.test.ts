import { describe, it, expect } from "vitest";
import {
  materialLabel,
  materialUnit,
  scripToFavors,
  favorsToScrip,
  quantToBits,
  bitsToQuant,
  isConversionItemName,
  CONVERSION_MATERIALS,
} from "./wikeloConversion";

describe("materialLabel", () => {
  it("returns the player-facing name", () => {
    expect(materialLabel("MG_SCRIP")).toBe("MG Scrip");
    expect(materialLabel("QUANTANIUM")).toBe("Quantanium");
  });
});

describe("materialUnit", () => {
  it("returns the in-game unit", () => {
    expect(materialUnit("MG_SCRIP")).toBe("scrip");
    expect(materialUnit("QUANTANIUM")).toBe("SCU");
  });
});

describe("scrip <-> favors", () => {
  it("converts at 50:1 with floor on the way down", () => {
    expect(scripToFavors(0)).toBe(0);
    expect(scripToFavors(49)).toBe(0);
    expect(scripToFavors(50)).toBe(1);
    expect(scripToFavors(125)).toBe(2);
    expect(favorsToScrip(0)).toBe(0);
    expect(favorsToScrip(1)).toBe(50);
    expect(favorsToScrip(40)).toBe(2000);
  });

  it("clamps negative favor counts to 0", () => {
    expect(favorsToScrip(-3)).toBe(0);
  });
});

describe("quantanium <-> bits", () => {
  it("converts at 24:1 with floor on the way down", () => {
    expect(quantToBits(0)).toBe(0);
    expect(quantToBits(23)).toBe(0);
    expect(quantToBits(24)).toBe(1);
    expect(quantToBits(72)).toBe(3);
    expect(bitsToQuant(0)).toBe(0);
    expect(bitsToQuant(1)).toBe(24);
    expect(bitsToQuant(10)).toBe(240);
  });

  it("clamps negative bit counts to 0", () => {
    expect(bitsToQuant(-2)).toBe(0);
  });
});

describe("isConversionItemName", () => {
  it("matches the canonical display strings", () => {
    expect(isConversionItemName("MG Scrip")).toBe(true);
    expect(isConversionItemName("Quantanium")).toBe(true);
  });

  it("returns false for other items", () => {
    expect(isConversionItemName("Wikelo Favor")).toBe(false);
    expect(isConversionItemName("Polaris Bit")).toBe(false);
    expect(isConversionItemName("mg scrip")).toBe(false);
    expect(isConversionItemName("")).toBe(false);
  });
});

describe("CONVERSION_MATERIALS", () => {
  it("lists exactly the supported materials", () => {
    expect(CONVERSION_MATERIALS).toEqual(["MG_SCRIP", "QUANTANIUM"]);
  });
});
