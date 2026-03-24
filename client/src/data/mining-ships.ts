export interface MiningShip {
  name: string;
  manufacturer: string;
  size: "small" | "medium";
  cargoSCU: number;
  miningTurrets: number;
  description: string;
  crewMin: number;
  crewMax: number;
  miningBags?: number; // for ROC
  isVehicle?: boolean;
}

export const miningShips: MiningShip[] = [
  {
    name: "Prospector",
    manufacturer: "MISC",
    size: "small",
    cargoSCU: 32,
    miningTurrets: 1,
    crewMin: 1,
    crewMax: 1,
    description: "Solo mining ship. One size 1 mining laser. 32 SCU ore capacity. The workhorse of solo miners.",
  },
  {
    name: "MOLE",
    manufacturer: "ARGO",
    size: "medium",
    cargoSCU: 96,
    miningTurrets: 3,
    crewMin: 1,
    crewMax: 4,
    description: "Multi-crew mining ship. Three size 1 mining lasers. 96 SCU across 3 saddle bags (32 each). Best with a full crew.",
  },
  {
    name: "ROC",
    manufacturer: "Greycat Industrial",
    size: "small",
    cargoSCU: 0.8,
    miningTurrets: 1,
    crewMin: 1,
    crewMax: 1,
    isVehicle: true,
    description: "Ground mining vehicle for hand-mineable gems (Hadanite, Dolivine, Aphorite). Fits in Cutlass Black, Nomad, etc.",
  },
  {
    name: "ROC-DS",
    manufacturer: "Greycat Industrial",
    size: "small",
    cargoSCU: 1.6,
    miningTurrets: 2,
    crewMin: 1,
    crewMax: 2,
    isVehicle: true,
    description: "Dual-seat ROC variant with two mining arms and double storage. Requires a larger cargo hold.",
  },
];
