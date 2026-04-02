// Pure functions for ship comparison logic.
// No React — UI concerns live in the component.

export interface ShipForComparison {
  name: string;
  manufacturer: string;
  role: string;
  size: "small" | "medium" | "large" | "capital";
  crew: { min: number; max: number };
  cargoSCU: number;
  buyPriceAUEC: number | null;
  pledgeUSD: number | null;
  speed: { scm: number; max: number };
  description: string;
}

export interface StatComparison {
  label: string;
  values: (number | null)[];
  bestIndex: number; // -1 if no valid comparison
  unit: string;
  direction: "higher" | "lower"; // which direction is "better"
}

export interface ComparisonResult {
  ships: ShipForComparison[];
  stats: {
    cargoSCU: StatComparison;
    speedSCM: StatComparison;
    speedMax: StatComparison;
    crewMax: StatComparison;
    buyPriceAUEC: StatComparison;
    pledgeUSD: StatComparison;
  };
}

export function getStatWinner(
  values: (number | null)[],
  direction: "higher" | "lower",
): number {
  let bestIndex = -1;
  let bestValue: number | null = null;

  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v === null) continue;
    if (bestValue === null) {
      bestValue = v;
      bestIndex = i;
    } else if (direction === "higher" && v > bestValue) {
      bestValue = v;
      bestIndex = i;
    } else if (direction === "lower" && v < bestValue) {
      bestValue = v;
      bestIndex = i;
    }
  }

  return bestIndex;
}

export function compareShips(ships: ShipForComparison[]): ComparisonResult {
  const cargoValues = ships.map((s) => s.cargoSCU);
  const scmValues = ships.map((s) => s.speed.scm);
  const maxValues = ships.map((s) => s.speed.max);
  const crewValues = ships.map((s) => s.crew.max);
  const priceValues = ships.map((s) => s.buyPriceAUEC);
  const pledgeValues = ships.map((s) => s.pledgeUSD);

  return {
    ships,
    stats: {
      cargoSCU: {
        label: "Cargo",
        values: cargoValues,
        bestIndex: getStatWinner(cargoValues, "higher"),
        unit: "SCU",
        direction: "higher",
      },
      speedSCM: {
        label: "SCM Speed",
        values: scmValues,
        bestIndex: getStatWinner(scmValues, "higher"),
        unit: "m/s",
        direction: "higher",
      },
      speedMax: {
        label: "Max Speed",
        values: maxValues,
        bestIndex: getStatWinner(maxValues, "higher"),
        unit: "m/s",
        direction: "higher",
      },
      crewMax: {
        label: "Max Crew",
        values: crewValues,
        bestIndex: getStatWinner(crewValues, "higher"),
        unit: "",
        direction: "higher",
      },
      buyPriceAUEC: {
        label: "Buy Price",
        values: priceValues,
        bestIndex: getStatWinner(priceValues, "lower"),
        unit: "aUEC",
        direction: "lower",
      },
      pledgeUSD: {
        label: "Pledge Price",
        values: pledgeValues,
        bestIndex: getStatWinner(pledgeValues, "lower"),
        unit: "USD",
        direction: "lower",
      },
    },
  };
}

export function formatAUEC(value: number | null): string {
  if (value === null) return "\u2014";
  return value.toLocaleString("en-US");
}
