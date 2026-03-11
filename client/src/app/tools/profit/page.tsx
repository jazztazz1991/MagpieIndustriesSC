"use client";

import { useState, useMemo, useCallback } from "react";
import {
  simulateProfit,
  compareActivities,
  type ActivityConfig,
  type SimulationResult,
} from "@/domain/profitSimulator";
import { profitPresets } from "@/data/profitPresets";
import tools from "../tools.module.css";
import styles from "./profit.module.css";

type SortKey =
  | "activity"
  | "profitPerHour"
  | "dailyProfit"
  | "hoursToBreakEven"
  | "profitAfterHours";

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export default function ProfitSimulatorPage() {
  const [presetIndex, setPresetIndex] = useState(0);
  const [name, setName] = useState(profitPresets[0].name);
  const [profitPerRun, setProfitPerRun] = useState(profitPresets[0].profitPerRun);
  const [timePerRunMin, setTimePerRunMin] = useState(profitPresets[0].timePerRunMin);
  const [investmentCost, setInvestmentCost] = useState(profitPresets[0].investmentCost);
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [totalDays, setTotalDays] = useState(30);
  const [showComparison, setShowComparison] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("profitPerHour");
  const [sortAsc, setSortAsc] = useState(false);

  const handlePresetChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const idx = parseInt(e.target.value, 10);
      setPresetIndex(idx);
      if (idx >= 0 && idx < profitPresets.length) {
        const preset = profitPresets[idx];
        setName(preset.name);
        setProfitPerRun(preset.profitPerRun);
        setTimePerRunMin(preset.timePerRunMin);
        setInvestmentCost(preset.investmentCost);
      }
    },
    [],
  );

  const currentConfig: ActivityConfig = useMemo(
    () => ({
      name,
      profitPerRun,
      timePerRunMin,
      investmentCost,
    }),
    [name, profitPerRun, timePerRunMin, investmentCost],
  );

  const result = useMemo(
    () => simulateProfit(currentConfig, hoursPerDay, totalDays),
    [currentConfig, hoursPerDay, totalDays],
  );

  const comparisonResults = useMemo(() => {
    if (!showComparison) return [];
    return compareActivities(profitPresets, hoursPerDay, totalDays);
  }, [showComparison, hoursPerDay, totalDays]);

  const sortedComparison = useMemo(() => {
    if (comparisonResults.length === 0) return [];
    const sorted = [...comparisonResults].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
    return sorted;
  }, [comparisonResults, sortKey, sortAsc]);

  const bestValues = useMemo(() => {
    if (sortedComparison.length === 0) return null;
    return {
      profitPerHour: Math.max(...sortedComparison.map((r) => r.profitPerHour)),
      dailyProfit: Math.max(...sortedComparison.map((r) => r.dailyProfit)),
      hoursToBreakEven: Math.min(
        ...sortedComparison.filter((r) => r.hoursToBreakEven > 0).map((r) => r.hoursToBreakEven),
      ),
      profitAfterHours: Math.max(...sortedComparison.map((r) => r.profitAfterHours)),
    };
  }, [sortedComparison]);

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortAsc((prev) => !prev);
      } else {
        setSortKey(key);
        setSortAsc(false);
      }
    },
    [sortKey],
  );

  const renderSortArrow = (key: SortKey) => {
    if (sortKey !== key) return null;
    return (
      <span className={styles.sortArrow}>{sortAsc ? "\u25B2" : "\u25BC"}</span>
    );
  };

  return (
    <div className={tools.page}>
      <h1 className={tools.title}>Profit Simulator</h1>
      <p className={tools.subtitle}>
        Calculate ROI on ships and activities. Compare mining, trading, salvage,
        and bounties.
      </p>

      <div className={tools.grid}>
        <div className={tools.panel}>
          <h2 className={tools.panelTitle}>Activity Configuration</h2>

          <div className={tools.field}>
            <label htmlFor="preset-select">Preset</label>
            <select
              id="preset-select"
              className={tools.select}
              value={presetIndex}
              onChange={handlePresetChange}
            >
              {profitPresets.map((p, i) => (
                <option key={p.name} value={i}>
                  {p.name}
                </option>
              ))}
              <option value={-1}>Custom</option>
            </select>
          </div>

          <div className={tools.field}>
            <label htmlFor="activity-name">Activity Name</label>
            <input
              id="activity-name"
              className={tools.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={tools.inputRow}>
            <div className={tools.field}>
              <label htmlFor="profit-per-run">Profit per Run (aUEC)</label>
              <input
                id="profit-per-run"
                className={tools.input}
                type="number"
                min={0}
                value={profitPerRun}
                onChange={(e) => setProfitPerRun(Number(e.target.value))}
              />
            </div>
            <div className={tools.field}>
              <label htmlFor="time-per-run">Time per Run (min)</label>
              <input
                id="time-per-run"
                className={tools.input}
                type="number"
                min={1}
                value={timePerRunMin}
                onChange={(e) => setTimePerRunMin(Number(e.target.value))}
              />
            </div>
          </div>

          <div className={tools.field}>
            <label htmlFor="investment-cost">Investment Cost (aUEC)</label>
            <input
              id="investment-cost"
              className={tools.input}
              type="number"
              min={0}
              value={investmentCost}
              onChange={(e) => setInvestmentCost(Number(e.target.value))}
            />
          </div>

          <div className={tools.field}>
            <label htmlFor="hours-per-day">
              Hours per Day: {hoursPerDay}
            </label>
            <div className={styles.sliderRow}>
              <input
                id="hours-per-day"
                className={styles.slider}
                type="range"
                min={1}
                max={16}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
              />
              <span className={styles.sliderValue}>{hoursPerDay}h</span>
            </div>
          </div>

          <div className={tools.field}>
            <label htmlFor="total-days">Total Days</label>
            <input
              id="total-days"
              className={tools.input}
              type="number"
              min={1}
              max={365}
              value={totalDays}
              onChange={(e) => setTotalDays(Number(e.target.value))}
            />
          </div>
        </div>

        <div className={tools.panel}>
          <h2 className={tools.panelTitle}>Simulation Results</h2>

          <div className={tools.statGrid}>
            <div className={tools.stat}>
              <span className={tools.statLabel}>Profit / Hour</span>
              <span className={tools.statValue}>
                {formatNumber(result.profitPerHour)} aUEC
              </span>
            </div>
            <div className={tools.stat}>
              <span className={tools.statLabel}>Daily Profit</span>
              <span className={tools.statValue}>
                {formatNumber(result.dailyProfit)} aUEC
              </span>
            </div>
            <div className={tools.stat}>
              <span className={tools.statLabel}>Break-Even Time</span>
              <span className={tools.statValue}>
                {result.hoursToBreakEven > 0
                  ? `${result.hoursToBreakEven} hours (${result.runsToBreakEven} runs)`
                  : "Immediate"}
              </span>
            </div>
            <div className={`${tools.stat} ${tools.statHighlight}`}>
              <span className={tools.statLabel}>
                Total Profit ({totalDays} days)
              </span>
              <span className={tools.statValue}>
                {formatNumber(result.profitAfterHours)} aUEC
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.btnCompare}
          onClick={() => setShowComparison((prev) => !prev)}
        >
          {showComparison ? "Hide Comparison" : "Compare All Presets"}
        </button>
      </div>

      {showComparison && sortedComparison.length > 0 && (
        <div className={`${tools.panel} ${styles.comparisonSection}`}>
          <h2 className={tools.panelTitle}>Activity Comparison</h2>
          <div className={tools.tableWrap}>
            <table className={tools.table}>
              <thead>
                <tr>
                  <th
                    className={styles.sortable}
                    onClick={() => handleSort("activity")}
                  >
                    Activity{renderSortArrow("activity")}
                  </th>
                  <th
                    className={styles.sortable}
                    onClick={() => handleSort("profitPerHour")}
                  >
                    Profit/Hour{renderSortArrow("profitPerHour")}
                  </th>
                  <th
                    className={styles.sortable}
                    onClick={() => handleSort("dailyProfit")}
                  >
                    Daily Profit{renderSortArrow("dailyProfit")}
                  </th>
                  <th
                    className={styles.sortable}
                    onClick={() => handleSort("hoursToBreakEven")}
                  >
                    Break-Even{renderSortArrow("hoursToBreakEven")}
                  </th>
                  <th
                    className={styles.sortable}
                    onClick={() => handleSort("profitAfterHours")}
                  >
                    {totalDays}-Day Profit{renderSortArrow("profitAfterHours")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedComparison.map((r: SimulationResult) => (
                  <tr key={r.activity}>
                    <td>{r.activity}</td>
                    <td
                      className={
                        bestValues && r.profitPerHour === bestValues.profitPerHour
                          ? styles.highlight
                          : undefined
                      }
                    >
                      {formatNumber(r.profitPerHour)} aUEC
                    </td>
                    <td
                      className={
                        bestValues && r.dailyProfit === bestValues.dailyProfit
                          ? styles.highlight
                          : undefined
                      }
                    >
                      {formatNumber(r.dailyProfit)} aUEC
                    </td>
                    <td
                      className={
                        bestValues &&
                        r.hoursToBreakEven > 0 &&
                        r.hoursToBreakEven === bestValues.hoursToBreakEven
                          ? styles.highlight
                          : undefined
                      }
                    >
                      {r.hoursToBreakEven > 0
                        ? `${r.hoursToBreakEven}h`
                        : "Immediate"}
                    </td>
                    <td
                      className={
                        bestValues &&
                        r.profitAfterHours === bestValues.profitAfterHours
                          ? styles.highlight
                          : undefined
                      }
                    >
                      {formatNumber(r.profitAfterHours)} aUEC
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
