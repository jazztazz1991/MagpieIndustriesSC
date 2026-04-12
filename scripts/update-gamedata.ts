/**
 * Auto patch detection pipeline.
 * Extracts game data, generates TypeScript files, diffs changes, and writes patch notes.
 *
 * Usage:
 *   npm run data:update                    # Full pipeline
 *   npm run data:update -- --skip-extract  # Skip extraction, just regenerate + diff
 *   npm run data:update -- --diff-only     # Only show what would change
 */
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const args = process.argv.slice(2);
const SKIP_EXTRACT = args.includes("--skip-extract");
const DIFF_ONLY = args.includes("--diff-only");

const ROOT = path.resolve(__dirname, "..");
const CLIENT_DATA = path.join(ROOT, "client", "src", "data");
const PLANNING = path.join(ROOT, "planning");

function run(cmd: string, opts?: { cwd?: string }): string {
  console.log(`  > ${cmd}`);
  return execSync(cmd, { encoding: "utf-8", cwd: opts?.cwd || ROOT, stdio: "pipe" }).trim();
}

function runVisible(cmd: string): void {
  console.log(`  > ${cmd}`);
  execSync(cmd, { cwd: ROOT, stdio: "inherit" });
}

// --- Step 1: Get current version ---
const SC_EXTRACTED = process.env.SC_EXTRACTED_PATH || "D:\\StarCitizen\\extracted";
const versionFile = path.join(SC_EXTRACTED, "parsed", "version.txt");
const oldVersion = fs.existsSync(versionFile) ? fs.readFileSync(versionFile, "utf-8").trim() : "unknown";
console.log(`\nCurrent version: ${oldVersion}`);

// --- Step 2: Snapshot current data files ---
interface DataSnapshot {
  [filename: string]: { lines: number; content: string };
}

function snapshotData(): DataSnapshot {
  const snap: DataSnapshot = {};
  const files = fs.readdirSync(CLIENT_DATA).filter((f) => f.endsWith(".ts"));
  for (const file of files) {
    const content = fs.readFileSync(path.join(CLIENT_DATA, file), "utf-8");
    snap[file] = { lines: content.split("\n").length, content };
  }
  return snap;
}

const beforeSnap = snapshotData();
console.log(`Snapshot: ${Object.keys(beforeSnap).length} data files\n`);

// --- Step 3: Extract (optional) ---
if (!SKIP_EXTRACT) {
  console.log("=== Extracting game data from Data.p4k ===");
  try {
    runVisible("bash scripts/extract-gamedata.sh");
  } catch (err) {
    console.error("Extraction failed:", err);
    process.exit(1);
  }
  console.log("");
}

// Get new version
const newVersion = fs.existsSync(versionFile) ? fs.readFileSync(versionFile, "utf-8").trim() : "unknown";
console.log(`New version: ${newVersion}`);
if (newVersion === oldVersion && !SKIP_EXTRACT) {
  console.log("Version unchanged — no game update detected.");
}
console.log("");

// --- Step 4: Generate data ---
if (!DIFF_ONLY) {
  console.log("=== Generating data files ===");
  runVisible("npx ts-node --project scripts/tsconfig.json scripts/generate-data.ts");
  console.log("");
}

// --- Step 5: Diff ---
const afterSnap = snapshotData();

interface FileDiff {
  filename: string;
  oldLines: number;
  newLines: number;
  lineDiff: number;
  changed: boolean;
  added: boolean;
  removed: boolean;
}

const diffs: FileDiff[] = [];
const allFiles = new Set([...Object.keys(beforeSnap), ...Object.keys(afterSnap)]);

for (const file of allFiles) {
  const before = beforeSnap[file];
  const after = afterSnap[file];

  if (!before && after) {
    diffs.push({ filename: file, oldLines: 0, newLines: after.lines, lineDiff: after.lines, changed: true, added: true, removed: false });
  } else if (before && !after) {
    diffs.push({ filename: file, oldLines: before.lines, newLines: 0, lineDiff: -before.lines, changed: true, added: false, removed: true });
  } else if (before && after) {
    const changed = before.content !== after.content;
    // Only count as changed if more than just the version string changed
    const contentChanged = changed && before.content.replace(/sc-alpha-[\d.\-\w]+/, "") !== after.content.replace(/sc-alpha-[\d.\-\w]+/, "");
    diffs.push({
      filename: file,
      oldLines: before.lines,
      newLines: after.lines,
      lineDiff: after.lines - before.lines,
      changed: contentChanged,
      added: false,
      removed: false,
    });
  }
}

const changedFiles = diffs.filter((d) => d.changed);
const unchangedFiles = diffs.filter((d) => !d.changed);

console.log("=== Diff Results ===");
console.log(`  Changed:   ${changedFiles.length} files`);
console.log(`  Unchanged: ${unchangedFiles.length} files`);
console.log("");

if (changedFiles.length === 0) {
  console.log("No data changes detected (version string updates only).");
  console.log("Done.");
  process.exit(0);
}

for (const d of changedFiles) {
  const sign = d.lineDiff > 0 ? "+" : "";
  const tag = d.added ? " [NEW]" : d.removed ? " [REMOVED]" : "";
  console.log(`  ${d.filename}: ${d.oldLines} → ${d.newLines} lines (${sign}${d.lineDiff})${tag}`);
}

// --- Step 6: Detect specific changes ---
function countEntries(content: string, pattern: RegExp): number {
  return (content.match(pattern) || []).length;
}

function getNames(content: string, pattern: RegExp): string[] {
  const matches = content.match(pattern) || [];
  return matches.map((m) => m.replace(pattern, "$1"));
}

interface ChangeDetail {
  category: string;
  details: string[];
}

const changes: ChangeDetail[] = [];

// Ships
const beforeShips = beforeSnap["ships.ts"];
const afterShips = afterSnap["ships.ts"];
if (beforeShips && afterShips && beforeShips.content !== afterShips.content) {
  const oldCount = countEntries(beforeShips.content, /name: "/g);
  const newCount = countEntries(afterShips.content, /name: "/g);
  const detail: string[] = [];
  if (newCount !== oldCount) detail.push(`${oldCount} → ${newCount} ships`);

  // Find new ship names
  const oldNames = new Set(getNames(beforeShips.content, /name: "([^"]+)"/g));
  const newNames = getNames(afterShips.content, /name: "([^"]+)"/g);
  const added = newNames.filter((n) => !oldNames.has(n));
  const removed = [...oldNames].filter((n) => !newNames.includes(n));
  if (added.length > 0) detail.push(`New: ${added.join(", ")}`);
  if (removed.length > 0) detail.push(`Removed: ${removed.join(", ")}`);

  if (detail.length > 0) changes.push({ category: "Ships", details: detail });
}

// Wikelo contracts
const beforeWikelo = beforeSnap["wikelo.ts"];
const afterWikelo = afterSnap["wikelo.ts"];
if (beforeWikelo && afterWikelo && beforeWikelo.content !== afterWikelo.content) {
  const oldCount = countEntries(beforeWikelo.content, /"id": "/g);
  const newCount = countEntries(afterWikelo.content, /"id": "/g);
  if (oldCount !== newCount) {
    changes.push({ category: "Wikelo Contracts", details: [`${oldCount} → ${newCount} contracts`] });
  }
}

// Crafting blueprints
const beforeCrafting = beforeSnap["crafting.ts"];
const afterCrafting = afterSnap["crafting.ts"];
if (beforeCrafting && afterCrafting && beforeCrafting.content !== afterCrafting.content) {
  const oldCount = countEntries(beforeCrafting.content, /"id": "/g);
  const newCount = countEntries(afterCrafting.content, /"id": "/g);
  if (oldCount !== newCount) {
    changes.push({ category: "Crafting Blueprints", details: [`${oldCount} → ${newCount} blueprints`] });
  }
}

// Mining ores
const beforeOres = beforeSnap["mining.ts"];
const afterOres = afterSnap["mining.ts"];
if (beforeOres && afterOres && beforeOres.content !== afterOres.content) {
  changes.push({ category: "Mining", details: ["Ore data changed"] });
}

// Starmap
const beforeMap = beforeSnap["starmap.ts"];
const afterMap = afterSnap["starmap.ts"];
if (beforeMap && afterMap && beforeMap.content !== afterMap.content) {
  const oldCount = countEntries(beforeMap.content, /"id": "/g);
  const newCount = countEntries(afterMap.content, /"id": "/g);
  if (oldCount !== newCount) {
    changes.push({ category: "Starmap", details: [`${oldCount} → ${newCount} locations`] });
  }
}

// Localization
const locFile = path.join(SC_EXTRACTED, "parsed", "localization", "global.ini");
if (fs.existsSync(locFile)) {
  const locLines = fs.readFileSync(locFile, "utf-8").split("\n").length;
  changes.push({ category: "Localization", details: [`${locLines.toLocaleString()} entries`] });
}

// --- Step 7: Write patch notes ---
const versionShort = newVersion.replace("sc-alpha-4.7.0-", "");
const notesFile = path.join(PLANNING, `patch-notes-${versionShort}.md`);

const lines: string[] = [
  `# Star Citizen ${versionShort} Patch Notes (DataForge Changes)`,
  "",
  `Updated from ${oldVersion} to ${newVersion}`,
  "",
];

if (changes.length > 0) {
  lines.push("## Changes Detected");
  lines.push("");
  for (const change of changes) {
    lines.push(`### ${change.category}`);
    for (const d of change.details) {
      lines.push(`- ${d}`);
    }
    lines.push("");
  }
}

lines.push("## Files Changed");
lines.push("");
for (const d of changedFiles) {
  const sign = d.lineDiff > 0 ? "+" : "";
  const tag = d.added ? " **NEW**" : d.removed ? " **REMOVED**" : "";
  lines.push(`- \`${d.filename}\`: ${d.oldLines} → ${d.newLines} lines (${sign}${d.lineDiff})${tag}`);
}
lines.push("");

if (unchangedFiles.length > 0) {
  lines.push("## No Changes To");
  lines.push("");
  lines.push(unchangedFiles.map((d) => d.filename.replace(".ts", "")).join(", "));
  lines.push("");
}

const notesContent = lines.join("\n");
fs.writeFileSync(notesFile, notesContent);
console.log(`\nPatch notes written to: ${notesFile}`);

// --- Step 8: Summary ---
console.log("\n=== Summary ===");
console.log(`  Version: ${oldVersion} → ${newVersion}`);
console.log(`  Changed files: ${changedFiles.length}`);
console.log(`  Patch notes: ${path.basename(notesFile)}`);
for (const change of changes) {
  console.log(`  ${change.category}: ${change.details[0]}`);
}
console.log("\nDone. Review patch notes, then commit when ready.");
