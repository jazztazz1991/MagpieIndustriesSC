"use client";

import Link from "next/link";
import styles from "../guides.module.css";
import CommentSection from "@/components/comments/CommentSection";

export default function BeginnersGuide() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Beginner&apos;s Guide to Star Citizen</h1>
      <p className={styles.subtitle}>
        New to the verse? This guide covers everything you need to get started.
      </p>

      <div className={styles.prose}>
        <h2>Getting Started</h2>
        <p>
          Star Citizen is a massive space sim. When you first spawn, you will
          wake up in an apartment at one of the four major landing zones:
          Lorville (Hurston), Area 18 (ArcCorp), New Babbage (microTech), or
          Orison (Crusader). Your choice of starter ship determines where you
          begin.
        </p>

        <h3>First Steps</h3>
        <ul>
          <li>Open your mobiGlas (F1) to check your contracts and map.</li>
          <li>Head to the spaceport and use a ship terminal to spawn your ship.</li>
          <li>Fly out of the hangar and into open space — use F to interact with doors and elevators.</li>
          <li>Open the Starmap (F2) to set a quantum travel destination.</li>
          <li>Spool your quantum drive (B) and jump (B again when ready).</li>
        </ul>

        <h2>Making Money</h2>
        <p>
          There are many ways to earn aUEC (in-game currency) in Star Citizen.
          Here are the most accessible for new players:
        </p>

        <h3>Bounty Hunting</h3>
        <p>
          Accept bounty contracts from your mobiGlas. Start with VLRT
          (Very Low Risk Target) bounties and work your way up. This is the
          fastest way to earn money early on with a combat-capable ship.
        </p>

        <h3>Mining</h3>
        <p>
          If you have a Prospector or access to a ROC, mining can be very
          profitable. Check our{" "}
          <Link href="/tools/mining" className={styles.accentLink}>
            Mining Calculator
          </Link>{" "}
          to plan your operations and see which ores are most valuable.
        </p>

        <h3>Cargo Hauling</h3>
        <p>
          Buy commodities at one location and sell them at another for a profit.
          Use our{" "}
          <Link href="/tools/trade" className={styles.accentLink}>
            Trade Route Planner
          </Link>{" "}
          to find the best routes. Start small — you can lose your investment
          if your ship gets destroyed.
        </p>

        <h3>Salvage</h3>
        <p>
          With a Vulture or the hand salvage tool, you can scrape ship hulls for
          RMC (Recycled Material Composite). Check our{" "}
          <Link href="/tools/salvage" className={styles.accentLink}>
            Salvage Calculator
          </Link>{" "}
          to estimate profits from different wrecks.
        </p>

        <h3>Wikelo Contracts</h3>
        <p>
          Wikelo is a Banu trader who offers collection contracts for unique
          rewards including ships, weapons, and armor. See our{" "}
          <Link href="/guides/wikelo" className={styles.accentLink}>
            Wikelo Mission Guides
          </Link>{" "}
          for the full breakdown.
        </p>

        <h2>Essential Keybinds</h2>
        <ul>
          <li><strong>F1</strong> — mobiGlas (contracts, inventory, map)</li>
          <li><strong>F2</strong> — Starmap (navigation and quantum destinations)</li>
          <li><strong>F</strong> — Interact mode (doors, elevators, terminals)</li>
          <li><strong>B</strong> — Spool/engage quantum drive</li>
          <li><strong>R</strong> — Holster/draw weapon</li>
          <li><strong>N</strong> — Landing mode toggle</li>
          <li><strong>Y</strong> — Exit seat / exit ship</li>
          <li><strong>Tab</strong> — Scan mode (mining, finding targets)</li>
          <li><strong>Left Alt + Backspace</strong> — Self-destruct (emergency respawn)</li>
        </ul>

        <h2>Choosing Your First Ship Upgrade</h2>
        <p>
          Your starter ship (Aurora or Mustang) is fine for learning, but you
          will want to upgrade eventually. The most recommended first upgrade is
          the <strong>Avenger Titan</strong> — it has cargo, combat capability,
          and a bed for logging out in space. Browse our{" "}
          <Link href="/ships" className={styles.accentLink}>
            Ship Database
          </Link>{" "}
          to compare all options.
        </p>

        <h2>Tips for New Players</h2>
        <ul>
          <li>Star Citizen is in alpha — expect bugs. Learn to work around them.</li>
          <li>Always store items in local inventory before logging out.</li>
          <li>Ship insurance is on a timer — claim your ship at a terminal if destroyed.</li>
          <li>Join an org or group for help and coordinated gameplay.</li>
          <li>Use the in-game chat (F12) to ask questions — the community is helpful.</li>
          <li>Set your respawn point at a clinic to avoid long travel after death.</li>
          <li>Do not carry more cargo than you can afford to lose.</li>
        </ul>

        <h2>Useful Tools on This Site</h2>
        <ul>
          <li>
            <Link href="/tools/mining" className={styles.accentLink}>
              Mining Calculator
            </Link>{" "}
            — calculate ore profits
          </li>
          <li>
            <Link href="/tools/salvage" className={styles.accentLink}>
              Salvage Calculator
            </Link>{" "}
            — estimate wreck salvage values
          </li>
          <li>
            <Link href="/tools/refinery" className={styles.accentLink}>
              Refinery Optimizer
            </Link>{" "}
            — compare refinery methods
          </li>
          <li>
            <Link href="/tools/trade" className={styles.accentLink}>
              Trade Route Planner
            </Link>{" "}
            — find profitable trade routes
          </li>
          <li>
            <Link href="/ships" className={styles.accentLink}>
              Ship Database
            </Link>{" "}
            — browse and compare all ships
          </li>
          <li>
            <Link href="/locations" className={styles.accentLink}>
              Locations Database
            </Link>{" "}
            — explore the Stanton system
          </li>
          <li>
            <Link href="/guides/wikelo" className={styles.accentLink}>
              Wikelo Guides
            </Link>{" "}
            — complete Banu trader contract guides
          </li>
        </ul>
      </div>

      <CommentSection guidePath="/guides/beginner" />
    </div>
  );
}
