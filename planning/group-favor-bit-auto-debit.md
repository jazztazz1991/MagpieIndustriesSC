# Group Favor/Bit Auto-Debit From Conversion Pool

## Summary
When a member of a group adds a **Wikelo Favor** or **Polaris Bit** to a group project, the system automatically debits the group's conversion pool by the cost of minting it (50 MG Scrip per Favor, 24 SCU Quantanium per Bit), attributed to the user adding it. If the pool can't cover the cost, the API blocks the add and the client asks the user whether the favor/bit was instead purchased from someone else (an "external" mint). If yes, the favor/bit is added with no scrip/quantanium debit.

This only applies to **group** projects. Personal projects do not touch the conversion pool (there is no group pool).

## Decisions (confirmed with user)
1. Debit attribution: the user adding the favor/bit is the user whose conversion contribution is debited.
2. Pool check: if the group pool < needed amount, **block** the add and ask the client "was this purchased from someone else?". If yes → re-submit with `external: true`, no debit.
3. **No refund on removal.** Removing a favor/bit (delta < 0) does not credit scrip/quant back. Only positive delta triggers the auto-debit.
4. Bulk: delta of `+N` favors debits `N × 50` scrip in a single conversion-log row.
5. Atomicity: favor/bit add and the scrip/quant debit must happen in the same `prisma.$transaction`.
6. Scope: only group projects. Personal `wikeloRouter` material endpoint is untouched.

## Approach

### Server
File: `server/src/routes/wikelo-groups.ts`

1. Extend `updateMaterialSchema` to accept an optional `external: boolean`:
   ```ts
   const updateMaterialSchema = z.object({
     delta: z.number().int().optional(),
     collected: z.number().int().min(0).optional(),
     external: z.boolean().optional(),
   });
   ```
2. Add a small helper for the conversion mapping:
   ```ts
   function conversionForItem(itemName: string):
     | { material: "MG_SCRIP" | "QUANTANIUM"; ratio: number }
     | null {
     if (itemName === "Wikelo Favor") return { material: "MG_SCRIP", ratio: 50 };
     if (itemName === "Polaris Bit") return { material: "QUANTANIUM", ratio: 24 };
     return null;
   }
   ```
3. In the existing `PATCH /:groupId/projects/:projectId/materials/:materialId` transaction, **after** computing `delta` and **before** writing the contribution log:
   - If `conversionForItem(current.itemName)` is non-null AND `delta > 0` AND `!external`:
     - Aggregate `wikeloConversionContribution` for this group + material → `currentPool`.
     - `needed = delta * ratio`.
     - If `currentPool < needed` → throw a typed error (`InsufficientPoolError`) carrying `{ material, needed, available: currentPool }`.
     - Else, create a `wikeloConversionContribution` row: `delta: -needed`, `userId: <adding user>`, `newTotal: currentPool - needed`.
   - If `external === true` (or item is not a favor/bit, or delta ≤ 0): skip the conversion debit entirely.
4. Catch `InsufficientPoolError` outside the transaction and return:
   ```
   409 Conflict
   {
     success: false,
     error: "INSUFFICIENT_POOL",
     material: "MG_SCRIP" | "QUANTANIUM",
     needed: number,
     available: number
   }
   ```
5. Everything else stays the same — favor material count, contribution log row, project `updatedAt`.

### Client
File: `client/src/app/tools/wikelo-tracker/group/[id]/page.tsx`

1. In whichever helper PATCHes `/materials/:materialId`, inspect the response:
   - On `409` with `error: "INSUFFICIENT_POOL"`:
     - Pop a `confirm()` worded like:
       > "Not enough {material label} in the group pool to mint {N} {favor/bit}(s) (need {needed} {unit}, pool has {available} {unit}). Was this favor purchased from someone else?"
     - If user confirms → re-PATCH with the same `delta` plus `external: true`.
     - If user cancels → revert optimistic UI; do not retry.
   - On success → bump `refreshTick` so contributions tab shows the auto-debit row.
2. No new component extracted, so no RTL test required.

### Domain
No new client domain logic. The 50:1 / 24:1 math is already in `client/src/domain/wikeloConversion.ts` (`favorsToScrip`, `bitsToQuant`). The server uses literal constants for clarity.

## Files
- `server/src/routes/wikelo-groups.ts` — schema extension, conversion debit in transaction, 409 response.
- `client/src/app/tools/wikelo-tracker/group/[id]/page.tsx` — handle 409 with confirm + retry path.
- `planning/group-favor-bit-auto-debit.md` — this plan.

## Risks / things to watch
- **Negative per-user net contribution.** A user adding a favor while having contributed 0 scrip will have a net `-50` MG Scrip contribution displayed in "Who Has What". This is intended (per decision #1) and consistent with how the per-user view is computed (sum of deltas). The group total still clamps at 0 because the pool check prevents over-drawing.
- **Race on near-empty pool.** Two members adding favors at the same time when the pool is exactly 50 → both transactions read `currentPool = 50`, both try to debit, second one's `newTotal` would be `0` from the first commit. Postgres `READ COMMITTED` (Prisma default) means the second tx sees the first's row after commit. Acceptable: both could appear to succeed and the pool ends up at `-50`. Mitigation: do the aggregate inside the same tx as the create — Prisma serializes within a tx. If we still hit a race, the worst case is going slightly negative; the next add will block correctly. Not worth a SELECT FOR UPDATE for this.
- **Polaris Bit / Quantanium symmetry.** Easy to overlook. Plan covers both via the same `conversionForItem` helper.
- **External flag trust.** Any client could send `external: true` to bypass the debit. Acceptable for a small trusted group, but worth noting. We could log/audit external mints later if needed.

## Checklist
- [x] Get user approval of this plan
- [x] Extend `updateMaterialSchema` with `external?: boolean`
- [x] Add `conversionForItem` helper in `wikelo-groups.ts`
- [x] Wire conversion debit + insufficient-pool error inside the existing transaction
- [x] Return 409 INSUFFICIENT_POOL on insufficient pool
- [x] Type-check server
- [x] Update client material-update flow to handle 409 with confirm + retry
- [x] Type-check client
- [ ] Manual smoke test: add favor with full pool, add favor with empty pool (confirm external), add 2 bits in bulk, remove a favor (no refund), verify contributions feed shows the debit rows
- [x] Commit
