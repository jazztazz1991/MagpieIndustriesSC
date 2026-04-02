// server/prisma/seed-game-data.ts
import { PrismaClient } from "@prisma/client";

// client/src/data/mining.ts
var ores = [
  {
    name: "Quantanium",
    abbrev: "QUAN",
    type: "rock",
    rarity: "legendary",
    valuePerSCU: 88e3,
    instability: 1e3,
    resistance: 95,
    description: "Extremely volatile and valuable. Must be refined quickly before it destabilizes."
  },
  {
    name: "Bexalite",
    abbrev: "BEX",
    type: "rock",
    rarity: "rare",
    valuePerSCU: 64e3,
    instability: 600,
    resistance: 60,
    description: "Rare and hard to crack, but very profitable."
  },
  {
    name: "Taranite",
    abbrev: "TARA",
    type: "rock",
    rarity: "rare",
    valuePerSCU: 52e3,
    instability: 700,
    resistance: 50,
    description: "High-value mineral found on moons and asteroids."
  },
  {
    name: "Laranite",
    abbrev: "LARA",
    type: "metal",
    rarity: "uncommon",
    valuePerSCU: 28e3,
    instability: 400,
    resistance: 50,
    description: "Reliable high-value metal. A staple for experienced miners."
  },
  {
    name: "Agricium",
    abbrev: "AGRI",
    type: "metal",
    rarity: "uncommon",
    valuePerSCU: 25e3,
    instability: 350,
    resistance: 50,
    description: "Valuable metal used in advanced electronics manufacturing."
  },
  {
    name: "Hephaestanite",
    abbrev: "HEPH",
    type: "rock",
    rarity: "common",
    valuePerSCU: 15e3,
    instability: 400,
    resistance: 0,
    description: "Common-tier mineral with good value."
  },
  {
    name: "Borase",
    abbrev: "BORS",
    type: "rock",
    rarity: "rare",
    valuePerSCU: 13e3,
    instability: 40,
    resistance: 30,
    description: "Decent mid-tier mineral. Commonly found alongside higher-value ores."
  },
  {
    name: "Riccite",
    abbrev: "RICC",
    type: "rock",
    rarity: "epic",
    valuePerSCU: 9200,
    instability: 850,
    resistance: 95,
    description: "Epic-tier mineral with moderate instability."
  },
  {
    name: "Ouratite",
    abbrev: "OURA",
    type: "rock",
    rarity: "epic",
    valuePerSCU: 8500,
    instability: 600,
    resistance: 60,
    description: "Epic-tier mineral. High instability but valuable."
  },
  {
    name: "Titanium",
    abbrev: "TITA",
    type: "metal",
    rarity: "uncommon",
    valuePerSCU: 8100,
    instability: 0,
    resistance: 10,
    description: "Strong industrial metal with steady demand."
  },
  {
    name: "Stileron",
    abbrev: "STIL",
    type: "rock",
    rarity: "legendary",
    valuePerSCU: 7800,
    instability: 870,
    resistance: 60,
    description: "Legendary-tier mineral with very high instability."
  },
  {
    name: "Diamond",
    abbrev: "DIAM",
    type: "gem",
    rarity: "rare",
    valuePerSCU: 6900,
    instability: 0,
    resistance: 0,
    description: "Precious gemstone found in rocky deposits."
  },
  {
    name: "Savrilium",
    abbrev: "SAVR",
    type: "rock",
    rarity: "legendary",
    valuePerSCU: 6800,
    instability: 1e3,
    resistance: 95,
    description: "Legendary-tier mineral. Extremely high instability and resistance."
  },
  {
    name: "Gold",
    abbrev: "GOLD",
    type: "metal",
    rarity: "rare",
    valuePerSCU: 6500,
    instability: 550,
    resistance: 50,
    description: "Classic precious metal. Stable and moderately profitable."
  },
  {
    name: "Copper",
    abbrev: "COPP",
    type: "metal",
    rarity: "common",
    valuePerSCU: 6100,
    instability: 50,
    resistance: 0,
    description: "Common industrial metal. Easy to mine, low profit margin."
  },
  {
    name: "Lindinium",
    abbrev: "LIND",
    type: "rock",
    rarity: "epic",
    valuePerSCU: 5500,
    instability: 1e3,
    resistance: 95,
    description: "Epic-tier mineral with extreme instability and resistance."
  },
  {
    name: "Aslarite",
    abbrev: "ASLA",
    type: "rock",
    rarity: "uncommon",
    valuePerSCU: 5e3,
    instability: 700,
    resistance: 50,
    description: "Uncommon mineral with high instability."
  },
  {
    name: "Torite",
    abbrev: "TORI",
    type: "rock",
    rarity: "uncommon",
    valuePerSCU: 4800,
    instability: 550,
    resistance: 25,
    description: "Uncommon mineral. Moderate value for low effort."
  },
  {
    name: "Beryl",
    abbrev: "BERL",
    type: "gem",
    rarity: "rare",
    valuePerSCU: 4300,
    instability: 350,
    resistance: 65,
    description: "Common gemstone mineral with decent returns."
  },
  {
    name: "Tungsten",
    abbrev: "TUNG",
    type: "metal",
    rarity: "uncommon",
    valuePerSCU: 3900,
    instability: 0,
    resistance: 0,
    description: "Dense industrial metal used in weapon manufacturing."
  },
  {
    name: "Quartz",
    abbrev: "QUAR",
    type: "gem",
    rarity: "common",
    valuePerSCU: 3200,
    instability: 50,
    resistance: 0,
    description: "Abundant crystalline mineral. Low value but easy to extract."
  },
  {
    name: "Corundum",
    abbrev: "CORU",
    type: "gem",
    rarity: "common",
    valuePerSCU: 2600,
    instability: 50,
    resistance: 10,
    description: "Low-value gemstone. Common filler material in deposits."
  },
  {
    name: "Iron",
    abbrev: "IRON",
    type: "metal",
    rarity: "common",
    valuePerSCU: 1800,
    instability: 50,
    resistance: 0,
    description: "Abundant base metal. Very common filler in most rock types."
  },
  {
    name: "Tin",
    abbrev: "TIN",
    type: "metal",
    rarity: "common",
    valuePerSCU: 1600,
    instability: 0,
    resistance: 0,
    description: "Soft common metal. Low value, very easy to mine."
  },
  {
    name: "Aluminium",
    abbrev: "ALUM",
    type: "metal",
    rarity: "common",
    valuePerSCU: 1300,
    instability: 0,
    resistance: 0,
    description: "Abundant and cheap. Often found as filler in rock deposits."
  },
  {
    name: "Silicon",
    abbrev: "SILI",
    type: "rock",
    rarity: "common",
    valuePerSCU: 300,
    instability: 50,
    resistance: 0,
    description: "Common rock material. Essentially worthless filler."
  },
  {
    name: "Ice",
    abbrev: "ICE",
    type: "rock",
    rarity: "common",
    valuePerSCU: 200,
    instability: 0,
    resistance: 0,
    description: "Frozen water. Nearly worthless but extremely easy to extract."
  },
  {
    name: "Inert Material",
    abbrev: "INER",
    type: "rock",
    rarity: "common",
    valuePerSCU: 0,
    instability: 0,
    resistance: 0,
    description: "Worthless filler found in all rock deposits."
  }
];
var scannerOreOrder = [
  "QUAN",
  "SAVR",
  "STIL",
  "RICC",
  "OURA",
  "LIND",
  "BEX",
  "TARA",
  "BORS",
  "GOLD",
  "DIAM",
  "BERL",
  "LARA",
  "AGRI",
  "HEPH",
  "ASLA",
  "TITA",
  "TUNG",
  "TORI",
  "COPP",
  "QUAR",
  "CORU",
  "IRON",
  "TIN",
  "ALUM",
  "ICE",
  "SILI",
  "INER"
];
var rockSignatures = [
  { name: "Quantanium", rarity: "legendary" },
  { name: "Savrilium", rarity: "legendary" },
  { name: "Stileron", rarity: "legendary" },
  { name: "Riccite", rarity: "epic" },
  { name: "Ouratite", rarity: "epic" },
  { name: "Lindinium", rarity: "epic" },
  { name: "Bexalite", rarity: "rare" },
  { name: "Taranite", rarity: "rare" },
  { name: "Borase", rarity: "rare" },
  { name: "Gold", rarity: "rare" },
  { name: "Beryl", rarity: "rare" },
  { name: "Laranite", rarity: "uncommon" },
  { name: "Agricium", rarity: "uncommon" },
  { name: "Aslarite", rarity: "uncommon" },
  { name: "Titanium", rarity: "uncommon" },
  { name: "Tungsten", rarity: "uncommon" },
  { name: "Torite", rarity: "uncommon" },
  { name: "Hephaestanite", rarity: "common" },
  { name: "Copper", rarity: "common" },
  { name: "Corundum", rarity: "common" },
  { name: "Iron", rarity: "common" },
  { name: "Quartz", rarity: "common" },
  { name: "Silicon", rarity: "common" },
  { name: "Tin", rarity: "common" },
  { name: "Aluminium", rarity: "common" },
  { name: "Ice", rarity: "common" }
];
var rockClasses = rockSignatures.map((r) => r.name);

// client/src/data/mining-lasers.ts
var miningLasers = [
  {
    name: "Arbor MH0",
    size: 0,
    price: 0,
    optimumRange: 5,
    maxRange: 15,
    minPower: 0,
    minPowerPct: 20,
    maxPower: 0.8,
    extractPower: 0,
    moduleSlots: 0,
    resistance: 0,
    instability: -40,
    optimalChargeRate: 0,
    optimalChargeWindow: 0,
    inertMaterials: 0,
    description: ""
  },
  {
    name: "Helix 0",
    size: 0,
    price: 0,
    optimumRange: 8,
    maxRange: 18,
    minPower: 0,
    minPowerPct: 15,
    maxPower: 1,
    extractPower: 0,
    moduleSlots: 0,
    resistance: 0,
    instability: 0,
    optimalChargeRate: 20,
    optimalChargeWindow: -40,
    inertMaterials: 0,
    description: ""
  },
  {
    name: "Hofstede MH0",
    size: 0,
    price: 0,
    optimumRange: 8,
    maxRange: 18,
    minPower: 0,
    minPowerPct: 20,
    maxPower: 0.8,
    extractPower: 0,
    moduleSlots: 0,
    resistance: -40,
    instability: 30,
    optimalChargeRate: 20,
    optimalChargeWindow: 40,
    inertMaterials: 0,
    description: ""
  },
  {
    name: "Klein S0",
    size: 0,
    price: 0,
    optimumRange: 5,
    maxRange: 15,
    minPower: 0,
    minPowerPct: 20,
    maxPower: 0.8,
    extractPower: 0,
    moduleSlots: 0,
    resistance: -40,
    instability: 30,
    optimalChargeRate: 0,
    optimalChargeWindow: 40,
    inertMaterials: 0,
    description: ""
  },
  {
    name: "Arbor MH1",
    size: 1,
    price: 0,
    optimumRange: 60,
    maxRange: 180,
    minPower: 95,
    minPowerPct: 5,
    maxPower: 1890,
    extractPower: 1850,
    moduleSlots: 1,
    resistance: 25,
    instability: -35,
    optimalChargeRate: 0,
    optimalChargeWindow: 40,
    inertMaterials: -30,
    description: ""
  },
  {
    name: "Golem S1",
    size: 1,
    price: 0,
    optimumRange: 40,
    maxRange: 45,
    minPower: 630,
    minPowerPct: 20,
    maxPower: 3150,
    extractPower: 1295,
    moduleSlots: 2,
    resistance: 25,
    instability: 35,
    optimalChargeRate: -40,
    optimalChargeWindow: 40,
    inertMaterials: -40,
    description: ""
  },
  {
    name: "Helix I",
    size: 1,
    price: 0,
    optimumRange: 15,
    maxRange: 45,
    minPower: 630,
    minPowerPct: 20,
    maxPower: 3150,
    extractPower: 1850,
    moduleSlots: 2,
    resistance: -30,
    instability: 0,
    optimalChargeRate: 0,
    optimalChargeWindow: -40,
    inertMaterials: -30,
    description: ""
  },
  {
    name: "Hofstede MH1",
    size: 1,
    price: 0,
    optimumRange: 45,
    maxRange: 135,
    minPower: 105,
    minPowerPct: 5,
    maxPower: 2100,
    extractPower: 1295,
    moduleSlots: 1,
    resistance: -30,
    instability: 10,
    optimalChargeRate: 20,
    optimalChargeWindow: 60,
    inertMaterials: -30,
    description: ""
  },
  {
    name: "Impact I",
    size: 1,
    price: 0,
    optimumRange: 45,
    maxRange: 135,
    minPower: 420,
    minPowerPct: 20,
    maxPower: 2100,
    extractPower: 2775,
    moduleSlots: 2,
    resistance: 10,
    instability: -10,
    optimalChargeRate: -40,
    optimalChargeWindow: 20,
    inertMaterials: -30,
    description: ""
  },
  {
    name: "Klein S1",
    size: 1,
    price: 0,
    optimumRange: 45,
    maxRange: 135,
    minPower: 378,
    minPowerPct: 15,
    maxPower: 2520,
    extractPower: 2220,
    moduleSlots: 0,
    resistance: -45,
    instability: 35,
    optimalChargeRate: 0,
    optimalChargeWindow: 20,
    inertMaterials: -30,
    description: ""
  },
  {
    name: "Lancet MH1",
    size: 1,
    price: 0,
    optimumRange: 30,
    maxRange: 90,
    minPower: 504,
    minPowerPct: 20,
    maxPower: 2520,
    extractPower: 1850,
    moduleSlots: 1,
    resistance: 0,
    instability: -10,
    optimalChargeRate: 40,
    optimalChargeWindow: -60,
    inertMaterials: -30,
    description: ""
  },
  {
    name: "Arbor MH2",
    size: 2,
    price: 0,
    optimumRange: 90,
    maxRange: 270,
    minPower: 120,
    minPowerPct: 5,
    maxPower: 2400,
    extractPower: 2590,
    moduleSlots: 2,
    resistance: 25,
    instability: -35,
    optimalChargeRate: 0,
    optimalChargeWindow: 40,
    inertMaterials: -40,
    description: ""
  },
  {
    name: "Helix II",
    size: 2,
    price: 0,
    optimumRange: 30,
    maxRange: 90,
    minPower: 1224,
    minPowerPct: 30,
    maxPower: 4080,
    extractPower: 2590,
    moduleSlots: 3,
    resistance: -30,
    instability: 0,
    optimalChargeRate: 0,
    optimalChargeWindow: -40,
    inertMaterials: -40,
    description: ""
  },
  {
    name: "Hofstede MH2",
    size: 2,
    price: 0,
    optimumRange: 60,
    maxRange: 180,
    minPower: 336,
    minPowerPct: 10,
    maxPower: 3360,
    extractPower: 1295,
    moduleSlots: 2,
    resistance: -30,
    instability: 10,
    optimalChargeRate: 20,
    optimalChargeWindow: 60,
    inertMaterials: -40,
    description: ""
  },
  {
    name: "Impact II",
    size: 2,
    price: 0,
    optimumRange: 60,
    maxRange: 180,
    minPower: 1008,
    minPowerPct: 30,
    maxPower: 3360,
    extractPower: 3145,
    moduleSlots: 3,
    resistance: 10,
    instability: -10,
    optimalChargeRate: -40,
    optimalChargeWindow: 20,
    inertMaterials: -40,
    description: ""
  },
  {
    name: "Klein S2",
    size: 2,
    price: 0,
    optimumRange: 60,
    maxRange: 180,
    minPower: 720,
    minPowerPct: 20,
    maxPower: 3600,
    extractPower: 2775,
    moduleSlots: 1,
    resistance: -45,
    instability: 35,
    optimalChargeRate: 0,
    optimalChargeWindow: 20,
    inertMaterials: -40,
    description: ""
  },
  {
    name: "Lancet MH2",
    size: 2,
    price: 0,
    optimumRange: 45,
    maxRange: 135,
    minPower: 1080,
    minPowerPct: 30,
    maxPower: 3600,
    extractPower: 2590,
    moduleSlots: 2,
    resistance: 0,
    instability: -10,
    optimalChargeRate: 40,
    optimalChargeWindow: -60,
    inertMaterials: -40,
    description: ""
  }
];

// client/src/data/mining-gadgets.ts
var activeModules = [
  {
    name: "Brandt",
    type: "active",
    price: 0,
    duration: 60,
    uses: 5,
    miningLaserPower: 135,
    laserInstability: 0,
    resistance: 15.5,
    optimalChargeWindow: 0,
    optimalChargeRate: 0,
    overchargeRate: 0,
    shatterDamage: -30,
    extractionLaserPower: 100,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Forel",
    type: "active",
    price: 0,
    duration: 60,
    uses: 6,
    miningLaserPower: 100,
    laserInstability: 0,
    resistance: 15.5,
    optimalChargeWindow: 0,
    optimalChargeRate: 0,
    overchargeRate: -60,
    shatterDamage: 0,
    extractionLaserPower: 150,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Lifeline",
    type: "active",
    price: 0,
    duration: 15,
    uses: 3,
    miningLaserPower: 100,
    laserInstability: -20,
    resistance: -15.5,
    optimalChargeWindow: 0,
    optimalChargeRate: 0,
    overchargeRate: 60,
    shatterDamage: 0,
    extractionLaserPower: 100,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Optimum",
    type: "active",
    price: 0,
    duration: 60,
    uses: 5,
    miningLaserPower: 85,
    laserInstability: -10,
    resistance: 0,
    optimalChargeWindow: 0,
    optimalChargeRate: 0,
    overchargeRate: -80,
    shatterDamage: 0,
    extractionLaserPower: 100,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Rime",
    type: "active",
    price: 0,
    duration: 20,
    uses: 10,
    miningLaserPower: 85,
    laserInstability: 0,
    resistance: -24.8,
    optimalChargeWindow: 0,
    optimalChargeRate: 0,
    overchargeRate: 0,
    shatterDamage: -10,
    extractionLaserPower: 100,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Stampede",
    type: "active",
    price: 0,
    duration: 30,
    uses: 6,
    miningLaserPower: 135,
    laserInstability: -10,
    resistance: 0,
    optimalChargeWindow: 0,
    optimalChargeRate: 0,
    overchargeRate: 0,
    shatterDamage: -10,
    extractionLaserPower: 85,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Surge",
    type: "active",
    price: 0,
    duration: 15,
    uses: 7,
    miningLaserPower: 150,
    laserInstability: 10,
    resistance: -15.5,
    optimalChargeWindow: 0,
    optimalChargeRate: 0,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 100,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Torpid",
    type: "active",
    price: 0,
    duration: 60,
    uses: 5,
    miningLaserPower: 100,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: 0,
    optimalChargeRate: 60,
    overchargeRate: -60,
    shatterDamage: 40,
    extractionLaserPower: 100,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  }
];
var passiveModules = [
  {
    name: "FLTR",
    type: "passive",
    price: 0,
    duration: 0,
    uses: 0,
    miningLaserPower: 100,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: 0,
    optimalChargeRate: 0,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 85,
    inertMaterials: -20,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "FLTR-L",
    type: "passive",
    price: 0,
    duration: 0,
    uses: 0,
    miningLaserPower: 100,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: 0,
    optimalChargeRate: 0,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 90,
    inertMaterials: -23,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "FLTR-XL",
    type: "passive",
    price: 0,
    duration: 0,
    uses: 0,
    miningLaserPower: 100,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: 0,
    optimalChargeRate: 0,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 95,
    inertMaterials: -24,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Focus",
    type: "passive",
    price: 0,
    duration: 0,
    uses: 0,
    miningLaserPower: 85,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: 30,
    optimalChargeRate: 0,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 100,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Focus II",
    type: "passive",
    price: 0,
    duration: 0,
    uses: 0,
    miningLaserPower: 90,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: 37,
    optimalChargeRate: 0,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 100,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Focus III",
    type: "passive",
    price: 0,
    duration: 0,
    uses: 0,
    miningLaserPower: 95,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: 40,
    optimalChargeRate: 0,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 100,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Rieger",
    type: "passive",
    price: 0,
    duration: 0,
    uses: 0,
    miningLaserPower: 115,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: -10,
    optimalChargeRate: 0,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 100,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Rieger-C2",
    type: "passive",
    price: 0,
    duration: 0,
    uses: 0,
    miningLaserPower: 120,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: -3,
    optimalChargeRate: 0,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 100,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Rieger-C3",
    type: "passive",
    price: 0,
    duration: 0,
    uses: 0,
    miningLaserPower: 125,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: -1,
    optimalChargeRate: 0,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 100,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Torrent",
    type: "passive",
    price: 0,
    duration: 0,
    uses: 0,
    miningLaserPower: 100,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: -10,
    optimalChargeRate: 30,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 100,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Torrent II",
    type: "passive",
    price: 0,
    duration: 0,
    uses: 0,
    miningLaserPower: 100,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: -3,
    optimalChargeRate: 35,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 100,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Torrent III",
    type: "passive",
    price: 0,
    duration: 0,
    uses: 0,
    miningLaserPower: 100,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: -1,
    optimalChargeRate: 45,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 100,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Vaux",
    type: "passive",
    price: 0,
    duration: 0,
    uses: 0,
    miningLaserPower: 100,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: 0,
    optimalChargeRate: -20,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 115,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Vaux-C2",
    type: "passive",
    price: 0,
    duration: 0,
    uses: 0,
    miningLaserPower: 100,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: 0,
    optimalChargeRate: -15,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 120,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Vaux-C3",
    type: "passive",
    price: 0,
    duration: 0,
    uses: 0,
    miningLaserPower: 100,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: 0,
    optimalChargeRate: -5,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 125,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "XTR",
    type: "passive",
    price: 0,
    duration: 0,
    uses: 0,
    miningLaserPower: 100,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: 15,
    optimalChargeRate: 0,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 85,
    inertMaterials: -5,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "XTR-L",
    type: "passive",
    price: 0,
    duration: 0,
    uses: 0,
    miningLaserPower: 100,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: 22,
    optimalChargeRate: 0,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 90,
    inertMaterials: -5.75,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "XTR-XL",
    type: "passive",
    price: 0,
    duration: 0,
    uses: 0,
    miningLaserPower: 100,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: 25,
    optimalChargeRate: 0,
    overchargeRate: 0,
    shatterDamage: 0,
    extractionLaserPower: 95,
    inertMaterials: -6,
    clusterModifier: 0,
    description: ""
  }
];
var miningGadgets = [
  {
    name: "BoreMax",
    type: "gadget",
    price: 0,
    laserInstability: -70,
    resistance: 10,
    optimalChargeWindow: 0,
    optimalChargeRate: 0,
    extractionLaserPower: 0,
    inertMaterials: 0,
    clusterModifier: 30,
    description: ""
  },
  {
    name: "Okunis",
    type: "gadget",
    price: 0,
    laserInstability: 0,
    resistance: 0,
    optimalChargeWindow: 50,
    optimalChargeRate: 100,
    extractionLaserPower: 0,
    inertMaterials: 0,
    clusterModifier: -20,
    description: ""
  },
  {
    name: "OptiMax",
    type: "gadget",
    price: 0,
    laserInstability: 0,
    resistance: -25,
    optimalChargeWindow: -30,
    optimalChargeRate: 0,
    extractionLaserPower: 0,
    inertMaterials: 0,
    clusterModifier: 60,
    description: ""
  },
  {
    name: "Sabir",
    type: "gadget",
    price: 0,
    laserInstability: 15,
    resistance: -50,
    optimalChargeWindow: 50,
    optimalChargeRate: 0,
    extractionLaserPower: 0,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  },
  {
    name: "Stalwart",
    type: "gadget",
    price: 0,
    laserInstability: -35,
    resistance: 0,
    optimalChargeWindow: -30,
    optimalChargeRate: 50,
    extractionLaserPower: 0,
    inertMaterials: 0,
    clusterModifier: 30,
    description: ""
  },
  {
    name: "Waveshift",
    type: "gadget",
    price: 0,
    laserInstability: -35,
    resistance: 0,
    optimalChargeWindow: 100,
    optimalChargeRate: -30,
    extractionLaserPower: 0,
    inertMaterials: 0,
    clusterModifier: 0,
    description: ""
  }
];

// client/src/data/mining-ships.ts
var miningShips = [
  {
    name: "Golem",
    manufacturer: "Drake",
    size: "small",
    cargoSCU: 12,
    miningTurrets: 1,
    crewMin: 1,
    crewMax: 1,
    description: ""
  },
  {
    name: "MOLE",
    manufacturer: "ARGO",
    size: "medium",
    cargoSCU: 96,
    miningTurrets: 3,
    crewMin: 1,
    crewMax: 5,
    description: ""
  },
  {
    name: "Prospector",
    manufacturer: "MISC",
    size: "small",
    cargoSCU: 32,
    miningTurrets: 1,
    crewMin: 1,
    crewMax: 1,
    description: ""
  },
  {
    name: "ROC",
    manufacturer: "Greycat Industrial",
    size: "small",
    cargoSCU: 1.2,
    miningTurrets: 1,
    crewMin: 1,
    crewMax: 1,
    isVehicle: true,
    description: ""
  },
  {
    name: "ROC-DS",
    manufacturer: "Greycat Industrial",
    size: "small",
    cargoSCU: 3.4,
    miningTurrets: 1,
    crewMin: 1,
    crewMax: 2,
    isVehicle: true,
    description: ""
  }
];

// client/src/data/refinery.ts
var refineryMethods = [
  {
    name: "Dinyx Solventation",
    yieldMultiplier: 0.44,
    relativeTime: 9,
    relativeCost: 1,
    description: "High yield. Slowest method. Low base cost but long processing time."
  },
  {
    name: "Ferron Exchange",
    yieldMultiplier: 0.44,
    relativeTime: 8,
    relativeCost: 2,
    description: "High yield. Slow but low cost. Good balance for patient miners."
  },
  {
    name: "Pyrometric Chromalysis",
    yieldMultiplier: 0.44,
    relativeTime: 7,
    relativeCost: 3,
    description: "High yield. Very slow but low cost. Maximum return, maximum patience."
  },
  {
    name: "Thermonatic Deposition",
    yieldMultiplier: 0.38,
    relativeTime: 6,
    relativeCost: 1,
    description: "Moderate yield. Fast and high cost. Quick turnaround at mid return."
  },
  {
    name: "Electrostarolysis",
    yieldMultiplier: 0.38,
    relativeTime: 5,
    relativeCost: 2,
    description: "Moderate yield. Moderate speed, low cost. Decent general-purpose method."
  },
  {
    name: "Gaskin Process",
    yieldMultiplier: 0.38,
    relativeTime: 4,
    relativeCost: 3,
    description: "Moderate yield. Slow with moderate cost. Balanced mid-tier option."
  },
  {
    name: "Kazen Winnowing",
    yieldMultiplier: 0.31,
    relativeTime: 3,
    relativeCost: 1,
    description: "Low yield. Moderate speed, moderate cost. Cheap and quick for low-value ore."
  },
  {
    name: "Cormack Method",
    yieldMultiplier: 0.31,
    relativeTime: 2,
    relativeCost: 2,
    description: "Low yield. Fast at moderate cost. Quick turnaround, minimal return."
  },
  {
    name: "XCR Reaction",
    yieldMultiplier: 0.31,
    relativeTime: 1,
    relativeCost: 3,
    description: "Low yield. Fastest and most expensive. Maximum speed, minimum return."
  }
];
var refineryStations = [
  {
    name: "Green Glade Station",
    location: "HUR-L1",
    bonuses: { "Quantanium": 2, "Gold": -3, "Bexalite": -2, "Borase": 1, "Laranite": 2, "Agricium": -8, "Tungsten": 4, "Iron": -5, "Copper": -5, "Corundum": -5, "Aluminium": -4 }
  },
  {
    name: "Faithful Dream Station",
    location: "HUR-L2",
    bonuses: { "Quantanium": 2, "Gold": 1, "Taranite": -3, "Bexalite": 0, "Laranite": -1, "Agricium": -2, "Beryl": 1, "Copper": -3 }
  },
  {
    name: "Ambitious Dream Station",
    location: "CRU-L1",
    bonuses: { "Gold": -6, "Bexalite": -6, "Laranite": -8, "Hephaestanite": -2, "Beryl": 7, "Titanium": -1, "Tungsten": 2, "Iron": 2, "Corundum": 7 }
  },
  {
    name: "Wide Forest Station",
    location: "ARC-L1",
    bonuses: { "Quantanium": 3, "Taranite": -6, "Laranite": -2, "Hephaestanite": -4, "Beryl": 7, "Titanium": 5, "Quartz": 11, "Iron": 1, "Corundum": -4, "Aluminium": -5 }
  },
  {
    name: "Lively Pathway Station",
    location: "ARC-L2",
    bonuses: { "Quantanium": 3, "Gold": 7, "Bexalite": 2, "Borase": 2, "Titanium": 3, "Tungsten": -6, "Copper": 6, "Corundum": -3 }
  },
  {
    name: "Faint Glen Station",
    location: "ARC-L4",
    bonuses: { "Taranite": 5, "Gold": -4, "Agricium": -4, "Beryl": -4, "Titanium": -2, "Tungsten": -5, "Copper": -4, "Corundum": -9, "Aluminium": -3 }
  },
  {
    name: "Shallow Frontier Station",
    location: "MIC-L1",
    bonuses: { "Corundum": 2, "Gold": 1, "Laranite": 2, "Quartz": -3, "Copper": 4, "Aluminium": 7 }
  },
  {
    name: "Long Forest Station",
    location: "MIC-L2",
    bonuses: { "Quantanium": 1, "Gold": 9, "Bexalite": 9, "Borase": -3, "Laranite": -1, "Titanium": 6, "Tungsten": 9, "Copper": 2, "Corundum": 6 }
  },
  {
    name: "Modern Icarus Station",
    location: "MIC-L5",
    bonuses: { "Borase": 9, "Hephaestanite": 8, "Bexalite": 12, "Beryl": 7, "Titanium": 13, "Iron": 8 }
  },
  {
    name: "Checkmate",
    location: "Pyro II L4",
    bonuses: {}
  },
  {
    name: "Orbituary",
    location: "Pyro III orbit",
    bonuses: {}
  },
  {
    name: "Starlight Service Station",
    location: "Pyro III L1",
    bonuses: {}
  },
  {
    name: "Patch City",
    location: "Pyro III L3",
    bonuses: {}
  },
  {
    name: "Gaslight",
    location: "Pyro V L2",
    bonuses: {}
  },
  {
    name: "Rod's Fuel 'N Supplies",
    location: "Pyro V L4",
    bonuses: {}
  },
  {
    name: "Rat's Nest",
    location: "Pyro V L5",
    bonuses: {}
  },
  {
    name: "Ruin Station",
    location: "Pyro VI orbit",
    bonuses: {}
  },
  {
    name: "Endgame",
    location: "Pyro VI L3",
    bonuses: {}
  },
  {
    name: "Dudley & Daughters",
    location: "Pyro VI L4",
    bonuses: {}
  },
  {
    name: "Stanton-Pyro Jump Point Clinic",
    location: "Stanton-Pyro JP",
    bonuses: {}
  },
  {
    name: "Pyro-Nyx Jump Point Clinic",
    location: "Pyro-Nyx JP",
    bonuses: {}
  }
];

// client/src/data/mining-locations.ts
var miningLocations = [
  {
    name: "Aaron Halo",
    type: "asteroid_belt",
    parentBody: "Stanton",
    gravity: "none",
    atmosphere: false,
    danger: "high",
    ores: ["Beryl", "Aslarite", "Titanium", "Ice", "Silicon", "Aluminium", "Iron", "Copper", "Quantanium"],
    fpsOres: [],
    notes: "Highest spawn rates: Beryl (18%), Aslarite (14%), Titanium (14%). 9 ore types found."
  },
  {
    name: "Akiro Cluster",
    type: "asteroid_field",
    parentBody: "Pyro",
    gravity: "none",
    atmosphere: false,
    danger: "high",
    ores: ["Torite", "Ice", "Silicon", "Copper", "Iron", "Riccite", "Stileron"],
    fpsOres: [],
    notes: "Highest spawn rates: Torite (28%), Ice (15%), Silicon (15%). 7 ore types found."
  },
  {
    name: "Glaciem Ring",
    type: "asteroid_field",
    parentBody: "Nyx",
    gravity: "none",
    atmosphere: false,
    danger: "high",
    ores: ["Torite", "Bexalite", "Ice", "Aluminium", "Iron", "Lindinium", "Savrilium"],
    fpsOres: [],
    notes: "Highest spawn rates: Torite (28%), Bexalite (18%), Ice (14%). 7 ore types found."
  },
  {
    name: "Keeger Belt",
    type: "asteroid_field",
    parentBody: "Nyx",
    gravity: "none",
    atmosphere: false,
    danger: "high",
    ores: ["Torite", "Bexalite", "Ice", "Aluminium", "Iron", "Lindinium", "Savrilium"],
    fpsOres: [],
    notes: "Highest spawn rates: Torite (28%), Bexalite (18%), Ice (14%). 7 ore types found."
  },
  {
    name: "Pyro Deep Space Asteroids",
    type: "asteroid_field",
    parentBody: "Pyro",
    gravity: "none",
    atmosphere: false,
    danger: "high",
    ores: ["Torite", "Aluminium", "Corundum", "Quartz", "Tin", "Riccite", "Stileron"],
    fpsOres: [],
    notes: "Highest spawn rates: Torite (28%), Aluminium (15%), Corundum (15%). 7 ore types found."
  },
  {
    name: "Pyro Inner Belt (Warm 1)",
    type: "asteroid_field",
    parentBody: "Pyro",
    gravity: "none",
    atmosphere: false,
    danger: "high",
    ores: ["Agricium", "Iron", "Copper", "Bexalite"],
    fpsOres: [],
    notes: "Highest spawn rates: Agricium (28%), Iron (27%), Copper (27%). 4 ore types found."
  },
  {
    name: "Pyro Inner Belt (Warm 2)",
    type: "asteroid_field",
    parentBody: "Pyro",
    gravity: "none",
    atmosphere: false,
    danger: "high",
    ores: ["Tungsten", "Iron", "Copper", "Gold"],
    fpsOres: [],
    notes: "Highest spawn rates: Tungsten (28%), Iron (27%), Copper (27%). 4 ore types found."
  },
  {
    name: "Pyro Outer Belt (Cool 1)",
    type: "asteroid_field",
    parentBody: "Pyro",
    gravity: "none",
    atmosphere: false,
    danger: "high",
    ores: ["Titanium", "Ice", "Silicon", "Borase"],
    fpsOres: [],
    notes: "Highest spawn rates: Titanium (28%), Ice (27%), Silicon (27%). 4 ore types found."
  },
  {
    name: "Pyro Outer Belt (Cool 2)",
    type: "asteroid_field",
    parentBody: "Pyro",
    gravity: "none",
    atmosphere: false,
    danger: "high",
    ores: ["Aslarite", "Ice", "Silicon", "Taranite"],
    fpsOres: [],
    notes: "Highest spawn rates: Aslarite (28%), Ice (27%), Silicon (27%). 4 ore types found."
  },
  {
    name: "Yela Asteroid Belt",
    type: "asteroid_field",
    parentBody: "Crusader",
    gravity: "none",
    atmosphere: false,
    danger: "medium",
    ores: ["Titanium", "Iron", "Ice", "Copper", "Ouratite"],
    fpsOres: [],
    notes: "Highest spawn rates: Titanium (28%), Iron (21%), Ice (21%). 5 ore types found."
  },
  {
    name: "Lagrange Point ARC-L1",
    type: "lagrange",
    parentBody: "Stanton",
    gravity: "none",
    atmosphere: false,
    danger: "medium",
    ores: ["Tungsten", "Taranite", "Corundum", "Aluminium", "Hephaestanite"],
    fpsOres: [],
    notes: "Highest spawn rates: Tungsten (28%), Taranite (18%), Corundum (18%). 5 ore types found."
  },
  {
    name: "Lagrange Point CRU-L5",
    type: "lagrange",
    parentBody: "Stanton",
    gravity: "none",
    atmosphere: false,
    danger: "low",
    ores: ["Agricium", "Beryl", "Iron", "Ice", "Copper"],
    fpsOres: [],
    notes: "Highest spawn rates: Agricium (28%), Beryl (18%), Iron (18%). 5 ore types found."
  },
  {
    name: "Lagrange Point L1 (HUR-CRU)",
    type: "lagrange",
    parentBody: "Stanton",
    gravity: "none",
    atmosphere: false,
    danger: "medium",
    ores: ["Laranite", "Borase", "Aluminium", "Corundum", "Hephaestanite"],
    fpsOres: [],
    notes: "Highest spawn rates: Laranite (28%), Borase (18%), Aluminium (18%). 5 ore types found."
  },
  {
    name: "Lagrange Point L2 (CRU-ARC)",
    type: "lagrange",
    parentBody: "Stanton",
    gravity: "none",
    atmosphere: false,
    danger: "medium",
    ores: ["Aslarite", "Gold", "Iron", "Ice", "Copper"],
    fpsOres: [],
    notes: "Highest spawn rates: Aslarite (28%), Gold (18%), Iron (18%). 5 ore types found."
  },
  {
    name: "Lagrange Point L3 (ARC-MIC)",
    type: "lagrange",
    parentBody: "Stanton",
    gravity: "none",
    atmosphere: false,
    danger: "medium",
    ores: ["Torite", "Aluminium", "Corundum", "Hephaestanite"],
    fpsOres: [],
    notes: "Highest spawn rates: Torite (28%), Aluminium (24%), Corundum (24%). 4 ore types found."
  },
  {
    name: "Lagrange Point L4 (MIC-L4)",
    type: "lagrange",
    parentBody: "Stanton",
    gravity: "none",
    atmosphere: false,
    danger: "low",
    ores: ["Agricium", "Beryl", "Iron", "Ice", "Copper"],
    fpsOres: [],
    notes: "Highest spawn rates: Agricium (28%), Beryl (18%), Iron (18%). 5 ore types found."
  },
  {
    name: "Lagrange Point L5 (HUR-L5)",
    type: "lagrange",
    parentBody: "Stanton",
    gravity: "none",
    atmosphere: false,
    danger: "low",
    ores: ["Titanium", "Bexalite", "Iron", "Ice", "Copper"],
    fpsOres: [],
    notes: "Highest spawn rates: Titanium (28%), Bexalite (18%), Iron (18%). 5 ore types found."
  },
  {
    name: "Bloom (Pyro III)",
    type: "planet",
    parentBody: "Pyro",
    gravity: "medium",
    atmosphere: true,
    danger: "high",
    ores: ["Quartz", "Iron", "Borase", "Riccite", "Stileron"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
    notes: "Highest spawn rates: Quartz (35%), Iron (35%), Borase (18%). 5 ore types found."
  },
  {
    name: "Hurston",
    type: "planet",
    parentBody: "Stanton",
    gravity: "high",
    atmosphere: true,
    danger: "medium",
    ores: ["Aluminium", "Tin", "Ouratite", "Quantanium"],
    fpsOres: ["Aphorite", "Hadanite", "Dolivine", "Janalite", "Jaclium", "Saldynium", "Carinite"],
    notes: "Highest spawn rates: Aluminium (44%), Tin (44%), Ouratite (10%). 4 ore types found."
  },
  {
    name: "microTech",
    type: "planet",
    parentBody: "Stanton",
    gravity: "medium",
    atmosphere: true,
    danger: "low",
    ores: ["Ice", "Hephaestanite", "Iron", "Quantanium"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite", "Jaclium", "Saldynium", "Carinite"],
    notes: "Highest spawn rates: Ice (33%), Hephaestanite (33%), Iron (33%). 4 ore types found."
  },
  {
    name: "Monox (Pyro II)",
    type: "planet",
    parentBody: "Pyro",
    gravity: "low",
    atmosphere: true,
    danger: "high",
    ores: ["Hephaestanite", "Iron", "Tin", "Stileron"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
    notes: "Highest spawn rates: Hephaestanite (33%), Iron (33%), Tin (33%). 4 ore types found."
  },
  {
    name: "Pyro I",
    type: "planet",
    parentBody: "Pyro",
    gravity: "medium",
    atmosphere: true,
    danger: "high",
    ores: ["Iron", "Copper", "Tin", "Stileron"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
    notes: "Highest spawn rates: Iron (33%), Copper (33%), Tin (33%). 4 ore types found."
  },
  {
    name: "Pyro IV",
    type: "planet",
    parentBody: "Pyro",
    gravity: "medium",
    atmosphere: true,
    danger: "high",
    ores: ["Laranite", "Copper", "Iron", "Borase", "Stileron"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
    notes: "Highest spawn rates: Laranite (29%), Copper (26%), Iron (26%). 5 ore types found."
  },
  {
    name: "Pyro VI",
    type: "planet",
    parentBody: "Pyro",
    gravity: "high",
    atmosphere: true,
    danger: "high",
    ores: ["Ice", "Copper", "Gold", "Agricium", "Titanium", "Riccite", "Stileron"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
    notes: "Highest spawn rates: Ice (21%), Copper (21%), Gold (18%). 7 ore types found."
  },
  {
    name: "Aberdeen",
    type: "moon",
    parentBody: "Hurston",
    gravity: "low",
    atmosphere: true,
    danger: "medium",
    ores: ["Aluminium", "Tin", "Hephaestanite", "Corundum", "Ouratite", "Quantanium"],
    fpsOres: ["Aphorite", "Hadanite", "Dolivine", "Janalite", "Feynmaline", "Glacosite", "Jaclium", "Saldynium", "Carinite"],
    notes: "Highest spawn rates: Aluminium (22%), Tin (22%), Hephaestanite (22%). 6 ore types found."
  },
  {
    name: "Adir (Pyro Va)",
    type: "moon",
    parentBody: "Pyro V",
    gravity: "low",
    atmosphere: false,
    danger: "high",
    ores: ["Tin", "Silicon", "Gold", "Riccite"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
    notes: "Highest spawn rates: Tin (36%), Silicon (36%), Gold (18%). 4 ore types found."
  },
  {
    name: "Arial",
    type: "moon",
    parentBody: "Hurston",
    gravity: "low",
    atmosphere: true,
    danger: "high",
    ores: ["Corundum", "Aluminium", "Titanium", "Ouratite", "Quantanium"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite", "Jaclium", "Saldynium", "Carinite"],
    notes: "Highest spawn rates: Corundum (30%), Aluminium (30%), Titanium (28%). 5 ore types found."
  },
  {
    name: "Calliope",
    type: "moon",
    parentBody: "microTech",
    gravity: "low",
    atmosphere: true,
    danger: "low",
    ores: ["Iron", "Ice", "Hephaestanite", "Quantanium"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite", "Jaclium", "Saldynium", "Carinite"],
    notes: "Highest spawn rates: Iron (33%), Ice (33%), Hephaestanite (33%). 4 ore types found."
  },
  {
    name: "Cellin",
    type: "moon",
    parentBody: "Crusader",
    gravity: "low",
    atmosphere: false,
    danger: "low",
    ores: ["Agricium", "Silicon", "Quartz", "Taranite", "Quantanium"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite", "Jaclium", "Saldynium", "Carinite"],
    notes: "Highest spawn rates: Agricium (28%), Silicon (26%), Quartz (26%). 5 ore types found."
  },
  {
    name: "Clio",
    type: "moon",
    parentBody: "microTech",
    gravity: "low",
    atmosphere: true,
    danger: "medium",
    ores: ["Ice", "Copper", "Taranite", "Quantanium"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite", "Jaclium", "Saldynium", "Carinite"],
    notes: "Highest spawn rates: Ice (40%), Copper (40%), Taranite (18%). 4 ore types found."
  },
  {
    name: "Daymar",
    type: "moon",
    parentBody: "Crusader",
    gravity: "low",
    atmosphere: true,
    danger: "low",
    ores: ["Silicon", "Quartz", "Agricium", "Quantanium"],
    fpsOres: ["Aphorite", "Hadanite", "Dolivine", "Janalite", "Jaclium", "Saldynium", "Carinite"],
    notes: "Highest spawn rates: Silicon (35%), Quartz (35%), Agricium (28%). 4 ore types found."
  },
  {
    name: "Euterpe",
    type: "moon",
    parentBody: "microTech",
    gravity: "low",
    atmosphere: true,
    danger: "low",
    ores: ["Ice", "Copper", "Taranite", "Quantanium"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite", "Jaclium", "Saldynium", "Carinite"],
    notes: "Highest spawn rates: Ice (40%), Copper (40%), Taranite (18%). 4 ore types found."
  },
  {
    name: "Fairo (Pyro Vb)",
    type: "moon",
    parentBody: "Pyro V",
    gravity: "low",
    atmosphere: false,
    danger: "high",
    ores: ["Iron", "Silicon", "Gold", "Riccite"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
    notes: "Highest spawn rates: Iron (36%), Silicon (36%), Gold (18%). 4 ore types found."
  },
  {
    name: "Fuego (Pyro Vc)",
    type: "moon",
    parentBody: "Pyro V",
    gravity: "low",
    atmosphere: false,
    danger: "high",
    ores: ["Iron", "Tungsten", "Borase", "Riccite"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
    notes: "Highest spawn rates: Iron (44%), Tungsten (28%), Borase (18%). 4 ore types found."
  },
  {
    name: "Ignis (Pyro Vd)",
    type: "moon",
    parentBody: "Pyro V",
    gravity: "low",
    atmosphere: false,
    danger: "high",
    ores: ["Tungsten", "Silicon", "Iron", "Bexalite", "Gold"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
    notes: "Highest spawn rates: Tungsten (28%), Silicon (27%), Iron (27%). 5 ore types found."
  },
  {
    name: "Ita",
    type: "moon",
    parentBody: "Hurston",
    gravity: "low",
    atmosphere: true,
    danger: "medium",
    ores: ["Aluminium", "Iron", "Titanium", "Aslarite", "Quantanium"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite", "Jaclium", "Saldynium", "Carinite"],
    notes: "Highest spawn rates: Aluminium (35%), Iron (35%), Titanium (14%). 5 ore types found."
  },
  {
    name: "Lyria",
    type: "moon",
    parentBody: "ArcCorp",
    gravity: "low",
    atmosphere: true,
    danger: "medium",
    ores: ["Iron", "Copper", "Laranite", "Quantanium"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite", "Jaclium", "Saldynium", "Carinite"],
    notes: "Highest spawn rates: Iron (35%), Copper (35%), Laranite (28%). 4 ore types found."
  },
  {
    name: "Magda",
    type: "moon",
    parentBody: "Hurston",
    gravity: "low",
    atmosphere: true,
    danger: "medium",
    ores: ["Tin", "Aluminium", "Aslarite", "Quantanium"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite", "Jaclium", "Saldynium", "Carinite"],
    notes: "Highest spawn rates: Tin (35%), Aluminium (35%), Aslarite (28%). 4 ore types found."
  },
  {
    name: "Vatra (Pyro Ve)",
    type: "moon",
    parentBody: "Pyro V",
    gravity: "low",
    atmosphere: false,
    danger: "high",
    ores: ["Aslarite", "Iron", "Hephaestanite", "Borase", "Bexalite"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
    notes: "Highest spawn rates: Aslarite (28%), Iron (27%), Hephaestanite (27%). 5 ore types found."
  },
  {
    name: "Vuur (Pyro Vf)",
    type: "moon",
    parentBody: "Pyro V",
    gravity: "low",
    atmosphere: false,
    danger: "high",
    ores: ["Hephaestanite", "Iron", "Bexalite", "Agricium", "Aslarite"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
    notes: "Highest spawn rates: Hephaestanite (27%), Iron (27%), Bexalite (18%). 5 ore types found."
  },
  {
    name: "Wala",
    type: "moon",
    parentBody: "ArcCorp",
    gravity: "low",
    atmosphere: true,
    danger: "low",
    ores: ["Laranite", "Copper", "Iron", "Beryl", "Quantanium"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite", "Jaclium", "Saldynium", "Carinite"],
    notes: "Highest spawn rates: Laranite (28%), Copper (26%), Iron (26%). 5 ore types found."
  },
  {
    name: "Yela",
    type: "moon",
    parentBody: "Crusader",
    gravity: "low",
    atmosphere: true,
    danger: "low",
    ores: ["Agricium", "Silicon", "Quartz", "Taranite", "Quantanium"],
    fpsOres: ["Aphorite", "Dolivine", "Hadanite", "Janalite", "Jaclium", "Saldynium", "Carinite"],
    notes: "Highest spawn rates: Agricium (28%), Silicon (26%), Quartz (26%). 5 ore types found."
  }
];

// server/prisma/seed-game-data.ts
var prisma = new PrismaClient();
async function main() {
  console.log("Seeding game data from client static files...\n");
  const oreData = ores.map((o, i) => ({
    name: o.name,
    abbrev: o.abbrev,
    type: o.type.toUpperCase(),
    valuePerSCU: o.valuePerSCU,
    instability: o.instability,
    resistance: o.resistance,
    description: o.description,
    sortOrder: scannerOreOrder.indexOf(o.abbrev) >= 0 ? scannerOreOrder.indexOf(o.abbrev) : i + 100
  }));
  for (const ore of oreData) {
    await prisma.gameOre.upsert({
      where: { abbrev: ore.abbrev },
      update: ore,
      create: ore
    });
  }
  console.log(`  Seeded ${oreData.length} ores`);
  const laserData = miningLasers.map((l) => ({
    name: l.name,
    size: l.size,
    price: l.price,
    optimumRange: l.optimumRange,
    maxRange: l.maxRange,
    minPower: l.minPower,
    minPowerPct: l.minPowerPct,
    maxPower: l.maxPower,
    extractPower: l.extractPower,
    moduleSlots: l.moduleSlots,
    resistance: l.resistance,
    instability: l.instability,
    optimalChargeRate: l.optimalChargeRate,
    optimalChargeWindow: l.optimalChargeWindow,
    inertMaterials: l.inertMaterials,
    description: l.description
  }));
  for (const laser of laserData) {
    await prisma.gameMiningLaser.upsert({
      where: { name: laser.name },
      update: laser,
      create: laser
    });
  }
  console.log(`  Seeded ${laserData.length} mining lasers`);
  const moduleData = [
    ...activeModules.map((m) => ({
      name: m.name,
      category: "ACTIVE",
      price: m.price,
      duration: m.duration,
      uses: m.uses,
      miningLaserPower: m.miningLaserPower,
      laserInstability: m.laserInstability,
      resistance: m.resistance,
      optimalChargeWindow: m.optimalChargeWindow,
      optimalChargeRate: m.optimalChargeRate,
      overchargeRate: m.overchargeRate,
      shatterDamage: m.shatterDamage,
      extractionLaserPower: m.extractionLaserPower,
      inertMaterials: m.inertMaterials,
      clusterModifier: m.clusterModifier,
      description: m.description
    })),
    ...passiveModules.map((m) => ({
      name: m.name,
      category: "PASSIVE",
      price: m.price,
      duration: m.duration,
      uses: m.uses,
      miningLaserPower: m.miningLaserPower,
      laserInstability: m.laserInstability,
      resistance: m.resistance,
      optimalChargeWindow: m.optimalChargeWindow,
      optimalChargeRate: m.optimalChargeRate,
      overchargeRate: m.overchargeRate,
      shatterDamage: m.shatterDamage,
      extractionLaserPower: m.extractionLaserPower,
      inertMaterials: m.inertMaterials,
      clusterModifier: m.clusterModifier,
      description: m.description
    })),
    ...miningGadgets.map((g) => ({
      name: g.name,
      category: "GADGET",
      price: g.price,
      duration: 0,
      uses: 0,
      miningLaserPower: 0,
      laserInstability: g.laserInstability,
      resistance: g.resistance,
      optimalChargeWindow: g.optimalChargeWindow,
      optimalChargeRate: g.optimalChargeRate,
      overchargeRate: 0,
      shatterDamage: 0,
      extractionLaserPower: g.extractionLaserPower,
      inertMaterials: g.inertMaterials,
      clusterModifier: g.clusterModifier,
      description: g.description
    }))
  ];
  for (const mod of moduleData) {
    await prisma.gameMiningModule.upsert({
      where: { name: mod.name },
      update: mod,
      create: mod
    });
  }
  console.log(`  Seeded ${moduleData.length} mining modules`);
  const shipData = miningShips.map((s) => ({
    name: s.name,
    manufacturer: s.manufacturer,
    size: s.size,
    cargoSCU: s.cargoSCU,
    miningTurrets: s.miningTurrets,
    crewMin: s.crewMin,
    crewMax: s.crewMax,
    isVehicle: s.isVehicle ?? false,
    description: s.description
  }));
  for (const ship of shipData) {
    await prisma.gameMiningShip.upsert({
      where: { name: ship.name },
      update: ship,
      create: ship
    });
  }
  console.log(`  Seeded ${shipData.length} mining ships`);
  const rockSigData = rockSignatures.map((r) => ({
    name: r.name,
    rarity: r.rarity
  }));
  for (const sig of rockSigData) {
    await prisma.gameRockSignature.upsert({
      where: { name: sig.name },
      update: sig,
      create: sig
    });
  }
  console.log(`  Seeded ${rockSigData.length} rock signatures`);
  const methodData = refineryMethods.map((m) => ({
    name: m.name,
    yieldMultiplier: m.yieldMultiplier,
    relativeTime: m.relativeTime,
    relativeCost: m.relativeCost,
    description: m.description
  }));
  for (const method of methodData) {
    await prisma.gameRefineryMethod.upsert({
      where: { name: method.name },
      update: method,
      create: method
    });
  }
  console.log(`  Seeded ${methodData.length} refinery methods`);
  const stationData = refineryStations.map((s) => ({
    name: s.name,
    location: s.location,
    bonuses: s.bonuses
  }));
  for (const station of stationData) {
    await prisma.gameRefineryStation.upsert({
      where: { name: station.name },
      update: station,
      create: station
    });
  }
  console.log(`  Seeded ${stationData.length} refinery stations`);
  const locationData = miningLocations.map((l) => ({
    name: l.name,
    type: l.type,
    parentBody: l.parentBody,
    gravity: l.gravity,
    atmosphere: l.atmosphere,
    danger: l.danger,
    ores: l.ores,
    fpsOres: l.fpsOres,
    notes: l.notes
  }));
  for (const loc of locationData) {
    await prisma.gameMiningLocation.upsert({
      where: { name: loc.name },
      update: loc,
      create: loc
    });
  }
  console.log(`  Seeded ${locationData.length} mining locations`);
  console.log("\nGame data seeding complete!");
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
