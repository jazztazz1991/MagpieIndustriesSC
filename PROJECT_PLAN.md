# Magpie Industries SC — Project Plan

> A Star Citizen community web application for orgs, friend groups, and solo players.
> Inspired by uexcorp.space, built to go further with org management, group coordination, and mission guides.

---

## 1. App Hygiene

### 1.1 Project Name
- **App Name:** Magpie Industries SC
- **Domain:** _[TBD — e.g., magpieindustries.space]_
- **Tagline:** _[TBD — short phrase describing the app's purpose]_

### 1.2 Target Audience
- [ ] Solo players looking for tools and mission guides
- [ ] Friend groups coordinating play sessions
- [ ] Orgs managing members, roles, and operations
- _[Add more as needed]_

### 1.3 Branding & Identity
- **Logo:** _[TBD]_
- **Color Palette:** _[TBD — dark mode primary? accent colors?]_
- **Typography:** _[TBD]_
- **Tone of Voice:** [ ] In-universe lore-friendly

### 1.4 Accessibility & Standards
- [ ] WCAG 2.1 AA compliance target
- [ ] Mobile-first responsive design
- [ ] Keyboard navigation support
- [ ] Screen reader friendly
- _[Add or remove as needed]_

### 1.5 Legal / Compliance
- **Privacy Policy:** _[TBD]_
- **Terms of Service:** _[TBD]_
- **Data Retention Policy:** _[TBD]_
- **Star Citizen IP/Fan Site Guidelines:** _[TBD — review CIG's fan content policy]_

---

## 2. Architecture

### 2.1 Tech Stack
| Layer    | Technology                          | Notes                           |
|--------- |------------------------------------ |---------------------------------|
| Frontend | Next.js 15 (React 19, SSR)          | App Router, TypeScript          |
| Backend  | Express 5 (Node, TypeScript)        | REST API on port 3001           |
| Database | PostgreSQL 16 + Prisma 6            | ORM with migrations             |
| Auth     | JWT + Discord OAuth + Credentials   | bcrypt password hashing         |
| Hosting  | Render                              |                                 |
| CDN      | _[TBD — Cloudflare, etc.]_          |                                 |
| CI/CD    | GitHub Actions                      |                                 |
| Monorepo | npm workspaces                      | `client/`, `server/`, `shared/` |

### 2.2 Data Sources

**Primary: Game file datamining**
- SC stores game data in `.p4k` archives in the install directory
- Tools like **sctool** or **StarFab** unpack these into readable XML/JSON
- Data lives under `Data/Libs/Foundry/Records/` once extracted
- Covers: commodity prices, ore compositions, refinery yields/times, ship specs, weapon/component stats, item properties, location data
- Caveat: must re-extract after each patch; some values are server-side only (dynamic pricing, live inventory)

**Secondary: Existing community APIs & datasets**
- [ ] **scunpacked** — pre-parsed game data (good starting point to reduce maintenance)
- [ ] **UEX API** (if public / with permission)
- [ ] **starcitizen.tools** wiki data
- [ ] **sc-trade.tools** — trade/commodity data

**Tertiary: Community-contributed**
- [ ] User-submitted tips, strategies, and corrections
- [ ] Community-reported dynamic prices and availability

**Strategy:** Start with existing community-parsed data (less maintenance). Build a custom `.p4k` extraction pipeline later for data nobody else provides. Layer community contributions on top for real-time/dynamic info.

> **Note:** CIG generally tolerates datamining for community tools, but review their current ToS before publishing.

### 2.3 Authentication & Roles
| Role            | Description                                    |
|---------------- |------------------------------------------------|
| Visitor         | Browse public tools, guides, and info          |
| Registered User | Save preferences, join groups, bookmark guides |
| Group Member    | Access shared group dashboards and planning    |
| Org Member      | Access org tools, rosters, event scheduling    |
| Org Leader      | Manage org settings, members, roles            |
| Admin           | Full site administration                       |
| _[Add more]_    |                                                |

### 2.4 High-Level Architecture Diagram
```
  [Next.js SSR Client :3000] <---> [Express API :3001]
                                        |         |
                                  [PostgreSQL]  [External APIs]
                                    (Prisma)    (future: scunpacked, UEX)
```

### 2.5 Key Architecture Decisions

- **Monorepo** with npm workspaces (`client/`, `server/`, `shared/`)
- **JWT-based auth** — stateless tokens, 7-day expiry, stored in localStorage
- **SSR via Next.js App Router** — server components for SEO, client components for interactivity
- **Static game data** for MVP calculators — will migrate to DB/API sourcing later
- _[TBD — real-time features via WebSockets or polling?]_
- _[TBD — image/file storage strategy]_
- _[TBD — caching strategy]_

---

## 3. Key Features

### 3.1 Community & Social

| Feature                  | Priority | Status  | Notes                              |
|------------------------- |--------- |-------- |------------------------------------|
| User profiles            | H        | MVP    | RSI handle linking, avatar, bio    |
| Friend lists             | _[H/M/L]_| _[TBD]_|                                    |
| Group creation           | _[H/M/L]_| _[TBD]_| Casual friend groups, not full orgs|
| Org pages                | _[H/M/L]_| _[TBD]_| Public-facing org profile & roster |
| Org management dashboard | _[H/M/L]_| _[TBD]_| Member roles, permissions, settings|
| Event scheduling         | _[H/M/L]_| _[TBD]_| For orgs and friend groups         |
| In-app messaging / chat  | _[H/M/L]_| _[TBD]_|                                    |
| Activity feed            | _[H/M/L]_| _[TBD]_|                                    |
| _[Add more]_             |          |         |                                    |

### 3.2 Tools (Inspired by UEX)

| Feature                | Priority   | Status  | Notes                                            |
| ---------------------- | ---------- | ------- | ------------------------------------------------ |
| Trade route planner    | _[H/M/L]_ | _[TBD]_  | Commodity prices, profit calc                    |
| Ship/vehicle database  | H          | Done    | Specs, pricing, comparisons                      |
| Loadout planner        | _[H/M/L]_ | _[TBD]_  | Ship component fitting                           |
| **Mining calculator**  | H          | Done    | Ore composition input, profit per SCU output     |
| **Salvage calculator** | H          | Done    | RMC values, material yields, profit estimates    |
| **Refinery optimizer** | H          | Done    | Compare methods by time, yield, and profit       |
| Profit simulator       | _[H/M/L]_ | _[TBD]_  | Investment vs income, ROI tracking               |
| _[Add more]_           |            |         |                                                  |

### 3.3 Wikelo Mission Guides

> **What are Wikelo missions?** Wikelo is a Banu trader in the Stanton system — the first non-human NPC
> in Star Citizen. He operates collection contracts where players gather items and trade them for rewards
> (ships, weapons, armor, components). Contracts are accessed at three Wikelo Emporium stations:
> **Dasi Station** (Hurston), **Selo Station** (Yela), and **Kinga Station** (microTech).
>
> **Reputation tiers:** New Customer → Very Good Customer → Very Best Customer.
> Higher ranks unlock better contracts and exclusive rewards.

| Feature                      | Priority | Status  | Notes                          |
|----------------------------- |--------- |-------- |--------------------------------|
| Contract catalog             | _[H/M/L]_| _[TBD]_| Full list of Wikelo contracts with requirements & rewards |
| Reputation progression guide | _[H/M/L]_| _[TBD]_| How to rank up through the 3 tiers efficiently |
| Item gathering walkthroughs  | _[H/M/L]_| _[TBD]_| Where to find each required item (fauna, ore, scrip, etc.) |
| Emporium location guides     | _[H/M/L]_| _[TBD]_| Maps/directions to Dasi, Selo, Kinga stations |
| Reward database              | _[H/M/L]_| _[TBD]_| Ships, weapons, armor, components — with specs |
| Favor economy breakdown      | _[H/M/L]_| _[TBD]_| How Wikelo Favors work as currency, best conversion paths |
| Recommended loadouts         | _[H/M/L]_| _[TBD]_| Ships & gear for gathering (Ursa Rover, Prospector, etc.) |
| Seasonal/rotating contracts  | _[H/M/L]_| _[TBD]_| Track which contracts are active vs inactive |
| Tips & strategies            | _[H/M/L]_| _[TBD]_| Optimal routes, time-saving tricks |
| Community comments / tips    | _[H/M/L]_| _[TBD]_| User-submitted additions       |
| _[Add more]_                 |          |         |                                |

### 3.4 Org & Group Tools

| Feature                      | Priority | Status  | Notes                          |
|----------------------------- |--------- |-------- |--------------------------------|
| Shared fleet tracker         | _[H/M/L]_| _[TBD]_| Who owns what ships            |
| **Crew assignment board**    | _[H/M/L]_| _[TBD]_| Assign members to ship crew positions per operation (see below) |
| Operation planner            | _[H/M/L]_| _[TBD]_| Multi-crew mission coordination, ties into crew assignments |
| Role assignment system       | _[H/M/L]_| _[TBD]_| Custom org ranks & permissions |
| Org treasury / fund tracker  | _[H/M/L]_| _[TBD]_|                                |
| Recruitment board            | _[H/M/L]_| _[TBD]_| Orgs looking for members       |
| _[Add more]_                 |          |         |                                |

> **Crew Assignment System — Detail**
>
> Orgs list their available ships for an operation, then assign members to crew positions.
> Each ship gets its own crew roster. Members see their assignment, ship, and role at a glance.
> Org leaders drag-and-drop or assign members to open slots.
>
> Operations are built from **operation templates** based on type. Each template defines
> relevant roles. Ships can be mixed (industrial + security escort, etc.).
>
> ---
>
> **General Ship Roles** (available across all operation types)
>
> | Position             | Description                                        |
> |--------------------- |----------------------------------------------------|
> | Captain / Pilot      | Commands the ship, handles flight                  |
> | Co-Pilot             | Assists with navigation and flight ops             |
> | Flight Operations    | Coordinates fleet movement and comms               |
> | Engineer             | Manages power, shields, and repairs                |
> | Gunner               | Operates turrets and weapon systems                |
> | Hangar Services      | Pre-flight loadout, refuel, rearm, repair          |
> | Medical              | Crew recovery and support                          |
>
> ---
>
> **Mining Operation Roles** (single ship or multi-ship fleet)
>
> | Position             | Description                                        |
> |--------------------- |----------------------------------------------------|
> | Mining Lead          | Coordinates scan targets and extraction priority   |
> | Laser Operator       | Operates mining lasers on multi-crew ships (Mole)  |
> | Scan Operator        | Runs prospecting scans, identifies valuable rocks  |
> | Refinery Coordinator | Manages refinery jobs and method selection          |
> | Hauler / Transport   | Ferries refined ore from refinery to sell point     |
>
> ---
>
> **Salvage Operation Roles**
>
> | Position             | Description                                        |
> |--------------------- |----------------------------------------------------|
> | Salvage Lead         | Coordinates salvage targets and priorities         |
> | Salvage Operator     | Operates salvage beams (Reclaimer, Vulture)        |
> | Hull Scraper         | Manual FPS salvage / EVA hull stripping            |
> | Material Transport   | Hauls salvaged materials to sell point             |
>
> ---
>
> **Cargo / Hauling Operation Roles**
>
> | Position             | Description                                        |
> |--------------------- |----------------------------------------------------|
> | Cargo Lead           | Plans route, manages buy/sell decisions            |
> | Loadmaster           | Oversees cargo loading and manifest                |
> | Cargo Handler        | Loads/unloads freight at terminals                 |
> | Freighter Pilot      | Flies the cargo ship                               |
>
> ---
>
> **Security / Escort Roles** (attachable to any operation type)
>
> | Position             | Description                                        |
> |--------------------- |----------------------------------------------------|
> | Security Lead        | Coordinates escort fleet and threat response       |
> | Escort Pilot         | Flies dedicated escort fighter/gunship             |
> | Ship Gunner          | Turret operator on industrial or escort ships      |
> | Ground Security      | FPS protection at landing zones or boarding defense|
> | Overwatch / Scout    | Advance recon, monitors for incoming threats       |
>
> ---
>
> **Combat Operation Roles**
>
> | Position             | Description                                        |
> |--------------------- |----------------------------------------------------|
> | Fleet Commander      | Overall tactical command of the operation          |
> | Wing Lead            | Commands a sub-group of fighters                   |
> | Bomber Pilot         | Flies torpedo/bomber runs on capital targets       |
> | Landing Crew         | Ground team for boarding, FPS, or objective ops    |
> | SAR / Medevac        | Search and rescue, downed pilot recovery           |
>
> ---
>
> _Roles are mix-and-match. An org can combine mining + security for a protected mining op,
> or cargo + escort for a guarded hauling run. Templates are customizable per org._

### 3.5 Resources & Reference

| Feature                      | Priority | Status  | Notes                          |
|----------------------------- |--------- |-------- |--------------------------------|
| Locations database           | _[H/M/L]_| _[TBD]_| Planets, stations, POIs        |
| Commodity price index        | _[H/M/L]_| _[TBD]_|                                |
| Patch notes / changelog      | _[H/M/L]_| _[TBD]_| Track SC updates               |
| Beginner's guide             | _[H/M/L]_| _[TBD]_|                                |
| FAQ / known workarounds      | _[H/M/L]_| _[TBD]_|                                |
| _[Add more]_                 |          |         |                                |

---

## 4. Milestones & Phases

### Phase 1 — MVP (Core Tools & Auth)
> Get the foundation live: auth, basic profiles, and the most useful standalone tools.
- [x] Project scaffolding (React, Node, PostgreSQL, OAuth)
- [x] User authentication & basic profiles (RSI handle, avatar, bio)
- [x] Mining calculator (ore composition input, profit per SCU output)
- [x] Salvage calculator (RMC values, material yields)
- [x] Refinery optimizer (compare methods by time, yield, profit)
- [x] Ship/vehicle database (specs, pricing, comparisons)
- [x] Responsive dark-mode UI with lore-friendly branding

### Phase 2 — Guides & Content
> Add the knowledge layer — Wikelo guides, trade tools, and reference data.
- [x] Wikelo contract catalog (full list with requirements & rewards)
- [x] Wikelo reputation progression guide
- [x] Item gathering walkthroughs (locations for fauna, ore, scrip)
- [x] Emporium location guides (Dasi, Selo, Kinga)
- [x] Reward database (ships, weapons, armor with specs)
- [x] Favor economy breakdown
- [x] Trade route planner (commodity prices, profit calc)
- [x] Locations database (planets, stations, POIs)
- [x] Beginner's guide

### Phase 3 — Community & Social
> Let users connect — friend groups, activity feeds, and shared content.
- [x] Friend lists
- [x] Group creation (casual friend groups)
- [x] Event scheduling (for groups)
- [x] Activity feed
- [x] Community comments / tips on guides
- [x] Loadout planner (ship component fitting)
- [x] Profit simulator (investment vs income, ROI)

### Phase 4 — Org Tools
> Full org support — management dashboards, fleet tracking, and recruitment.
- [x] Org pages (public/private toggle, profile & roster)
- [x] Org management dashboard (member roles, permissions, settings)
- [x] Shared fleet tracker (who owns what ships)
- [x] Crew assignment board (assign members to ship positions per operation)
- [x] Operation planner (multi-crew mission coordination, tied to crew assignments)
- [x] Role assignment system (custom org ranks & permissions)
- [x] Org treasury / fund tracker
- [x] Recruitment board
- [x] Event scheduling (org-level)

### Phase 5 — Real-Time & Scale
> Add live features, polish performance, and harden for growth.
- [ ] Real-time features (scope TBD — chat, notifications, live tracking)
- [ ] In-app messaging / chat
- [ ] Seasonal/rotating Wikelo contract tracker
- [ ] CDN setup & caching optimization
- [ ] Performance audits & load testing
- [ ] Patch notes / changelog tracking for SC updates
- [ ] FAQ / known workarounds

---

## 5. Open Questions

> Things we still need to decide or research.

- [x] ~~What are Wikelo missions?~~ — Resolved. Banu trader collection contracts. See Section 3.3.
- [x] ~~Should orgs be able to set their pages to private or public?~~ — Yes, orgs can toggle visibility.
- [ ] **Real-time features** — Exploring options (chat, live fleet tracking, notifications, etc.). Need to decide scope and tech (WebSockets, SSE, polling).
- [x] ~~Data sourcing strategy~~ — Resolved. Game file datamining + community APIs + user contributions. See Section 2.2.
- [ ] _[Monetization strategy? (free, donations, premium tiers)]_
- [ ] _[Add more]_

---

_Last updated: 2026-03-10_
