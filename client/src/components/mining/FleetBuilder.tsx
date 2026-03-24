"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { MiningLaser } from "@/data/mining-lasers";
import type { MiningModule } from "@/data/mining-gadgets";
import type { MiningShip } from "@/data/mining-ships";
import LoadoutBuilder, {
  createDefaultLoadout,
  resolveHeads,
  makeId,
} from "./LoadoutBuilder";
import type { Loadout, ResolvedHead } from "./LoadoutBuilder";
import styles from "./FleetBuilder.module.css";
import lbStyles from "./LoadoutBuilder.module.css";

// --- LocalStorage helpers ---

const STORAGE_KEY = "magpie_mining_loadouts";

function loadSavedLoadouts(): Loadout[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistSavedLoadouts(loadouts: Loadout[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(loadouts));
}

// --- Fleet entry ---

interface FleetEntry {
  key: string; // stable React key
  loadout: Loadout;
  collapsed: boolean;
}

// --- Props ---

interface FleetBuilderProps {
  ships: MiningShip[];
  lasers: MiningLaser[];
  activeModules: MiningModule[];
  passiveModules: MiningModule[];
  onFleetChange: (loadouts: Loadout[], allResolved: ResolvedHead[]) => void;
}

// --- Component ---

export default function FleetBuilder({
  ships,
  lasers,
  activeModules,
  passiveModules,
  onFleetChange,
}: FleetBuilderProps) {
  const [savedLoadouts, setSavedLoadouts] = useState<Loadout[]>([]);
  const [fleet, setFleet] = useState<FleetEntry[]>([]);
  const [renaming, setRenaming] = useState<string | null>(null); // key of entry being renamed
  const [renameDraft, setRenameDraft] = useState("");

  // Initialize: load saved loadouts + set up ship #1
  useEffect(() => {
    if (ships.length === 0 || lasers.length === 0) return;
    const saved = loadSavedLoadouts();
    setSavedLoadouts(saved);

    const defaultShip = ships.find((s) => !s.isVehicle) ?? ships[0];
    const primaryLoadout = saved.length > 0
      ? saved[0]
      : createDefaultLoadout(defaultShip, lasers);

    setFleet([{ key: makeId(), loadout: primaryLoadout, collapsed: false }]);
  }, [ships, lasers]);

  // Resolve all fleet heads whenever fleet changes
  const allResolved = useMemo(() => {
    return fleet.flatMap((entry) =>
      resolveHeads(entry.loadout, lasers, activeModules, passiveModules)
    );
  }, [fleet, lasers, activeModules, passiveModules]);

  const allLoadouts = useMemo(() => fleet.map((e) => e.loadout), [fleet]);

  // Notify parent
  const onFleetChangeRef = useRef(onFleetChange);
  onFleetChangeRef.current = onFleetChange;

  useEffect(() => {
    if (fleet.length === 0) return;
    onFleetChangeRef.current(allLoadouts, allResolved);
  }, [allLoadouts, allResolved, fleet.length]);

  // --- Fleet mutations ---

  function updateEntry(key: string, loadout: Loadout) {
    setFleet((prev) =>
      prev.map((e) => (e.key === key ? { ...e, loadout } : e))
    );
  }

  function toggleCollapse(key: string) {
    setFleet((prev) =>
      prev.map((e) => (e.key === key ? { ...e, collapsed: !e.collapsed } : e))
    );
  }

  function addShip() {
    const defaultShip = ships.find((s) => !s.isVehicle) ?? ships[0];
    const newLoadout = createDefaultLoadout(defaultShip, lasers);
    setFleet((prev) => [...prev, { key: makeId(), loadout: newLoadout, collapsed: false }]);
  }

  function removeShip(key: string) {
    setFleet((prev) => prev.filter((e) => e.key !== key));
  }

  // --- Save/Load ---

  function saveLoadout(loadout: Loadout) {
    const existing = savedLoadouts.findIndex((l) => l.id === loadout.id);
    let updated: Loadout[];
    if (existing >= 0) {
      updated = [...savedLoadouts];
      updated[existing] = loadout;
    } else {
      updated = [...savedLoadouts, loadout];
    }
    setSavedLoadouts(updated);
    persistSavedLoadouts(updated);
  }

  function deleteLoadout(id: string) {
    const updated = savedLoadouts.filter((l) => l.id !== id);
    setSavedLoadouts(updated);
    persistSavedLoadouts(updated);
  }

  function loadSaved(key: string, savedId: string) {
    if (savedId === "__new__") {
      const defaultShip = ships.find((s) => !s.isVehicle) ?? ships[0];
      const newLoadout = createDefaultLoadout(defaultShip, lasers);
      updateEntry(key, newLoadout);
      return;
    }
    const found = savedLoadouts.find((l) => l.id === savedId);
    if (found) updateEntry(key, found);
  }

  // --- Rename ---

  function startRename(key: string, currentName: string) {
    setRenameDraft(currentName);
    setRenaming(key);
  }

  function finishRename(key: string) {
    if (renameDraft.trim()) {
      const entry = fleet.find((e) => e.key === key);
      if (entry) updateEntry(key, { ...entry.loadout, name: renameDraft.trim() });
    }
    setRenaming(null);
  }

  if (fleet.length === 0) return null;

  // Total cargo across fleet
  const totalCargo = fleet.reduce((sum, entry) => {
    const s = ships.find((sh) => sh.name === entry.loadout.shipName);
    return sum + (s?.cargoSCU ?? 0);
  }, 0);

  const totalHeads = fleet.reduce((sum, entry) => sum + entry.loadout.heads.length, 0);

  return (
    <div className={styles.fleetPanel}>
      {/* Fleet header */}
      <div className={styles.fleetHeader}>
        <div className={styles.fleetHeaderLeft}>
          <h2 className={styles.fleetTitle}>Fleet Loadout</h2>
          <span className={styles.fleetSummary}>
            {fleet.length} ship{fleet.length !== 1 ? "s" : ""} · {totalHeads} head{totalHeads !== 1 ? "s" : ""} · {totalCargo} SCU
          </span>
        </div>
        <button className={styles.addShipBtn} onClick={addShip}>+ Add Ship</button>
      </div>

      {/* Fleet ships */}
      <div className={styles.fleetList}>
        {fleet.map((entry, idx) => {
          const ship = ships.find((s) => s.name === entry.loadout.shipName) ?? ships[0];
          const headCount = entry.loadout.heads.length;
          const isSaved = savedLoadouts.some((l) => l.id === entry.loadout.id);

          return (
            <div key={entry.key} className={styles.shipEntry}>
              {/* Per-ship header */}
              <div className={lbStyles.header} onClick={() => toggleCollapse(entry.key)}>
                <div className={lbStyles.headerLeft}>
                  <span className={lbStyles.collapseIcon}>{entry.collapsed ? "+" : "-"}</span>
                  <span className={styles.shipLabel}>Ship {idx + 1}</span>
                  {entry.collapsed && (
                    <span className={lbStyles.collapsedSummary}>
                      {ship.name} — {entry.loadout.name} — {headCount} head{headCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className={lbStyles.headerRight} onClick={(e) => e.stopPropagation()}>
                  {savedLoadouts.length > 0 && (
                    <select
                      className={lbStyles.loadoutSelect}
                      value={isSaved ? entry.loadout.id : ""}
                      onChange={(e) => loadSaved(entry.key, e.target.value)}
                    >
                      <option value="" disabled>Load saved...</option>
                      {savedLoadouts.map((l) => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                      <option value="__new__">+ New Loadout</option>
                    </select>
                  )}
                  <button className={lbStyles.saveBtn} onClick={() => saveLoadout(entry.loadout)}>
                    Save
                  </button>
                  {isSaved && (
                    <button
                      className={lbStyles.deleteBtn}
                      onClick={() => deleteLoadout(entry.loadout.id)}
                    >
                      Del
                    </button>
                  )}
                  {fleet.length > 1 && (
                    <button
                      className={styles.removeShipBtn}
                      onClick={() => removeShip(entry.key)}
                      aria-label={`Remove ship ${idx + 1}`}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Per-ship body */}
              {!entry.collapsed && (
                <div className={lbStyles.body}>
                  {/* Loadout name */}
                  <div className={lbStyles.nameRow}>
                    {renaming === entry.key ? (
                      <div className={lbStyles.renameWrap}>
                        <input
                          className={lbStyles.renameInput}
                          value={renameDraft}
                          onChange={(e) => setRenameDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") finishRename(entry.key);
                            if (e.key === "Escape") setRenaming(null);
                          }}
                          autoFocus
                        />
                        <button className={lbStyles.renameDone} onClick={() => finishRename(entry.key)}>
                          OK
                        </button>
                      </div>
                    ) : (
                      <span
                        className={lbStyles.loadoutName}
                        onClick={() => startRename(entry.key, entry.loadout.name)}
                      >
                        {entry.loadout.name}{" "}
                        <span className={lbStyles.editHint}>(click to rename)</span>
                      </span>
                    )}
                  </div>

                  <LoadoutBuilder
                    ships={ships}
                    lasers={lasers}
                    activeModules={activeModules}
                    passiveModules={passiveModules}
                    loadout={entry.loadout}
                    onChange={(updated) => updateEntry(entry.key, updated)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
