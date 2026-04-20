# Next Features Roadmap

Five candidate features. Each is self-contained — pick any order.

---

## 1. Cargo Hauling Profit Planner

**Goal:** Help players find the most profitable commodity routes between
terminals using live UEX prices.

### UX

- Page at `client/src/app/tools/cargo-hauling/page.tsx`
- Inputs: cargo capacity (SCU), optional starting location filter
- Output: ranked list of routes — "Buy X at A for $N/SCU, sell at B for $M/SCU,
  profit $P/SCU, profit per run $P × capacity"
- Filter by commodity, min profit per SCU, stock availability
- Optional "no quantum fuel cost subtract" checkbox (simple v1)

### Data

- UEX commodity_prices already returns buy/sell per terminal (we proxy it
  in `server/src/routes/prices.ts`)
- Need a new endpoint that aggregates best buy vs. best sell per commodity
  OR a new one that returns all commodity prices at once
- Cache: 12h via existing PriceCache

### New files

- `client/src/app/tools/cargo-hauling/page.tsx`
- `client/src/domain/hauling.ts` — route calculation + sorting (pure, testable)
- `client/src/domain/hauling.test.ts` — vitest
- `server/src/routes/prices.ts` — add `/api/prices/commodities/all` endpoint

### Estimated scope: Medium

---

## 2. Patch Notes Archive

**Goal:** Make the generated patch-notes markdown files browsable in-app
so users can see what changed across versions.

### UX

- Page at `client/src/app/patch-notes/page.tsx` — lists all versions
- Page at `client/src/app/patch-notes/[version]/page.tsx` — renders one version
- Each version shows: date, version string, rendered markdown
- Sort newest-first
- Link from navbar or home page

### Data

- Patch notes already exist as markdown files in `planning/` (e.g.
  `patch-notes-4.7.176.md`). Move them to `client/src/data/patch-notes/`
  as the canonical location.
- Parse the version/date from filename or frontmatter at build time
- Render markdown with `react-markdown` (already a dep? check)

### New files

- `client/src/app/patch-notes/page.tsx` — index
- `client/src/app/patch-notes/[version]/page.tsx` — detail
- `client/src/data/patch-notes/` — markdown storage
- `client/src/domain/patchNotes.ts` — list/parse helpers (pure, testable)
- `client/src/domain/patchNotes.test.ts` — vitest

### Estimated scope: Small

---

## 3. Public User Profile / "My Inventory"

**Goal:** Let users track ships/items they own and expose an optional public
profile page so orgs can do roll-calls.

### UX

- Private: `/profile/settings` to add/remove ships, weapons, armor from a
  personal inventory
- Public (if opted-in): `/u/:handle` shows username, rsiHandle, avatar,
  and owned ships
- Privacy: default private, opt-in via a "public profile" toggle

### Data model

- `UserInventoryItem` table: `{ id, userId, category ('ship'|'weapon'|'armor'|'other'),
  itemId, itemName, quantity, notes, createdAt }`
- `User.publicProfile Boolean @default(false)`

### API

- `GET /api/profile/inventory` — own inventory (auth required)
- `POST /api/profile/inventory` — add item
- `DELETE /api/profile/inventory/:id` — remove
- `GET /api/profile/public/:handle` — public profile (returns only if opted-in,
  no email, no private data)
- `PATCH /api/profile/settings` — toggle publicProfile flag

### Security

- Public endpoint never returns email, discordId, or private inventory fields
- Inventory reads gated by ownership
- Handle lookup is case-insensitive but otherwise exact match

### New files

- `server/prisma/schema.prisma` — model + migration
- `server/src/routes/profile.ts` — all profile endpoints
- `client/src/app/profile/settings/page.tsx` — edit inventory
- `client/src/app/u/[handle]/page.tsx` — public page
- `client/src/domain/inventory.ts` — grouping/filtering logic
- `client/src/domain/inventory.test.ts`

### Estimated scope: Large (DB + auth + public routing)

---

## 4. Mining Location Filter Upgrade

**Goal:** Improve the existing mining-locations page with better filters —
rarity tier, mission gate, ore group.

### Existing state

- `/tools/mining-locations` already lists locations. Currently filterable
  by ore name.

### Additions

- Rarity tier filter (Common → Instant, Uncommon, etc.)
- Mission gate filter: show only locations unlocked by mission X, or hide
  gated ones entirely (e.g. hide Carinite if user hasn't done Hathor)
- Ore group filter: by element (Laranite = Titanium group, etc.) — derives
  from the element field on each ore
- URL-hash state so filters survive page reload / sharing

### Files (modify)

- `client/src/app/tools/mining-locations/page.tsx`
- `client/src/domain/mining-locations.ts` — filter helpers (may not exist
  yet, move logic out of the page)
- `client/src/domain/mining-locations.test.ts`

### Estimated scope: Small

---

## 5. Refinery Station Bonus Crowdsourcing

**Goal:** Let users submit refinery station bonuses from in-game screenshots
so the dataset fills in over time (Pyro stations are currently empty).

### UX

- On `/tools/refinery`, a "Report Bonus" button next to each station
- Modal: select ore, method, yield %, optional screenshot upload
- Admin review queue at `/admin/refinery-submissions` — approve/reject
- Approved submissions override the static data; displayed with a
  "crowd-sourced" badge

### Data model

- `RefinerySubmission` table: `{ id, userId, stationId, ore, method, yield,
  screenshotUrl, status ('pending'|'approved'|'rejected'), reviewedBy,
  reviewedAt, createdAt }`
- Screenshot storage: S3 or similar (need infra decision) OR skip screenshots
  and make users paste numbers (simpler, less proof)

### API

- `POST /api/refinery/submit` — auth required
- `GET /api/refinery/submissions` — admin only, paginated
- `PATCH /api/refinery/submissions/:id` — admin approve/reject

### Security

- Admin-only endpoints behind `isAdmin` check
- Input validation: yield must be 0-100, ore must match a known ore,
  station must match a known station

### New files

- `server/prisma/schema.prisma` — model
- `server/src/routes/refinery-submissions.ts`
- `client/src/app/admin/refinery-submissions/page.tsx`
- `client/src/components/refinery/SubmissionModal.tsx`
- Modifications to `client/src/app/tools/refinery/page.tsx` to read
  approved submissions as overrides

### Estimated scope: Medium-Large (admin UI + moderation workflow)

---

## Recommended order

1. **Patch Notes Archive** (small, high user value, fast win)
2. **Mining Location Filter** (small, improves existing tool)
3. **Cargo Hauling Planner** (medium, brand-new tool, leverages UEX)
4. **Refinery Crowdsourcing** (medium-large, longer lead time before
   payoff — needs enough submissions to matter)
5. **Public Profile / Inventory** (largest scope, most schema work)
