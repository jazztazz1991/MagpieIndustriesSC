"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ships, Ship } from "@/data/ships";
import toolStyles from "../../tools/tools.module.css";
import styles from "./compare.module.css";

type StatRow = {
  label: string;
  values: string[];
  /** Index(es) of the "best" value, if highlighting applies */
  bestIndexes: number[];
};

function findBestIndexes(
  selectedShips: (Ship | null)[],
  getValue: (ship: Ship) => number | null,
  mode: "highest" | "lowest",
): number[] {
  const values = selectedShips.map((s) => (s ? getValue(s) : null));
  const validValues = values.filter((v): v is number => v !== null);
  if (validValues.length < 2) return [];

  const target =
    mode === "highest" ? Math.max(...validValues) : Math.min(...validValues);
  const allSame = validValues.every((v) => v === target);
  if (allSame) return [];

  return values.reduce<number[]>((acc, v, i) => {
    if (v === target) acc.push(i);
    return acc;
  }, []);
}

export default function ShipCompare() {
  const [selections, setSelections] = useState<(string | "")[]>([
    "",
    "",
    "",
  ]);

  const selectedShips = useMemo(
    () =>
      selections.map((name) =>
        name ? ships.find((s) => s.name === name) ?? null : null,
      ),
    [selections],
  );

  const hasAnySelection = selectedShips.some((s) => s !== null);

  function handleSelect(index: number, value: string) {
    setSelections((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  const rows: StatRow[] = useMemo(() => {
    if (!hasAnySelection) return [];

    return [
      {
        label: "Name",
        values: selectedShips.map((s) => s?.name ?? "—"),
        bestIndexes: [],
      },
      {
        label: "Manufacturer",
        values: selectedShips.map((s) => s?.manufacturer ?? "—"),
        bestIndexes: [],
      },
      {
        label: "Role",
        values: selectedShips.map((s) => s?.role ?? "—"),
        bestIndexes: [],
      },
      {
        label: "Size",
        values: selectedShips.map((s) => (s ? s.size : "—")),
        bestIndexes: [],
      },
      {
        label: "Crew",
        values: selectedShips.map((s) =>
          s
            ? s.crew.max > s.crew.min
              ? `${s.crew.min}–${s.crew.max}`
              : `${s.crew.min}`
            : "—",
        ),
        bestIndexes: findBestIndexes(
          selectedShips,
          (s) => s.crew.max,
          "highest",
        ),
      },
      {
        label: "Cargo (SCU)",
        values: selectedShips.map((s) =>
          s ? `${s.cargoSCU}` : "—",
        ),
        bestIndexes: findBestIndexes(
          selectedShips,
          (s) => s.cargoSCU,
          "highest",
        ),
      },
      {
        label: "SCM Speed (m/s)",
        values: selectedShips.map((s) =>
          s ? `${s.speed.scm}` : "—",
        ),
        bestIndexes: findBestIndexes(
          selectedShips,
          (s) => s.speed.scm,
          "highest",
        ),
      },
      {
        label: "Max Speed (m/s)",
        values: selectedShips.map((s) =>
          s ? `${s.speed.max}` : "—",
        ),
        bestIndexes: findBestIndexes(
          selectedShips,
          (s) => s.speed.max,
          "highest",
        ),
      },
      {
        label: "In-Game Price (aUEC)",
        values: selectedShips.map((s) =>
          s?.buyPriceAUEC
            ? s.buyPriceAUEC.toLocaleString()
            : "—",
        ),
        bestIndexes: findBestIndexes(
          selectedShips,
          (s) => s.buyPriceAUEC,
          "lowest",
        ),
      },
      {
        label: "Pledge Price (USD)",
        values: selectedShips.map((s) =>
          s?.pledgeUSD ? `$${s.pledgeUSD}` : "—",
        ),
        bestIndexes: findBestIndexes(
          selectedShips,
          (s) => s.pledgeUSD,
          "lowest",
        ),
      },
    ];
  }, [selectedShips, hasAnySelection]);

  return (
    <div className={toolStyles.page}>
      <Link href="/ships" className={styles.backLink}>
        &larr; Back to Ship Database
      </Link>
      <h1 className={toolStyles.title}>Ship Comparison</h1>
      <p className={toolStyles.subtitle}>
        Select up to 3 ships to compare side by side.
      </p>

      <div className={toolStyles.panel}>
        <div className={styles.selectors}>
          {selections.map((sel, i) => (
            <div key={i} className={styles.selector}>
              <span className={styles.selectorLabel}>Ship {i + 1}</span>
              <select
                value={sel}
                onChange={(e) => handleSelect(i, e.target.value)}
                className={toolStyles.select}
                aria-label={`Select ship ${i + 1}`}
              >
                <option value="">— Select a ship —</option>
                {ships.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {hasAnySelection ? (
        <div className={toolStyles.panel}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Stat</th>
                  {selectedShips.map((s, i) => (
                    <th key={i}>{s?.name ?? `Ship ${i + 1}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <td className={styles.labelCol}>{row.label}</td>
                    {row.values.map((val, i) => (
                      <td
                        key={i}
                        className={
                          row.bestIndexes.includes(i) ? styles.best : undefined
                        }
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className={styles.emptyState}>
          Select at least one ship above to begin comparing.
        </p>
      )}
    </div>
  );
}
