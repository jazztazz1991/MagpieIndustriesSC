// Auto-generated from DataForge extraction + localization — sc-alpha-4.7.0-4.7.176.58286
// Run: npm run sync:generate

export interface Crime {
  id: string;
  name: string;
  isFelony: boolean;
  trigger: string;
  felonyMerits: number;
  lifetimeHours: number;
  fineMultiplier: number;
}

export interface ImpoundRule {
  trigger: string;
  timeSeconds: number;
  fineUEC: number;
}

export interface Jurisdiction {
  id: string;
  name: string;
  baseFine: number;
  isPrison: boolean;
  crimes: string[];
  impoundRules: ImpoundRule[];
}

export const crimes: Crime[] = [
  {
    "id": "prisonsuicide",
    "name": "Abandoning Klescher Equipment",
    "isFelony": true,
    "trigger": "PrisonSuicide",
    "felonyMerits": 1000,
    "lifetimeHours": -1,
    "fineMultiplier": -1
  },
  {
    "id": "inprison",
    "name": "Actively Incarcerated",
    "isFelony": true,
    "trigger": "Arrest",
    "felonyMerits": -1,
    "lifetimeHours": -1,
    "fineMultiplier": -1
  },
  {
    "id": "aggravatedassault",
    "name": "Aggravated Assault",
    "isFelony": false,
    "trigger": "AssaultActor",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 512
  },
  {
    "id": "armisticeviolation",
    "name": "Armistice Violation",
    "isFelony": false,
    "trigger": "GreenZonePropertyDamage",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 320
  },
  {
    "id": "assaultinganofficerofthelaw",
    "name": "Assaulting Security Personnel",
    "isFelony": false,
    "trigger": "AssaultLawEnforcement",
    "felonyMerits": 2500,
    "lifetimeHours": 168,
    "fineMultiplier": 512
  },
  {
    "id": "attemptedescape",
    "name": "Attempted Escape from Custody",
    "isFelony": true,
    "trigger": "Unknown",
    "felonyMerits": 1000,
    "lifetimeHours": 168,
    "fineMultiplier": -1
  },
  {
    "id": "attemptedhomicide",
    "name": "Attempted Homicide",
    "isFelony": true,
    "trigger": "DownedDirectDamage",
    "felonyMerits": 3000,
    "lifetimeHours": 168,
    "fineMultiplier": -1
  },
  {
    "id": "batteryfirstdegree",
    "name": "Battery (First Degree)",
    "isFelony": false,
    "trigger": "KnockoutActor",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 320
  },
  {
    "id": "batteryseconddegree",
    "name": "Battery (Second Degree)",
    "isFelony": false,
    "trigger": "MeleeActor",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 64
  },
  {
    "id": "brandishingdeadlyweapon",
    "name": "Brandishing a Weapon",
    "isFelony": false,
    "trigger": "State_WeaponDrawn",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 32
  },
  {
    "id": "propertydestruction",
    "name": "Destruction of Property",
    "isFelony": false,
    "trigger": "DestroyEntity",
    "felonyMerits": -1,
    "lifetimeHours": -1,
    "fineMultiplier": -1
  },
  {
    "id": "vehicledestruction",
    "name": "Destruction of Vehicle",
    "isFelony": false,
    "trigger": "DestroyVehicle",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 640
  },
  {
    "id": "escapedconvict",
    "name": "Escaped from Custody",
    "isFelony": true,
    "trigger": "PrisonEscape",
    "felonyMerits": 2000,
    "lifetimeHours": 168,
    "fineMultiplier": -1
  },
  {
    "id": "evadingarrest",
    "name": "Evading Arrest",
    "isFelony": false,
    "trigger": "Unknown",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 512
  },
  {
    "id": "failuretocomply",
    "name": "Failure to Comply",
    "isFelony": false,
    "trigger": "Unknown",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 320
  },
  {
    "id": "grievousbodilyharm",
    "name": "Grievous Bodily Harm",
    "isFelony": false,
    "trigger": "ForcedIntoDowned",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 640
  },
  {
    "id": "harboringafelon",
    "name": "Harboring a Fugitive",
    "isFelony": false,
    "trigger": "Unknown",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 160
  },
  {
    "id": "murder",
    "name": "Homicide",
    "isFelony": true,
    "trigger": "KillActor",
    "felonyMerits": 5000,
    "lifetimeHours": 168,
    "fineMultiplier": -1
  },
  {
    "id": "vehicletowing",
    "name": "Illegal Towing",
    "isFelony": false,
    "trigger": "State_IllegalVehicleTowing",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 512
  },
  {
    "id": "insurancefraud",
    "name": "Insurance Fraud",
    "isFelony": false,
    "trigger": "Unknown",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 160
  },
  {
    "id": "manslaughter",
    "name": "Negligent Homicide",
    "isFelony": false,
    "trigger": "Manslaughter",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 640
  },
  {
    "id": "vehicletheft",
    "name": "Operating a Stolen Vehicle",
    "isFelony": false,
    "trigger": "Unknown",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 512
  },
  {
    "id": "possessionofcontrolledsubstances_classa",
    "name": "Possession of Class A Controlled Substance",
    "isFelony": false,
    "trigger": "Unknown",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 64
  },
  {
    "id": "possessionofcontrolledsubstances_classb",
    "name": "Possession of Class B Controlled Substance",
    "isFelony": false,
    "trigger": "Unknown",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 32
  },
  {
    "id": "possessionofcontrolledsubstances_classc",
    "name": "Possession of Class C Controlled Substance",
    "isFelony": false,
    "trigger": "Unknown",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 16
  },
  {
    "id": "possessionofprohibitedgoods",
    "name": "Possession of Prohibited Goods",
    "isFelony": false,
    "trigger": "Unknown",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 320
  },
  {
    "id": "possessionofstolengoods",
    "name": "Possession of Stolen Property",
    "isFelony": false,
    "trigger": "Unknown",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 32
  },
  {
    "id": "propertytheft",
    "name": "Property Theft",
    "isFelony": false,
    "trigger": "RemoveItemFromCargoGrid",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 32
  },
  {
    "id": "resistingarrest",
    "name": "Resisting Arrest",
    "isFelony": false,
    "trigger": "Unknown",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 640
  },
  {
    "id": "terroristact",
    "name": "Sabotage",
    "isFelony": true,
    "trigger": "Unknown",
    "felonyMerits": 10000,
    "lifetimeHours": 168,
    "fineMultiplier": -1
  },
  {
    "id": "distributionofcontrolledsubstances_classa",
    "name": "Trafficking of Class A Controlled Substance",
    "isFelony": false,
    "trigger": "Unknown",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 640
  },
  {
    "id": "distributionofcontrolledsubstances_classb",
    "name": "Trafficking of Class B Controlled Substance",
    "isFelony": false,
    "trigger": "Unknown",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 512
  },
  {
    "id": "distributionofcontrolledsubstances_classc",
    "name": "Trafficking of Class C Controlled Substance",
    "isFelony": false,
    "trigger": "Unknown",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 128
  },
  {
    "id": "distributionofstolengoods",
    "name": "Trafficking of Stolen Property",
    "isFelony": false,
    "trigger": "Unknown",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 320
  },
  {
    "id": "felonytrespassing",
    "name": "Trespassing (First Degree)",
    "isFelony": false,
    "trigger": "State_Trespassing",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 320
  },
  {
    "id": "felonytrespassingdirect",
    "name": "Trespassing (First Degree)",
    "isFelony": false,
    "trigger": "Trespassing",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 160
  },
  {
    "id": "misdemeanortrespassing",
    "name": "Trespassing (Second Degree)",
    "isFelony": false,
    "trigger": "State_Intruding",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 32
  },
  {
    "id": "misdemeanortrespassingdirect",
    "name": "Trespassing (Second Degree)",
    "isFelony": false,
    "trigger": "Unknown",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 32
  },
  {
    "id": "restrictedareatrespass",
    "name": "Trespassing (Second Degree)",
    "isFelony": false,
    "trigger": "RestrictedAreaTrespass",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 32
  },
  {
    "id": "hacking",
    "name": "Unauthorized Computer Access",
    "isFelony": false,
    "trigger": "Unknown",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 160
  },
  {
    "id": "unauthorizedinterdiction",
    "name": "Unauthorized Interdiction",
    "isFelony": false,
    "trigger": "Interdiction",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 64
  },
  {
    "id": "dischargedeadlyweapon",
    "name": "Unlawful Discharge of a Weapon",
    "isFelony": false,
    "trigger": "FireWeapon",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 64
  },
  {
    "id": "vehiclecollision",
    "name": "Vehicular Collision",
    "isFelony": false,
    "trigger": "RamVehicle",
    "felonyMerits": -1,
    "lifetimeHours": 168,
    "fineMultiplier": 2
  }
];

export const jurisdictions: Jurisdiction[] = [
  {
    "id": "arccorp",
    "name": "Arc Corp",
    "baseFine": 125,
    "isPrison": false,
    "crimes": [
      "distributionofcontrolledsubstances_classb",
      "distributionofcontrolledsubstances_classc",
      "possessionofcontrolledsubstances_classa",
      "possessionofcontrolledsubstances_classb"
    ],
    "impoundRules": []
  },
  {
    "id": "citizensforprosperity",
    "name": "Citizens For Prosperity",
    "baseFine": 0,
    "isPrison": false,
    "crimes": [],
    "impoundRules": []
  },
  {
    "id": "crusaderindustries",
    "name": "Crusader Industries",
    "baseFine": 125,
    "isPrison": false,
    "crimes": [
      "distributionofcontrolledsubstances_classb",
      "distributionofcontrolledsubstances_classc",
      "possessionofcontrolledsubstances_classa",
      "possessionofcontrolledsubstances_classb"
    ],
    "impoundRules": []
  },
  {
    "id": "green",
    "name": "Green",
    "baseFine": 126,
    "isPrison": false,
    "crimes": [],
    "impoundRules": []
  },
  {
    "id": "headhunters",
    "name": "Headhunters",
    "baseFine": 0,
    "isPrison": false,
    "crimes": [],
    "impoundRules": []
  },
  {
    "id": "hurstondynamics",
    "name": "Hurston Dynamics",
    "baseFine": 125,
    "isPrison": false,
    "crimes": [
      "distributionofcontrolledsubstances_classb",
      "distributionofcontrolledsubstances_classc",
      "possessionofcontrolledsubstances_classa",
      "possessionofcontrolledsubstances_classb"
    ],
    "impoundRules": []
  },
  {
    "id": "klescherprison",
    "name": "Klescher Prison",
    "baseFine": 125,
    "isPrison": true,
    "crimes": [
      "prisonsuicide",
      "batteryfirstdegree",
      "batteryseconddegree",
      "grievousbodilyharm",
      "aggravatedassault"
    ],
    "impoundRules": []
  },
  {
    "id": "microtech",
    "name": "Microtech",
    "baseFine": 125,
    "isPrison": false,
    "crimes": [
      "distributionofcontrolledsubstances_classb",
      "distributionofcontrolledsubstances_classc",
      "possessionofcontrolledsubstances_classa",
      "possessionofcontrolledsubstances_classb"
    ],
    "impoundRules": []
  },
  {
    "id": "peoplesalliance",
    "name": "Peoples Alliance",
    "baseFine": 125,
    "isPrison": false,
    "crimes": [],
    "impoundRules": []
  },
  {
    "id": "roughandready",
    "name": "Rough & Ready",
    "baseFine": 0,
    "isPrison": false,
    "crimes": [],
    "impoundRules": [
      {
        "trigger": "PadRamming",
        "timeSeconds": 3600,
        "fineUEC": 50000
      },
      {
        "trigger": "IllegalParking",
        "timeSeconds": 900,
        "fineUEC": 5000
      },
      {
        "trigger": "TrespassImpound",
        "timeSeconds": 900,
        "fineUEC": 5000
      }
    ]
  },
  {
    "id": "uee",
    "name": "UEE",
    "baseFine": 125,
    "isPrison": false,
    "crimes": [
      "inprison",
      "terroristact",
      "murder",
      "manslaughter",
      "grievousbodilyharm",
      "distributionofcontrolledsubstances_classa",
      "resistingarrest",
      "assaultinganofficerofthelaw",
      "aggravatedassault",
      "escapedconvict",
      "vehicledestruction",
      "possessionofprohibitedgoods",
      "distributionofstolengoods",
      "hacking",
      "insurancefraud",
      "vehicletheft",
      "felonytrespassing",
      "harboringafelon",
      "attemptedescape",
      "armisticeviolation",
      "evadingarrest",
      "failuretocomply",
      "batteryfirstdegree",
      "unauthorizedinterdiction",
      "batteryseconddegree",
      "batteryseconddegree",
      "misdemeanortrespassing",
      "possessionofstolengoods",
      "felonytrespassingdirect",
      "restrictedareatrespass",
      "misdemeanortrespassingdirect",
      "vehicletowing",
      "propertytheft"
    ],
    "impoundRules": [
      {
        "trigger": "PadRamming",
        "timeSeconds": 3600,
        "fineUEC": 50000
      },
      {
        "trigger": "IllegalParking",
        "timeSeconds": 900,
        "fineUEC": 5000
      },
      {
        "trigger": "TrespassImpound",
        "timeSeconds": 900,
        "fineUEC": 5000
      }
    ]
  },
  {
    "id": "unclaimedspace",
    "name": "Unclaimed Space",
    "baseFine": 0,
    "isPrison": false,
    "crimes": [],
    "impoundRules": []
  },
  {
    "id": "xenothreat",
    "name": "XenoThreat",
    "baseFine": 0,
    "isPrison": false,
    "crimes": [],
    "impoundRules": []
  }
];
