# Item Finder — "Where Do I Find X?"

## Summary
Single search page that answers "how do I get this item?" by cross-referencing all data sources: crafting, loot, missions, mining, wikelo contracts.

## How It Works
1. User types an item name (e.g., "Arrowhead", "Quantanium", "Palatino")
2. Domain logic searches across ALL data sources
3. Results grouped by source type with actionable info

## Source Types
- **Craftable** — blueprint exists, show materials + craft time + blueprint source
- **Loot Drop** — appears in loot tables, show which containers at which locations + drop weight
- **Wikelo Reward** — contract reward, show which contract + requirements + tier
- **Wikelo Requirement** — needed for a contract, show which contracts need it
- **Mineable Ore** — show mining locations (ship + FPS) with spawn rates
- **Blueprint Drop** — blueprint obtainable from mission, show which missions

## UI
- Large search bar at top, auto-filters as you type
- Results as cards grouped by source type
- Each card links to the relevant tool page (crafting page, mining locations, wikelo tracker)
- Show "No results" with suggestions if nothing matches

## Domain Logic (client/src/domain/itemFinder.ts)
```typescript
interface ItemSource {
  type: "craftable" | "loot" | "wikelo_reward" | "wikelo_requirement" | "ore" | "blueprint_drop";
  name: string;
  detail: string;
  link?: string;
}

function findItem(query: string): ItemSource[];
```

## Files
- `client/src/domain/itemFinder.ts` — search logic
- `client/src/domain/itemFinder.test.ts` — tests
- `client/src/app/tools/item-finder/page.tsx` — UI
- `client/src/components/nav/Navbar.tsx` — add nav link

## Checklist
- [ ] Build itemFinder domain logic with tests
- [ ] Build search UI page
- [ ] Cross-reference crafting blueprints
- [ ] Cross-reference loot tables
- [ ] Cross-reference wikelo contracts (rewards + requirements)
- [ ] Cross-reference mining ores + locations
- [ ] Cross-reference blueprint mission sources
- [ ] Add to navbar
- [ ] Run all tests
