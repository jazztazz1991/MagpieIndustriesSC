export interface RefineryMethod {
  name: string;
  yieldMultiplier: number; // 0.85 = 85%, 0.73 = 73%, 0.60 = 60%
  relativeTime: number; // 1-9, higher = slower
  relativeCost: number; // 1-3, higher = more expensive
  description: string;
}

export const refineryMethods: RefineryMethod[] = [
  // Tier 1: 85% yield
  {
    name: "Dinyx Solventation",
    yieldMultiplier: 0.85,
    relativeTime: 9,
    relativeCost: 1,
    description: "Highest yield tier. Slowest but cheapest. Best for maximum return on high-value ores.",
  },
  {
    name: "Ferron Exchange",
    yieldMultiplier: 0.85,
    relativeTime: 8,
    relativeCost: 2,
    description: "Highest yield tier. Slightly faster than Dinyx at moderate cost.",
  },
  {
    name: "Pyrometric Chromalysis",
    yieldMultiplier: 0.85,
    relativeTime: 6,
    relativeCost: 3,
    description: "Highest yield tier. Fastest of the top-tier methods but most expensive.",
  },
  // Tier 2: 73% yield
  {
    name: "Thermonatic Deposition",
    yieldMultiplier: 0.73,
    relativeTime: 7,
    relativeCost: 1,
    description: "Mid yield tier. Slow but cheap. Decent balance for mid-value ores.",
  },
  {
    name: "Electrostarolysis",
    yieldMultiplier: 0.73,
    relativeTime: 5,
    relativeCost: 2,
    description: "Mid yield tier. Moderate speed and cost. Good general-purpose method.",
  },
  {
    name: "Gaskin Process",
    yieldMultiplier: 0.73,
    relativeTime: 3,
    relativeCost: 3,
    description: "Mid yield tier. Fast but expensive. Use when time matters more than cost.",
  },
  // Tier 3: 60% yield
  {
    name: "Kazen Winnowing",
    yieldMultiplier: 0.60,
    relativeTime: 4,
    relativeCost: 1,
    description: "Low yield tier. Moderate speed and cheapest. Use for low-value ores or when in a hurry.",
  },
  {
    name: "Cormack Method",
    yieldMultiplier: 0.60,
    relativeTime: 2,
    relativeCost: 2,
    description: "Low yield tier. Fast at moderate cost. Quick turnaround for bulk low-value ore.",
  },
  {
    name: "XCR Reaction",
    yieldMultiplier: 0.60,
    relativeTime: 1,
    relativeCost: 3,
    description: "Low yield tier. Fastest method available but most expensive. Maximum speed, minimum return.",
  },
];

// --- Refinery Station Bonuses ---
// Percentage bonus per ore per station (e.g. 2 = +2%, -3 = -3%)
// These apply multiplicatively to refinery yield

export interface RefineryStation {
  name: string;
  location: string; // system/area
  bonuses: Record<string, number>; // ore name -> percentage bonus
}

export const refineryStations: RefineryStation[] = [
  {
    name: "Green Glade Station",
    location: "HUR-L1",
    bonuses: {
      Quantanium: 2, Gold: -3, Bexalite: -2, Borase: 1, Laranite: 2,
      Agricium: -8, Tungsten: 4, Iron: -5, Copper: -5, Corundum: -5, Aluminium: -4,
    },
  },
  {
    name: "Faithful Dream Station",
    location: "HUR-L2",
    bonuses: {
      Quantanium: 2, Gold: 1, Taranite: -3, Bexalite: 0, Laranite: -1,
      Agricium: -2, Beryl: 1, Copper: -3,
    },
  },
  {
    name: "Ambitious Dream Station",
    location: "CRU-L1",
    bonuses: {
      Gold: -6, Bexalite: -6, Laranite: -8, Hephaestanite: -2,
      Beryl: 7, Titanium: -1, Tungsten: 2, Iron: 2, Corundum: 7,
    },
  },
  {
    name: "Wide Forest Station",
    location: "ARC-L1",
    bonuses: {
      Quantanium: 3, Taranite: -6, Laranite: -2, Hephaestanite: -4,
      Beryl: 7, Titanium: 5, Quartz: 11, Iron: 1, Corundum: -4, Aluminium: -5,
    },
  },
  {
    name: "Lively Pathway Station",
    location: "ARC-L2",
    bonuses: {
      Quantanium: 3, Gold: 7, Bexalite: 2, Borase: 2,
      Titanium: 3, Tungsten: -6, Copper: 6, Corundum: -3,
    },
  },
  {
    name: "Faint Glen Station",
    location: "ARC-L4",
    bonuses: {
      Taranite: 5, Gold: -4, Agricium: -4,
      Beryl: -4, Titanium: -2, Tungsten: -5, Copper: -4, Corundum: -9, Aluminium: -3,
    },
  },
  {
    name: "Shallow Frontier Station",
    location: "MIC-L1",
    bonuses: {
      Gold: 1, Agricium: 8, Laranite: 2,
      Beryl: -6, Copper: 4, Corundum: 2, Aluminium: 7,
    },
  },
  {
    name: "Long Forest Station",
    location: "MIC-L2",
    bonuses: {
      Quantanium: 1, Gold: 9, Bexalite: 9, Borase: -3, Laranite: -1,
      Titanium: 6, Tungsten: 9, Copper: 2, Corundum: 6,
    },
  },
  {
    name: "Modern Icarus Station",
    location: "MIC-L5",
    bonuses: {
      Borase: 9, Hephaestanite: 8, Bexalite: 12,
      Beryl: 7, Titanium: 13, Iron: 8,
    },
  },
  {
    name: "Pyro Gate",
    location: "Pyro",
    bonuses: {
      Gold: -6, Laranite: -8, Hephaestanite: -2,
      Titanium: -1, Tungsten: 2, Iron: 2, Corundum: 7, Aluminium: -5,
    },
  },
  {
    name: "Magnus Gate",
    location: "Magnus",
    bonuses: {
      Quantanium: 3, Taranite: -6, Laranite: -2, Hephaestanite: -4,
      Beryl: 7, Titanium: 5, Quartz: 11, Iron: 1, Corundum: -4, Aluminium: -5,
    },
  },
  {
    name: "Terra Gate",
    location: "Terra",
    bonuses: {
      Gold: 1, Agricium: 8, Laranite: 2,
      Beryl: -6, Copper: 4, Corundum: 2, Aluminium: 7,
    },
  },
  {
    name: "Pyro Orbituary",
    location: "Pyro",
    bonuses: {
      Quantanium: 2, Gold: -3, Bexalite: -2, Borase: 1, Laranite: 2,
      Agricium: -8, Tungsten: 4, Iron: -5, Copper: -5, Corundum: -5, Aluminium: -4,
    },
  },
  {
    name: "Pyro Checkmate",
    location: "Pyro",
    bonuses: {
      Quantanium: 2, Gold: -3, Bexalite: -2, Borase: 1, Laranite: 2,
      Agricium: -8, Tungsten: 4, Iron: -5, Copper: -5, Corundum: -5, Aluminium: -4,
    },
  },
  {
    name: "Ruin Station",
    location: "Pyro",
    bonuses: {
      Quantanium: 2, Gold: -3, Bexalite: -2, Borase: 1, Laranite: 2,
      Agricium: -8, Tungsten: 4, Iron: -5, Copper: -5, Corundum: -5, Aluminium: -4,
    },
  },
  {
    name: "Stanton Gateway",
    location: "Pyro",
    bonuses: {
      Quantanium: 2, Gold: -3, Bexalite: -2, Borase: 1, Laranite: 2,
      Agricium: -8, Tungsten: 4, Iron: -5, Copper: -5, Corundum: -5, Aluminium: -4,
    },
  },
];
