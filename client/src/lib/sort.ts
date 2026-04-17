/**
 * Natural sort comparator — alphabetical with numeric segments sorted numerically.
 * e.g. RCMBNT-XTL-1 < RCMBNT-XTL-2 < RCMBNT-XTL-10
 */
export function naturalCompare(a: string, b: string): number {
  const re = /(\d+|\D+)/g;
  const aParts = a.match(re) || [];
  const bParts = b.match(re) || [];

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const ap = aParts[i] || "";
    const bp = bParts[i] || "";
    const aNum = /^\d+$/.test(ap);
    const bNum = /^\d+$/.test(bp);

    if (aNum && bNum) {
      const diff = parseInt(ap, 10) - parseInt(bp, 10);
      if (diff !== 0) return diff;
    } else {
      const cmp = ap.localeCompare(bp, undefined, { sensitivity: "base" });
      if (cmp !== 0) return cmp;
    }
  }
  return 0;
}
