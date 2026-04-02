# Mining Calculator — Quality Tier Update

## Summary
Rocks now display ore composition with quality ratings (RAW 0-1000). The same ore can appear multiple times at different qualities. Quality affects crafting output and sale price. 500 = shop average. The calculator needs to support this new system.

## What Changes

### Data Model
- Rock composition entries become `{ ore, percentage, quality }` instead of just `{ ore, percentage }`
- Same ore can appear multiple times at different qualities (e.g., 4% Quantanium RAW 18 + 82% Quantanium RAW 202)
- Quality scale: 0-1000 (500 = baseline shop quality)

### Rock Scanner Tab
- Each composition row needs a quality input (0-1000) alongside the percentage
- Allow duplicate ore entries (same ore, different quality)
- Display quality with color coding: red (<250), yellow (250-499), white (500), green (501-750), blue (>750)
- "Add Ore Row" button instead of just toggle checkboxes

### Profit Calculator
- Quality affects value: higher quality = higher sale price
- Proposed formula: `adjustedValue = baseValuePerSCU × (quality / 500)`
  - RAW 500 = 1.0× (baseline)
  - RAW 250 = 0.5×
  - RAW 750 = 1.5×
  - RAW 1000 = 2.0×
- Show per-row value with quality adjustment
- Show weighted average quality across all rows of same ore

### Domain Logic Changes
- `calculateMiningProfit()` needs quality parameter per ore entry
- New interface: `RockCompositionEntry { ore: string; percentage: number; quality: number }`
- New function: `qualityMultiplier(quality: number): number` — returns value multiplier
- Update `analyzeRock()` to factor quality into worth assessment

### What Stays the Same
- Viability assessment (crack/no-crack) — quality doesn't affect rock resistance/instability
- Laser comparison — unchanged
- Fleet builder — unchanged
- Ore reference tab — show base value (quality 500)

## Files to Modify
- `client/src/domain/mining.ts` — Add quality multiplier, update profit calc
- `client/src/domain/mining.test.ts` — Tests for quality calculations
- `client/src/app/tools/mining/page.tsx` — UI changes for quality input

## Quality Data from DataForge
- `defaultCompositionQuality: 500` (baseline)
- `refiningQualityUnitMultiplier: 2` (refining doubles quality score)
- Quality distribution is normal curve per rarity (min 501, max 1000, mean ~105-121)
- No explicit price curve found — using linear scaling: `value × (quality / 500)`
- Quality persists through refining (user confirmed)

## Refinery Calculator Update
- Add quality input per ore in refinery batch
- Refined output retains quality (× refiningQualityUnitMultiplier if applicable)
- Show quality-adjusted profit in method comparison

## Files NOT Modified
- Data files (mining.ts values stay as base/quality-500 values)
- Fleet builder components

## Checklist
- [x] Add quality multiplier function + tests to domain/mining.ts
- [x] Update RockCompositionEntry interface to include quality
- [x] Update calculateMiningProfitWithQuality — quality-aware profit calc
- [x] Update analyzeRock to accept quality parameter
- [x] Update Rock Scanner UI — row-based with ore/percentage/quality inputs
- [x] Remove Profit Calculator tab (user requested — scanner handles it)
- [x] Color-code quality values in UI (red/yellow/white/green/blue)
- [x] Update Refinery Calculator — quality input per ore batch entry
- [x] Run all tests — 137 passing
