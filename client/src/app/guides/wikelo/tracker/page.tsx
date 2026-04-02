"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  gatheringItems as staticGatheringItems,
  contracts as staticContracts,
  favorConversions as staticFavorConversions,
  type GatheringItem,
} from "@/data/wikelo";
import { useWithOverrides } from "@/hooks/useOverrides";
import {
  getContractProgress,
  calculateFavorsFromInventory,
  type TrackerInventory,
} from "@/domain/wikeloTracker";
import toolStyles from "../../../tools/tools.module.css";
import styles from "./tracker.module.css";
import guideStyles from "../../guides.module.css";

const STORAGE_KEY = "wikelo-inventory";

const categories: GatheringItem["category"][] = [
  "ore",
  "harvestable",
  "creature_drop",
  "scrip",
  "loot",
  "component",
  "commodity",
];

export default function WikeloTrackerPage() {
  const { data: gatheringItems } = useWithOverrides("wikelo_gathering_item", staticGatheringItems, (g) => g.name);
  const { data: contracts } = useWithOverrides("wikelo_contract", staticContracts, (c) => c.id);
  const { data: favorConversions } = useWithOverrides("wikelo_favor_conversion", staticFavorConversions, (f) => f.name);

  const flatFavorConversions = useMemo(() =>
    favorConversions
      .filter((fc) => fc.output.item === "Wikelo Favor")
      .map((fc) => ({
        item: fc.input[0].item,
        quantity: fc.input[0].quantity,
        favorsEarned: fc.output.quantity,
      })),
    [favorConversions]
  );
  /* ---- state ---- */
  const [inventory, setInventory] = useState<TrackerInventory>({});
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedContract, setSelectedContract] = useState<string>("");
  const [loaded, setLoaded] = useState(false);

  /* ---- localStorage load ---- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          setInventory(parsed as TrackerInventory);
        }
      }
    } catch {
      // corrupted data — start fresh
    }
    setLoaded(true);
  }, []);

  /* ---- localStorage save ---- */
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
  }, [inventory, loaded]);

  /* ---- inventory helpers ---- */
  const setItemQty = useCallback((name: string, qty: number) => {
    const clamped = Math.max(0, qty);
    setInventory((prev) => ({ ...prev, [name]: clamped }));
  }, []);

  const increment = useCallback(
    (name: string) =>
      setInventory((prev) => ({ ...prev, [name]: (prev[name] ?? 0) + 1 })),
    [],
  );

  const decrement = useCallback(
    (name: string) =>
      setInventory((prev) => ({
        ...prev,
        [name]: Math.max(0, (prev[name] ?? 0) - 1),
      })),
    [],
  );

  const resetAll = useCallback(() => {
    setInventory({});
    setSelectedContract("");
  }, []);

  /* ---- filtered items ---- */
  const filteredItems = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return gatheringItems.filter((item) => {
      if (categoryFilter !== "all" && item.category !== categoryFilter)
        return false;
      if (lowerSearch && !item.name.toLowerCase().includes(lowerSearch))
        return false;
      return true;
    });
  }, [search, categoryFilter]);

  /* ---- contract progress ---- */
  const activeContracts = useMemo(
    () => contracts.filter((c) => c.active),
    [],
  );

  const contract = useMemo(
    () => activeContracts.find((c) => c.id === selectedContract),
    [activeContracts, selectedContract],
  );

  const progress = useMemo(() => {
    if (!contract) return null;
    return getContractProgress(inventory, contract.requirements);
  }, [inventory, contract]);

  /* ---- favors ---- */
  const earnableFavors = useMemo(
    () => calculateFavorsFromInventory(inventory, flatFavorConversions),
    [inventory],
  );

  /* ---- render gate ---- */
  if (!loaded) return null;

  return (
    <div className={toolStyles.page}>
      <h1 className={toolStyles.title}>Inventory Tracker</h1>
      <p className={toolStyles.subtitle}>
        Track your gathered items, set contract goals, and see how many Wikelo
        Favors you can earn.
      </p>

      <nav className={guideStyles.guideNav}>
        <Link href="/guides/wikelo">Contracts</Link>
        <Link href="/guides/wikelo/reputation">Reputation</Link>
        <Link href="/guides/wikelo/items">Item Gathering</Link>
        <Link href="/guides/wikelo/emporiums">Emporiums</Link>
        <Link href="/guides/wikelo/rewards">Rewards</Link>
        <Link href="/guides/wikelo/favors">Favors</Link>
        <Link href="/guides/wikelo/tracker">Tracker</Link>
      </nav>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={styles.btnPrimary}
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
          }}
        >
          Save Inventory
        </button>
        <button className={styles.btnDanger} onClick={resetAll}>
          Reset All
        </button>
      </div>

      <div className={styles.trackerGrid}>
        {/* Left column — Inventory */}
        <div className={toolStyles.panel}>
          <h2 className={toolStyles.panelTitle}>Inventory</h2>

          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterPills}>
            <button
              className={
                categoryFilter === "all" ? styles.pillActive : styles.pill
              }
              onClick={() => setCategoryFilter("all")}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={
                  categoryFilter === cat ? styles.pillActive : styles.pill
                }
                onClick={() => setCategoryFilter(cat)}
              >
                {cat.replace("_", " ")}
              </button>
            ))}
          </div>

          <div className={styles.itemList}>
            {filteredItems.length === 0 && (
              <div className={styles.emptyState}>No items match your filter.</div>
            )}
            {filteredItems.map((item) => (
              <div key={item.name} className={styles.itemRow}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemCategory}>
                  {item.category.replace("_", " ")}
                </span>
                <div className={styles.qtyControls}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => decrement(item.name)}
                    aria-label={`Decrease ${item.name}`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={0}
                    className={styles.qtyInput}
                    value={inventory[item.name] ?? 0}
                    onChange={(e) =>
                      setItemQty(item.name, parseInt(e.target.value, 10) || 0)
                    }
                    aria-label={`Quantity of ${item.name}`}
                  />
                  <button
                    className={styles.qtyBtn}
                    onClick={() => increment(item.name)}
                    aria-label={`Increase ${item.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — Goal + Progress + Favors */}
        <div>
          {/* Goal selector */}
          <div className={toolStyles.panel}>
            <h2 className={toolStyles.panelTitle}>Contract Goal</h2>

            <select
              className={styles.goalSelect}
              value={selectedContract}
              onChange={(e) => setSelectedContract(e.target.value)}
            >
              <option value="">-- Select a contract --</option>
              {activeContracts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.tier})
                </option>
              ))}
            </select>

            {contract && progress ? (
              <>
                <div className={styles.overallProgress}>
                  <span
                    className={
                      progress.allComplete
                        ? styles.overallPercentComplete
                        : styles.overallPercent
                    }
                  >
                    {progress.overallPercent}%
                  </span>
                  <div className={styles.overallBarTrack}>
                    <div
                      className={
                        progress.allComplete
                          ? styles.overallBarFillComplete
                          : styles.overallBarFill
                      }
                      style={{ width: `${Math.min(progress.overallPercent, 100)}%` }}
                    />
                  </div>
                </div>

                <div className={styles.progressList}>
                  {progress.items.map((pi) => {
                    const pct = Math.min(
                      100,
                      pi.need === 0
                        ? 100
                        : Math.round((pi.have / pi.need) * 100),
                    );
                    return (
                      <div key={pi.item} className={styles.progressItem}>
                        <div className={styles.progressHeader}>
                          <span className={styles.progressLabel}>{pi.item}</span>
                          <span
                            className={
                              pi.complete
                                ? styles.progressCountComplete
                                : styles.progressCount
                            }
                          >
                            {pi.have} / {pi.need}
                          </span>
                        </div>
                        <div className={styles.progressBarTrack}>
                          <div
                            className={
                              pi.complete
                                ? styles.progressBarFillComplete
                                : styles.progressBarFill
                            }
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.rewardPreview}>
                  <div className={styles.rewardLabel}>Reward</div>
                  <div className={styles.rewardValue}>
                    {contract.rewards.join(", ")}
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                Select a contract above to track your progress.
              </div>
            )}
          </div>

          {/* Favor calculator */}
          <div className={toolStyles.panel}>
            <h2 className={toolStyles.panelTitle}>Favor Calculator</h2>
            <div className={styles.favorDisplay}>
              <span className={styles.favorCount}>{earnableFavors}</span>
              <span className={styles.favorLabel}>
                Wikelo Favors earnable from current inventory
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
