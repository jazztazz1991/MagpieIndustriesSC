"use client";

import { useState } from "react";
import Link from "next/link";
import { contracts, type ReputationTier, type ContractCategory } from "@/data/wikelo";
import styles from "../guides.module.css";
import CommentSection from "@/components/comments/CommentSection";

const tierTag: Record<ReputationTier, string> = {
  "New Customer": styles.tagTier1,
  "Very Good Customer": styles.tagTier2,
  "Very Best Customer": styles.tagTier3,
};

const categoryTag: Record<ContractCategory, string> = {
  currency: styles.tagCurrency,
  utility: styles.tagComponent,
  weapon: styles.tagWeapon,
  armor: styles.tagArmor,
  vehicle: styles.tagTier1,
  ship: styles.tagShip,
  component: styles.tagComponent,
};

export default function WikeloContractCatalog() {
  const [filterTier, setFilterTier] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filtered = contracts.filter((c) => {
    if (filterTier !== "all" && c.tier !== filterTier) return false;
    if (filterCategory !== "all" && c.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Wikelo Contract Catalog</h1>
      <p className={styles.subtitle}>
        Full list of Wikelo collection contracts with requirements, rewards, and
        categories.
      </p>

      <nav className={styles.guideNav}>
        <Link href="/guides/wikelo">Contracts</Link>
        <Link href="/guides/wikelo/reputation">Reputation</Link>
        <Link href="/guides/wikelo/items">Item Gathering</Link>
        <Link href="/guides/wikelo/emporiums">Emporiums</Link>
        <Link href="/guides/wikelo/rewards">Rewards</Link>
        <Link href="/guides/wikelo/favors">Favors</Link>
        <Link href="/guides/wikelo/tracker">Tracker</Link>
      </nav>

      <div className={styles.filters}>
        <select
          value={filterTier}
          onChange={(e) => setFilterTier(e.target.value)}
          className={styles.select}
        >
          <option value="all">All Tiers</option>
          <option value="New Customer">New Customer</option>
          <option value="Very Good Customer">Very Good Customer</option>
          <option value="Very Best Customer">Very Best Customer</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className={styles.select}
        >
          <option value="all">All Categories</option>
          <option value="currency">Currency</option>
          <option value="utility">Utility</option>
          <option value="weapon">Weapon</option>
          <option value="armor">Armor</option>
          <option value="vehicle">Vehicle</option>
          <option value="ship">Ship</option>
          <option value="component">Component</option>
        </select>
      </div>

      <div className={styles.cardGrid}>
        {filtered.map((contract) => (
          <div key={contract.id} className={styles.card}>
            <div className={styles.cardTitle}>{contract.name}</div>
            <div className={styles.cardMeta}>
              <span className={tierTag[contract.tier]}>{contract.tier}</span>
              <span className={categoryTag[contract.category]}>
                {contract.category}
              </span>
              {!contract.active && (
                <span className={styles.tagTier3}>inactive</span>
              )}
            </div>
            <div className={styles.contractRequirements}>
              <strong className={styles.contractRequirementsLabel}>
                Requirements:
              </strong>
              <ul className={styles.contractRequirementsList}>
                {contract.requirements.map((r) => (
                  <li key={r.item}>
                    {r.quantity}x {r.item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.contractReward}>
              <strong>Rewards:</strong>{" "}
              {contract.rewards.map((reward, i) => (
                <span key={reward}>
                  {i > 0 && ", "}
                  <span className={styles.highlight}>{reward}</span>
                </span>
              ))}
            </div>
            {contract.notes && (
              <div className={`${styles.cardDesc} ${styles.contractNotes}`}>
                {contract.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      <CommentSection guidePath="/guides/wikelo" />
    </div>
  );
}
