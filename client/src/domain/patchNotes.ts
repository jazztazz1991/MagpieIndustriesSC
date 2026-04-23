export interface PatchNoteSummary {
  version: string;
  title: string;
}

/**
 * Extract the version from a patch-notes filename.
 * e.g. "4.7.176.md" → "4.7.176"
 */
export function versionFromFilename(filename: string): string | null {
  const match = filename.match(/^([\d.]+)\.md$/);
  return match ? match[1] : null;
}

/**
 * Compare two semver-style version strings descending (newest first).
 * e.g. "4.7.176" > "4.7.10" > "4.6.5"
 */
export function compareVersionsDesc(a: string, b: string): number {
  const aParts = a.split(".").map((p) => parseInt(p, 10) || 0);
  const bParts = b.split(".").map((p) => parseInt(p, 10) || 0);
  const len = Math.max(aParts.length, bParts.length);
  for (let i = 0; i < len; i++) {
    const av = aParts[i] || 0;
    const bv = bParts[i] || 0;
    if (av !== bv) return bv - av;
  }
  return 0;
}

/**
 * Extract the first H1 heading from markdown content as the title.
 * Falls back to "Patch X.Y.Z" if no heading is found.
 */
export function titleFromMarkdown(content: string, version: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : `Patch ${version}`;
}

/**
 * Given a list of filenames + their content, return sorted summaries.
 */
export function buildPatchNotesIndex(
  files: Array<{ filename: string; content: string }>
): PatchNoteSummary[] {
  const entries: PatchNoteSummary[] = [];
  for (const { filename, content } of files) {
    const version = versionFromFilename(filename);
    if (!version) continue;
    entries.push({ version, title: titleFromMarkdown(content, version) });
  }
  return entries.sort((a, b) => compareVersionsDesc(a.version, b.version));
}

/**
 * Validate a version string.
 * Accepts digits, dots, plus signs, hyphens, and lowercase letters — the format
 * the data pipeline writes (e.g. "4.7.178.8917" or "4.7.178.8917+hotfix-20260423-0950").
 * Rejects path traversal characters (slashes, dots-only, etc.).
 */
export function isValidVersion(version: string): boolean {
  if (!version) return false;
  if (version.includes("/") || version.includes("\\") || version.includes("..")) return false;
  if (!/[\d]/.test(version)) return false;
  return /^[\da-z.+\-]+$/i.test(version);
}
