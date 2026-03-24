"use client";

import { useState, useMemo, useCallback } from "react";
import type { Ore } from "@/data/mining";
import { useGameData } from "@/hooks/useGameData";
import {
  calculateMiningProfit,
  assessRockViability,
  analyzeRock,
  compareLasersForRock,
} from "@/domain/mining";
import FleetBuilder from "@/components/mining/FleetBuilder";
import type { Loadout, ResolvedHead } from "@/components/mining/LoadoutBuilder";
import shared from "../tools.module.css";
import ms from "./mining.module.css";

type Tab = "scanner" | "profit" | "lasers" | "reference";

interface CompositionEntry {
  ore: Ore;
  percentage: number;
}

const TABS: { key: Tab; label: string }[] = [
  { key: "scanner", label: "Rock Scanner" },
  { key: "profit", label: "Profit Calculator" },
  { key: "lasers", label: "Compare Lasers" },
  { key: "reference", label: "Ore Reference" },
];

function formatPctMod(value: number): string {
  if (value === 0) return "\u2014";
  return value > 0 ? `+${value}%` : `${value}%`;
}

function formatCompact(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}m`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return value.toString();
}

export default function MiningCalculator() {
  const { data: gameData, loading: gameDataLoading } = useGameData();
  const { ores, scannerOreOrder, rockClasses, lasers: miningLasers, activeModules, passiveModules, ships: miningShips } = gameData;

  const [activeTab, setActiveTab] = useState<Tab>("scanner");

  // Fleet state (from FleetBuilder)
  const [fleetLoadouts, setFleetLoadouts] = useState<Loadout[]>([]);
  const [resolvedHeads, setResolvedHeads] = useState<ResolvedHead[]>([]);

  const handleFleetChange = useCallback((loadouts: Loadout[], allResolved: ResolvedHead[]) => {
    setFleetLoadouts(loadouts);
    setResolvedHeads(allResolved);
  }, []);

  const primaryLoadout = fleetLoadouts[0] ?? null;
  const ship = miningShips.find((s) => s.name === primaryLoadout?.shipName) ?? miningShips[0];

  // Scanner properties
  const [rockClass, setRockClass] = useState<string>("");
  const effectiveRockClass = rockClass || rockClasses[0] || "";
  const [rockMass, setRockMass] = useState(53819);
  const [rockInstability, setRockInstability] = useState(413.82);
  const [rockResistance, setRockResistance] = useState(60);
  const [rockSCU, setRockSCU] = useState(143.30);

  // Composition
  const [selectedAbbrevs, setSelectedAbbrevs] = useState<string[]>(["QUAN", "TITA", "INER"]);
  const [orePcts, setOrePcts] = useState<Record<string, number>>({
    QUAN: 44.37,
    TITA: 46.73,
    INER: 9.0,
  });

  // Profit calculator state
  const [totalSCU, setTotalSCU] = useState(0);
  const fleetCargoSCU = fleetLoadouts.reduce((sum, l) => {
    const s = miningShips.find((sh) => sh.name === l.shipName);
    return sum + (s?.cargoSCU ?? 0);
  }, 0);
  const effectiveTotalSCU = totalSCU || fleetCargoSCU || 32;
  const [minValuePerSCU, setMinValuePerSCU] = useState(5000);

  // Build composition from scanner state
  const composition: CompositionEntry[] = useMemo(() => {
    return selectedAbbrevs
      .map((abbr) => {
        const ore = ores.find((o) => o.abbrev === abbr);
        if (!ore) return null;
        return { ore, percentage: orePcts[abbr] ?? 0 };
      })
      .filter((e): e is CompositionEntry => e !== null);
  }, [selectedAbbrevs, orePcts, ores]);

  const totalPercentage = composition.reduce((sum, c) => sum + c.percentage, 0);

  // Ore toggle
  const toggleOre = useCallback((abbr: string) => {
    setSelectedAbbrevs((prev) => {
      if (prev.includes(abbr)) return prev.filter((a) => a !== abbr);
      return [...prev, abbr];
    });
    setOrePcts((prev) => {
      if (prev[abbr] === undefined) return { ...prev, [abbr]: 10 };
      return prev;
    });
  }, []);

  const selectAllOres = () => {
    const all = scannerOreOrder.filter((a) => a !== "INER");
    setSelectedAbbrevs([...all, "INER"]);
    setOrePcts((prev) => {
      const next = { ...prev };
      for (const a of scannerOreOrder) {
        if (next[a] === undefined) next[a] = 0;
      }
      return next;
    });
  };

  const selectNoOres = () => setSelectedAbbrevs([]);

  const updateOrePct = (abbr: string, pct: number) => {
    setOrePcts((prev) => ({ ...prev, [abbr]: pct }));
  };

  // --- Multi-head viability ---
  const perHeadViability = useMemo(() => {
    return resolvedHeads.map((head) =>
      assessRockViability(rockMass, rockInstability, rockResistance, head.laser, head.activeModules, head.passiveModules)
    );
  }, [rockMass, rockInstability, rockResistance, resolvedHeads]);

  const combinedViability = useMemo(() => {
    if (perHeadViability.length === 0) return null;
    const combinedPower = perHeadViability.reduce((sum, v) => sum + v.effectivePower, 0);
    const avgInstability = perHeadViability.reduce((sum, v) => sum + v.effectiveInstability, 0) / perHeadViability.length;
    const avgResistance = perHeadViability.reduce((sum, v) => sum + v.effectiveResistance, 0) / perHeadViability.length;
    // Combined canCrack: total power from all heads must exceed the fracture threshold
    const fractureThreshold = rockMass * (rockResistance / 100);
    const canCrack = combinedPower > fractureThreshold;

    let crackDifficulty: "easy" | "moderate" | "hard" | "extreme" | "impossible";
    if (avgResistance <= 0) crackDifficulty = "easy";
    else if (avgResistance < 30) crackDifficulty = "easy";
    else if (avgResistance < 50) crackDifficulty = "moderate";
    else if (avgResistance < 75) crackDifficulty = "hard";
    else if (avgResistance < 100) crackDifficulty = "extreme";
    else crackDifficulty = "impossible";

    let instabilityRisk: "safe" | "manageable" | "dangerous" | "deadly";
    if (avgInstability < 150) instabilityRisk = "safe";
    else if (avgInstability < 400) instabilityRisk = "manageable";
    else if (avgInstability < 700) instabilityRisk = "dangerous";
    else instabilityRisk = "deadly";

    return {
      combinedPower: Math.round(combinedPower * 100) / 100,
      fractureThreshold: Math.round(fractureThreshold * 100) / 100,
      avgInstability: Math.round(avgInstability * 100) / 100,
      avgResistance: Math.round(avgResistance * 100) / 100,
      canCrack,
      crackDifficulty,
      instabilityRisk,
    };
  }, [perHeadViability, rockMass, rockResistance]);

  const rockAnalysis = useMemo(
    () => analyzeRock(composition, rockSCU, minValuePerSCU),
    [composition, rockSCU, minValuePerSCU]
  );

  // Use first head's laser for comparison tab
  const primaryLaser = resolvedHeads[0]?.laser ?? miningLasers[0];
  const primaryActiveModules = resolvedHeads[0]?.activeModules ?? [];
  const primaryPassiveModules = resolvedHeads[0]?.passiveModules ?? [];

  const laserComparisons = useMemo(
    () => primaryLaser ? compareLasersForRock(
      rockMass,
      rockInstability,
      rockResistance,
      miningLasers.filter((l) => l.size === primaryLaser.size),
      primaryActiveModules,
      primaryPassiveModules
    ) : [],
    [rockMass, rockInstability, rockResistance, primaryLaser, miningLasers, primaryActiveModules, primaryPassiveModules]
  );

  const profitResults = useMemo(
    () => calculateMiningProfit(composition, rockSCU),
    [composition, rockSCU]
  );

  const totalValue = profitResults.reduce((sum, r) => sum + r.value, 0);

  // Profit tab composition handlers
  const [profitComposition, setProfitComposition] = useState<CompositionEntry[]>([]);
  const initProfitComp = profitComposition.length === 0 && ores.length > 0;
  if (initProfitComp) {
    setProfitComposition([{ ore: ores[0], percentage: 30 }]);
  }

  const profitTotalPct = profitComposition.reduce((sum, c) => sum + c.percentage, 0);
  const profitCalcResults = useMemo(
    () => calculateMiningProfit(profitComposition, effectiveTotalSCU),
    [profitComposition, effectiveTotalSCU]
  );
  const profitCalcTotal = profitCalcResults.reduce((sum, r) => sum + r.value, 0);

  const addProfitOre = () => {
    const unused = ores.find((o) => !profitComposition.some((c) => c.ore.name === o.name));
    if (unused) setProfitComposition([...profitComposition, { ore: unused, percentage: 10 }]);
  };
  const removeProfitOre = (i: number) => setProfitComposition(profitComposition.filter((_, idx) => idx !== i));
  const updateProfitOre = (i: number, name: string) => {
    const ore = ores.find((o) => o.name === name)!;
    const updated = [...profitComposition];
    updated[i] = { ...updated[i], ore };
    setProfitComposition(updated);
  };
  const updateProfitPct = (i: number, pct: number) => {
    const updated = [...profitComposition];
    updated[i] = { ...updated[i], percentage: pct };
    setProfitComposition(updated);
  };

  // Badge helpers
  const difficultyColor = (d: string) => {
    const map: Record<string, string> = {
      easy: ms.badgeGreen, moderate: ms.badgeYellow, hard: ms.badgeOrange,
      extreme: ms.badgeRed, impossible: ms.badgePurple,
    };
    return map[d] ?? "";
  };
  const riskColor = (r: string) => {
    const map: Record<string, string> = {
      safe: ms.badgeGreen, manageable: ms.badgeYellow,
      dangerous: ms.badgeOrange, deadly: ms.badgeRed,
    };
    return map[r] ?? "";
  };

  const scannerValue = rockAnalysis.totalValue;

  if (gameDataLoading) {
    return (
      <div className={shared.page}>
        <h1 className={shared.title}>Mining Calculator</h1>
        <p className={shared.subtitle}>Loading game data...</p>
      </div>
    );
  }

  return (
    <div className={shared.page}>
      <h1 className={shared.title}>Mining Calculator</h1>
      <p className={shared.subtitle}>
        Configure your equipment, scan rocks, and calculate profits.
      </p>

      {/* ========== Fleet Loadout ========== */}
      <FleetBuilder
        ships={miningShips}
        lasers={miningLasers}
        activeModules={activeModules}
        passiveModules={passiveModules}
        onFleetChange={handleFleetChange}
      />

      {/* ========== Tab Navigation ========== */}
      <div className={ms.tabs}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`${ms.tab} ${activeTab === t.key ? ms.tabActive : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ========== Rock Scanner ========== */}
      {activeTab === "scanner" && (
        <>
          <div className={ms.scannerPanel}>
            <div className={ms.scannerHeader}>
              <span className={ms.scannerTitle}>Rock Scan</span>
              <div className={ms.scannerSummary}>
                <span className={ms.scannerSummaryLine}>
                  Value: <span className={ms.scannerSummaryHighlight}>
                    {formatCompact(scannerValue)} aUEC
                  </span>
                </span>
                <span className={ms.scannerSummaryLine}>
                  Material: <span className={ms.scannerSummaryValue}>{rockSCU} SCU</span>
                </span>
              </div>
            </div>

            <div className={ms.scannerWarning}>
              Enter all minerals for maximum SCU and value accuracy.
            </div>

            <div className={ms.scannerSectionLabel}>Properties</div>
            <div className={ms.propsGrid}>
              <span className={ms.propLabel}>Rock Class</span>
              <select
                value={effectiveRockClass}
                onChange={(e) => setRockClass(e.target.value)}
                className={ms.propSelect}
                aria-label="Rock class"
              >
                {rockClasses.map((rc) => (
                  <option key={rc} value={rc}>{rc}</option>
                ))}
              </select>
              <span className={ms.propUnit} />

              <span className={ms.propLabel}>Mass</span>
              <input
                type="number"
                value={rockMass}
                onChange={(e) => setRockMass(Number(e.target.value))}
                className={ms.propInput}
                aria-label="Rock mass"
              />
              <span className={ms.propUnit}>t</span>

              <span className={ms.propLabel}>Resistance</span>
              <input
                type="number"
                value={rockResistance}
                onChange={(e) => setRockResistance(Number(e.target.value))}
                min={0}
                max={100}
                step={0.1}
                className={ms.propInput}
                aria-label="Rock resistance"
              />
              <span className={ms.propUnit}>%</span>

              <span className={ms.propLabel}>Instability</span>
              <input
                type="number"
                value={rockInstability}
                onChange={(e) => setRockInstability(Number(e.target.value))}
                min={0}
                step={0.01}
                className={ms.propInput}
                aria-label="Rock instability"
              />
              <span className={ms.propUnit} />
            </div>

            {/* Composition header with SCU */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className={ms.scannerSectionLabel}>Composition</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="number"
                  value={rockSCU}
                  onChange={(e) => setRockSCU(Number(e.target.value))}
                  min={0}
                  step={0.01}
                  className={ms.propInput}
                  style={{ width: "100px" }}
                  aria-label="Rock composition SCU"
                />
                <span className={ms.propUnit}>SCU</span>
              </div>
            </div>
            <div className={ms.oreGrid}>
              {scannerOreOrder.map((abbr) => (
                <button
                  key={abbr}
                  className={`${ms.oreBtn} ${selectedAbbrevs.includes(abbr) ? ms.oreBtnSelected : ""}`}
                  onClick={() => toggleOre(abbr)}
                >
                  {abbr}
                </button>
              ))}
              <button className={ms.oreBtnAll} onClick={selectAllOres}>ALL</button>
              <button className={ms.oreBtnNone} onClick={selectNoOres}>NONE</button>
            </div>

            {selectedAbbrevs.length > 0 && (
              <div className={ms.compSliders}>
                {selectedAbbrevs.map((abbr) => (
                  <div key={abbr} className={ms.compSliderRow}>
                    <span className={ms.compSliderLabel}>{abbr}</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={0.01}
                      value={orePcts[abbr] ?? 0}
                      onChange={(e) => updateOrePct(abbr, Number(e.target.value))}
                      className={ms.compSlider}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <input
                        type="number"
                        value={orePcts[abbr] ?? 0}
                        onChange={(e) => updateOrePct(abbr, Number(e.target.value))}
                        min={0}
                        max={100}
                        step={0.01}
                        className={ms.compPctInput}
                        aria-label={`Percentage for ${abbr}`}
                      />
                      <span className={ms.compPctUnit}>%</span>
                    </div>
                  </div>
                ))}
                <div className={totalPercentage > 100 ? ms.compTotalOver : ms.compTotal}>
                  Total: {totalPercentage.toFixed(2)}%
                </div>
              </div>
            )}
          </div>

          {/* Cluster Stats */}
          <div className={ms.scannerPanel}>
            <div className={ms.scannerSectionLabel}>Cluster Stats</div>
            <table className={ms.clusterTable}>
              <thead>
                <tr>
                  <th />
                  <th>SCU</th>
                  <th>aUEC</th>
                </tr>
              </thead>
              <tbody>
                {profitResults
                  .filter((r) => r.scu > 0 && r.ore !== "Inert Material")
                  .map((r) => (
                    <tr key={r.ore}>
                      <td className={ms.clusterOreName}>{r.ore}</td>
                      <td>{r.scu.toFixed(1)}</td>
                      <td>{formatCompact(r.value)}</td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr className={ms.clusterTotal}>
                  <td>Total</td>
                  <td>
                    {profitResults
                      .filter((r) => r.ore !== "Inert Material")
                      .reduce((s, r) => s + r.scu, 0)
                      .toFixed(1)}
                  </td>
                  <td>{formatCompact(totalValue)}</td>
                </tr>
              </tfoot>
            </table>

            <div className={ms.enoughOre}>
              <span className={ms.enoughOreTitle}>Enough ore for:</span>
              {miningShips
                .filter((s) => !s.isVehicle)
                .map((s) => {
                  const mineableSCU = profitResults
                    .filter((r) => r.ore !== "Inert Material")
                    .reduce((sum, r) => sum + r.scu, 0);
                  const loads = mineableSCU / s.cargoSCU;
                  return (
                    <span key={s.name} className={ms.enoughOreLine}>
                      {loads.toFixed(1)} {s.name}(s)
                    </span>
                  );
                })}
            </div>
          </div>

          {/* Viability Assessment — Combined + Per-Head */}
          {combinedViability && (
            <div className={shared.panel}>
              <h2 className={shared.panelTitle}>Viability Assessment</h2>

              {/* Combined summary */}
              <div className={ms.viabilityCombinedLabel}>
                Combined ({resolvedHeads.length} head{resolvedHeads.length !== 1 ? "s" : ""})
              </div>
              <div className={ms.viabilityGrid}>
                <div className={ms.viabilityStat}>
                  <span className={ms.viabilityLabel}>Can Crack?</span>
                  <span className={`${ms.badge} ${combinedViability.canCrack ? ms.badgeGreen : ms.badgeRed}`}>
                    {combinedViability.canCrack ? "YES" : "NO"}
                  </span>
                </div>
                <div className={ms.viabilityStat}>
                  <span className={ms.viabilityLabel}>Power Needed</span>
                  <span className={ms.viabilityValue}>{combinedViability.fractureThreshold.toLocaleString()}</span>
                </div>
                <div className={ms.viabilityStat}>
                  <span className={ms.viabilityLabel}>Fleet Power</span>
                  <span className={`${ms.viabilityValue} ${combinedViability.canCrack ? ms.powerSufficient : ms.powerInsufficient}`}>
                    {combinedViability.combinedPower.toLocaleString()}
                  </span>
                </div>
                <div className={ms.viabilityStat}>
                  <span className={ms.viabilityLabel}>Crack Difficulty</span>
                  <span className={`${ms.badge} ${difficultyColor(combinedViability.crackDifficulty)}`}>
                    {combinedViability.crackDifficulty.toUpperCase()}
                  </span>
                </div>
                <div className={ms.viabilityStat}>
                  <span className={ms.viabilityLabel}>Instability Risk</span>
                  <span className={`${ms.badge} ${riskColor(combinedViability.instabilityRisk)}`}>
                    {combinedViability.instabilityRisk.toUpperCase()}
                  </span>
                </div>
                <div className={ms.viabilityStat}>
                  <span className={ms.viabilityLabel}>Avg Resistance</span>
                  <span className={ms.viabilityValue}>{combinedViability.avgResistance}%</span>
                </div>
              </div>

              {/* Per-head breakdown (only show if >1 head) */}
              {resolvedHeads.length > 1 && (
                <>
                  <div className={ms.perHeadDivider} />
                  <div className={ms.viabilityCombinedLabel}>Per-Head Breakdown</div>
                  <div className={ms.perHeadGrid}>
                    {resolvedHeads.map((head, i) => {
                      const v = perHeadViability[i];
                      if (!v) return null;
                      return (
                        <div key={i} className={ms.perHeadCard}>
                          <div className={ms.perHeadTitle}>
                            Head {i + 1}: {head.laser.name}
                          </div>
                          <div className={ms.perHeadStats}>
                            <span>
                              <span className={`${ms.badge} ${v.canCrack ? ms.badgeGreen : ms.badgeRed}`}>
                                {v.canCrack ? "CAN CRACK" : "NO CRACK"}
                              </span>
                            </span>
                            <span>Power: <span className={v.canCrack ? ms.powerSufficient : ms.powerInsufficient}>{v.effectivePower.toLocaleString()}</span> / {v.fractureThreshold.toLocaleString()} needed</span>
                            <span>Instability: {v.effectiveInstability}</span>
                            <span>Resistance: {v.effectiveResistance}%</span>
                          </div>
                          <div className={ms.perHeadRec}>{v.recommendation}</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Single-head recommendation */}
              {resolvedHeads.length === 1 && perHeadViability[0] && (
                <div className={ms.recommendation}>{perHeadViability[0].recommendation}</div>
              )}
            </div>
          )}
        </>
      )}

      {/* ========== Profit Calculator ========== */}
      {activeTab === "profit" && (
        <div className={shared.grid}>
          <div className={shared.panel}>
            <h2 className={shared.panelTitle}>Rock Composition</h2>

            <label htmlFor="cargo-scu" className={shared.field}>
              <span>Cargo Capacity (SCU)</span>
              <input
                id="cargo-scu"
                type="number"
                value={effectiveTotalSCU}
                onChange={(e) => setTotalSCU(Number(e.target.value))}
                min={1}
                className={shared.input}
              />
            </label>

            <label htmlFor="min-value" className={shared.field}>
              <span>Min Value Threshold (aUEC/SCU)</span>
              <input
                id="min-value"
                type="number"
                value={minValuePerSCU}
                onChange={(e) => setMinValuePerSCU(Number(e.target.value))}
                min={0}
                className={shared.input}
              />
            </label>

            <div className={shared.compositionList}>
              {profitComposition.map((entry, i) => (
                <div key={i} className={shared.compositionRow}>
                  <select
                    value={entry.ore.name}
                    onChange={(e) => updateProfitOre(i, e.target.value)}
                    className={shared.select}
                    aria-label={`Select ore ${i + 1}`}
                  >
                    {ores.map((o) => (
                      <option key={o.name} value={o.name}>{o.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={entry.percentage}
                    onChange={(e) => updateProfitPct(i, Number(e.target.value))}
                    min={0}
                    max={100}
                    className={shared.pctInput}
                    aria-label={`Percentage for ${entry.ore.name}`}
                  />
                  <span className={shared.pctLabel}>%</span>
                  <button
                    onClick={() => removeProfitOre(i)}
                    className={shared.removeBtn}
                    aria-label={`Remove ${entry.ore.name}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className={shared.compositionFooter}>
              <button onClick={addProfitOre} className={shared.addBtn} aria-label="Add ore to composition">
                + Add Ore
              </button>
              <span className={profitTotalPct > 100 ? shared.overBudget : shared.budget}>
                Total: {profitTotalPct}%
              </span>
            </div>
          </div>

          <div className={shared.panel}>
            <h2 className={shared.panelTitle}>Profit Breakdown</h2>
            <table className={shared.table}>
              <thead>
                <tr>
                  <th>Ore</th>
                  <th>SCU</th>
                  <th>Value (aUEC)</th>
                </tr>
              </thead>
              <tbody>
                {profitCalcResults.map((r) => (
                  <tr key={r.ore}>
                    <td>{r.ore}</td>
                    <td>{r.scu}</td>
                    <td>{r.value.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className={shared.totalRow}>
                  <td>Total</td>
                  <td>{profitCalcResults.reduce((s, r) => s + r.scu, 0).toFixed(2)}</td>
                  <td>{profitCalcTotal.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ========== Compare Lasers ========== */}
      {activeTab === "lasers" && primaryLaser && (
        <div className={shared.panel}>
          <h2 className={shared.panelTitle}>
            Size {primaryLaser.size} Laser Ranking — Instability {rockInstability} / Resistance {rockResistance}%
          </h2>
          <p className={ms.helpText}>
            Ranked by composite score for the current rock. Comparing size {primaryLaser.size} lasers (Head 1). Adjust values in Rock Scanner tab.
          </p>
          <div className={shared.tableWrap}>
            <table className={shared.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Laser</th>
                  <th>Can Crack</th>
                  <th>Max Power</th>
                  <th>Eff. Instability</th>
                  <th>Eff. Resistance</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {laserComparisons.map((lc, i) => (
                  <tr
                    key={lc.laser.name}
                    className={lc.laser.name === primaryLaser.name ? ms.highlightRow : undefined}
                  >
                    <td>{i + 1}</td>
                    <td>
                      <strong>{lc.laser.name}</strong>
                      <br />
                      <span className={ms.laserMfr}>
                        S{lc.laser.size} · {lc.laser.moduleSlots} slot{lc.laser.moduleSlots !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td>
                      <span className={`${ms.badge} ${lc.canCrack ? ms.badgeGreen : ms.badgeRed}`}>
                        {lc.canCrack ? "YES" : "NO"}
                      </span>
                    </td>
                    <td>{lc.effectivePower.toLocaleString()}</td>
                    <td>{lc.effectiveInstability}</td>
                    <td>{lc.effectiveResistance}%</td>
                    <td className={i === 0 ? shared.bestValue : undefined}>{lc.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========== Ore Reference ========== */}
      {activeTab === "reference" && (
        <div className={shared.panel}>
          <h2 className={shared.panelTitle}>Ore Reference</h2>
          <div className={shared.tableWrap}>
            <table className={shared.table}>
              <thead>
                <tr>
                  <th>Abbrev</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Value/SCU</th>
                  <th>Instability</th>
                  <th>Resistance</th>
                </tr>
              </thead>
              <tbody>
                {ores
                  .filter((o) => o.valuePerSCU > 0)
                  .sort((a, b) => b.valuePerSCU - a.valuePerSCU)
                  .map((o) => (
                    <tr key={o.name}>
                      <td style={{ fontWeight: 600, letterSpacing: "0.04em" }}>{o.abbrev}</td>
                      <td>{o.name}</td>
                      <td className={shared.tag}>{o.type}</td>
                      <td>{o.valuePerSCU.toLocaleString()}</td>
                      <td>{o.instability}</td>
                      <td>{o.resistance}%</td>
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
