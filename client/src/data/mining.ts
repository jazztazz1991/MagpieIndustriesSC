export interface Ore {
  name: string;
  abbrev: string; // 4-letter scanner abbreviation
  type: "rock" | "gem" | "metal";
  valuePerSCU: number; // aUEC per SCU
  instability: number; // raw scanner value (0-1000+)
  resistance: number; // percentage (0-100)
  description: string;
}

export const ores: Ore[] = [
  // --- High value ---
  {
    name: "Quantanium",
    abbrev: "QUAN",
    type: "rock",
    valuePerSCU: 88000,
    instability: 850,
    resistance: 60,
    description: "Extremely volatile and valuable. Must be refined quickly before it destabilizes.",
  },
  {
    name: "Bexalite",
    abbrev: "BEX",
    type: "rock",
    valuePerSCU: 64000,
    instability: 350,
    resistance: 85,
    description: "Rare and hard to crack, but very profitable.",
  },
  {
    name: "Taranite",
    abbrev: "TARA",
    type: "rock",
    valuePerSCU: 52000,
    instability: 300,
    resistance: 75,
    description: "High-value mineral found on moons and asteroids.",
  },
  // --- Mid-high value ---
  {
    name: "Laranite",
    abbrev: "LARA",
    type: "metal",
    valuePerSCU: 28000,
    instability: 150,
    resistance: 50,
    description: "Reliable high-value metal. A staple for experienced miners.",
  },
  {
    name: "Agricium",
    abbrev: "AGRI",
    type: "metal",
    valuePerSCU: 25000,
    instability: 100,
    resistance: 45,
    description: "Valuable metal used in advanced electronics manufacturing.",
  },
  {
    name: "Hadanite",
    abbrev: "HADA",
    type: "gem",
    valuePerSCU: 27500,
    instability: 0,
    resistance: 0,
    description: "Hand-mineable pink crystal found on cave floors. No ship laser needed.",
  },
  // --- Mid value ---
  {
    name: "Hephaestanite",
    abbrev: "HEPH",
    type: "rock",
    valuePerSCU: 15000,
    instability: 250,
    resistance: 55,
    description: "Mid-tier mineral with good value and moderate difficulty.",
  },
  {
    name: "Borase",
    abbrev: "BORS",
    type: "rock",
    valuePerSCU: 13000,
    instability: 200,
    resistance: 50,
    description: "Decent mid-tier mineral. Commonly found alongside higher-value ores.",
  },
  {
    name: "Riccite",
    abbrev: "RICC",
    type: "rock",
    valuePerSCU: 9200,
    instability: 120,
    resistance: 40,
    description: "Moderate-value mineral with low instability. Reliable income source.",
  },
  {
    name: "Stilmenite",
    abbrev: "STIL",
    type: "rock",
    valuePerSCU: 7800,
    instability: 100,
    resistance: 35,
    description: "Mid-tier mineral, relatively easy to extract.",
  },
  {
    name: "Savirite",
    abbrev: "SAVR",
    type: "rock",
    valuePerSCU: 6800,
    instability: 80,
    resistance: 30,
    description: "Common mineral found in many rock types.",
  },
  {
    name: "Lindelite",
    abbrev: "LIND",
    type: "rock",
    valuePerSCU: 5500,
    instability: 60,
    resistance: 25,
    description: "Low-mid tier mineral. Decent filler in a mixed haul.",
  },
  {
    name: "Torinite",
    abbrev: "TORI",
    type: "rock",
    valuePerSCU: 4800,
    instability: 50,
    resistance: 30,
    description: "Common mineral. Moderate value for low effort.",
  },
  // --- Low-mid value ---
  {
    name: "Titanium",
    abbrev: "TITA",
    type: "metal",
    valuePerSCU: 8100,
    instability: 50,
    resistance: 40,
    description: "Strong industrial metal with steady demand.",
  },
  {
    name: "Diamond",
    abbrev: "DIAM",
    type: "gem",
    valuePerSCU: 6900,
    instability: 50,
    resistance: 70,
    description: "Precious gemstone found in rocky deposits.",
  },
  {
    name: "Gold",
    abbrev: "GOLD",
    type: "metal",
    valuePerSCU: 6500,
    instability: 50,
    resistance: 30,
    description: "Classic precious metal. Stable and moderately profitable.",
  },
  {
    name: "Copper",
    abbrev: "COPP",
    type: "metal",
    valuePerSCU: 6100,
    instability: 50,
    resistance: 20,
    description: "Common industrial metal. Easy to mine, low profit margin.",
  },
  {
    name: "Beryl",
    abbrev: "BERL",
    type: "gem",
    valuePerSCU: 4300,
    instability: 50,
    resistance: 55,
    description: "Common gemstone mineral with decent returns.",
  },
  {
    name: "Tungsten",
    abbrev: "TUNG",
    type: "metal",
    valuePerSCU: 3900,
    instability: 50,
    resistance: 35,
    description: "Dense industrial metal used in weapon manufacturing.",
  },
  {
    name: "Quartz",
    abbrev: "QUAR",
    type: "gem",
    valuePerSCU: 3200,
    instability: 30,
    resistance: 25,
    description: "Abundant crystalline mineral. Low value but easy to extract.",
  },
  {
    name: "Corundum",
    abbrev: "CORU",
    type: "gem",
    valuePerSCU: 2600,
    instability: 50,
    resistance: 30,
    description: "Low-value gemstone. Common filler material in deposits.",
  },
  // --- Low value ---
  {
    name: "Iron",
    abbrev: "IRON",
    type: "metal",
    valuePerSCU: 1800,
    instability: 20,
    resistance: 20,
    description: "Abundant base metal. Very common filler in most rock types.",
  },
  {
    name: "Tin",
    abbrev: "TIN",
    type: "metal",
    valuePerSCU: 1600,
    instability: 15,
    resistance: 15,
    description: "Soft common metal. Low value, very easy to mine.",
  },
  {
    name: "Aluminium",
    abbrev: "ALUM",
    type: "metal",
    valuePerSCU: 1300,
    instability: 0,
    resistance: 15,
    description: "Abundant and cheap. Often found as filler in rock deposits.",
  },
  {
    name: "Ice",
    abbrev: "ICE",
    type: "rock",
    valuePerSCU: 200,
    instability: 0,
    resistance: 5,
    description: "Frozen water. Nearly worthless but extremely easy to extract.",
  },
  {
    name: "Silicate",
    abbrev: "SILI",
    type: "rock",
    valuePerSCU: 300,
    instability: 0,
    resistance: 10,
    description: "Common rock material. Essentially worthless filler.",
  },
  {
    name: "Inert Material",
    abbrev: "INER",
    type: "rock",
    valuePerSCU: 0,
    instability: 0,
    resistance: 0,
    description: "Worthless filler found in all rock deposits.",
  },
];

// Scanner ore grid order (matches in-game layout)
export const scannerOreOrder: string[] = [
  "RICC", "STIL", "SAVR", "QUAN", "LIND", "TARA",
  "BEX",  "DIAM", "GOLD", "BORS", "LARA", "BERL",
  "AGRI", "HEPH", "ICE",  "TUNG", "TITA", "IRON",
  "TORI", "QUAR", "CORU", "COPP", "ALUM", "TIN",
  "SILI", "INER",
];

export interface RockSignature {
  name: string;
  baseRU: number; // rock units per multiple (e.g. Shale=1730, multiply by rock multiple for total RU)
  maxMultiples: number; // max number of multiples (surface deposits = 18, asteroids = 8, ice = 8)
}

export const rockSignatures: RockSignature[] = [
  // Surface deposits (up to 18 multiples)
  { name: "Shale Deposit", baseRU: 1730, maxMultiples: 18 },
  { name: "Felsic Deposit", baseRU: 1770, maxMultiples: 18 },
  { name: "Obsidian Deposit", baseRU: 1790, maxMultiples: 18 },
  { name: "Atacamite Deposit", baseRU: 1800, maxMultiples: 18 },
  { name: "Quartzite Deposit", baseRU: 1820, maxMultiples: 18 },
  { name: "Gneiss Deposit", baseRU: 1840, maxMultiples: 18 },
  { name: "Granite Deposit", baseRU: 1920, maxMultiples: 18 },
  { name: "Igneous Deposit", baseRU: 1950, maxMultiples: 18 },
  // Ice (up to 8 multiples)
  { name: "Ice Type", baseRU: 1660, maxMultiples: 8 },
  // Asteroids (up to 8 multiples)
  { name: "Asteroid C Type", baseRU: 1700, maxMultiples: 8 },
  { name: "Asteroid S Type", baseRU: 1720, maxMultiples: 8 },
  { name: "Asteroid M Type", baseRU: 1850, maxMultiples: 8 },
  { name: "Asteroid Q Type", baseRU: 1870, maxMultiples: 8 },
  { name: "Asteroid E Type", baseRU: 1900, maxMultiples: 8 },
  { name: "Asteroid P Type", baseRU: 1750, maxMultiples: 8 },
];

export const rockClasses = rockSignatures.map((r) => r.name);
