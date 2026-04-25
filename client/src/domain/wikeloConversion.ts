export type ConversionMaterial = "MG_SCRIP" | "QUANTANIUM";

export const CONVERSION_MATERIALS: ConversionMaterial[] = ["MG_SCRIP", "QUANTANIUM"];

/**
 * Display label for a conversion material.
 */
export function materialLabel(m: ConversionMaterial): string {
  switch (m) {
    case "MG_SCRIP": return "MG Scrip";
    case "QUANTANIUM": return "Quantanium";
  }
}

/**
 * Unit for a conversion material.
 */
export function materialUnit(m: ConversionMaterial): string {
  switch (m) {
    case "MG_SCRIP": return "scrip";
    case "QUANTANIUM": return "SCU";
  }
}

/**
 * Convert MG Scrip to Wikelo Favors (50 scrip = 1 favor).
 */
export function scripToFavors(scrip: number): number {
  return Math.floor(scrip / 50);
}

/**
 * How much MG Scrip is needed to mint a given number of Wikelo Favors.
 */
export function favorsToScrip(favors: number): number {
  return Math.max(0, favors) * 50;
}

/**
 * Convert SCU of Quantanium to Polaris Bits (24 SCU = 1 bit).
 */
export function quantToBits(scu: number): number {
  return Math.floor(scu / 24);
}

/**
 * How many SCU of Quantanium are needed to mint a given number of Polaris Bits.
 */
export function bitsToQuant(bits: number): number {
  return Math.max(0, bits) * 24;
}

/**
 * Display labels used by the contributions feed for conversion materials.
 * These are intentionally distinct from the raw project-material names
 * ("MG Scrip", "Quantanium") so project contributions and Favor/Bit minting
 * contributions don't merge in the "Who Has What" tab.
 */
export const CONVERSION_DISPLAY_LABELS = ["MG Scrip (Favors)", "Quantanium (Bits)"] as const;

/**
 * True if the entry is a conversion contribution (Favor/Bit minting) so the
 * UI can sort them to the bottom of contribution lists.
 */
export function isConversionItemName(itemName: string): boolean {
  return (CONVERSION_DISPLAY_LABELS as readonly string[]).includes(itemName);
}
