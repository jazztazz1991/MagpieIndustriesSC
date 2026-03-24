Add a new ore to the mining data. Ask the user for these details (provide sensible defaults where possible):

Required:
- **name**: Full ore name (e.g. "Quantanium")
- **abbrev**: 4-letter scanner abbreviation (e.g. "QUAN")
- **type**: "rock" | "gem" | "metal"
- **valuePerSCU**: Value in aUEC per SCU
- **instability**: Raw scanner instability number (0-1000+)
- **resistance**: Percentage (0-100)

Steps:
1. Read `client/src/data/mining.ts`
2. Add the new ore to the `ores` array, maintaining alphabetical order by name
3. Add the abbreviation to `scannerOreOrder` in the correct grid position (ask user where it goes, or append before INER)
4. Run `/verify` to confirm nothing broke

Rules:
- The `abbrev` must be exactly 4 characters, uppercase
- Do NOT add duplicate ores (check by name and abbrev first)
- The ore interface is defined in `client/src/data/mining.ts` - follow it exactly
- After adding, confirm the total ore count
