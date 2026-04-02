import Link from "next/link";
import styles from "./home.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Magpie Industries SC</h1>
        <p className={styles.subtitle}>
          Tools, guides, and org management for Star Citizen players.
        </p>
        <div className={styles.cta}>
          <Link href="/tools/mining" className={styles.btnPrimary}>
            Mining Calculator
          </Link>
          <Link href="/ships" className={styles.btnSecondary}>
            Ship Database
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <h3>Mining Calculator</h3>
          <p>
            Input rock composition and cargo capacity to calculate profit per
            SCU for any ore type.
          </p>
          <Link href="/tools/mining">Open Tool</Link>
        </div>

        <div className={styles.featureCard}>
          <h3>Refinery Optimizer</h3>
          <p>
            Compare all refinery methods side-by-side by yield, time, and net
            profit.
          </p>
          <Link href="/tools/refinery">Open Tool</Link>
        </div>

        <div className={styles.featureCard}>
          <h3>Ship Database</h3>
          <p>
            Browse specs, pricing, and comparisons for every flyable ship in the
            verse.
          </p>
          <Link href="/ships">Open Database</Link>
        </div>

        <div className={styles.featureCard}>
          <h3>Loadout Planner</h3>
          <p>
            Plan ship component loadouts and compare weapons, shields, and quantum drives.
          </p>
          <Link href="/tools/loadout">Plan Loadout</Link>
        </div>

        <div className={styles.featureCard}>
          <h3>Ship Comparison</h3>
          <p>
            Compare up to 4 ships side by side — cargo, speed, crew, and price stats highlighted.
          </p>
          <Link href="/tools/ship-compare">Compare Ships</Link>
        </div>

        <div className={styles.featureCard}>
          <h3>Wikelo Mission Guides</h3>
          <p>
            Complete guide to Banu trader contracts, reputation, rewards, and
            Favors.
          </p>
          <Link href="/guides/wikelo">View Guides</Link>
        </div>

        <div className={styles.featureCard}>
          <h3>Locations Database</h3>
          <p>
            Explore planets, moons, cities, and stations in the Stanton system.
          </p>
          <Link href="/locations">Explore</Link>
        </div>

        <div className={styles.featureCard}>
          <h3>Community</h3>
          <p>
            Connect with friends, create groups, schedule events, and share tips
            with the community.
          </p>
          <Link href="/community/friends">Join In</Link>
        </div>

        <div className={styles.featureCard}>
          <h3>Beginner&apos;s Guide</h3>
          <p>
            New to the verse? Everything you need to know to get started in Star
            Citizen.
          </p>
          <Link href="/guides/beginner">Read Guide</Link>
        </div>
      </section>
    </main>
  );
}
