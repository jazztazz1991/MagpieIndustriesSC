# Phase 6: Automation & Polish — Deep Plan

## 6A: Auto Patch Detection Pipeline

**Goal:** One command to extract, diff, generate, and report game data changes.

### Current Process (Manual)
1. User updates Star Citizen game
2. Run `bash scripts/extract-gamedata.sh` (extracts Data.p4k, converts DCB, extracts localization)
3. Run `npm run sync:generate` (generates 18 .ts data files)
4. Manually diff old vs new data
5. Manually write patch notes
6. Manually commit + push

### Automated Process
```bash
npm run data:update          # full pipeline
npm run data:update -- --dry-run   # show changes without writing
```

### Implementation
**Script:** `scripts/update-gamedata.ts`

1. **Extract** — run `extract-gamedata.sh` (calls unp4k + unforge)
2. **Generate with validation** — run generators in `--validate` mode first to see what changed
3. **Diff** — compare line counts and content changes per data file
4. **Generate for real** — write updated .ts files
5. **Changelog** — auto-generate markdown:
   - New version number
   - Files changed with line count diffs
   - New items added (compare arrays by name)
   - Items removed
   - Items modified (stat changes)
6. **Output** — write `planning/patch-notes-{version}.md`
7. **Optional** — `--commit` flag: stage, commit with changelog as message, push

### Key Comparisons to Detect
- New/removed ships (compare ship names array)
- New/removed ores (compare ore names)
- New/removed crafting blueprints (count diff)
- New/removed Wikelo contracts
- New/removed starmap locations
- Changed values (ore prices, laser stats, refinery yields)
- New localization entries count

### Files
- `scripts/update-gamedata.ts` — main pipeline script
- `package.json` — add `data:update` script

### Dependencies
- `scripts/extract-gamedata.sh` (exists)
- `scripts/generate-data.ts` (exists — has `--validate` mode)

### Estimated scope: Medium

---

## 6B: Wikelo Tracker Polish

**Goal:** Make the tracker mobile-friendly and faster to use.

### 6B-1: Mobile-Responsive Material Rows
- Current layout breaks on narrow screens (grid columns too wide)
- Stack material name above controls on mobile
- Progress bar full-width on mobile
- Touch-friendly +/- buttons (min 44px tap targets)

**Files:** `client/src/app/tools/wikelo-tracker/[id]/page.tsx`

### 6B-2: Bulk +/- Controls
- Long-press or hold button for rapid increment (auto-repeat after 500ms)
- +5 / +10 buttons alongside +1
- Input field already supports direct typing — add stepper buttons for 5/10

**Files:** `client/src/app/tools/wikelo-tracker/[id]/page.tsx`

### 6B-3: Shopping List Categories
- Group shopping list items by category:
  - Currencies (Wikelo Favor, Polaris Bit, Scrip)
  - Ores (Carinite, Quantanium, etc.)
  - Creature Drops (Fangs, Pearls, Eggs)
  - Loot (Medals, Comp-Boards, Secure Drives)
  - Equipment (Armor, Weapons)
- Collapsible category sections
- Category determined from wikelo gathering items data or item name patterns

**Files:** `client/src/app/tools/wikelo-tracker/page.tsx`

### 6B-4: Discord Export
- "Copy to Clipboard" button on shopping list
- Formats as Discord markdown:
```
**Shopping List** (3 active projects)
Overall: 8% — 721 items remaining

**Currencies**
- [ ] Wikelo Favor: 0/100
- [ ] Polaris Bit: 1/65

**Ores**
- [ ] Carinite: 0/70
- [x] ASD Secure Drive: 11/45
```
- Checkbox format for items (checked if complete)
- Grouped by category

**Files:** `client/src/app/tools/wikelo-tracker/page.tsx`

### 6B-5: Discord Bot Integration
- Discord slash commands for wikelo tracker:
  - `/wikelo add <item> <quantity>` — add items to active project
  - `/wikelo status` — show shopping list summary
  - `/wikelo projects` — list active projects
- Requires: Discord bot application, account linking (Discord ID → user), bot hosting
- Account linking: user already has Discord OAuth — just need to store Discord ID on user model
- Bot can call our existing API endpoints with the linked user's auth

**Files:**
- `server/src/routes/discord-bot.ts` (or separate bot service)
- `server/prisma/schema.prisma` — add discordId to User model
- Discord bot registration + slash command setup

### Estimated scope: Medium-Large (separate from other 6B items)

### Estimated scope: Small per sub-item (6B-1 through 6B-4)

---

## 6C: Station Bonus Crowdsourcing

**Goal:** Let users submit refinery station bonuses from in-game screenshots.

### Flow
1. User visits a refinery in-game, sees Material Specializations panel
2. On our site, navigates to Refinery page → "Submit Station Bonuses"
3. Selects station from dropdown
4. Enters ore name → bonus % for each specialization shown in-game
5. Submits — stored as pending in DB
6. Admin reviews submissions on admin page
7. Admin approves → bonuses merged into `data/overrides/refinery.json`

### Database
```prisma
model StationBonusSubmission {
  id          String   @id @default(cuid())
  userId      String
  stationName String
  bonuses     Json     // { "Quantanium": 3, "Gold": -2, ... }
  status      SubmissionStatus @default(PENDING)
  adminNotes  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(...)
}

enum SubmissionStatus {
  PENDING
  APPROVED
  REJECTED
}
```

### API
- `POST /api/station-bonuses` — submit (authenticated)
- `GET /api/station-bonuses/pending` — admin view
- `PATCH /api/station-bonuses/:id` — approve/reject (admin only)

### UI
- Submit form on refinery page (modal or separate section)
- Admin page: list pending submissions with approve/reject buttons
- Approved submissions auto-update refinery.json? Or manual merge?

### Concerns
- Validation: bonus percentages should be in reasonable range (-15 to +15)
- Duplicate handling: multiple submissions for same station → average or latest?
- Trust: require minimum account age or rep before submitting?

### Estimated scope: Medium

---

## 6D: General UX Polish (Additional Items)

### 6D-1: Loading States
- Add skeleton/loading states to pages that fetch data (wikelo tracker, prices)
- Currently shows blank or "Loading..." text
- Add shimmer placeholder cards

### 6D-2: Error Handling
- Graceful error display when API is unreachable
- "Server is waking up, please wait..." message for Render cold starts
- Retry buttons on failed fetches

### 6D-3: Dark/Light Theme Toggle
- Currently dark-only
- Add theme toggle in navbar
- CSS variables already structured for it

### 6D-4: Page Metadata (SEO)
- Add proper `<title>` and `<meta description>` per page
- OpenGraph tags for Discord/social link previews
- Favicon

### 6D-5: Keyboard Shortcuts
- Cmd/Ctrl+K already opens search palette
- Add: Escape to close modals
- Add: Arrow keys to navigate search results

### Estimated scope: Small each

---

## Suggested Order Within Phase 6
1. **6A** (Auto Patch) — biggest time-saver, do first
2. **6B-4** (Discord Export) — quick win, high value for org play
3. **6B-1** (Mobile) — many users on phones
4. **6B-2** (Bulk +/-) — quality of life
5. **6D-2** (Error Handling) — professionalism
6. **6D-4** (SEO/Meta) — discoverability
7. **6B-3** (Shopping Categories) — nice to have
8. **6C** (Station Crowdsource) — community feature, lower priority
9. **6D-3** (Themes) — cosmetic
10. **6D-1** (Loading States) — cosmetic
11. **6D-5** (Keyboard Shortcuts) — power users

## Checklist
- [ ] 6A: Auto patch detection pipeline
- [ ] 6B-1: Mobile-responsive wikelo tracker
- [ ] 6B-2: Bulk +/- controls
- [ ] 6B-3: Shopping list categories
- [ ] 6B-4: Discord export for shopping list
- [ ] 6C: Station bonus crowdsourcing
- [ ] 6D-1: Loading states / skeletons
- [ ] 6D-2: Error handling / retry
- [ ] 6D-3: Dark/light theme toggle
- [ ] 6D-4: Page metadata / SEO
- [ ] 6D-5: Keyboard shortcuts
