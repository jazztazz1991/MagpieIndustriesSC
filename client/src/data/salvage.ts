export interface SalvageMaterial {
  name: string;
  valuePerSCU: number;
  description: string;
}

export const salvageMaterials: SalvageMaterial[] = [
  {
    name: "Recycled Material Composite (RMC)",
    valuePerSCU: 13500,
    description:
      "Primary salvage material extracted from ship hulls. The core output of salvage operations.",
  },
  {
    name: "Construction Material",
    valuePerSCU: 1500,
    description: "Basic structural materials recovered from wrecks.",
  },
];

export interface ShipHull {
  name: string;
  hullSCU: number; // Total RMC yield from hull
  structuralSCU: number; // Construction material yield
  category: "small" | "medium" | "large" | "capital";
}

export const salvageableShips: ShipHull[] = [
  { name: "Aurora MR", hullSCU: 3, structuralSCU: 1, category: "small" },
  { name: "Mustang Alpha", hullSCU: 2.5, structuralSCU: 1, category: "small" },
  { name: "Avenger Titan", hullSCU: 5, structuralSCU: 2, category: "small" },
  { name: "300i", hullSCU: 4.5, structuralSCU: 1.5, category: "small" },
  { name: "Cutlass Black", hullSCU: 12, structuralSCU: 4, category: "medium" },
  { name: "Freelancer", hullSCU: 14, structuralSCU: 5, category: "medium" },
  { name: "Constellation Andromeda", hullSCU: 28, structuralSCU: 10, category: "large" },
  { name: "Caterpillar", hullSCU: 45, structuralSCU: 15, category: "large" },
  { name: "Starfarer", hullSCU: 52, structuralSCU: 18, category: "large" },
  { name: "Hammerhead", hullSCU: 60, structuralSCU: 20, category: "large" },
  { name: "Reclaimer (wreck)", hullSCU: 75, structuralSCU: 25, category: "capital" },
  { name: "Javelin (derelict)", hullSCU: 200, structuralSCU: 80, category: "capital" },
];

