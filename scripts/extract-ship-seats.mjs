/**
 * One-shot extractor: reads ship XMLs, runs the same seat-classification logic
 * as client/src/domain/shipSeats.ts, and emits client/src/data/ship-seats.ts.
 *
 * Usage: node scripts/extract-ship-seats.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const XML_DIR = "D:/StarCitizen/extracted/parsed/xml/libs/foundry/records/entities/spaceships";
const OUTPUT = path.join(PROJECT_ROOT, "client/src/data/ship-seats.ts");

// Ship catalog — [xml file base, display name]
// Matches names in client/src/data/ships.ts (shipName field).
const SHIPS = [
  ["aegs_hammerhead", "Hammerhead"],
  ["aegs_reclaimer", "Reclaimer"],
  ["anvl_carrack", "Carrack"],
  ["argo_mole", "MOLE"],
  ["drak_caterpillar", "Caterpillar"],
  ["drak_cutlass_black", "Cutlass Black"],
  ["misc_freelancer_max", "Freelancer MAX"],
  ["misc_prospector", "Prospector"],
  ["rsi_constellation_andromeda", "Constellation Andromeda"],
  ["rsi_polaris", "Polaris"],
];

const ROLE_PRIORITY = {
  pilot: 0, copilot: 1, engineer: 2, mining: 3, turret: 4, missile: 5, crew: 6,
};

function prettifyFragment(s) {
  return s.split(/[_\s]+/).filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(" ");
}

const PATTERNS = [
  { regex: /^hardpoint_seat_pilot$/, role: "pilot", labelFrom: () => "Pilot" },
  { regex: /^hardpoint_seat_copilot$/, role: "copilot", labelFrom: () => "Copilot" },
  { regex: /^hardpoint_seat_copilot_(.+)$/, role: "copilot", labelFrom: (m) => `${prettifyFragment(m[1])} Copilot` },
  { regex: /^hardpoint_seat_turret_?(.*)$/, role: "turret", labelFrom: (m) => m[1] ? `${prettifyFragment(m[1])} Turret` : "Turret" },
  { regex: /^hardpoint_seat_torpedo_console$/, role: "missile", labelFrom: () => "Torpedo Console" },
  { regex: /^hardpoint_seat_engineering$/, role: "engineer", labelFrom: () => "Engineer" },
  { regex: /^hardpoint_seat_captain$/, role: "crew", labelFrom: () => "Captain" },
  { regex: /^hardpoint_seat_atc$/, role: "crew", labelFrom: () => "ATC" },
  { regex: /^hardpoint_mining_cab_(.+)$/, role: "mining", labelFrom: (m) => `${prettifyFragment(m[1])} Mining Cab` },
  { regex: /^hardpoint_(?:.+_)?engineer_console$/, role: "engineer", labelFrom: (m) => {
    const inner = m[0].replace(/^hardpoint_/, "").replace(/_engineer_console$/, "");
    return inner ? `${prettifyFragment(inner)} Engineer` : "Engineer Console";
  }},
  { regex: /^hardpoint_(?:.+_)?missile_(?:operator|console)$/, role: "missile", labelFrom: (m) => {
    const inner = m[0].replace(/^hardpoint_/, "").replace(/_missile_(operator|console)$/, "");
    return inner ? `${prettifyFragment(inner)} Missile` : "Missile Operator";
  }},
  { regex: /^hardpoint_turret(?:_(.+))?$/, role: "turret", labelFrom: (m) => m[1] ? `${prettifyFragment(m[1])} Turret` : "Turret" },
  { regex: /^hardpoint_seat_(.+)$/, role: "crew", labelFrom: (m) => prettifyFragment(m[1]) },
];

function isAccessOnly(n) {
  return n.includes("_access") || n.includes("seataccess") ||
    n.endsWith("_dashboard") || n.includes("_console_");
}

function classify(name) {
  if (isAccessOnly(name)) return null;
  for (const p of PATTERNS) {
    const m = name.match(p.regex);
    if (m) return { id: name.replace(/^hardpoint_/, ""), role: p.role, label: p.labelFrom(m) };
  }
  return null;
}

function extract(xml) {
  const names = [...xml.matchAll(/hardpoint_[a-z_0-9]+/g)].map((m) => m[0]);
  const seen = new Set();
  const seats = [];
  for (const n of names) {
    const s = classify(n);
    if (!s || seen.has(s.id)) continue;
    seen.add(s.id);
    seats.push(s);
  }
  seats.sort((a, b) => {
    const rp = ROLE_PRIORITY[a.role] - ROLE_PRIORITY[b.role];
    return rp !== 0 ? rp : a.label.localeCompare(b.label);
  });
  return seats;
}

const layouts = [];
for (const [file, name] of SHIPS) {
  const xmlPath = path.join(XML_DIR, `${file}.xml`);
  if (!fs.existsSync(xmlPath)) {
    console.warn(`SKIP ${name}: ${xmlPath} not found`);
    continue;
  }
  const xml = fs.readFileSync(xmlPath, "utf-8");
  const seats = extract(xml);
  if (seats.length === 0) {
    console.warn(`SKIP ${name}: no seats detected`);
    continue;
  }
  layouts.push({ shipName: name, seats });
  console.log(`${name}: ${seats.length} seats`);
}

const out = [
  `// Auto-generated from DataForge ship XMLs — run scripts/extract-ship-seats.mjs`,
  `// Keys match shipName in client/src/data/ships.ts.`,
  ``,
  `import type { ShipLayout } from "@/domain/shipSeats";`,
  ``,
  `export const shipLayouts: Record<string, ShipLayout> = {`,
];
for (const l of layouts) {
  out.push(`  ${JSON.stringify(l.shipName)}: {`);
  out.push(`    shipName: ${JSON.stringify(l.shipName)},`);
  out.push(`    seats: [`);
  for (const s of l.seats) {
    out.push(`      { id: ${JSON.stringify(s.id)}, role: ${JSON.stringify(s.role)}, label: ${JSON.stringify(s.label)} },`);
  }
  out.push(`    ],`);
  out.push(`  },`);
}
out.push(`};`, ``);
out.push(`export function getShipLayout(shipName: string): ShipLayout | null {`);
out.push(`  return shipLayouts[shipName] || null;`);
out.push(`}`, ``);

fs.writeFileSync(OUTPUT, out.join("\n"));
console.log(`Wrote ${OUTPUT} (${layouts.length} ships)`);
