import type { ShipHull } from "@/data/salvage";
import { salvageMaterials } from "@/data/salvage";

export function calculateSalvageProfit(ship: ShipHull): {
  rmcValue: number;
  constructionValue: number;
  totalValue: number;
} {
  const rmcPrice = salvageMaterials[0].valuePerSCU;
  const constructionPrice = salvageMaterials[1].valuePerSCU;
  const rmcValue = Math.round(ship.hullSCU * rmcPrice);
  const constructionValue = Math.round(ship.structuralSCU * constructionPrice);
  return {
    rmcValue,
    constructionValue,
    totalValue: rmcValue + constructionValue,
  };
}
