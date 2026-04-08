// Auto-generated from DataForge extraction — sc-alpha-4.7.0-4.7.176.58286
// Run: npm run sync:generate

export interface LootTableEntry {
  name: string;
  weight: number;
  chanceToExist?: number;
  minResults?: number;
  maxResults?: number;
  choiceLimit?: number;
  dupeLimit?: number;
}

export interface LootTable {
  id: string;
  name: string;
  locationType: string;
  rarity: string;
  entries: LootTableEntry[];
}

export interface SpecialEvent {
  name: string;
  probabilityPerContainer: number;
  minEntries: number;
  maxEntries: number;
}

export const lootTables: LootTable[] = [
  {
    "id": "kopion",
    "name": "Kopion",
    "locationType": "animals",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Kopion",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_b_armor_001",
    "name": "LootTable_B_Armor_001",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "CZ_Armour_B",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_b_armor_firerat_001",
    "name": "LootTable_B_Armor_Firerat_001",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "CZ_Armor_Firerat",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_b_armor_horizon_001",
    "name": "LootTable_B_Armor_Horizon_001",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "CZ_Armor_Horizon",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_b_armor_xenothreat_001",
    "name": "LootTable_B_Armor_Xenothreat_001",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "CZ_Armor_Horizon",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_b_weapon_001",
    "name": "LootTable_B_Weapon_001",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "CZ_Weapons_B",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_b_weapon_01",
    "name": "LootTable_B_Weapon_01",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Weapon_Pistol_Rare",
        "weight": 1
      },
      {
        "name": "Ammo_Pistol_Common",
        "weight": 0.25
      },
      {
        "name": "Attachment_Size01",
        "weight": 0.5
      }
    ]
  },
  {
    "id": "loottable_b_weapon_02",
    "name": "LootTable_B_Weapon_02",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "CZ_Weapons_B",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_b_weapon_03",
    "name": "LootTable_B_Weapon_03",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Weapon_Shouldered_Rare",
        "weight": 0.5
      },
      {
        "name": "Ammo_Shouldered",
        "weight": 0.25
      },
      {
        "name": "FPS_Stocked",
        "weight": 0.5
      },
      {
        "name": "Attachment_Size03",
        "weight": 0.85
      }
    ]
  },
  {
    "id": "loottable_c_generic_001",
    "name": "LootTable_C_Generic_001",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Gem_Rare",
        "weight": 0.2
      },
      {
        "name": "FuseCell_001",
        "weight": 0.1
      },
      {
        "name": "Radiation_Only",
        "weight": 0.2
      },
      {
        "name": "CZ_WeaponAttachment_C",
        "weight": 0.3
      },
      {
        "name": "Weapons_Melee",
        "weight": 0.2,
        "maxResults": 1
      },
      {
        "name": "CZ_WeaponAttachment_D",
        "weight": 0.3
      },
      {
        "name": "Clothing",
        "weight": 0.3
      }
    ]
  },
  {
    "id": "loottable_c_generic_002",
    "name": "LootTable_C_Generic_002",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "DrugsCache_Narcotics",
        "weight": 0.05
      },
      {
        "name": "CZ_WeaponAttachment_C",
        "weight": 0.6
      },
      {
        "name": "FuseCell_001",
        "weight": 0.3
      },
      {
        "name": "Tools_TractorBeam",
        "weight": 0.1
      }
    ]
  },
  {
    "id": "loottable_c_medical_001",
    "name": "LootTable_C_Medical_001",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "MedicalMultitool_Refill",
        "weight": 1,
        "minResults": 1
      },
      {
        "name": "Medical_NoDrug_NoMedPen",
        "weight": 0.5
      },
      {
        "name": "MedicalWeapons_Refill",
        "weight": 1
      },
      {
        "name": "MedPen_Only",
        "weight": 0.4
      },
      {
        "name": "DrugsCache_Medical",
        "weight": 0.25
      }
    ]
  },
  {
    "id": "loottable_c_weapon_001",
    "name": "LootTable_C_Weapon_001",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "CZ_Weapons_C",
        "weight": 1,
        "minResults": 1
      },
      {
        "name": "CZ_Weapons_B",
        "weight": 0.05
      },
      {
        "name": "Container_Attachments_ContestedZones",
        "weight": 1,
        "minResults": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_c_weapon_002",
    "name": "LootTable_C_Weapon_002",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "WeaponsCache_UnCommon",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_c_weapon_01",
    "name": "LootTable_C_Weapon_01",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Ammo_Pistol_Common",
        "weight": 0.25
      },
      {
        "name": "Pistol_Uncommon",
        "weight": 1
      },
      {
        "name": "Attachment_Size01",
        "weight": 0.5
      }
    ]
  },
  {
    "id": "loottable_c_weapon_02",
    "name": "LootTable_C_Weapon_02",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "FPS_Stocked",
        "weight": 1
      },
      {
        "name": "Ammo_Stocked",
        "weight": 0.25
      },
      {
        "name": "Attachment_Size02",
        "weight": 0.5
      }
    ]
  },
  {
    "id": "loottable_cz_grade_b",
    "name": "LootTable_CZ_Grade_B",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Weapon_Shouldered_Rare",
        "weight": 0.75,
        "minResults": 1
      },
      {
        "name": "ArmorCache_Rare",
        "weight": 0.25
      },
      {
        "name": "Tools_Rare",
        "weight": 0.25,
        "maxResults": 1
      },
      {
        "name": "Gem_Rare",
        "weight": 0.1
      },
      {
        "name": "DrugsCache_Narcotics",
        "weight": 0.25
      },
      {
        "name": "Weapon_Attachments_Rare",
        "weight": 0.5
      }
    ]
  },
  {
    "id": "loottable_cz_grade_c",
    "name": "LootTable_CZ_Grade_C",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Pistol_Uncommon",
        "weight": 0.5,
        "minResults": 1
      },
      {
        "name": "Tools_Rare",
        "weight": 0.5,
        "maxResults": 1
      },
      {
        "name": "ArmorCache_UnCommon",
        "weight": 0.25
      },
      {
        "name": "Attachments_UnCommon",
        "weight": 0.5
      },
      {
        "name": "FPS_Stocked",
        "weight": 0.25
      },
      {
        "name": "Ammo_Pistol_Common",
        "weight": 0.25
      },
      {
        "name": "Ammo_Stocked",
        "weight": 0.5
      },
      {
        "name": "Ammo_Shouldered",
        "weight": 0.5
      }
    ]
  },
  {
    "id": "loottable_cz_grade_d_01",
    "name": "LootTable_CZ_Grade_D_01",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Glowsticks",
        "weight": 0.4,
        "maxResults": 1
      },
      {
        "name": "Weapons_Melee",
        "weight": 0.2,
        "maxResults": 2
      },
      {
        "name": "Salvage",
        "weight": 0.75,
        "maxResults": 5
      },
      {
        "name": "FoodCache_Common",
        "weight": 0.8
      },
      {
        "name": "Kopion",
        "weight": 0.6,
        "maxResults": 2
      },
      {
        "name": "GrenadesCache_Common",
        "weight": 0.2
      }
    ]
  },
  {
    "id": "loottable_d_ammo_001",
    "name": "LootTable_D_Ammo_001",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Container_Large_Weapons_Ammo_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_d_ammo_01",
    "name": "LootTable_D_Ammo_01",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Ammo_Pistol_Common",
        "weight": 0.6,
        "minResults": 1
      },
      {
        "name": "Ammo_Stocked",
        "weight": 0.3
      },
      {
        "name": "Ammo_Shouldered",
        "weight": 0.05
      }
    ]
  },
  {
    "id": "loottable_d_food_01",
    "name": "LootTable_D_Food_01",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "FoodCache_Pyro",
        "weight": 0.8
      }
    ]
  },
  {
    "id": "loottable_d_junk_001",
    "name": "LootTable_D_Junk_001",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "ScrapLoot",
        "weight": 0.3
      },
      {
        "name": "Glowsticks",
        "weight": 0.15
      },
      {
        "name": "CZ_WeaponAttachment_D",
        "weight": 0.05
      },
      {
        "name": "Gem_Rare",
        "weight": 0.025
      },
      {
        "name": "Weapons_Melee",
        "weight": 0.05
      },
      {
        "name": "GrenadesCache_Common",
        "weight": 0.1
      }
    ]
  },
  {
    "id": "loottable_d_medical_001",
    "name": "LootTable_D_Medical_001",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "MedPen_Only",
        "weight": 0.75,
        "minResults": 1
      },
      {
        "name": "DrinksCache_Common",
        "weight": 0.5
      },
      {
        "name": "Medical_NoDrug_NoMedPen",
        "weight": 0.1
      }
    ]
  },
  {
    "id": "loottable_d_medical_01",
    "name": "LootTable_D_Medical_01",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "MedPen_Only",
        "weight": 1,
        "minResults": 1
      },
      {
        "name": "DrinksCache_Common",
        "weight": 0.1
      }
    ]
  },
  {
    "id": "loottable_gen_ammo_01",
    "name": "LootTable_Gen_Ammo_01",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Ammo_Pistol_Common",
        "weight": 0.25,
        "minResults": 1
      },
      {
        "name": "Ammo_Stocked",
        "weight": 0.5
      },
      {
        "name": "Ammo_Shouldered",
        "weight": 0.05
      }
    ]
  },
  {
    "id": "loottable_gen_medical_01",
    "name": "LootTable_Gen_Medical_01",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "MedPen_Only",
        "weight": 1,
        "minResults": 1
      },
      {
        "name": "DrinksCache_Common",
        "weight": 0.1
      },
      {
        "name": "Medical_NoDrug_NoMedPen",
        "weight": 0.1
      }
    ]
  },
  {
    "id": "loottable_npc_cz_soldier_001",
    "name": "LootTable_NPC_CZ_Soldier_001",
    "locationType": "contestedzone",
    "rarity": "mixed",
    "entries": [
      {
        "name": "MedPen_Only",
        "weight": 0.5
      },
      {
        "name": "Gem_Rare",
        "weight": 0.1
      },
      {
        "name": "GrenadesCache_Common",
        "weight": 0.25
      },
      {
        "name": "FuseCell_001",
        "weight": 0.1
      },
      {
        "name": "DrugsCache_Narcotics",
        "weight": 0.05
      },
      {
        "name": "Weapon_Attachments_Rare",
        "weight": 0.01
      }
    ]
  },
  {
    "id": "derelictcommon",
    "name": "DerelictCommon",
    "locationType": "derelict",
    "rarity": "common",
    "entries": [
      {
        "name": "HarvestableCache_Common",
        "weight": 0.7
      },
      {
        "name": "FoodCache_Common",
        "weight": 0.1
      },
      {
        "name": "DrinksCache_Common",
        "weight": 0.2
      },
      {
        "name": "Tools_TractorBeam",
        "weight": 0.5,
        "minResults": 2,
        "maxResults": 2
      },
      {
        "name": "DrugsCache_Medical",
        "weight": 0.6
      },
      {
        "name": "Glowsticks",
        "weight": 0.3
      },
      {
        "name": "Attachments_Common",
        "weight": 0.2
      }
    ]
  },
  {
    "id": "derelictrare",
    "name": "DerelictRare",
    "locationType": "derelict",
    "rarity": "rare",
    "entries": [
      {
        "name": "WeaponsCache_Rare",
        "weight": 1
      },
      {
        "name": "ArmorCache_Rare",
        "weight": 1
      },
      {
        "name": "Weapons_NoPistolsNoMelee_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "derelicttest",
    "name": "DerelictTest",
    "locationType": "derelict",
    "rarity": "mixed",
    "entries": [
      {
        "name": "DerelictTest",
        "weight": 1,
        "minResults": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "derelictuncommon",
    "name": "DerelictUnCommon",
    "locationType": "derelict",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Tools_TractorBeam",
        "weight": 1,
        "minResults": 2,
        "maxResults": 2
      },
      {
        "name": "FoodCache_Common",
        "weight": 0.2
      },
      {
        "name": "DrinksCache_Common",
        "weight": 0.5
      },
      {
        "name": "DrugsCache_Medical",
        "weight": 0.3
      },
      {
        "name": "Attachments_UnCommon",
        "weight": 0.8
      },
      {
        "name": "ArmorCache_UnCommon",
        "weight": 0.7
      }
    ]
  },
  {
    "id": "dc_common",
    "name": "DC_Common",
    "locationType": "distributioncenters",
    "rarity": "common",
    "entries": [
      {
        "name": "HarvestableCache_Common",
        "weight": 0.7
      },
      {
        "name": "FoodCache_Common",
        "weight": 0.1
      },
      {
        "name": "DrinksCache_Common",
        "weight": 0.2
      },
      {
        "name": "Tools_TractorBeam",
        "weight": 0.5,
        "minResults": 2,
        "maxResults": 2
      },
      {
        "name": "DrugsCache_Medical",
        "weight": 0.6
      },
      {
        "name": "Glowsticks",
        "weight": 0.3
      },
      {
        "name": "Attachments_Common",
        "weight": 0.2
      }
    ]
  },
  {
    "id": "dc_rare",
    "name": "DC_Rare",
    "locationType": "distributioncenters",
    "rarity": "rare",
    "entries": [
      {
        "name": "WeaponsCache_Rare",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "ArmorCache_Rare",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Attachments_Rare",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Container_Armour_DistributionCentres",
        "weight": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "dc_uncommon",
    "name": "DC_Uncommon",
    "locationType": "distributioncenters",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Tools_TractorBeam",
        "weight": 1,
        "minResults": 2,
        "maxResults": 2
      },
      {
        "name": "FoodCache_Common",
        "weight": 0.2
      },
      {
        "name": "DrinksCache_Common",
        "weight": 0.5
      },
      {
        "name": "DrugsCache_Medical",
        "weight": 0.3
      },
      {
        "name": "Attachments_UnCommon",
        "weight": 0.8
      },
      {
        "name": "ArmorCache_UnCommon",
        "weight": 0.7
      },
      {
        "name": "Attachments_Rare",
        "weight": 0.5
      }
    ]
  },
  {
    "id": "ammo",
    "name": "Ammo",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "AmmoCache_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "antiquesandstuff",
    "name": "AntiquesAndStuff",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Glowsticks",
        "weight": 0.7,
        "maxResults": 3
      },
      {
        "name": "DrinksCache_Common",
        "weight": 0.6
      },
      {
        "name": "FoodCache_Common",
        "weight": 0.6
      },
      {
        "name": "ScrapLoot",
        "weight": 0.4,
        "maxResults": 4
      },
      {
        "name": "Container_Antiques_Common",
        "weight": 0.1,
        "maxResults": 2
      }
    ]
  },
  {
    "id": "armor",
    "name": "Armor",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "ArmorCache_Common",
        "weight": 1
      },
      {
        "name": "ArmorCache_Rare",
        "weight": 0.4
      }
    ]
  },
  {
    "id": "armor_jumptown",
    "name": "Armor_Jumptown",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "ArmorCache_Common",
        "weight": 1
      },
      {
        "name": "ArmorCache_Rare",
        "weight": 0.4
      }
    ]
  },
  {
    "id": "armor_survival",
    "name": "Armor_Survival",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "ArmorCache_Common",
        "weight": 1
      },
      {
        "name": "ArmorSurvival",
        "weight": 0.3
      }
    ]
  },
  {
    "id": "consumables",
    "name": "Consumables",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "DrugsCache_Medical",
        "weight": 0.6,
        "maxResults": 6
      },
      {
        "name": "GrenadesCache_Common",
        "weight": 0.5,
        "maxResults": 1
      },
      {
        "name": "MedicalMultitool_Refill",
        "weight": 0.4,
        "maxResults": 1
      },
      {
        "name": "HackingChips",
        "weight": 0.3,
        "maxResults": 2
      }
    ]
  },
  {
    "id": "contrabandpico",
    "name": "ContrabandPico",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "ContrabandPico_Ammo",
        "weight": 1,
        "maxResults": 5
      }
    ]
  },
  {
    "id": "crystalderelict",
    "name": "CrystalDerelict",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Minerals_Derelict_Uncommon",
        "weight": 1
      },
      {
        "name": "Minerals_Derelict_Rare",
        "weight": 1
      },
      {
        "name": "Minerals_Derelict_Epic",
        "weight": 1
      }
    ]
  },
  {
    "id": "drugs",
    "name": "Drugs",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "DrugsCache_Narcotics",
        "weight": 1
      }
    ]
  },
  {
    "id": "firepower",
    "name": "Firepower",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Weapons_Attachments",
        "weight": 1,
        "maxResults": 4
      },
      {
        "name": "GrenadesCache_Common",
        "weight": 0.6,
        "maxResults": 2
      },
      {
        "name": "AmmoCache_Common",
        "weight": 0.4,
        "maxResults": 3
      }
    ]
  },
  {
    "id": "firepower-resources",
    "name": "Firepower_resources",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "GrenadesCache_Common",
        "weight": 0.4,
        "maxResults": 2
      },
      {
        "name": "AmmoCache_Common",
        "weight": 0.5,
        "maxResults": 5
      },
      {
        "name": "Attachments_Common",
        "weight": 0.8,
        "maxResults": 2
      },
      {
        "name": "Attachments_UnCommon",
        "weight": 0.3
      }
    ]
  },
  {
    "id": "generalloot",
    "name": "GeneralLoot",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "RandomLoot_Common",
        "weight": 3
      },
      {
        "name": "HarvestableCache_Common",
        "weight": 0.25
      }
    ]
  },
  {
    "id": "generalloot_ammoandmedics",
    "name": "GeneralLoot_AmmoAndMedics",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "AmmoCache_Common",
        "weight": 1,
        "minResults": 1
      },
      {
        "name": "DrugsCache_Medical",
        "weight": 1,
        "minResults": 1
      },
      {
        "name": "WeaponsCache_Rare",
        "weight": 0.2,
        "maxResults": 2
      }
    ]
  },
  {
    "id": "generalloot_outpost",
    "name": "GeneralLoot_Outpost",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "HarvestableCache_Common",
        "weight": 0.7
      },
      {
        "name": "DrinksCache_Common",
        "weight": 0.8
      },
      {
        "name": "FoodCache_Common",
        "weight": 0.8
      },
      {
        "name": "Tools_Common",
        "weight": 0.6,
        "maxResults": 3
      },
      {
        "name": "Glowsticks",
        "weight": 0.5,
        "maxResults": 4
      },
      {
        "name": "Clothing",
        "weight": 0.4
      }
    ]
  },
  {
    "id": "harvestables",
    "name": "Harvestables",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "HarvestableCache_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "harvestables-food-drinks",
    "name": "Harvestables_Food_Drinks",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "HarvestableCache_Common",
        "weight": 0.2,
        "maxResults": 3
      },
      {
        "name": "DrinksCache_Common",
        "weight": 1,
        "minResults": 1,
        "maxResults": 8
      },
      {
        "name": "FoodCache_Common",
        "weight": 1,
        "minResults": 1,
        "maxResults": 8
      }
    ]
  },
  {
    "id": "harvestables-glowsticks",
    "name": "Harvestables_Glowsticks",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "HarvestableCache_Common",
        "weight": 0.7
      },
      {
        "name": "Glowsticks",
        "weight": 0.8
      }
    ]
  },
  {
    "id": "loottable_actor_acepilot",
    "name": "LootTable_Actor_AcePilot",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Actor_AcePilot_Scrip",
        "weight": 1,
        "minResults": 1,
        "maxResults": 1
      },
      {
        "name": "Actor_AcePilot_Medals",
        "weight": 0.5,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_antiques_common",
    "name": "LootTable_Container_Antiques_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Antiques_Common",
        "weight": 0.1
      }
    ]
  },
  {
    "id": "loottable_container_antiques_rare",
    "name": "LootTable_Container_Antiques_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Antiques_Rare",
        "weight": 0.1
      }
    ]
  },
  {
    "id": "loottable_container_antiques_uncommon",
    "name": "LootTable_Container_Antiques_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Antiques_Uncommon",
        "weight": 0.1
      }
    ]
  },
  {
    "id": "loottable_container_armour_arms_small_asddelving",
    "name": "LootTable_Container_Armour_Arms_Small_ASDDelving",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Container_Armour_Arms_ASDDelving",
        "weight": 1,
        "minResults": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_armour_backpack_small_asddelving",
    "name": "LootTable_Container_Armour_Backpack_Small_ASDDelving",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Container_Armour_Backpack_ASDDelving",
        "weight": 1,
        "minResults": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_armour_core_small_asddelving",
    "name": "LootTable_Container_Armour_Core_Small_ASDDelving",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Container_Armour_Core_ASDDelving",
        "weight": 1,
        "minResults": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_armour_helmet_small_asddelving",
    "name": "LootTable_Container_Armour_Helmet_Small_ASDDelving",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Container_Armour_Helmet_ASDDelving",
        "weight": 1,
        "minResults": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_armour_large_common",
    "name": "LootTable_Container_Armour_Large_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Undersuit_Common",
        "weight": 0.25
      },
      {
        "name": "Container_Light_Armour_Common",
        "weight": 1
      },
      {
        "name": "Container_Backpack_Light_Common",
        "weight": 0.125,
        "maxResults": 1
      },
      {
        "name": "Container_Medium_Armour_Common",
        "weight": 10
      },
      {
        "name": "Container_Backpack_Medium_Common",
        "weight": 1.25,
        "maxResults": 1
      },
      {
        "name": "Container_Heavy_Armour_Common",
        "weight": 100
      },
      {
        "name": "Container_Backpack_Heavy_Common",
        "weight": 12.5,
        "maxResults": 1
      },
      {
        "name": "Container_FullSuit_Common",
        "weight": 12.5,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_armour_large_common_orbageddon",
    "name": "LootTable_Container_Armour_Large_Common_Orbageddon",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Undersuit_Common",
        "weight": 0.25
      },
      {
        "name": "Container_Light_Armour_Common",
        "weight": 1
      },
      {
        "name": "Container_Backpack_Light_Common",
        "weight": 0.125,
        "maxResults": 1
      },
      {
        "name": "Container_Medium_Armour_Common",
        "weight": 10
      },
      {
        "name": "Container_Backpack_Medium_Common",
        "weight": 1.25,
        "maxResults": 1
      },
      {
        "name": "Container_Heavy_Armour_Common",
        "weight": 100
      },
      {
        "name": "Container_Backpack_Heavy_Common",
        "weight": 12.5,
        "maxResults": 1
      },
      {
        "name": "Container_FullSuit_Common",
        "weight": 12.5,
        "maxResults": 1
      },
      {
        "name": "Container_Heavy_Armour_Common_Orbageddon",
        "weight": 25
      }
    ]
  },
  {
    "id": "loottable_container_armour_large_common_stormbreaker",
    "name": "LootTable_Container_Armour_Large_Common_StormBreaker",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Undersuit_Common",
        "weight": 0.25
      },
      {
        "name": "Container_Light_Armour_Common",
        "weight": 1
      },
      {
        "name": "Container_Backpack_Light_Common",
        "weight": 0.125,
        "maxResults": 1
      },
      {
        "name": "Container_Medium_Armour_Common",
        "weight": 10
      },
      {
        "name": "Container_Backpack_Medium_Common",
        "weight": 1.25,
        "maxResults": 1
      },
      {
        "name": "Container_Heavy_Armour_Common",
        "weight": 100
      },
      {
        "name": "Container_Backpack_Heavy_Common",
        "weight": 12.5,
        "maxResults": 1
      },
      {
        "name": "Container_FullSuit_Common",
        "weight": 12.5,
        "maxResults": 1
      },
      {
        "name": "Container_Heavy_Armour_Common_StormBreaker",
        "weight": 25
      }
    ]
  },
  {
    "id": "loottable_container_armour_large_contestedzones",
    "name": "LootTable_Container_Armour_Large_ContestedZones",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Container_Armour_ContestedZones",
        "weight": 1,
        "minResults": 1,
        "maxResults": 1
      },
      {
        "name": "Container_Attachments_ContestedZones",
        "weight": 1,
        "minResults": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_armour_large_legendary",
    "name": "LootTable_Container_Armour_Large_Legendary",
    "locationType": "general",
    "rarity": "legendary",
    "entries": [
      {
        "name": "Large_Armour_Legendary_Orbageddon",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_armour_large_rare",
    "name": "LootTable_Container_Armour_Large_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Undersuit_Rare",
        "weight": 0.25
      },
      {
        "name": "Container_Light_Armour_Rare",
        "weight": 1
      },
      {
        "name": "Container_Backpack_Light_Rare",
        "weight": 0.125,
        "maxResults": 1
      },
      {
        "name": "Container_Medium_Armour_Rare",
        "weight": 10
      },
      {
        "name": "Container_Backpack_Medium_Rare",
        "weight": 1.25,
        "maxResults": 1
      },
      {
        "name": "Container_Heavy_Armour_Rare",
        "weight": 100
      },
      {
        "name": "Container_Backpack_Heavy_Rare",
        "weight": 12.5,
        "maxResults": 1
      },
      {
        "name": "Container_FullSuit_Rare",
        "weight": 12.5,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_armour_large_rare_orbageddon",
    "name": "LootTable_Container_Armour_Large_Rare_Orbageddon",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Undersuit_Rare",
        "weight": 0.25
      },
      {
        "name": "Container_Light_Armour_Rare",
        "weight": 1
      },
      {
        "name": "Container_Backpack_Light_Rare",
        "weight": 0.125,
        "maxResults": 1
      },
      {
        "name": "Container_Medium_Armour_Rare",
        "weight": 10
      },
      {
        "name": "Container_Backpack_Medium_Rare",
        "weight": 1.25,
        "maxResults": 1
      },
      {
        "name": "Container_Heavy_Armour_Rare",
        "weight": 100
      },
      {
        "name": "Container_Backpack_Heavy_Rare",
        "weight": 12.5,
        "maxResults": 1
      },
      {
        "name": "Container_FullSuit_Rare",
        "weight": 12.5,
        "maxResults": 1
      },
      {
        "name": "Container_Heavy_Armour_Rare_Orbageddon",
        "weight": 25
      }
    ]
  },
  {
    "id": "loottable_container_armour_large_rare_stormbreaker",
    "name": "LootTable_Container_Armour_Large_Rare_StormBreaker",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Undersuit_Rare",
        "weight": 0.25
      },
      {
        "name": "Container_Light_Armour_Rare",
        "weight": 1
      },
      {
        "name": "Container_Backpack_Light_Rare",
        "weight": 0.125,
        "maxResults": 1
      },
      {
        "name": "Container_Medium_Armour_Rare",
        "weight": 10
      },
      {
        "name": "Container_Backpack_Medium_Rare",
        "weight": 1.25,
        "maxResults": 1
      },
      {
        "name": "Container_Heavy_Armour_Rare",
        "weight": 100
      },
      {
        "name": "Container_Backpack_Heavy_Rare",
        "weight": 12.5,
        "maxResults": 1
      },
      {
        "name": "Container_FullSuit_Rare",
        "weight": 12.5,
        "maxResults": 1
      },
      {
        "name": "Container_Heavy_Armour_Rare_StormBreaker",
        "weight": 25
      }
    ]
  },
  {
    "id": "loottable_container_armour_large_uncommon",
    "name": "LootTable_Container_Armour_Large_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Undersuit_Uncommon",
        "weight": 0.25
      },
      {
        "name": "Container_Light_Armour_Uncommon",
        "weight": 1
      },
      {
        "name": "Container_Backpack_Light_Uncommon",
        "weight": 0.125,
        "maxResults": 1
      },
      {
        "name": "Container_Medium_Armour_Uncommon",
        "weight": 10
      },
      {
        "name": "Container_Backpack_Medium_Uncommon",
        "weight": 1.25,
        "maxResults": 1
      },
      {
        "name": "Container_Heavy_Armour_Uncommon",
        "weight": 100
      },
      {
        "name": "Container_Backpack_Heavy_Uncommon",
        "weight": 12.5,
        "maxResults": 1
      },
      {
        "name": "Container_FullSuit_Uncommon",
        "weight": 12.5,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_armour_large_uncommon_orbageddon",
    "name": "LootTable_Container_Armour_Large_Uncommon_Orbageddon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Undersuit_Uncommon",
        "weight": 0.25
      },
      {
        "name": "Container_Light_Armour_Uncommon",
        "weight": 1
      },
      {
        "name": "Container_Backpack_Light_Uncommon",
        "weight": 0.125,
        "maxResults": 1
      },
      {
        "name": "Container_Medium_Armour_Uncommon",
        "weight": 10
      },
      {
        "name": "Container_Backpack_Medium_Uncommon",
        "weight": 1.25,
        "maxResults": 1
      },
      {
        "name": "Container_Heavy_Armour_Uncommon",
        "weight": 100
      },
      {
        "name": "Container_Backpack_Heavy_Uncommon",
        "weight": 12.5,
        "maxResults": 1
      },
      {
        "name": "Container_FullSuit_Uncommon",
        "weight": 12.5,
        "maxResults": 1
      },
      {
        "name": "Container_Heavy_Armour_Uncommon_Orbageddon",
        "weight": 25
      }
    ]
  },
  {
    "id": "loottable_container_armour_large_uncommon_stormbreaker",
    "name": "LootTable_Container_Armour_Large_Uncommon_StormBreaker",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Undersuit_Uncommon",
        "weight": 0.25
      },
      {
        "name": "Container_Light_Armour_Uncommon",
        "weight": 1
      },
      {
        "name": "Container_Backpack_Light_Uncommon",
        "weight": 0.125,
        "maxResults": 1
      },
      {
        "name": "Container_Medium_Armour_Uncommon",
        "weight": 10
      },
      {
        "name": "Container_Backpack_Medium_Uncommon",
        "weight": 1.25,
        "maxResults": 1
      },
      {
        "name": "Container_Heavy_Armour_Uncommon",
        "weight": 100
      },
      {
        "name": "Container_Backpack_Heavy_Uncommon",
        "weight": 12.5,
        "maxResults": 1
      },
      {
        "name": "Container_FullSuit_Uncommon",
        "weight": 12.5,
        "maxResults": 1
      },
      {
        "name": "Container_Heavy_Armour_Uncommon_StormBreaker",
        "weight": 25
      }
    ]
  },
  {
    "id": "loottable_container_armour_legs_small_asddelving",
    "name": "LootTable_Container_Armour_Legs_Small_ASDDelving",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Container_Armour_Legs_ASDDelving",
        "weight": 1,
        "minResults": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_armour_medium_common",
    "name": "LootTable_Container_Armour_Medium_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Undersuit_Common",
        "weight": 0.25
      },
      {
        "name": "Container_Light_Armour_Common",
        "weight": 1
      },
      {
        "name": "Container_Backpack_Light_Common",
        "weight": 0.125,
        "maxResults": 1
      },
      {
        "name": "Container_Medium_Armour_Common",
        "weight": 10
      },
      {
        "name": "Container_Backpack_Medium_Common",
        "weight": 1.25,
        "maxResults": 1
      },
      {
        "name": "Container_Heavy_Armour_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_armour_medium_rare",
    "name": "LootTable_Container_Armour_Medium_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Undersuit_Rare",
        "weight": 0.25
      },
      {
        "name": "Container_Light_Armour_Rare",
        "weight": 1
      },
      {
        "name": "Container_Backpack_Light_Rare",
        "weight": 0.125,
        "maxResults": 1
      },
      {
        "name": "Container_Medium_Armour_Rare",
        "weight": 10
      },
      {
        "name": "Container_Backpack_Medium_Rare",
        "weight": 1.25,
        "maxResults": 1
      },
      {
        "name": "Container_Heavy_Armour_Rare",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_armour_medium_uncommon",
    "name": "LootTable_Container_Armour_Medium_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Undersuit_Uncommon",
        "weight": 0.25
      },
      {
        "name": "Container_Light_Armour_Uncommon",
        "weight": 1
      },
      {
        "name": "Container_Backpack_Light_Uncommon",
        "weight": 0.125,
        "maxResults": 1
      },
      {
        "name": "Container_Medium_Armour_Uncommon",
        "weight": 10
      },
      {
        "name": "Container_Backpack_Medium_Uncommon",
        "weight": 1.25,
        "maxResults": 1
      },
      {
        "name": "Container_Heavy_Armour_Uncommon",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_armour_small_common",
    "name": "LootTable_Container_Armour_Small_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Undersuit_Common",
        "weight": 0.25
      },
      {
        "name": "Container_Light_Armour_Common",
        "weight": 1
      },
      {
        "name": "Container_Backpack_Light_Common",
        "weight": 0.125,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_armour_small_rare",
    "name": "LootTable_Container_Armour_Small_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Undersuit_Rare",
        "weight": 0.25
      },
      {
        "name": "Container_Light_Armour_Rare",
        "weight": 1
      },
      {
        "name": "Container_Backpack_Light_Rare",
        "weight": 0.125,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_armour_small_uncommon",
    "name": "LootTable_Container_Armour_Small_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Undersuit_Uncommon",
        "weight": 0.25
      },
      {
        "name": "Container_Light_Armour_Uncommon",
        "weight": 1
      },
      {
        "name": "Container_Backpack_Light_Uncommon",
        "weight": 0.125,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_clothing_common",
    "name": "LootTable_Container_Clothing_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Light_Armour_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_clothing_rare",
    "name": "LootTable_Container_Clothing_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Light_Armour_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_clothing_uncommon",
    "name": "LootTable_Container_Clothing_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Light_Armour_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_food_common",
    "name": "LootTable_Container_Food_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Food_Common",
        "weight": 1
      },
      {
        "name": "Container_Drink_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_food_rare",
    "name": "LootTable_Container_Food_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Food_Rare",
        "weight": 1
      },
      {
        "name": "Container_Drink_Rare",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_food_uncommon",
    "name": "LootTable_Container_Food_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Food_Uncommon",
        "weight": 1
      },
      {
        "name": "Container_Drink_Uncommon",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_harvestable_common",
    "name": "LootTable_Container_Harvestable_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Harvestables_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_harvestable_common_asddelving",
    "name": "LootTable_Container_Harvestable_Common_ASDDelving",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Harvestables_Common",
        "weight": 100
      },
      {
        "name": "Container_ASDSpeciminVial",
        "weight": 0.1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_harvestable_common0",
    "name": "LootTable_Container_Harvestable_Common0",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Harvestables_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_harvestable_rare",
    "name": "LootTable_Container_Harvestable_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Harvestables_Rare",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_harvestable_uncommon",
    "name": "LootTable_Container_Harvestable_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Harvestables_Uncommon",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_large_armour_legendary_orbageddon",
    "name": "LootTable_Container_Large_Armour_Legendary_Orbageddon",
    "locationType": "general",
    "rarity": "legendary",
    "entries": [
      {
        "name": "Large_Armour_Legendary_Orbageddon",
        "weight": 1,
        "minResults": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_large_generic_common",
    "name": "LootTable_Container_Large_Generic_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Food_Common",
        "weight": 100
      },
      {
        "name": "Container_Large_Weapons_Ammo_Common",
        "weight": 75
      },
      {
        "name": "Container_Clothing_Common",
        "weight": 50
      },
      {
        "name": "Container_Medpens_Mixed",
        "weight": 25
      },
      {
        "name": "Container_MultitoolAttachments",
        "weight": 25
      },
      {
        "name": "Container_Antiques_Common",
        "weight": 10
      },
      {
        "name": "Container_MedicalMultitoolAmmo",
        "weight": 2
      },
      {
        "name": "Container_MedgunAmmo",
        "weight": 1.5
      },
      {
        "name": "Container_Multitool_Common",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Container_GlowStick_Common",
        "weight": 1
      },
      {
        "name": "Container_MiningModules",
        "weight": 1
      },
      {
        "name": "Container_Toys_Common",
        "weight": 10
      },
      {
        "name": "HackingChips",
        "weight": 0.5
      },
      {
        "name": "Container_MiningGadgets_Common",
        "weight": 1
      },
      {
        "name": "Container_StockedTools_Common",
        "weight": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_large_generic_rare",
    "name": "LootTable_Container_Large_Generic_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Food_Rare",
        "weight": 100
      },
      {
        "name": "Container_Large_Weapons_Ammo_Common",
        "weight": 75
      },
      {
        "name": "Container_Clothing_Common",
        "weight": 50
      },
      {
        "name": "Container_Medpens_Mixed",
        "weight": 25
      },
      {
        "name": "Container_MultitoolAttachments",
        "weight": 25
      },
      {
        "name": "Container_Antiques_Rare",
        "weight": 10
      },
      {
        "name": "Container_MedicalMultitoolAmmo",
        "weight": 2
      },
      {
        "name": "Container_MedgunAmmo",
        "weight": 1.5
      },
      {
        "name": "Container_Multitool_Rare",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Container_GlowStick_Rare",
        "weight": 1
      },
      {
        "name": "Container_MiningModules",
        "weight": 1
      },
      {
        "name": "Container_Toys_Rare",
        "weight": 10
      },
      {
        "name": "HackingChips",
        "weight": 0.5
      },
      {
        "name": "Container_MiningGadgets_Common",
        "weight": 1
      },
      {
        "name": "Container_StockedTools_Common",
        "weight": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_large_generic_uncommon",
    "name": "LootTable_Container_Large_Generic_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Food_Uncommon",
        "weight": 100
      },
      {
        "name": "Container_Large_Weapons_Ammo_Common",
        "weight": 75
      },
      {
        "name": "Container_Clothing_Common",
        "weight": 50
      },
      {
        "name": "Container_Medpens_Mixed",
        "weight": 25
      },
      {
        "name": "Container_MultitoolAttachments",
        "weight": 25
      },
      {
        "name": "Container_Antiques_Uncommon",
        "weight": 10
      },
      {
        "name": "Container_MedicalMultitoolAmmo",
        "weight": 2
      },
      {
        "name": "Container_MedgunAmmo",
        "weight": 1.5
      },
      {
        "name": "Container_StockedTools_Uncommon",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Container_GlowStick_Uncommon",
        "weight": 1
      },
      {
        "name": "Container_MiningModules",
        "weight": 1
      },
      {
        "name": "Container_Toys_Uncommon",
        "weight": 10
      },
      {
        "name": "HackingChips",
        "weight": 0.5
      },
      {
        "name": "Container_MiningGadgets_Common",
        "weight": 1
      },
      {
        "name": "Container_StockedTools_Common",
        "weight": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_medium_generic_common",
    "name": "LootTable_Container_Medium_Generic_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Food_Common",
        "weight": 100
      },
      {
        "name": "Container_Medium_Weapons_Ammo_Common",
        "weight": 75
      },
      {
        "name": "Container_Clothing_Common",
        "weight": 50
      },
      {
        "name": "Container_Medpens_Mixed",
        "weight": 25
      },
      {
        "name": "Container_MultitoolAttachments",
        "weight": 25
      },
      {
        "name": "Container_Antiques_Common",
        "weight": 10
      },
      {
        "name": "Container_MedicalMultitoolAmmo",
        "weight": 2
      },
      {
        "name": "Container_MedgunAmmo",
        "weight": 1.5
      },
      {
        "name": "Container_Multitool_Common",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Container_GlowStick_Common",
        "weight": 1
      },
      {
        "name": "Container_MiningModules",
        "weight": 1
      },
      {
        "name": "Container_Toys_Common",
        "weight": 10
      },
      {
        "name": "HackingChips",
        "weight": 0.5
      },
      {
        "name": "Container_MiningGadgets_Common",
        "weight": 1
      },
      {
        "name": "Container_StockedTools_Common",
        "weight": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_medium_generic_rare",
    "name": "LootTable_Container_Medium_Generic_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Food_Rare",
        "weight": 100
      },
      {
        "name": "Container_Medium_Weapons_Ammo_Common",
        "weight": 75
      },
      {
        "name": "Container_Clothing_Rare",
        "weight": 50
      },
      {
        "name": "Container_Medpens_Mixed",
        "weight": 25
      },
      {
        "name": "Container_MultitoolAttachments",
        "weight": 25
      },
      {
        "name": "Container_Antiques_Rare",
        "weight": 10
      },
      {
        "name": "Container_MedicalMultitoolAmmo",
        "weight": 2
      },
      {
        "name": "Container_MedgunAmmo",
        "weight": 1.5
      },
      {
        "name": "Container_StockedTools_Rare",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Container_GlowStick_Rare",
        "weight": 1
      },
      {
        "name": "Container_MiningModules",
        "weight": 1
      },
      {
        "name": "Container_Toys_Rare",
        "weight": 10
      },
      {
        "name": "HackingChips",
        "weight": 0.5
      },
      {
        "name": "Container_MiningGadgets_Common",
        "weight": 1
      },
      {
        "name": "Container_StockedTools_Common",
        "weight": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_medium_generic_uncommon",
    "name": "LootTable_Container_Medium_Generic_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Food_Uncommon",
        "weight": 100
      },
      {
        "name": "Container_Medium_Weapons_Ammo_Common",
        "weight": 75
      },
      {
        "name": "Container_Clothing_Uncommon",
        "weight": 50
      },
      {
        "name": "Container_Medpens_Mixed",
        "weight": 25
      },
      {
        "name": "Container_MultitoolAttachments",
        "weight": 25
      },
      {
        "name": "Container_Antiques_Uncommon",
        "weight": 10
      },
      {
        "name": "Container_MedicalMultitoolAmmo",
        "weight": 2
      },
      {
        "name": "Container_MedgunAmmo",
        "weight": 1.5
      },
      {
        "name": "Container_StockedTools_Uncommon",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Container_GlowStick_Uncommon",
        "weight": 1
      },
      {
        "name": "Container_MiningModules",
        "weight": 1
      },
      {
        "name": "Container_Toys_Uncommon",
        "weight": 10
      },
      {
        "name": "HackingChips",
        "weight": 0.5
      },
      {
        "name": "Container_MiningGadgets_Common",
        "weight": 1
      },
      {
        "name": "Container_StockedTools_Common",
        "weight": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_mining_large_common",
    "name": "LootTable_Container_Mining_Large_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Gems_Common",
        "weight": 100
      },
      {
        "name": "Container_MultitoolMining_Common",
        "weight": 100,
        "maxResults": 1
      },
      {
        "name": "Container_MiningModules",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Container_MiningGadgets_Common",
        "weight": 0.1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_mining_large_rare",
    "name": "LootTable_Container_Mining_Large_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Gems_Rare",
        "weight": 100
      },
      {
        "name": "Container_MultitoolMining_Rare",
        "weight": 100,
        "maxResults": 1
      },
      {
        "name": "Container_MiningModules",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Container_MiningGadgets_Rare",
        "weight": 0.1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_mining_large_uncommon",
    "name": "LootTable_Container_Mining_Large_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Gems_Uncommon",
        "weight": 100
      },
      {
        "name": "Container_MultitoolMining_Uncommon",
        "weight": 100,
        "maxResults": 1
      },
      {
        "name": "Container_MiningModules",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Container_MiningGadgets_Uncommon",
        "weight": 0.1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_mining_medium_common",
    "name": "LootTable_Container_Mining_Medium_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Gems_Common",
        "weight": 100
      },
      {
        "name": "Container_MultitoolMining_Common",
        "weight": 100,
        "maxResults": 1
      },
      {
        "name": "Container_MiningModules",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Container_MiningGadgets_Common",
        "weight": 0.1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_mining_medium_rare",
    "name": "LootTable_Container_Mining_Medium_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Gems_Rare",
        "weight": 100
      },
      {
        "name": "Container_MultitoolMining_Rare",
        "weight": 100,
        "maxResults": 1
      },
      {
        "name": "Container_MiningModules",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Container_MiningGadgets_Rare",
        "weight": 0.1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_mining_medium_uncommon",
    "name": "LootTable_Container_Mining_Medium_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Gems_Uncommon",
        "weight": 100
      },
      {
        "name": "Container_MultitoolMining_Uncommon",
        "weight": 100,
        "maxResults": 1
      },
      {
        "name": "Container_MiningModules",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Container_MiningGadgets_Uncommon",
        "weight": 0.1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_mining_small_common",
    "name": "LootTable_Container_Mining_Small_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Gems_Common",
        "weight": 100
      },
      {
        "name": "Container_MultitoolMining_Common",
        "weight": 100,
        "maxResults": 1
      },
      {
        "name": "Container_MiningModules",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Container_MiningGadgets_Common",
        "weight": 0.1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_mining_small_rare",
    "name": "LootTable_Container_Mining_Small_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Gems_Rare",
        "weight": 100
      },
      {
        "name": "Container_MultitoolMining_Rare",
        "weight": 100,
        "maxResults": 1
      },
      {
        "name": "Container_MiningModules",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Container_MiningGadgets_Rare",
        "weight": 0.1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_mining_small_uncommon",
    "name": "LootTable_Container_Mining_Small_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Gems_Uncommon",
        "weight": 100
      },
      {
        "name": "Container_MultitoolMining_Uncommon",
        "weight": 100,
        "maxResults": 1
      },
      {
        "name": "Container_MiningModules",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Container_MiningGadgets_Uncommon",
        "weight": 0.1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_personal_common",
    "name": "LootTable_Container_Personal_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Food_Common",
        "weight": 100,
        "minResults": 1,
        "maxResults": 3
      },
      {
        "name": "Container_Small_Weapons_Ammo_Common",
        "weight": 75
      },
      {
        "name": "Container_Clothing_Common",
        "weight": 50
      },
      {
        "name": "Container_Medpens_Mixed",
        "weight": 25
      },
      {
        "name": "Container_MultitoolAttachments",
        "weight": 25,
        "maxResults": 1
      },
      {
        "name": "Container_Toys_Common",
        "weight": 10
      },
      {
        "name": "Container_Antiques_Common",
        "weight": 5
      },
      {
        "name": "HackingChips",
        "weight": 5,
        "maxResults": 1
      },
      {
        "name": "Container_GlowStick_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_personal_rare",
    "name": "LootTable_Container_Personal_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Food_Rare",
        "weight": 100,
        "minResults": 1,
        "maxResults": 3
      },
      {
        "name": "Container_Small_Weapons_Ammo_Common",
        "weight": 75
      },
      {
        "name": "Container_Clothing_Rare",
        "weight": 50
      },
      {
        "name": "Container_Medpens_Mixed",
        "weight": 25
      },
      {
        "name": "Container_MultitoolAttachments",
        "weight": 25,
        "maxResults": 1
      },
      {
        "name": "Container_Toys_Rare",
        "weight": 10
      },
      {
        "name": "Container_Antiques_Rare",
        "weight": 5
      },
      {
        "name": "HackingChips",
        "weight": 5,
        "maxResults": 1
      },
      {
        "name": "Container_GlowStick_Rare",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_personal_uncommon",
    "name": "LootTable_Container_Personal_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Food_Uncommon",
        "weight": 100,
        "minResults": 1,
        "maxResults": 3
      },
      {
        "name": "Container_Small_Weapons_Ammo_Common",
        "weight": 75
      },
      {
        "name": "Container_Clothing_Uncommon",
        "weight": 50
      },
      {
        "name": "Container_Medpens_Mixed",
        "weight": 25
      },
      {
        "name": "Container_MultitoolAttachments",
        "weight": 25,
        "maxResults": 1
      },
      {
        "name": "Container_Toys_Uncommon",
        "weight": 10
      },
      {
        "name": "Container_Antiques_Uncommon",
        "weight": 5
      },
      {
        "name": "HackingChips",
        "weight": 5,
        "maxResults": 1
      },
      {
        "name": "Container_GlowStick_Uncommon",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_repair_large_common",
    "name": "LootTable_Container_Repair_Large_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_MultitoolRepairCanister",
        "weight": 100
      },
      {
        "name": "Container_StockedToolRepairCanister",
        "weight": 100
      },
      {
        "name": "Container_MultitoolRepair",
        "weight": 20,
        "maxResults": 1
      },
      {
        "name": "Container_MultitoolTractor",
        "weight": 15,
        "maxResults": 1
      },
      {
        "name": "Container_Multitool_Common",
        "weight": 10,
        "maxResults": 1
      },
      {
        "name": "Container_Fuse",
        "weight": 5
      },
      {
        "name": "Container_StockedToolsRepair_Common",
        "weight": 2,
        "maxResults": 1
      },
      {
        "name": "Container_StockedToolsTractor_Common",
        "weight": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_repair_large_rare",
    "name": "LootTable_Container_Repair_Large_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_MultitoolRepairCanister",
        "weight": 100
      },
      {
        "name": "Container_StockedToolRepairCanister",
        "weight": 100
      },
      {
        "name": "Container_MultitoolRepair",
        "weight": 20,
        "maxResults": 1
      },
      {
        "name": "Container_MultitoolTractor",
        "weight": 15,
        "maxResults": 1
      },
      {
        "name": "Container_Multitool_Rare",
        "weight": 10,
        "maxResults": 1
      },
      {
        "name": "Container_Fuse",
        "weight": 5
      },
      {
        "name": "Container_StockedToolsRepair_Rare",
        "weight": 2,
        "maxResults": 1
      },
      {
        "name": "Container_StockedToolsTractor_Rare",
        "weight": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_repair_large_uncommon",
    "name": "LootTable_Container_Repair_Large_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_MultitoolRepairCanister",
        "weight": 100
      },
      {
        "name": "Container_StockedToolRepairCanister",
        "weight": 100
      },
      {
        "name": "Container_MultitoolRepair",
        "weight": 20,
        "maxResults": 1
      },
      {
        "name": "Container_MultitoolTractor",
        "weight": 15,
        "maxResults": 1
      },
      {
        "name": "Container_Multitool_Uncommon",
        "weight": 10,
        "maxResults": 1
      },
      {
        "name": "Container_Fuse",
        "weight": 5
      },
      {
        "name": "Container_StockedToolsRepair_Uncommon",
        "weight": 2,
        "maxResults": 1
      },
      {
        "name": "Container_StockedToolsTractor_Uncommon",
        "weight": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_repair_medium_common",
    "name": "LootTable_Container_Repair_Medium_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_MultitoolRepairCanister",
        "weight": 100
      },
      {
        "name": "Container_StockedToolRepairCanister",
        "weight": 100
      },
      {
        "name": "Container_MultitoolRepair",
        "weight": 20,
        "maxResults": 1
      },
      {
        "name": "Container_MultitoolTractor",
        "weight": 15,
        "maxResults": 1
      },
      {
        "name": "Container_Multitool_Common",
        "weight": 10,
        "maxResults": 1
      },
      {
        "name": "Container_Fuse",
        "weight": 5
      },
      {
        "name": "Container_StockedToolsRepair_Common",
        "weight": 2,
        "maxResults": 1
      },
      {
        "name": "Container_StockedToolsTractor_Common",
        "weight": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_repair_medium_rare",
    "name": "LootTable_Container_Repair_Medium_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_MultitoolRepairCanister",
        "weight": 100
      },
      {
        "name": "Container_StockedToolRepairCanister",
        "weight": 100
      },
      {
        "name": "Container_MultitoolRepair",
        "weight": 20,
        "maxResults": 1
      },
      {
        "name": "Container_MultitoolTractor",
        "weight": 15,
        "maxResults": 1
      },
      {
        "name": "Container_Multitool_Rare",
        "weight": 10,
        "maxResults": 1
      },
      {
        "name": "Container_Fuse",
        "weight": 5
      },
      {
        "name": "Container_StockedToolsRepair_Rare",
        "weight": 2,
        "maxResults": 1
      },
      {
        "name": "Container_StockedToolsTractor_Rare",
        "weight": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_repair_medium_uncommon",
    "name": "LootTable_Container_Repair_Medium_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_MultitoolRepairCanister",
        "weight": 100
      },
      {
        "name": "Container_StockedToolRepairCanister",
        "weight": 100
      },
      {
        "name": "Container_MultitoolRepair",
        "weight": 20,
        "maxResults": 1
      },
      {
        "name": "Container_MultitoolTractor",
        "weight": 15,
        "maxResults": 1
      },
      {
        "name": "Container_Multitool_Uncommon",
        "weight": 10,
        "maxResults": 1
      },
      {
        "name": "Container_Fuse",
        "weight": 5
      },
      {
        "name": "Container_StockedToolsRepair_Uncommon",
        "weight": 2,
        "maxResults": 1
      },
      {
        "name": "Container_StockedToolsTractor_Uncommon",
        "weight": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_repair_small_common",
    "name": "LootTable_Container_Repair_Small_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_MultitoolRepairCanister",
        "weight": 100
      },
      {
        "name": "Container_StockedToolRepairCanister",
        "weight": 100
      },
      {
        "name": "Container_MultitoolRepair",
        "weight": 20,
        "maxResults": 1
      },
      {
        "name": "Container_MultitoolTractor",
        "weight": 15,
        "maxResults": 1
      },
      {
        "name": "Container_Multitool_Common",
        "weight": 10,
        "maxResults": 1
      },
      {
        "name": "Container_Fuse",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_repair_small_rare",
    "name": "LootTable_Container_Repair_Small_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_MultitoolRepairCanister",
        "weight": 100
      },
      {
        "name": "Container_StockedToolRepairCanister",
        "weight": 100
      },
      {
        "name": "Container_MultitoolRepair",
        "weight": 20,
        "maxResults": 1
      },
      {
        "name": "Container_MultitoolTractor",
        "weight": 15,
        "maxResults": 1
      },
      {
        "name": "Container_Multitool_Rare",
        "weight": 10,
        "maxResults": 1
      },
      {
        "name": "Container_Fuse",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_repair_small_uncommon",
    "name": "LootTable_Container_Repair_Small_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_MultitoolRepairCanister",
        "weight": 100
      },
      {
        "name": "Container_StockedToolRepairCanister",
        "weight": 100
      },
      {
        "name": "Container_MultitoolRepair",
        "weight": 20,
        "maxResults": 1
      },
      {
        "name": "Container_MultitoolTractor",
        "weight": 15,
        "maxResults": 1
      },
      {
        "name": "Container_Multitool_Uncommon",
        "weight": 10,
        "maxResults": 1
      },
      {
        "name": "Container_Fuse",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_small_generic_common",
    "name": "LootTable_Container_Small_Generic_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Food_Common",
        "weight": 100
      },
      {
        "name": "Container_Small_Weapons_Ammo_Common",
        "weight": 75
      },
      {
        "name": "Container_Clothing_Common",
        "weight": 50
      },
      {
        "name": "Container_Medpens_Mixed",
        "weight": 25
      },
      {
        "name": "Container_MultitoolAttachments",
        "weight": 25
      },
      {
        "name": "Container_Antiques_Common",
        "weight": 10
      },
      {
        "name": "Container_MedicalMultitoolAmmo",
        "weight": 2
      },
      {
        "name": "Container_MedgunAmmo",
        "weight": 1.5
      },
      {
        "name": "Container_Multitool_Common",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Container_GlowStick_Common",
        "weight": 1
      },
      {
        "name": "Container_MiningModules",
        "weight": 1
      },
      {
        "name": "Container_Toys_Common",
        "weight": 10
      },
      {
        "name": "HackingChips",
        "weight": 0.5
      },
      {
        "name": "Container_MiningGadgets_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_small_generic_rare",
    "name": "LootTable_Container_Small_Generic_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Food_Common",
        "weight": 100
      },
      {
        "name": "Container_Small_Weapons_Ammo_Common",
        "weight": 75
      },
      {
        "name": "Container_Clothing_Rare",
        "weight": 50
      },
      {
        "name": "Container_Medpens_Mixed",
        "weight": 25
      },
      {
        "name": "Container_MultitoolAttachments",
        "weight": 25
      },
      {
        "name": "Container_Antiques_Rare",
        "weight": 10
      },
      {
        "name": "Container_MedicalMultitoolAmmo",
        "weight": 2
      },
      {
        "name": "Container_MedgunAmmo",
        "weight": 1.5
      },
      {
        "name": "Container_Multitool_Rare",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Container_GlowStick_Rare",
        "weight": 1
      },
      {
        "name": "Container_MiningModules",
        "weight": 1
      },
      {
        "name": "Container_Toys_Rare",
        "weight": 10
      },
      {
        "name": "HackingChips",
        "weight": 0.5
      },
      {
        "name": "Container_MiningGadgets_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_small_generic_uncommon",
    "name": "LootTable_Container_Small_Generic_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Food_Common",
        "weight": 100
      },
      {
        "name": "Container_Small_Weapons_Ammo_Common",
        "weight": 75
      },
      {
        "name": "Container_Clothing_Uncommon",
        "weight": 50
      },
      {
        "name": "Container_Medpens_Mixed",
        "weight": 25
      },
      {
        "name": "Container_MultitoolAttachments",
        "weight": 25
      },
      {
        "name": "Container_Antiques_Uncommon",
        "weight": 10
      },
      {
        "name": "Container_MedicalMultitoolAmmo",
        "weight": 2
      },
      {
        "name": "Container_MedgunAmmo",
        "weight": 1.5
      },
      {
        "name": "Container_Multitool_Common",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "Container_GlowStick_Uncommon",
        "weight": 1
      },
      {
        "name": "Container_MiningModules",
        "weight": 1
      },
      {
        "name": "Container_Toys_Uncommon",
        "weight": 10
      },
      {
        "name": "HackingChips",
        "weight": 0.5
      },
      {
        "name": "Container_MiningGadgets_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_small_medical_common",
    "name": "LootTable_Container_Small_Medical_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Medpen_Healing",
        "weight": 100,
        "minResults": 1,
        "maxResults": 2
      },
      {
        "name": "Container_Medpens_MixedMinusHealing",
        "weight": 100
      },
      {
        "name": "Container_MedicalMultitoolAmmo",
        "weight": 10
      },
      {
        "name": "Container_MedicalMultitool_Common",
        "weight": 10,
        "maxResults": 1
      },
      {
        "name": "Container_MedgunAmmo",
        "weight": 1
      },
      {
        "name": "Container_Medgun_Common",
        "weight": 0.1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_small_medical_common_stormbreaker",
    "name": "LootTable_Container_Small_Medical_Common_StormBreaker",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Medpen_Healing",
        "weight": 100,
        "minResults": 1,
        "maxResults": 2
      },
      {
        "name": "Container_Medpens_MixedMinusHealing_StormBreaker",
        "weight": 100
      },
      {
        "name": "Container_MedicalMultitoolAmmo",
        "weight": 10
      },
      {
        "name": "Container_MedicalMultitool_Common",
        "weight": 10,
        "maxResults": 1
      },
      {
        "name": "Container_MedgunAmmo",
        "weight": 1
      },
      {
        "name": "Container_Medgun_Common",
        "weight": 0.1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_small_medical_rare",
    "name": "LootTable_Container_Small_Medical_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Medpen_Healing",
        "weight": 100,
        "minResults": 1,
        "maxResults": 2
      },
      {
        "name": "Container_Medpens_MixedMinusHealing",
        "weight": 100
      },
      {
        "name": "Container_MedicalMultitoolAmmo",
        "weight": 10
      },
      {
        "name": "Container_MedicalMultitool_Rare",
        "weight": 10,
        "maxResults": 1
      },
      {
        "name": "Container_MedgunAmmo",
        "weight": 100,
        "minResults": 1
      },
      {
        "name": "Container_Medgun_Rare",
        "weight": 10,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_small_medical_rare_stormbreaker",
    "name": "LootTable_Container_Small_Medical_Rare_StormBreaker",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Medpen_Healing",
        "weight": 100,
        "minResults": 1,
        "maxResults": 2
      },
      {
        "name": "Container_Medpens_MixedMinusHealing_StormBreaker",
        "weight": 100
      },
      {
        "name": "Container_MedicalMultitoolAmmo",
        "weight": 10
      },
      {
        "name": "Container_MedicalMultitool_Rare",
        "weight": 10,
        "maxResults": 1
      },
      {
        "name": "Container_MedgunAmmo",
        "weight": 100,
        "minResults": 1
      },
      {
        "name": "Container_Medgun_Rare",
        "weight": 10,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_small_medical_uncommon",
    "name": "LootTable_Container_Small_Medical_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Medpen_Healing",
        "weight": 100,
        "minResults": 1,
        "maxResults": 2
      },
      {
        "name": "Container_Medpens_MixedMinusHealing",
        "weight": 100
      },
      {
        "name": "Container_MedicalMultitoolAmmo",
        "weight": 100
      },
      {
        "name": "Container_MedicalMultitool_Uncommon",
        "weight": 100,
        "maxResults": 1
      },
      {
        "name": "Container_MedgunAmmo",
        "weight": 10
      },
      {
        "name": "Container_Medgun_Uncommon",
        "weight": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_small_medical_uncommon_stormbreaker",
    "name": "LootTable_Container_Small_Medical_Uncommon_StormBreaker",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Medpen_Healing",
        "weight": 100,
        "minResults": 1,
        "maxResults": 2
      },
      {
        "name": "Container_Medpens_MixedMinusHealing_StormBreaker",
        "weight": 100
      },
      {
        "name": "Container_MedicalMultitoolAmmo",
        "weight": 100
      },
      {
        "name": "Container_MedicalMultitool_Uncommon",
        "weight": 100,
        "maxResults": 1
      },
      {
        "name": "Container_MedgunAmmo",
        "weight": 10
      },
      {
        "name": "Container_Medgun_Uncommon",
        "weight": 1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_undersuit_common",
    "name": "LootTable_Container_Undersuit_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Undersuit_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_undersuit_rare",
    "name": "LootTable_Container_Undersuit_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Undersuit_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_undersuit_uncommon",
    "name": "LootTable_Container_Undersuit_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Undersuit_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "loottable_container_weapons_large_common",
    "name": "LootTable_Container_Weapons_Large_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Large_Weapons_Common",
        "weight": 0.25
      },
      {
        "name": "Container_Large_Weapons_Ammo_Common",
        "weight": 1
      },
      {
        "name": "Container_Large_WeaponAttachments",
        "weight": 0.075,
        "maxResults": 3
      }
    ]
  },
  {
    "id": "loottable_container_weapons_large_rare",
    "name": "LootTable_Container_Weapons_Large_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Large_Weapons_Rare",
        "weight": 0.25
      },
      {
        "name": "Container_Large_Weapons_Ammo_Rare",
        "weight": 1
      },
      {
        "name": "Container_Large_WeaponAttachments",
        "weight": 0.075,
        "maxResults": 3
      }
    ]
  },
  {
    "id": "loottable_container_weapons_large_uncommon",
    "name": "LootTable_Container_Weapons_Large_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Large_Weapons_Uncommon",
        "weight": 0.25
      },
      {
        "name": "Container_Large_Weapons_Ammo_Uncommon",
        "weight": 1
      },
      {
        "name": "Container_Large_WeaponAttachments",
        "weight": 0.075,
        "maxResults": 3
      }
    ]
  },
  {
    "id": "loottable_container_weapons_medium_common",
    "name": "LootTable_Container_Weapons_Medium_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Medium_Weapons_Common",
        "weight": 0.25
      },
      {
        "name": "Container_Medium_Weapons_Ammo_Common",
        "weight": 1
      },
      {
        "name": "Container_Medium_WeaponAttachments",
        "weight": 0.075,
        "minResults": 2
      }
    ]
  },
  {
    "id": "loottable_container_weapons_medium_rare",
    "name": "LootTable_Container_Weapons_Medium_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Medium_Weapons_Rare",
        "weight": 0.25
      },
      {
        "name": "Container_Medium_Weapons_Ammo_Rare",
        "weight": 1
      },
      {
        "name": "Container_Medium_WeaponAttachments",
        "weight": 0.075,
        "minResults": 2
      }
    ]
  },
  {
    "id": "loottable_container_weapons_medium_uncommon",
    "name": "LootTable_Container_Weapons_Medium_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Medium_Weapons_Uncommon",
        "weight": 0.25
      },
      {
        "name": "Container_Medium_Weapons_Ammo_Uncommon",
        "weight": 1
      },
      {
        "name": "Container_Medium_WeaponAttachments",
        "weight": 0.075,
        "minResults": 2
      }
    ]
  },
  {
    "id": "loottable_container_weapons_small_common",
    "name": "LootTable_Container_Weapons_Small_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Small_Weapons_Common",
        "weight": 0.25,
        "maxResults": 1
      },
      {
        "name": "Container_Small_Weapons_Ammo_Common",
        "weight": 1
      },
      {
        "name": "Container_Small_WeaponAttachments",
        "weight": 0.075,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_weapons_small_common_ageddons",
    "name": "LootTable_Container_Weapons_Small_Common_Ageddons",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Container_Small_Weapons_Common",
        "weight": 0.25,
        "maxResults": 1
      },
      {
        "name": "Container_Small_Weapons_Ammo_Common",
        "weight": 1
      },
      {
        "name": "Container_Small_WeaponAttachments",
        "weight": 0.075,
        "maxResults": 1
      },
      {
        "name": "Container_Weapons_Ageddons",
        "weight": 0.078125,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_weapons_small_rare",
    "name": "LootTable_Container_Weapons_Small_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Small_Weapons_Rare",
        "weight": 0.25,
        "maxResults": 1
      },
      {
        "name": "Container_Small_Weapons_Ammo_Rare",
        "weight": 1
      },
      {
        "name": "Container_Small_WeaponAttachments",
        "weight": 0.075,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_weapons_small_rare_ageddons",
    "name": "LootTable_Container_Weapons_Small_Rare_Ageddons",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Container_Small_Weapons_Rare",
        "weight": 0.25,
        "maxResults": 1
      },
      {
        "name": "Container_Small_Weapons_Ammo_Rare",
        "weight": 1
      },
      {
        "name": "Container_Small_WeaponAttachments",
        "weight": 0.075,
        "maxResults": 1
      },
      {
        "name": "Container_Weapons_Ageddons",
        "weight": 0.3125
      }
    ]
  },
  {
    "id": "loottable_container_weapons_small_uncommon",
    "name": "LootTable_Container_Weapons_Small_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Small_Weapons_Uncommon",
        "weight": 0.25,
        "maxResults": 1
      },
      {
        "name": "Container_Small_Weapons_Ammo_Uncommon",
        "weight": 1
      },
      {
        "name": "Container_Small_WeaponAttachments",
        "weight": 0.075,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "loottable_container_weapons_small_uncommon_ageddons",
    "name": "LootTable_Container_Weapons_Small_Uncommon_Ageddons",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Container_Small_Weapons_Uncommon",
        "weight": 0.25,
        "maxResults": 1
      },
      {
        "name": "Container_Small_Weapons_Ammo_Uncommon",
        "weight": 1
      },
      {
        "name": "Container_Small_WeaponAttachments",
        "weight": 0.075,
        "maxResults": 1
      },
      {
        "name": "Container_Weapons_Ageddons",
        "weight": 0.3125
      }
    ]
  },
  {
    "id": "medical",
    "name": "Medical",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "DrugsCache_Medical",
        "weight": 0.5,
        "maxResults": 6
      },
      {
        "name": "MedicalWeapons_Refill",
        "weight": 0.4,
        "minResults": 1,
        "maxResults": 2
      },
      {
        "name": "MedicalMultitool_Refill",
        "weight": 0.7,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "military",
    "name": "Military",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Weapons_NoPistolsNoMelee_Common",
        "weight": 1
      },
      {
        "name": "ArmorCache_Common",
        "weight": 0.7
      },
      {
        "name": "WeaponsCache_UnCommon",
        "weight": 0.3
      },
      {
        "name": "ArmorCache_UnCommon",
        "weight": 0.1
      }
    ]
  },
  {
    "id": "miningderelict",
    "name": "MiningDerelict",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Minerals_Derelict_Uncommon",
        "weight": 0.8
      },
      {
        "name": "Minerals_Derelict_Rare",
        "weight": 0.5
      },
      {
        "name": "Minerals_Derelict_Epic",
        "weight": 0.3
      },
      {
        "name": "Tools_Common",
        "weight": 0.8
      },
      {
        "name": "Tools_Rare",
        "weight": 0.3
      },
      {
        "name": "Tools_TractorBeam",
        "weight": 0.5
      },
      {
        "name": "Weapons_Melee",
        "weight": 0.4,
        "maxResults": 2
      }
    ]
  },
  {
    "id": "prison_loot",
    "name": "Prison_Loot",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "PrisonMineables",
        "weight": 1
      },
      {
        "name": "Prison_Misc",
        "weight": 1,
        "maxResults": 2
      },
      {
        "name": "Prison_Chip",
        "weight": 0.01,
        "maxResults": 1
      },
      {
        "name": "Prison_Knife",
        "weight": 0.02,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "prison_stash",
    "name": "Prison_Stash",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Prison_Stash",
        "weight": 1
      },
      {
        "name": "Prison_Chip",
        "weight": 0.05,
        "maxResults": 1
      },
      {
        "name": "Prison_Knife",
        "weight": 0.1,
        "maxResults": 1
      }
    ]
  },
  {
    "id": "salvage",
    "name": "Salvage",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Salvage",
        "weight": 0.8,
        "maxResults": 6
      },
      {
        "name": "HarvestableCache_Common",
        "weight": 0.7
      },
      {
        "name": "Glowsticks",
        "weight": 0.6,
        "maxResults": 3
      },
      {
        "name": "DrinksCache_Common",
        "weight": 0.5
      },
      {
        "name": "FoodCache_Common",
        "weight": 0.5
      },
      {
        "name": "Tools_Common",
        "weight": 0.3,
        "maxResults": 2
      }
    ]
  },
  {
    "id": "scrap",
    "name": "Scrap",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Salvage",
        "weight": 0.8,
        "maxResults": 6
      },
      {
        "name": "Glowsticks",
        "weight": 0.1,
        "maxResults": 2
      }
    ]
  },
  {
    "id": "securityoutpost_loot",
    "name": "SecurityOutpost_Loot",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "SecurityOutpost_GrenadeLauncherCache",
        "weight": 1,
        "maxResults": 1
      },
      {
        "name": "SecurityOutpost_HeavyWeaponCache",
        "weight": 0.5,
        "maxResults": 2
      },
      {
        "name": "ArmorCache_Rare",
        "weight": 0.25,
        "maxResults": 2
      },
      {
        "name": "ArmorCache_UnCommon",
        "weight": 1,
        "maxResults": 3
      }
    ]
  },
  {
    "id": "survival",
    "name": "Survival",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "DrinksCache_Common",
        "weight": 0.6
      },
      {
        "name": "FoodCache_Common",
        "weight": 0.6
      },
      {
        "name": "Glowsticks",
        "weight": 0.7,
        "maxResults": 3
      },
      {
        "name": "Tools_Common",
        "weight": 0.5,
        "maxResults": 2
      },
      {
        "name": "Tools_Rare",
        "weight": 0.2,
        "maxResults": 1
      },
      {
        "name": "HarvestableCache_Common",
        "weight": 0.8
      },
      {
        "name": "MineablesCache_Common",
        "weight": 0.4,
        "minResults": 1,
        "maxResults": 4
      }
    ]
  },
  {
    "id": "tools",
    "name": "Tools",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Tools_Common",
        "weight": 1,
        "maxResults": 3
      },
      {
        "name": "HackingChips",
        "weight": 0.5,
        "maxResults": 2
      },
      {
        "name": "Weapons_Melee",
        "weight": 0.4,
        "maxResults": 2
      }
    ]
  },
  {
    "id": "v3loottable_actor_largeammo",
    "name": "V3LootTable_Actor_LargeAmmo",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Ammo",
        "weight": 10
      },
      {
        "name": "Medpens",
        "weight": 1
      }
    ]
  },
  {
    "id": "v3loottable_actor_largeammo_rockcracker_boss",
    "name": "V3LootTable_Actor_LargeAmmo_RockCracker_Boss",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Ammo",
        "weight": 10
      },
      {
        "name": "Medpens",
        "weight": 1
      },
      {
        "name": "Keycard",
        "weight": 100,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_actor_prisoner",
    "name": "V3LootTable_Actor_Prisoner",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Minables",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Pens",
        "weight": 1,
        "chanceToExist": 0.75,
        "choiceLimit": 1
      },
      {
        "name": "Sustenance",
        "weight": 1,
        "choiceLimit": 1,
        "dupeLimit": 1
      },
      {
        "name": "Shiv",
        "weight": 1,
        "chanceToExist": 0.1,
        "choiceLimit": 1
      },
      {
        "name": "Hacking chip",
        "weight": 1,
        "chanceToExist": 0.05,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_armour_large",
    "name": "V3LootTable_Armour_Large",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Undersuit",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Undersuit helmet",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Light helmet",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Light arms",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Light core",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Light legs",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Light backpack",
        "weight": 0.125,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 10",
        "weight": 10,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 7.5",
        "weight": 7.5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 5",
        "weight": 5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 2.5",
        "weight": 2.5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 1",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Medium helmet",
        "weight": 10,
        "choiceLimit": 1
      },
      {
        "name": "Medium arms",
        "weight": 10,
        "choiceLimit": 1
      },
      {
        "name": "Medium core",
        "weight": 10,
        "choiceLimit": 1
      },
      {
        "name": "Medium legs",
        "weight": 10,
        "choiceLimit": 1
      },
      {
        "name": "Medium Backpack",
        "weight": 1.25,
        "choiceLimit": 1
      },
      {
        "name": "Heavy helmet",
        "weight": 100,
        "choiceLimit": 1
      },
      {
        "name": "Heavy arms",
        "weight": 100,
        "choiceLimit": 1
      },
      {
        "name": "Heavy core",
        "weight": 100,
        "choiceLimit": 1
      },
      {
        "name": "Heavy legs",
        "weight": 100,
        "choiceLimit": 1
      },
      {
        "name": "Heavy backpack",
        "weight": 12.5,
        "choiceLimit": 1
      },
      {
        "name": "Full suit",
        "weight": 12.5,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_armour_medium",
    "name": "V3LootTable_Armour_Medium",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Undersuit",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Undersuit helmet",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Light helmet",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Light arms",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Light core",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Light legs",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Light backpack",
        "weight": 0.125,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 10",
        "weight": 10,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 7.5",
        "weight": 7.5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 5",
        "weight": 5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 2.5",
        "weight": 2.5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 1",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Medium helmet",
        "weight": 10,
        "choiceLimit": 1
      },
      {
        "name": "Medium arms",
        "weight": 10,
        "choiceLimit": 1
      },
      {
        "name": "Medium core",
        "weight": 10,
        "choiceLimit": 1
      },
      {
        "name": "Medium legs",
        "weight": 10,
        "choiceLimit": 1
      },
      {
        "name": "Medium Backpack",
        "weight": 1.25,
        "choiceLimit": 1
      },
      {
        "name": "Heavy helmet",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Heavy arms",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Heavy core",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Heavy legs",
        "weight": 1,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_armour_small",
    "name": "V3LootTable_Armour_Small",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Undersuit",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Undersuit helmet",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Light helmet",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Light arms",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Light core",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Light legs",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Light backpack",
        "weight": 0.125,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 10",
        "weight": 10,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 7.5",
        "weight": 7.5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 5",
        "weight": 5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 2.5",
        "weight": 2.5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 1",
        "weight": 1,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_event_arms",
    "name": "V3LootTable_Event_Arms",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Arms",
        "weight": 1,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_event_backpack",
    "name": "V3LootTable_Event_Backpack",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Backpack",
        "weight": 1,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_event_core",
    "name": "V3LootTable_Event_Core",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Core/Fullsuit",
        "weight": 1,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_event_fullarmour",
    "name": "V3LootTable_Event_FullArmour",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Random piece",
        "weight": 1,
        "choiceLimit": 3
      }
    ]
  },
  {
    "id": "v3loottable_event_helmet",
    "name": "V3LootTable_Event_Helmet",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Helmet",
        "weight": 1,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_event_legs",
    "name": "V3LootTable_Event_Legs",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Legs",
        "weight": 1,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_food_small",
    "name": "V3LootTable_Food_Small",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Sustenance",
        "weight": 0.25
      }
    ]
  },
  {
    "id": "v3loottable_generic_large",
    "name": "V3LootTable_Generic_Large",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Food",
        "weight": 50,
        "choiceLimit": 2
      },
      {
        "name": "Drink",
        "weight": 50,
        "choiceLimit": 2
      },
      {
        "name": "Large ammo",
        "weight": 75,
        "dupeLimit": 1
      },
      {
        "name": "Clothing",
        "weight": 50,
        "dupeLimit": 1
      },
      {
        "name": "Medpens Mixed",
        "weight": 25,
        "choiceLimit": 3
      },
      {
        "name": "Multitiool attachments",
        "weight": 25,
        "choiceLimit": 1
      },
      {
        "name": "Antiques",
        "weight": 10,
        "dupeLimit": 1
      },
      {
        "name": "Glowstick",
        "weight": 10
      },
      {
        "name": "Binoculars",
        "weight": 1
      },
      {
        "name": "Multitool",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Mining modules",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Mining gadgets",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Hacking chip",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 10",
        "weight": 10,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 7.5",
        "weight": 7.5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 5",
        "weight": 5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 2.5",
        "weight": 2.5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 1",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Undersuits",
        "weight": 5,
        "choiceLimit": 1
      },
      {
        "name": "Stocked tool",
        "weight": 1,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_generic_medium",
    "name": "V3LootTable_Generic_Medium",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Food",
        "weight": 50,
        "choiceLimit": 1
      },
      {
        "name": "Drink",
        "weight": 50,
        "choiceLimit": 2
      },
      {
        "name": "Medium ammo",
        "weight": 75,
        "dupeLimit": 1
      },
      {
        "name": "Clothing",
        "weight": 50,
        "dupeLimit": 1
      },
      {
        "name": "Medpens Mixed",
        "weight": 25,
        "choiceLimit": 3
      },
      {
        "name": "Multitiool attachments",
        "weight": 25,
        "choiceLimit": 1
      },
      {
        "name": "Antiques",
        "weight": 10,
        "dupeLimit": 1
      },
      {
        "name": "Glowstick",
        "weight": 10
      },
      {
        "name": "Binoculars",
        "weight": 1
      },
      {
        "name": "Multitool",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Mining modules",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Mining gadgets",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Hacking chip",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 10",
        "weight": 10,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 7.5",
        "weight": 7.5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 5",
        "weight": 5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 2.5",
        "weight": 2.5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 1",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Undersuits",
        "weight": 5,
        "choiceLimit": 1
      },
      {
        "name": "Stocked tool",
        "weight": 1,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_generic_small",
    "name": "V3LootTable_Generic_Small",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Food",
        "weight": 50,
        "choiceLimit": 1
      },
      {
        "name": "Drink",
        "weight": 50,
        "choiceLimit": 1
      },
      {
        "name": "Small ammo",
        "weight": 75,
        "dupeLimit": 1
      },
      {
        "name": "Clothing",
        "weight": 50,
        "dupeLimit": 1
      },
      {
        "name": "Medpens Mixed",
        "weight": 25,
        "choiceLimit": 3
      },
      {
        "name": "Multitiool attachments",
        "weight": 25,
        "choiceLimit": 1
      },
      {
        "name": "Antiques",
        "weight": 10,
        "dupeLimit": 1
      },
      {
        "name": "Glowstick",
        "weight": 10
      },
      {
        "name": "Binoculars",
        "weight": 1
      },
      {
        "name": "Multitool",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Mining modules",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Mining gadgets",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Hacking chip",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 10",
        "weight": 10,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 7.5",
        "weight": 7.5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 5",
        "weight": 5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 2.5",
        "weight": 2.5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 1",
        "weight": 1,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_harvestables",
    "name": "V3LootTable_Harvestables",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Harvestables",
        "weight": 1
      }
    ]
  },
  {
    "id": "v3loottable_harvestables_asddelving",
    "name": "V3LootTable_Harvestables_ASDDelving",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Harvestables",
        "weight": 100
      },
      {
        "name": "ASD specimin vial",
        "weight": 0.1,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_kaboos_corpse",
    "name": "V3LootTable_Kaboos_Corpse",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Carryable_1H_CY_armor_vanduul_1",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Knife",
        "weight": 1,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_medical_common",
    "name": "V3LootTable_Medical_Common",
    "locationType": "general",
    "rarity": "common",
    "entries": [
      {
        "name": "Medpen healing",
        "weight": 100,
        "choiceLimit": 5
      },
      {
        "name": "Medpen mixed minus healing",
        "weight": 100,
        "choiceLimit": 5
      },
      {
        "name": "Medical multitool ammo",
        "weight": 50,
        "choiceLimit": 3
      },
      {
        "name": "Medgun ammo",
        "weight": 10,
        "choiceLimit": 3
      },
      {
        "name": "Medical multitiool",
        "weight": 10,
        "choiceLimit": 1
      },
      {
        "name": "Multitool",
        "weight": 1
      },
      {
        "name": "Medgun",
        "weight": 0.1,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_medical_rare",
    "name": "V3LootTable_Medical_Rare",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "Medpen healing",
        "weight": 100,
        "choiceLimit": 5
      },
      {
        "name": "Medpen mixed minus healing",
        "weight": 100,
        "choiceLimit": 5
      },
      {
        "name": "Medical multitool ammo",
        "weight": 50,
        "choiceLimit": 3
      },
      {
        "name": "Medgun ammo",
        "weight": 10,
        "choiceLimit": 3
      },
      {
        "name": "Medical multitiool",
        "weight": 10,
        "choiceLimit": 1
      },
      {
        "name": "Multitool",
        "weight": 1
      },
      {
        "name": "Medgun",
        "weight": 10,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_medical_uncommon",
    "name": "V3LootTable_Medical_Uncommon",
    "locationType": "general",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Medpen healing",
        "weight": 100,
        "choiceLimit": 5
      },
      {
        "name": "Medpen mixed minus healing",
        "weight": 100,
        "choiceLimit": 5
      },
      {
        "name": "Medical multitool ammo",
        "weight": 50,
        "choiceLimit": 3
      },
      {
        "name": "Medgun ammo",
        "weight": 10,
        "choiceLimit": 3
      },
      {
        "name": "Medical multitiool",
        "weight": 50,
        "choiceLimit": 1
      },
      {
        "name": "Multitool",
        "weight": 10
      },
      {
        "name": "Medgun",
        "weight": 1,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_mining",
    "name": "V3LootTable_Mining",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Gems",
        "weight": 10,
        "choiceLimit": 8
      },
      {
        "name": "Multitool mining attachment",
        "weight": 100,
        "choiceLimit": 1
      },
      {
        "name": "Multitool",
        "weight": 10,
        "choiceLimit": 1
      },
      {
        "name": "Mining gadgets",
        "weight": 0.1,
        "chanceToExist": 0.5,
        "choiceLimit": 1
      },
      {
        "name": "Mining modules",
        "weight": 0.1,
        "chanceToExist": 0.5,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_personal",
    "name": "V3LootTable_Personal",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Small ammo",
        "weight": 75,
        "dupeLimit": 1
      },
      {
        "name": "Food",
        "weight": 50,
        "choiceLimit": 1
      },
      {
        "name": "Drink",
        "weight": 50,
        "choiceLimit": 1
      },
      {
        "name": "Clothing",
        "weight": 50,
        "dupeLimit": 1
      },
      {
        "name": "Medpens Mixed",
        "weight": 25,
        "choiceLimit": 3
      },
      {
        "name": "Antiques",
        "weight": 10,
        "dupeLimit": 1
      },
      {
        "name": "Toys",
        "weight": 10,
        "dupeLimit": 1
      },
      {
        "name": "Undersuits",
        "weight": 5,
        "choiceLimit": 1
      },
      {
        "name": "Undersuit helmets",
        "weight": 5,
        "choiceLimit": 1
      },
      {
        "name": "Hacking chip",
        "weight": 5
      },
      {
        "name": "Binoculars",
        "weight": 1
      },
      {
        "name": "Glowstick",
        "weight": 1
      },
      {
        "name": "Mission item 10",
        "weight": 10,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 7.5",
        "weight": 7.5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 5",
        "weight": 5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 2.5",
        "weight": 2.5,
        "choiceLimit": 1
      },
      {
        "name": "Mission item 1",
        "weight": 1,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_repair_medium",
    "name": "V3LootTable_Repair_Medium",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Multitool salvage canister",
        "weight": 100
      },
      {
        "name": "Stocked salvage canister",
        "weight": 100
      },
      {
        "name": "Multitool salvage attachment",
        "weight": 15,
        "choiceLimit": 1
      },
      {
        "name": "Multitool",
        "weight": 100,
        "choiceLimit": 1
      },
      {
        "name": "Fuse",
        "weight": 10
      },
      {
        "name": "Stocked salvage gadget ",
        "weight": 1,
        "choiceLimit": 1
      },
      {
        "name": "Stocked tractor gadget",
        "weight": 1,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_repair_small",
    "name": "V3LootTable_Repair_Small",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Multitool salvage canister",
        "weight": 100
      },
      {
        "name": "Stocked salvage canister",
        "weight": 100
      },
      {
        "name": "Multitool salvage attachment",
        "weight": 15,
        "choiceLimit": 1
      },
      {
        "name": "Multitool",
        "weight": 100,
        "choiceLimit": 1
      },
      {
        "name": "Fuse",
        "weight": 10
      }
    ]
  },
  {
    "id": "v3loottable_weapons_large",
    "name": "V3LootTable_Weapons_Large",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Large ammo",
        "weight": 1,
        "dupeLimit": 1
      },
      {
        "name": "Large weapons",
        "weight": 0.15,
        "choiceLimit": 1
      },
      {
        "name": "Large attachments",
        "weight": 0.1,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_weapons_medium",
    "name": "V3LootTable_Weapons_Medium",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Medium ammo",
        "weight": 1,
        "dupeLimit": 1
      },
      {
        "name": "Medium weapons",
        "weight": 0.2,
        "choiceLimit": 1
      },
      {
        "name": "Medium attachments",
        "weight": 0.1,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "v3loottable_weapons_small",
    "name": "V3LootTable_Weapons_Small",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "Small ammo",
        "weight": 1,
        "dupeLimit": 1
      },
      {
        "name": "Small weapons",
        "weight": 0.25,
        "choiceLimit": 1
      },
      {
        "name": "Small attachments",
        "weight": 0.1,
        "choiceLimit": 1
      }
    ]
  },
  {
    "id": "weapons",
    "name": "Weapons",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "WeaponsCache_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "weapons_andrandomloot",
    "name": "Weapons_AndRandomLoot",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "WeaponsCache_Common",
        "weight": 3
      },
      {
        "name": "RandomLoot_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "weapons_highchance_sniper",
    "name": "Weapons_HighChance_Sniper",
    "locationType": "general",
    "rarity": "mixed",
    "entries": [
      {
        "name": "SniperCache_Common",
        "weight": 0.8,
        "minResults": 1
      },
      {
        "name": "WeaponsCache_Common",
        "weight": 0.7
      },
      {
        "name": "WeaponsCache_Rare",
        "weight": 0.35
      }
    ]
  },
  {
    "id": "weapons_withrarechance",
    "name": "Weapons_WithRareChance",
    "locationType": "general",
    "rarity": "rare",
    "entries": [
      {
        "name": "WeaponsCache_Common",
        "weight": 0.5
      },
      {
        "name": "WeaponsCache_UnCommon",
        "weight": 0.4
      },
      {
        "name": "WeaponsCache_Rare",
        "weight": 0.6,
        "minResults": 1
      }
    ]
  },
  {
    "id": "ugf_common",
    "name": "UGF_Common",
    "locationType": "ugf",
    "rarity": "common",
    "entries": [
      {
        "name": "HarvestableCache_Common",
        "weight": 0.7
      },
      {
        "name": "FoodCache_Common",
        "weight": 0.1
      },
      {
        "name": "DrinksCache_Common",
        "weight": 0.2
      },
      {
        "name": "Tools_TractorBeam",
        "weight": 0.5,
        "minResults": 2,
        "maxResults": 2
      },
      {
        "name": "DrugsCache_Medical",
        "weight": 0.6
      },
      {
        "name": "Glowsticks",
        "weight": 0.3
      },
      {
        "name": "Attachments_Common",
        "weight": 0.2
      }
    ]
  },
  {
    "id": "ugf_rare",
    "name": "UGF_Rare",
    "locationType": "ugf",
    "rarity": "rare",
    "entries": [
      {
        "name": "WeaponsCache_Rare",
        "weight": 1
      },
      {
        "name": "ArmorCache_Rare",
        "weight": 1
      },
      {
        "name": "Weapons_NoPistolsNoMelee_Common",
        "weight": 1
      }
    ]
  },
  {
    "id": "ugf_uncommon",
    "name": "UGF_Uncommon",
    "locationType": "ugf",
    "rarity": "uncommon",
    "entries": [
      {
        "name": "Tools_TractorBeam",
        "weight": 1,
        "minResults": 2,
        "maxResults": 2
      },
      {
        "name": "FoodCache_Common",
        "weight": 0.2
      },
      {
        "name": "DrinksCache_Common",
        "weight": 0.5
      },
      {
        "name": "DrugsCache_Medical",
        "weight": 0.3
      },
      {
        "name": "Attachments_UnCommon",
        "weight": 0.8
      },
      {
        "name": "ArmorCache_UnCommon",
        "weight": 0.7
      }
    ]
  }
];

export const specialEvents: SpecialEvent[] = [
  {
    "name": "ChristmasEvent",
    "probabilityPerContainer": 0.033,
    "minEntries": 1,
    "maxEntries": 3
  },
  {
    "name": "HalloweenEvent",
    "probabilityPerContainer": 0.05,
    "minEntries": 1,
    "maxEntries": 1
  },
  {
    "name": "Darkwater",
    "probabilityPerContainer": 0.03,
    "minEntries": 1,
    "maxEntries": 1
  },
  {
    "name": "DarkwaterHalloweenEvent",
    "probabilityPerContainer": 0.05,
    "minEntries": 1,
    "maxEntries": 1
  },
  {
    "name": "DarkwaterChristmasEvent",
    "probabilityPerContainer": 0.033,
    "minEntries": 1,
    "maxEntries": 3
  }
];
