export interface Ore {
  name: string;
  type: "rock" | "gem" | "metal";
  valuePerSCU: number; // aUEC per SCU
  instability: number; // 0-1 scale
  resistance: number; // 0-1 scale
  description: string;
}

export const ores: Ore[] = [
  {
    name: "Quantanium",
    type: "rock",
    valuePerSCU: 88000,
    instability: 0.95,
    resistance: 0.6,
    description:
      "Extremely volatile and valuable. Must be refined quickly before it destabilizes.",
  },
  {
    name: "Bexalite",
    type: "rock",
    valuePerSCU: 64000,
    instability: 0.4,
    resistance: 0.85,
    description: "Rare and hard to crack, but very profitable.",
  },
  {
    name: "Taranite",
    type: "rock",
    valuePerSCU: 52000,
    instability: 0.35,
    resistance: 0.75,
    description: "High-value mineral found on moons and asteroids.",
  },
  {
    name: "Laranite",
    type: "metal",
    valuePerSCU: 28000,
    instability: 0.15,
    resistance: 0.5,
    description: "Reliable high-value metal. A staple for experienced miners.",
  },
  {
    name: "Agricium",
    type: "metal",
    valuePerSCU: 25000,
    instability: 0.1,
    resistance: 0.45,
    description: "Valuable metal used in advanced electronics manufacturing.",
  },
  {
    name: "Gold",
    type: "metal",
    valuePerSCU: 6500,
    instability: 0.05,
    resistance: 0.3,
    description: "Classic precious metal. Stable and moderately profitable.",
  },
  {
    name: "Diamond",
    type: "gem",
    valuePerSCU: 6900,
    instability: 0.05,
    resistance: 0.7,
    description: "Precious gemstone found in rocky deposits.",
  },
  {
    name: "Beryl",
    type: "gem",
    valuePerSCU: 4300,
    instability: 0.05,
    resistance: 0.55,
    description: "Common gemstone mineral with decent returns.",
  },
  {
    name: "Titanium",
    type: "metal",
    valuePerSCU: 8100,
    instability: 0.05,
    resistance: 0.4,
    description: "Strong industrial metal with steady demand.",
  },
  {
    name: "Hephaestanite",
    type: "rock",
    valuePerSCU: 15000,
    instability: 0.3,
    resistance: 0.55,
    description: "Mid-tier mineral with good value and moderate difficulty.",
  },
  {
    name: "Hadanite",
    type: "gem",
    valuePerSCU: 27500,
    instability: 0.0,
    resistance: 0.0,
    description:
      "Hand-mineable pink crystal found on cave floors. No ship laser needed.",
  },
  {
    name: "Copper",
    type: "metal",
    valuePerSCU: 6100,
    instability: 0.05,
    resistance: 0.2,
    description: "Common industrial metal. Easy to mine, low profit margin.",
  },
  {
    name: "Aluminium",
    type: "metal",
    valuePerSCU: 1300,
    instability: 0.0,
    resistance: 0.15,
    description: "Abundant and cheap. Often found as filler in rock deposits.",
  },
  {
    name: "Tungsten",
    type: "metal",
    valuePerSCU: 3900,
    instability: 0.05,
    resistance: 0.35,
    description: "Dense industrial metal used in weapon manufacturing.",
  },
  {
    name: "Corundum",
    type: "gem",
    valuePerSCU: 2600,
    instability: 0.05,
    resistance: 0.3,
    description: "Low-value gemstone. Common filler material in deposits.",
  },
  {
    name: "Inert Material",
    type: "rock",
    valuePerSCU: 0,
    instability: 0.0,
    resistance: 0.0,
    description: "Worthless filler found in all rock deposits.",
  },
];
