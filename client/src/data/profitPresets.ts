import type { ActivityConfig } from "@/domain/profitSimulator";

export const profitPresets: ActivityConfig[] = [
  {
    name: "Quantanium Mining (Prospector)",
    profitPerRun: 220000,
    timePerRunMin: 45,
    investmentCost: 2061000,
  },
  {
    name: "Quantanium Mining (MOLE)",
    profitPerRun: 450000,
    timePerRunMin: 60,
    investmentCost: 5130500,
  },
  {
    name: "Laranite Trading (Cutlass Black)",
    profitPerRun: 35000,
    timePerRunMin: 20,
    investmentCost: 1385300,
  },
  {
    name: "Laranite Trading (C2 Hercules)",
    profitPerRun: 180000,
    timePerRunMin: 25,
    investmentCost: 4962200,
  },
  {
    name: "Salvage (Vulture)",
    profitPerRun: 80000,
    timePerRunMin: 30,
    investmentCost: 1472700,
  },
  {
    name: "Salvage (Reclaimer)",
    profitPerRun: 350000,
    timePerRunMin: 50,
    investmentCost: 14643200,
  },
  {
    name: "Bounty Hunting (Gladius - VHRT)",
    profitPerRun: 25000,
    timePerRunMin: 8,
    investmentCost: 1106100,
  },
  {
    name: "Bounty Hunting (Sabre - ERT)",
    profitPerRun: 100000,
    timePerRunMin: 15,
    investmentCost: 2163000,
  },
  {
    name: "Box Delivery Missions",
    profitPerRun: 15000,
    timePerRunMin: 12,
    investmentCost: 0,
  },
  {
    name: "Bunker Clearing (FPS)",
    profitPerRun: 60000,
    timePerRunMin: 20,
    investmentCost: 0,
  },
];
