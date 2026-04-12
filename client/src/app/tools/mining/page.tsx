"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { Ore } from "@/data/mining";
import { ores as staticOres, scannerOreOrder, rockClasses } from "@/data/mining";
import { miningLasers as staticLasers } from "@/data/mining-lasers";
import { activeModules as staticActiveModules, passiveModules as staticPassiveModules, miningGadgets as staticGadgets } from "@/data/mining-gadgets";
import { miningShips as staticMiningShips } from "@/data/mining-ships";
import { useWithOverrides } from "@/hooks/useOverrides";
import {
  calculateMiningProfit,
  calculateMiningProfitWithQuality,
  qualityMultiplier,
  assessRockViability,
  analyzeRock,
  compareLasersForRock,
} from "@/domain/mining";
import FleetBuilder from "@/components/mining/FleetBuilder";
import type { Loadout, ResolvedHead } from "@/components/mining/LoadoutBuilder";
import LivePrice from "@/components/prices/LivePrice";
import shared from "../tools.module.css";
import ms from "./mining.module.css";

type Tab = "scanner" | "lasers" | "reference";

interface CompositionEntry {
  ore: Ore;
  percentage: number;
  quality: number;
}

const TABS: { key: Tab; label: string }[] = [
  { key: "scanner", label: "Rock Scanner" },
  { key: "lasers", label: "Compare Lasers" },
  { key: "reference", label: "Ore Reference" },
];

function qualityColor(q: number): string {
  if (q < 250) return ms.qualityRed;
  if (q < 500) return ms.qualityYellow;
  if (q === 500) return "";
  if (q <= 750) return ms.qualityGreen;
  return ms.qualityBlue;
}

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
  const { data: ores } = useWithOverrides("ore", staticOres, (o) => o.name);
  const { data: miningLasers } = useWithOverrides("mining_laser", staticLasers, (l) => l.name);
  const { data: activeModules } = useWithOverrides("mining_module", staticActiveModules, (m) => m.name);
  const { data: passiveModules } = useWithOverrides("mining_module", staticPassiveModules, (m) => m.name);
  const { data: miningShips } = useWithOverrides("mining_ship", staticMiningShips, (s) => s.name);
  const gadgets = staticGadgets;

  const [activeTab, setActiveTab] = useState<Tab>("scanner");
  const [selectedGadget, setSelectedGadget] = useState<string>("none");

  // Fleet state (from FleetBuilder)
  const [fleetLoadouts, setFleetLoadouts] = useState<Loadout[]>([]);
  const [resolvedHeads, setResolvedHeads] = useState<ResolvedHead[]>([]);

  const handleFleetChange = useCallback((loadouts: Loadout[], allResolved: ResolvedHead[]) => {
    setFleetLoadouts(loadouts);
    setResolvedHeads(allResolved);
  }, []);

  const primaryLoadout = fleetLoadouts[0] ?? null;
  const ship = miningShips.find((s) => s.name === primaryLoadout?.shipName) ?? miningShips[0];

  // Scanner properties — persisted to localStorage
  const STORAGE_KEY = "magpie_rock_scan";

  // Default values (used for SSR and initial render)
  const [rockClass, setRockClass] = useState<string>("");
  const effectiveRockClass = rockClass || rockClasses[0] || "";
  const [rockMass, setRockMass] = useState(53819);
  const [rockInstability, setRockInstability] = useState(413.82);
  const [rockResistance, setRockResistance] = useState(60);
  const [rockSCU, setRockSCU] = useState(143.30);

  const defaultComposition: CompositionEntry[] = [
    { ore: ores.find((o) => o.abbrev === "QUAN") ?? ores[0], percentage: 50, quality: 500 },
    { ore: ores.find((o) => o.name === "Inert Material") ?? ores[ores.length - 1], percentage: 50, quality: 0 },
  ];

  const [compositionRows, setCompositionRows] = useState<CompositionEntry[]>(defaultComposition);
  const [minValuePerSCU, setMinValuePerSCU] = useState(5000);

  // Restore from localStorage after mount (avoids hydration mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.rockClass) setRockClass(saved.rockClass);
      if (saved.rockMass != null) setRockMass(saved.rockMass);
      if (saved.rockInstability != null) setRockInstability(saved.rockInstability);
      if (saved.rockResistance != null) setRockResistance(saved.rockResistance);
      if (saved.rockSCU != null) setRockSCU(saved.rockSCU);
      if (saved.minValuePerSCU != null) setMinValuePerSCU(saved.minValuePerSCU);
      if (saved.composition && Array.isArray(saved.composition)) {
        setCompositionRows(
          saved.composition.map((row: { oreName: string; percentage: number; quality: number }) => {
            const ore = ores.find((o) => o.name === row.oreName) ?? ores[0];
            return { ore, percentage: row.percentage, quality: row.quality };
          })
        );
      }
    } catch { /* corrupted data — use defaults */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist scan to localStorage on change
  useEffect(() => {
    const data = {
      rockClass,
      rockMass,
      rockInstability,
      rockResistance,
      rockSCU,
      minValuePerSCU,
      composition: compositionRows.map((r) => ({
        oreName: r.ore.name,
        percentage: r.percentage,
        quality: r.quality,
      })),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [rockClass, rockMass, rockInstability, rockResistance, rockSCU, minValuePerSCU, compositionRows]);

  const composition = compositionRows;
  const totalPercentage = composition.reduce((sum, c) => sum + c.percentage, 0);

  const addCompositionRow = () => {
    const defaultOre = ores.find((o) => o.abbrev === "QUAN") ?? ores[0];
    setCompositionRows([...compositionRows, { ore: defaultOre, percentage: 10, quality: 500 }]);
  };
  const removeCompositionRow = (i: number) => {
    setCompositionRows(compositionRows.filter((_, idx) => idx !== i));
  };
  const updateRowOre = (i: number, name: string) => {
    const ore = ores.find((o) => o.name === name)!;
    const updated = [...compositionRows];
    updated[i] = { ...updated[i], ore };
    setCompositionRows(updated);
  };
  const updateRowPct = (i: number, pct: number) => {
    const updated = [...compositionRows];
    updated[i] = { ...updated[i], percentage: pct };
    setCompositionRows(updated);
  };
  const updateRowQuality = (i: number, quality: number) => {
    const updated = [...compositionRows];
    updated[i] = { ...updated[i], quality };
    setCompositionRows(updated);
  };

  // --- Multi-head viability ---
  const activeGadget = gadgets.find((g) => g.name === selectedGadget) ?? null;

  const perHeadViability = useMemo(() => {
    return resolvedHeads.map((head) =>
      assessRockViability(rockMass, rockInstability, rockResistance, head.laser, head.activeModules, head.passiveModules, activeGadget)
    );
  }, [rockMass, rockInstability, rockResistance, resolvedHeads, activeGadget]);

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
      primaryPassiveModules,
      activeGadget
    ) : [],
    [rockMass, rockInstability, rockResistance, primaryLaser, miningLasers, primaryActiveModules, primaryPassiveModules, activeGadget]
  );

  const profitResults = useMemo(
    () => calculateMiningProfitWithQuality(composition, rockSCU),
    [composition, rockSCU]
  );

  const totalValue = profitResults.reduce((sum, r) => sum + r.value, 0);

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

              <span className={ms.propLabel}>Gadget</span>
              <select
                value={selectedGadget}
                onChange={(e) => setSelectedGadget(e.target.value)}
                className={ms.propSelect}
                aria-label="Mining gadget"
              >
                <option value="none">None</option>
                {gadgets.map((g) => (
                  <option key={g.name} value={g.name}>
                    {g.name}
                    {g.laserInstability !== 0 ? ` (Instab: ${g.laserInstability > 0 ? "+" : ""}${g.laserInstability}%)` : ""}
                    {g.resistance !== 0 ? ` (Resist: ${g.resistance > 0 ? "+" : ""}${g.resistance}%)` : ""}
                  </option>
                ))}
              </select>
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

            <div className={ms.compRows}>
              <div className={ms.compRowHeader}>
                <span className={ms.compRowOreHeader}>Ore</span>
                <span className={ms.compRowPctHeader}>%</span>
                <span className={ms.compRowQualHeader}>Quality (RAW)</span>
                <span className={ms.compRowActHeader} />
              </div>
              {compositionRows.map((entry, i) => (
                <div key={i} className={ms.compRow}>
                  <select
                    value={entry.ore.name}
                    onChange={(e) => updateRowOre(i, e.target.value)}
                    className={ms.compRowOre}
                    aria-label={`Select ore ${i + 1}`}
                  >
                    {ores.map((o) => (
                      <option key={o.name} value={o.name}>{o.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={entry.percentage}
                    onChange={(e) => updateRowPct(i, Number(e.target.value))}
                    min={0}
                    max={100}
                    step={0.01}
                    className={ms.compRowPct}
                    aria-label={`Percentage for row ${i + 1}`}
                  />
                  <input
                    type="number"
                    value={entry.quality}
                    onChange={(e) => updateRowQuality(i, Number(e.target.value))}
                    min={0}
                    max={1000}
                    step={1}
                    className={`${ms.compRowQual} ${qualityColor(entry.quality)}`}
                    aria-label={`Quality for row ${i + 1}`}
                  />
                  <button
                    onClick={() => removeCompositionRow(i)}
                    className={ms.compRowRemove}
                    aria-label={`Remove row ${i + 1}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
              <div className={ms.compRowFooter}>
                <button onClick={addCompositionRow} className={ms.compAddBtn}>
                  + Add Ore
                </button>
                <span className={totalPercentage > 100 ? ms.compTotalOver : ms.compTotal}>
                  Total: {totalPercentage.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Cluster Stats */}
          <div className={ms.scannerPanel}>
            <div className={ms.scannerSectionLabel}>Cluster Stats</div>
            <table className={ms.clusterTable}>
              <thead>
                <tr>
                  <th />
                  <th>Quality</th>
                  <th>SCU</th>
                  <th>Live Price</th>
                </tr>
              </thead>
              <tbody>
                {profitResults
                  .filter((r) => r.scu > 0 && r.ore !== "Inert Material")
                  .map((r, i) => (
                    <tr key={i}>
                      <td className={ms.clusterOreName}>{r.ore}</td>
                      <td className={qualityColor(r.quality)}>{r.quality}</td>
                      <td>{r.scu.toFixed(1)}</td>
                      <td><LivePrice commodityName={r.ore} /></td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr className={ms.clusterTotal}>
                  <td>Total</td>
                  <td />
                  <td>

                    {profitResults
                      .filter((r) => r.ore !== "Inert Material")
                      .reduce((s, r) => s + r.scu, 0)
                      .toFixed(1)}
                  </td>
                  <td />
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
