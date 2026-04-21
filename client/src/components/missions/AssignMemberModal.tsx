"use client";

import { useEffect, useMemo, useState } from "react";
import type { ShipSeat } from "@/domain/shipSeats";
import styles from "./AssignMemberModal.module.css";

export interface AssignableMember {
  userId: string;
  username: string;
  avatarUrl?: string | null;
  alreadyAssigned?: boolean;
}

interface Props {
  seat: ShipSeat;
  members: AssignableMember[];
  currentAssigneeUserId?: string | null;
  onAssign: (userId: string) => Promise<void>;
  onUnassign: () => Promise<void>;
  onClose: () => void;
}

export function AssignMemberModal({ seat, members, currentAssigneeUserId, onAssign, onUnassign, onClose }: Props) {
  const [filter, setFilter] = useState("");
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return members.filter((m) => !q || m.username.toLowerCase().includes(q));
  }, [members, filter]);

  const handleAssign = async (userId: string) => {
    setBusyUserId(userId);
    setErr(null);
    try {
      await onAssign(userId);
    } catch (e) {
      setErr((e as Error).message || "Failed to assign");
    } finally {
      setBusyUserId(null);
    }
  };

  const handleUnassign = async () => {
    setBusyUserId("__unassign");
    setErr(null);
    try {
      await onUnassign();
    } catch (e) {
      setErr((e as Error).message || "Failed to unassign");
    } finally {
      setBusyUserId(null);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-label={`Assign member to ${seat.label}`}>
        <div className={styles.header}>
          <h3 className={styles.title}>Assign to {seat.label}</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>
        </div>

        <input
          type="text"
          placeholder="Filter members..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.filter}
          autoFocus
        />

        {currentAssigneeUserId && (
          <button
            className={styles.unassignBtn}
            onClick={handleUnassign}
            disabled={busyUserId !== null}
          >
            {busyUserId === "__unassign" ? "Removing..." : "Unassign current member"}
          </button>
        )}

        <div className={styles.memberList}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>No members match.</div>
          ) : (
            filtered.map((m) => {
              const isCurrent = m.userId === currentAssigneeUserId;
              return (
                <button
                  key={m.userId}
                  className={`${styles.memberRow} ${isCurrent ? styles.memberCurrent : ""}`}
                  onClick={() => !isCurrent && handleAssign(m.userId)}
                  disabled={isCurrent || busyUserId !== null}
                >
                  <div className={styles.memberAvatar}>
                    {m.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                    ) : (
                      m.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className={styles.memberName}>{m.username}</span>
                  {isCurrent && <span className={styles.currentTag}>Current</span>}
                  {m.alreadyAssigned && !isCurrent && <span className={styles.otherTag}>On another ship</span>}
                </button>
              );
            })
          )}
        </div>

        {err && <div className={styles.error}>{err}</div>}
      </div>
    </div>
  );
}
