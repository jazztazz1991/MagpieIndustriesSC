import type { MiningLocation } from "@/data/mining-locations";
import type { Ore, Rarity } from "@/data/mining";

export interface LocationFilters {
  search: string;
  parentBody: string;
  danger: string;
  ore: string;
  rarity: string; // "all" or one of Rarity
  oreType: string; // "all" | "rock" | "gem" | "metal"
}

export const DEFAULT_FILTERS: LocationFilters = {
  search: "",
  parentBody: "all",
  danger: "all",
  ore: "all",
  rarity: "all",
  oreType: "all",
};

/**
 * Pure function — given a list of locations, filter them by the given filters.
 * Ore lookup map lets us cross-reference ore rarity/type without scanning the
 * ore array on every location.
 */
export function filterLocations(
  locations: MiningLocation[],
  filters: LocationFilters,
  oresByName: Map<string, Ore>
): MiningLocation[] {
  return locations.filter((loc) => {
    if (filters.parentBody !== "all" && loc.parentBody !== filters.parentBody) return false;
    if (filters.danger !== "all" && loc.danger !== filters.danger) return false;
    if (filters.ore !== "all" && !loc.ores.includes(filters.ore) && !loc.fpsOres.includes(filters.ore)) return false;
    if (filters.search && !loc.name.toLowerCase().includes(filters.search.toLowerCase())) return false;

    if (filters.rarity !== "all") {
      const hasMatchingRarity = loc.ores.some((oreName) => {
        const ore = oresByName.get(oreName);
        return ore && ore.rarity === filters.rarity;
      });
      if (!hasMatchingRarity) return false;
    }

    if (filters.oreType !== "all") {
      const hasMatchingType = loc.ores.some((oreName) => {
        const ore = oresByName.get(oreName);
        return ore && ore.type === filters.oreType;
      });
      if (!hasMatchingType) return false;
    }

    return true;
  });
}

/**
 * Serialize filters to URLSearchParams (skip "all" / empty values).
 */
export function filtersToSearchParams(filters: LocationFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search) params.set("q", filters.search);
  if (filters.parentBody !== "all") params.set("parent", filters.parentBody);
  if (filters.danger !== "all") params.set("danger", filters.danger);
  if (filters.ore !== "all") params.set("ore", filters.ore);
  if (filters.rarity !== "all") params.set("rarity", filters.rarity);
  if (filters.oreType !== "all") params.set("type", filters.oreType);
  return params;
}

/**
 * Parse filters from URLSearchParams, falling back to defaults.
 */
export function filtersFromSearchParams(params: URLSearchParams): LocationFilters {
  return {
    search: params.get("q") || "",
    parentBody: params.get("parent") || "all",
    danger: params.get("danger") || "all",
    ore: params.get("ore") || "all",
    rarity: (params.get("rarity") as Rarity) || "all",
    oreType: params.get("type") || "all",
  };
}
