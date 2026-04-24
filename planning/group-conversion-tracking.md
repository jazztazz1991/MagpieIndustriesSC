# Group Conversion Material Tracking

## Problem

The group shopping list has +/- buttons for MG Scrip and Quantanium
(conversion materials for Wikelo Favors and Polaris Bits). The
running total persists in `localStorage` per group — but it's a single
shared number with no per-member attribution. We can't see who added
what.

By contrast, regular project materials have full attribution via
`WikeloContributionLog` and surface in the "Who Has What" tab.

## Scope

Bring conversion materials up to parity with project materials:
- Track each +/- as a per-user contribution
- Move state from localStorage to the server
- Surface contributions in the existing "Who Has What" tab so
  per-member MG Scrip / Quantanium totals show up alongside item
  contributions
- Remove the localStorage `wikelo-group-${id}-conversion` key

## Approach

### New table: `WikeloConversionContribution`

```prisma
enum WikeloConversionMaterial {
  MG_SCRIP
  QUANTANIUM
}

model WikeloConversionContribution {
  id        String                    @id @default(cuid())
  groupId   String
  userId    String
  material  WikeloConversionMaterial
  delta     Int
  newTotal  Int                       // post-increment running total for the group
  createdAt DateTime                  @default(now())
  group     WikeloGroup               @relation(fields: [groupId], references: [id], onDelete: Cascade)
  user      User                      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([groupId, material, createdAt])
  @@index([userId, createdAt])
  @@map("wikelo_conversion_contributions")
}
```

`newTotal` is computed server-side at write time (sum of all prior
deltas for the group + material) so reads are O(1) for the running
total.

### Server endpoints

- `POST /api/wikelo/groups/:id/conversion` — body `{ material:
  "MG_SCRIP" | "QUANTANIUM", delta: number }`. Atomic increment with
  `GREATEST(0, current + delta)` semantics so we never go negative
  (matches the existing project-material race-fix pattern). Returns
  `{ material, total, delta }`.
- `GET /api/wikelo/groups/:id/conversion` — returns aggregate:
  `{ mgScrip: { total, byUser: [{ userId, username, net }] }, quantanium: { ... } }`.
- Existing `GET /groups/:id/contributions` (the "Who Has What" feed):
  extend to include conversion materials per user, so `MG Scrip` and
  `Quantanium` rows appear alongside item rows.

### Client changes (group detail page)

- Replace localStorage state with SWR-backed fetch from the new
  conversion endpoint. Same 3s polling cadence as the rest of the page.
- +/- handlers POST a delta; UI updates optimistically.
- Drop `mgScrip` / `quantanium` `useState` and the
  `wikelo-group-${id}-conversion` localStorage key.
- "Who Has What" tab: server already groups by user; new conversion
  contributions appear naturally in that grouping (filter by
  `material` field on the entry, treat it as an itemName for display
  e.g. "MG Scrip" or "Quantanium").

### Domain helpers

- `client/src/domain/wikeloConversion.ts` — pure helpers:
  - `materialLabel(m: ConversionMaterial): string`
  - `materialUnit(m): "scrip" | "SCU"`
  - `convertToFavors(scrip): number` (50 → 1)
  - `convertToBits(scu): number` (24 → 1)
- vitest tests for each.

## Files

### Server

- `server/prisma/schema.prisma` — model + enum
- `server/prisma/migrations/<date>_wikelo_conversion_contributions/migration.sql`
- `server/src/routes/wikelo-groups.ts` — add 2 endpoints; extend
  contributions endpoint

### Client

- `client/src/domain/wikeloConversion.ts` + vitest test
- `client/src/app/tools/wikelo-tracker/group/[id]/page.tsx` — swap
  localStorage for server state; surface conversion materials in
  contributions view

## Migration / cleanup

- One-time: existing localStorage values are abandoned. Users with
  saved values will start at 0 server-side. Acceptable — the values
  weren't shared across devices anyway, and per-member tracking was
  the missing feature all along.

## Risks

- **Atomic delta** — we already use `prisma.$transaction` with
  manual select-then-update in the project material route. Same
  pattern here; the existing race-fix tests apply.
- **Negative balance** — `GREATEST(0, current + delta)` clamps to 0.
  Decrement past 0 is a no-op (effective delta = -current).
- **"Who Has What" UI** — currently keyed by `itemName: string`. We'll
  use display strings ("MG Scrip", "Quantanium") so they sort
  alongside other items. No structural change to the tab.

## Checklist

- [ ] Prisma model + enum + migration
- [ ] `requireOrgPermission` / member-check on the new endpoints
- [ ] Domain helpers + vitest
- [ ] POST conversion endpoint with atomic increment
- [ ] GET conversion endpoint
- [ ] Extend contributions endpoint
- [ ] Wire up SWR + optimistic update in group detail page
- [ ] Remove localStorage path
- [ ] Type-check + vitest + Playwright smoke
