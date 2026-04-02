/**
 * Tests for scripts/lib/localization.ts — the global.ini parser.
 * Lives in client/src/domain so vitest picks it up.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { parseLocalizationFile, lookupEntityDisplayName } from "../../../scripts/lib/localization";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

describe("parseLocalizationFile", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "loc-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("returns empty map for non-existent file", () => {
    const map = parseLocalizationFile(path.join(tmpDir, "nonexistent.ini"));
    expect(map.size).toBe(0);
  });

  it("parses key=value lines", () => {
    const file = path.join(tmpDir, "global.ini");
    fs.writeFileSync(file, "item_Name_foo=Foo Bar\nitem_Name_baz=Baz Qux\n");
    const map = parseLocalizationFile(file);
    expect(map.get("item_name_foo")).toBe("Foo Bar");
    expect(map.get("item_name_baz")).toBe("Baz Qux");
  });

  it("handles BOM and comments", () => {
    const file = path.join(tmpDir, "global.ini");
    fs.writeFileSync(file, "\uFEFF; This is a comment\n# Another comment\n\nitem_Name_test=Test Item\n");
    const map = parseLocalizationFile(file);
    expect(map.size).toBe(1);
    expect(map.get("item_name_test")).toBe("Test Item");
  });

  it("stores keys case-insensitively", () => {
    const file = path.join(tmpDir, "global.ini");
    fs.writeFileSync(file, "Item_Name_CaseMix=My Item\n");
    const map = parseLocalizationFile(file);
    expect(map.get("item_name_casemix")).toBe("My Item");
  });

  it("handles values with equals signs", () => {
    const file = path.join(tmpDir, "global.ini");
    fs.writeFileSync(file, "some_key=value=with=equals\n");
    const map = parseLocalizationFile(file);
    expect(map.get("some_key")).toBe("value=with=equals");
  });

  it("handles Windows line endings", () => {
    const file = path.join(tmpDir, "global.ini");
    fs.writeFileSync(file, "key_one=Value One\r\nkey_two=Value Two\r\n");
    const map = parseLocalizationFile(file);
    expect(map.size).toBe(2);
    expect(map.get("key_one")).toBe("Value One");
  });
});

describe("lookupEntityDisplayName", () => {
  it("finds display name using primary key pattern (no separator)", () => {
    const map = new Map<string, string>();
    map.set("item_nameklwe_sniper_energy_01", "Arrowhead Sniper Rifle");
    expect(lookupEntityDisplayName(map, "klwe_sniper_energy_01")).toBe("Arrowhead Sniper Rifle");
  });

  it("falls back to underscore separator pattern", () => {
    const map = new Map<string, string>();
    map.set("item_name_qrt_utility_heavy_helmet_02_01_01", "Palatino Mk I Helmet");
    expect(lookupEntityDisplayName(map, "qrt_utility_heavy_helmet_02_01_01")).toBe("Palatino Mk I Helmet");
  });

  it("prefers primary (no separator) over fallback", () => {
    const map = new Map<string, string>();
    map.set("item_namefoo_bar", "Primary Name");
    map.set("item_name_foo_bar", "Fallback Name");
    expect(lookupEntityDisplayName(map, "foo_bar")).toBe("Primary Name");
  });

  it("is case-insensitive on internal name", () => {
    const map = new Map<string, string>();
    map.set("item_nameklwe_sniper_energy_01", "Arrowhead Sniper Rifle");
    expect(lookupEntityDisplayName(map, "KLWE_Sniper_Energy_01")).toBe("Arrowhead Sniper Rifle");
  });

  it("returns undefined when not found", () => {
    const map = new Map<string, string>();
    expect(lookupEntityDisplayName(map, "nonexistent_entity")).toBeUndefined();
  });
});
