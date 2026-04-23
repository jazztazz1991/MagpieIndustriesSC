import { describe, it, expect } from "vitest";
import {
  versionFromFilename,
  compareVersionsDesc,
  titleFromMarkdown,
  buildPatchNotesIndex,
  isValidVersion,
} from "./patchNotes";

describe("versionFromFilename", () => {
  it("extracts version from a well-formed filename", () => {
    expect(versionFromFilename("4.7.176.md")).toBe("4.7.176");
    expect(versionFromFilename("3.24.0.md")).toBe("3.24.0");
    expect(versionFromFilename("1.0.md")).toBe("1.0");
  });

  it("returns null for bad filenames", () => {
    expect(versionFromFilename("not-a-version.md")).toBeNull();
    expect(versionFromFilename("4.7.176.txt")).toBeNull();
    expect(versionFromFilename("4.7.176")).toBeNull();
  });
});

describe("compareVersionsDesc", () => {
  it("sorts newest first", () => {
    const versions = ["4.6.5", "4.7.176", "4.7.10", "4.7.2"];
    versions.sort(compareVersionsDesc);
    expect(versions).toEqual(["4.7.176", "4.7.10", "4.7.2", "4.6.5"]);
  });

  it("handles different segment counts", () => {
    expect(compareVersionsDesc("4.7", "4.7.0")).toBe(0);
    expect(compareVersionsDesc("4.8", "4.7.176")).toBeLessThan(0);
  });

  it("treats numeric segments numerically (not lexicographically)", () => {
    expect(compareVersionsDesc("4.7.176", "4.7.10")).toBeLessThan(0);
    expect(compareVersionsDesc("4.7.2", "4.7.10")).toBeGreaterThan(0);
  });
});

describe("titleFromMarkdown", () => {
  it("extracts the first H1 heading", () => {
    const md = "# Star Citizen 4.7.176 Patch Notes\n\nSome content.";
    expect(titleFromMarkdown(md, "4.7.176")).toBe("Star Citizen 4.7.176 Patch Notes");
  });

  it("trims whitespace", () => {
    expect(titleFromMarkdown("#   Title   \n\nbody", "1.0")).toBe("Title");
  });

  it("falls back when no heading", () => {
    expect(titleFromMarkdown("Just text, no heading.", "4.7.176")).toBe("Patch 4.7.176");
  });

  it("ignores H2+ headings", () => {
    const md = "## Not a title\n\nbody";
    expect(titleFromMarkdown(md, "1.0")).toBe("Patch 1.0");
  });
});

describe("buildPatchNotesIndex", () => {
  it("filters out bad filenames and sorts descending", () => {
    const files = [
      { filename: "4.6.5.md", content: "# Old" },
      { filename: "README.md", content: "# Readme" },
      { filename: "4.7.176.md", content: "# Newest" },
      { filename: "4.7.10.md", content: "# Mid" },
    ];
    const result = buildPatchNotesIndex(files);
    expect(result).toEqual([
      { version: "4.7.176", title: "Newest" },
      { version: "4.7.10", title: "Mid" },
      { version: "4.6.5", title: "Old" },
    ]);
  });
});

describe("isValidVersion", () => {
  it("accepts digit-and-dot strings", () => {
    expect(isValidVersion("4.7.176")).toBe(true);
    expect(isValidVersion("1.0")).toBe(true);
    expect(isValidVersion("1")).toBe(true);
  });

  it("accepts hotfix-tagged versions", () => {
    expect(isValidVersion("4.7.178.8917+hotfix-20260423-0950")).toBe(true);
    expect(isValidVersion("4.7.2-rc1")).toBe(true);
  });

  it("rejects path traversal attempts and junk", () => {
    expect(isValidVersion("../secret")).toBe(false);
    expect(isValidVersion("4.7.176/../etc")).toBe(false);
    expect(isValidVersion("")).toBe(false);
    expect(isValidVersion("..")).toBe(false);
    expect(isValidVersion("/etc/passwd")).toBe(false);
    expect(isValidVersion("4\\7\\176")).toBe(false);
    expect(isValidVersion("just-letters")).toBe(false);
    expect(isValidVersion("4.7.178<script>")).toBe(false);
  });
});
