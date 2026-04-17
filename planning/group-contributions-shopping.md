# Group Contributions View + Shopping List Controls

## Summary
Two additions to the group detail page:
1. **"Who Has What" tab** — shows net contributions per member per item, aggregated from contribution logs
2. **Shopping list +/- buttons** — let members add/remove items from the group shopping list (same UX as personal shopping list)

## Approach

### 1. New API endpoint: `GET /api/wikelo/groups/:id/contributions`
- Aggregates `wikeloContributionLog` entries across all projects in the group
- Groups by `userId` + `itemName`, sums `delta` to get net contribution per person per item
- Returns: `{ data: [{ username, items: [{ itemName, net }] }] }`
- Uses `requireAuth` + `requireGroupMember` middleware

### 2. Shopping list +/- controls (client only)
- Add `-1` / `+1` buttons to each item row in the group shopping list
- Reuse the same distribute-to-first-source logic from the personal shopping list:
  - `+1` → find first project material that still needs it, PATCH that material
  - `-1` → find first project material with stock, PATCH that material
- The existing material PATCH endpoint already logs contributions, so "who has what" stays accurate

### 3. New "Contributions" tab on group detail page
- Third tab alongside "Projects" and "Activity Log"
- Shows each member as a section with their net contributions per item
- Only shows items with non-zero net contributions

## Files Modified
- `server/src/routes/wikelo-groups.ts` — new contributions endpoint
- `client/src/app/tools/wikelo-tracker/group/[id]/page.tsx` — shopping list buttons + contributions tab

### 4. Standardized material sort order
- Natural sort (alphabetical but with numeric suffixes in numeric order): e.g. RCMBNT-XTL-1, RCMBNT-XTL-2, RCMBNT-XTL-3
- Applied everywhere materials appear: shopping lists (personal + group), project material lists
- Implement as a `naturalSort` comparator function in a shared location (e.g. `client/src/lib/sort.ts`)
- No categories, no pinning — pure natural alpha-numeric sort

## Files Modified
- `server/src/routes/wikelo-groups.ts` — new contributions endpoint
- `client/src/lib/sort.ts` — new natural sort utility
- `client/src/app/tools/wikelo-tracker/group/[id]/page.tsx` — shopping list buttons + contributions tab + sort
- `client/src/app/tools/wikelo-tracker/page.tsx` — sort personal shopping list materials

## Checklist
- [x] Add natural sort utility
- [x] Add `GET /groups/:id/contributions` endpoint
- [x] Add +/- buttons to group shopping list
- [x] Add "Contributions" tab with per-member breakdown
- [x] Apply natural sort to all material lists
- [x] Type-check
