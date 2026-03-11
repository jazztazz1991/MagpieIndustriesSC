export interface RefineryMethod {
  name: string;
  yieldMultiplier: number; // 1.0 = 100% yield
  timeMultiplier: number; // 1.0 = base time
  costPerSCU: number; // aUEC per SCU processing cost
  description: string;
}

export const refineryMethods: RefineryMethod[] = [
  {
    name: "Cormack Method",
    yieldMultiplier: 1.0,
    timeMultiplier: 1.0,
    costPerSCU: 160,
    description:
      "Balanced method. Standard yield, standard time. The default safe choice.",
  },
  {
    name: "Dinyx Solventation",
    yieldMultiplier: 0.86,
    timeMultiplier: 0.6,
    costPerSCU: 120,
    description:
      "Fast processing at the cost of lower yield. Good for volatile ores like Quantanium.",
  },
  {
    name: "Ferron Exchange",
    yieldMultiplier: 1.0,
    timeMultiplier: 2.5,
    costPerSCU: 95,
    description:
      "Maximum yield but very slow. Best for high-value ores when time isn't critical.",
  },
  {
    name: "Pyrometric Chromalysis",
    yieldMultiplier: 0.95,
    timeMultiplier: 1.3,
    costPerSCU: 140,
    description:
      "Slightly below max yield but faster than Ferron. A good middle ground.",
  },
  {
    name: "Electrostarolysis",
    yieldMultiplier: 0.92,
    timeMultiplier: 0.85,
    costPerSCU: 180,
    description:
      "Faster than Cormack with a small yield penalty. Higher cost per SCU.",
  },
  {
    name: "Kazen Winnowing",
    yieldMultiplier: 0.79,
    timeMultiplier: 0.45,
    costPerSCU: 100,
    description:
      "Fastest method available. Significant yield loss. Use for low-value ores.",
  },
];

