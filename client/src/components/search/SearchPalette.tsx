"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ships } from "@/data/ships";
import { locations } from "@/data/locations";
import styles from "./SearchPalette.module.css";

interface SearchResult {
  name: string;
  path: string;
  category: string;
}

const pages: SearchResult[] = [
  { name: "Mining Calculator", path: "/tools/mining", category: "Tools" },
  { name: "Refinery Optimizer", path: "/tools/refinery", category: "Tools" },
  { name: "Loadout Planner", path: "/tools/loadout", category: "Tools" },
  { name: "Ship Database", path: "/ships", category: "Ships" },
  { name: "Ship Comparison", path: "/tools/ship-compare", category: "Tools" },
  { name: "Locations Database", path: "/locations", category: "Locations" },
  { name: "Beginner's Guide", path: "/guides/beginner", category: "Guides" },
  { name: "Wikelo Guide", path: "/guides/wikelo", category: "Guides" },
  { name: "Wikelo Items", path: "/guides/wikelo/items", category: "Guides" },
  { name: "Wikelo Favors", path: "/guides/wikelo/favors", category: "Guides" },
  { name: "Wikelo Rewards", path: "/guides/wikelo/rewards", category: "Guides" },
  { name: "Wikelo Reputation", path: "/guides/wikelo/reputation", category: "Guides" },
  { name: "Wikelo Emporiums", path: "/guides/wikelo/emporiums", category: "Guides" },
];

const allSearchable: SearchResult[] = [
  ...pages,
  ...ships.map((ship) => ({
    name: `${ship.name} (${ship.manufacturer})`,
    path: `/ships?search=${encodeURIComponent(ship.name)}`,
    category: "Ships",
  })),
  ...locations.map((loc) => ({
    name: `${loc.name} (${loc.type})`,
    path: `/locations?search=${encodeURIComponent(loc.name)}`,
    category: "Locations",
  })),
];

const CATEGORY_ORDER = ["Ships", "Locations", "Tools", "Guides"];
const MAX_RESULTS = 10;

export default function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return allSearchable
      .filter((item) => item.name.toLowerCase().includes(lower))
      .slice(0, MAX_RESULTS);
  }, [query]);

  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    for (const item of filtered) {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    }
    return CATEGORY_ORDER
      .filter((cat) => groups[cat])
      .map((cat) => ({ category: cat, items: groups[cat] }));
  }, [filtered]);

  const navigateTo = useCallback(
    (path: string) => {
      setOpen(false);
      setQuery("");
      setSelectedIndex(0);
      router.push(path);
    },
    [router],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) {
            setQuery("");
            setSelectedIndex(0);
          }
          return !prev;
        });
        return;
      }

      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        setQuery("");
        setSelectedIndex(0);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        return;
      }

      if (e.key === "Enter" && filtered.length > 0) {
        e.preventDefault();
        navigateTo(filtered[selectedIndex]?.path ?? filtered[0].path);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, filtered, selectedIndex, navigateTo]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      setOpen(false);
      setQuery("");
      setSelectedIndex(0);
    }
  };

  if (!open) return null;

  let flatIndex = 0;

  return (
    <div
      className={styles.backdrop}
      ref={backdropRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Search palette"
    >
      <div className={styles.modal}>
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            placeholder="Search ships, locations, tools, guides..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />
          <kbd className={styles.escHint}>Esc</kbd>
        </div>

        <div className={styles.results}>
          {query.trim() && filtered.length === 0 && (
            <div className={styles.noResults}>No results found</div>
          )}

          {grouped.map((group) => (
            <div key={group.category} className={styles.group}>
              <div className={styles.categoryHeader}>{group.category}</div>
              {group.items.map((item) => {
                const currentIndex = flatIndex++;
                return (
                  <button
                    key={item.path}
                    className={`${styles.resultItem} ${currentIndex === selectedIndex ? styles.resultItemActive : ""}`}
                    onClick={() => navigateTo(item.path)}
                    onMouseEnter={() => setSelectedIndex(currentIndex)}
                    type="button"
                  >
                    <span className={styles.resultName}>{item.name}</span>
                    <span className={styles.resultCategory}>{item.category}</span>
                  </button>
                );
              })}
            </div>
          ))}

          {!query.trim() && (
            <div className={styles.hint}>
              Start typing to search...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
