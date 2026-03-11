export type ComponentType = "weapon" | "shield" | "quantum_drive" | "power_plant" | "cooler";
export type ComponentSize = "S1" | "S2" | "S3" | "S4" | "S5";

export interface ShipComponent {
  name: string;
  type: ComponentType;
  size: ComponentSize;
  manufacturer: string;
  grade: "A" | "B" | "C" | "D";
  stats: Record<string, number>;
  description: string;
}

export interface ShipLoadoutSlot {
  type: ComponentType;
  size: ComponentSize;
  count: number;
}

export interface ShipLoadout {
  shipName: string;
  slots: ShipLoadoutSlot[];
}

export const components: ShipComponent[] = [
  // Weapons
  {
    name: "Scorpion GT-215",
    type: "weapon",
    size: "S1",
    manufacturer: "Apocalypse Arms",
    grade: "B",
    stats: { dps: 120, range: 1800, powerDraw: 1.2, speed: 2200 },
    description: "Compact ballistic gatling gun with a high rate of fire.",
  },
  {
    name: "FL-22",
    type: "weapon",
    size: "S1",
    manufacturer: "Amon & Reese",
    grade: "B",
    stats: { dps: 105, range: 2200, powerDraw: 1.8, speed: 700 },
    description: "Entry-level laser repeater favoured by new pilots.",
  },
  {
    name: "Mantis GT-220",
    type: "weapon",
    size: "S2",
    manufacturer: "Apocalypse Arms",
    grade: "A",
    stats: { dps: 225, range: 2100, powerDraw: 2.5, speed: 2100 },
    description: "Reliable ballistic gatling gun with sustained damage output.",
  },
  {
    name: "Attrition-2",
    type: "weapon",
    size: "S2",
    manufacturer: "Vanduul Clans",
    grade: "A",
    stats: { dps: 210, range: 2400, powerDraw: 3.0, speed: 700 },
    description: "Energy repeater that increases damage the longer it fires.",
  },
  {
    name: "Sledge II",
    type: "weapon",
    size: "S2",
    manufacturer: "Hurston Dynamics",
    grade: "B",
    stats: { dps: 245, range: 2600, powerDraw: 2.0, speed: 1400 },
    description: "Hard-hitting mass driver with excellent range.",
  },
  {
    name: "CF-227",
    type: "weapon",
    size: "S2",
    manufacturer: "Klaus & Werner",
    grade: "B",
    stats: { dps: 235, range: 2200, powerDraw: 2.2, speed: 1750 },
    description: "Ballistic cannon delivering high alpha damage per shot.",
  },
  {
    name: "Omnisky VI",
    type: "weapon",
    size: "S3",
    manufacturer: "Amon & Reese",
    grade: "A",
    stats: { dps: 340, range: 3200, powerDraw: 4.5, speed: 700 },
    description: "Precision laser cannon with high damage at long range.",
  },
  {
    name: "M5A",
    type: "weapon",
    size: "S3",
    manufacturer: "Klaus & Werner",
    grade: "A",
    stats: { dps: 360, range: 3000, powerDraw: 5.0, speed: 700 },
    description: "Heavy laser cannon favored on multi-crew ships.",
  },

  // Shields
  {
    name: "Shimmer",
    type: "shield",
    size: "S1",
    manufacturer: "Seal Corp",
    grade: "A",
    stats: { shieldHP: 2400, regenRate: 120, powerDraw: 2.0 },
    description: "Top-tier small shield with balanced stats.",
  },
  {
    name: "Palisade",
    type: "shield",
    size: "S2",
    manufacturer: "Seal Corp",
    grade: "A",
    stats: { shieldHP: 5800, regenRate: 240, powerDraw: 4.5 },
    description: "Robust medium shield for all-round protection.",
  },
  {
    name: "Sukoran",
    type: "shield",
    size: "S2",
    manufacturer: "Galdeen",
    grade: "B",
    stats: { shieldHP: 4600, regenRate: 380, powerDraw: 3.8 },
    description: "Medium shield specializing in fast regeneration over raw HP.",
  },
  {
    name: "FR-76",
    type: "shield",
    size: "S3",
    manufacturer: "Seal Corp",
    grade: "A",
    stats: { shieldHP: 12500, regenRate: 450, powerDraw: 8.0 },
    description: "Capital-class shield generator for heavy ships.",
  },

  // Quantum Drives
  {
    name: "Atlas",
    type: "quantum_drive",
    size: "S1",
    manufacturer: "RSI",
    grade: "A",
    stats: { quantumSpeed: 283, quantumRange: 108, spoolTime: 4.8, powerDraw: 2.5 },
    description: "Fastest small quantum drive with excellent range.",
  },
  {
    name: "Beacon",
    type: "quantum_drive",
    size: "S1",
    manufacturer: "ARC",
    grade: "B",
    stats: { quantumSpeed: 210, quantumRange: 130, spoolTime: 5.5, powerDraw: 2.0 },
    description: "Balanced small quantum drive with great fuel economy.",
  },
  {
    name: "Voyage",
    type: "quantum_drive",
    size: "S2",
    manufacturer: "RSI",
    grade: "A",
    stats: { quantumSpeed: 283, quantumRange: 240, spoolTime: 5.0, powerDraw: 4.5 },
    description: "Premium medium quantum drive for long-range travel.",
  },
  {
    name: "Odyssey",
    type: "quantum_drive",
    size: "S2",
    manufacturer: "ARC",
    grade: "B",
    stats: { quantumSpeed: 195, quantumRange: 280, spoolTime: 6.5, powerDraw: 3.5 },
    description: "Fuel-efficient medium quantum drive for exploration.",
  },

  // Power Plants
  {
    name: "Regulus",
    type: "power_plant",
    size: "S1",
    manufacturer: "APC",
    grade: "A",
    stats: { powerOutput: 15, powerDraw: 0 },
    description: "Compact, efficient power plant for light fighters.",
  },
  {
    name: "Taurus",
    type: "power_plant",
    size: "S2",
    manufacturer: "APC",
    grade: "A",
    stats: { powerOutput: 32, powerDraw: 0 },
    description: "High-capacity medium power plant for multi-role ships.",
  },

  // Coolers
  {
    name: "Bracer",
    type: "cooler",
    size: "S1",
    manufacturer: "J-Span",
    grade: "A",
    stats: { coolingRate: 180000, powerDraw: 0.8 },
    description: "Efficient small cooler for single-seat fighters.",
  },
  {
    name: "Snowpack",
    type: "cooler",
    size: "S2",
    manufacturer: "J-Span",
    grade: "A",
    stats: { coolingRate: 340000, powerDraw: 1.5 },
    description: "High-performance medium cooler for larger ships.",
  },
];

export const shipLoadouts: ShipLoadout[] = [
  {
    shipName: "Aurora MR",
    slots: [
      { type: "weapon", size: "S1", count: 2 },
      { type: "shield", size: "S1", count: 1 },
      { type: "quantum_drive", size: "S1", count: 1 },
      { type: "power_plant", size: "S1", count: 1 },
      { type: "cooler", size: "S1", count: 1 },
    ],
  },
  {
    shipName: "Avenger Titan",
    slots: [
      { type: "weapon", size: "S1", count: 2 },
      { type: "weapon", size: "S2", count: 1 },
      { type: "shield", size: "S1", count: 1 },
      { type: "quantum_drive", size: "S1", count: 1 },
      { type: "power_plant", size: "S1", count: 1 },
      { type: "cooler", size: "S1", count: 1 },
    ],
  },
  {
    shipName: "Gladius",
    slots: [
      { type: "weapon", size: "S2", count: 3 },
      { type: "shield", size: "S1", count: 1 },
      { type: "quantum_drive", size: "S1", count: 1 },
      { type: "power_plant", size: "S1", count: 1 },
      { type: "cooler", size: "S1", count: 1 },
    ],
  },
  {
    shipName: "Cutlass Black",
    slots: [
      { type: "weapon", size: "S3", count: 2 },
      { type: "weapon", size: "S2", count: 2 },
      { type: "shield", size: "S2", count: 1 },
      { type: "quantum_drive", size: "S1", count: 1 },
      { type: "power_plant", size: "S2", count: 1 },
      { type: "cooler", size: "S2", count: 1 },
    ],
  },
  {
    shipName: "Constellation Andromeda",
    slots: [
      { type: "weapon", size: "S3", count: 2 },
      { type: "weapon", size: "S2", count: 2 },
      { type: "shield", size: "S2", count: 2 },
      { type: "quantum_drive", size: "S2", count: 1 },
      { type: "power_plant", size: "S2", count: 1 },
      { type: "cooler", size: "S2", count: 2 },
    ],
  },
];
