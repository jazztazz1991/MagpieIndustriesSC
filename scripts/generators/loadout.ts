/**
 * Generator: loadout.ts
 * Auto-discovers ship components (weapons, shields, quantum drives, power plants,
 * coolers) from DataForge XML. Writes client/src/data/loadout.ts.
 *
 * DataForge provides: size, grade, manufacturer UUID, and all numeric stats.
 * Names are extracted from localization keys (e.g., @item_NameCOOL_AEGS_S01_Bracer → "Bracer").
 * Overrides provide: manufacturer UUID→name map, and optional name corrections.
 */
import * as fs from "fs";
import * as path from "path";
import { parseXmlFile, findXmlFiles, findComponent, getComponents, loadNames, GeneratorReport, emptyReport } from "../lib/xml-utils";

type ComponentType = "weapon" | "shield" | "quantum_drive" | "power_plant" | "cooler";

interface ParsedComponent {
  name: string;
  type: ComponentType;
  size: number;
  grade: string;
  manufacturer: string;
  stats: Record<string, number>;
}

interface LoadoutOverrides {
  manufacturer_uuids: Record<string, string>;
  name_overrides: Record<string, string>;
}

// Map DataForge grade numbers to letters (1=A, 2=B, 3=C, 4=D)
// Note: DataForge uses 1 as highest grade, 4 as lowest
const GRADE_MAP: Record<string, string> = {
  "1": "A",
  "2": "B",
  "3": "C",
  "4": "D",
};

// Exclude patterns for components (test items, NPC-only, placeholders)
const EXCLUDE_PATTERNS = [
  /test/i,
  /placeholder/i,
  /template/i,
  /_pu_ai/,
  /_npc_/,
  /lowpoly/,
  /bengal/i,
  /derelict/i,
  /bespoke/i,
  /default_/,
  /idris.*bespoke/,
];

function shouldExclude(filename: string): boolean {
  return EXCLUDE_PATTERNS.some((p) => p.test(filename));
}

/**
 * Extract a human-readable name from a DataForge localization key.
 * e.g., "@item_NameCOOL_AEGS_S01_Bracer" → "Bracer"
 * e.g., "@item_NameSHLD_ASAS_S01_Shimmer" → "Shimmer"
 * e.g., "AMRS_LaserCannon_S2" (from entity class) → "Laser Cannon"
 */
function extractNameFromLocKey(locKey: string, entityClass: string): string {
  // Try to extract from localization key first
  if (locKey && locKey !== "@LOC_UNINITIALIZED" && locKey !== "@LOC_EMPTY" && locKey !== "@LOC_PLACEHOLDER") {
    // Remove the @item_Name prefix
    let raw = locKey.replace(/^@item_Name_?/, "").replace(/_SCItem$/, "");
    // Split on _ and get the name part (after MFGR_SXX_)
    const parts = raw.split("_");
    // Find the first part that's NOT a known prefix pattern (TYPE, MFGR, SXX)
    let nameStart = 0;
    for (let i = 0; i < parts.length; i++) {
      if (/^(COOL|POWR|SHLD|QDRV|S\d+|[A-Z]{3,5})$/i.test(parts[i]) && i < 3) {
        nameStart = i + 1;
      } else {
        break;
      }
    }
    const nameParts = parts.slice(nameStart).filter((p) => p && p !== "SCItem");
    if (nameParts.length > 0) {
      // Convert CamelCase to spaces
      return nameParts
        .map((p) => p.replace(/([a-z])([A-Z])/g, "$1 $2"))
        .join(" ");
    }
  }

  // Fallback: parse from entity class name
  const classParts = entityClass.split("_");
  const nameStart = classParts.findIndex((p) => /^S\d+$/i.test(p));
  if (nameStart >= 0 && nameStart + 1 < classParts.length) {
    return classParts
      .slice(nameStart + 1)
      .filter((p) => p.toLowerCase() !== "scitem")
      .map((p) => p.replace(/([a-z])([A-Z])/g, "$1 $2"))
      .join(" ");
  }

  return entityClass;
}

function resolveManufacturer(
  uuid: string,
  manufacturerMap: Record<string, string>,
  overrides: LoadoutOverrides
): string {
  if (!uuid || uuid === "00000000-0000-0000-0000-000000000000") return "Unknown";
  return (
    manufacturerMap[uuid] ||
    overrides.manufacturer_uuids[uuid] ||
    "Unknown"
  );
}

function parseComponent(
  filePath: string,
  componentType: ComponentType,
  manufacturerMap: Record<string, string>,
  overrides: LoadoutOverrides
): ParsedComponent | null {
  const baseName = path.basename(filePath, ".xml");
  if (shouldExclude(baseName)) return null;

  const parsed = parseXmlFile(filePath);
  const components = getComponents(parsed);
  if (!components) return null;

  // Find AttachDef via SAttachableComponentParams
  const attachable = findComponent(parsed, "SAttachableComponentParams");
  const attachDef = attachable?.AttachDef;
  if (!attachDef) return null;

  const size = Number(attachDef["@_Size"]) || 0;
  const gradeNum = String(attachDef["@_Grade"] || "3");
  const grade = GRADE_MAP[gradeNum] || "C";
  const mfrUuid = attachDef["@_Manufacturer"] || "";

  // Extract name from localization key
  const locName = attachDef?.Localization?.["@_Name"] || "";
  const entityClass = Object.keys(parsed)[0]?.split(".")[1] || baseName;
  const nameOverride = overrides.name_overrides[baseName];
  const name = nameOverride || extractNameFromLocKey(locName, entityClass);

  if (!name || name === baseName) return null;

  const manufacturer = resolveManufacturer(mfrUuid, manufacturerMap, overrides);
  const stats: Record<string, number> = {};

  // Extract type-specific stats
  if (componentType === "cooler") {
    const coolerParams = findComponent(parsed, "SCItemCoolerParams");
    if (coolerParams) {
      stats.coolingRate = Number(coolerParams["@_CoolingRate"]) || 0;
    }
  } else if (componentType === "shield") {
    const shieldParams = findComponent(parsed, "SCItemShieldGeneratorParams");
    if (shieldParams) {
      stats.shieldHP = Number(shieldParams["@_MaxShieldHealth"]) || 0;
      stats.regenRate = Number(shieldParams["@_MaxShieldRegen"]) || 0;
    }
  } else if (componentType === "quantum_drive") {
    const qdParams = findComponent(parsed, "SCItemQuantumDriveParams");
    if (qdParams) {
      const params = qdParams.params;
      if (params) {
        const driveSpeed = Number(params["@_driveSpeed"]) || 0;
        stats.quantumSpeed = Math.round(driveSpeed / 1000000); // Convert to Mm/s
        stats.spoolTime = Number(params["@_spoolUpTime"]) || 0;
      }
      stats.fuelRate = Number(qdParams["@_quantumFuelRequirement"]) || 0;
    }
  } else if (componentType === "power_plant") {
    // Power plant output is in the PowerDraw field of EntityComponentPowerConnection
    const powerConn = findComponent(parsed, "EntityComponentPowerConnection");
    if (powerConn) {
      stats.powerOutput = Number(powerConn["@_PowerDraw"]) || 0;
    }
  } else if (componentType === "weapon") {
    // Weapon stats: fireRate from action params, damage from ammo (separate file)
    const weaponComp = findComponent(parsed, "SCItemWeaponComponentParams");
    if (weaponComp) {
      // Walk the connectionParams to find fire actions with fireRate
      const fireActions = findFireActions(weaponComp);
      if (fireActions.fireRate > 0) {
        stats.fireRate = fireActions.fireRate;
      }
    }
    // Get ammo UUID reference for damage lookup
    const ammoContainer = findComponent(parsed, "SAmmoContainerComponentParams");
    if (ammoContainer) {
      const ammoRef = ammoContainer["@_ammoParamsRecord"];
      if (ammoRef && ammoRef !== "00000000-0000-0000-0000-000000000000") {
        stats._ammoRef = 0; // Placeholder — will resolve in second pass
        // Store ammo ref temporarily
        (stats as any).__ammoRef = ammoRef;
      }
    }
  }

  // Get power draw from EntityComponentPowerConnection (for all types except power_plant)
  if (componentType !== "power_plant") {
    const powerConn = findComponent(parsed, "EntityComponentPowerConnection");
    if (powerConn) {
      stats.powerDraw = Number(powerConn["@_PowerBase"]) || 0;
    }
  }

  return { name, type: componentType, size, grade, manufacturer, stats };
}

/** Recursively search for fire rate in weapon action params */
function findFireActions(obj: any): { fireRate: number } {
  if (!obj || typeof obj !== "object") return { fireRate: 0 };

  // Check if this object has a fireRate attribute
  if (obj["@_fireRate"] !== undefined) {
    const rate = Number(obj["@_fireRate"]);
    if (rate > 0) return { fireRate: rate };
  }

  // Recurse into child objects and arrays
  for (const key of Object.keys(obj)) {
    if (key.startsWith("@_")) continue;
    const child = obj[key];
    if (Array.isArray(child)) {
      for (const item of child) {
        const result = findFireActions(item);
        if (result.fireRate > 0) return result;
      }
    } else if (typeof child === "object") {
      const result = findFireActions(child);
      if (result.fireRate > 0) return result;
    }
  }

  return { fireRate: 0 };
}

/** Resolve ammo damage from ammo params file */
function resolveAmmoDamage(
  xmlDir: string,
  ammoRef: string
): { damagePhysical: number; damageEnergy: number; damageDistortion: number; speed: number } | null {
  // Search for the ammo params file by UUID reference
  const ammoDir = path.join(xmlDir, "libs/foundry/records/ammoparams/vehicle");
  if (!fs.existsSync(ammoDir)) return null;

  const files = findXmlFiles(ammoDir, /\.xml$/);
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, "utf-8");
      if (!content.includes(ammoRef)) continue;

      const parsed = parseXmlFile(file);
      const root = Object.values(parsed)[0] as any;
      if (!root) continue;

      const speed = Number(root["@_speed"]) || 0;

      // Find damage info — could be nested in BulletProjectileParams or similar
      let damageInfo: any = null;
      const findDamage = (obj: any): void => {
        if (!obj || typeof obj !== "object" || damageInfo) return;
        if (obj["@___polymorphicType"] === "DamageInfo" || obj["@___type"] === "DamageInfo" ||
          obj["@_DamagePhysical"] !== undefined) {
          damageInfo = obj;
          return;
        }
        for (const key of Object.keys(obj)) {
          if (key.startsWith("@_")) continue;
          const child = obj[key];
          if (Array.isArray(child)) {
            for (const item of child) findDamage(item);
          } else if (typeof child === "object") {
            findDamage(child);
          }
        }
      };
      findDamage(root);

      if (damageInfo) {
        return {
          damagePhysical: Number(damageInfo["@_DamagePhysical"]) || 0,
          damageEnergy: Number(damageInfo["@_DamageEnergy"]) || 0,
          damageDistortion: Number(damageInfo["@_DamageDistortion"]) || 0,
          speed,
        };
      }
    } catch {
      continue;
    }
  }
  return null;
}

function loadOverrides(overridesPath: string): LoadoutOverrides {
  if (!fs.existsSync(overridesPath)) {
    return { manufacturer_uuids: {}, name_overrides: {} };
  }
  const raw = JSON.parse(fs.readFileSync(overridesPath, "utf-8"));
  return {
    manufacturer_uuids: raw.manufacturer_uuids || {},
    name_overrides: raw.name_overrides || {},
  };
}

const COMPONENT_DIRS: { type: ComponentType; dir: string }[] = [
  { type: "cooler", dir: "ships/cooler" },
  { type: "shield", dir: "ships/shieldgenerator" },
  { type: "quantum_drive", dir: "ships/quantumdrive" },
  { type: "power_plant", dir: "ships/powerplant" },
  { type: "weapon", dir: "ships/weapons" },
];

export function generateLoadout(
  xmlDir: string,
  outputPath: string,
  version: string,
  overridesDir: string
): { content: string; report: GeneratorReport } {
  const report = emptyReport("loadout");
  const names = loadNames(overridesDir);
  const SHIP_MANUFACTURER_MAP: Record<string, string> = names.manufacturers || {};

  const overrides = loadOverrides(path.join(overridesDir, "loadout.json"));
  const allComponents: ParsedComponent[] = [];
  const ammoRefs: Map<ParsedComponent, string> = new Map();

  for (const { type, dir } of COMPONENT_DIRS) {
    const fullDir = path.join(xmlDir, "libs/foundry/records/entities/scitem", dir);
    if (!fs.existsSync(fullDir)) {
      report.warnings.push(`Directory not found: ${dir}`);
      continue;
    }

    const files = findXmlFiles(fullDir, /\.xml$/);
    report.found += files.length;
    let count = 0;

    for (const file of files) {
      try {
        const comp = parseComponent(file, type, SHIP_MANUFACTURER_MAP, overrides);
        if (!comp) {
          report.skipped++;
          continue;
        }

        // Store ammo ref for weapons
        if (type === "weapon" && (comp.stats as any).__ammoRef) {
          ammoRefs.set(comp, (comp.stats as any).__ammoRef);
          delete (comp.stats as any).__ammoRef;
          delete comp.stats._ammoRef;
        }

        allComponents.push(comp);
        count++;
      } catch (err) {
        report.warnings.push(`Failed to parse ${path.basename(file)}: ${err}`);
      }
    }

    console.log(`  ${type}: ${count} components from ${files.length} files`);
  }

  // Second pass: resolve ammo damage for weapons
  console.log(`  Resolving ammo damage for ${ammoRefs.size} weapons...`);
  let resolved = 0;
  for (const [comp, ref] of ammoRefs) {
    const ammo = resolveAmmoDamage(xmlDir, ref);
    if (ammo) {
      const totalDamage = ammo.damagePhysical + ammo.damageEnergy + ammo.damageDistortion;
      comp.stats.damage = Math.round(totalDamage * 10) / 10;
      if (ammo.speed > 0) comp.stats.speed = ammo.speed;
      // Calculate DPS if we have fireRate
      if (comp.stats.fireRate > 0 && totalDamage > 0) {
        comp.stats.dps = Math.round((comp.stats.fireRate / 60) * totalDamage);
      }
      resolved++;
    }
  }
  console.log(`  Resolved ${resolved}/${ammoRefs.size} ammo references`);

  // Filter out components with no useful stats
  const validComponents = allComponents.filter((c) => {
    if (c.type === "weapon") return c.stats.damage !== undefined || c.stats.fireRate > 0;
    if (c.type === "shield") return c.stats.shieldHP > 0;
    if (c.type === "quantum_drive") return c.stats.quantumSpeed > 0;
    if (c.type === "power_plant") return c.stats.powerOutput > 0;
    if (c.type === "cooler") return c.stats.coolingRate > 0;
    return false;
  });

  // Deduplicate: same name+type+size+manufacturer → keep the one with higher primary stat
  const deduped: ParsedComponent[] = [];
  const seen = new Map<string, number>();
  for (const c of validComponents) {
    const dk = `${c.name}::${c.type}::S${c.size}::${c.manufacturer}`;
    const existing = seen.get(dk);
    if (existing !== undefined) {
      // Keep whichever has higher primary stat
      const primaryStat = c.type === "weapon" ? "dps" : c.type === "shield" ? "shieldHP" : c.type === "quantum_drive" ? "quantumSpeed" : c.type === "power_plant" ? "powerOutput" : "coolingRate";
      if ((c.stats[primaryStat] ?? 0) > (deduped[existing].stats[primaryStat] ?? 0)) {
        deduped[existing] = c;
      }
      continue;
    }
    seen.set(dk, deduped.length);
    deduped.push(c);
  }
  report.skipped += validComponents.length - deduped.length;
  console.log(`  After dedup: ${deduped.length} (removed ${validComponents.length - deduped.length} duplicates)`);

  // Sort: by type, then size, then name
  deduped.sort((a, b) => {
    const typeOrder = ["weapon", "shield", "quantum_drive", "power_plant", "cooler"];
    const ti = typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
    if (ti !== 0) return ti;
    if (a.size !== b.size) return a.size - b.size;
    return a.name.localeCompare(b.name);
  });

  console.log(`  Total valid components: ${deduped.length}`);

  // Write output
  const lines: string[] = [
    `// Auto-generated from Data.p4k — ${version}`,
    `// Run: npm run sync:generate`,
    ``,
    `export type ComponentType = "weapon" | "shield" | "quantum_drive" | "power_plant" | "cooler";`,
    `export type ComponentSize = "S0" | "S1" | "S2" | "S3" | "S4" | "S5" | "S6" | "S7" | "S8" | "S9" | "S10" | "S12";`,
    ``,
    `export interface ShipComponent {`,
    `  name: string;`,
    `  type: ComponentType;`,
    `  size: ComponentSize;`,
    `  manufacturer: string;`,
    `  grade: "A" | "B" | "C" | "D";`,
    `  stats: Record<string, number>;`,
    `}`,
    ``,
    `export const components: ShipComponent[] = [`,
  ];

  for (const comp of deduped) {
    const sizeStr = `S${comp.size}`;
    const statsObj: Record<string, number> = {};
    for (const [k, v] of Object.entries(comp.stats)) {
      if (k.startsWith("_")) continue;
      statsObj[k] = typeof v === "number" ? Math.round(v * 100) / 100 : v;
    }
    lines.push(`  {`);
    lines.push(`    name: ${JSON.stringify(comp.name)},`);
    lines.push(`    type: ${JSON.stringify(comp.type)},`);
    lines.push(`    size: ${JSON.stringify(sizeStr)},`);
    lines.push(`    manufacturer: ${JSON.stringify(comp.manufacturer)},`);
    lines.push(`    grade: ${JSON.stringify(comp.grade)},`);
    lines.push(`    stats: ${JSON.stringify(statsObj)},`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);

  // --- Auto-extract ship loadout slots + default equipment from DataForge ---
  lines.push(`export interface ShipLoadoutSlot {`);
  lines.push(`  type: ComponentType;`);
  lines.push(`  size: ComponentSize;`);
  lines.push(`  count: number;`);
  lines.push(`  defaultItems: string[];`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export interface ShipLoadout {`);
  lines.push(`  shipName: string;`);
  lines.push(`  slots: ShipLoadoutSlot[];`);
  lines.push(`}`);
  lines.push(``);

  // Build component name → display name index from generated components
  const componentIndex = new Map<string, string>();
  for (const comp of deduped) {
    // Index by lowercase entity class suffix (e.g., "bracer" → "Bracer")
    componentIndex.set(comp.name.toLowerCase(), comp.name);
  }

  // Pattern matchers for component entity class names
  const COMP_CLASS_PATTERNS: { type: ComponentType; pattern: RegExp; sizeExtract: RegExp }[] = [
    { type: "power_plant", pattern: /^POWR_/i, sizeExtract: /S(\d+)/i },
    { type: "cooler", pattern: /^COOL_/i, sizeExtract: /S(\d+)/i },
    { type: "shield", pattern: /^SHLD_/i, sizeExtract: /S(\d+)/i },
    { type: "quantum_drive", pattern: /^QDRV_/i, sizeExtract: /S(\d+)/i },
  ];

  function extractDefaultName(entityClass: string): string {
    // COOL_AEGS_S01_Bracer_SCItem → Bracer
    const cleaned = entityClass.replace(/_SCItem$/i, "");
    const parts = cleaned.split("_");
    const sizeIdx = parts.findIndex((p) => /^S\d+$/i.test(p));
    if (sizeIdx >= 0 && sizeIdx + 1 < parts.length) {
      return parts
        .slice(sizeIdx + 1)
        .map((p) => p.replace(/([a-z])([A-Z])/g, "$1 $2"))
        .join(" ");
    }
    return entityClass;
  }

  // Read ships override to get ship names
  const shipsOverrides = JSON.parse(
    fs.readFileSync(path.join(overridesDir, "ships.json"), "utf-8")
  );
  const shipDir = path.join(xmlDir, "libs/foundry/records/entities/spaceships");

  interface ShipLoadoutData {
    shipName: string;
    slots: { type: ComponentType; size: string; count: number; defaultItems: string[] }[];
  }

  const shipLoadouts: ShipLoadoutData[] = [];

  for (const [key, shipData] of Object.entries(shipsOverrides)) {
    if (key.startsWith("_")) continue;
    const ship = shipData as { name: string };
    const xmlPath = path.join(shipDir, key + ".xml");
    if (!fs.existsSync(xmlPath)) continue;

    try {
      const content = fs.readFileSync(xmlPath, "utf-8");

      // Extract all entityClassName references
      const classRefs = [...content.matchAll(/entityClassName="([^"]+)"/g)]
        .map((m) => m[1])
        .filter((c) => c.length > 0);

      // Group components by type and size
      const groups: Map<string, { type: ComponentType; size: string; items: string[] }> = new Map();

      for (const cls of classRefs) {
        for (const { type, pattern, sizeExtract } of COMP_CLASS_PATTERNS) {
          if (!pattern.test(cls)) continue;
          const sizeMatch = cls.match(sizeExtract);
          const size = sizeMatch ? `S${parseInt(sizeMatch[1], 10)}` : "S1";
          const groupKey = `${type}:${size}`;
          const displayName = extractDefaultName(cls);

          if (!groups.has(groupKey)) {
            groups.set(groupKey, { type, size, items: [] });
          }
          groups.get(groupKey)!.items.push(displayName);
        }
      }

      if (groups.size === 0) continue;

      const slots = [...groups.values()].map((g) => ({
        type: g.type,
        size: g.size,
        count: g.items.length,
        defaultItems: [...new Set(g.items)],
      }));

      // Sort: power_plant, cooler, shield, quantum_drive
      const typeOrder = ["power_plant", "cooler", "shield", "quantum_drive"];
      slots.sort((a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type));

      shipLoadouts.push({ shipName: ship.name, slots });
    } catch {
      continue;
    }
  }

  // Sort by ship name
  shipLoadouts.sort((a, b) => a.shipName.localeCompare(b.shipName));

  console.log(`  Ship loadouts extracted: ${shipLoadouts.length}`);

  lines.push(`export const shipLoadouts: ShipLoadout[] = [`);
  for (const sl of shipLoadouts) {
    lines.push(`  {`);
    lines.push(`    shipName: ${JSON.stringify(sl.shipName)},`);
    lines.push(`    slots: [`);
    for (const slot of sl.slots) {
      lines.push(`      { type: ${JSON.stringify(slot.type)}, size: ${JSON.stringify(slot.size)} as ComponentSize, count: ${slot.count}, defaultItems: ${JSON.stringify(slot.defaultItems)} },`);
    }
    lines.push(`    ],`);
    lines.push(`  },`);
  }
  lines.push(`];`);
  lines.push(``);

  report.produced = deduped.length;

  return { content: lines.join("\n"), report };
}
