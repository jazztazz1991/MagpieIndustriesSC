"use client";

import { useMemo } from "react";
import type { MiningLaser } from "@/data/mining-lasers";
import type { MiningModule } from "@/data/mining-gadgets";
import type { MiningShip } from "@/data/mining-ships";
import styles from "./LoadoutBuilder.module.css";

// --- Types ---

export interface HeadConfig {
  laserName: string;
  modules: string[]; // length = laser.moduleSlots
}

export interface Loadout {
  id: string;
  name: string;
  shipName: string;
  heads: HeadConfig[];
}

export interface ResolvedHead {
  laser: MiningLaser;
  activeModules: MiningModule[];
  passiveModules: MiningModule[];
}

interface LoadoutBuilderProps {
  ships: MiningShip[];
  lasers: MiningLaser[];
  activeModules: MiningModule[];
  passiveModules: MiningModule[];
  loadout: Loadout;
  onChange: (loadout: Loadout) => void;
}

// --- Helpers ---

export function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function createDefaultLoadout(ship: MiningShip, lasers: MiningLaser[]): Loadout {
  const defaultLaser = lasers.find((l) => l.size === 1) ?? lasers[0];
  const heads: HeadConfig[] = Array.from({ length: ship.miningTurrets }, () => ({
    laserName: defaultLaser?.name ?? "",
    modules: Array.from({ length: defaultLaser?.moduleSlots ?? 0 }, () => ""),
  }));
  return {
    id: makeId(),
    name: `${ship.name} Loadout`,
    shipName: ship.name,
    heads,
  };
}

export function resolveHeads(
  loadout: Loadout,
  lasers: MiningLaser[],
  activeModules: MiningModule[],
  passiveModules: MiningModule[]
): ResolvedHead[] {
  const allModules = [...activeModules, ...passiveModules];
  return loadout.heads
    .map((head) => {
      const laser = lasers.find((l) => l.name === head.laserName);
      if (!laser) return null;
      const mods = head.modules
        .map((name) => allModules.find((m) => m.name === name))
        .filter((m): m is MiningModule => m !== undefined);
      return {
        laser,
        activeModules: mods.filter((m) => m.type === "active"),
        passiveModules: mods.filter((m) => m.type === "passive"),
      };
    })
    .filter((r): r is ResolvedHead => r !== null);
}

// --- Component ---

export default function LoadoutBuilder({
  ships,
  lasers,
  activeModules,
  passiveModules,
  loadout,
  onChange,
}: LoadoutBuilderProps) {
  // --- Mutation helpers ---

  function updateLoadout(patch: Partial<Loadout>) {
    onChange({ ...loadout, ...patch });
  }

  function updateHead(headIndex: number, patch: Partial<HeadConfig>) {
    const heads = [...loadout.heads];
    heads[headIndex] = { ...heads[headIndex], ...patch };
    onChange({ ...loadout, heads });
  }

  function setHeadLaser(headIndex: number, laserName: string) {
    const laser = lasers.find((l) => l.name === laserName);
    if (!laser) return;
    const currentHead = loadout.heads[headIndex];
    const newModules = Array.from({ length: laser.moduleSlots }, (_, i) =>
      i < currentHead.modules.length ? currentHead.modules[i] : ""
    );
    updateHead(headIndex, { laserName, modules: newModules });
  }

  function setHeadModule(headIndex: number, slotIndex: number, moduleName: string) {
    const head = loadout.heads[headIndex];
    const modules = [...head.modules];
    modules[slotIndex] = moduleName;
    updateHead(headIndex, { modules });
  }

  function changeShip(shipName: string) {
    const newShip = ships.find((s) => s.name === shipName);
    if (!newShip) return;
    const currentHeads = loadout.heads;
    const heads: HeadConfig[] = Array.from({ length: newShip.miningTurrets }, (_, i) => {
      if (i < currentHeads.length) return currentHeads[i];
      const defaultLaser = lasers.find((l) => l.size === 1) ?? lasers[0];
      return {
        laserName: defaultLaser?.name ?? "",
        modules: Array.from({ length: defaultLaser?.moduleSlots ?? 0 }, () => ""),
      };
    });
    updateLoadout({ shipName, heads });
  }

  // --- Laser options grouped by size ---
  const lasersBySize = useMemo(() =>
    [0, 1, 2].map((size) => ({
      size,
      lasers: lasers.filter((l) => l.size === size),
    })),
    [lasers]
  );

  return (
    <div>
      {/* Ship selector */}
      <div className={styles.shipRow}>
        <label className={styles.fieldLabel}>Ship</label>
        <select
          className={styles.select}
          value={loadout.shipName}
          onChange={(e) => changeShip(e.target.value)}
        >
          {ships.filter((s) => !s.isVehicle).map((s) => (
            <option key={s.name} value={s.name}>
              {s.name} - {s.cargoSCU} SCU, {s.miningTurrets} head{s.miningTurrets !== 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Heads */}
      <div className={styles.headsGrid}>
        {loadout.heads.map((head, headIdx) => {
          const headLaser = lasers.find((l) => l.name === head.laserName);
          return (
            <div key={headIdx} className={styles.headCard}>
              <div className={styles.headTitle}>
                Head {headIdx + 1}
                {headLaser && (
                  <span className={styles.headStats}>
                    {headLaser.maxPower.toLocaleString()} pwr / {headLaser.moduleSlots} slot{headLaser.moduleSlots !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Laser dropdown */}
              <label className={styles.fieldLabel}>Mining Laser</label>
              <select
                className={styles.select}
                value={head.laserName}
                onChange={(e) => setHeadLaser(headIdx, e.target.value)}
              >
                {lasersBySize.map((group) => (
                  <optgroup key={group.size} label={`Size ${group.size}`}>
                    {group.lasers.map((l) => (
                      <option key={l.name} value={l.name}>
                        {l.name} - {l.maxPower} pwr, {l.moduleSlots} slots
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              {/* Module slots */}
              {head.modules.length > 0 && (
                <div className={styles.moduleSlots}>
                  <label className={styles.fieldLabel}>Modules</label>
                  {head.modules.map((modName, slotIdx) => (
                    <select
                      key={slotIdx}
                      className={styles.moduleSelect}
                      value={modName}
                      onChange={(e) => setHeadModule(headIdx, slotIdx, e.target.value)}
                    >
                      <option value="">Slot {slotIdx + 1} - Empty</option>
                      <optgroup label="Active">
                        {activeModules.map((m) => (
                          <option key={m.name} value={m.name}>{m.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Passive">
                        {passiveModules.map((m) => (
                          <option key={m.name} value={m.name}>{m.name}</option>
                        ))}
                      </optgroup>
                    </select>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
