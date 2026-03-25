// Auto-generated from scunpacked-data — 4.6.0-LIVE.11218823
// Run: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/sync-mining-data.ts

export interface MiningShip {
  name: string;
  manufacturer: string;
  size: "small" | "medium";
  cargoSCU: number;
  miningTurrets: number;
  description: string;
  crewMin: number;
  crewMax: number;
  isVehicle?: boolean;
}

export const miningShips: MiningShip[] = [
  {
    name: "MOLE",
    manufacturer: "ARGO",
    size: "medium",
    cargoSCU: 96,
    miningTurrets: 3,
    crewMin: 1,
    crewMax: 5,
    description: "",
  },
  {
    name: "Prospector",
    manufacturer: "MISC",
    size: "small",
    cargoSCU: 32,
    miningTurrets: 1,
    crewMin: 1,
    crewMax: 1,
    description: "",
  },
  {
    name: "ROC",
    manufacturer: "Greycat Industrial",
    size: "small",
    cargoSCU: 1.2,
    miningTurrets: 1,
    crewMin: 1,
    crewMax: 1,
    isVehicle: true,
    description: "",
  },
  {
    name: "ROC-DS",
    manufacturer: "Greycat Industrial",
    size: "small",
    cargoSCU: 3.4,
    miningTurrets: 2,
    crewMin: 1,
    crewMax: 2,
    isVehicle: true,
    description: "",
  },
];
