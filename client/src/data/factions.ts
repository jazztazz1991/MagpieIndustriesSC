// Auto-generated from DataForge extraction + localization — sc-alpha-4.7.0-4.7.176.58286
// Run: npm run sync:generate

export interface Faction {
  id: string;
  name: string;
  type: string;
  defaultReaction: string;
  canArrest: boolean;
  policesCrime: boolean;
  allies: string[];
  enemies: string[];
}

export const factions: Faction[] = [
  {
    "id": "faction_lawful_aciedo",
    "name": "Aciedo Communications",
    "type": "Lawful",
    "defaultReaction": "Neutral",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_reputation_lawful_adagioholdings",
    "name": "Adagio Holdings",
    "type": "Lawful",
    "defaultReaction": "Neutral",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_curelife",
    "name": "Alliance Aid",
    "type": "Lawful",
    "defaultReaction": "Neutral",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_lawful_arccorp",
    "name": "ArcCorp",
    "type": "Lawful",
    "defaultReaction": "Neutral",
    "canArrest": false,
    "policesCrime": false,
    "allies": [
      "BlacJac"
    ],
    "enemies": []
  },
  {
    "id": "faction_unlawful_asd",
    "name": "ASD",
    "type": "Unlawful",
    "defaultReaction": "Hostile",
    "canArrest": false,
    "policesCrime": false,
    "allies": [
      "Security"
    ],
    "enemies": []
  },
  {
    "id": "faction_reputation_unlawful_bitzeros",
    "name": "Bit Zeros",
    "type": "Unlawful",
    "defaultReaction": "Neutral",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_lawfulsecurity_blacjac",
    "name": "BlacJac",
    "type": "PrivateSecurity",
    "defaultReaction": "Neutral",
    "canArrest": true,
    "policesCrime": true,
    "allies": [
      "Hurston Dynamics"
    ],
    "enemies": []
  },
  {
    "id": "faction_reputation_lawful_citizensforprosperity",
    "name": "Citizens For Prosperity",
    "type": "Lawful",
    "defaultReaction": "Neutral",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": [
      "Headhunters",
      "XenoThreat"
    ]
  },
  {
    "id": "faction_lawful_clovusdarneely",
    "name": "Clovus Darneely",
    "type": "Lawful",
    "defaultReaction": "Neutral",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_reputation_lawful_covalexshipping",
    "name": "Covalex",
    "type": "Lawful",
    "defaultReaction": "Neutral",
    "canArrest": true,
    "policesCrime": true,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_creature_hostile_vanduul",
    "name": "Creature Hostile Vanduul",
    "type": "Unlawful",
    "defaultReaction": "Hostile",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_lawful_crusaderindustries",
    "name": "Crusader Industries",
    "type": "Lawful",
    "defaultReaction": "Neutral",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_lawfulsecurity_crusadersecurity",
    "name": "Crusader Security",
    "type": "PrivateSecurity",
    "defaultReaction": "Neutral",
    "canArrest": true,
    "policesCrime": true,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_unlawful_dusters",
    "name": "Dusters",
    "type": "Unlawful",
    "defaultReaction": "Neutral",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": [
      "Nine Tails"
    ]
  },
  {
    "id": "faction_unlawful_firerats",
    "name": "Fire Rats",
    "type": "Unlawful",
    "defaultReaction": "Hostile",
    "canArrest": false,
    "policesCrime": false,
    "allies": [
      "Security"
    ],
    "enemies": [
      "Horizon"
    ]
  },
  {
    "id": "faction_unlawful_frontierfighters",
    "name": "Frontier Fighters",
    "type": "Unlawful",
    "defaultReaction": "Hostile",
    "canArrest": false,
    "policesCrime": false,
    "allies": [
      "Fire Rats",
      "Horizon",
      "Nine Tails",
      "Outlaws"
    ],
    "enemies": []
  },
  {
    "id": "faction_reputation_unlawful_headhunters",
    "name": "Headhunters",
    "type": "Unlawful",
    "defaultReaction": "Neutral",
    "canArrest": false,
    "policesCrime": false,
    "allies": [
      "Rough & Ready"
    ],
    "enemies": [
      "Citizens For Prosperity",
      "XenoThreat"
    ]
  },
  {
    "id": "faction_unlawful_horizon",
    "name": "Horizon",
    "type": "Unlawful",
    "defaultReaction": "Hostile",
    "canArrest": false,
    "policesCrime": false,
    "allies": [
      "Security"
    ],
    "enemies": [
      "Fire Rats"
    ]
  },
  {
    "id": "faction_lawful_hurstondynamics",
    "name": "Hurston Dynamics",
    "type": "Lawful",
    "defaultReaction": "Neutral",
    "canArrest": false,
    "policesCrime": false,
    "allies": [
      "Hurston Security"
    ],
    "enemies": []
  },
  {
    "id": "faction_lawfulsecurity_hurstonsecurity",
    "name": "Hurston Security",
    "type": "PrivateSecurity",
    "defaultReaction": "Neutral",
    "canArrest": true,
    "policesCrime": true,
    "allies": [
      "Hurston Dynamics"
    ],
    "enemies": []
  },
  {
    "id": "faction_special_kleschersecurity",
    "name": "Klescher Rehabilitation Facilities",
    "type": "LawEnforcement",
    "defaultReaction": "Neutral",
    "canArrest": true,
    "policesCrime": false,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_lawful_civilian",
    "name": "Lawful Civilian",
    "type": "Lawful",
    "defaultReaction": "Neutral",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_lawful_microtech",
    "name": "microTech",
    "type": "Lawful",
    "defaultReaction": "Neutral",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_reputation_lawful_eckhartsecurity",
    "name": "Miles Eckhart",
    "type": "Lawful",
    "defaultReaction": "Neutral",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_lawfulsecurity_microtechprotectionservices",
    "name": "MT Protection Services",
    "type": "PrivateSecurity",
    "defaultReaction": "Neutral",
    "canArrest": true,
    "policesCrime": true,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_unlawful_ninetails",
    "name": "Nine Tails",
    "type": "Unlawful",
    "defaultReaction": "Hostile",
    "canArrest": false,
    "policesCrime": false,
    "allies": [
      "Frontier Fighters"
    ],
    "enemies": []
  },
  {
    "id": "faction_unlawful_outlaws",
    "name": "Outlaws",
    "type": "Unlawful",
    "defaultReaction": "Hostile",
    "canArrest": false,
    "policesCrime": false,
    "allies": [
      "Security"
    ],
    "enemies": []
  },
  {
    "id": "faction_unlawful_roughandready",
    "name": "Rough & Ready",
    "type": "Unlawful",
    "defaultReaction": "Neutral",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_unlawful_ruto",
    "name": "Ruto",
    "type": "Unlawful",
    "defaultReaction": "Neutral",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_lawfulsecurity_generic",
    "name": "Security",
    "type": "PrivateSecurity",
    "defaultReaction": "Neutral",
    "canArrest": true,
    "policesCrime": true,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_special_friendlytoall",
    "name": "Security",
    "type": "Lawful",
    "defaultReaction": "Friendly",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_unlawfulsecurity_generic",
    "name": "Security",
    "type": "PrivateSecurity",
    "defaultReaction": "Neutral",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_special_hostiletoall",
    "name": "Special Hostiletoall",
    "type": "Unlawful",
    "defaultReaction": "Hostile",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_lawenforcement_advocacy",
    "name": "UEE Advocacy",
    "type": "LawEnforcement",
    "defaultReaction": "Neutral",
    "canArrest": true,
    "policesCrime": true,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_lawenforcement_ueenavy",
    "name": "UEE Navy",
    "type": "LawEnforcement",
    "defaultReaction": "Neutral",
    "canArrest": true,
    "policesCrime": true,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_unlawful_civilian",
    "name": "Unlawful Civilian",
    "type": "Unlawful",
    "defaultReaction": "Neutral",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_unlawful_shatteredblade",
    "name": "Unlawful Shatteredblade",
    "type": "Unlawful",
    "defaultReaction": "Hostile",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": [
      "Creature Hostile Vanduul",
      "UEE Navy"
    ]
  },
  {
    "id": "faction_unlawful_wallaceklim",
    "name": "Wallace Klim",
    "type": "Unlawful",
    "defaultReaction": "Neutral",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": []
  },
  {
    "id": "faction_unlawful_xenothreat",
    "name": "XenoThreat",
    "type": "Unlawful",
    "defaultReaction": "Hostile",
    "canArrest": false,
    "policesCrime": false,
    "allies": [],
    "enemies": [
      "Citizens For Prosperity",
      "Headhunters"
    ]
  }
];
