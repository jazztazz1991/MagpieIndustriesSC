# Crafting Tool Page

## Summary
Searchable crafting blueprint database. Users search for an item, see what's needed to craft it, where to get the materials, and where the blueprint drops.

## UI Layout

### Top: Search & Filters
- Search box: type item name (e.g., "Arrowhead", "Palatino", "ADP")
- Filter pills: Weapons | Armor | Ammo | All
- Sub-filter dropdown: subcategory (rifle, sniper, pistol, shotgun, lmg, combat, engineer, etc.)
- Toggle: "Has blueprint source" (only show items with known mission drops)

### Results: Blueprint Cards
Each card shows:
- **Item name** (localized display name)
- **Type badge** (weapon/armor/ammo) + subcategory
- **Craft time**
- **Materials** — table of: Slot | Resource | Quantity (SCU) | Where to Mine
  - "Where to Mine" pulls from mining-locations data for that resource
- **Blueprint source** — which mission rewards this blueprint (if known)
- **Quality modifiers** — which stats are affected by resource quality (from aspects data)

### Expandable Detail
Click a card to expand and see:
- Full aspect breakdown with property modifier ranges
- All mining locations for each required resource
- Link to mining calculator pre-filled with the resource

## Data Sources
- `crafting.ts` — blueprints with aspects, materials, craft time, obtainedFrom
- `mining-locations.ts` — ore → location mapping for "where to mine"
- No new API needed — all client-side

## Files to Create
- `client/src/app/tools/crafting/page.tsx`
- `client/src/app/tools/crafting/crafting.module.css`

## Files to Modify
- `client/src/components/nav/Navbar.tsx` — add "Crafting" to Tools dropdown

## Checklist
- [ ] Create crafting page with search and filters
- [ ] Build blueprint card component
- [ ] Cross-reference materials with mining locations
- [ ] Show blueprint sources (mission drops)
- [ ] Show quality modifier ranges per aspect
- [ ] Add to navbar
- [ ] Run all tests
