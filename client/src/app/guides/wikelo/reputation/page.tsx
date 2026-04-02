"use client";

import Link from "next/link";
import { reputationTiers as staticReputationTiers } from "@/data/wikelo";
import { useWithOverrides } from "@/hooks/useOverrides";
import styles from "../../guides.module.css";

const tierColors = [styles.tagTier1, styles.tagTier2, styles.tagTier3];

export default function ReputationGuide() {
  const { data: reputationTiers } = useWithOverrides("wikelo_reputation_tier", staticReputationTiers, (t) => t.tier);
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Wikelo Reputation Guide</h1>
      <p className={styles.subtitle}>
        How to rank up through the three reputation tiers and unlock better
        contracts and rewards.
      </p>

      <nav className={styles.guideNav}>
        <Link href="/guides/wikelo">Contracts</Link>
        <Link href="/guides/wikelo/reputation">Reputation</Link>
        <Link href="/guides/wikelo/items">Item Gathering</Link>
        <Link href="/guides/wikelo/emporiums">Emporiums</Link>
        <Link href="/guides/wikelo/rewards">Rewards</Link>
        <Link href="/guides/wikelo/favors">Favors</Link>
      </nav>

      <div className={styles.cardGrid}>
        {reputationTiers.map((tier, i) => (
          <div key={tier.tier} className={styles.panel}>
            <h2 className={styles.panelTitle}>
              <span className={tierColors[i]}>{tier.tier}</span>
            </h2>
            <p className={styles.tierRequirement}>
              {tier.requirement}
            </p>
            <ul className={styles.list}>
              {tier.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Tips for Ranking Up Fast</h2>
        <ul className={styles.list}>
          <li>Focus on completing the easiest contracts first to build base reputation.</li>
          <li>Contracts at all three stations count toward the same reputation pool.</li>
          <li>Ore delivery contracts are often the fastest to complete with a Prospector.</li>
          <li>Check all three Emporiums — different contracts may be available at each.</li>
          <li>Some contracts can be repeated. Farm easy ones to build rep quickly.</li>
          <li>Group up with friends to gather items faster for multi-requirement contracts.</li>
        </ul>
      </div>
    </div>
  );
}
