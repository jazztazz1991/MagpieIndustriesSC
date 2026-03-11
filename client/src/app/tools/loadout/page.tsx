"use client";

import { useState, useMemo } from "react";
import { components, shipLoadouts } from "@/data/loadout";
import type { ShipComponent, ComponentType, ComponentSize } from "@/data/loadout";
import { calculateLoadoutSummary } from "@/domain/loadout";
import tools from "../tools.module.css";
import styles from "./loadout.module.css";

const TYPE_LABELS: Record<ComponentType, string> = {
  weapon: "Weapon",
  shield: "Shield",
  quantum_drive: "Quantum Drive",
  power_plant: "Power Plant",
  cooler: "Cooler",
};

function getCompatibleComponents(type: ComponentType, size: ComponentSize): ShipComponent[] {
  return components.filter((c) => c.type === type && c.size === size);
}

interface SlotAssignment {
  slotType: ComponentType;
  slotSize: ComponentSize;
  slotIndex: number;
  selectedComponentName: string;
}

export default function LoadoutPage() {
  const [selectedShip, setSelectedShip] = useState("");
  const [assignments, setAssignments] = useState<SlotAssignment[]>([]);

  const shipConfig = shipLoadouts.find((s) => s.shipName === selectedShip);

  function handleShipChange(shipName: string) {
    setSelectedShip(shipName);
    if (!shipName) {
      setAssignments([]);
      return;
    }
    const config = shipLoadouts.find((s) => s.shipName === shipName);
    if (!config) {
      setAssignments([]);
      return;
    }
    const newAssignments: SlotAssignment[] = [];
    for (const slot of config.slots) {
      for (let i = 0; i < slot.count; i++) {
        newAssignments.push({
          slotType: slot.type,
          slotSize: slot.size,
          slotIndex: i + 1,
          selectedComponentName: "",
        });
      }
    }
    setAssignments(newAssignments);
  }

  function handleComponentChange(index: number, componentName: string) {
    setAssignments((prev) =>
      prev.map((a, i) => (i === index ? { ...a, selectedComponentName: componentName } : a))
    );
  }

  const selectedComponents = useMemo(() => {
    const result: ShipComponent[] = [];
    for (const assignment of assignments) {
      if (assignment.selectedComponentName) {
        const comp = components.find(
          (c) =>
            c.name === assignment.selectedComponentName &&
            c.type === assignment.slotType &&
            c.size === assignment.slotSize
        );
        if (comp) result.push(comp);
      }
    }
    return result;
  }, [assignments]);

  const summary = useMemo(() => calculateLoadoutSummary(selectedComponents), [selectedComponents]);

  return (
    <main className={tools.page}>
      <h1 className={tools.title}>Loadout Planner</h1>
      <p className={tools.subtitle}>
        Plan ship component loadouts and compare weapons, shields, and quantum drives.
      </p>

      <div className={styles.shipSelector}>
        <div className={tools.field}>
          <label>Select Ship</label>
          <select
            className={tools.select}
            value={selectedShip}
            onChange={(e) => handleShipChange(e.target.value)}
          >
            <option value="">-- Choose a ship --</option>
            {shipLoadouts.map((s) => (
              <option key={s.shipName} value={s.shipName}>
                {s.shipName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {shipConfig && (
        <div className={styles.layoutColumns}>
          <div className={tools.panel}>
            <h2 className={tools.panelTitle}>Component Slots</h2>
            <div className={styles.slotsGrid}>
              {assignments.map((assignment, index) => {
                const compatible = getCompatibleComponents(assignment.slotType, assignment.slotSize);
                const selectedComp = components.find(
                  (c) =>
                    c.name === assignment.selectedComponentName &&
                    c.type === assignment.slotType &&
                    c.size === assignment.slotSize
                );
                return (
                  <div key={`${assignment.slotType}-${assignment.slotSize}-${assignment.slotIndex}`} className={styles.slotRow}>
                    <span className={styles.slotLabel}>
                      {TYPE_LABELS[assignment.slotType]} {assignment.slotSize}
                    </span>
                    <span className={styles.slotIndex}>#{assignment.slotIndex}</span>
                    <div className={styles.slotSelect}>
                      <select
                        className={tools.select}
                        value={assignment.selectedComponentName}
                        onChange={(e) => handleComponentChange(index, e.target.value)}
                        style={{ width: "100%" }}
                      >
                        <option value="">-- Empty --</option>
                        {compatible.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name} (Grade {c.grade} - {c.manufacturer})
                          </option>
                        ))}
                      </select>
                      {selectedComp && (
                        <div className={styles.componentInfo}>{selectedComp.description}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={tools.panel}>
            <h2 className={tools.panelTitle}>Loadout Summary</h2>
            <div className={styles.summaryGrid}>
              <div className={`${styles.summaryItem} ${styles.summaryHighlight}`}>
                <span className={styles.summaryLabel}>Total DPS</span>
                <span className={styles.summaryValue}>{summary.totalDPS.toLocaleString()}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Shield HP</span>
                <span className={styles.summaryValue}>{summary.shieldHP.toLocaleString()}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Power Draw</span>
                <span className={styles.summaryValue}>{summary.powerDraw.toFixed(1)}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Quantum Speed</span>
                <span className={styles.summaryValue}>{summary.quantumSpeed} Mm/s</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Quantum Range</span>
                <span className={styles.summaryValue}>{summary.quantumRange} Mkm</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!shipConfig && (
        <div className={tools.emptyMessage}>
          Select a ship above to begin planning your loadout.
        </div>
      )}
    </main>
  );
}
