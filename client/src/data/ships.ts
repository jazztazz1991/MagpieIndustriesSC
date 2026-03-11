export interface Ship {
  name: string;
  manufacturer: string;
  role: string;
  size: "small" | "medium" | "large" | "capital";
  crew: { min: number; max: number };
  cargoSCU: number;
  buyPriceAUEC: number | null; // null = not purchasable in-game
  pledgeUSD: number | null;
  speed: { scm: number; max: number }; // m/s
  description: string;
}

export const ships: Ship[] = [
  // Starters
  {
    name: "Aurora MR",
    manufacturer: "RSI",
    role: "Starter / Light Freight",
    size: "small",
    crew: { min: 1, max: 1 },
    cargoSCU: 6,
    buyPriceAUEC: 186000,
    pledgeUSD: 30,
    speed: { scm: 195, max: 1236 },
    description:
      "RSI's entry-level ship. Versatile starter with basic cargo and combat capability.",
  },
  {
    name: "Mustang Alpha",
    manufacturer: "Consolidated Outland",
    role: "Starter / Light Freight",
    size: "small",
    crew: { min: 1, max: 1 },
    cargoSCU: 6,
    buyPriceAUEC: 180000,
    pledgeUSD: 30,
    speed: { scm: 210, max: 1362 },
    description:
      "Fast and agile starter ship from Consolidated Outland.",
  },
  {
    name: "Avenger Titan",
    manufacturer: "Aegis",
    role: "Light Fighter / Freight",
    size: "small",
    crew: { min: 1, max: 1 },
    cargoSCU: 12,
    buyPriceAUEC: 785400,
    pledgeUSD: 60,
    speed: { scm: 230, max: 1280 },
    description:
      "Best-in-class starter upgrade. Great mix of cargo, combat, and speed.",
  },
  {
    name: "300i",
    manufacturer: "Origin",
    role: "Touring / Light Fighter",
    size: "small",
    crew: { min: 1, max: 1 },
    cargoSCU: 8,
    buyPriceAUEC: 632000,
    pledgeUSD: 65,
    speed: { scm: 220, max: 1300 },
    description:
      "Origin's luxury touring ship with solid combat performance.",
  },
  // Fighters
  {
    name: "Arrow",
    manufacturer: "Anvil",
    role: "Light Fighter",
    size: "small",
    crew: { min: 1, max: 1 },
    cargoSCU: 0,
    buyPriceAUEC: 904400,
    pledgeUSD: 80,
    speed: { scm: 245, max: 1375 },
    description:
      "Nimble light fighter with excellent maneuverability. Pure combat ship.",
  },
  {
    name: "Gladius",
    manufacturer: "Aegis",
    role: "Light Fighter",
    size: "small",
    crew: { min: 1, max: 1 },
    cargoSCU: 0,
    buyPriceAUEC: 1106100,
    pledgeUSD: 90,
    speed: { scm: 235, max: 1320 },
    description:
      "The UEE Navy's primary light fighter. Proven and reliable.",
  },
  {
    name: "Sabre",
    manufacturer: "Aegis",
    role: "Stealth Fighter",
    size: "small",
    crew: { min: 1, max: 1 },
    cargoSCU: 0,
    buyPriceAUEC: 2163000,
    pledgeUSD: 170,
    speed: { scm: 225, max: 1260 },
    description:
      "Stealth-focused medium fighter with four weapon hardpoints.",
  },
  {
    name: "Vanguard Warden",
    manufacturer: "Aegis",
    role: "Heavy Fighter",
    size: "medium",
    crew: { min: 1, max: 2 },
    cargoSCU: 0,
    buyPriceAUEC: 2614800,
    pledgeUSD: 260,
    speed: { scm: 205, max: 1180 },
    description:
      "Long-range heavy fighter with thick armor and a nose cannon.",
  },
  // Multi-role
  {
    name: "Cutlass Black",
    manufacturer: "Drake",
    role: "Multi-Role / Medium Freight",
    size: "medium",
    crew: { min: 1, max: 3 },
    cargoSCU: 46,
    buyPriceAUEC: 1385300,
    pledgeUSD: 100,
    speed: { scm: 195, max: 1130 },
    description:
      "Drake's workhorse. Great cargo, a manned turret, and vehicle transport.",
  },
  {
    name: "Freelancer",
    manufacturer: "MISC",
    role: "Medium Freight / Multi-Role",
    size: "medium",
    crew: { min: 1, max: 4 },
    cargoSCU: 66,
    buyPriceAUEC: 1677900,
    pledgeUSD: 110,
    speed: { scm: 180, max: 1050 },
    description:
      "MISC's reliable hauler with turret options and solid cargo capacity.",
  },
  {
    name: "Constellation Andromeda",
    manufacturer: "RSI",
    role: "Multi-Crew / Heavy Fighter",
    size: "large",
    crew: { min: 1, max: 5 },
    cargoSCU: 96,
    buyPriceAUEC: 3686600,
    pledgeUSD: 225,
    speed: { scm: 165, max: 1020 },
    description:
      "RSI's flagship multi-crew ship. Snub fighter, turrets, missiles, and cargo.",
  },
  // Mining
  {
    name: "Prospector",
    manufacturer: "MISC",
    role: "Mining",
    size: "small",
    crew: { min: 1, max: 1 },
    cargoSCU: 32,
    buyPriceAUEC: 2061000,
    pledgeUSD: 155,
    speed: { scm: 145, max: 920 },
    description:
      "Solo mining ship. The entry point into ship-based mining operations.",
  },
  {
    name: "MOLE",
    manufacturer: "ARGO",
    role: "Multi-Crew Mining",
    size: "medium",
    crew: { min: 1, max: 4 },
    cargoSCU: 96,
    buyPriceAUEC: 5130500,
    pledgeUSD: 315,
    speed: { scm: 105, max: 790 },
    description:
      "Multi-crew mining platform with three operator seats and large ore capacity.",
  },
  // Salvage
  {
    name: "Vulture",
    manufacturer: "Drake",
    role: "Salvage",
    size: "small",
    crew: { min: 1, max: 1 },
    cargoSCU: 12,
    buyPriceAUEC: 1472700,
    pledgeUSD: 140,
    speed: { scm: 155, max: 980 },
    description:
      "Solo salvage ship. Scrapes hulls for RMC and recoverable materials.",
  },
  {
    name: "Reclaimer",
    manufacturer: "Aegis",
    role: "Heavy Salvage",
    size: "capital",
    crew: { min: 1, max: 5 },
    cargoSCU: 400,
    buyPriceAUEC: 14643200,
    pledgeUSD: 400,
    speed: { scm: 85, max: 650 },
    description:
      "Industrial-scale salvage platform. Massive capacity for large wreck operations.",
  },
  // Hauling
  {
    name: "Hull A",
    manufacturer: "MISC",
    role: "Light Freight",
    size: "small",
    crew: { min: 1, max: 1 },
    cargoSCU: 64,
    buyPriceAUEC: 549600,
    pledgeUSD: 60,
    speed: { scm: 165, max: 1050 },
    description:
      "Entry-level dedicated hauler. External cargo spindle for maximum SCU per credit.",
  },
  {
    name: "Caterpillar",
    manufacturer: "Drake",
    role: "Heavy Freight",
    size: "large",
    crew: { min: 1, max: 5 },
    cargoSCU: 576,
    buyPriceAUEC: 4687600,
    pledgeUSD: 295,
    speed: { scm: 125, max: 850 },
    description:
      "Drake's modular heavy hauler. Massive cargo capacity with command module.",
  },
  {
    name: "C2 Hercules",
    manufacturer: "Crusader",
    role: "Heavy Freight / Vehicle Transport",
    size: "large",
    crew: { min: 1, max: 4 },
    cargoSCU: 696,
    buyPriceAUEC: 4962200,
    pledgeUSD: 360,
    speed: { scm: 150, max: 930 },
    description:
      "Crusader's military-grade heavy transport. Vehicles and cargo in one package.",
  },
  // Combat Capital
  {
    name: "Hammerhead",
    manufacturer: "Aegis",
    role: "Anti-Fighter Corvette",
    size: "capital",
    crew: { min: 1, max: 9 },
    cargoSCU: 0,
    buyPriceAUEC: 21672200,
    pledgeUSD: 725,
    speed: { scm: 130, max: 780 },
    description:
      "Six manned turrets on a heavily armored platform. The ultimate anti-fighter ship.",
  },
];

export const manufacturers = [
  ...new Set(ships.map((s) => s.manufacturer)),
].sort();
export const roles = [...new Set(ships.map((s) => s.role))].sort();
export const sizes: Ship["size"][] = ["small", "medium", "large", "capital"];
