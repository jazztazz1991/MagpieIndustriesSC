// Auto-generated from DataForge extraction — sc-alpha-4.7.0-4.7.175.49567
// Run: npm run sync:generate

export interface AmmoDamage {
  physical: number;
  energy: number;
  distortion: number;
  thermal: number;
  biochemical: number;
  stun: number;
}

export interface AmmoType {
  id: string;
  name: string;
  category: "fps" | "vehicle";
  speed: number;
  lifetime: number;
  damage: AmmoDamage;
  damageDropMinDistance?: { physical: number; energy: number };
  damageDropPerMeter?: { physical: number; energy: number };
}

export const ammoTypes: AmmoType[] = [
  {
    "id": "12g_ballistic_1",
    "name": "12g Ballistic 1",
    "category": "fps",
    "speed": 300,
    "lifetime": 2,
    "damage": {
      "physical": 2,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 14,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.1,
      "energy": 0
    }
  },
  {
    "id": "apar_special_ballistic_01_ammo_20mm",
    "name": "Apar Special Ballistic 01 Ammo 20mm",
    "category": "fps",
    "speed": 50,
    "lifetime": 4,
    "damage": {
      "physical": 10,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "behr_glauncher_ballistic_ammo_01_40mm",
    "name": "Behr Glauncher Ballistic Ammo 01 40mm",
    "category": "fps",
    "speed": 50,
    "lifetime": 4,
    "damage": {
      "physical": 12.5,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "behr_lmg_ballistic_01_ammo_5mm",
    "name": "Behr Lmg Ballistic 01 Ammo 5mm",
    "category": "fps",
    "speed": 600,
    "lifetime": 2,
    "damage": {
      "physical": 14.5,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 50,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.0137,
      "energy": 0
    }
  },
  {
    "id": "behr_pistol_ballistic_01_ammo_10mm",
    "name": "Behr Pistol Ballistic 01 Ammo 10mm",
    "category": "fps",
    "speed": 500,
    "lifetime": 1.9,
    "damage": {
      "physical": 22.5,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 20,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.25,
      "energy": 0
    }
  },
  {
    "id": "behr_rifle_ballistic_01_ammo_5mm",
    "name": "Behr Rifle Ballistic 01 Ammo 5mm",
    "category": "fps",
    "speed": 550,
    "lifetime": 2,
    "damage": {
      "physical": 12,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 40,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.05,
      "energy": 0
    }
  },
  {
    "id": "behr_rifle_ballistic_02_ammo_7mm",
    "name": "Behr Rifle Ballistic 02 Ammo 7mm",
    "category": "fps",
    "speed": 600,
    "lifetime": 2,
    "damage": {
      "physical": 18,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 50,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.1,
      "energy": 0
    }
  },
  {
    "id": "behr_rifle_ballistic_02_ammo_civilian",
    "name": "Behr Rifle Ballistic 02 Ammo Civilian",
    "category": "fps",
    "speed": 1150,
    "lifetime": 2,
    "damage": {
      "physical": 45,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 50,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.1,
      "energy": 0
    }
  },
  {
    "id": "behr_shotgun_ballistic_01_ammo_12g",
    "name": "Behr Shotgun Ballistic 01 Ammo 12g",
    "category": "fps",
    "speed": 225,
    "lifetime": 2,
    "damage": {
      "physical": 11,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 12,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.05,
      "energy": 0
    }
  },
  {
    "id": "behr_smg_ballistic_01_ammo_10mm",
    "name": "Behr Smg Ballistic 01 Ammo 10mm",
    "category": "fps",
    "speed": 500,
    "lifetime": 1.9,
    "damage": {
      "physical": 13.75,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 15,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.06,
      "energy": 0
    }
  },
  {
    "id": "behr_sniper_ballistic_01_ammo_50cal",
    "name": "Behr Sniper Ballistic 01 Ammo 50cal",
    "category": "fps",
    "speed": 725,
    "lifetime": 2,
    "damage": {
      "physical": 100,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 550,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 10,
      "energy": 0
    }
  },
  {
    "id": "glsn_shotgun_ballistic_01_ammo_12g",
    "name": "Glsn Shotgun Ballistic 01 Ammo 12g",
    "category": "fps",
    "speed": 300,
    "lifetime": 2,
    "damage": {
      "physical": 2.35,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 12,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.15,
      "energy": 0
    }
  },
  {
    "id": "gmni_lmg_ballistic_01_ammo_5mm",
    "name": "Gmni Lmg Ballistic 01 Ammo 5mm",
    "category": "fps",
    "speed": 550,
    "lifetime": 2,
    "damage": {
      "physical": 10,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 30,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.0137,
      "energy": 0
    }
  },
  {
    "id": "gmni_pistol_ballistic_01_ammo_10mm",
    "name": "Gmni Pistol Ballistic 01 Ammo 10mm",
    "category": "fps",
    "speed": 500,
    "lifetime": 1.9,
    "damage": {
      "physical": 13,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 20,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.1,
      "energy": 0
    }
  },
  {
    "id": "gmni_rifle_ballistic_01_ammo_7mm",
    "name": "Gmni Rifle Ballistic 01 Ammo 7mm",
    "category": "fps",
    "speed": 1200,
    "lifetime": 2,
    "damage": {
      "physical": 21.5,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 100,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.1,
      "energy": 0
    }
  },
  {
    "id": "gmni_shotgun_ballistic_01_ammo_12g",
    "name": "Gmni Shotgun Ballistic 01 Ammo 12g",
    "category": "fps",
    "speed": 225,
    "lifetime": 2,
    "damage": {
      "physical": 4,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 12,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.05,
      "energy": 0
    }
  },
  {
    "id": "gmni_smg_ballistic_01_ammo_10mm",
    "name": "Gmni Smg Ballistic 01 Ammo 10mm",
    "category": "fps",
    "speed": 500,
    "lifetime": 1.9,
    "damage": {
      "physical": 11.5,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 15,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.2,
      "energy": 0
    }
  },
  {
    "id": "gmni_sniper_ballistic_01_ammo_7mm",
    "name": "Gmni Sniper Ballistic 01 Ammo 7mm",
    "category": "fps",
    "speed": 800,
    "lifetime": 2,
    "damage": {
      "physical": 42.5,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 150,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.02,
      "energy": 0
    }
  },
  {
    "id": "hdgw_pistol_ballistic_01_ammo_50cal",
    "name": "Hdgw Pistol Ballistic 01 Ammo 50cal",
    "category": "fps",
    "speed": 550,
    "lifetime": 2,
    "damage": {
      "physical": 45,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 30,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.08,
      "energy": 0
    }
  },
  {
    "id": "kegr_FE_Igniter_thermal_01_ammo_thermal",
    "name": "Kegr FE Igniter Thermal 01 Ammo Thermal",
    "category": "fps",
    "speed": 600,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 0,
      "distortion": 0,
      "thermal": 18,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "klwe_lmg_energy_01_ammo_laser",
    "name": "Klwe Lmg Energy 01 Ammo Laser",
    "category": "fps",
    "speed": 600,
    "lifetime": 4,
    "damage": {
      "physical": 0,
      "energy": 11.5,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "klwe_pistol_energy_01_ammo_laser",
    "name": "Klwe Pistol Energy 01 Ammo Laser",
    "category": "fps",
    "speed": 600,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 18,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "klwe_rifle_energy_01_ammo_laser",
    "name": "Klwe Rifle Energy 01 Ammo Laser",
    "category": "fps",
    "speed": 1200,
    "lifetime": 4,
    "damage": {
      "physical": 0,
      "energy": 21,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "klwe_smg_energy_01_ammo_laser",
    "name": "Klwe Smg Energy 01 Ammo Laser",
    "category": "fps",
    "speed": 600,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 21,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "klwe_sniper_energy_01_ammo_laser",
    "name": "Klwe Sniper Energy 01 Ammo Laser",
    "category": "fps",
    "speed": 1000,
    "lifetime": 4,
    "damage": {
      "physical": 0,
      "energy": 50,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "ksar_pistol_ballistic_01_ammo_50cal",
    "name": "Ksar Pistol Ballistic 01 Ammo 50cal",
    "category": "fps",
    "speed": 550,
    "lifetime": 2,
    "damage": {
      "physical": 60,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 55,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.2,
      "energy": 0
    }
  },
  {
    "id": "ksar_rifle_energy_01_ammo_plasma",
    "name": "Ksar Rifle Energy 01 Ammo Plasma",
    "category": "fps",
    "speed": 600,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 17.5,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 0,
      "energy": 20
    },
    "damageDropPerMeter": {
      "physical": 0,
      "energy": 0.11
    }
  },
  {
    "id": "ksar_shotgun_ballistic_01_ammo_12g",
    "name": "Ksar Shotgun Ballistic 01 Ammo 12g",
    "category": "fps",
    "speed": 300,
    "lifetime": 2,
    "damage": {
      "physical": 6.5,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 12,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.05,
      "energy": 0
    }
  },
  {
    "id": "ksar_shotgun_energy_01_ammo_plasma",
    "name": "Ksar Shotgun Energy 01 Ammo Plasma",
    "category": "fps",
    "speed": 300,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 10,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 0,
      "energy": 14
    },
    "damageDropPerMeter": {
      "physical": 0,
      "energy": 0.1
    }
  },
  {
    "id": "ksar_smg_energy_01_ammo_laser",
    "name": "Ksar Smg Energy 01 Ammo Laser",
    "category": "fps",
    "speed": 600,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 13,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "ksar_sniper_ballistic_01_ammo_7mm",
    "name": "Ksar Sniper Ballistic 01 Ammo 7mm",
    "category": "fps",
    "speed": 875,
    "lifetime": 2,
    "damage": {
      "physical": 45,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 335,
      "energy": 0
    }
  },
  {
    "id": "lbco_pistol_energy_01_ammo_electron",
    "name": "Lbco Pistol Energy 01 Ammo Electron",
    "category": "fps",
    "speed": 500,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 32.5,
      "distortion": 7.5,
      "thermal": 0,
      "biochemical": 0,
      "stun": 1
    },
    "damageDropMinDistance": {
      "physical": 0,
      "energy": 20
    },
    "damageDropPerMeter": {
      "physical": 0,
      "energy": 0.1
    }
  },
  {
    "id": "lbco_sniper_energy_01_ammo_electron",
    "name": "Lbco Sniper Energy 01 Ammo Electron",
    "category": "fps",
    "speed": 500,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 120,
      "distortion": 35,
      "thermal": 0,
      "biochemical": 0,
      "stun": 10
    },
    "damageDropMinDistance": {
      "physical": 0,
      "energy": 350
    },
    "damageDropPerMeter": {
      "physical": 0,
      "energy": 0.01
    }
  },
  {
    "id": "none_lmg_ballistic_01_ammo_50cal",
    "name": "None Lmg Ballistic 01 Ammo 50cal",
    "category": "fps",
    "speed": 1050,
    "lifetime": 2,
    "damage": {
      "physical": 27,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 50,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.011,
      "energy": 0
    }
  },
  {
    "id": "none_pistol_ballistic_01_ammo_6g",
    "name": "None Pistol Ballistic 01 Ammo 6g",
    "category": "fps",
    "speed": 550,
    "lifetime": 2,
    "damage": {
      "physical": 12,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 10,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.2,
      "energy": 0
    }
  },
  {
    "id": "none_rifle_ballistic_01_ammo_7mm",
    "name": "None Rifle Ballistic 01 Ammo 7mm",
    "category": "fps",
    "speed": 875,
    "lifetime": 2,
    "damage": {
      "physical": 22,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 60,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.05,
      "energy": 0
    }
  },
  {
    "id": "None_Rifle_energy_01_ammo_laser",
    "name": "None Rifle Energy 01 Ammo Laser",
    "category": "fps",
    "speed": 875,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 19,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 60,
      "energy": 0
    }
  },
  {
    "id": "none_shotgun_ballistic_01_ammo_12g",
    "name": "None Shotgun Ballistic 01 Ammo 12g",
    "category": "fps",
    "speed": 300,
    "lifetime": 2,
    "damage": {
      "physical": 9,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 7,
      "energy": 0
    },
    "damageDropPerMeter": {
      "physical": 0.05,
      "energy": 0
    }
  },
  {
    "id": "None_special_ballistic_01_AMMO_FPS",
    "name": "None Special Ballistic 01 AMMO FPS",
    "category": "fps",
    "speed": 135,
    "lifetime": 16,
    "damage": {
      "physical": 25000,
      "energy": 25000,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 2000,
      "energy": 0
    }
  },
  {
    "id": "toy_pistol",
    "name": "Toy Pistol",
    "category": "fps",
    "speed": 20,
    "lifetime": 15,
    "damage": {
      "physical": 0,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "toy_pistol_ea_elim",
    "name": "Toy Pistol Ea Elim",
    "category": "fps",
    "speed": 15,
    "lifetime": 10,
    "damage": {
      "physical": 1200,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "vlk_spewgun_ballistic_01_ammo_special",
    "name": "Vlk Spewgun Ballistic 01 Ammo Special",
    "category": "fps",
    "speed": 550,
    "lifetime": 8,
    "damage": {
      "physical": 35,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "vlk_spewgun_ballistic_01_ammo_special_adult",
    "name": "Vlk Spewgun Ballistic 01 Ammo Special Adult",
    "category": "fps",
    "speed": 70,
    "lifetime": 8,
    "damage": {
      "physical": 10,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "vlk_spewgun_ballistic_01_ammo_special_ice",
    "name": "Vlk Spewgun Ballistic 01 Ammo Special Ice",
    "category": "fps",
    "speed": 300,
    "lifetime": 8,
    "damage": {
      "physical": 9,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "vlk_spewgun_ballistic_01_ammo_special_ice_adult",
    "name": "Vlk Spewgun Ballistic 01 Ammo Special Ice Adult",
    "category": "fps",
    "speed": 70,
    "lifetime": 8,
    "damage": {
      "physical": 10,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "vlk_spewgun_ballistic_01_ammo_special_ice_juvenile",
    "name": "Vlk Spewgun Ballistic 01 Ammo Special Ice Juvenile",
    "category": "fps",
    "speed": 100,
    "lifetime": 8,
    "damage": {
      "physical": 35,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "vlk_spewgun_ballistic_01_ammo_special_irradiatated",
    "name": "Vlk Spewgun Ballistic 01 Ammo Special Irradiatated",
    "category": "fps",
    "speed": 300,
    "lifetime": 8,
    "damage": {
      "physical": 9,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "vlk_spewgun_ballistic_01_ammo_special_irradiatated_adult",
    "name": "Vlk Spewgun Ballistic 01 Ammo Special Irradiatated Adult",
    "category": "fps",
    "speed": 70,
    "lifetime": 8,
    "damage": {
      "physical": 0,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "vlk_spewgun_ballistic_01_ammo_special_irradiatated_juvi",
    "name": "Vlk Spewgun Ballistic 01 Ammo Special Irradiatated Juvi",
    "category": "fps",
    "speed": 70,
    "lifetime": 8,
    "damage": {
      "physical": 0,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "vlk_spewgun_ballistic_01_ammo_special_juvi",
    "name": "Vlk Spewgun Ballistic 01 Ammo Special Juvi",
    "category": "fps",
    "speed": 100,
    "lifetime": 8,
    "damage": {
      "physical": 35,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "vlk_spewgun_ballistic_01_ammo_special_vehicle",
    "name": "Vlk Spewgun Ballistic 01 Ammo Special Vehicle",
    "category": "fps",
    "speed": 550,
    "lifetime": 8,
    "damage": {
      "physical": 35,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "volt_lmg_energy_01_ammo_laser",
    "name": "Volt Lmg Energy 01 Ammo Laser",
    "category": "fps",
    "speed": 1100,
    "lifetime": 4,
    "damage": {
      "physical": 0,
      "energy": 9,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "volt_pistol_energy_01_ammo_laser",
    "name": "Volt Pistol Energy 01 Ammo Laser",
    "category": "fps",
    "speed": 600,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 11.75,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "volt_rifle_energy_01_ammo_electron",
    "name": "Volt Rifle Energy 01 Ammo Electron",
    "category": "fps",
    "speed": 600,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 13,
      "distortion": 5,
      "thermal": 0,
      "biochemical": 0,
      "stun": 3
    },
    "damageDropMinDistance": {
      "physical": 0,
      "energy": 200
    },
    "damageDropPerMeter": {
      "physical": 0,
      "energy": 0.01
    }
  },
  {
    "id": "volt_shotgun_energy_01_ammo_plasma",
    "name": "Volt Shotgun Energy 01 Ammo Plasma",
    "category": "fps",
    "speed": 300,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 5.75,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "volt_shotgun_energy_01_slug_ammo",
    "name": "Volt Shotgun Energy 01 Slug Ammo",
    "category": "fps",
    "speed": 300,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 50,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "volt_smg_energy_01_ammo_laser",
    "name": "Volt Smg Energy 01 Ammo Laser",
    "category": "fps",
    "speed": 600,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 5,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "volt_sniper_energy_01_ammo_electron",
    "name": "Volt Sniper Energy 01 Ammo Electron",
    "category": "fps",
    "speed": 700,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 42.5,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    },
    "damageDropMinDistance": {
      "physical": 0,
      "energy": 500
    }
  },
  {
    "id": "yormandi_ammo_special",
    "name": "Yormandi Ammo Special",
    "category": "fps",
    "speed": 300,
    "lifetime": 8,
    "damage": {
      "physical": 0,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "AMRS_AAgun_CC_S3_AMMO",
    "name": "AMRS AAgun CC S3 AMMO",
    "category": "vehicle",
    "speed": 800,
    "lifetime": 0.6,
    "damage": {
      "physical": 0,
      "energy": 52,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "AMRS_LaserCannon_S1_AMMO",
    "name": "AMRS LaserCannon S1 AMMO",
    "category": "vehicle",
    "speed": 1400,
    "lifetime": 1.43,
    "damage": {
      "physical": 0,
      "energy": 97.2,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "AMRS_LaserCannon_S2_AMMO",
    "name": "AMRS LaserCannon S2 AMMO",
    "category": "vehicle",
    "speed": 1400,
    "lifetime": 1.64,
    "damage": {
      "physical": 0,
      "energy": 145.8,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "AMRS_LaserCannon_S3_AMMO",
    "name": "AMRS LaserCannon S3 AMMO",
    "category": "vehicle",
    "speed": 1400,
    "lifetime": 1.86,
    "damage": {
      "physical": 0,
      "energy": 218.7,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "AMRS_LaserCannon_S4_AMMO",
    "name": "AMRS LaserCannon S4 AMMO",
    "category": "vehicle",
    "speed": 1344,
    "lifetime": 2.23,
    "damage": {
      "physical": 0,
      "energy": 327.888,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "AMRS_LaserCannon_S5_AMMO",
    "name": "AMRS LaserCannon S5 AMMO",
    "category": "vehicle",
    "speed": 1288,
    "lifetime": 2.57,
    "damage": {
      "physical": 0,
      "energy": 492.156,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "AMRS_LaserCannon_S6_AMMO",
    "name": "AMRS LaserCannon S6 AMMO",
    "category": "vehicle",
    "speed": 1232,
    "lifetime": 2.92,
    "damage": {
      "physical": 0,
      "energy": 738.396,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "AMRS_ScatterGun_S3_AMMO",
    "name": "AMRS ScatterGun S3 AMMO",
    "category": "vehicle",
    "speed": 1200,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 49.5,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "APAR_BallisticGatling_S4_AMMO",
    "name": "APAR BallisticGatling S4 AMMO",
    "category": "vehicle",
    "speed": 1200,
    "lifetime": 2.5,
    "damage": {
      "physical": 63.3,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "APAR_BallisticGatling_S6_AMMO",
    "name": "APAR BallisticGatling S6 AMMO",
    "category": "vehicle",
    "speed": 1200,
    "lifetime": 3,
    "damage": {
      "physical": 142.4,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "APAR_BallisticScatterGun_S1_AMMO",
    "name": "APAR BallisticScatterGun S1 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2,
    "damage": {
      "physical": 46.8,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "APAR_BallisticScatterGun_S1_Shark_AMMO",
    "name": "APAR BallisticScatterGun S1 Shark AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2,
    "damage": {
      "physical": 46.8,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "APAR_BallisticScatterGun_S2_AMMO",
    "name": "APAR BallisticScatterGun S2 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2,
    "damage": {
      "physical": 70,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "APAR_BallisticScatterGun_S2_Shark_AMMO",
    "name": "APAR BallisticScatterGun S2 Shark AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2,
    "damage": {
      "physical": 70,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "APAR_BallisticScatterGun_S3_AMMO",
    "name": "APAR BallisticScatterGun S3 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2,
    "damage": {
      "physical": 105,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "APAR_BallisticScatterGun_S3_Shark_AMMO",
    "name": "APAR BallisticScatterGun S3 Shark AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2,
    "damage": {
      "physical": 105,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "APAR_BallisticScatterGun_S6_AMMO",
    "name": "APAR BallisticScatterGun S6 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 7.5,
    "damage": {
      "physical": 355,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "APAR_MassDriver_S2_AMMO",
    "name": "APAR MassDriver S2 AMMO",
    "category": "vehicle",
    "speed": 5000,
    "lifetime": 1.1,
    "damage": {
      "physical": 525,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "apar_special_ballistic_02_ammo_rockets",
    "name": "Apar Special Ballistic 02 Ammo Rockets",
    "category": "vehicle",
    "speed": 700,
    "lifetime": 3,
    "damage": {
      "physical": 150,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "ASAD_DistortionRepeater_S1_AMMO",
    "name": "ASAD DistortionRepeater S1 AMMO",
    "category": "vehicle",
    "speed": 1300,
    "lifetime": 1.53868,
    "damage": {
      "physical": 0,
      "energy": 0,
      "distortion": 25.7,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "ASAD_DistortionRepeater_S2_AMMO",
    "name": "ASAD DistortionRepeater S2 AMMO",
    "category": "vehicle",
    "speed": 1300,
    "lifetime": 1.77002,
    "damage": {
      "physical": 0,
      "energy": 0,
      "distortion": 38.5,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "ASAD_DistortionRepeater_S3_AMMO",
    "name": "ASAD DistortionRepeater S3 AMMO",
    "category": "vehicle",
    "speed": 1300,
    "lifetime": 1.99598,
    "damage": {
      "physical": 0,
      "energy": 0.0001,
      "distortion": 57.9,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BANU_TachyonCannon_S1_AMMO",
    "name": "BANU TachyonCannon S1 AMMO",
    "category": "vehicle",
    "speed": 3000,
    "lifetime": 0.35,
    "damage": {
      "physical": 0,
      "energy": 202.5,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BANU_TachyonCannon_S2_AMMO",
    "name": "BANU TachyonCannon S2 AMMO",
    "category": "vehicle",
    "speed": 3000,
    "lifetime": 0.4,
    "damage": {
      "physical": 0,
      "energy": 472.5,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BANU_TachyonCannon_S3_AMMO",
    "name": "BANU TachyonCannon S3 AMMO",
    "category": "vehicle",
    "speed": 3000,
    "lifetime": 0.5,
    "damage": {
      "physical": 0,
      "energy": 1012.5,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_BallisticCannon_S4_AMMO",
    "name": "BEHR BallisticCannon S4 AMMO",
    "category": "vehicle",
    "speed": 900,
    "lifetime": 7.25,
    "damage": {
      "physical": 325,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_BallisticCannon_S7_AMMO",
    "name": "BEHR BallisticCannon S7 AMMO",
    "category": "vehicle",
    "speed": 756,
    "lifetime": 5.29,
    "damage": {
      "physical": 4500,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_BallisticCannon_S7_Idris_AMMO",
    "name": "BEHR BallisticCannon S7 Idris AMMO",
    "category": "vehicle",
    "speed": 850,
    "lifetime": 5.29,
    "damage": {
      "physical": 4000,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_BallisticCannon_VNG_S2_AMMO",
    "name": "BEHR BallisticCannon VNG S2 AMMO",
    "category": "vehicle",
    "speed": 1320,
    "lifetime": 1.75,
    "damage": {
      "physical": 162,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_BallisticGatling_Hornet_Bespoke_AMMO",
    "name": "BEHR BallisticGatling Hornet Bespoke AMMO",
    "category": "vehicle",
    "speed": 1050,
    "lifetime": 2.7,
    "damage": {
      "physical": 52.7,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_BallisticGatling_S4_AMMO",
    "name": "BEHR BallisticGatling S4 AMMO",
    "category": "vehicle",
    "speed": 900,
    "lifetime": 3.33,
    "damage": {
      "physical": 84.4,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_BallisticGatling_S5_AMMO",
    "name": "BEHR BallisticGatling S5 AMMO",
    "category": "vehicle",
    "speed": 900,
    "lifetime": 3.67,
    "damage": {
      "physical": 126.5,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_BallisticGatling_S6_AMMO",
    "name": "BEHR BallisticGatling S6 AMMO",
    "category": "vehicle",
    "speed": 900,
    "lifetime": 4,
    "damage": {
      "physical": 189.9,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_BallisticGatling_S7_AMMO",
    "name": "BEHR BallisticGatling S7 AMMO",
    "category": "vehicle",
    "speed": 900,
    "lifetime": 4.44,
    "damage": {
      "physical": 292,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_BallisticRepeater_S1_AMMO",
    "name": "BEHR BallisticRepeater S1 AMMO",
    "category": "vehicle",
    "speed": 1200,
    "lifetime": 1.67,
    "damage": {
      "physical": 36,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_BallisticRepeater_S2_AMMO",
    "name": "BEHR BallisticRepeater S2 AMMO",
    "category": "vehicle",
    "speed": 1200,
    "lifetime": 1.92,
    "damage": {
      "physical": 54,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_BallisticRepeater_S3_AMMO",
    "name": "BEHR BallisticRepeater S3 AMMO",
    "category": "vehicle",
    "speed": 1200,
    "lifetime": 2.17,
    "damage": {
      "physical": 81,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_BallisticRepeater_VNG_S2_AMMO",
    "name": "BEHR BallisticRepeater VNG S2 AMMO",
    "category": "vehicle",
    "speed": 1320,
    "lifetime": 1.75,
    "damage": {
      "physical": 54,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_DistortionCannon_VNG_S2_AMMO",
    "name": "BEHR DistortionCannon VNG S2 AMMO",
    "category": "vehicle",
    "speed": 1300,
    "lifetime": 1.77002,
    "damage": {
      "physical": 0,
      "energy": 0,
      "distortion": 81,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_DistortionRepeater_VNG_S2_AMMO",
    "name": "BEHR DistortionRepeater VNG S2 AMMO",
    "category": "vehicle",
    "speed": 1430,
    "lifetime": 1.61,
    "damage": {
      "physical": 0,
      "energy": 0,
      "distortion": 27,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_JavelinBallisticCannon_S7_AMMO",
    "name": "BEHR JavelinBallisticCannon S7 AMMO",
    "category": "vehicle",
    "speed": 756,
    "lifetime": 5.29,
    "damage": {
      "physical": 2306.34,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_LaserCannon_S1_AMMO",
    "name": "BEHR LaserCannon S1 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 182.25,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_LaserCannon_S2_AMMO",
    "name": "BEHR LaserCannon S2 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2.3,
    "damage": {
      "physical": 0,
      "energy": 273.375,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_LaserCannon_S3_AMMO",
    "name": "BEHR LaserCannon S3 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2.6,
    "damage": {
      "physical": 0,
      "energy": 410.184,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_LaserCannon_S4_AMMO",
    "name": "BEHR LaserCannon S4 AMMO",
    "category": "vehicle",
    "speed": 960,
    "lifetime": 3.13,
    "damage": {
      "physical": 0,
      "energy": 615.276,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_LaserCannon_S5_AMMO",
    "name": "BEHR LaserCannon S5 AMMO",
    "category": "vehicle",
    "speed": 920,
    "lifetime": 3.59,
    "damage": {
      "physical": 0,
      "energy": 921.78,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_LaserCannon_S6_AMMO",
    "name": "BEHR LaserCannon S6 AMMO",
    "category": "vehicle",
    "speed": 880,
    "lifetime": 4.09,
    "damage": {
      "physical": 0,
      "energy": 1383.48,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_LaserCannon_S6_Turret_AMMO",
    "name": "BEHR LaserCannon S6 Turret AMMO",
    "category": "vehicle",
    "speed": 1144,
    "lifetime": 6.82,
    "damage": {
      "physical": 0,
      "energy": 900,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_LaserCannon_S7_AMMO",
    "name": "BEHR LaserCannon S7 AMMO",
    "category": "vehicle",
    "speed": 840,
    "lifetime": 4.76,
    "damage": {
      "physical": 0,
      "energy": 2075.706,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_LaserCannon_S7_AMMO_Idris_M",
    "name": "BEHR LaserCannon S7 AMMO Idris M",
    "category": "vehicle",
    "speed": 672,
    "lifetime": 5.95,
    "damage": {
      "physical": 0,
      "energy": 6750,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_LaserCannon_S7_AMMO_Idris_M_Dummy",
    "name": "BEHR LaserCannon S7 AMMO Idris M Dummy",
    "category": "vehicle",
    "speed": 672,
    "lifetime": 5.95,
    "damage": {
      "physical": 0,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_LaserCannon_S7_Turret_AMMO",
    "name": "BEHR LaserCannon S7 Turret AMMO",
    "category": "vehicle",
    "speed": 840,
    "lifetime": 4.76,
    "damage": {
      "physical": 0,
      "energy": 14040,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_LaserCannon_S8_AMMO",
    "name": "BEHR LaserCannon S8 AMMO",
    "category": "vehicle",
    "speed": 800,
    "lifetime": 5.63,
    "damage": {
      "physical": 0,
      "energy": 3113.64,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_LaserCannon_S9_AMMO",
    "name": "BEHR LaserCannon S9 AMMO",
    "category": "vehicle",
    "speed": 760,
    "lifetime": 5,
    "damage": {
      "physical": 0,
      "energy": 4670.46,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_LaserCannon_SF7E_S7_AMMO",
    "name": "BEHR LaserCannon SF7E S7 AMMO",
    "category": "vehicle",
    "speed": 860,
    "lifetime": 4.65,
    "damage": {
      "physical": 0,
      "energy": 5150,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_LaserCannon_VNG_S2_AMMO",
    "name": "BEHR LaserCannon VNG S2 AMMO",
    "category": "vehicle",
    "speed": 1300,
    "lifetime": 1.77,
    "damage": {
      "physical": 0,
      "energy": 272.97,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_LaserRepeater_S10_AMMO",
    "name": "BEHR LaserRepeater S10 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 5,
    "damage": {
      "physical": 0,
      "energy": 25000,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_LaserRepeater_S10_AMMO_Weak",
    "name": "BEHR LaserRepeater S10 AMMO Weak",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 5,
    "damage": {
      "physical": 0,
      "energy": 1705.5,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_LaserRepeater_VNG_S2_AMMO",
    "name": "BEHR LaserRepeater VNG S2 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2.3,
    "damage": {
      "physical": 0,
      "energy": 99.72,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_MassDriver_S12_AMMO",
    "name": "BEHR MassDriver S12 AMMO",
    "category": "vehicle",
    "speed": 5000,
    "lifetime": 2,
    "damage": {
      "physical": 200000,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_Nova_BallisticGatling_S5_AMMO",
    "name": "BEHR Nova BallisticGatling S5 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 4,
    "damage": {
      "physical": 162.5,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_PDC_BallisticGatling_S1_AMMO",
    "name": "BEHR PDC BallisticGatling S1 AMMO",
    "category": "vehicle",
    "speed": 1600,
    "lifetime": 1.25,
    "damage": {
      "physical": 18,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BEHR_PDC_LaserRepeater_S1_AMMO",
    "name": "BEHR PDC LaserRepeater S1 AMMO",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 1.11,
    "damage": {
      "physical": 0,
      "energy": 10,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "Bengal_BallisticCannon_S7_AMMO",
    "name": "Bengal BallisticCannon S7 AMMO",
    "category": "vehicle",
    "speed": 720,
    "lifetime": 6.25,
    "damage": {
      "physical": 2562.6,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "Bengal_BallisticCannon_S8_AMMO",
    "name": "Bengal BallisticCannon S8 AMMO",
    "category": "vehicle",
    "speed": 720,
    "lifetime": 6.25,
    "damage": {
      "physical": 3844.2,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "Bengal_BallisticGatling_S6_AMMO",
    "name": "Bengal BallisticGatling S6 AMMO",
    "category": "vehicle",
    "speed": 900,
    "lifetime": 4,
    "damage": {
      "physical": 189.9,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "Bengal_Turret_BallisticCannon_S8_AMMO",
    "name": "Bengal Turret BallisticCannon S8 AMMO",
    "category": "vehicle",
    "speed": 612,
    "lifetime": 2.55,
    "damage": {
      "physical": 18500,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "BRRA_LaserCannon_S1_AMMO",
    "name": "BRRA LaserCannon S1 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 8,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "ESPR_BallisticCannon_S1_AMMO",
    "name": "ESPR BallisticCannon S1 AMMO",
    "category": "vehicle",
    "speed": 900,
    "lifetime": 2.22,
    "damage": {
      "physical": 202.5,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "ESPR_BallisticCannon_S2_AMMO",
    "name": "ESPR BallisticCannon S2 AMMO",
    "category": "vehicle",
    "speed": 900,
    "lifetime": 2.56,
    "damage": {
      "physical": 303.3,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "ESPR_BallisticCannon_S3_AMMO",
    "name": "ESPR BallisticCannon S3 AMMO",
    "category": "vehicle",
    "speed": 900,
    "lifetime": 2.89,
    "damage": {
      "physical": 455.4,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "ESPR_BallisticCannon_S4_AMMO",
    "name": "ESPR BallisticCannon S4 AMMO",
    "category": "vehicle",
    "speed": 864,
    "lifetime": 3.47,
    "damage": {
      "physical": 683.1,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "ESPR_BallisticCannon_S5_AMMO",
    "name": "ESPR BallisticCannon S5 AMMO",
    "category": "vehicle",
    "speed": 828,
    "lifetime": 3.99,
    "damage": {
      "physical": 1024.2,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "ESPR_BallisticCannon_S6_AMMO",
    "name": "ESPR BallisticCannon S6 AMMO",
    "category": "vehicle",
    "speed": 792,
    "lifetime": 4.55,
    "damage": {
      "physical": 1537.2,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "ESPR_LaserCannon_S1_AMMO",
    "name": "ESPR LaserCannon S1 AMMO",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 1.11,
    "damage": {
      "physical": 0,
      "energy": 49.248,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "ESPR_LaserCannon_S2_AMMO",
    "name": "ESPR LaserCannon S2 AMMO",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 1.28,
    "damage": {
      "physical": 0,
      "energy": 74.034,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "ESPR_LaserCannon_S3_AMMO",
    "name": "ESPR LaserCannon S3 AMMO",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 1.44,
    "damage": {
      "physical": 0,
      "energy": 110.808,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "ESPR_LaserCannon_S4_AMMO",
    "name": "ESPR LaserCannon S4 AMMO",
    "category": "vehicle",
    "speed": 1728,
    "lifetime": 1.74,
    "damage": {
      "physical": 0,
      "energy": 166.212,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "ESPR_LaserCannon_S5_AMMO",
    "name": "ESPR LaserCannon S5 AMMO",
    "category": "vehicle",
    "speed": 1656,
    "lifetime": 1.99,
    "damage": {
      "physical": 0,
      "energy": 248.67,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "ESPR_LaserCannon_S6_AMMO",
    "name": "ESPR LaserCannon S6 AMMO",
    "category": "vehicle",
    "speed": 1584,
    "lifetime": 2.27,
    "damage": {
      "physical": 0,
      "energy": 374.139,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "GATS_BallisticCannon_S1_AMMO",
    "name": "GATS BallisticCannon S1 AMMO",
    "category": "vehicle",
    "speed": 1600,
    "lifetime": 1.25,
    "damage": {
      "physical": 60.75,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "GATS_BallisticCannon_S2_AMMO",
    "name": "GATS BallisticCannon S2 AMMO",
    "category": "vehicle",
    "speed": 1600,
    "lifetime": 1.44,
    "damage": {
      "physical": 91.26,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "GATS_BallisticCannon_S3_AMMO",
    "name": "GATS BallisticCannon S3 AMMO",
    "category": "vehicle",
    "speed": 1600,
    "lifetime": 1.63,
    "damage": {
      "physical": 136.62,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "GATS_BallisticGatling_S1_AMMO",
    "name": "GATS BallisticGatling S1 AMMO",
    "category": "vehicle",
    "speed": 1600,
    "lifetime": 1.25,
    "damage": {
      "physical": 7.56,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "GATS_BallisticGatling_S1_AMMO_fps_balance",
    "name": "GATS BallisticGatling S1 AMMO Fps Balance",
    "category": "vehicle",
    "speed": 1600,
    "lifetime": 1.25,
    "damage": {
      "physical": 2.5,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "GATS_BallisticGatling_S2_AMMO",
    "name": "GATS BallisticGatling S2 AMMO",
    "category": "vehicle",
    "speed": 1600,
    "lifetime": 1.44,
    "damage": {
      "physical": 12.7,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "GATS_BallisticGatling_S3_AMMO",
    "name": "GATS BallisticGatling S3 AMMO",
    "category": "vehicle",
    "speed": 1600,
    "lifetime": 1.63,
    "damage": {
      "physical": 19,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "GLSN_BallisticGatling_S4_AMMO",
    "name": "GLSN BallisticGatling S4 AMMO",
    "category": "vehicle",
    "speed": 1450,
    "lifetime": 2.07,
    "damage": {
      "physical": 52,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "GLSN_LaserRepeater_S3_AMMO",
    "name": "GLSN LaserRepeater S3 AMMO",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 1.44,
    "damage": {
      "physical": 0,
      "energy": 39.5,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "HRST_LaserRepeater_S1_AMMO",
    "name": "HRST LaserRepeater S1 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 66.51,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "HRST_LaserRepeater_S2_AMMO",
    "name": "HRST LaserRepeater S2 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2.3,
    "damage": {
      "physical": 0,
      "energy": 99.72,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "HRST_LaserRepeater_S3_AMMO",
    "name": "HRST LaserRepeater S3 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2.6,
    "damage": {
      "physical": 0,
      "energy": 134.784,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "HRST_LaserRepeater_S4_AMMO",
    "name": "HRST LaserRepeater S4 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 3,
    "damage": {
      "physical": 0,
      "energy": 202.176,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "HRST_LaserRepeater_S4_Turret_AMMO",
    "name": "HRST LaserRepeater S4 Turret AMMO",
    "category": "vehicle",
    "speed": 2400,
    "lifetime": 3,
    "damage": {
      "physical": 0,
      "energy": 150,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "HRST_LaserRepeater_S5_AMMO",
    "name": "HRST LaserRepeater S5 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 3.3,
    "damage": {
      "physical": 0,
      "energy": 336.78,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "HRST_LaserRepeater_S6_AMMO",
    "name": "HRST LaserRepeater S6 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 3.6,
    "damage": {
      "physical": 0,
      "energy": 505.35,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "HRST_LaserScatterGun_S1_AMMO",
    "name": "HRST LaserScatterGun S1 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 63,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "HRST_LaserScatterGun_S2_AMMO",
    "name": "HRST LaserScatterGun S2 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 99,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "HRST_LaserScatterGun_S3_AMMO",
    "name": "HRST LaserScatterGun S3 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 139.5,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "HRST_Nova_BallisticCannon_S5_AMMO",
    "name": "HRST Nova BallisticCannon S5 AMMO",
    "category": "vehicle",
    "speed": 564,
    "lifetime": 10.9,
    "damage": {
      "physical": 13500,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "HRST_Storm_LaserRepeater_S3_AMMO",
    "name": "HRST Storm LaserRepeater S3 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 5,
    "damage": {
      "physical": 0,
      "energy": 350,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "JOKR_DistortionCannon_S1_AMMO",
    "name": "JOKR DistortionCannon S1 AMMO",
    "category": "vehicle",
    "speed": 1300,
    "lifetime": 1.53868,
    "damage": {
      "physical": 0,
      "energy": 0,
      "distortion": 81,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "JOKR_DistortionCannon_S2_AMMO",
    "name": "JOKR DistortionCannon S2 AMMO",
    "category": "vehicle",
    "speed": 1300,
    "lifetime": 1.77002,
    "damage": {
      "physical": 0,
      "energy": 0.00009,
      "distortion": 121.5,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "JOKR_DistortionCannon_S3_AMMO",
    "name": "JOKR DistortionCannon S3 AMMO",
    "category": "vehicle",
    "speed": 1300,
    "lifetime": 1.99598,
    "damage": {
      "physical": 0,
      "energy": 0,
      "distortion": 182.52,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KBAR_BallisticCannon_S1_AMMO",
    "name": "KBAR BallisticCannon S1 AMMO",
    "category": "vehicle",
    "speed": 1600,
    "lifetime": 1.25,
    "damage": {
      "physical": 48.6,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KBAR_BallisticCannon_S2_AMMO",
    "name": "KBAR BallisticCannon S2 AMMO",
    "category": "vehicle",
    "speed": 1600,
    "lifetime": 1.44,
    "damage": {
      "physical": 72.99,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KBAR_BallisticCannon_S3_AMMO",
    "name": "KBAR BallisticCannon S3 AMMO",
    "category": "vehicle",
    "speed": 1600,
    "lifetime": 1.63,
    "damage": {
      "physical": 109.26,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KLWE_LaserRepeater_Mounted_S1_AMMO",
    "name": "KLWE LaserRepeater Mounted S1 AMMO",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 1.11,
    "damage": {
      "physical": 0,
      "energy": 17.496,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KLWE_LaserRepeater_S1_AMMO",
    "name": "KLWE LaserRepeater S1 AMMO",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 1.11,
    "damage": {
      "physical": 0,
      "energy": 17.496,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KLWE_LaserRepeater_S1_IKTI_AMMO",
    "name": "KLWE LaserRepeater S1 IKTI AMMO",
    "category": "vehicle",
    "speed": 750,
    "lifetime": 0.3,
    "damage": {
      "physical": 0,
      "energy": 11.3,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KLWE_LaserRepeater_S2_AMMO",
    "name": "KLWE LaserRepeater S2 AMMO",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 1.28,
    "damage": {
      "physical": 0,
      "energy": 26.244,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KLWE_LaserRepeater_S3_AMMO",
    "name": "KLWE LaserRepeater S3 AMMO",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 1.44,
    "damage": {
      "physical": 0,
      "energy": 43.65,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KLWE_LaserRepeater_S4_AMMO",
    "name": "KLWE LaserRepeater S4 AMMO",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 1.67,
    "damage": {
      "physical": 0,
      "energy": 65.43,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KLWE_LaserRepeater_S5_AMMO",
    "name": "KLWE LaserRepeater S5 AMMO",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 1.83,
    "damage": {
      "physical": 0,
      "energy": 98.19,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KLWE_LaserRepeater_S5_AMMO_Idris_M",
    "name": "KLWE LaserRepeater S5 AMMO Idris M",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 1.83,
    "damage": {
      "physical": 0,
      "energy": 750,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KLWE_LaserRepeater_S6_AMMO",
    "name": "KLWE LaserRepeater S6 AMMO",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 147.33,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KLWE_MassDriver_S1_AMMO",
    "name": "KLWE MassDriver S1 AMMO",
    "category": "vehicle",
    "speed": 3000,
    "lifetime": 0.35,
    "damage": {
      "physical": 225,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KLWE_MassDriver_S10_AMMO",
    "name": "KLWE MassDriver S10 AMMO",
    "category": "vehicle",
    "speed": 5000,
    "lifetime": 2,
    "damage": {
      "physical": 144160,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KLWE_MassDriver_S2_AMMO",
    "name": "KLWE MassDriver S2 AMMO",
    "category": "vehicle",
    "speed": 3000,
    "lifetime": 0.4,
    "damage": {
      "physical": 525,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KLWE_MassDriver_S3_AMMO",
    "name": "KLWE MassDriver S3 AMMO",
    "category": "vehicle",
    "speed": 3000,
    "lifetime": 0.5,
    "damage": {
      "physical": 1125,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KRIG_BallisticGatling_S2_AMMO",
    "name": "KRIG BallisticGatling S2 AMMO",
    "category": "vehicle",
    "speed": 1200,
    "lifetime": 1.92,
    "damage": {
      "physical": 22.5,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KRIG_LaserCannon_S3_AMMO",
    "name": "KRIG LaserCannon S3 AMMO",
    "category": "vehicle",
    "speed": 1400,
    "lifetime": 1.86,
    "damage": {
      "physical": 0,
      "energy": 218.7,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "Krig_Wolf_BallisticGatling_S4_AMMO",
    "name": "Krig Wolf BallisticGatling S4 AMMO",
    "category": "vehicle",
    "speed": 1650,
    "lifetime": 1.82,
    "damage": {
      "physical": 63,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "Krig_Wolf_LaserRepeater_S4_AMMO",
    "name": "Krig Wolf LaserRepeater S4 AMMO",
    "category": "vehicle",
    "speed": 1650,
    "lifetime": 1.82,
    "damage": {
      "physical": 0,
      "energy": 85,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KRON_LaserCannon_S1_AMMO",
    "name": "KRON LaserCannon S1 AMMO",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 1.11,
    "damage": {
      "physical": 0,
      "energy": 49.248,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KRON_LaserCannon_S2_AMMO",
    "name": "KRON LaserCannon S2 AMMO",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 1.28,
    "damage": {
      "physical": 0,
      "energy": 74.034,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "KRON_LaserCannon_S3_AMMO",
    "name": "KRON LaserCannon S3 AMMO",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 1.44,
    "damage": {
      "physical": 0,
      "energy": 110.808,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "MISC_Prospector_Laser_Beam",
    "name": "MISC Prospector Laser Beam",
    "category": "vehicle",
    "speed": 150,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 150,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "MISC_Prospector_Tractor_Beam",
    "name": "MISC Prospector Tractor Beam",
    "category": "vehicle",
    "speed": 50,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 25,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "MXOX_NeutronCannon_S1_AMMO",
    "name": "MXOX NeutronCannon S1 AMMO",
    "category": "vehicle",
    "speed": 1400,
    "lifetime": 1.43,
    "damage": {
      "physical": 0,
      "energy": 101.2,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "MXOX_NeutronCannon_S2_AMMO",
    "name": "MXOX NeutronCannon S2 AMMO",
    "category": "vehicle",
    "speed": 1400,
    "lifetime": 1.64,
    "damage": {
      "physical": 0,
      "energy": 152.8,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "MXOX_NeutronCannon_S3_AMMO",
    "name": "MXOX NeutronCannon S3 AMMO",
    "category": "vehicle",
    "speed": 1400,
    "lifetime": 1.86,
    "damage": {
      "physical": 0,
      "energy": 220.7,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "MXOX_NeutronRepeater_S1_AMMO",
    "name": "MXOX NeutronRepeater S1 AMMO",
    "category": "vehicle",
    "speed": 1400,
    "lifetime": 1.43,
    "damage": {
      "physical": 0,
      "energy": 37.98,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "MXOX_NeutronRepeater_S2_AMMO",
    "name": "MXOX NeutronRepeater S2 AMMO",
    "category": "vehicle",
    "speed": 1400,
    "lifetime": 1.64,
    "damage": {
      "physical": 0,
      "energy": 56.97,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "MXOX_NeutronRepeater_S3_AMMO",
    "name": "MXOX NeutronRepeater S3 AMMO",
    "category": "vehicle",
    "speed": 1400,
    "lifetime": 1.86,
    "damage": {
      "physical": 0,
      "energy": 85.5,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "NONE_LaserRepeater_S1_AMMO",
    "name": "NONE LaserRepeater S1 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 73.2,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "NONE_LaserRepeater_S2_AMMO",
    "name": "NONE LaserRepeater S2 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2.3,
    "damage": {
      "physical": 0,
      "energy": 109.7,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "NONE_LaserRepeater_S3_AMMO",
    "name": "NONE LaserRepeater S3 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2.6,
    "damage": {
      "physical": 0,
      "energy": 151.6,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "PRAR_DistortionScatterGun_S4_AMMO",
    "name": "PRAR DistortionScatterGun S4 AMMO",
    "category": "vehicle",
    "speed": 700,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 0,
      "distortion": 60,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "PRAR_DistortionScatterGun_S5_AMMO",
    "name": "PRAR DistortionScatterGun S5 AMMO",
    "category": "vehicle",
    "speed": 700,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 0,
      "distortion": 90,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "PRAR_DistortionScatterGun_S6_AMMO",
    "name": "PRAR DistortionScatterGun S6 AMMO",
    "category": "vehicle",
    "speed": 700,
    "lifetime": 2,
    "damage": {
      "physical": 0,
      "energy": 0,
      "distortion": 130,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "RSI_BallisticRepeater_S9_AMMO",
    "name": "RSI BallisticRepeater S9 AMMO",
    "category": "vehicle",
    "speed": 700,
    "lifetime": 6,
    "damage": {
      "physical": 10000,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "RSI_Bespoke_BallisticCannon_A_AMMO",
    "name": "RSI Bespoke BallisticCannon A AMMO",
    "category": "vehicle",
    "speed": 890,
    "lifetime": 5.5,
    "damage": {
      "physical": 3400,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "RSI_Meteor_BallisticCannon_S5_AMMO",
    "name": "RSI Meteor BallisticCannon S5 AMMO",
    "category": "vehicle",
    "speed": 840,
    "lifetime": 3.35,
    "damage": {
      "physical": 1600,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "RSI_Perseus_BallisticCannon_S8_AMMO",
    "name": "RSI Perseus BallisticCannon S8 AMMO",
    "category": "vehicle",
    "speed": 900,
    "lifetime": 6.2,
    "damage": {
      "physical": 5400,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "TOAG_LaserGatling_S2_AMMO",
    "name": "TOAG LaserGatling S2 AMMO",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 1.44,
    "damage": {
      "physical": 0,
      "energy": 17.1,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "TOAG_LaserRepeater_S3_AMMO",
    "name": "TOAG LaserRepeater S3 AMMO",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 1.44,
    "damage": {
      "physical": 0,
      "energy": 36.45,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "VehicleBullets",
    "name": "VehicleBullets",
    "category": "vehicle",
    "speed": 0,
    "lifetime": 1,
    "damage": {
      "physical": 0,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "VehicleExplosiveBullets",
    "name": "VehicleExplosiveBullets",
    "category": "vehicle",
    "speed": 0,
    "lifetime": 1,
    "damage": {
      "physical": 0,
      "energy": 0,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "VNCL_Gen2_PlasmaCannon_S2_AMMO",
    "name": "VNCL Gen2 PlasmaCannon S2 AMMO",
    "category": "vehicle",
    "speed": 500,
    "lifetime": 11,
    "damage": {
      "physical": 0,
      "energy": 156.9231,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "VNCL_Gen2_PlasmaCannon_S4_AMMO",
    "name": "VNCL Gen2 PlasmaCannon S4 AMMO",
    "category": "vehicle",
    "speed": 500,
    "lifetime": 11,
    "damage": {
      "physical": 0,
      "energy": 185.4545,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "VNCL_Gen2_PlasmaCannon_S5_AMMO",
    "name": "VNCL Gen2 PlasmaCannon S5 AMMO",
    "category": "vehicle",
    "speed": 1288,
    "lifetime": 2.17,
    "damage": {
      "physical": 0,
      "energy": 972,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "VNCL_LaserCannon_S1_AMMO",
    "name": "VNCL LaserCannon S1 AMMO",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 1.11,
    "damage": {
      "physical": 0,
      "energy": 72.9,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "VNCL_LaserCannon_S2_AMMO",
    "name": "VNCL LaserCannon S2 AMMO",
    "category": "vehicle",
    "speed": 1800,
    "lifetime": 1.28,
    "damage": {
      "physical": 0,
      "energy": 89.1,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "VNCL_NeutronCannon_S5_AMMO",
    "name": "VNCL NeutronCannon S5 AMMO",
    "category": "vehicle",
    "speed": 1288,
    "lifetime": 2.7,
    "damage": {
      "physical": 0,
      "energy": 567,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "VNCL_PlasmaCannon_S2_AMMO",
    "name": "VNCL PlasmaCannon S2 AMMO",
    "category": "vehicle",
    "speed": 1000,
    "lifetime": 2.3,
    "damage": {
      "physical": 0,
      "energy": 273.132,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "VNCL_PlasmaCannon_S3_AMMO",
    "name": "VNCL PlasmaCannon S3 AMMO",
    "category": "vehicle",
    "speed": 1600,
    "lifetime": 1.625,
    "damage": {
      "physical": 0,
      "energy": 526.5,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  },
  {
    "id": "VNCL_PlasmaCannon_S5_AMMO",
    "name": "VNCL PlasmaCannon S5 AMMO",
    "category": "vehicle",
    "speed": 1288,
    "lifetime": 2.17,
    "damage": {
      "physical": 0,
      "energy": 972,
      "distortion": 0,
      "thermal": 0,
      "biochemical": 0,
      "stun": 0
    }
  }
];
