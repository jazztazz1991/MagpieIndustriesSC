// Auto-generated from Data.p4k — sc-alpha-4.7.0-4.7.175.49567
// Run: npm run sync:generate

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
    name: "Golem",
    manufacturer: "Drake",
    size: "small",
    cargoSCU: 12,
    miningTurrets: 1,
    crewMin: 1,
    crewMax: 1,
    description: "",
  },
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
    miningTurrets: 1,
    crewMin: 1,
    crewMax: 2,
    isVehicle: true,
    description: "",
  },
];
