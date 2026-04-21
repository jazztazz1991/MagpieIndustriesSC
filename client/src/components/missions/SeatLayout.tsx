"use client";

import { groupSeatsByRole, roleLabel, type ShipLayout, type ShipSeat } from "@/domain/shipSeats";
import styles from "./SeatLayout.module.css";

export interface SeatAssignment {
  seatId: string;
  username: string;
}

interface SeatLayoutProps {
  shipName: string;
  layout: ShipLayout | null;
  assignments: SeatAssignment[];
  onSeatClick?: (seat: ShipSeat) => void;
  nickname?: string;
}

export function SeatLayout({ shipName, layout, assignments, onSeatClick, nickname }: SeatLayoutProps) {
  const assignmentByseat = new Map(assignments.map((a) => [a.seatId, a.username]));

  if (!layout) {
    return (
      <div className={styles.layout}>
        <div className={styles.shipHeader}>
          <h3 className={styles.shipName}>{nickname || shipName}</h3>
          <span className={styles.fallback}>{shipName}</span>
        </div>
        <p className={styles.fallbackNote}>No seat layout data for this ship yet.</p>
      </div>
    );
  }

  const groups = groupSeatsByRole(layout.seats);

  return (
    <div className={styles.layout}>
      <div className={styles.shipHeader}>
        <h3 className={styles.shipName}>{nickname || shipName}</h3>
        {nickname && <span className={styles.fallback}>{shipName}</span>}
      </div>

      {groups.map((group) => (
        <div key={group.role} className={styles.roleGroup}>
          <div className={styles.roleLabel}>{roleLabel(group.role)}</div>
          <div className={styles.seatGrid}>
            {group.seats.map((seat) => {
              const username = assignmentByseat.get(seat.id);
              return (
                <button
                  key={seat.id}
                  type="button"
                  className={`${styles.seat} ${username ? styles.assigned : ""}`}
                  onClick={() => onSeatClick?.(seat)}
                  disabled={!onSeatClick}
                  aria-label={`${seat.label}${username ? ` (assigned to ${username})` : " (unassigned)"}`}
                >
                  <span className={`${styles.roleBar} ${styles[`role-${seat.role}`]}`} aria-hidden="true" />
                  <div className={styles.seatInfo}>
                    <div className={styles.seatLabel}>{seat.label}</div>
                    {username ? (
                      <div className={styles.assignedUser}>{username}</div>
                    ) : (
                      <div className={styles.unassigned}>Unassigned</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
