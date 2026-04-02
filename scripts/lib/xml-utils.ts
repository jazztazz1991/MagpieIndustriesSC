/**
 * Shared XML parsing utilities for DataForge XML files produced by unforge.
 */
import { XMLParser } from "fast-xml-parser";
import * as fs from "fs";
import * as path from "path";

// --- Generator report ---

export interface GeneratorReport {
  name: string;
  found: number;
  produced: number;
  skipped: number;
  warnings: string[];
}

export function emptyReport(name: string): GeneratorReport {
  return { name, found: 0, produced: 0, skipped: 0, warnings: [] };
}

// --- Names / overrides loading ---

let _namesCache: Record<string, any> | null = null;

/** Load consolidated name maps from data/overrides/names.json (cached). */
export function loadNames(overridesDir: string): Record<string, any> {
  if (_namesCache) return _namesCache;
  const namesPath = path.join(overridesDir, "names.json");
  if (!fs.existsSync(namesPath)) {
    throw new Error(`names.json not found at ${namesPath}`);
  }
  _namesCache = JSON.parse(fs.readFileSync(namesPath, "utf-8"));
  return _namesCache!;
}

/** Reset the names cache (for testing). */
export function resetNamesCache(): void {
  _namesCache = null;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  allowBooleanAttributes: true,
  parseAttributeValue: true,
  trimValues: true,
});

/** Parse a single XML file and return the root object. */
export function parseXmlFile(filePath: string): any {
  const xml = fs.readFileSync(filePath, "utf-8");
  return parser.parse(xml);
}

/** Find all XML files matching a glob-like pattern in a directory. */
export function findXmlFiles(dir: string, namePattern: RegExp): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".xml") && namePattern.test(f))
    .map((f) => path.join(dir, f));
}

/**
 * Safely navigate a nested object by dot-separated path.
 * Returns undefined if any segment is missing.
 */
export function dig(obj: any, pathStr: string): any {
  const parts = pathStr.split(".");
  let current = obj;
  for (const p of parts) {
    if (current == null) return undefined;
    current = current[p];
  }
  return current;
}

/**
 * Walk the Components array/object to find a component by its __polymorphicType.
 * unforge outputs Components as either an object with named keys or as children.
 */
export function findComponent(root: any, polymorphicType: string): any {
  const components = getComponents(root);
  if (!components) return undefined;

  // Components may be an object with named keys
  if (!Array.isArray(components)) {
    for (const key of Object.keys(components)) {
      const comp = components[key];
      if (comp?.["@___polymorphicType"] === polymorphicType) return comp;
      if (key === polymorphicType) return comp;
    }
    return undefined;
  }

  // Or an array
  return components.find(
    (c: any) => c?.["@___polymorphicType"] === polymorphicType || c?.["@___type"] === polymorphicType
  );
}

/** Get the root entity element (first key that isn't xml declaration). */
export function getRootEntity(parsed: any): any {
  const keys = Object.keys(parsed).filter((k) => k !== "?xml");
  if (keys.length === 0) return undefined;
  return parsed[keys[0]];
}

/** Get the Components child of the root entity. */
export function getComponents(root: any): any {
  const entity = typeof root === "object" && "Components" in root ? root : getRootEntity(root);
  return entity?.Components;
}

/** Read the SC version from the extracted version.txt file. */
export function readVersion(extractedPath: string): string {
  const versionFile = path.join(extractedPath, "parsed", "version.txt");
  if (fs.existsSync(versionFile)) {
    return fs.readFileSync(versionFile, "utf-8").trim();
  }
  return "unknown";
}

/** Read the extraction timestamp. */
export function readExtractedAt(extractedPath: string): string {
  const file = path.join(extractedPath, "parsed", "extracted_at.txt");
  if (fs.existsSync(file)) {
    return fs.readFileSync(file, "utf-8").trim();
  }
  return new Date().toISOString();
}
