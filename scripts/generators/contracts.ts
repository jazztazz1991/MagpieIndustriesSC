/**
 * Generator: contracts.ts
 * Reads DataForge XML for contract templates + generators.
 * Writes client/src/data/contracts.ts.
 */
import * as fs from "fs";
import * as path from "path";
import { GeneratorReport, emptyReport } from "../lib/xml-utils";

interface Template {
  id: string;
  name: string;
  category: string;
  illegal: boolean;
  issuers: string[];
  uuid: string | null;
}

// Mirror of client/src/domain/contracts.ts CATEGORY_RULES.
// Keeping a local copy so the generator has no client-side dependency.
const CATEGORY_RULES: Array<{ test: RegExp; category: string }> = [
  { test: /^thecollector/i, category: "wikelo" },
  { test: /^tutorial/i, category: "tutorial" },
  { test: /^events?\b|^initialinvite/i, category: "event" },
  { test: /^bounty|^huntthepolaris|^acepilot/i, category: "bounty" },
  { test: /^(eliminate|destroy|ship?wave|antibombing|defendship_destroy|killanimals|boardship|hijacked)/i, category: "combat" },
  { test: /^(defend|supportattacked)/i, category: "defend" },
  { test: /^escort/i, category: "escort" },
  { test: /^(salvage|recovercargo)/i, category: "salvage" },
  { test: /^(haulcargo|cargo)/i, category: "cargo" },
  { test: /^courier/i, category: "courier" },
  { test: /^deliverypilot/i, category: "delivery" },
  { test: /^(commarray|datadownload|hackprevention|commarray_hack)/i, category: "investigation" },
  { test: /^(commarray_repair|infiltrate)/i, category: "repair" },
];

function categorize(id: string): string {
  for (const rule of CATEGORY_RULES) {
    if (rule.test.test(id)) return rule.category;
  }
  return "other";
}

function prettifyId(id: string): string {
  const parts = id.split("_").filter(Boolean);
  if (parts.length === 0) return id;
  const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  if (parts.length === 1) return titleCase(parts[0]);
  return `${titleCase(parts[0])} — ${parts.slice(1).map(titleCase).join(" ")}`;
}

function prettifyGenerator(filename: string): string {
  const base = filename.replace(/\.xml$/, "").replace(/_generator$/, "");
  return base
    .split(/[_-]/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

/** Recursively collect all .xml files under a directory. */
function collectXmlFiles(dir: string): string[] {
  const result: string[] = [];
  if (!fs.existsSync(dir)) return result;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...collectXmlFiles(p));
    else if (entry.isFile() && entry.name.endsWith(".xml")) result.push(p);
  }
  return result;
}

export function generateContracts(
  xmlDir: string,
  _outputPath: string,
  version: string
): { content: string; report: GeneratorReport } {
  const report = emptyReport("contracts");

  const templatesDir = path.join(xmlDir, "libs/foundry/records/contracts/contracttemplates");
  const generatorsDir = path.join(xmlDir, "libs/foundry/records/contracts/contractgenerator");

  const templateFiles = collectXmlFiles(templatesDir);
  const generatorFiles = collectXmlFiles(generatorsDir);

  report.found = templateFiles.length;
  console.log(`  Found ${templateFiles.length} contract templates, ${generatorFiles.length} generators`);

  // Pass 1: parse templates, build UUID → template map.
  const templates: Template[] = [];
  const uuidToId = new Map<string, string>();

  for (const file of templateFiles) {
    try {
      const raw = fs.readFileSync(file, "utf-8");
      // Skip notForRelease templates
      if (/notForRelease="1"/.test(raw) && !/notForRelease="0"/.test(raw.slice(0, 500))) {
        report.skipped++;
        continue;
      }

      // Derive id from path relative to templatesDir
      const relPath = path.relative(templatesDir, file).replace(/\\/g, "/").replace(/\.xml$/, "");
      const id = relPath.toLowerCase();

      // Extract __ref UUID from the top-level element
      const uuidMatch = raw.match(/__ref="([a-f0-9-]{36})"/);
      const uuid = uuidMatch ? uuidMatch[1] : null;

      // Extract illegal flag from ContractDisplayInfo
      const illegalMatch = raw.match(/<ContractDisplayInfo[^>]*\billegal="(\d)"/);
      const illegal = illegalMatch ? illegalMatch[1] === "1" : false;

      const template: Template = {
        id,
        name: prettifyId(id.split("/").pop() || id),
        category: categorize(id.split("/").pop() || id),
        illegal,
        issuers: [],
        uuid,
      };
      templates.push(template);
      if (uuid) uuidToId.set(uuid, id);
    } catch (err) {
      report.warnings.push(`Failed to parse ${file}: ${err}`);
      report.skipped++;
    }
  }

  // Pass 2: for each generator, find referenced UUIDs and record issuer on matching templates.
  const templateById = new Map(templates.map((t) => [t.id, t]));
  for (const file of generatorFiles) {
    const raw = fs.readFileSync(file, "utf-8");
    const issuerLabel = prettifyGenerator(path.basename(file));
    const uuids = raw.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/g) || [];
    for (const uuid of uuids) {
      if (uuid === "00000000-0000-0000-0000-000000000000") continue;
      const templateId = uuidToId.get(uuid);
      if (!templateId) continue;
      const template = templateById.get(templateId);
      if (!template || template.issuers.includes(issuerLabel)) continue;
      template.issuers.push(issuerLabel);
    }
  }

  templates.sort((a, b) => a.id.localeCompare(b.id));
  report.produced = templates.length;
  console.log(`  Parsed ${templates.length} templates`);

  const lines: string[] = [
    `// Auto-generated from Data.p4k — ${version}`,
    `// Run: npm run sync:generate`,
    ``,
    `import type { ContractTemplate } from "@/domain/contracts";`,
    ``,
    `export const contractTemplates: ContractTemplate[] = [`,
  ];
  for (const t of templates) {
    lines.push(`  {`);
    lines.push(`    id: ${JSON.stringify(t.id)},`);
    lines.push(`    name: ${JSON.stringify(t.name)},`);
    lines.push(`    category: ${JSON.stringify(t.category)},`);
    lines.push(`    illegal: ${t.illegal},`);
    lines.push(`    issuers: ${JSON.stringify(t.issuers.sort())},`);
    lines.push(`  },`);
  }
  lines.push(`];`);
  lines.push(``);

  return { content: lines.join("\n"), report };
}
