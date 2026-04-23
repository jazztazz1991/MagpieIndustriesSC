# Contracts Generator + P4K Hash Version Detection

## Summary

Two related improvements to the data pipeline:

1. **Contracts generator** — new extractor for `contracttemplates/` +
   `contractgenerator/`, with a public `/guides/contracts` page that
   lists every mission template grouped by category and issuer.
2. **P4K hash version detection** — replace `build_manifest.id`
   version reading (CIG doesn't always update that file on patches)
   with a content-derived identifier so we can tell patches apart
   even when the manifest is stale.

## Background

Today's 4.7.2 server-side patch added Nyx Mission Pack 2 (Courier,
Recover Cargo, Ship Wave Attack, Bounty Near Location, Bombing Run,
Paid Salvage). The XML files exist in the extracted dump:

- `contracts/contracttemplates/antibombingrun.xml`
- `contracts/contracttemplates/bounty_nearlocation.xml`
- 435 other templates

No generator reads that directory, so the patch shows as a no-op in
our pipeline. Meanwhile `build_manifest.id` wasn't rewritten by CIG,
so our version string thinks nothing changed.

## Part 1: Contracts generator

### Data sources

- **contracttemplates/*.xml** (437 files) — generic mission templates.
  Filename is the category (e.g. `bounty_nearlocation` → Bounty).
  `<ContractDisplayInfo illegal="0">` → lawful vs. unlawful.
- **contractgenerator/*.xml** (20 files + subdirs) — per-organization
  generators that pick templates with rewards/rep ranges. Examples:
  `constantinehurston_generator.xml`, `cdf_generator.xml`,
  `freedomfighters_generator.xml`, `rr_salvage.xml`.

### Extraction approach

Template-level extraction (v1):

- Parse filename into `{ id, category, subcategory }`:
  - `bounty_nearlocation` → `bounty` / `near_location`
  - `delivery_recovercargo` → `delivery` / `recover_cargo`
  - `combat_shipwave` → `combat` / `ship_wave`
- Read `ContractDisplayInfo illegal` → boolean.
- Read `owner` attribute (internal ID) — skip for now.

Generator-level extraction:

- For each generator XML, list the template references it uses.
- Pull the organization/faction name from the filename.

### Output: `client/src/data/contracts.ts`

```ts
export interface ContractTemplate {
  id: string;               // filename without .xml
  name: string;              // prettified label
  category: ContractCategory;
  subcategory: string | null;
  illegal: boolean;
  issuers: string[];         // generators that reference this template
}

export type ContractCategory =
  | "bounty" | "delivery" | "courier" | "combat" | "salvage"
  | "cargo" | "exploration" | "investigation" | "repair" | "other";

export const contractTemplates: ContractTemplate[] = [ /* 437 entries */ ];
export const contractsByCategory: Record<ContractCategory, ContractTemplate[]> = ...;
```

### UI: `/guides/contracts/page.tsx`

- Filter by category (Bounty, Delivery, Combat, etc.).
- Filter by issuer (CDF, Constantine Hurston, Freedom Fighters, etc.).
- Toggle lawful / unlawful.
- Card grid: one card per template with name, icon, issuers badge,
  lawful/unlawful badge.
- Search input for quick lookup.

### Domain module

- `client/src/domain/contracts.ts` — `categoryLabel`, `categorize`,
  filter helpers. Pure. Vitest-tested.

### Files

- `scripts/generators/contracts.ts` — new generator
- `scripts/generate-data.ts` — register it
- `client/src/data/contracts.ts` — generated output
- `client/src/domain/contracts.ts` + vitest tests
- `client/src/app/guides/contracts/page.tsx`
- Navbar link under Guides

## Part 2: P4K hash-based version detection

### Problem

`scripts/extract-gamedata.sh` reads `$VERSION` from
`build_manifest.id`. CIG doesn't always rewrite that file on patches
(today's 4.7.2 hotfix is proof). Result: the version label ends up
stale, raw-dump directory collision skips re-extraction, and the
pipeline can't tell patches apart.

### Fix

1. **Compute a content fingerprint** from `Data.p4k` file size + mtime
   concatenated with the manifest version. Example:
   `sc-alpha-4.7.0-4.7.178.8917+p4k-153800032256-2026-04-22T13:50`.
   Keeps backwards compat (manifest version stays at the front for
   readability) while distinguishing patches the manifest lies about.
2. **Prefer mtime over size** — a hotfix that keeps the same size but
   updates content (server-side config bundled into P4K) is the case
   we're trying to catch. mtime differentiates reliably.
3. **Always re-extract the raw dump** when the fingerprint differs,
   even if the bare version string matches.

### Files

- `scripts/extract-gamedata.sh` — replace the `VERSION` derivation.
- `scripts/update-gamedata.ts` — read the new fingerprint from
  `version.txt` when producing the diff and patch-notes filename.

### Patch-notes filename

- Keep `patch-notes-<version>.md` format.
- When manifest is stale, version will look like
  `4.7.178.8917+2026-04-22T13:50` — a bit ugly but unambiguous. User
  can rename manually to `patch-notes-4.7.2-hotfix.md` if desired.

## Risks / edge cases

- **Contract template count is high (437).** The generated
  `contracts.ts` will be large (~1500 lines). Mitigation: group by
  category; keep fields minimal.
- **Issuer mapping depends on generator-file parsing.** Some
  generators reference templates by UUID, not filename. Mitigation:
  build a UUID → filename index from templates' `__ref` attribute,
  then resolve references.
- **Some templates are dev/test (`notForRelease="1"`).** Skip those.
- **Filename categorization is fragile.** Unknown prefixes fall into
  `other`. Document the category mapping in the generator source.

## Checklist

### Part 1 — Contracts

- [ ] `scripts/generators/contracts.ts` (parse + prettify + category)
- [ ] Register in `scripts/generate-data.ts`
- [ ] `client/src/domain/contracts.ts` + vitest tests
- [ ] `client/src/data/contracts.ts` regenerated
- [ ] `client/src/app/guides/contracts/page.tsx` + RTL tests
- [ ] Navbar link under Guides
- [ ] Run `npm run data:update` to confirm extraction works

### Part 2 — Version detection

- [ ] `scripts/extract-gamedata.sh` — fingerprint in `VERSION`
- [ ] `scripts/update-gamedata.ts` — read fingerprint from
  `version.txt`, use in diff and patch-notes filename
- [ ] Manual re-run to verify today's patch now shows up correctly
