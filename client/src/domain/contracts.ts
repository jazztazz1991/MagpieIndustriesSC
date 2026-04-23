export type ContractCategory =
  | "bounty"
  | "courier"
  | "delivery"
  | "cargo"
  | "combat"
  | "salvage"
  | "defend"
  | "escort"
  | "investigation"
  | "repair"
  | "wikelo"
  | "tutorial"
  | "event"
  | "other";

export interface ContractTemplate {
  id: string;         // stable filename-derived id (e.g. "bounty_nearlocation")
  name: string;       // human label (e.g. "Bounty — Near Location")
  category: ContractCategory;
  illegal: boolean;   // true = unlawful contract
  issuers: string[];  // generator names that reference this template
}

const CATEGORY_RULES: Array<{ test: RegExp; category: ContractCategory }> = [
  { test: /^thecollector/i, category: "wikelo" },
  { test: /^tutorial/i, category: "tutorial" },
  { test: /^events?\b|^initialinvite/i, category: "event" },
  { test: /^bounty|^huntthepolaris|^acepilot/i, category: "bounty" },
  { test: /^(eliminate|destroy|ship?wave|antibombing|defendship_destroy|killanimals|boardship|hijacked)/i, category: "combat" },
  { test: /^(defend|supportattacked)/i, category: "defend" },
  { test: /^escort/i, category: "escort" },
  { test: /^(salvage|recovercargo)/i, category: "salvage" },
  { test: /^(haulcargo|cargo)/i, category: "cargo" },
  { test: /^courier/i, category: "courier" },
  { test: /^deliverypilot/i, category: "delivery" },
  { test: /^(commarray|datadownload|hackprevention|commarray_hack)/i, category: "investigation" },
  { test: /^(commarray_repair|infiltrate|hackprevention)/i, category: "repair" },
  { test: /^(missingperson|missingpersons|handyman|clearcrimestat|itemresourcegathering|interactionor)/i, category: "other" },
];

/**
 * Categorize a contract template id (filename without extension).
 */
export function categorize(id: string): ContractCategory {
  for (const rule of CATEGORY_RULES) {
    if (rule.test.test(id)) return rule.category;
  }
  return "other";
}

/**
 * Prettify a filename-style id into a display label.
 * e.g. "bounty_nearlocation" → "Bounty — Near Location".
 */
export function prettifyContractId(id: string): string {
  const parts = id.split("_").filter(Boolean);
  if (parts.length === 0) return id;

  // Insert a dash between the first segment and the rest for readability
  const head = titleCase(parts[0]);
  if (parts.length === 1) return head;
  const tail = parts
    .slice(1)
    .map(titleCase)
    .join(" ");
  return `${head} — ${tail}`;
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/**
 * Category → human label.
 */
export function categoryLabel(c: ContractCategory): string {
  switch (c) {
    case "bounty": return "Bounty";
    case "courier": return "Courier";
    case "delivery": return "Delivery";
    case "cargo": return "Cargo Hauling";
    case "combat": return "Combat";
    case "salvage": return "Salvage";
    case "defend": return "Defense";
    case "escort": return "Escort";
    case "investigation": return "Investigation";
    case "repair": return "Repair";
    case "wikelo": return "Wikelo";
    case "tutorial": return "Tutorial";
    case "event": return "Event";
    case "other": return "Other";
  }
}

/**
 * Group contracts by category, preserving category display order.
 */
export function groupByCategory(
  contracts: ContractTemplate[]
): Array<{ category: ContractCategory; contracts: ContractTemplate[] }> {
  const order: ContractCategory[] = [
    "bounty", "combat", "defend", "escort",
    "courier", "delivery", "cargo", "salvage",
    "investigation", "repair", "wikelo", "event", "tutorial", "other",
  ];
  const map = new Map<ContractCategory, ContractTemplate[]>();
  for (const c of contracts) {
    (map.get(c.category) || map.set(c.category, []).get(c.category)!).push(c);
  }
  return order
    .filter((cat) => map.has(cat))
    .map((cat) => ({ category: cat, contracts: map.get(cat)! }));
}

/**
 * Filter contracts by category, lawfulness, and/or text search.
 */
export function filterContracts(
  contracts: ContractTemplate[],
  filter: { category?: ContractCategory | "all"; illegal?: boolean | "all"; search?: string }
): ContractTemplate[] {
  const q = filter.search?.toLowerCase() ?? "";
  return contracts.filter((c) => {
    if (filter.category && filter.category !== "all" && c.category !== filter.category) return false;
    if (filter.illegal !== undefined && filter.illegal !== "all" && c.illegal !== filter.illegal) return false;
    if (q && !c.name.toLowerCase().includes(q) && !c.id.toLowerCase().includes(q) && !c.issuers.some((i) => i.toLowerCase().includes(q))) return false;
    return true;
  });
}
