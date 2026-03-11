"use client";

import Link from "next/link";
import { contracts, type ContractCategory } from "@/data/wikelo";
import styles from "../../guides.module.css";

const categoryTag: Record<ContractCategory, string> = {
  currency: styles.tagCurrency,
  utility: styles.tagComponent,
  weapon: styles.tagWeapon,
  armor: styles.tagArmor,
  vehicle: styles.tagTier1,
  ship: styles.tagShip,
  component: styles.tagComponent,
};

export default function RewardDatabase() {
  const rewardEntries = contracts
    .filter((c) => c.active)
    .map((c) => ({
      id: c.id,
      contractName: c.name,
      category: c.category,
      tier: c.tier,
      rewards: c.rewards,
    }));

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Wikelo Reward Database</h1>
      <p className={styles.subtitle}>
        Ships, weapons, armor, and components available through Wikelo contracts.
        Rewards are listed directly on each contract.
      </p>

      <nav className={styles.guideNav}>
        <Link href="/guides/wikelo">Contracts</Link>
        <Link href="/guides/wikelo/reputation">Reputation</Link>
        <Link href="/guides/wikelo/items">Item Gathering</Link>
        <Link href="/guides/wikelo/emporiums">Emporiums</Link>
        <Link href="/guides/wikelo/rewards">Rewards</Link>
        <Link href="/guides/wikelo/favors">Favors</Link>
      </nav>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Contract</th>
            <th>Category</th>
            <th>Tier Required</th>
            <th>Rewards</th>
          </tr>
        </thead>
        <tbody>
          {rewardEntries.map((entry) => (
            <tr key={entry.id}>
              <td>
                <strong>{entry.contractName}</strong>
              </td>
              <td>
                <span className={categoryTag[entry.category]}>
                  {entry.category}
                </span>
              </td>
              <td className={styles.textSmallAlt}>{entry.tier}</td>
              <td>
                {entry.rewards.map((reward) => (
                  <div key={reward} className={styles.highlight}>
                    {reward}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
