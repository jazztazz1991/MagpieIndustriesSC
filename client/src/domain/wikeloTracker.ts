// Pure functions for Wikelo inventory tracker logic.
// No React, no localStorage — those concerns live in the component.

export interface TrackerInventory {
  [itemName: string]: number;
}

export interface TrackerGoal {
  contractName: string;
  targetItems: { item: string; quantity: number }[];
}

export function getItemProgress(
  inventory: TrackerInventory,
  required: { item: string; quantity: number },
): {
  item: string;
  have: number;
  need: number;
  complete: boolean;
} {
  const have = inventory[required.item] ?? 0;
  return {
    item: required.item,
    have,
    need: required.quantity,
    complete: have >= required.quantity,
  };
}

export function getContractProgress(
  inventory: TrackerInventory,
  requirements: { item: string; quantity: number }[],
): {
  items: { item: string; have: number; need: number; complete: boolean }[];
  overallPercent: number;
  allComplete: boolean;
} {
  const items = requirements.map((req) => getItemProgress(inventory, req));

  if (requirements.length === 0) {
    return { items, overallPercent: 100, allComplete: true };
  }

  const totalNeed = requirements.reduce((sum, r) => sum + r.quantity, 0);
  const totalHave = requirements.reduce((sum, r) => {
    const have = inventory[r.item] ?? 0;
    // Cap at the required amount so overstocking one item doesn't inflate %
    return sum + Math.min(have, r.quantity);
  }, 0);

  const overallPercent =
    totalNeed === 0 ? 100 : Math.round((totalHave / totalNeed) * 100);
  const allComplete = items.every((i) => i.complete);

  return { items, overallPercent, allComplete };
}

export function calculateFavorsFromInventory(
  inventory: TrackerInventory,
  favorConversions: { item: string; quantity: number; favorsEarned: number }[],
): number {
  let totalFavors = 0;

  for (const conversion of favorConversions) {
    const have = inventory[conversion.item] ?? 0;
    const timesConvertible = Math.floor(have / conversion.quantity);
    totalFavors += timesConvertible * conversion.favorsEarned;
  }

  return totalFavors;
}
