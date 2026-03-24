Update a mining data file from CSV or spreadsheet data provided by the user.

Ask the user:
1. **Which data type?** (lasers, active modules, passive modules, gadgets, refinery methods, refinery stations, ores, rock signatures)
2. **Paste the data** (CSV, tab-separated, or markdown table)

Then:
1. Read the current data file for that type:
   - Lasers: `client/src/data/mining-lasers.ts`
   - Modules/Gadgets: `client/src/data/mining-gadgets.ts`
   - Refinery: `client/src/data/refinery.ts`
   - Ores: `client/src/data/mining.ts`

2. Parse the pasted data, matching columns to the TypeScript interface fields

3. Show a summary of changes BEFORE writing:
   - New items being added
   - Existing items being updated (show old vs new values)
   - Items being removed (if any)

4. Ask for confirmation before writing

5. After writing, run `/verify` to confirm nothing broke

Rules:
- Preserve the existing TypeScript interface - do NOT change field names or types
- If the CSV has columns that don't map to existing fields, flag them and ask
- If existing items are missing from the new data, ask before removing them
- Use the exact values from the spreadsheet - do not round or modify numbers
- Prices with commas and dollar signs should be parsed to plain numbers
- Percentage values like "135.0%" should be stored as the number 135
