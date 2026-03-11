// Wikelo Mission Data — Banu trader contracts in the Stanton system
// Based on actual in-game data as of Alpha 4.6.0

export type ReputationTier = "New Customer" | "Very Good Customer" | "Very Best Customer";

export type ContractCategory = "currency" | "utility" | "weapon" | "armor" | "vehicle" | "ship" | "component";

export interface WikeloContract {
  id: string;
  name: string;
  tier: ReputationTier;
  category: ContractCategory;
  requirements: { item: string; quantity: number }[];
  rewards: string[];
  active: boolean;
  notes?: string;
}

export interface GatheringItem {
  name: string;
  category: "ore" | "harvestable" | "creature_drop" | "scrip" | "loot" | "component" | "commodity";
  locations: string[];
  tips: string;
}

export interface Emporium {
  name: string;
  planet: string;
  moon?: string;
  system: string;
  coordinates: string;
  description: string;
  howToGet: string[];
  tiers: ReputationTier[];
}

export interface FavorConversion {
  name: string;
  input: { item: string; quantity: number }[];
  output: { item: string; quantity: number };
}

export const reputationTiers: {
  tier: ReputationTier;
  requirement: string;
  benefits: string[];
}[] = [
  {
    tier: "New Customer",
    requirement: "Complete the introduction mission 'New to System' (1x Vestal Water, 3x Tundra Kopion Horn).",
    benefits: [
      "Access to basic collection contracts",
      "Earn Wikelo Favors through scrip/material conversion",
      "Weapons, armor skins, and basic vehicle contracts",
      "Reputation increases with each completed contract",
    ],
  },
  {
    tier: "Very Good Customer",
    requirement: "Accumulate enough reputation through completed contracts.",
    benefits: [
      "Access to mid-tier contracts with better rewards",
      "Unlocks exclusive armor sets and weapon skins",
      "Mid-tier ship rewards (Intrepid, Scorpius, Prospector)",
      "Multi-material contracts with higher complexity",
    ],
  },
  {
    tier: "Very Best Customer",
    requirement: "Reach maximum reputation through extensive contract completion.",
    benefits: [
      "Access to all contracts including capital ship rewards",
      "Polaris and Idris-P ship contracts",
      "Exclusive cosmetic armor sets",
      "Highest-value contracts in the game",
    ],
  },
];

export const emporiums: Emporium[] = [
  {
    name: "Dasi Station",
    planet: "Hurston",
    system: "Stanton",
    coordinates: "Orbit around Hurston",
    description:
      "The first Wikelo Emporium most players encounter. An asteroid base in Hurston orbit, easily accessible from Lorville.",
    howToGet: [
      "Depart from Lorville spaceport",
      "Quantum travel to Dasi Station (appears in orbital markers)",
      "Land at the station and head to the Wikelo Emporium storefront",
      "Deposit contract items via the on-site freight elevator",
    ],
    tiers: ["New Customer", "Very Good Customer", "Very Best Customer"],
  },
  {
    name: "Selo Station",
    planet: "Crusader",
    moon: "Yela",
    system: "Stanton",
    coordinates: "Orbit around Yela",
    description:
      "An asteroid base near Yela. A good stop for miners already working the asteroid belt or nearby moons.",
    howToGet: [
      "Quantum travel to Yela from any Crusader location",
      "Look for Selo Station in the orbital markers",
      "Approach and land at the station",
      "The Emporium is near the main trading area",
    ],
    tiers: ["New Customer", "Very Good Customer", "Very Best Customer"],
  },
  {
    name: "Kinga Station",
    planet: "microTech",
    system: "Stanton",
    coordinates: "Orbit around microTech",
    description:
      "The microTech Emporium. Convenient if you are already operating in the microTech area near New Babbage.",
    howToGet: [
      "Depart from New Babbage spaceport",
      "Quantum travel to Kinga Station in microTech orbit",
      "Dock at the station",
      "Find the Wikelo Emporium storefront inside",
    ],
    tiers: ["New Customer", "Very Good Customer", "Very Best Customer"],
  },
];

// Favor conversion contracts — how to earn Wikelo Favors
export const favorConversions: FavorConversion[] = [
  {
    name: "Turn Things to Favor",
    input: [{ item: "Carinite", quantity: 50 }],
    output: { item: "Wikelo Favor", quantity: 1 },
  },
  {
    name: "Trade MG Scrip for Favors",
    input: [{ item: "MG Scrip", quantity: 50 }],
    output: { item: "Wikelo Favor", quantity: 1 },
  },
  {
    name: "Trade Council Scrip for Favors",
    input: [{ item: "Council Scrip", quantity: 50 }],
    output: { item: "Wikelo Favor", quantity: 1 },
  },
  {
    name: "Trade Worm Parts for Favors",
    input: [{ item: "Irradiated Valakkar Pearl (Grade AAA)", quantity: 12 }],
    output: { item: "Wikelo Favor", quantity: 1 },
  },
  {
    name: "Want Polaris? Need something special.",
    input: [{ item: "Quantanium (24 SCU)", quantity: 1 }],
    output: { item: "Polaris Bit", quantity: 1 },
  },
];

export const contracts: WikeloContract[] = [
  // Introduction
  {
    id: "intro",
    name: "New to System",
    tier: "New Customer",
    category: "utility",
    requirements: [
      { item: "Vestal Water", quantity: 1 },
      { item: "Tundra Kopion Horn", quantity: 3 },
    ],
    rewards: ["Access to all Wikelo contracts"],
    active: true,
    notes: "Mandatory introduction mission. Must be completed before any other contracts are available.",
  },

  // Utility
  {
    id: "util-1",
    name: "Want Better Eyes",
    tier: "New Customer",
    category: "utility",
    requirements: [
      { item: "Wikelo Favor", quantity: 1 },
      { item: "Yormandi Eye", quantity: 2 },
      { item: "Yormandi Tongue", quantity: 1 },
    ],
    rewards: ["XDL \"Mark I\" Monocular Rangefinder"],
    active: true,
  },

  // Weapons
  {
    id: "wpn-1",
    name: "Fun Kopion Skull Gun",
    tier: "New Customer",
    category: "weapon",
    requirements: [
      { item: "Jaclium (Ore)", quantity: 40 },
      { item: "Saldynium (Ore)", quantity: 30 },
      { item: "Carinite", quantity: 20 },
      { item: "Parallax Energy Assault Rifle", quantity: 1 },
      { item: "Tundra Kopion Horn", quantity: 35 },
    ],
    rewards: ["Parallax \"Fun Kopion Skull\" Energy Assault Rifle"],
    active: true,
    notes: "Unique weapon skin. Requires significant ore farming.",
  },
  {
    id: "wpn-2",
    name: "Fun Kopion Tooth Gun",
    tier: "New Customer",
    category: "weapon",
    requirements: [
      { item: "Jaclium (Ore)", quantity: 40 },
      { item: "Saldynium (Ore)", quantity: 30 },
      { item: "Carinite", quantity: 20 },
      { item: "Parallax Energy Assault Rifle", quantity: 1 },
      { item: "Tundra Kopion Tooth", quantity: 35 },
    ],
    rewards: ["Parallax \"Fun Kopion Tooth\" Energy Assault Rifle"],
    active: true,
  },
  {
    id: "wpn-3",
    name: "Fun Military Skull Gun",
    tier: "New Customer",
    category: "weapon",
    requirements: [
      { item: "Jaclium (Ore)", quantity: 40 },
      { item: "Saldynium (Ore)", quantity: 30 },
      { item: "Carinite", quantity: 20 },
      { item: "Parallax Energy Assault Rifle", quantity: 1 },
      { item: "Military Skull", quantity: 20 },
    ],
    rewards: ["Parallax \"Fun Military Skull\" Energy Assault Rifle"],
    active: true,
  },
  {
    id: "wpn-4",
    name: "Fun Military Tooth Gun",
    tier: "New Customer",
    category: "weapon",
    requirements: [
      { item: "Jaclium (Ore)", quantity: 40 },
      { item: "Saldynium (Ore)", quantity: 30 },
      { item: "Carinite", quantity: 20 },
      { item: "Parallax Energy Assault Rifle", quantity: 1 },
      { item: "Military Badge", quantity: 20 },
    ],
    rewards: ["Parallax \"Fun Military Tooth\" Energy Assault Rifle"],
    active: true,
  },
  {
    id: "wpn-5",
    name: "Yormandi Gun",
    tier: "New Customer",
    category: "weapon",
    requirements: [
      { item: "Fresnel Energy LMG", quantity: 1 },
      { item: "Yormandi Eye", quantity: 4 },
      { item: "Yormandi Tongue", quantity: 2 },
    ],
    rewards: ["Fresnel \"Yormandi\" LMG"],
    active: true,
    notes: "Unique LMG skin using Yormandi creature drops.",
  },
  {
    id: "wpn-6",
    name: "Snow Snipe",
    tier: "New Customer",
    category: "weapon",
    requirements: [
      { item: "ASD Secure Drive", quantity: 10 },
      { item: "Zenith Sniper Rifle", quantity: 1 },
    ],
    rewards: ["Zenith \"Snow Camo\" Sniper Rifle"],
    active: true,
  },
  {
    id: "wpn-7",
    name: "Make gun sandy",
    tier: "New Customer",
    category: "weapon",
    requirements: [
      { item: "ASD Secure Drive", quantity: 10 },
      { item: "Parallax Energy Assault Rifle", quantity: 1 },
    ],
    rewards: ["Parallax \"Desert Camo\" Assault Rifle"],
    active: true,
  },
  {
    id: "wpn-8",
    name: "Prettify Karna Gun",
    tier: "New Customer",
    category: "weapon",
    requirements: [
      { item: "Saldynium (Ore)", quantity: 20 },
      { item: "Carinite", quantity: 15 },
      { item: "Karna Plasma Rifle", quantity: 1 },
    ],
    rewards: ["Karna \"Wikelo Special\" Plasma Rifle"],
    active: true,
  },
  {
    id: "wpn-9",
    name: "Zappy gun more woodlike",
    tier: "New Customer",
    category: "weapon",
    requirements: [
      { item: "Carinite", quantity: 15 },
      { item: "Jaclium (Ore)", quantity: 20 },
      { item: "Volt Electron Pistol", quantity: 1 },
    ],
    rewards: ["Volt \"Woodgrain\" Electron Pistol"],
    active: true,
  },
  {
    id: "wpn-10",
    name: "Volt gun more Navy-like",
    tier: "New Customer",
    category: "weapon",
    requirements: [
      { item: "Ace Interceptor Helmet", quantity: 5 },
      { item: "Volt Electron Pistol", quantity: 1 },
    ],
    rewards: ["Volt \"Navy\" Electron Pistol"],
    active: true,
  },
  {
    id: "wpn-11",
    name: "Make VOLT shotgun angrier",
    tier: "New Customer",
    category: "weapon",
    requirements: [
      { item: "Saldynium (Ore)", quantity: 15 },
      { item: "Jaclium (Ore)", quantity: 15 },
      { item: "VOLT Scatter Shotgun", quantity: 1 },
    ],
    rewards: ["VOLT \"Angry\" Scatter Shotgun"],
    active: true,
  },
  {
    id: "wpn-12",
    name: "F55 Look Better",
    tier: "New Customer",
    category: "weapon",
    requirements: [
      { item: "Carinite", quantity: 10 },
      { item: "F55 LMG", quantity: 1 },
    ],
    rewards: ["F55 \"Wikelo\" LMG"],
    active: true,
  },
  {
    id: "wpn-13",
    name: "Fix up Coda gun",
    tier: "New Customer",
    category: "weapon",
    requirements: [
      { item: "Jaclium (Ore)", quantity: 10 },
      { item: "Saldynium (Ore)", quantity: 10 },
      { item: "Coda Pistol", quantity: 1 },
    ],
    rewards: ["Coda \"Wikelo\" Pistol"],
    active: true,
  },
  {
    id: "wpn-14",
    name: "Need Ore. Will give Guns.",
    tier: "New Customer",
    category: "weapon",
    requirements: [
      { item: "Saldynium (Ore)", quantity: 25 },
      { item: "Jaclium (Ore)", quantity: 25 },
      { item: "Carinite", quantity: 10 },
    ],
    rewards: ["1x Grade A Size 1 Ship Component (random)"],
    active: true,
    notes: "Random reward from military-grade ship components.",
  },
  {
    id: "wpn-15",
    name: "Heavy Volt Zapper",
    tier: "New Customer",
    category: "weapon",
    requirements: [
      { item: "RCMBNT-XTL Module A", quantity: 5 },
      { item: "RCMBNT-XTL Module B", quantity: 5 },
      { item: "RCMBNT-XTL Module C", quantity: 5 },
      { item: "RCMBNT-XTL Module D", quantity: 5 },
      { item: "RCMBNT-XTL Module E", quantity: 5 },
    ],
    rewards: ["Volt Heavy Electron Cannon"],
    active: false,
    notes: "Currently inactive. Requires facility-specific loot.",
  },

  // Armor
  {
    id: "arm-1",
    name: "Test Armor",
    tier: "New Customer",
    category: "armor",
    requirements: [
      { item: "Yormandi Eye", quantity: 14 },
      { item: "Yormandi Tongue", quantity: 7 },
    ],
    rewards: ["Palatino Armor Mark 1 Set (Full)"],
    active: true,
    notes: "Requires significant Yormandi creature farming.",
  },
  {
    id: "arm-2",
    name: "Hide Snow Suit",
    tier: "New Customer",
    category: "armor",
    requirements: [
      { item: "ASD Secure Drive", quantity: 4 },
      { item: "Geist Armor ASD Edition (Full Set)", quantity: 1 },
    ],
    rewards: ["Geist Snow Camo Armor Set"],
    active: true,
  },
  {
    id: "arm-3",
    name: "Look at desert but don't see you",
    tier: "New Customer",
    category: "armor",
    requirements: [
      { item: "ASD Secure Drive", quantity: 4 },
      { item: "Geist Armor ASD Edition (Full Set)", quantity: 1 },
    ],
    rewards: ["Geist Desert Camo Armor Set"],
    active: true,
  },
  {
    id: "arm-4",
    name: "Make glowy armor",
    tier: "Very Good Customer",
    category: "armor",
    requirements: [
      { item: "Irradiated Valakkar Pearl (Grade AAA)", quantity: 1 },
      { item: "Valakkar Apex Fang", quantity: 2 },
      { item: "Valakkar Adult Fang", quantity: 15 },
      { item: "Valakkar Juvenile Fang", quantity: 20 },
      { item: "Antium Armor Set (Full)", quantity: 1 },
    ],
    rewards: ["Bokto Armor Set (Glowing)"],
    active: true,
    notes: "Exclusive glowing armor set. Requires rare Valakkar creature drops.",
  },
  {
    id: "arm-5",
    name: "Armor with horn and string",
    tier: "New Customer",
    category: "armor",
    requirements: [
      { item: "Tundra Kopion Horn", quantity: 20 },
      { item: "Saldynium (Ore)", quantity: 15 },
      { item: "Carinite", quantity: 10 },
    ],
    rewards: ["Kopion-Themed Armor Set"],
    active: true,
  },
  {
    id: "arm-6",
    name: "Make space navy armor",
    tier: "New Customer",
    category: "armor",
    requirements: [
      { item: "Ace Interceptor Helmet", quantity: 10 },
      { item: "Military Badge", quantity: 5 },
      { item: "Tevarin Marker", quantity: 1 },
    ],
    rewards: ["Navy-Styled Combat Armor Set"],
    active: true,
  },
  {
    id: "arm-7",
    name: "Walk in danger. Look good",
    tier: "New Customer",
    category: "armor",
    requirements: [
      { item: "Vanduul Plating", quantity: 5 },
      { item: "Vanduul Metal", quantity: 5 },
    ],
    rewards: ["Vanduul-Styled Armor Set"],
    active: true,
  },
  {
    id: "arm-8",
    name: "Want armor look like tree?",
    tier: "New Customer",
    category: "armor",
    requirements: [
      { item: "Carinite", quantity: 20 },
      { item: "Jaclium (Ore)", quantity: 15 },
      { item: "Saldynium (Ore)", quantity: 15 },
    ],
    rewards: ["Woodland Camo Armor Set"],
    active: true,
  },
  {
    id: "arm-9",
    name: "Xi'an Xanthule Suit made better",
    tier: "Very Good Customer",
    category: "armor",
    requirements: [
      { item: "Xanthule Armor Set + Helmet (Full)", quantity: 1 },
      { item: "Ace Interceptor Helmet", quantity: 10 },
      { item: "Tevarin Marker", quantity: 1 },
      { item: "MG Scrip", quantity: 20 },
    ],
    rewards: ["Xanthule Ascension Armor Set"],
    active: true,
    notes: "Upgraded Xi'an armor variant. Requires the base armor set.",
  },
  {
    id: "arm-10",
    name: "Turn ATLS suit pretty",
    tier: "New Customer",
    category: "armor",
    requirements: [
      { item: "Saldynium (Ore)", quantity: 10 },
      { item: "Carinite", quantity: 10 },
    ],
    rewards: ["ATLS Custom Paint Suit"],
    active: true,
  },

  // Vehicles & Ships
  {
    id: "veh-1",
    name: "Make ATLS shoot",
    tier: "New Customer",
    category: "vehicle",
    requirements: [
      { item: "Wikelo Favor", quantity: 2 },
      { item: "ASD Secure Drive", quantity: 15 },
    ],
    rewards: ["ATLS (Armed Variant)"],
    active: true,
  },
  {
    id: "veh-2",
    name: "Make jumpy ATLS shoot",
    tier: "New Customer",
    category: "vehicle",
    requirements: [
      { item: "Wikelo Favor", quantity: 2 },
      { item: "ASD Secure Drive", quantity: 15 },
    ],
    rewards: ["ATLS (Jump-Jet Armed Variant)"],
    active: true,
  },
  {
    id: "veh-3",
    name: "Adventure a A-Venture",
    tier: "New Customer",
    category: "vehicle",
    requirements: [
      { item: "Wikelo Favor", quantity: 5 },
      { item: "Carinite", quantity: 20 },
      { item: "Saldynium (Ore)", quantity: 20 },
    ],
    rewards: ["Tumbril Venture (Custom)"],
    active: true,
  },
  {
    id: "ship-1",
    name: "Need mining things. Clever things to trade.",
    tier: "Very Good Customer",
    category: "ship",
    requirements: [
      { item: "Wikelo Favor", quantity: 6 },
      { item: "Carinite", quantity: 20 },
      { item: "Saldynium (Ore)", quantity: 30 },
      { item: "Jaclium (Ore)", quantity: 40 },
      { item: "Carinite (Pure)", quantity: 1 },
    ],
    rewards: ["MISC Prospector"],
    active: true,
    notes: "Reward ship comes pre-equipped with Grade A industrial components.",
  },
  {
    id: "ship-2",
    name: "Very Hungry",
    tier: "Very Good Customer",
    category: "ship",
    requirements: [
      { item: "Wikelo Favor", quantity: 8 },
      { item: "Valakkar Apex Fang", quantity: 5 },
      { item: "Valakkar Adult Fang", quantity: 20 },
      { item: "Irradiated Valakkar Pearl (Grade AA)", quantity: 3 },
    ],
    rewards: ["Drake Vulture"],
    active: true,
    notes: "Salvage ship reward. Requires Valakkar creature farming.",
  },
  {
    id: "ship-3",
    name: "Want big ship? But not too big?",
    tier: "Very Good Customer",
    category: "ship",
    requirements: [
      { item: "Wikelo Favor", quantity: 10 },
      { item: "Vanduul Plating", quantity: 10 },
      { item: "Vanduul Metal", quantity: 10 },
      { item: "Large Artifact Fragment (Pristine)", quantity: 1 },
    ],
    rewards: ["L-21 Wolf (Stealth Spec)"],
    active: true,
  },
  {
    id: "ship-4",
    name: "Have Good Ships for trade",
    tier: "Very Good Customer",
    category: "ship",
    requirements: [
      { item: "Wikelo Favor", quantity: 10 },
    ],
    rewards: ["Random ship: Intrepid, Scorpius, C1 Spirit, Fortune, or Pulse"],
    active: false,
    notes: "Currently unavailable. Rewards one of several mid-tier ships randomly.",
  },
  {
    id: "ship-5",
    name: "Very very nice ship for trade",
    tier: "Very Best Customer",
    category: "ship",
    requirements: [
      { item: "Wikelo Favor", quantity: 25 },
      { item: "Vanduul Plating", quantity: 20 },
      { item: "Vanduul Metal", quantity: 20 },
      { item: "Military Medal", quantity: 2 },
    ],
    rewards: ["Zeus Mk II ES"],
    active: true,
  },
  {
    id: "ship-6",
    name: "Want super useful ship parts?",
    tier: "Very Good Customer",
    category: "ship",
    requirements: [
      { item: "Wikelo Favor", quantity: 5 },
      { item: "Ace Interceptor Helmet", quantity: 10 },
    ],
    rewards: ["Grade A Military Ship Components (set)"],
    active: true,
  },
  {
    id: "ship-7",
    name: "Trade for useful ship parts",
    tier: "New Customer",
    category: "component",
    requirements: [
      { item: "CF-337 Panther Repeater", quantity: 1 },
      { item: "Ace Interceptor Helmet", quantity: 3 },
    ],
    rewards: ["1x Grade A Size 1 Military Component (random: FR-66, JS-300, VK-00, or Glacier)"],
    active: false,
    notes: "Currently unavailable.",
  },
  {
    id: "ship-8",
    name: "Trade for very useful ship parts",
    tier: "Very Good Customer",
    category: "component",
    requirements: [
      { item: "Wikelo Favor", quantity: 3 },
      { item: "CF-337 Panther Repeater", quantity: 2 },
      { item: "Ace Interceptor Helmet", quantity: 5 },
    ],
    rewards: ["Grade A Size 2 Military Components"],
    active: true,
  },
  {
    id: "ship-9",
    name: "Now make Polaris. Short Time Deal.",
    tier: "Very Best Customer",
    category: "ship",
    requirements: [
      { item: "Wikelo Favor", quantity: 50 },
      { item: "Polaris Bit", quantity: 25 },
      { item: "DCHS-05 Orbital Positioning Comp-Board", quantity: 50 },
      { item: "Vanduul Plating", quantity: 30 },
      { item: "Vanduul Metal", quantity: 30 },
    ],
    rewards: ["RSI Polaris (Wikelo Special)"],
    active: true,
    notes: "End-game contract. Polaris Bits earned by trading 24 SCU Quantanium each. Pre-equipped with military-grade components.",
  },
  {
    id: "ship-10",
    name: "AEGIS Idris P",
    tier: "Very Best Customer",
    category: "ship",
    requirements: [
      { item: "Wikelo Favor", quantity: 50 },
      { item: "Polaris Bit", quantity: 50 },
      { item: "DCHS-05 Orbital Positioning Comp-Board", quantity: 50 },
    ],
    rewards: ["Aegis Idris-P"],
    active: true,
    notes: "The ultimate Wikelo contract. Requires extensive material farming and Polaris Bit accumulation.",
  },
];

export const gatheringItems: GatheringItem[] = [
  // Ores (FPS mineable)
  { name: "Carinite", category: "ore", locations: ["Planet surfaces in Stanton", "Cave deposits"], tips: "A rare mineral used in advanced electronics. Mine with the multi-tool mining attachment. High demand for many Wikelo contracts." },
  { name: "Carinite (Pure)", category: "ore", locations: ["Extremely rare cave deposits"], tips: "Ultra-rare pure variant. Very low spawn rate — check deep cave systems." },
  { name: "Saldynium (Ore)", category: "ore", locations: ["Asteroid surfaces", "Moon ore deposits"], tips: "Rare metal valued for laser production. Found in specific geological formations." },
  { name: "Jaclium (Ore)", category: "ore", locations: ["Moon surfaces", "Cave deposits in Stanton"], tips: "A harvestable metal ore. Often co-located with Saldynium deposits." },

  // Creature drops
  { name: "Tundra Kopion Horn", category: "creature_drop", locations: ["microTech surface", "Calliope", "Clio"], tips: "Dropped by Tundra Kopions. Needed for the intro mission and many weapon contracts. Approach carefully — they can be aggressive." },
  { name: "Tundra Kopion Tooth", category: "creature_drop", locations: ["microTech surface", "Calliope", "Clio"], tips: "Rarer drop from Tundra Kopions. Used in Kopion Tooth weapon skins." },
  { name: "Yormandi Eye", category: "creature_drop", locations: ["Hurston surface", "Aberdeen"], tips: "Dropped by Yormandi creatures. Required for armor sets and the Yormandi Gun contract." },
  { name: "Yormandi Tongue", category: "creature_drop", locations: ["Hurston surface", "Aberdeen"], tips: "Rarer Yormandi drop. Fewer needed per contract but harder to obtain." },
  { name: "Valakkar Apex Fang", category: "creature_drop", locations: ["Underground cave systems", "Specific moon biomes"], tips: "Very rare drop from apex Valakkar creatures. Required for glowing armor and ship contracts." },
  { name: "Valakkar Adult Fang", category: "creature_drop", locations: ["Cave systems", "Moon surfaces"], tips: "Dropped by adult Valakkar. More common than apex fangs but still requires cave exploration." },
  { name: "Valakkar Juvenile Fang", category: "creature_drop", locations: ["Cave entrances", "Surface near cave systems"], tips: "Most common Valakkar drop. Juveniles are easier to find near cave openings." },
  { name: "Irradiated Valakkar Pearl (Grade AA)", category: "creature_drop", locations: ["Deep cave systems"], tips: "Rare harvestable from Valakkar nests. Grade AA is moderately rare." },
  { name: "Irradiated Valakkar Pearl (Grade AAA)", category: "creature_drop", locations: ["Deep cave systems"], tips: "Extremely rare. Required for glowing armor contract and favor conversion." },
  { name: "Vestal Water", category: "harvestable", locations: ["Planet surfaces near water sources"], tips: "Needed for the intro mission. A harvestable liquid found at specific planetary locations." },

  // Scrip & military items
  { name: "MG Scrip", category: "scrip", locations: ["MG Facility loot containers", "Bunker missions"], tips: "Found in security facility loot. 50 MG Scrip = 1 Wikelo Favor." },
  { name: "Council Scrip", category: "scrip", locations: ["Council facility loot containers"], tips: "Found in specific facility loot. 50 Council Scrip = 1 Wikelo Favor." },
  { name: "ASD Secure Drive", category: "loot", locations: ["ASD Onyx Facility", "Security bunkers"], tips: "Data drives found at the ASD facility. Required for Snow Camo weapon/armor skins and ATLS contracts." },
  { name: "Ace Interceptor Helmet", category: "loot", locations: ["Enemy NPCs during boarding operations", "Space combat encounters"], tips: "Content item — dropped by enemy pilots. Farm via space combat boarding missions." },
  { name: "Military Badge", category: "loot", locations: ["Military facility loot", "NPC drops"], tips: "Found in military-themed encounters and facilities." },
  { name: "Military Medal", category: "loot", locations: ["Rare military facility loot"], tips: "Rare drop. Required for high-tier ship contracts." },
  { name: "Tevarin Marker", category: "loot", locations: ["Tevarin-related POIs", "Rare facility loot"], tips: "Very rare loot item needed for navy-themed armor contracts." },
  { name: "Vanduul Plating", category: "loot", locations: ["Vanduul wreck sites", "Derelict Vanduul ships"], tips: "Salvaged from Vanduul vessels. Required for stealth ship and Vanduul armor contracts." },
  { name: "Vanduul Metal", category: "loot", locations: ["Vanduul wreck sites", "Derelict Vanduul ships"], tips: "Alien metal salvaged from Vanduul wreckage. Pairs with Vanduul Plating in contracts." },
  { name: "Large Artifact Fragment (Pristine)", category: "loot", locations: ["Ancient ruins", "POI exploration sites"], tips: "Extremely rare artifact. Required for the Wolf stealth ship contract." },
  { name: "DCHS-05 Orbital Positioning Comp-Board", category: "component", locations: ["Station wreckage", "High-security facility loot"], tips: "Rare electronic component needed for Polaris and Idris contracts." },
  { name: "Polaris Bit", category: "commodity", locations: ["Wikelo Emporium (trade 24 SCU Quantanium)"], tips: "Not found in the wild — only obtainable by trading Quantanium at Wikelo Emporiums. Required for capital ship contracts." },
  { name: "RCMBNT-XTL Modules (A–E)", category: "component", locations: ["Site-C Facility"], tips: "Facility-specific loot modules. Five variants (A through E) needed for the Heavy Volt Zapper contract." },
];

export const favorTips = [
  "Wikelo Favors are the primary currency for most premium contracts — earned by converting scrip, ores, or creature drops.",
  "50 MG Scrip, 50 Council Scrip, or 50 Carinite each convert to 1 Wikelo Favor.",
  "12 Irradiated Valakkar Pearls (Grade AAA) also convert to 1 Wikelo Favor — more efficient if you farm creatures.",
  "Polaris Bits are a separate currency earned by trading 24 SCU Quantanium. Needed only for capital ship contracts.",
  "Favors can be spent at any Emporium station, not just where you earned them.",
  "Vehicle contracts start at 2–5 Favors. Mid-tier ships cost 6–10 Favors. Capital ships require 50 Favors + Polaris Bits.",
  "Complete the 'New to System' intro mission first — no other contracts are available until it's done.",
  "Rewards are now deterministic (as of 4.2.1) — you see exactly what you'll get before accepting a contract.",
  "Deposit items via the freight elevator at each Emporium station. Rewards appear in your local inventory after completion.",
  "Check wikelotrades.com for a community tracker that helps manage your inventory and track contract completion.",
];
