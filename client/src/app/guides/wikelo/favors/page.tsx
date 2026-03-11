"use client";

import Link from "next/link";
import { favorTips, favorConversions } from "@/data/wikelo";
import styles from "../../guides.module.css";

export default function FavorEconomy() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Favor Economy Breakdown</h1>
      <p className={styles.subtitle}>
        How Wikelo Favors work as currency, the best ways to earn them, and
        optimal conversion paths.
      </p>

      <nav className={styles.guideNav}>
        <Link href="/guides/wikelo">Contracts</Link>
        <Link href="/guides/wikelo/reputation">Reputation</Link>
        <Link href="/guides/wikelo/items">Item Gathering</Link>
        <Link href="/guides/wikelo/emporiums">Emporiums</Link>
        <Link href="/guides/wikelo/rewards">Rewards</Link>
        <Link href="/guides/wikelo/favors">Favors</Link>
      </nav>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Key Tips</h2>
        <ul className={styles.list}>
          {favorTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Favor Conversion Paths</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Conversion</th>
              <th>Input</th>
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            {favorConversions.map((fc) => (
              <tr key={fc.name}>
                <td>
                  <strong>{fc.name}</strong>
                </td>
                <td>
                  {fc.input.map((inp) => (
                    <div key={inp.item}>
                      {inp.quantity}x {inp.item}
                    </div>
                  ))}
                </td>
                <td className={styles.highlight}>
                  {fc.output.quantity}x {fc.output.item}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
