# Magpie Industries SC — Feature Map

Star Citizen companion app. Next.js App Router + Express + PostgreSQL + Prisma monorepo.

---

## Tools (11 pages)

### Mining Calculator — `/tools/mining`
4-tab calculator: Rock Scanner (input rock properties, assess viability), Profit Calculator (multi-ore batch yield/profit), Compare Lasers (ranked by composite score), Ore Reference (sortable table).
Includes FleetBuilder (multi-ship setups) and LoadoutBuilder (laser + module per head).
**Data:** `mining.ts`, `mining-lasers.ts`, `mining-gadgets.ts`, `mining-ships.ts`
**Domain:** `mining.ts` — `calculateMiningProfit()`, `assessRockViability()`, `compareLasersForRock()`
**Components:** `LoadoutBuilder`, `FleetBuilder`

### Refinery Optimizer — `/tools/refinery`
Compare refining methods by yield, time, and profit for ore batches.
**Data:** `refinery.ts`
**Domain:** `refinery.ts` — `calculateRefineryOutput()`

### Mining Locations — `/tools/mining-locations`
Two views: by location (filter by parent body/danger/ore) or by ore (which locations have it).
**Data:** `mining-locations.ts`, `mining.ts`

### Trade Route Planner — `/tools/trade`
Filter by commodity/location, shows profit per SCU.
**Data:** `trade.ts`
**Domain:** `trade.ts` — `findTradeRoutes()`

### Profit Simulator — `/tools/profit`
Configure activity parameters, run preset comparisons, ROI break-even analysis.
**Data:** `profitPresets.ts`
**Domain:** `profitSimulator.ts` — `simulateProfit()`, `compareActivities()`

### Salvage Calculator — `/tools/salvage`
Select a ship wreck, see RMC & material yields with price reference.
**Data:** `salvage.ts`
**Domain:** `salvage.ts` — `calculateSalvageProfit()`

### Ship Database — `/ships`
Grid display of all flyable ships. Filters by manufacturer/size/role, sortable. Expandable cards with full specs.
**Data:** `ships.ts`
**Components:** `ShipCard`

### Ship Comparison (old) — `/ships/compare`
Compare up to 3 ships side by side via dropdowns. Highlights best stat per row.
**Data:** `ships.ts`

### Ship Comparison (new) — `/tools/ship-compare`
Compare up to 4 ships with detailed stat table, filters, highlight best values. (Untracked, not committed)
**Data:** `ships.ts`
**Domain:** `shipComparison.ts` — `compareShips()`, `getStatWinner()`

### Loadout Planner — `/tools/loadout`
Select a ship, assign components (weapons/shields/QD/power/coolers) to slots, see summary stats.
**Data:** `loadout.ts`
**Domain:** `loadout.ts` — `calculateLoadoutSummary()`

### Inventory Notepad — `/tools/notepad`
Auth-required. Add/edit/delete items with total/sell/keep counts.
**Data:** Server-side (inventory-notes API)

---

## Guides (8 pages)

### Beginner Guide — `/guides/beginner`
Static guide: spawning, money-making, keybinds.

### Wikelo Contract Catalog — `/guides/wikelo`
Filterable contract list by tier/category. Shows requirements and rewards.
**Data:** `wikelo.ts`

### Wikelo Sub-pages
- `/guides/wikelo/reputation` — Reputation tier breakdown
- `/guides/wikelo/items` — Item gathering guide
- `/guides/wikelo/emporiums` — Banu trader locations
- `/guides/wikelo/rewards` — Contract reward reference
- `/guides/wikelo/favors` — Favor system explanation

### Wikelo Tracker — `/guides/wikelo/tracker`
Interactive progress tracker. Input inventory, see contract completion percentages.
**Data:** `wikelo.ts`
**Domain:** `wikeloTracker.ts` — `getContractProgress()`, `calculateFavorsFromInventory()`

---

## Community (6 pages)

### Friends — `/community/friends`
Send/accept/reject friend requests, view profiles.
**API:** `friends.ts`

### Groups — `/community/groups`
Create/browse groups, post within them, manage members.
**API:** `groups.ts`

### Feed — `/community/feed`
Social activity stream.
**API:** `activity.ts`

### Events — `/community/events`, `/community/events/[id]`, `/community/events/create`
Event listing, detail, creation with scheduling and RSVP.
**API:** `events.ts`

---

## Organizations (11 pages)

### Org Directory — `/orgs`
Search, filter, join orgs.

### Org Detail — `/orgs/[slug]`
Overview with members, description, stats.

### Org Management (auth + role-gated)
- `/orgs/[slug]/dashboard` — Leadership dashboard
- `/orgs/[slug]/fleet` — Fleet inventory
- `/orgs/[slug]/treasury` — Treasury ledger
- `/orgs/[slug]/recruitment` — Recruitment postings
- `/orgs/[slug]/operations` — Operations list
- `/orgs/[slug]/operations/[id]` — Operation detail
- `/orgs/[slug]/calendar` — Event calendar
- `/orgs/[slug]/guides` — Org-specific guides
- `/orgs/[slug]/guides/[guideId]` — Guide detail

**APIs:** `orgs.ts`, `fleet.ts`, `treasury.ts`, `recruitment.ts`, `operations.ts`, `org-activity.ts`, `org-announcements.ts`, `org-guides.ts`

---

## Admin (4 pages)

- `/admin` — Dashboard with stats, user management, reports, suggestions
- `/admin/craft-recipes` — Craft recipe reference
- `/admin/mission-recipes` — Mission recipe reference
- `/admin/data-browser` — Game data browser with override management (untracked)

---

## Other Pages

- `/` — Landing page with hero + 9 feature cards
- `/auth/signin`, `/auth/signup` — Auth forms + Discord OAuth
- `/profile` — Edit RSI Handle, bio, avatar
- `/locations` — Locations database (planets, moons, cities, stations, POIs)
- `/reports` — Bug report submission
- `/suggestions` — Feature suggestion submission

---

## Shared Infrastructure

### Components (`client/src/components/`)
| Component | Purpose |
|---|---|
| `Navbar` | Top nav, links, search button, user menu |
| `SearchPalette` | Cmd+K global fuzzy search |
| `ShipCard` | Expandable ship detail card |
| `LoadoutBuilder` | Multi-head mining setup |
| `FleetBuilder` | Multi-ship fleet config |
| `LoadingSkeleton` | Placeholder during load |
| `ErrorMessage` | Error banner |
| `ErrorBoundary` | React error boundary |
| `CommentSection` | Threaded comments (auth) |
| `ReportBugButton` | Floating bug report |

### Data Files (`client/src/data/` — 13 files)
All static TypeScript exports. Most auto-generated from Data.p4k via the extraction pipeline.

| File | Content | Lines |
|---|---|---|
| `mining.ts` | Ores, rock signatures, ordering | ~340 |
| `mining-lasers.ts` | Laser specs | ~120 |
| `mining-gadgets.ts` | Module specs | ~100 |
| `mining-ships.ts` | Mining ships | ~50 |
| `mining-locations.ts` | Named locations with ores | ~230 |
| `ships.ts` | All flyable ships | ~2,340 |
| `loadout.ts` | Components + slot configs | ~3,190 |
| `refinery.ts` | Methods + stations | ~110 |
| `wikelo.ts` | Contracts, items, emporiums | ~2,900 |
| `locations.ts` | Planets, moons, stations, POIs | varies |
| `salvage.ts` | Salvageable ships + materials | varies |
| `trade.ts` | Trade locations + commodities | varies |
| `profitPresets.ts` | Activity profit presets | varies |

### Domain Logic (`client/src/domain/` — 10 files, 113 tests)
Pure functions, no side effects. Each has a `.test.ts` file.

### Server API (`server/src/routes/` — 22 route files)
Express routers. JWT auth, Zod validation, DTO responses. Covers auth, game data, community, orgs, user data.

### Data Pipeline (`scripts/`)
`extract-gamedata.sh` → `generate-data.ts` → 9 generators in `scripts/generators/`.
Reads XML from Data.p4k extraction, applies JSON overrides from `data/overrides/`, outputs to `client/src/data/`.

### Auth
JWT tokens, role-based (user/admin/superAdmin), Discord OAuth.

---

## Potential Overlap / Bloat Candidates

- **Two ship compare pages** — `/ships/compare` (up to 3) and `/tools/ship-compare` (up to 4, with domain logic)
- **Community + Orgs** — 17 pages total, all server-dependent, unclear if any are actively used
- **Admin recipe pages** — `/admin/craft-recipes` and `/admin/mission-recipes` may be stubs
- **Old data-fetching hooks deleted** but `useOverrides` hook still fetches from server
- **Large data files** — `loadout.ts` (3,190 lines), `wikelo.ts` (2,900 lines), `ships.ts` (2,340 lines) are generated but still contribute to bundle size
- **Server routes** — 22 route files, many for community/org features that may not be in active use
