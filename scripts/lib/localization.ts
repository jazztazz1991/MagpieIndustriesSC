/**
 * Parses Star Citizen's global.ini localization file.
 *
 * Format: one key=value per line (after a BOM marker line).
 * Lines starting with ; or # are comments. Blank lines are skipped.
 *
 * Example:
 *   item_Name_qrt_utility_heavy_helmet_02_01_01=Palatino Mk I Helmet
 *
 * The key pattern for item display names is: item_Name_{internalEntityName}
 */
import * as fs from "fs";
import * as path from "path";

/**
 * Parse global.ini into a case-insensitive key → value map.
 * Keys are stored lowercase for case-insensitive lookup.
 */
export function parseLocalizationFile(filePath: string): Map<string, string> {
  const map = new Map<string, string>();
  if (!fs.existsSync(filePath)) return map;

  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    // Skip BOM, blank lines, comments
    const trimmed = line.replace(/^\uFEFF/, "").trim();
    if (!trimmed || trimmed.startsWith(";") || trimmed.startsWith("#")) continue;

    const eqIdx = trimmed.indexOf("=");
    if (eqIdx <= 0) continue;

    const key = trimmed.substring(0, eqIdx).toLowerCase();
    const value = trimmed.substring(eqIdx + 1);
    map.set(key, value);
  }

  return map;
}

/**
 * Look up the display name for an entity internal name.
 * The localization key pattern is `item_Name{internalName}` (no separator).
 * Falls back to `item_Name_{internalName}` (with underscore) if not found.
 */
export function lookupEntityDisplayName(
  locMap: Map<string, string>,
  internalName: string
): string | undefined {
  // Primary: no separator (matches actual game data pattern)
  const key = `item_name${internalName}`.toLowerCase();
  const result = locMap.get(key);
  if (result) return result;
  // Fallback: with underscore separator
  return locMap.get(`item_name_${internalName}`.toLowerCase());
}

/**
 * Load localization from the standard extracted path.
 * Returns empty map if file doesn't exist (graceful fallback).
 */
export function loadLocalization(extractedPath: string): Map<string, string> {
  const locPath = path.join(extractedPath, "parsed", "localization", "global.ini");
  if (!fs.existsSync(locPath)) {
    return new Map();
  }
  console.log(`  Loading localization from ${locPath}`);
  const map = parseLocalizationFile(locPath);
  console.log(`  Loaded ${map.size} localization entries`);
  return map;
}
