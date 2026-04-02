"use client";

import { useState } from "react";
import Link from "next/link";
import { gatheringItems as staticGatheringItems } from "@/data/wikelo";
import { useWithOverrides } from "@/hooks/useOverrides";
import styles from "../../guides.module.css";

const categoryColors: Record<string, string> = {
  ore: styles.tagTier3,
  harvestable: styles.tagTier2,
  creature_drop: styles.tagTier2,
  scrip: styles.tagCurrency,
  loot: styles.tagWeapon,
  component: styles.tagComponent,
  commodity: styles.tagTier1,
};

export default function ItemGathering() {
  const { data: gatheringItems } = useWithOverrides("wikelo_gathering_item", staticGatheringItems, (g) => g.name);
  const [filterCategory, setFilterCategory] = useState("all");

  const filtered =
    filterCategory === "all"
      ? gatheringItems
      : gatheringItems.filter((i) => i.category === filterCategory);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Item Gathering Walkthroughs</h1>
      <p className={styles.subtitle}>
        Where to find every item required for Wikelo contracts, with tips and
        recommended locations.
      </p>

      <nav className={styles.guideNav}>
        <Link href="/guides/wikelo">Contracts</Link>
        <Link href="/guides/wikelo/reputation">Reputation</Link>
        <Link href="/guides/wikelo/items">Item Gathering</Link>
        <Link href="/guides/wikelo/emporiums">Emporiums</Link>
        <Link href="/guides/wikelo/rewards">Rewards</Link>
        <Link href="/guides/wikelo/favors">Favors</Link>
      </nav>

      <div className={styles.filters}>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className={styles.select}
        >
          <option value="all">All Categories</option>
          <option value="ore">Ore</option>
          <option value="harvestable">Harvestable</option>
          <option value="creature_drop">Creature Drop</option>
          <option value="scrip">Scrip</option>
          <option value="loot">Loot</option>
          <option value="component">Component</option>
          <option value="commodity">Commodity</option>
        </select>
      </div>

      <div className={styles.cardGrid}>
        {filtered.map((item) => (
          <div key={item.name} className={styles.card}>
            <div className={styles.cardTitle}>
              {item.name}
              <span
                className={`${categoryColors[item.category]} ${styles.itemCategoryTag}`}
              >
                {item.category}
              </span>
            </div>
            <div className={styles.itemLocationsBlock}>
              <strong className={styles.itemLocationsLabel}>
                Locations:
              </strong>
              <ul className={styles.itemLocationsList}>
                {item.locations.map((loc) => (
                  <li key={loc}>{loc}</li>
                ))}
              </ul>
            </div>
            <div className={styles.cardDesc}>{item.tips}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
