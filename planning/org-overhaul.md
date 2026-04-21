# Org + Community Overhaul

## Summary

Rebuild the org features end-to-end: navigation IA, ops planner with
ship seat layouts, real-time crew assignment, community tab, and every
page mobile-responsive. Scoped into five phases so we can ship
incrementally.

## High-level decisions (approved)

- **Scope:** full rebuild of `/orgs/[slug]/*` + `/community/*`. Friends
  and personal wikelo groups stay as they are (already solid).
- **Operations renamed to "Missions"** (shorter, more SC-native).
  Org-scoped `Event` model deprecated — Missions absorb it. Personal
  group events stay untouched.
- **Sidebar navigation** on all org pages (persistent left rail, one
  click to any section).
- **Seat layout:** schematic boxes v1, keep the door open for a 2D
  top-down view v2 (plan the data model so it can drive either
  render).
- **Real-time collab:** SWR polling at 3s interval during active
  mission-planning sessions. Upgrade path to Socket.IO reserved for
  later if needed.
- **Ship seat data:** extract from DataForge
  (`hardpoint_pilot_controller`, `hardpoint_turret_manned`,
  `hardpoint_weapon_mining`, `hardpoint_copilot`, etc.). Hand-curate
  friendly position labels for 10–15 popular ships. Smaller ships get
  typed generic labels ("Turret 1", "Copilot", "Crew Seat").

## Phase 1 — Navigation & UI shell

**Goal:** every org page lives inside a unified layout with a
persistent sidebar. Mobile-responsive from day 1.

- New layout component `client/src/app/orgs/[slug]/layout.tsx`:
  - Desktop: left sidebar (org name + sections) + main pane.
  - Mobile: sidebar collapses into a hamburger drawer.
  - Active section highlighted.
- Sections in sidebar: Overview, Missions, Fleet, Members, Treasury,
  Announcements, Guides, Recruitment, Settings.
- Overview page rebuild (`/orgs/[slug]`): member count, upcoming
  missions preview, fleet summary, recent announcements.
- Consistent header treatment (org logo, banner, motd badge).

**Files**

- `client/src/app/orgs/[slug]/layout.tsx` (new)
- `client/src/app/orgs/[slug]/page.tsx` (Overview — rebuild)
- `client/src/components/orgs/Sidebar.tsx` (new) + RTL test
- `client/src/components/orgs/OrgHeader.tsx` (new) + RTL test

## Phase 2 — Missions (Operations rebuild) + Ship Seat Layouts

**Goal:** turn Operations into a visual, collaborative mission planner.

### 2A. Ship seat data extraction

- `scripts/generators/ship-seats.ts` — new generator that parses
  DataForge `spaceships/*.xml` + `groundvehicles/*.xml`.
- For each ship, emit:
  ```ts
  interface ShipSeatDef {
    id: string;          // stable hardpoint ID from DataForge
    role: "pilot" | "copilot" | "turret" | "mining" | "engineer" | "missile" | "crew" | "cargo";
    label: string;       // curated friendly name OR generic "Turret 1"
    controls?: string[]; // other seats this one controls (remote turrets)
  }
  interface ShipLayout {
    shipId: string;      // matches ships.ts entry
    seats: ShipSeatDef[];
  }
  ```
- Output: `client/src/data/ship-seats.ts` (generated).
- Overrides file: `data/overrides/ship-seats.json` — curated labels
  for popular ships (MOLE, Polaris, Carrack, Caterpillar, Hammerhead,
  Tali, Reclaimer, C2 Hercules, Cutlass Black, Constellation Andromeda,
  Freelancer MAX, Corsair, Galaxy, Hull B). Generator merges overrides
  on top of auto-extracted data.

### 2B. Data model updates

- `CrewAssignment.position` (currently free-form string) →
  `seatId: string` referencing `ShipSeatDef.id`.
- New optional `notes: string?` on CrewAssignment.
- `Operation` renamed to `Mission` in the schema (with migration to
  preserve data). Endpoint paths under `/api/orgs/:orgId/missions/...`.
  Old `/operations` paths kept as thin redirects for one release.
- Drop `Event` model's `orgId` field (deprecate org-scoped events).
  Add a data migration to copy existing org-scoped events into
  Missions.

### 2C. Mission planner UI

- `/orgs/[slug]/missions` — list view with status filters, sort by
  start date.
- `/orgs/[slug]/missions/[id]` — detail view. Tabs:
  - **Crew**: for each `OperationShip`, render a `SeatLayout`
    component showing typed seat boxes. Click seat → member picker.
    Live updates via SWR 3s polling.
  - **Details**: name, description, start/end, objective.
  - **Roster**: flat list of assigned members for easy copy/paste.
- `SeatLayout` component:
  - Grouped boxes by role: Pilot, Copilot, Turrets, Mining, Engineers, Crew.
  - Each box: role icon + seat label + assigned member avatar (or "+
    Assign").
  - Color-coded by role.
  - Designed so the data model could also drive a top-down SVG layout
    in v2.

### 2D. Real-time collaboration

- Server: `GET /api/orgs/:orgId/missions/:id` returns full mission +
  ships + crew assignments with an `updatedAt` timestamp.
- Client: `useSWR` with `refreshInterval: 3000` on the mission detail
  page. Revalidate on focus.
- Optimistic UI on seat assignment: update local state instantly,
  rollback on failure.
- Assignment endpoint `PATCH
  /api/orgs/:orgId/missions/:missionId/ships/:shipId/seats/:seatId`
  body `{ userId: string | null, notes?: string }`.

**Files**

- `scripts/generators/ship-seats.ts`
- `data/overrides/ship-seats.json`
- `client/src/data/ship-seats.ts` (generated)
- `server/prisma/schema.prisma` (rename Operation→Mission, CrewAssignment.seatId, drop Event.orgId)
- `server/prisma/migrations/<date>_missions_rebrand/`
- `server/src/routes/missions.ts` (new, replaces operations.ts)
- `client/src/app/orgs/[slug]/missions/page.tsx`
- `client/src/app/orgs/[slug]/missions/[id]/page.tsx`
- `client/src/components/missions/SeatLayout.tsx` + RTL test
- `client/src/components/missions/AssignMemberModal.tsx` + RTL test
- `client/src/domain/missions.ts` — pure helpers (seat grouping, assignment validation) + vitest

## Phase 3 — Fleet + Members polish

**Goal:** clean up the other two high-traffic pages.

- Fleet: card grid with status filters (active/destroyed/loaned/in
  repair). Inline status edit. Link to assigned ship's seat layout.
- Members: sortable table with role, joined date, last seen. Bulk role
  assign. Invite code for private orgs.
- Permission enforcement: actually wire the `OrgRole.permissions`
  JSON to gate endpoints via a `requireOrgPermission(perm)` middleware.

**Files**

- `server/src/middleware/requireOrgPermission.ts` (new)
- `server/src/routes/orgs.ts` (gate existing endpoints)
- `client/src/app/orgs/[slug]/fleet/page.tsx` (rebuild)
- `client/src/app/orgs/[slug]/members/page.tsx` (new, split from settings)
- `client/src/domain/orgPermissions.ts` + vitest

## Phase 4 — Community tab overhaul

**Goal:** unified discovery + social.

- `/community` (new index): tabs for Feed / Orgs / Events / Groups.
- `/community/feed`: activity stream — public events, new orgs,
  friend actions, mission completions (respects privacy).
- `/community/orgs`: public org discovery, join button.
- `/community/events`: public events (non-org). Personal group events
  still live here.
- `/community/groups`: unchanged (personal groups).
- `/community/friends`: unchanged.
- Public profile integration: clicking a user anywhere links to `/u/:handle`.

**Files**

- `client/src/app/community/layout.tsx` (new tab shell)
- `client/src/app/community/page.tsx` (feed as default)
- `client/src/app/community/orgs/page.tsx` (moved from `/orgs/discover`)
- `client/src/components/community/FeedItem.tsx` + RTL test
- `server/src/routes/feed.ts` (new aggregated feed endpoint)
- `client/src/domain/feed.ts` + vitest

## Phase 5 — Treasury, Announcements, Guides

**Goal:** finish the long tail.

- Treasury: add category filter on transactions, running balance
  chart, CSV export.
- Announcements: pin limit (max 3), order pinned first, rich-text via
  ReactMarkdown.
- Guides: category navigation sidebar inside the guides tab, collapse
  large content, inline comment threads.

**Files**

- `client/src/app/orgs/[slug]/treasury/page.tsx` (rebuild)
- `client/src/app/orgs/[slug]/announcements/page.tsx` (rebuild)
- `client/src/app/orgs/[slug]/guides/page.tsx` (polish)
- `client/src/domain/treasury.ts` + vitest (running balance, category totals)

## Testing

- Every domain module has vitest unit tests.
- Every extracted JSX component has an RTL test covering visible
  behavior.
- Manual E2E via Playwright MCP against demoUser (demo1234).

## Risks & mitigations

- **Schema rename (Operation → Mission)** is disruptive. Mitigation:
  do the rename inside a single migration + update all references in
  one PR. Keep `/operations` URL redirects for one release.
- **Ship seat data gaps.** Some ships may have unusual hardpoint
  naming in DataForge. Mitigation: generator outputs a warning for
  ships it can't parse; they default to generic "Crew Slot"
  placeholders that can be hand-fixed via overrides later.
- **SWR polling load.** 3s polling across a large org could add
  request volume. Mitigation: only poll when mission-detail tab is
  visible (use `useSWR`'s `isVisible` check); server returns `304 Not
  Modified` via ETag when nothing changed.
- **Deprecating org-scoped Events risks data loss.** Mitigation:
  migration copies existing org-scoped events into Missions with
  status=COMPLETED before removing the foreign key.

## Phase order & rollout

Ship each phase on its own branch → PR → merge. No big-bang cutover.

1. **Phase 1 (Nav shell)** — small, makes every subsequent phase
   easier to demo. Days.
2. **Phase 2 (Missions + seats)** — the flagship feature. ~1.5 weeks.
3. **Phase 3 (Fleet + Members)** — smaller polish. Days.
4. **Phase 4 (Community)** — medium. Week.
5. **Phase 5 (Treasury + rest)** — low-priority polish. Days.

## Checklist

### Phase 1 — Nav shell

- [ ] `orgs/[slug]/layout.tsx` with sidebar
- [ ] `Sidebar.tsx` + RTL test
- [ ] `OrgHeader.tsx` + RTL test
- [ ] Mobile responsive (≤520px)
- [ ] Overview page rebuild

### Phase 2 — Missions + Seats

- [ ] `scripts/generators/ship-seats.ts`
- [ ] `data/overrides/ship-seats.json` (10–15 popular ships)
- [ ] Schema: rename Operation → Mission, add `seatId`
- [ ] Migration (incl. event deprecation data copy)
- [ ] `server/src/routes/missions.ts`
- [ ] Permission-gated endpoints
- [ ] Missions list + detail pages
- [ ] `SeatLayout` component + RTL test
- [ ] `AssignMemberModal` + RTL test
- [ ] `domain/missions.ts` + vitest
- [ ] SWR polling + optimistic updates

### Phase 3 — Fleet + Members

- [ ] Fleet page rebuild
- [ ] Members page split from settings
- [ ] `requireOrgPermission` middleware
- [ ] `domain/orgPermissions.ts` + vitest

### Phase 4 — Community

- [ ] Community layout + tabs
- [ ] Feed endpoint + page
- [ ] Public org discovery
- [ ] `FeedItem` + RTL test
- [ ] `domain/feed.ts` + vitest

### Phase 5 — Treasury + polish

- [ ] Treasury rebuild (filter, chart, export)
- [ ] Announcements rebuild
- [ ] Guides polish
- [ ] `domain/treasury.ts` + vitest
