import type { RefineryStation } from "@/data/refinery";

export interface ApprovedSubmission {
  stationName: string;
  oreName: string;
  bonusPct: number;
}

export interface MergedBonus {
  value: number;
  source: "static" | "crowd";
}

/**
 * Merge approved submissions into static station bonuses.
 * Crowd-sourced values override static values for the same (station, ore) pair.
 * Returns a map keyed by stationName → { oreName → MergedBonus }.
 */
export function mergeStationBonuses(
  stations: RefineryStation[],
  submissions: ApprovedSubmission[]
): Map<string, Map<string, MergedBonus>> {
  const result = new Map<string, Map<string, MergedBonus>>();

  for (const station of stations) {
    const bonuses = new Map<string, MergedBonus>();
    for (const [ore, value] of Object.entries(station.bonuses)) {
      bonuses.set(ore, { value, source: "static" });
    }
    result.set(station.name, bonuses);
  }

  for (const sub of submissions) {
    const existing = result.get(sub.stationName);
    if (!existing) continue;
    existing.set(sub.oreName, { value: sub.bonusPct, source: "crowd" });
  }

  return result;
}

/**
 * Validate a submission shape before sending to the server.
 * Returns an error message or null if valid.
 */
export function validateSubmission(input: {
  stationName: string;
  oreName: string;
  bonusPct: number;
}): string | null {
  if (!input.stationName.trim()) return "Station is required";
  if (!input.oreName.trim()) return "Ore is required";
  if (!Number.isInteger(input.bonusPct)) return "Bonus must be a whole number";
  if (input.bonusPct < -100 || input.bonusPct > 100) return "Bonus must be between -100 and 100";
  return null;
}
