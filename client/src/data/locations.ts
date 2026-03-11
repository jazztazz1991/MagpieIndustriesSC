export type LocationType =
  | "star"
  | "planet"
  | "moon"
  | "city"
  | "station"
  | "rest_stop"
  | "outpost"
  | "poi";

export interface Location {
  name: string;
  type: LocationType;
  parent: string | null;
  description: string;
  features: string[];
}

export const locations: Location[] = [
  // Star
  {
    name: "Stanton",
    type: "star",
    parent: null,
    description: "The Stanton system — a single-star system with four super-planets, each owned by a megacorporation.",
    features: ["Main playable system", "4 planets", "12+ moons", "Multiple space stations"],
  },

  // Planets
  {
    name: "Hurston",
    type: "planet",
    parent: "Stanton",
    description: "An ecologically devastated planet owned by Hurston Dynamics. Heavy industry and pollution.",
    features: ["Lorville landing zone", "Savannah and desert biomes", "Mining operations", "Security zones"],
  },
  {
    name: "Crusader",
    type: "planet",
    parent: "Stanton",
    description: "A gas giant owned by Crusader Industries. The only landing zone is the floating city of Orison.",
    features: ["Orison floating city", "Gas giant — no surface landing", "3 moons", "Port Olisar station"],
  },
  {
    name: "ArcCorp",
    type: "planet",
    parent: "Stanton",
    description: "A fully urbanized planet-wide city owned by ArcCorp. The entire surface is developed.",
    features: ["Area 18 landing zone", "Planet-wide cityscape", "Industrial zones", "2 moons"],
  },
  {
    name: "microTech",
    type: "planet",
    parent: "Stanton",
    description: "A frigid planet owned by microTech. Known for harsh weather and beautiful snow-covered landscapes.",
    features: ["New Babbage landing zone", "Blizzards and snow biomes", "Tech industry", "3 moons"],
  },

  // Hurston moons
  {
    name: "Arial",
    type: "moon",
    parent: "Hurston",
    description: "A volcanic moon with active lava flows and rich mineral deposits.",
    features: ["Volcanic terrain", "Rich mining deposits", "High temperatures", "HDMS outposts"],
  },
  {
    name: "Aberdeen",
    type: "moon",
    parent: "Hurston",
    description: "A toxic moon with a corrosive atmosphere and swampy terrain.",
    features: ["Toxic atmosphere", "Swamp biomes", "Cave systems", "Hadanite deposits"],
  },
  {
    name: "Magda",
    type: "moon",
    parent: "Hurston",
    description: "A barren, rocky moon with sparse resources.",
    features: ["Rocky terrain", "Low resources", "Research outposts"],
  },
  {
    name: "Ita",
    type: "moon",
    parent: "Hurston",
    description: "A small icy moon on the outer edge of Hurston's orbit.",
    features: ["Ice terrain", "Low gravity", "Remote location"],
  },

  // Crusader moons
  {
    name: "Cellin",
    type: "moon",
    parent: "Crusader",
    description: "A volcanic moon with geysers and lava tubes. Rich in minerals.",
    features: ["Volcanic activity", "Geyser fields", "Mining deposits", "Security Post Kareah nearby"],
  },
  {
    name: "Daymar",
    type: "moon",
    parent: "Crusader",
    description: "A desert moon with canyons and craters. Popular for mining and ground exploration.",
    features: ["Desert terrain", "Deep canyons", "Bountiful Harvest outpost", "Good mining spots"],
  },
  {
    name: "Yela",
    type: "moon",
    parent: "Crusader",
    description: "An icy moon with an asteroid ring. Home to Grim HEX outlaw station.",
    features: ["Ice and snow", "Asteroid belt", "Grim HEX station", "Drug labs"],
  },

  // ArcCorp moons
  {
    name: "Lyria",
    type: "moon",
    parent: "ArcCorp",
    description: "A frozen moon with an icy surface. ArcCorp mining operations are scattered across it.",
    features: ["Ice terrain", "ArcCorp mining outposts", "Drug labs", "Quantanium deposits"],
  },
  {
    name: "Wala",
    type: "moon",
    parent: "ArcCorp",
    description: "A small barren moon with craters and minimal atmosphere.",
    features: ["Low gravity", "Crater fields", "Samson & Son Salvage"],
  },

  // microTech moons
  {
    name: "Calliope",
    type: "moon",
    parent: "microTech",
    description: "A frozen moon with harsh blizzards and dense snow cover.",
    features: ["Extreme cold", "Blizzard weather", "Research outposts"],
  },
  {
    name: "Clio",
    type: "moon",
    parent: "microTech",
    description: "A rocky and icy moon with mountainous terrain.",
    features: ["Mountain ranges", "Ice fields", "Low population"],
  },
  {
    name: "Euterpe",
    type: "moon",
    parent: "microTech",
    description: "A small icy moon with rolling snow plains.",
    features: ["Snow plains", "Quiet and remote", "Minimal outposts"],
  },

  // Major cities
  {
    name: "Lorville",
    type: "city",
    parent: "Hurston",
    description: "The main landing zone on Hurston. A gritty industrial city run by Hurston Dynamics.",
    features: ["Teasa Spaceport", "CBD trade area", "L19 residentials", "Armor and weapon shops"],
  },
  {
    name: "Orison",
    type: "city",
    parent: "Crusader",
    description: "A floating platform city in Crusader's upper atmosphere. Beautiful cloud views.",
    features: ["August Dunlow Spaceport", "Cloudview Center", "Crusader showroom", "Promenade shops"],
  },
  {
    name: "Area 18",
    type: "city",
    parent: "ArcCorp",
    description: "A bustling commercial hub on ArcCorp. Neon-lit streets with shops and trade.",
    features: ["Riker Memorial Spaceport", "TDD trade center", "Cubby Blast weapon shop", "Dumpers Depot"],
  },
  {
    name: "New Babbage",
    type: "city",
    parent: "microTech",
    description: "A clean, modern city on microTech. Hub for tech industry and high-end shopping.",
    features: ["Aspire Grand spaceport", "The Commons shopping", "microTech HQ", "MT Data Center"],
  },

  // Key stations
  {
    name: "Port Olisar",
    type: "station",
    parent: "Crusader",
    description: "An orbital station above Crusader. One of the original spawn points in Star Citizen.",
    features: ["Trade terminal", "Ship spawning", "Orbital views of Crusader"],
  },
  {
    name: "Grim HEX",
    type: "station",
    parent: "Yela",
    description: "An outlaw station carved into an asteroid near Yela. No-questions-asked services.",
    features: ["Criminal spawn point", "Black market trades", "No security scans", "Drug trading"],
  },
  {
    name: "Everus Harbor",
    type: "station",
    parent: "Hurston",
    description: "Hurston's orbital station. Offers trade, refueling, and ship services.",
    features: ["Orbital station", "Refuel and repair", "Trade terminal", "Clinic"],
  },
  {
    name: "Baijini Point",
    type: "station",
    parent: "ArcCorp",
    description: "ArcCorp's orbital station. Standard station amenities above the city planet.",
    features: ["Ship services", "Trade terminal", "Refinery access"],
  },
  {
    name: "Port Tressler",
    type: "station",
    parent: "microTech",
    description: "microTech's orbital station. Clean design matching the planet's aesthetic.",
    features: ["Trade terminal", "Refinery", "Ship customization", "Clinic"],
  },

  // Wikelo Emporiums
  {
    name: "Dasi Station",
    type: "station",
    parent: "Hurston",
    description: "Wikelo Emporium station in Hurston orbit. Home to Banu trader Wikelo.",
    features: ["Wikelo contracts", "Reward exchange", "All reputation tiers"],
  },
  {
    name: "Selo Station",
    type: "station",
    parent: "Yela",
    description: "Wikelo Emporium station in Yela orbit. Second Banu trading post.",
    features: ["Wikelo contracts", "Reward exchange", "All reputation tiers"],
  },
  {
    name: "Kinga Station",
    type: "station",
    parent: "microTech",
    description: "Wikelo Emporium station in microTech orbit. Third Banu trading post.",
    features: ["Wikelo contracts", "Reward exchange", "All reputation tiers"],
  },
];

export const locationTypes: LocationType[] = [
  "star", "planet", "moon", "city", "station", "rest_stop", "outpost", "poi",
];

export const planets = locations.filter((l) => l.type === "planet");
export const moons = locations.filter((l) => l.type === "moon");
export const cities = locations.filter((l) => l.type === "city");
export const stations = locations.filter((l) => l.type === "station");
