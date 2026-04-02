// Auto-generated from DataForge extraction + localization — sc-alpha-4.7.0-4.7.175.49567
// Run: npm run sync:generate

export interface ReputationTier {
  name: string;
  minReputation: number;
  gated: boolean;
  driftReputation?: number;
  driftTimeHours?: number;
}

export interface ReputationScope {
  name: string;
  displayName: string;
  reputationCeiling: number;
  tiers: ReputationTier[];
}

export interface ReputationOrg {
  name: string;
  scopes: ReputationScope[];
}

export const organizations: ReputationOrg[] = [
  {
    "name": "Adagio Holdings",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "FactionReputation",
        "displayName": "Standing",
        "reputationCeiling": 95250,
        "tiers": [
          {
            "name": "Neutral",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Jr. Contractor",
            "minReputation": 800,
            "gated": false
          },
          {
            "name": "Contractor",
            "minReputation": 2200,
            "gated": false
          },
          {
            "name": "Sr. Contractor",
            "minReputation": 5800,
            "gated": false
          },
          {
            "name": "Veteran Contractor",
            "minReputation": 15000,
            "gated": false
          },
          {
            "name": "Head Contractor",
            "minReputation": 38000,
            "gated": false
          },
          {
            "name": "Elite Contractor",
            "minReputation": 95250,
            "gated": false
          }
        ]
      }
    ]
  },
  {
    "name": "Assassination Guild",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "Assassination",
        "displayName": "Assassination",
        "reputationCeiling": 112001,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Under Review",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Assassin In Training",
            "minReputation": 1,
            "gated": false
          },
          {
            "name": "Low Level Assassin",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Assassin",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "High Value Assassin",
            "minReputation": 24000,
            "gated": false
          },
          {
            "name": "Elite Assassin",
            "minReputation": 56000,
            "gated": false
          },
          {
            "name": "Master Assassin",
            "minReputation": 112000,
            "gated": false
          }
        ]
      },
      {
        "name": "FactionReputation",
        "displayName": "Standing",
        "reputationCeiling": 95250,
        "tiers": [
          {
            "name": "Neutral",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Jr. Contractor",
            "minReputation": 800,
            "gated": false
          },
          {
            "name": "Contractor",
            "minReputation": 2200,
            "gated": false
          },
          {
            "name": "Sr. Contractor",
            "minReputation": 5800,
            "gated": false
          },
          {
            "name": "Veteran Contractor",
            "minReputation": 15000,
            "gated": false
          },
          {
            "name": "Head Contractor",
            "minReputation": 38000,
            "gated": false
          },
          {
            "name": "Elite Contractor",
            "minReputation": 95250,
            "gated": false
          }
        ]
      }
    ]
  },
  {
    "name": "Bounty Hunters Guild",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "BountyHunter_BountyHuntersGuild",
        "displayName": "Bounty Hunting",
        "reputationCeiling": 480001,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Probationary Guild Member",
            "minReputation": 1,
            "gated": false
          },
          {
            "name": "Junior Guild Member",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Guild Member",
            "minReputation": 10000,
            "gated": false
          },
          {
            "name": "Senior Guild Member",
            "minReputation": 40000,
            "gated": false
          },
          {
            "name": "Veteran Guild Member",
            "minReputation": 200000,
            "gated": false
          },
          {
            "name": "Guild Steward",
            "minReputation": 480000,
            "gated": false
          }
        ]
      }
    ]
  },
  {
    "name": "Bounty Security",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "BountyHunter",
        "displayName": "Bounty Hunting",
        "reputationCeiling": 5200000,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Tracker Trainee",
            "minReputation": 1,
            "gated": false
          },
          {
            "name": "Associate Tracker",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Tracker",
            "minReputation": 30000,
            "gated": false
          },
          {
            "name": "Advanced Tracker",
            "minReputation": 120000,
            "gated": false
          },
          {
            "name": "Senior Tracker",
            "minReputation": 480000,
            "gated": false
          },
          {
            "name": "Master Tracker",
            "minReputation": 1600000,
            "gated": false
          }
        ]
      },
      {
        "name": "Security",
        "displayName": "Security",
        "reputationCeiling": 5200000,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Security Trainee",
            "minReputation": 1,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Jr. Security Contractor",
            "minReputation": 5000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Security Contractor",
            "minReputation": 30000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Sr. Security Contractor",
            "minReputation": 120000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Lead Security Contractor",
            "minReputation": 480000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Elite Security Contractor",
            "minReputation": 1600000,
            "gated": false,
            "driftTimeHours": 24
          }
        ]
      }
    ]
  },
  {
    "name": "Citizens for Prosperity",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "Security",
        "displayName": "Security",
        "reputationCeiling": 5200000,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Security Trainee",
            "minReputation": 1,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Jr. Security Contractor",
            "minReputation": 5000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Security Contractor",
            "minReputation": 30000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Sr. Security Contractor",
            "minReputation": 120000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Lead Security Contractor",
            "minReputation": 480000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Elite Security Contractor",
            "minReputation": 1600000,
            "gated": false,
            "driftTimeHours": 24
          }
        ]
      },
      {
        "name": "Courier",
        "displayName": "Courier",
        "reputationCeiling": 7500,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Jr. Runner",
            "minReputation": 1,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Runner",
            "minReputation": 2500,
            "gated": false,
            "driftTimeHours": 24
          }
        ]
      },
      {
        "name": "Salvaging",
        "displayName": "Salvaging",
        "reputationCeiling": 10001,
        "tiers": [
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Apprentice Salvager",
            "minReputation": 1,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Associate Salvager",
            "minReputation": 100,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Salvager",
            "minReputation": 500,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Senior Salvager",
            "minReputation": 1500,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Master Salvager",
            "minReputation": 5000,
            "gated": false,
            "driftTimeHours": 24
          }
        ]
      },
      {
        "name": "FactionReputation",
        "displayName": "Standing",
        "reputationCeiling": 95250,
        "tiers": [
          {
            "name": "Neutral",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Jr. Contractor",
            "minReputation": 800,
            "gated": false
          },
          {
            "name": "Contractor",
            "minReputation": 2200,
            "gated": false
          },
          {
            "name": "Sr. Contractor",
            "minReputation": 5800,
            "gated": false
          },
          {
            "name": "Veteran Contractor",
            "minReputation": 15000,
            "gated": false
          },
          {
            "name": "Head Contractor",
            "minReputation": 38000,
            "gated": false
          },
          {
            "name": "Elite Contractor",
            "minReputation": 95250,
            "gated": false
          }
        ]
      }
    ]
  },
  {
    "name": "Headhunters",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "RacingShip",
        "displayName": "Spaceship",
        "reputationCeiling": 640000,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Racing Enthusiast",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Novice Racer",
            "minReputation": 1,
            "gated": false
          },
          {
            "name": "Rookie Racer",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Racer",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Practiced Racer",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Dedicated Racer",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Experienced Racer",
            "minReputation": 16000,
            "gated": false
          },
          {
            "name": "Skilled Racer",
            "minReputation": 32000,
            "gated": false
          }
        ]
      },
      {
        "name": "HiredMuscle",
        "displayName": "Hired Muscle",
        "reputationCeiling": 1600001,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Rank I",
            "minReputation": 1,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Rank II",
            "minReputation": 5000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank III",
            "minReputation": 30000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank IV",
            "minReputation": 120000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank V",
            "minReputation": 480000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank VI",
            "minReputation": 1600000,
            "gated": false,
            "driftTimeHours": 24
          }
        ]
      },
      {
        "name": "Assassination",
        "displayName": "Assassination",
        "reputationCeiling": 112001,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Under Review",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Assassin In Training",
            "minReputation": 1,
            "gated": false
          },
          {
            "name": "Low Level Assassin",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Assassin",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "High Value Assassin",
            "minReputation": 24000,
            "gated": false
          },
          {
            "name": "Elite Assassin",
            "minReputation": 56000,
            "gated": false
          },
          {
            "name": "Master Assassin",
            "minReputation": 112000,
            "gated": false
          }
        ]
      },
      {
        "name": "FactionReputation",
        "displayName": "Standing",
        "reputationCeiling": 95250,
        "tiers": [
          {
            "name": "Neutral",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Jr. Contractor",
            "minReputation": 800,
            "gated": false
          },
          {
            "name": "Contractor",
            "minReputation": 2200,
            "gated": false
          },
          {
            "name": "Sr. Contractor",
            "minReputation": 5800,
            "gated": false
          },
          {
            "name": "Veteran Contractor",
            "minReputation": 15000,
            "gated": false
          },
          {
            "name": "Head Contractor",
            "minReputation": 38000,
            "gated": false
          },
          {
            "name": "Elite Contractor",
            "minReputation": 95250,
            "gated": false
          }
        ]
      }
    ]
  },
  {
    "name": "Hired Muscle",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "HiredMuscle",
        "displayName": "Hired Muscle",
        "reputationCeiling": 1600001,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Rank I",
            "minReputation": 1,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Rank II",
            "minReputation": 5000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank III",
            "minReputation": 30000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank IV",
            "minReputation": 120000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank V",
            "minReputation": 480000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank VI",
            "minReputation": 1600000,
            "gated": false,
            "driftTimeHours": 24
          }
        ]
      },
      {
        "name": "FactionReputation",
        "displayName": "Standing",
        "reputationCeiling": 95250,
        "tiers": [
          {
            "name": "Neutral",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Jr. Contractor",
            "minReputation": 800,
            "gated": false
          },
          {
            "name": "Contractor",
            "minReputation": 2200,
            "gated": false
          },
          {
            "name": "Sr. Contractor",
            "minReputation": 5800,
            "gated": false
          },
          {
            "name": "Veteran Contractor",
            "minReputation": 15000,
            "gated": false
          },
          {
            "name": "Head Contractor",
            "minReputation": 38000,
            "gated": false
          },
          {
            "name": "Elite Contractor",
            "minReputation": 95250,
            "gated": false
          }
        ]
      }
    ]
  },
  {
    "name": "Hired Muscle (Assassination)",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "HiredMuscle",
        "displayName": "Hired Muscle",
        "reputationCeiling": 1600001,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Rank I",
            "minReputation": 1,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Rank II",
            "minReputation": 5000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank III",
            "minReputation": 30000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank IV",
            "minReputation": 120000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank V",
            "minReputation": 480000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank VI",
            "minReputation": 1600000,
            "gated": false,
            "driftTimeHours": 24
          }
        ]
      },
      {
        "name": "Assassination",
        "displayName": "Assassination",
        "reputationCeiling": 112001,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Under Review",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Assassin In Training",
            "minReputation": 1,
            "gated": false
          },
          {
            "name": "Low Level Assassin",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Assassin",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "High Value Assassin",
            "minReputation": 24000,
            "gated": false
          },
          {
            "name": "Elite Assassin",
            "minReputation": 56000,
            "gated": false
          },
          {
            "name": "Master Assassin",
            "minReputation": 112000,
            "gated": false
          }
        ]
      }
    ]
  },
  {
    "name": "Hurston Security",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "BountyHunter",
        "displayName": "Bounty Hunting",
        "reputationCeiling": 5200000,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Tracker Trainee",
            "minReputation": 1,
            "gated": false
          },
          {
            "name": "Associate Tracker",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Tracker",
            "minReputation": 30000,
            "gated": false
          },
          {
            "name": "Advanced Tracker",
            "minReputation": 120000,
            "gated": false
          },
          {
            "name": "Senior Tracker",
            "minReputation": 480000,
            "gated": false
          },
          {
            "name": "Master Tracker",
            "minReputation": 1600000,
            "gated": false
          }
        ]
      },
      {
        "name": "Security",
        "displayName": "Security",
        "reputationCeiling": 5200000,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Security Trainee",
            "minReputation": 1,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Jr. Security Contractor",
            "minReputation": 5000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Security Contractor",
            "minReputation": 30000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Sr. Security Contractor",
            "minReputation": 120000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Lead Security Contractor",
            "minReputation": 480000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Elite Security Contractor",
            "minReputation": 1600000,
            "gated": false,
            "driftTimeHours": 24
          }
        ]
      }
    ]
  },
  {
    "name": "Klescher Rehabilitation Services",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      }
    ]
  },
  {
    "name": "microTech Protection Services",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "BountyHunter",
        "displayName": "Bounty Hunting",
        "reputationCeiling": 5200000,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Tracker Trainee",
            "minReputation": 1,
            "gated": false
          },
          {
            "name": "Associate Tracker",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Tracker",
            "minReputation": 30000,
            "gated": false
          },
          {
            "name": "Advanced Tracker",
            "minReputation": 120000,
            "gated": false
          },
          {
            "name": "Senior Tracker",
            "minReputation": 480000,
            "gated": false
          },
          {
            "name": "Master Tracker",
            "minReputation": 1600000,
            "gated": false
          }
        ]
      },
      {
        "name": "Security",
        "displayName": "Security",
        "reputationCeiling": 5200000,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Security Trainee",
            "minReputation": 1,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Jr. Security Contractor",
            "minReputation": 5000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Security Contractor",
            "minReputation": 30000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Sr. Security Contractor",
            "minReputation": 120000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Lead Security Contractor",
            "minReputation": 480000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Elite Security Contractor",
            "minReputation": 1600000,
            "gated": false,
            "driftTimeHours": 24
          }
        ]
      }
    ]
  },
  {
    "name": "Northrock Service Group",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "BountyHunter",
        "displayName": "Bounty Hunting",
        "reputationCeiling": 5200000,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Tracker Trainee",
            "minReputation": 1,
            "gated": false
          },
          {
            "name": "Associate Tracker",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Tracker",
            "minReputation": 30000,
            "gated": false
          },
          {
            "name": "Advanced Tracker",
            "minReputation": 120000,
            "gated": false
          },
          {
            "name": "Senior Tracker",
            "minReputation": 480000,
            "gated": false
          },
          {
            "name": "Master Tracker",
            "minReputation": 1600000,
            "gated": false
          }
        ]
      },
      {
        "name": "Security",
        "displayName": "Security",
        "reputationCeiling": 5200000,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Security Trainee",
            "minReputation": 1,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Jr. Security Contractor",
            "minReputation": 5000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Security Contractor",
            "minReputation": 30000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Sr. Security Contractor",
            "minReputation": 120000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Lead Security Contractor",
            "minReputation": 480000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Elite Security Contractor",
            "minReputation": 1600000,
            "gated": false,
            "driftTimeHours": 24
          }
        ]
      },
      {
        "name": "Security_MercenaryGuild",
        "displayName": "Security",
        "reputationCeiling": 5200000,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Security Trainee",
            "minReputation": 1,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Jr. Security Contractor",
            "minReputation": 5000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Security Contractor",
            "minReputation": 30000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Sr. Security Contractor",
            "minReputation": 120000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Lead Security Contractor",
            "minReputation": 480000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Elite Security Contractor",
            "minReputation": 1600000,
            "gated": false,
            "driftTimeHours": 24
          }
        ]
      }
    ]
  },
  {
    "name": "Racing Guild",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "HoverTimeTrial",
        "displayName": "HoverTimeTrial",
        "reputationCeiling": 640000,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Racing GravLev Rank0",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Racing GravLev Rank1",
            "minReputation": 1,
            "gated": false
          },
          {
            "name": "Racing GravLev Rank2",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Racing GravLev Rank3",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Racing GravLev Rank4",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Racing GravLev Rank5",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Racing GravLev Rank6",
            "minReputation": 16000,
            "gated": false
          },
          {
            "name": "Racing GravLev Rank7",
            "minReputation": 32000,
            "gated": false
          }
        ]
      },
      {
        "name": "WheeledTimeTrial",
        "displayName": "WheeledTimeTrial",
        "reputationCeiling": 640000,
        "tiers": [
          {
            "name": "Racing Ground NotEligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Racing Ground Rank0",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Racing Ground Rank1",
            "minReputation": 1,
            "gated": false
          },
          {
            "name": "Racing Ground Rank2",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Racing Ground Rank3",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Racing Ground Rank4",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Racing Ground Rank5",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Racing Ground Rank6",
            "minReputation": 16000,
            "gated": false
          },
          {
            "name": "Racing Ground Rank7",
            "minReputation": 32000,
            "gated": false
          }
        ]
      },
      {
        "name": "RacingShip",
        "displayName": "Spaceship",
        "reputationCeiling": 640000,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Racing Enthusiast",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Novice Racer",
            "minReputation": 1,
            "gated": false
          },
          {
            "name": "Rookie Racer",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Racer",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Practiced Racer",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Dedicated Racer",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Experienced Racer",
            "minReputation": 16000,
            "gated": false
          },
          {
            "name": "Skilled Racer",
            "minReputation": 32000,
            "gated": false
          }
        ]
      }
    ]
  },
  {
    "name": "Rough & Ready",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "Courier",
        "displayName": "Courier",
        "reputationCeiling": 7500,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Jr. Runner",
            "minReputation": 1,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Runner",
            "minReputation": 2500,
            "gated": false,
            "driftTimeHours": 24
          }
        ]
      },
      {
        "name": "HiredMuscle",
        "displayName": "Hired Muscle",
        "reputationCeiling": 1600001,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Rank I",
            "minReputation": 1,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Rank II",
            "minReputation": 5000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank III",
            "minReputation": 30000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank IV",
            "minReputation": 120000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank V",
            "minReputation": 480000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank VI",
            "minReputation": 1600000,
            "gated": false,
            "driftTimeHours": 24
          }
        ]
      },
      {
        "name": "Assassination",
        "displayName": "Assassination",
        "reputationCeiling": 112001,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Under Review",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Assassin In Training",
            "minReputation": 1,
            "gated": false
          },
          {
            "name": "Low Level Assassin",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Assassin",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "High Value Assassin",
            "minReputation": 24000,
            "gated": false
          },
          {
            "name": "Elite Assassin",
            "minReputation": 56000,
            "gated": false
          },
          {
            "name": "Master Assassin",
            "minReputation": 112000,
            "gated": false
          }
        ]
      },
      {
        "name": "Salvaging",
        "displayName": "Salvaging",
        "reputationCeiling": 10001,
        "tiers": [
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Apprentice Salvager",
            "minReputation": 1,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Associate Salvager",
            "minReputation": 100,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Salvager",
            "minReputation": 500,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Senior Salvager",
            "minReputation": 1500,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Master Salvager",
            "minReputation": 5000,
            "gated": false,
            "driftTimeHours": 24
          }
        ]
      }
    ]
  },
  {
    "name": "Salvage Guild",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "Salvaging",
        "displayName": "Salvaging",
        "reputationCeiling": 10001,
        "tiers": [
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Apprentice Salvager",
            "minReputation": 1,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Associate Salvager",
            "minReputation": 100,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Salvager",
            "minReputation": 500,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Senior Salvager",
            "minReputation": 1500,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Master Salvager",
            "minReputation": 5000,
            "gated": false,
            "driftTimeHours": 24
          }
        ]
      }
    ]
  },
  {
    "name": "Shubin Interstellar",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "FactionReputation",
        "displayName": "Standing",
        "reputationCeiling": 95250,
        "tiers": [
          {
            "name": "Neutral",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Jr. Contractor",
            "minReputation": 800,
            "gated": false
          },
          {
            "name": "Contractor",
            "minReputation": 2200,
            "gated": false
          },
          {
            "name": "Sr. Contractor",
            "minReputation": 5800,
            "gated": false
          },
          {
            "name": "Veteran Contractor",
            "minReputation": 15000,
            "gated": false
          },
          {
            "name": "Head Contractor",
            "minReputation": 38000,
            "gated": false
          },
          {
            "name": "Elite Contractor",
            "minReputation": 95250,
            "gated": false
          }
        ]
      }
    ]
  },
  {
    "name": "Technician Guild",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "Technician",
        "displayName": "Technician",
        "reputationCeiling": 243000,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Technician-in-Training",
            "minReputation": 1,
            "gated": false
          },
          {
            "name": "Jr. Technician",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Technician",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Sr. Technician",
            "minReputation": 27000,
            "gated": false
          },
          {
            "name": "Master Technician",
            "minReputation": 81000,
            "gated": false
          }
        ]
      }
    ]
  },
  {
    "name": "Transport Guild",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "Courier",
        "displayName": "Courier",
        "reputationCeiling": 7500,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Jr. Runner",
            "minReputation": 1,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Runner",
            "minReputation": 2500,
            "gated": false,
            "driftTimeHours": 24
          }
        ]
      },
      {
        "name": "Hauling",
        "displayName": "Hauling",
        "reputationCeiling": 367601,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 200,
            "driftTimeHours": 1
          },
          {
            "name": "Trainee",
            "minReputation": 0,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Rookie",
            "minReputation": 50,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Junior",
            "minReputation": 250,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Member",
            "minReputation": 5250,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Experienced",
            "minReputation": 27750,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Senior",
            "minReputation": 77750,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Master",
            "minReputation": 237750,
            "gated": false,
            "driftTimeHours": 24
          }
        ]
      },
      {
        "name": "FactionReputation",
        "displayName": "Standing",
        "reputationCeiling": 95250,
        "tiers": [
          {
            "name": "Neutral",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Jr. Contractor",
            "minReputation": 800,
            "gated": false
          },
          {
            "name": "Contractor",
            "minReputation": 2200,
            "gated": false
          },
          {
            "name": "Sr. Contractor",
            "minReputation": 5800,
            "gated": false
          },
          {
            "name": "Veteran Contractor",
            "minReputation": 15000,
            "gated": false
          },
          {
            "name": "Head Contractor",
            "minReputation": 38000,
            "gated": false
          },
          {
            "name": "Elite Contractor",
            "minReputation": 95250,
            "gated": false
          }
        ]
      }
    ]
  },
  {
    "name": "UEE Advocacy",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      }
    ]
  },
  {
    "name": "Unified Distribution Management",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "Courier",
        "displayName": "Courier",
        "reputationCeiling": 7500,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Jr. Runner",
            "minReputation": 1,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Runner",
            "minReputation": 2500,
            "gated": false,
            "driftTimeHours": 24
          }
        ]
      }
    ]
  },
  {
    "name": "Wikelo Emporium",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "Wikelo",
        "displayName": "Barter & Trade",
        "reputationCeiling": 1000,
        "tiers": [
          {
            "name": "New Customer",
            "minReputation": 0,
            "gated": false
          },
          {
            "name": "Very Good Customer",
            "minReputation": 340,
            "gated": false
          },
          {
            "name": "Very Best Customer",
            "minReputation": 999,
            "gated": false
          }
        ]
      }
    ]
  },
  {
    "name": "XenoThreat",
    "scopes": [
      {
        "name": "Affinity",
        "displayName": "Affinity",
        "reputationCeiling": 10000,
        "tiers": [
          {
            "name": "Affinity Enemy  100",
            "minReputation": -10000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  095",
            "minReputation": -9500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  090",
            "minReputation": -9000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  085",
            "minReputation": -8500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  080",
            "minReputation": -8000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  075",
            "minReputation": -7500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  070",
            "minReputation": -7000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  065",
            "minReputation": -6500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  060",
            "minReputation": -6000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  055",
            "minReputation": -5500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  050",
            "minReputation": -5000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  045",
            "minReputation": -4500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  040",
            "minReputation": -4000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  035",
            "minReputation": -3500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  030",
            "minReputation": -3000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  025",
            "minReputation": -2500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  020",
            "minReputation": -2000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  015",
            "minReputation": -1500,
            "gated": false
          },
          {
            "name": "Affinity Enemy  010",
            "minReputation": -1000,
            "gated": false
          },
          {
            "name": "Affinity Enemy  005",
            "minReputation": -500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 000",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Affinity Neutral 005",
            "minReputation": 500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 010",
            "minReputation": 1000,
            "gated": false
          },
          {
            "name": "Affinity Neutral 015",
            "minReputation": 1500,
            "gated": false
          },
          {
            "name": "Affinity Neutral 020",
            "minReputation": 2000,
            "gated": false
          },
          {
            "name": "Affinity Ally 025",
            "minReputation": 2500,
            "gated": false
          },
          {
            "name": "Affinity Ally 030",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Affinity Ally 035",
            "minReputation": 3500,
            "gated": false
          },
          {
            "name": "Affinity Ally 040",
            "minReputation": 4000,
            "gated": false
          },
          {
            "name": "Affinity Ally 045",
            "minReputation": 4500,
            "gated": false
          },
          {
            "name": "Affinity Ally 050",
            "minReputation": 5000,
            "gated": false
          },
          {
            "name": "Affinity Ally 055",
            "minReputation": 5500,
            "gated": false
          },
          {
            "name": "Affinity Ally 065",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 060",
            "minReputation": 6500,
            "gated": false
          },
          {
            "name": "Affinity Ally 070",
            "minReputation": 7000,
            "gated": false
          },
          {
            "name": "Affinity Ally 075",
            "minReputation": 7500,
            "gated": false
          },
          {
            "name": "Affinity Ally 080",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "Affinity Ally 085",
            "minReputation": 8500,
            "gated": false
          },
          {
            "name": "Affinity Ally 090",
            "minReputation": 9000,
            "gated": false
          },
          {
            "name": "Affinity Ally 095",
            "minReputation": 9500,
            "gated": false
          },
          {
            "name": "Affinity Ally 100",
            "minReputation": 10000,
            "gated": false
          }
        ]
      },
      {
        "name": "HiredMuscle",
        "displayName": "Hired Muscle",
        "reputationCeiling": 1600001,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Applicant",
            "minReputation": 0,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Rank I",
            "minReputation": 1,
            "gated": true,
            "driftTimeHours": 24
          },
          {
            "name": "Rank II",
            "minReputation": 5000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank III",
            "minReputation": 30000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank IV",
            "minReputation": 120000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank V",
            "minReputation": 480000,
            "gated": false,
            "driftTimeHours": 24
          },
          {
            "name": "Rank VI",
            "minReputation": 1600000,
            "gated": false,
            "driftTimeHours": 24
          }
        ]
      },
      {
        "name": "Assassination",
        "displayName": "Assassination",
        "reputationCeiling": 112001,
        "tiers": [
          {
            "name": "Not Eligible",
            "minReputation": -1000,
            "gated": false,
            "driftReputation": 250,
            "driftTimeHours": 1
          },
          {
            "name": "Under Review",
            "minReputation": 0,
            "gated": true
          },
          {
            "name": "Assassin In Training",
            "minReputation": 1,
            "gated": false
          },
          {
            "name": "Low Level Assassin",
            "minReputation": 3000,
            "gated": false
          },
          {
            "name": "Assassin",
            "minReputation": 8000,
            "gated": false
          },
          {
            "name": "High Value Assassin",
            "minReputation": 24000,
            "gated": false
          },
          {
            "name": "Elite Assassin",
            "minReputation": 56000,
            "gated": false
          },
          {
            "name": "Master Assassin",
            "minReputation": 112000,
            "gated": false
          }
        ]
      }
    ]
  }
];
