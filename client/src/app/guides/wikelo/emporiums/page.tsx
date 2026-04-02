"use client";

import Link from "next/link";
import { emporiums as staticEmporiums } from "@/data/wikelo";
import { useWithOverrides } from "@/hooks/useOverrides";
import styles from "../../guides.module.css";

export default function EmporiumGuides() {
  const { data: emporiums } = useWithOverrides("wikelo_emporium", staticEmporiums, (e) => e.name);
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Emporium Location Guides</h1>
      <p className={styles.subtitle}>
        How to find and reach each Wikelo Emporium station in the Stanton
        system.
      </p>

      <nav className={styles.guideNav}>
        <Link href="/guides/wikelo">Contracts</Link>
        <Link href="/guides/wikelo/reputation">Reputation</Link>
        <Link href="/guides/wikelo/items">Item Gathering</Link>
        <Link href="/guides/wikelo/emporiums">Emporiums</Link>
        <Link href="/guides/wikelo/rewards">Rewards</Link>
        <Link href="/guides/wikelo/favors">Favors</Link>
      </nav>

      <div className={styles.emporiumList}>
        {emporiums.map((emp) => (
          <div key={emp.name} className={styles.panel}>
            <h2 className={styles.panelTitle}>{emp.name}</h2>
            <div className={styles.emporiumGrid}>
              <div>
                <div className={styles.emporiumFieldLabel}>
                  Location
                </div>
                <div className={styles.emporiumFieldValue}>
                  {emp.planet}
                  {emp.moon ? ` / ${emp.moon}` : ""} — {emp.system} system
                </div>
              </div>
              <div>
                <div className={styles.emporiumFieldLabel}>
                  Position
                </div>
                <div className={styles.emporiumFieldValue}>{emp.coordinates}</div>
              </div>
            </div>
            <p className={styles.emporiumDescription}>
              {emp.description}
            </p>
            <h3 className={styles.emporiumDirectionsTitle}>
              How to Get There
            </h3>
            <ol className={styles.steps}>
              {emp.howToGet.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
