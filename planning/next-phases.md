# Next Development Phases

## Phase 1: Crafting Tool Page ✅ DONE
Searchable blueprint database with materials, mining locations, and blueprint sources.

---

## Phase 2: Mining Calculator Gadget Integration ✅ DONE
BoreMax, Okunis, OptiMax etc. affect viability assessment in the mining calculator.

---

## Phase 3: "Where Do I Find X?" Unified Search ✅ DONE
Single search page cross-referencing crafting, loot, missions, mining, and Wikelo contracts.

---

## Phase 4: UEX Live Prices Integration
**Goal:** Show real market prices from UEX API alongside our static DataForge data.

### Architecture
- Server-side proxy to UEX API (keeps API key secret, handles caching)
- 12-hour cache per item/commodity — once looked up, price is stored in DB
- Client fetches from our API, never hits UEX directly
- Graceful fallback to static DataForge values when UEX is unavailable

### API Proxy Endpoints (server)
- `GET /api/prices/commodity/:name` — commodity buy/sell prices across terminals
- `GET /api/prices/item/:id` — item prices at shops
- `GET /api/prices/fuel/:terminalId` — fuel prices
- `GET /api/prices/refinery/:terminalId` — refinery yields/capacities

### Caching Strategy
- DB table: `PriceCache { key, data (JSON), fetchedAt, expiresAt }`
- On request: check cache first (12h TTL), return cached if fresh
- On cache miss: fetch from UEX, store in DB, return
- Background: no proactive fetching — only cache on demand
- Rate limit awareness: 120 req/min max, track usage

### Where Prices Show Up
1. **Mining Calculator** — live ore sell prices instead of static valuePerSCU
2. **Where to Mine** — "Quantanium sells for X at [station]" per location
3. **Crafting Page** — "This item sells for X at [shop]" on blueprint cards
4. **Item Finder** — show market price in search results
5. **Refinery** — live commodity prices for profit calculations

### Files to Create
- `server/src/routes/prices.ts` — proxy endpoints with caching
- `server/prisma/schema.prisma` — PriceCache model
- `client/src/lib/prices.ts` — client-side price fetching hook

### Files to Modify
- `client/src/app/tools/mining/page.tsx` — show live ore prices
- `client/src/app/tools/mining-locations/page.tsx` — price per ore per location
- `client/src/app/tools/crafting/page.tsx` — item sell price
- `client/src/app/tools/item-finder/page.tsx` — price in results
- `client/src/app/tools/refinery/page.tsx` — live commodity prices

### Security
- API key stays server-side only (not NEXT_PUBLIC_)
- Proxy validates/sanitizes all parameters
- Rate limiting on our proxy to prevent abuse
- No raw UEX responses forwarded — map to our own DTOs

### Checklist
- [ ] Add PriceCache Prisma model + migration
- [ ] Build server proxy with 12h caching
- [ ] Add commodity price endpoint (by name)
- [ ] Add item price endpoint (by ID)
- [ ] Build client-side usePrices hook
- [ ] Integrate into mining calculator (ore sell prices)
- [ ] Integrate into where-to-mine page
- [ ] Integrate into crafting page (item sell value)
- [ ] Integrate into item finder results
- [ ] Integrate into refinery calculator
- [ ] Run all tests

### Estimated scope: Medium-Large

---

## Phase 5: Reputation & Law Pages
**Goal:** Make the extracted rep/law data browsable and useful.

### Features

**Reputation page:**
- Browse 22 organizations with their tier structures
- Show rep thresholds, what unlocks at each tier
- Which missions give rep for each org

**Law system page:**
- Browse crimes by jurisdiction
- Show fines, CrimeStat impact, penalties
- Compare jurisdictions (Hurston vs Crusader vs Pyro)
- "What happens if I do X?" lookup

### Files
- `client/src/app/tools/reputation/page.tsx`
- `client/src/app/tools/law/page.tsx`
- `client/src/components/nav/Navbar.tsx` — add nav links

### Dependencies
- `client/src/data/reputation.ts` (exists)
- `client/src/data/law.ts` (exists)

### Estimated scope: Medium

---

## Phase 6: Automation & Polish
**Goal:** Reduce manual work, improve UX.

### Features

**Auto patch detection:**
- Single command: `npm run data:update` — extracts, diffs, generates, reports changes
- Outputs markdown changelog automatically
- Optional: commit + push with changelog as commit message

**Wikelo tracker polish:**
- Mobile-responsive material rows
- Bulk +/- (add 5 at once)
- Sort shopping list by category
- Export shopping list as text (for Discord sharing)

**Station bonus crowdsourcing:**
- Let users submit refinery station bonuses from in-game screenshots
- Admin approval before data goes live
- Populates the empty Pyro station bonuses over time

### Estimated scope: Small per feature

---

## Suggested Order
1. ~~**Phase 1** (Crafting Page)~~ ✅
2. ~~**Phase 2** (Gadget Integration)~~ ✅
3. ~~**Phase 3** (Item Finder)~~ ✅
4. **Phase 4** (UEX Live Prices) — real market data, biggest user-facing upgrade
5. **Phase 5** (Rep & Law) — data exists, just needs UI
6. **Phase 6** (Polish) — ongoing, do pieces between phases
