// Auto-generated from DataForge extraction + overrides — sc-alpha-4.7.0-4.7.176.58286
// Run: npm run sync:generate

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
    "tier": "New Customer",
    "requirement": "Complete the introduction mission 'New to System' (1x Vestal Water, 3x Tundra Kopion Horn).",
    "benefits": [
      "Access to basic collection contracts",
      "Earn Wikelo Favors through scrip/material conversion",
      "Weapons, armor skins, and basic vehicle contracts",
      "Reputation increases with each completed contract"
    ]
  },
  {
    "tier": "Very Good Customer",
    "requirement": "Accumulate enough reputation through completed contracts.",
    "benefits": [
      "Access to mid-tier contracts with better rewards",
      "Unlocks exclusive armor sets and weapon skins",
      "Mid-tier ship rewards (Intrepid, Scorpius, Prospector)",
      "Multi-material contracts with higher complexity"
    ]
  },
  {
    "tier": "Very Best Customer",
    "requirement": "Reach maximum reputation through extensive contract completion.",
    "benefits": [
      "Access to all contracts including capital ship rewards",
      "Polaris and Idris-P ship contracts",
      "Exclusive cosmetic armor sets",
      "Highest-value contracts in the game"
    ]
  }
];

export const emporiums: Emporium[] = [
  {
    "name": "Dasi Station",
    "planet": "Hurston",
    "system": "Stanton",
    "coordinates": "Orbit around Hurston",
    "description": "The first Wikelo Emporium most players encounter. An asteroid base in Hurston orbit, easily accessible from Lorville.",
    "howToGet": [
      "Depart from Lorville spaceport",
      "Quantum travel to Dasi Station (appears in orbital markers)",
      "Land at the station and head to the Wikelo Emporium storefront",
      "Deposit contract items via the on-site freight elevator"
    ],
    "tiers": [
      "New Customer",
      "Very Good Customer",
      "Very Best Customer"
    ]
  },
  {
    "name": "Selo Station",
    "planet": "Crusader",
    "moon": "Yela",
    "system": "Stanton",
    "coordinates": "Orbit around Yela",
    "description": "An asteroid base near Yela. A good stop for miners already working the asteroid belt or nearby moons.",
    "howToGet": [
      "Quantum travel to Yela from any Crusader location",
      "Look for Selo Station in the orbital markers",
      "Approach and land at the station",
      "The Emporium is near the main trading area"
    ],
    "tiers": [
      "New Customer",
      "Very Good Customer",
      "Very Best Customer"
    ]
  },
  {
    "name": "Kinga Station",
    "planet": "microTech",
    "system": "Stanton",
    "coordinates": "Orbit around microTech",
    "description": "The microTech Emporium. Convenient if you are already operating in the microTech area near New Babbage.",
    "howToGet": [
      "Depart from New Babbage spaceport",
      "Quantum travel to Kinga Station in microTech orbit",
      "Dock at the station",
      "Find the Wikelo Emporium storefront inside"
    ],
    "tiers": [
      "New Customer",
      "Very Good Customer",
      "Very Best Customer"
    ]
  }
];

export const favorConversions: FavorConversion[] = [
  {
    "name": "Trade Worm Parts for Favors",
    "input": [
      {
        "item": "Irradiated Valakkar Pearl (Grade AA)",
        "quantity": 12
      }
    ],
    "output": {
      "item": "Wikelo Favor",
      "quantity": 1
    }
  },
  {
    "name": "Trade MG Scrip for Favors",
    "input": [
      {
        "item": "MG Scrip",
        "quantity": 50
      }
    ],
    "output": {
      "item": "Wikelo Favor",
      "quantity": 1
    }
  },
  {
    "name": "Trade Council Scrip for Favors",
    "input": [
      {
        "item": "Council Scrip",
        "quantity": 50
      }
    ],
    "output": {
      "item": "Wikelo Favor",
      "quantity": 1
    }
  },
  {
    "name": "Turn Things to Favor",
    "input": [
      {
        "item": "Carinite",
        "quantity": 50
      }
    ],
    "output": {
      "item": "Wikelo Favor",
      "quantity": 1
    }
  },
  {
    "name": "Want Polaris? Need something special.",
    "input": [
      {
        "item": "Quantanium",
        "quantity": 24
      }
    ],
    "output": {
      "item": "Polaris Bit",
      "quantity": 1
    }
  }
];

export const contracts: WikeloContract[] = [
  {
    "id": "TheColllector_Vehicle_Ground_ATLS_OrangeNGrey",
    "name": "ATLS Orange & Grey",
    "tier": "New Customer",
    "category": "vehicle",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 1
      },
      {
        "item": "Quantanium",
        "quantity": 36
      },
      {
        "item": "ATLS",
        "quantity": 1
      },
      {
        "item": "Copper",
        "quantity": 8
      },
      {
        "item": "Tungsten",
        "quantity": 8
      },
      {
        "item": "Corundum",
        "quantity": 8
      }
    ],
    "rewards": [
      "ATLS"
    ],
    "active": true
  },
  {
    "id": "TheColllector_Vehicle_Ground_ATLS_RedNBlue",
    "name": "ATLS Red & Blue",
    "tier": "New Customer",
    "category": "vehicle",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 1
      },
      {
        "item": "Carinite (Pure)",
        "quantity": 1
      },
      {
        "item": "ATLS",
        "quantity": 1
      }
    ],
    "rewards": [
      "ATLS"
    ],
    "active": true
  },
  {
    "id": "TheColllector_Vehicle_Ground_ATLS_WhiteNGreen",
    "name": "ATLS White & Green",
    "tier": "New Customer",
    "category": "vehicle",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 1
      },
      {
        "item": "Irradiated Valakkar Pearl (Grade AAA)",
        "quantity": 1
      },
      {
        "item": "ATLS",
        "quantity": 1
      }
    ],
    "rewards": [
      "ATLS"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Battle",
    "name": "Battle Ready",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "Yormandi Eye",
        "quantity": 14
      },
      {
        "item": "Yormandi Tongue",
        "quantity": 7
      },
      {
        "item": "Palatino Helmet",
        "quantity": 1
      },
      {
        "item": "Palatino Arms",
        "quantity": 1
      },
      {
        "item": "Palatino Legs",
        "quantity": 1
      },
      {
        "item": "Palatino Core",
        "quantity": 1
      },
      {
        "item": "Palatino Backpack",
        "quantity": 1
      }
    ],
    "rewards": [
      "Palatino Helmet Mark I",
      "Palatino Arms Mark I",
      "Palatino Legs Mark I",
      "Palatino Core Mark I",
      "Palatino Backpack Mark I"
    ],
    "active": true
  },
  {
    "id": "TheCollector_BigBooma",
    "name": "Big Booma",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "Vanduul Plating",
        "quantity": 2
      },
      {
        "item": "Vanduul Metal",
        "quantity": 2
      },
      {
        "item": "Boomtube Rocket Launcher",
        "quantity": 1
      }
    ],
    "rewards": [
      "Boomtube \"Clanguard\" Rocket Launcher",
      "Boomtube Rocket"
    ],
    "active": true
  },
  {
    "id": "TheCollector_OrbArm",
    "name": "Desert Sand Armor",
    "tier": "New Customer",
    "category": "armor",
    "requirements": [
      {
        "item": "Carinite (Pure)",
        "quantity": 1
      },
      {
        "item": "Antium Core",
        "quantity": 1
      },
      {
        "item": "Antium Helmet",
        "quantity": 1
      },
      {
        "item": "Antium Legs",
        "quantity": 1
      },
      {
        "item": "Antium Arms",
        "quantity": 1
      }
    ],
    "rewards": [
      "Ana Arms Endro",
      "Ana Legs Endro",
      "Ana Core Endro",
      "Ana Helmet Endro"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Small_Drake_Golem",
    "name": "Drake Golem",
    "tier": "New Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 2
      },
      {
        "item": "ASD Secure Drive",
        "quantity": 15
      }
    ],
    "rewards": [
      "DRAK Golem Collector Indust"
    ],
    "active": true
  },
  {
    "id": "TheCollector_NonePistol",
    "name": "Fix up Coda gun",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "Carinite",
        "quantity": 20
      },
      {
        "item": "Bluemoon Fungus",
        "quantity": 20
      },
      {
        "item": "Tripledown Pistol",
        "quantity": 1
      }
    ],
    "rewards": [
      "Tripledown \"Heatwave\" Pistol",
      "Tripledown Pistol Magazine (12 Cap)"
    ],
    "active": true
  },
  {
    "id": "TheCollector_FoodOrder",
    "name": "Food Order",
    "tier": "New Customer",
    "category": "utility",
    "requirements": [
      {
        "item": "Berry Blend Smoothie",
        "quantity": 1
      },
      {
        "item": "Ermer Family Farms Fat Free Ice Cream",
        "quantity": 1
      }
    ],
    "rewards": [
      "Unknown"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Small_Fortune",
    "name": "Fortune",
    "tier": "New Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 3
      },
      {
        "item": "Carinite (Pure)",
        "quantity": 1
      }
    ],
    "rewards": [
      "MISC Fortune Collector Industrial"
    ],
    "active": true
  },
  {
    "id": "TheCollector_OrbVolt_KopSkull",
    "name": "Fun Kopion Skull Gun",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "Carinite",
        "quantity": 10
      },
      {
        "item": "Saldynium (Ore)",
        "quantity": 15
      },
      {
        "item": "Parallax Energy Assault Rifle",
        "quantity": 1
      },
      {
        "item": "Tundra Kopion Horn",
        "quantity": 20
      },
      {
        "item": "Jaclium (Ore)",
        "quantity": 20
      }
    ],
    "rewards": [
      "Parallax \"Fun Kopion Skull\" Energy Assault Rifle",
      "Parallax Rifle Battery (80 Cap)"
    ],
    "active": true,
    "notes": "Unique weapon skin. Requires significant ore farming."
  },
  {
    "id": "TheCollector_OrbVolt_MiltSkull",
    "name": "Fun Military Skull Gun",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "Carinite",
        "quantity": 10
      },
      {
        "item": "Saldynium (Ore)",
        "quantity": 15
      },
      {
        "item": "Parallax Energy Assault Rifle",
        "quantity": 1
      },
      {
        "item": "Irradiated Valakkar Juvenile Fang",
        "quantity": 20
      },
      {
        "item": "Jaclium (Ore)",
        "quantity": 20
      }
    ],
    "rewards": [
      "Parallax \"Fun Military Skull\" Energy Assault Rifle",
      "Parallax Rifle Battery (80 Cap)"
    ],
    "active": true
  },
  {
    "id": "TheCollector_GeminiShotgun",
    "name": "GeminiShotgun",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 3
      },
      {
        "item": "Sadaryx",
        "quantity": 10
      },
      {
        "item": "R97 Shotgun",
        "quantity": 1
      }
    ],
    "rewards": [
      "R97 \"Crimson Camo\" Shotgun",
      "R97 Shotgun Magazine (18 cap)"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Nov_HeavyUtil",
    "name": "Heavy Utility",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "Corbel Core Mire",
        "quantity": 1
      },
      {
        "item": "Corbel Arms Mire",
        "quantity": 1
      },
      {
        "item": "Corbel Legs Mire",
        "quantity": 1
      },
      {
        "item": "Novikov Backpack Mire",
        "quantity": 1
      },
      {
        "item": "ASD Secure Drive",
        "quantity": 10
      },
      {
        "item": "RCMBNT-RGL-1",
        "quantity": 3
      },
      {
        "item": "RCMBNT-RGL-2",
        "quantity": 3
      },
      {
        "item": "RCMBNT-RGL-3",
        "quantity": 3
      },
      {
        "item": "Corbel Helmet Mire",
        "quantity": 1
      }
    ],
    "rewards": [
      "Corbel Helmet Crush",
      "Corbel Core Crush",
      "Corbel Arms Crush",
      "Corbel Legs Crush",
      "Novikov Backpack Crush"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Small_Intrepid",
    "name": "Intrepid",
    "tier": "New Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 3
      },
      {
        "item": "Government Cartography Agency Medal (Pristine)",
        "quantity": 1
      }
    ],
    "rewards": [
      "CRUS Intrepid Collector Indust"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Ground_ATLS_IKTI",
    "name": "Make ATLS shoot",
    "tier": "New Customer",
    "category": "vehicle",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 2
      },
      {
        "item": "Irradiated Valakkar Apex Fang",
        "quantity": 5
      },
      {
        "item": "ATLS",
        "quantity": 1
      },
      {
        "item": "MXOX Neutron Cannon S1",
        "quantity": 2
      }
    ],
    "rewards": [
      "ATLS IKTI"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Ground_ATLS_IKTI_GEO",
    "name": "Make jumpy ATLS shoot",
    "tier": "New Customer",
    "category": "vehicle",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 1
      },
      {
        "item": "ATLS",
        "quantity": 1
      },
      {
        "item": "MXOX Neutron Cannon S1",
        "quantity": 2
      },
      {
        "item": "ATLS IKTI",
        "quantity": 1
      }
    ],
    "rewards": [
      "ATLS IKTI"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Nov_Molten",
    "name": "Molten",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "Carinite",
        "quantity": 30
      },
      {
        "item": "RCMBNT-PWL-1",
        "quantity": 4
      },
      {
        "item": "RCMBNT-PWL-2",
        "quantity": 4
      },
      {
        "item": "RCMBNT-PWL-3",
        "quantity": 4
      },
      {
        "item": "Strata Arms",
        "quantity": 1
      },
      {
        "item": "Strata Legs",
        "quantity": 1
      },
      {
        "item": "Strata Helmet",
        "quantity": 1
      },
      {
        "item": "Strata Backpack",
        "quantity": 1
      },
      {
        "item": "Strata Core",
        "quantity": 1
      }
    ],
    "rewards": [
      "Strata Core Heatwave",
      "Strata Arms Heatwave",
      "Strata Legs Heatwave",
      "Strata Helmet Heatwave",
      "Strata Backpack Heatwave"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Intro",
    "name": "New to System",
    "tier": "New Customer",
    "category": "utility",
    "requirements": [
      {
        "item": "Vestal Water",
        "quantity": 1
      },
      {
        "item": "Tundra Kopion Horn",
        "quantity": 3
      }
    ],
    "rewards": [
      "Unknown"
    ],
    "active": true,
    "notes": "Mandatory introduction mission. Must be completed before any other contracts are available."
  },
  {
    "id": "TheCollector_Vehicle_Ground_Nox",
    "name": "Nox",
    "tier": "New Customer",
    "category": "vehicle",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 4
      }
    ],
    "rewards": [
      "XIAN Nox Collector Mod"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Ground_Pulse",
    "name": "Pulse",
    "tier": "New Customer",
    "category": "vehicle",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 4
      }
    ],
    "rewards": [
      "MRAI Pulse Collector Civ"
    ],
    "active": true
  },
  {
    "id": "TheCollector_RedHunterArmour",
    "name": "RedHunterArmour",
    "tier": "New Customer",
    "category": "armor",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 3
      },
      {
        "item": "Sadaryx",
        "quantity": 10
      },
      {
        "item": "Monde Helmet",
        "quantity": 1
      },
      {
        "item": "Monde Core",
        "quantity": 1
      },
      {
        "item": "Monde Arms",
        "quantity": 1
      },
      {
        "item": "Monde Legs",
        "quantity": 1
      },
      {
        "item": "Virgil Heavy Backpack",
        "quantity": 1
      }
    ],
    "rewards": [
      "Monde Helmet Crimson Camo",
      "Monde Core Crimson Camo",
      "Monde Arms Crimson Camo",
      "Monde Legs Crimson Camo",
      "Warden Backpack Crimson Camo"
    ],
    "active": true
  },
  {
    "id": "TheCollector_AD_Hush",
    "name": "Snow Snipe",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "ASD Secure Drive",
        "quantity": 4
      },
      {
        "item": "Geist Armor Arms ASD Edition",
        "quantity": 1
      },
      {
        "item": "Geist Armor Core ASD Edition",
        "quantity": 1
      },
      {
        "item": "Geist Armor Helmet ASD Edition",
        "quantity": 1
      },
      {
        "item": "Geist Armor Legs ASD Edition",
        "quantity": 1
      },
      {
        "item": "Geist Backpack ASD Edition",
        "quantity": 1
      }
    ],
    "rewards": [
      "Geist Armor Arms Snow Camo",
      "Geist Armor Core Snow Camo",
      "Geist Armor Helmet Snow Camo",
      "Geist Armor Legs Snow Camo",
      "Geist Backpack Snow Camo"
    ],
    "active": true
  },
  {
    "id": "TheCollector_SpikeyArmor",
    "name": "Test Armor",
    "tier": "New Customer",
    "category": "armor",
    "requirements": [
      {
        "item": "Vanduul Plating",
        "quantity": 15
      },
      {
        "item": "Vanduul Metal",
        "quantity": 15
      },
      {
        "item": "Testudo Legs Turfwar",
        "quantity": 1
      },
      {
        "item": "Testudo Helmet Turfwar",
        "quantity": 1
      },
      {
        "item": "Testudo Core Turfwar",
        "quantity": 1
      },
      {
        "item": "Testudo Arms Turfwar",
        "quantity": 1
      },
      {
        "item": "Testudo Backpack Turfwar",
        "quantity": 1
      }
    ],
    "rewards": [
      "Testudo Helmet Clanguard",
      "Testudo Arms Clanguard",
      "Testudo Core Clanguard",
      "Qrt Combat Medium Legs 02 01 01",
      "Testudo Backpack Clanguard"
    ],
    "active": true,
    "notes": "Requires significant Yormandi creature farming."
  },
  {
    "id": "TheCollector_Favours_CouncilScrip",
    "name": "Trade Council Scrip for Favors",
    "tier": "New Customer",
    "category": "currency",
    "requirements": [
      {
        "item": "Council Scrip",
        "quantity": 50
      }
    ],
    "rewards": [
      "Wikelo Favor"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Favours_MercScrip",
    "name": "Trade MG Scrip for Favors",
    "tier": "New Customer",
    "category": "currency",
    "requirements": [
      {
        "item": "MG Scrip",
        "quantity": 50
      }
    ],
    "rewards": [
      "Wikelo Favor"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Favours_IrradiatedPearls",
    "name": "Trade Worm Parts for Favors",
    "tier": "New Customer",
    "category": "currency",
    "requirements": [
      {
        "item": "Irradiated Valakkar Pearl (Grade AA)",
        "quantity": 12
      }
    ],
    "rewards": [
      "Wikelo Favor"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Favours_Caranite",
    "name": "Turn Things to Favor",
    "tier": "New Customer",
    "category": "currency",
    "requirements": [
      {
        "item": "Carinite",
        "quantity": 50
      }
    ],
    "rewards": [
      "Wikelo Favor"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Ground_Ursa_Medical",
    "name": "Ursa Medical",
    "tier": "New Customer",
    "category": "vehicle",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 4
      },
      {
        "item": "Saldynium (Ore)",
        "quantity": 20
      },
      {
        "item": "Jaclium (Ore)",
        "quantity": 20
      }
    ],
    "rewards": [
      "RSI Ursa Medivac Stealth"
    ],
    "active": true
  },
  {
    "id": "TheCollector_SlimyLMG",
    "name": "Yormandi Gun",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "Yormandi Eye",
        "quantity": 6
      },
      {
        "item": "Yormandi Tongue",
        "quantity": 3
      },
      {
        "item": "Fresnel Energy LMG",
        "quantity": 1
      }
    ],
    "rewards": [
      "Fresnel \"Yormandi\" Energy LMG"
    ],
    "active": true,
    "notes": "Unique LMG skin using Yormandi creature drops."
  },
  {
    "id": "TheCollector_AD_ZapZip",
    "name": "Zappy gun more woodlike",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "ASD Secure Drive",
        "quantity": 7
      },
      {
        "item": "Zenith Sniper Rifle",
        "quantity": 1
      }
    ],
    "rewards": [
      "Zenith \"Snow Camo\" Laser Sniper Rifle",
      "Zenith Laser Sniper Rifle Battery (22 Cap)"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Medium_Starfighter_Inferno",
    "name": "Ares Inferno",
    "tier": "Very Good Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 10
      },
      {
        "item": "Yormandi Tongue",
        "quantity": 5
      },
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 5
      },
      {
        "item": "UEE 6th Platoon Medal (Pristine)",
        "quantity": 1
      }
    ],
    "rewards": [
      "CRUS Starfighter Inferno Collector Military"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Medium_Starfighter_Ion",
    "name": "Ares Ion",
    "tier": "Very Good Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 10
      },
      {
        "item": "Yormandi Eye",
        "quantity": 10
      },
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 5
      },
      {
        "item": "Tevarin War Service Marker (Pristine)",
        "quantity": 1
      }
    ],
    "rewards": [
      "CRUS Starfighter Ion Collector Stealth"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Small_ARGO_Raft",
    "name": "ARGO Raft",
    "tier": "Very Good Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 8
      },
      {
        "item": "Irradiated Valakkar Adult Fang",
        "quantity": 10
      },
      {
        "item": "Irradiated Valakkar Juvenile Fang",
        "quantity": 20
      },
      {
        "item": "Irradiated Kopion Horn",
        "quantity": 5
      },
      {
        "item": "Irradiated Valakkar Pearl (Grade AAA)",
        "quantity": 1
      }
    ],
    "rewards": [
      "ARGO RAFT Collector Indust"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Large_Connie_Tau",
    "name": "Constellation Tau",
    "tier": "Very Good Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 30
      },
      {
        "item": "Carinite (Pure)",
        "quantity": 3
      },
      {
        "item": "Irradiated Valakkar Pearl (Grade AAA)",
        "quantity": 3
      },
      {
        "item": "Government Cartography Agency Medal (Pristine)",
        "quantity": 3
      }
    ],
    "rewards": [
      "RSI Constellation Taurus Military"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Medium_F7_MK2",
    "name": "F7C-M Hornet Mk II",
    "tier": "Very Good Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 16
      },
      {
        "item": "DCHS-05 Orbital Positioning Comp-Board",
        "quantity": 3
      },
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 5
      },
      {
        "item": "Government Cartography Agency Medal (Pristine)",
        "quantity": 1
      }
    ],
    "rewards": [
      "ANVL Hornet F7 Mk2 Collector Mod"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Medium_Firebird",
    "name": "Firebird",
    "tier": "Very Good Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 15
      },
      {
        "item": "DCHS-05 Orbital Positioning Comp-Board",
        "quantity": 4
      },
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 3
      },
      {
        "item": "Government Cartography Agency Medal (Pristine)",
        "quantity": 1
      }
    ],
    "rewards": [
      "AEGS Sabre Firebird Collector Milt"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Medium_Guardian",
    "name": "Guardian",
    "tier": "Very Good Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Irradiated Valakkar Pearl (Grade AA)",
        "quantity": 15
      },
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 10
      },
      {
        "item": "Tevarin War Service Marker (Pristine)",
        "quantity": 1
      },
      {
        "item": "Wikelo Favor",
        "quantity": 20
      }
    ],
    "rewards": [
      "MRAI Guardian Military"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Medium_GuardianMX",
    "name": "Guardian MX",
    "tier": "Very Good Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 25
      },
      {
        "item": "Vanduul Plating",
        "quantity": 30
      },
      {
        "item": "Vanduul Metal",
        "quantity": 30
      },
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 15
      },
      {
        "item": "Large Artifact Fragment (Pristine)",
        "quantity": 2
      }
    ],
    "rewards": [
      "MRAI Guardian MX Collector Military"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Medium_GuardianQI",
    "name": "Guardian QI",
    "tier": "Very Good Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 25
      },
      {
        "item": "Irradiated Valakkar Pearl (Grade AA)",
        "quantity": 15
      },
      {
        "item": "DCHS-05 Orbital Positioning Comp-Board",
        "quantity": 15
      },
      {
        "item": "UEE 6th Platoon Medal (Pristine)",
        "quantity": 2
      }
    ],
    "rewards": [
      "MRAI Guardian QI Collector Indust"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Small_Kruger_Wolf",
    "name": "Kruger Wolf",
    "tier": "Very Good Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 10
      },
      {
        "item": "Vanduul Plating",
        "quantity": 10
      },
      {
        "item": "Vanduul Metal",
        "quantity": 10
      },
      {
        "item": "Large Artifact Fragment (Pristine)",
        "quantity": 1
      }
    ],
    "rewards": [
      "KRIG L21 Wolf Collector Stealth"
    ],
    "active": true
  },
  {
    "id": "TheCollector_AO_IrrArm",
    "name": "Make glowy armor",
    "tier": "Very Good Customer",
    "category": "armor",
    "requirements": [
      {
        "item": "Antium Core",
        "quantity": 1
      },
      {
        "item": "Antium Helmet",
        "quantity": 1
      },
      {
        "item": "Antium Arms",
        "quantity": 1
      },
      {
        "item": "Antium Legs",
        "quantity": 1
      },
      {
        "item": "Irradiated Valakkar Pearl (Grade AAA)",
        "quantity": 1
      }
    ],
    "rewards": [
      "Bokto Core",
      "Bokto Arms",
      "Bokto Legs",
      "Bokto Helmet"
    ],
    "active": true,
    "notes": "Exclusive glowing armor set. Requires rare Valakkar creature drops."
  },
  {
    "id": "TheCollector_Vehicle_Small_MISC_Prospector",
    "name": "Need mining things. Clever things to trade.",
    "tier": "Very Good Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 6
      },
      {
        "item": "Carinite",
        "quantity": 20
      },
      {
        "item": "Saldynium (Ore)",
        "quantity": 30
      },
      {
        "item": "Jaclium (Ore)",
        "quantity": 40
      },
      {
        "item": "Carinite (Pure)",
        "quantity": 1
      }
    ],
    "rewards": [
      "MISC Prospector"
    ],
    "active": true,
    "notes": "Reward ship comes pre-equipped with Grade A industrial components."
  },
  {
    "id": "TheCollector_Vehicle_Medium_Peregrine",
    "name": "Peregrine",
    "tier": "Very Good Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 4
      },
      {
        "item": "DCHS-05 Orbital Positioning Comp-Board",
        "quantity": 1
      }
    ],
    "rewards": [
      "AEGS Sabre Peregrine Collector Competition"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Small_RSI_Meteor",
    "name": "RSI Meteor",
    "tier": "Very Good Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 10
      },
      {
        "item": "Vanduul Plating",
        "quantity": 10
      },
      {
        "item": "Vanduul Metal",
        "quantity": 10
      },
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 5
      },
      {
        "item": "Large Artifact Fragment (Pristine)",
        "quantity": 1
      }
    ],
    "rewards": [
      "RSI Meteor Collector Stealth"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Medium_Scorpius",
    "name": "Scorpius",
    "tier": "Very Good Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 15
      },
      {
        "item": "DCHS-05 Orbital Positioning Comp-Board",
        "quantity": 4
      },
      {
        "item": "Tevarin War Service Marker (Pristine)",
        "quantity": 1
      }
    ],
    "rewards": [
      "RSI Scorpius Stealth"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Medium_Spirit_C1",
    "name": "Spirit C1",
    "tier": "Very Good Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 8
      },
      {
        "item": "Tevarin War Service Marker (Pristine)",
        "quantity": 1
      }
    ],
    "rewards": [
      "CRUS Spirit C1 Civilian"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Large_Starlancer_max",
    "name": "Starlancer MAX",
    "tier": "Very Good Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 30
      },
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 10
      },
      {
        "item": "Carinite (Pure)",
        "quantity": 3
      },
      {
        "item": "Irradiated Valakkar Pearl (Grade AAA)",
        "quantity": 3
      }
    ],
    "rewards": [
      "MISC Starlancer Max Collector Indust"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Medium_Terrapin_Medic",
    "name": "Terrapin Medic",
    "tier": "Very Good Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 15
      },
      {
        "item": "ASD Secure Drive",
        "quantity": 10
      },
      {
        "item": "Tevarin War Service Marker (Pristine)",
        "quantity": 1
      }
    ],
    "rewards": [
      "ANVL Terrapin Medic Collector Medic"
    ],
    "active": true
  },
  {
    "id": "TheCollector_AO_VoltThwack",
    "name": "Volt Thwack",
    "tier": "Very Good Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "Irradiated Valakkar Adult Fang",
        "quantity": 10
      },
      {
        "item": "Irradiated Valakkar Juvenile Fang",
        "quantity": 5
      },
      {
        "item": "VOLT Scatter Shotgun",
        "quantity": 1
      }
    ],
    "rewards": [
      "Prism \"Irradiated\" Laser Shotgun",
      "Prism Laser Shotgun Battery (20 cap)"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Small_Kruger_Wolf_Unique",
    "name": "Want big ship? But not too big?",
    "tier": "Very Good Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 5
      }
    ],
    "rewards": [
      "KRIG L21 Wolf Collector Military",
      "Antium Helmet Midnight Sun",
      "Antium Core Midnight Sun",
      "Antium Arms Midnight Sun",
      "Antium Legs Midnight Sun",
      "Fresnel \"Deepwater\" Energy LMG"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Medium_ZeusCL",
    "name": "Zeus CL",
    "tier": "Very Good Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 20
      },
      {
        "item": "Carinite",
        "quantity": 15
      },
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 10
      },
      {
        "item": "Carinite (Pure)",
        "quantity": 2
      }
    ],
    "rewards": [
      "RSI Zeus CL Collector Indust"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Super_Idris",
    "name": "AEGIS Idris P",
    "tier": "Very Best Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 50
      },
      {
        "item": "Polaris Bit",
        "quantity": 50
      },
      {
        "item": "DCHS-05 Orbital Positioning Comp-Board",
        "quantity": 50
      },
      {
        "item": "Carinite",
        "quantity": 50
      },
      {
        "item": "Irradiated Valakkar Apex Fang",
        "quantity": 50
      },
      {
        "item": "MG Scrip",
        "quantity": 50
      },
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 50
      },
      {
        "item": "Irradiated Valakkar Pearl (Grade AAA)",
        "quantity": 30
      },
      {
        "item": "UEE 6th Platoon Medal (Pristine)",
        "quantity": 30
      },
      {
        "item": "Carinite (Pure)",
        "quantity": 30
      },
      {
        "item": "ASD Secure Drive",
        "quantity": 30
      },
      {
        "item": "RCMBNT-PWL-1",
        "quantity": 5
      },
      {
        "item": "RCMBNT-PWL-2",
        "quantity": 5
      },
      {
        "item": "RCMBNT-PWL-3",
        "quantity": 5
      },
      {
        "item": "RCMBNT-RGL-1",
        "quantity": 5
      },
      {
        "item": "RCMBNT-RGL-2",
        "quantity": 5
      },
      {
        "item": "RCMBNT-RGL-3",
        "quantity": 5
      },
      {
        "item": "RCMBNT-XTL-1",
        "quantity": 5
      },
      {
        "item": "RCMBNT-XTL-2",
        "quantity": 5
      },
      {
        "item": "RCMBNT-XTL-3",
        "quantity": 5
      }
    ],
    "rewards": [
      "AEGS Idris P Collector Military"
    ],
    "active": true,
    "notes": "The ultimate Wikelo contract. Requires extensive material farming and Polaris Bit accumulation."
  },
  {
    "id": "TheCollector_Vehicle_Large_Anvil_Asgard",
    "name": "Anvil Asgard",
    "tier": "Very Best Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 50
      },
      {
        "item": "RCMBNT-PWL-1",
        "quantity": 5
      },
      {
        "item": "RCMBNT-PWL-2",
        "quantity": 5
      },
      {
        "item": "RCMBNT-PWL-3",
        "quantity": 5
      },
      {
        "item": "RCMBNT-RGL-1",
        "quantity": 5
      },
      {
        "item": "RCMBNT-RGL-2",
        "quantity": 5
      },
      {
        "item": "RCMBNT-RGL-3",
        "quantity": 5
      },
      {
        "item": "RCMBNT-XTL-1",
        "quantity": 5
      },
      {
        "item": "RCMBNT-XTL-2",
        "quantity": 5
      },
      {
        "item": "RCMBNT-XTL-3",
        "quantity": 5
      },
      {
        "item": "ASD Secure Drive",
        "quantity": 3
      }
    ],
    "rewards": [
      "ANVL Asgard Collector Military"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Large_F8C_Milt",
    "name": "F8C Lightning Military",
    "tier": "Very Best Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 40
      },
      {
        "item": "Carinite (Pure)",
        "quantity": 4
      },
      {
        "item": "Irradiated Valakkar Pearl (Grade AAA)",
        "quantity": 4
      },
      {
        "item": "Tevarin War Service Marker (Pristine)",
        "quantity": 4
      }
    ],
    "rewards": [
      "ANVL Lightning F8C Collector Military"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Large_F8C_Stealth",
    "name": "F8C Lightning Stealth",
    "tier": "Very Best Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 40
      },
      {
        "item": "DCHS-05 Orbital Positioning Comp-Board",
        "quantity": 15
      },
      {
        "item": "Carinite (Pure)",
        "quantity": 3
      },
      {
        "item": "Irradiated Valakkar Pearl (Grade AAA)",
        "quantity": 3
      }
    ],
    "rewards": [
      "ANVL Lightning F8C Collector Stealth"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Polaris",
    "name": "Now make Polaris. Short Time Deal.",
    "tier": "Very Best Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 50
      },
      {
        "item": "Polaris Bit",
        "quantity": 15
      },
      {
        "item": "DCHS-05 Orbital Positioning Comp-Board",
        "quantity": 10
      },
      {
        "item": "Carinite",
        "quantity": 20
      },
      {
        "item": "Irradiated Valakkar Apex Fang",
        "quantity": 20
      },
      {
        "item": "MG Scrip",
        "quantity": 20
      },
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 15
      },
      {
        "item": "Irradiated Valakkar Pearl (Grade AAA)",
        "quantity": 15
      },
      {
        "item": "UEE 6th Platoon Medal (Pristine)",
        "quantity": 15
      },
      {
        "item": "Carinite (Pure)",
        "quantity": 15
      },
      {
        "item": "ASD Secure Drive",
        "quantity": 15
      },
      {
        "item": "RCMBNT-PWL-1",
        "quantity": 1
      },
      {
        "item": "RCMBNT-PWL-2",
        "quantity": 1
      },
      {
        "item": "RCMBNT-PWL-3",
        "quantity": 1
      },
      {
        "item": "RCMBNT-RGL-1",
        "quantity": 1
      },
      {
        "item": "RCMBNT-RGL-2",
        "quantity": 1
      },
      {
        "item": "RCMBNT-RGL-3",
        "quantity": 1
      },
      {
        "item": "RCMBNT-XTL-1",
        "quantity": 1
      },
      {
        "item": "RCMBNT-XTL-2",
        "quantity": 1
      },
      {
        "item": "RCMBNT-XTL-3",
        "quantity": 1
      }
    ],
    "rewards": [
      "RSI Polaris"
    ],
    "active": true,
    "notes": "End-game contract. Polaris Bits earned by trading 24 SCU Quantanium each. Pre-equipped with military-grade components."
  },
  {
    "id": "TheCollector_Vehicle_Large_Prowler_Utility",
    "name": "Prowler Utility",
    "tier": "Very Best Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 40
      },
      {
        "item": "Yormandi Tongue",
        "quantity": 10
      },
      {
        "item": "Yormandi Eye",
        "quantity": 20
      },
      {
        "item": "Irradiated Valakkar Pearl (Grade AAA)",
        "quantity": 3
      },
      {
        "item": "Carinite (Pure)",
        "quantity": 3
      }
    ],
    "rewards": [
      "ESPR Prowler Utility Collector Indust"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Large_Starlancer_TAC",
    "name": "Starlancer TAC",
    "tier": "Very Best Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 50
      },
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 15
      },
      {
        "item": "ASD Secure Drive",
        "quantity": 30
      },
      {
        "item": "Irradiated Valakkar Pearl (Grade AAA)",
        "quantity": 3
      },
      {
        "item": "Tevarin War Service Marker (Pristine)",
        "quantity": 3
      },
      {
        "item": "DCHS-05 Orbital Positioning Comp-Board",
        "quantity": 3
      },
      {
        "item": "Carinite (Pure)",
        "quantity": 3
      }
    ],
    "rewards": [
      "MISC Starlancer TAC Collector Military"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Apollo_Triage",
    "name": "Vehicle Apollo Triage",
    "tier": "Very Best Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 30
      },
      {
        "item": "Savrilium",
        "quantity": 48
      }
    ],
    "rewards": [
      "RSI Apollo Triage Collector Stealth"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Large_Crusader_A2 ",
    "name": "Vehicle Large Crusader A2",
    "tier": "Very Best Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 50
      },
      {
        "item": "Polaris Bit",
        "quantity": 20
      },
      {
        "item": "MG Scrip",
        "quantity": 20
      },
      {
        "item": "ASD Secure Drive",
        "quantity": 6
      },
      {
        "item": "Irradiated Valakkar Pearl (Grade AAA)",
        "quantity": 6
      },
      {
        "item": "Tevarin War Service Marker (Pristine)",
        "quantity": 6
      },
      {
        "item": "DCHS-05 Orbital Positioning Comp-Board",
        "quantity": 6
      },
      {
        "item": "Carinite (Pure)",
        "quantity": 6
      }
    ],
    "rewards": [
      "CRUS Starlifter A2 Collector Military"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Vehicle_Medium_ZeusES",
    "name": "Very very nice ship for trade",
    "tier": "Very Best Customer",
    "category": "ship",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 10
      },
      {
        "item": "UEE 6th Platoon Medal (Pristine)",
        "quantity": 1
      }
    ],
    "rewards": [
      "RSI Zeus ES Collector Indust"
    ],
    "active": true
  },
  {
    "id": "TheCollector_Favours_PolarisParts",
    "name": "Want Polaris? Need something special.",
    "tier": "Very Best Customer",
    "category": "currency",
    "requirements": [
      {
        "item": "Quantanium",
        "quantity": 24
      }
    ],
    "rewards": [
      "Polaris Bit"
    ],
    "active": true
  },
  {
    "id": "TheCollector_GG_Coda(DO_NOT_USE_STORE_EXCLUSIVE)",
    "name": "Coda Upgrade",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 5
      },
      {
        "item": "Tevarin War Service Marker (Pristine)",
        "quantity": 1
      },
      {
        "item": "MG Scrip",
        "quantity": 30
      },
      {
        "item": "Coda Pistol",
        "quantity": 1
      }
    ],
    "rewards": [
      "Coda \"Ascension\" Pistol",
      "Coda Pistol Magazine (6 cap)"
    ],
    "active": false
  },
  {
    "id": "CollectorBlueprintFlowTest",
    "name": "CollectorBlueprintFlowTest",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "Basketball",
        "quantity": 1
      }
    ],
    "rewards": [
      "R97 \"Crimson Camo\" Shotgun",
      "R97 Shotgun Magazine (18 cap)"
    ],
    "active": false
  },
  {
    "id": "TheCollector_SB_DesertArm(DO_NOT_USE_NOW_LOOT)",
    "name": "Desert Armor",
    "tier": "New Customer",
    "category": "armor",
    "requirements": [
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 5
      },
      {
        "item": "Advocacy Badge",
        "quantity": 20
      },
      {
        "item": "CDS Heavy Armor",
        "quantity": 1
      },
      {
        "item": "CDS Heavy Armor",
        "quantity": 1
      },
      {
        "item": "CDS Heavy Armor",
        "quantity": 1
      },
      {
        "item": "CDS Heavy Armor",
        "quantity": 1
      },
      {
        "item": "Wikelo Favor",
        "quantity": 3
      }
    ],
    "rewards": [
      "Cds Combat Heavy Helmet 03 01 01",
      "Cds Combat Heavy Core 03 01 01",
      "Cds Combat Heavy Arms 03 01 01",
      "Cds Combat Heavy Legs 03 01 01"
    ],
    "active": false
  },
  {
    "id": "TheCollector_GG_ExplorationSuit(DO_NOT_USE_STORE_EXCLUSIVE)",
    "name": "Exploration Suit",
    "tier": "New Customer",
    "category": "armor",
    "requirements": [
      {
        "item": "Environmental Heavy Armor",
        "quantity": 1
      },
      {
        "item": "MG Scrip",
        "quantity": 30
      },
      {
        "item": "Irradiated Valakkar Adult Fang",
        "quantity": 10
      },
      {
        "item": "Irradiated Valakkar Juvenile Fang",
        "quantity": 20
      },
      {
        "item": "Irradiated Valakkar Pearl (Grade AAA)",
        "quantity": 1
      },
      {
        "item": "Environmental Heavy Armor",
        "quantity": 1
      }
    ],
    "rewards": [
      "Novikov \"Ascension\" Exploration Suit",
      "Novikov \"Ascension\" Helmet",
      "Novikov \"Ascension\" Backpack"
    ],
    "active": false
  },
  {
    "id": "TheCollector_F55(DO_NOT_USE_NOW_LOOT)",
    "name": "F55 Look Better",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "F55 LMG",
        "quantity": 1
      },
      {
        "item": "Yormandi Eye",
        "quantity": 4
      },
      {
        "item": "Yormandi Tongue",
        "quantity": 2
      },
      {
        "item": "Carinite",
        "quantity": 20
      }
    ],
    "rewards": [
      "F55 \"Mark I\" LMG"
    ],
    "active": false
  },
  {
    "id": "TheCollector_OrbVolt_KopTooth(DO_NOT_USE_NOW_LOOT)",
    "name": "Fun Kopion Tooth Gun",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "Carinite",
        "quantity": 20
      },
      {
        "item": "Saldynium (Ore)",
        "quantity": 30
      },
      {
        "item": "Parallax Energy Assault Rifle",
        "quantity": 1
      },
      {
        "item": "Tundra Kopion Horn",
        "quantity": 35
      },
      {
        "item": "Jaclium (Ore)",
        "quantity": 40
      }
    ],
    "rewards": [
      "Parallax \"Fun Kopion Tooth\" Energy Assault Rifle",
      "Parallax Rifle Battery (80 Cap)"
    ],
    "active": false
  },
  {
    "id": "TheCollector_OrbVolt_MiltTooth(DO_NOT_USE_NOW_LOOT)",
    "name": "Fun Military Tooth Gun",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "Carinite",
        "quantity": 20
      },
      {
        "item": "Saldynium (Ore)",
        "quantity": 30
      },
      {
        "item": "Parallax Energy Assault Rifle",
        "quantity": 1
      },
      {
        "item": "Valakkar Juvenile Fang",
        "quantity": 35
      },
      {
        "item": "Jaclium (Ore)",
        "quantity": 40
      }
    ],
    "rewards": [
      "Parallax \"Fun Military Tooth\" Energy Assault Rifle",
      "Parallax Rifle Battery (80 Cap)"
    ],
    "active": false
  },
  {
    "id": "TheCollector_Nov_LotsOfZipZap(DO_NOT_USE_NOW_LOOT)",
    "name": "Heavy Volt Zapper",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "ASD Secure Drive",
        "quantity": 5
      },
      {
        "item": "RCMBNT-XTL-1",
        "quantity": 5
      },
      {
        "item": "RCMBNT-XTL-2",
        "quantity": 5
      },
      {
        "item": "RCMBNT-XTL-3",
        "quantity": 5
      },
      {
        "item": "Fresnel Energy LMG",
        "quantity": 1
      }
    ],
    "rewards": [
      "Fresnel \"Deepwater\" Energy LMG",
      "Fresnel Energy LMG Battery (165 Cap)"
    ],
    "active": false,
    "notes": "Currently inactive. Requires facility-specific loot."
  },
  {
    "id": "TheCollector_SB_JungleArm(DO_NOT_USE_NOW_LOOT)",
    "name": "Jungle Armor",
    "tier": "New Customer",
    "category": "armor",
    "requirements": [
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 5
      },
      {
        "item": "Valakkar Juvenile Fang",
        "quantity": 50
      },
      {
        "item": "CDS Heavy Armor",
        "quantity": 1
      },
      {
        "item": "CDS Heavy Armor",
        "quantity": 1
      },
      {
        "item": "CDS Heavy Armor",
        "quantity": 1
      },
      {
        "item": "CDS Heavy Armor",
        "quantity": 1
      },
      {
        "item": "Wikelo Favor",
        "quantity": 3
      }
    ],
    "rewards": [
      "Cds Combat Heavy Helmet 03 03 01",
      "Cds Combat Heavy Core 03 03 01",
      "Cds Combat Heavy Arms 03 03 01",
      "Cds Combat Heavy Legs 03 03 01"
    ],
    "active": false
  },
  {
    "id": "TheCollector_SB_NavyArm(DO_NOT_USE_NOW_LOOT)",
    "name": "Navy Armor",
    "tier": "New Customer",
    "category": "armor",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 3
      },
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 5
      },
      {
        "item": "Grassland Quasigrazer Egg",
        "quantity": 50
      },
      {
        "item": "CDS Heavy Armor",
        "quantity": 1
      },
      {
        "item": "CDS Heavy Armor",
        "quantity": 1
      },
      {
        "item": "CDS Heavy Armor",
        "quantity": 1
      },
      {
        "item": "CDS Heavy Armor",
        "quantity": 1
      }
    ],
    "rewards": [
      "Cds Combat Heavy Helmet 03 02 01",
      "Cds Combat Heavy Core 03 02 01",
      "Cds Combat Heavy Arms 03 02 01",
      "Cds Combat Heavy Legs 03 02 01"
    ],
    "active": false
  },
  {
    "id": "TheCollector_GG_Karna(DO_NOT_USE_STORE_EXCLUSIVE)",
    "name": "Prettify Karna Gun",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "Irradiated Valakkar Juvenile Fang",
        "quantity": 10
      },
      {
        "item": "Irradiated Kopion Horn",
        "quantity": 10
      },
      {
        "item": "Irradiated Valakkar Adult Fang",
        "quantity": 10
      },
      {
        "item": "Irradiated Valakkar Pearl (Grade AAA)",
        "quantity": 1
      },
      {
        "item": "Karna Plasma Rifle",
        "quantity": 1
      }
    ],
    "rewards": [
      "Karna \"Ascension\" Rifle",
      "Karna Rifle Battery (35 cap)"
    ],
    "active": false
  },
  {
    "id": "TheCollector_GG_S71(DO_NOT_USE_STORE_EXCLUSIVE)",
    "name": "S71 Upgrade",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "Carinite",
        "quantity": 10
      },
      {
        "item": "Saldynium (Ore)",
        "quantity": 10
      },
      {
        "item": "Jaclium (Ore)",
        "quantity": 10
      },
      {
        "item": "Carinite (Pure)",
        "quantity": 1
      },
      {
        "item": "Parallax Ballistic Rifle",
        "quantity": 1
      }
    ],
    "rewards": [
      "S71 \"Ascension\" Rifle",
      "S71 Rifle Magazine (30 cap)"
    ],
    "active": false
  },
  {
    "id": "TheCollector_GG_VentureSuit(DO_NOT_USE_STORE_EXCLUSIVE)",
    "name": "Venture Suit",
    "tier": "New Customer",
    "category": "armor",
    "requirements": [
      {
        "item": "Venture Core Base",
        "quantity": 1
      },
      {
        "item": "Venture Helmet Base",
        "quantity": 1
      },
      {
        "item": "Venture Legs Base",
        "quantity": 1
      },
      {
        "item": "MG Scrip",
        "quantity": 30
      },
      {
        "item": "Saldynium (Ore)",
        "quantity": 10
      },
      {
        "item": "Jaclium (Ore)",
        "quantity": 20
      },
      {
        "item": "Carinite (Pure)",
        "quantity": 1
      },
      {
        "item": "Venture Arms Base",
        "quantity": 1
      }
    ],
    "rewards": [
      "Venture Core Ascension",
      "Venture Arms Ascension",
      "Venture Legs Ascension",
      "RSI Explorer Armor"
    ],
    "active": false
  },
  {
    "id": "TheCollector_SB_Volt_Desert(DO_NOT_USE_NOW_LOOT)",
    "name": "Volt Desert",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "Council Scrip",
        "quantity": 30
      },
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 5
      },
      {
        "item": "Advocacy Badge",
        "quantity": 10
      },
      {
        "item": "Volt Electron SMG",
        "quantity": 1
      }
    ],
    "rewards": [
      "Quartz \"Hunter Camo\" Energy SMG",
      "Quartz Energy SMG Battery (45 cap)"
    ],
    "active": false
  },
  {
    "id": "TheCollector_SB_Volt_Jungle(DO_NOT_USE_NOW_LOOT)",
    "name": "Volt Jungle",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "MG Scrip",
        "quantity": 30
      },
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 5
      },
      {
        "item": "Tundra Kopion Horn",
        "quantity": 35
      },
      {
        "item": "Volt Electron SMG",
        "quantity": 1
      }
    ],
    "rewards": [
      "Quartz \"Jungle Camo\" Energy SMG",
      "Quartz Energy SMG Battery (45 cap)"
    ],
    "active": false
  },
  {
    "id": "TheCollector_SB_Volt_Navy(DO_NOT_USE_NOW_LOOT)",
    "name": "Volt Navy",
    "tier": "New Customer",
    "category": "weapon",
    "requirements": [
      {
        "item": "MG Scrip",
        "quantity": 30
      },
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 5
      },
      {
        "item": "Grassland Quasigrazer Egg",
        "quantity": 50
      },
      {
        "item": "Volt Electron SMG",
        "quantity": 1
      }
    ],
    "rewards": [
      "Quartz \"Cobalt Camo\" Energy SMG",
      "Quartz Energy SMG Battery (45 cap)"
    ],
    "active": false
  },
  {
    "id": "TheCollector_ICanSee(DO_NOT_USE_NOW_LOOT)",
    "name": "Want Better Eyes",
    "tier": "New Customer",
    "category": "utility",
    "requirements": [
      {
        "item": "Wikelo Favor",
        "quantity": 1
      },
      {
        "item": "Yormandi Eye",
        "quantity": 2
      },
      {
        "item": "Yormandi Tongue",
        "quantity": 1
      }
    ],
    "rewards": [
      "XDL \"Mark I\" Monocular Rangefinder"
    ],
    "active": false
  },
  {
    "id": "TheCollector_GG_XanthuleSuit(DO_NOT_USE_STORE_EXCLUSIVE)",
    "name": "Xi'an Xanthule Suit made better",
    "tier": "Very Good Customer",
    "category": "armor",
    "requirements": [
      {
        "item": "Xanthule Helmet",
        "quantity": 1
      },
      {
        "item": "Ace Interceptor Helmet",
        "quantity": 10
      },
      {
        "item": "Tevarin War Service Marker (Pristine)",
        "quantity": 1
      },
      {
        "item": "MG Scrip",
        "quantity": 20
      },
      {
        "item": "Xanthule Suit",
        "quantity": 1
      }
    ],
    "rewards": [
      "Flight Suit",
      "Xanthule Ascension Helmet"
    ],
    "active": false,
    "notes": "Upgraded Xi'an armor variant. Requires the base armor set."
  }
];

export const gatheringItems: GatheringItem[] = [
  {
    "name": "Carinite",
    "category": "ore",
    "locations": [
      "Sand caves in Stanton (Aberdeen, Daymar, and others)"
    ],
    "tips": "Requires the Hathor 'Align & Mine' mission to unlock cave deposits. Mine with multi-tool mining attachment. High demand for Wikelo contracts and crafting."
  },
  {
    "name": "Carinite (Pure)",
    "category": "ore",
    "locations": [
      "Deep sand caves in Stanton"
    ],
    "tips": "Ultra-rare pure variant. Requires Hathor 'Align & Mine' mission. Very low spawn rate in deep cave systems."
  },
  {
    "name": "Saldynium (Ore)",
    "category": "ore",
    "locations": [
      "Asteroid surfaces",
      "Moon ore deposits"
    ],
    "tips": "Rare metal valued for laser production. Found in specific geological formations."
  },
  {
    "name": "Jaclium (Ore)",
    "category": "ore",
    "locations": [
      "Moon surfaces",
      "Cave deposits in Stanton"
    ],
    "tips": "A harvestable metal ore. Often co-located with Saldynium deposits."
  },
  {
    "name": "Tundra Kopion Horn",
    "category": "creature_drop",
    "locations": [
      "microTech surface",
      "Calliope",
      "Clio"
    ],
    "tips": "Dropped by Tundra Kopions. Needed for the intro mission and many weapon contracts. Approach carefully — they can be aggressive."
  },
  {
    "name": "Tundra Kopion Tooth",
    "category": "creature_drop",
    "locations": [
      "microTech surface",
      "Calliope",
      "Clio"
    ],
    "tips": "Rarer drop from Tundra Kopions. Used in Kopion Tooth weapon skins."
  },
  {
    "name": "Yormandi Eye",
    "category": "creature_drop",
    "locations": [
      "Hurston surface",
      "Aberdeen"
    ],
    "tips": "Dropped by Yormandi creatures. Required for armor sets and the Yormandi Gun contract."
  },
  {
    "name": "Yormandi Tongue",
    "category": "creature_drop",
    "locations": [
      "Hurston surface",
      "Aberdeen"
    ],
    "tips": "Rarer Yormandi drop. Fewer needed per contract but harder to obtain."
  },
  {
    "name": "Valakkar Apex Fang",
    "category": "creature_drop",
    "locations": [
      "Underground cave systems",
      "Specific moon biomes"
    ],
    "tips": "Very rare drop from apex Valakkar creatures. Required for glowing armor and ship contracts."
  },
  {
    "name": "Valakkar Adult Fang",
    "category": "creature_drop",
    "locations": [
      "Cave systems",
      "Moon surfaces"
    ],
    "tips": "Dropped by adult Valakkar. More common than apex fangs but still requires cave exploration."
  },
  {
    "name": "Valakkar Juvenile Fang",
    "category": "creature_drop",
    "locations": [
      "Cave entrances",
      "Surface near cave systems"
    ],
    "tips": "Most common Valakkar drop. Juveniles are easier to find near cave openings."
  },
  {
    "name": "Irradiated Valakkar Pearl (Grade AA)",
    "category": "creature_drop",
    "locations": [
      "Deep cave systems"
    ],
    "tips": "Rare harvestable from Valakkar nests. Grade AA is moderately rare."
  },
  {
    "name": "Irradiated Valakkar Pearl (Grade AAA)",
    "category": "creature_drop",
    "locations": [
      "Deep cave systems"
    ],
    "tips": "Extremely rare. Required for glowing armor contract and favor conversion."
  },
  {
    "name": "Vestal Water",
    "category": "harvestable",
    "locations": [
      "Planet surfaces near water sources"
    ],
    "tips": "Needed for the intro mission. A harvestable liquid found at specific planetary locations."
  },
  {
    "name": "MG Scrip",
    "category": "scrip",
    "locations": [
      "MG Facility loot containers",
      "Bunker missions"
    ],
    "tips": "Found in security facility loot. 50 MG Scrip = 1 Wikelo Favor."
  },
  {
    "name": "Council Scrip",
    "category": "scrip",
    "locations": [
      "Council facility loot containers"
    ],
    "tips": "Found in specific facility loot. 50 Council Scrip = 1 Wikelo Favor."
  },
  {
    "name": "ASD Secure Drive",
    "category": "loot",
    "locations": [
      "ASD Onyx Facility",
      "Security bunkers"
    ],
    "tips": "Data drives found at the ASD facility. Required for Snow Camo weapon/armor skins and ATLS contracts."
  },
  {
    "name": "Ace Interceptor Helmet",
    "category": "loot",
    "locations": [
      "Enemy NPCs during boarding operations",
      "Space combat encounters"
    ],
    "tips": "Content item — dropped by enemy pilots. Farm via space combat boarding missions."
  },
  {
    "name": "Military Badge",
    "category": "loot",
    "locations": [
      "Military facility loot",
      "NPC drops"
    ],
    "tips": "Found in military-themed encounters and facilities."
  },
  {
    "name": "Military Medal",
    "category": "loot",
    "locations": [
      "Rare military facility loot"
    ],
    "tips": "Rare drop. Required for high-tier ship contracts."
  },
  {
    "name": "Tevarin Marker",
    "category": "loot",
    "locations": [
      "Tevarin-related POIs",
      "Rare facility loot"
    ],
    "tips": "Very rare loot item needed for navy-themed armor contracts."
  },
  {
    "name": "Vanduul Plating",
    "category": "loot",
    "locations": [
      "Vanduul wreck sites",
      "Derelict Vanduul ships"
    ],
    "tips": "Salvaged from Vanduul vessels. Required for stealth ship and Vanduul armor contracts."
  },
  {
    "name": "Vanduul Metal",
    "category": "loot",
    "locations": [
      "Vanduul wreck sites",
      "Derelict Vanduul ships"
    ],
    "tips": "Alien metal salvaged from Vanduul wreckage. Pairs with Vanduul Plating in contracts."
  },
  {
    "name": "Large Artifact Fragment (Pristine)",
    "category": "loot",
    "locations": [
      "Ancient ruins",
      "POI exploration sites"
    ],
    "tips": "Extremely rare artifact. Required for the Wolf stealth ship contract."
  },
  {
    "name": "DCHS-05 Orbital Positioning Comp-Board",
    "category": "component",
    "locations": [
      "Station wreckage",
      "High-security facility loot"
    ],
    "tips": "Rare electronic component needed for Polaris and Idris contracts."
  },
  {
    "name": "Polaris Bit",
    "category": "commodity",
    "locations": [
      "Wikelo Emporium (trade 24 SCU Quantanium)"
    ],
    "tips": "Not found in the wild — only obtainable by trading Quantanium at Wikelo Emporiums. Required for capital ship contracts."
  },
  {
    "name": "RCMBNT-XTL Modules (A–E)",
    "category": "component",
    "locations": [
      "Site-C Facility"
    ],
    "tips": "Facility-specific loot modules. Five variants (A through E) needed for the Heavy Volt Zapper contract."
  }
];

export const favorTips = [
  "Wikelo Favors are the primary currency for most premium contracts — earned by converting scrip, ores, or creature drops.",
  "50 MG Scrip, 50 Council Scrip, or 50 Carinite each convert to 1 Wikelo Favor.",
  "12 Irradiated Valakkar Pearls (Grade AAA) also convert to 1 Wikelo Favor — more efficient if you farm creatures.",
  "Polaris Bits are a separate currency earned by trading 24 SCU Quantanium. Needed only for capital ship contracts.",
  "Favors can be spent at any Emporium station, not just where you earned them.",
  "Vehicle contracts start at 2-5 Favors. Mid-tier ships cost 6-10 Favors. Capital ships require 50 Favors + Polaris Bits.",
  "Complete the 'New to System' intro mission first — no other contracts are available until it's done.",
  "Rewards are now deterministic (as of 4.2.1) — you see exactly what you'll get before accepting a contract.",
  "Deposit items via the freight elevator at each Emporium station. Rewards appear in your local inventory after completion.",
  "Check wikelotrades.com for a community tracker that helps manage your inventory and track contract completion."
];
