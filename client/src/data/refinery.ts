// Auto-generated from overrides + DataForge validation — sc-alpha-4.7.0-4.7.175.49567
// Run: npm run sync:generate

export interface RefineryMethod {
  name: string;
  yieldMultiplier: number;
  relativeTime: number;
  relativeCost: number;
  description: string;
}

export const refineryMethods: RefineryMethod[] = [
  {
    name: "Dinyx Solventation",
    yieldMultiplier: 0.44,
    relativeTime: 9,
    relativeCost: 1,
    description: "High yield. Slowest method. Low base cost but long processing time.",
  },
  {
    name: "Ferron Exchange",
    yieldMultiplier: 0.44,
    relativeTime: 8,
    relativeCost: 2,
    description: "High yield. Slow but low cost. Good balance for patient miners.",
  },
  {
    name: "Pyrometric Chromalysis",
    yieldMultiplier: 0.44,
    relativeTime: 7,
    relativeCost: 3,
    description: "High yield. Very slow but low cost. Maximum return, maximum patience.",
  },
  {
    name: "Thermonatic Deposition",
    yieldMultiplier: 0.38,
    relativeTime: 6,
    relativeCost: 1,
    description: "Moderate yield. Fast and high cost. Quick turnaround at mid return.",
  },
  {
    name: "Electrostarolysis",
    yieldMultiplier: 0.38,
    relativeTime: 5,
    relativeCost: 2,
    description: "Moderate yield. Moderate speed, low cost. Decent general-purpose method.",
  },
  {
    name: "Gaskin Process",
    yieldMultiplier: 0.38,
    relativeTime: 4,
    relativeCost: 3,
    description: "Moderate yield. Slow with moderate cost. Balanced mid-tier option.",
  },
  {
    name: "Kazen Winnowing",
    yieldMultiplier: 0.31,
    relativeTime: 3,
    relativeCost: 1,
    description: "Low yield. Moderate speed, moderate cost. Cheap and quick for low-value ore.",
  },
  {
    name: "Cormack Method",
    yieldMultiplier: 0.31,
    relativeTime: 2,
    relativeCost: 2,
    description: "Low yield. Fast at moderate cost. Quick turnaround, minimal return.",
  },
  {
    name: "XCR Reaction",
    yieldMultiplier: 0.31,
    relativeTime: 1,
    relativeCost: 3,
    description: "Low yield. Fastest and most expensive. Maximum speed, minimum return.",
  },
];

export interface RefineryStation {
  name: string;
  location: string;
  bonuses: Record<string, number>;
}

export const refineryStations: RefineryStation[] = [
  {
    name: "Green Glade Station",
    location: "HUR-L1",
    bonuses: { "Quantanium": 2, "Gold": -3, "Bexalite": -2, "Borase": 1, "Laranite": 2, "Agricium": -8, "Tungsten": 4, "Iron": -5, "Copper": -5, "Corundum": -5, "Aluminium": -4 },
  },
  {
    name: "Faithful Dream Station",
    location: "HUR-L2",
    bonuses: { "Quantanium": 2, "Gold": 1, "Taranite": -3, "Bexalite": 0, "Laranite": -1, "Agricium": -2, "Beryl": 1, "Copper": -3 },
  },
  {
    name: "Ambitious Dream Station",
    location: "CRU-L1",
    bonuses: { "Gold": -6, "Bexalite": -6, "Laranite": -8, "Hephaestanite": -2, "Beryl": 7, "Titanium": -1, "Tungsten": 2, "Iron": 2, "Corundum": 7 },
  },
  {
    name: "Wide Forest Station",
    location: "ARC-L1",
    bonuses: { "Quantanium": 3, "Taranite": -6, "Laranite": -2, "Hephaestanite": -4, "Beryl": 7, "Titanium": 5, "Quartz": 11, "Iron": 1, "Corundum": -4, "Aluminium": -5 },
  },
  {
    name: "Lively Pathway Station",
    location: "ARC-L2",
    bonuses: { "Quantanium": 3, "Gold": 7, "Bexalite": 2, "Borase": 2, "Titanium": 3, "Tungsten": -6, "Copper": 6, "Corundum": -3 },
  },
  {
    name: "Faint Glen Station",
    location: "ARC-L4",
    bonuses: { "Taranite": 5, "Gold": -4, "Agricium": -4, "Beryl": -4, "Titanium": -2, "Tungsten": -5, "Copper": -4, "Corundum": -9, "Aluminium": -3 },
  },
  {
    name: "Shallow Frontier Station",
    location: "MIC-L1",
    bonuses: { "Corundum": 2, "Gold": 1, "Laranite": 2, "Quartz": -3, "Copper": 4, "Aluminium": 7 },
  },
  {
    name: "Long Forest Station",
    location: "MIC-L2",
    bonuses: { "Quantanium": 1, "Gold": 9, "Bexalite": 9, "Borase": -3, "Laranite": -1, "Titanium": 6, "Tungsten": 9, "Copper": 2, "Corundum": 6 },
  },
  {
    name: "Modern Icarus Station",
    location: "MIC-L5",
    bonuses: { "Borase": 9, "Hephaestanite": 8, "Bexalite": 12, "Beryl": 7, "Titanium": 13, "Iron": 8 },
  },
  {
    name: "Checkmate",
    location: "Pyro II L4",
    bonuses: {  },
  },
  {
    name: "Orbituary",
    location: "Pyro III orbit",
    bonuses: {  },
  },
  {
    name: "Starlight Service Station",
    location: "Pyro III L1",
    bonuses: {  },
  },
  {
    name: "Patch City",
    location: "Pyro III L3",
    bonuses: {  },
  },
  {
    name: "Gaslight",
    location: "Pyro V L2",
    bonuses: {  },
  },
  {
    name: "Rod's Fuel 'N Supplies",
    location: "Pyro V L4",
    bonuses: {  },
  },
  {
    name: "Rat's Nest",
    location: "Pyro V L5",
    bonuses: {  },
  },
  {
    name: "Ruin Station",
    location: "Pyro VI orbit",
    bonuses: {  },
  },
  {
    name: "Endgame",
    location: "Pyro VI L3",
    bonuses: {  },
  },
  {
    name: "Dudley & Daughters",
    location: "Pyro VI L4",
    bonuses: {  },
  },
  {
    name: "Stanton-Pyro Jump Point Clinic",
    location: "Stanton-Pyro JP",
    bonuses: {  },
  },
  {
    name: "Pyro-Nyx Jump Point Clinic",
    location: "Pyro-Nyx JP",
    bonuses: {  },
  },
];
