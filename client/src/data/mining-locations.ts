export interface MiningLocation {
  name: string;
  type: "moon" | "planet" | "asteroid_belt" | "station_adjacent";
  parentBody: string; // orbits around
  gravity: "none" | "low" | "medium" | "high";
  atmosphere: boolean;
  danger: "low" | "medium" | "high";
  ores: string[]; // ore names available here
  notes: string;
}

export const miningLocations: MiningLocation[] = [
  // Stanton I - Hurston moons
  {
    name: "Aberdeen",
    type: "moon",
    parentBody: "Hurston",
    gravity: "low",
    atmosphere: true,
    danger: "medium",
    ores: ["Agricium", "Aluminium", "Corundum", "Gold", "Hephaestanite", "Quartz"],
    notes: "Toxic atmosphere. Good for Agricium. Mid-tier mining spot.",
  },
  {
    name: "Arial",
    type: "moon",
    parentBody: "Hurston",
    gravity: "low",
    atmosphere: true,
    danger: "high",
    ores: ["Agricium", "Bexalite", "Laranite", "Aluminium", "Copper"],
    notes: "Extremely hot. One of the best spots for Bexalite and Laranite.",
  },
  {
    name: "Ita",
    type: "moon",
    parentBody: "Hurston",
    gravity: "low",
    atmosphere: true,
    danger: "medium",
    ores: ["Aluminium", "Copper", "Gold", "Tungsten", "Diamond"],
    notes: "Cold moon. Decent for Gold and Diamond. Lower value deposits.",
  },
  {
    name: "Magda",
    type: "moon",
    parentBody: "Hurston",
    gravity: "low",
    atmosphere: true,
    danger: "medium",
    ores: ["Aluminium", "Beryl", "Gold", "Hephaestanite", "Titanium"],
    notes: "Sandy terrain. Good mid-tier mining for Hephaestanite.",
  },
  // Stanton II - Crusader moons
  {
    name: "Cellin",
    type: "moon",
    parentBody: "Crusader",
    gravity: "low",
    atmosphere: false,
    danger: "low",
    ores: ["Agricium", "Aluminium", "Copper", "Gold", "Taranite", "Titanium"],
    notes: "No atmosphere, easy to navigate. Taranite and Agricium deposits.",
  },
  {
    name: "Daymar",
    type: "moon",
    parentBody: "Crusader",
    gravity: "low",
    atmosphere: true,
    danger: "low",
    ores: ["Aluminium", "Beryl", "Copper", "Gold", "Hadanite"],
    notes: "Popular for ROC mining Hadanite in caves. Beginner-friendly.",
  },
  {
    name: "Yela",
    type: "moon",
    parentBody: "Crusader",
    gravity: "low",
    atmosphere: true,
    danger: "low",
    ores: ["Agricium", "Aluminium", "Beryl", "Corundum", "Diamond", "Gold", "Taranite"],
    notes: "Ice moon. Good variety of ores. Popular for Taranite mining.",
  },
  // Stanton III - ArcCorp moons
  {
    name: "Lyria",
    type: "moon",
    parentBody: "ArcCorp",
    gravity: "low",
    atmosphere: true,
    danger: "medium",
    ores: ["Agricium", "Aluminium", "Gold", "Hadanite", "Laranite", "Taranite"],
    notes: "Ice moon. Good Hadanite spots for ROC mining. Laranite and Taranite deposits.",
  },
  {
    name: "Wala",
    type: "moon",
    parentBody: "ArcCorp",
    gravity: "low",
    atmosphere: true,
    danger: "low",
    ores: ["Aluminium", "Copper", "Gold", "Titanium", "Tungsten"],
    notes: "Low-tier mining. Good for beginners learning the ropes.",
  },
  // Stanton IV - microTech moons
  {
    name: "Calliope",
    type: "moon",
    parentBody: "microTech",
    gravity: "low",
    atmosphere: true,
    danger: "low",
    ores: ["Agricium", "Aluminium", "Copper", "Gold", "Laranite"],
    notes: "Forested moon. Good Laranite deposits. Peaceful area.",
  },
  {
    name: "Clio",
    type: "moon",
    parentBody: "microTech",
    gravity: "low",
    atmosphere: true,
    danger: "medium",
    ores: ["Agricium", "Aluminium", "Gold", "Quantanium", "Taranite"],
    notes: "Ice moon. One of the few surface locations for Quantanium. High risk, high reward.",
  },
  {
    name: "Euterpe",
    type: "moon",
    parentBody: "microTech",
    gravity: "low",
    atmosphere: true,
    danger: "low",
    ores: ["Aluminium", "Beryl", "Copper", "Gold", "Hephaestanite"],
    notes: "Icy terrain. Decent Hephaestanite. Good for mid-level miners.",
  },
  // Asteroid Belts
  {
    name: "Aaron Halo",
    type: "asteroid_belt",
    parentBody: "Stanton (system)",
    gravity: "none",
    atmosphere: false,
    danger: "high",
    ores: ["Quantanium", "Bexalite", "Taranite", "Laranite", "Agricium", "Gold", "Titanium", "Hephaestanite", "Diamond"],
    notes: "THE spot for Quantanium. Highest density of valuable ores in Stanton. No gravity = no crash landings but navigation is harder. Watch your Quantanium timer.",
  },
];

// Quick lookup: which locations have a given ore
export function locationsForOre(oreName: string): MiningLocation[] {
  return miningLocations.filter((loc) => loc.ores.includes(oreName));
}
