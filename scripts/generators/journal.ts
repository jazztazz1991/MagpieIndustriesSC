/**
 * Generator: journal.ts
 * Produces client/src/data/journal.ts by extracting journal entries from DataForge XML
 * and resolving titles/body text from the localization file.
 *
 * Data flow:
 * 1. Scan all journal entry XMLs
 * 2. Extract title, subtitle, body localization keys + metadata
 * 3. Resolve all @-prefixed keys from global.ini
 * 4. Classify entries by folder structure and metadata
 * 5. Output TypeScript
 */
import * as fs from "fs";
import * as path from "path";
import { GeneratorReport, emptyReport } from "../lib/xml-utils";
import { loadLocalization } from "../lib/localization";

// ─── Interfaces ───

interface RawJournalEntry {
  id: string;
  filePath: string;
  folder: string;
  titleKey: string;
  shortTitleKey: string;
  subHeadingKey: string;
  bodyKey: string;
  styleUUID: string;
  missionSpecific: boolean;
  removeOnMissionEnd: boolean;
  tutorialEntry: boolean;
  showNotification: boolean;
}

// ─── Style UUID → type mapping ───
const STYLE_MAP: Record<string, string> = {
  "19929f34-821c-47b7-a86a-c50a27defda8": "Text",
  "71203d71-0a39-4c90-bd0a-64d6e219a718": "Dialogue",
  "e77855cd-7ab3-4e85-ba6d-5f306b77bf07": "Audio",
  "d9dbe83c-7380-4282-b581-130b9636e752": "Video",
};

// ─── Folder → category mapping ───
function classifyEntry(folder: string, id: string, titleKey: string): string {
  const f = folder.toLowerCase();
  const t = titleKey.toLowerCase();
  const i = id.toLowerCase();

  // Help guides / tutorials
  if (f.includes("helpguides") || f.includes("tutorial")) return "Guides";
  if (t.includes("journal_general_")) return "Guides";
  if (i.includes("tutorial") || t.includes("tut0")) return "Guides";

  // Reputation / bounty
  if (f.includes("bountyreputation") || f.includes("bountydepartment")) return "Reputation";
  if (t.includes("reputation") || t.includes("promotion") || t.includes("demotion")) return "Reputation";

  // Mission lore — specific mission chains
  if (f.includes("charliestation") || f.includes("covalex")) return "Investigation";
  if (f.includes("starfarer") || f.includes("reclaimer")) return "Ship Logs";
  if (f.includes("blackbox")) return "Black Box";
  if (f.includes("siegeoforison")) return "Siege of Orison";
  if (f.includes("missingbennys")) return "Missing Bennys";
  if (f.includes("prison") || f.includes("escapee")) return "Prison";
  if (f.includes("contestedzone") || i.includes("contestedzone")) return "Contested Zones";

  // System / jurisdiction
  if (t.includes("jurisdiction") || f.includes("jurisdiction")) return "Jurisdiction";

  // Historical tour
  if (i.includes("historicaltour")) return "Lore";

  // Mission-specific entries
  if (i.includes("journalentry") && f.includes("crusader")) return "Crusader";

  // In-world datapads and letters
  if (i.includes("datapad") || i.includes("letter") || i.includes("unfinished")) return "Datapads";

  return "Misc";
}

// ─── Parsing ───

function walkDir(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(full));
    } else if (entry.name.endsWith(".xml")) {
      results.push(full);
    }
  }
  return results;
}

function parseJournalEntry(filePath: string, baseDir: string): RawJournalEntry | null {
  const content = fs.readFileSync(filePath, "utf-8");
  const fileName = path.basename(filePath, ".xml");

  // Get folder relative to journalentry/
  const rel = filePath.replace(/\\/g, "/");
  const baseNorm = baseDir.replace(/\\/g, "/");
  const folder = path.dirname(rel.replace(baseNorm + "/", ""));

  // Extract attributes from JournalEntry tag
  const titleMatch = content.match(/\bTitle="([^"]*)"/);
  const shortTitleMatch = content.match(/\bShortTitle="([^"]*)"/);
  const subHeadingMatch = content.match(/\bSubHeading="([^"]*)"/);
  const styleMatch = content.match(/\bStyle="([^"]*)"/);
  const missionSpecMatch = content.match(/\bmissionSpecificContent="([01])"/);
  const removeMatch = content.match(/\bremoveOnMissionEnd="([01])"/);
  const tutorialMatch = content.match(/\btutorialEntry="([01])"/);
  const notifMatch = content.match(/\bshowNotification="([01])"/);

  // Extract body text key from inner type element
  const bodyMatch = content.match(/BodyText="([^"]*)"/);

  const titleKey = titleMatch?.[1] || "";
  if (!titleKey || titleKey === "@LOC_UNINITIALIZED") {
    // Skip generic placeholder entries
    if (!bodyMatch?.[1] || bodyMatch[1] === "@LOC_UNINITIALIZED") return null;
  }

  return {
    id: fileName,
    filePath: rel,
    folder,
    titleKey,
    shortTitleKey: shortTitleMatch?.[1] || "",
    subHeadingKey: subHeadingMatch?.[1] || "",
    bodyKey: bodyMatch?.[1] || "",
    styleUUID: styleMatch?.[1] || "",
    missionSpecific: missionSpecMatch?.[1] === "1",
    removeOnMissionEnd: removeMatch?.[1] === "1",
    tutorialEntry: tutorialMatch?.[1] === "1",
    showNotification: notifMatch?.[1] === "1",
  };
}

function resolveLocKey(locMap: Map<string, string>, key: string): string {
  if (!key || key === "@LOC_UNINITIALIZED" || key === "@LOC_EMPTY") return "";
  // Strip leading @
  const cleanKey = key.startsWith("@") ? key.substring(1).toLowerCase() : key.toLowerCase();
  // Some localization keys have a ",P" variant suffix (e.g., reputation journal entries)
  return locMap.get(cleanKey) || locMap.get(cleanKey + ",p") || "";
}

// ─── Main generator ───

export function generateJournal(
  xmlDir: string,
  outputPath: string,
  version: string,
  overridesDir: string
): { content: string; report: GeneratorReport } {
  const report = emptyReport("journal");

  // Load localization
  const extractedPath = path.resolve(xmlDir, "..", "..");
  const localizationMap = loadLocalization(extractedPath);

  // Scan all journal entry XMLs
  const journalDir = path.join(xmlDir, "libs/foundry/records/journalentry");
  const files = walkDir(journalDir);
  console.log(`  Found ${files.length} journal entry files`);
  report.found = files.length;

  // Parse entries
  const entries: RawJournalEntry[] = [];
  for (const file of files) {
    const entry = parseJournalEntry(file, journalDir);
    if (entry) {
      entries.push(entry);
    } else {
      report.skipped++;
    }
  }
  console.log(`  Parsed ${entries.length} entries (${report.skipped} skipped)`);

  // Resolve and build output
  const output: any[] = [];
  let resolvedTitles = 0;
  let resolvedBodies = 0;

  for (const entry of entries) {
    const title = resolveLocKey(localizationMap, entry.titleKey);
    const shortTitle = resolveLocKey(localizationMap, entry.shortTitleKey);
    const subHeading = resolveLocKey(localizationMap, entry.subHeadingKey);
    const body = resolveLocKey(localizationMap, entry.bodyKey);

    // Use the best available title
    const displayTitle = title || shortTitle || entry.id.replace(/^journalentry\.?/i, "").replace(/_/g, " ");
    if (title) resolvedTitles++;
    if (body) resolvedBodies++;

    const category = classifyEntry(entry.folder, entry.id, entry.titleKey);
    const entryType = STYLE_MAP[entry.styleUUID] || "Text";

    // Clean up body text: replace \n with actual newlines for display
    const cleanBody = body.replace(/\\n/g, "\n").trim();

    output.push({
      id: entry.id,
      title: displayTitle,
      ...(subHeading ? { author: subHeading } : {}),
      category,
      type: entryType,
      body: cleanBody || undefined,
      ...(entry.missionSpecific ? { missionSpecific: true } : {}),
      ...(entry.tutorialEntry ? { tutorial: true } : {}),
    });
  }

  // Sort by category, then title
  const categoryOrder: Record<string, number> = {
    "Guides": 0,
    "Jurisdiction": 1,
    "Investigation": 2,
    "Ship Logs": 3,
    "Black Box": 4,
    "Siege of Orison": 5,
    "Missing Bennys": 6,
    "Contested Zones": 7,
    "Prison": 8,
    "Crusader": 9,
    "Lore": 10,
    "Datapads": 11,
    "Reputation": 12,
    "Misc": 13,
  };

  output.sort((a, b) => {
    const ca = categoryOrder[a.category] ?? 99;
    const cb = categoryOrder[b.category] ?? 99;
    if (ca !== cb) return ca - cb;
    return a.title.localeCompare(b.title);
  });

  console.log(`  Resolved ${resolvedTitles}/${entries.length} titles, ${resolvedBodies}/${entries.length} bodies`);

  // Count by category
  const cats = new Map<string, number>();
  for (const e of output) {
    cats.set(e.category, (cats.get(e.category) || 0) + 1);
  }
  for (const [cat, count] of [...cats.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`    ${cat}: ${count}`);
  }

  report.produced = output.length;

  // ─── Build output TypeScript ───
  const lines: string[] = [
    `// Auto-generated from DataForge extraction + localization — ${version}`,
    `// Run: npm run sync:generate`,
    ``,
    `export type JournalCategory = ${[...new Set(output.map((e) => `"${e.category}"`))].join(" | ")};`,
    ``,
    `export type JournalType = "Text" | "Dialogue" | "Audio" | "Video";`,
    ``,
    `export interface JournalEntry {`,
    `  id: string;`,
    `  title: string;`,
    `  author?: string;`,
    `  category: JournalCategory;`,
    `  type: JournalType;`,
    `  body?: string;`,
    `  missionSpecific?: boolean;`,
    `  tutorial?: boolean;`,
    `}`,
    ``,
    `export const journalEntries: JournalEntry[] = ${JSON.stringify(output, null, 2)};`,
    ``,
  ];

  return { content: lines.join("\n"), report };
}
