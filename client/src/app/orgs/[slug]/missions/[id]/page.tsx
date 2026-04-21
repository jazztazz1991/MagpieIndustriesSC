"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import useSWR from "swr";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { SeatLayout } from "@/components/missions/SeatLayout";
import { AssignMemberModal, type AssignableMember } from "@/components/missions/AssignMemberModal";
import { getShipLayout } from "@/data/ship-seats";
import {
  crewToSeatAssignments,
  missionStatusColor,
  missionStatusLabel,
  type MissionDetail,
  type MissionShip,
  type MissionStatus,
} from "@/domain/missions";
import type { ShipSeat } from "@/domain/shipSeats";
import styles from "./mission-detail.module.css";

interface FleetShip {
  id: string;
  shipName: string;
  nickname: string | null;
  status: string;
}

interface OrgMember {
  id: string;
  username: string;
  avatarUrl: string | null;
  userId: string;
}

interface Org {
  id: string;
  slug: string;
  members: OrgMember[];
}

const fetcher = async <T,>(url: string): Promise<T> => {
  const res = await apiFetch<T>(url);
  if (!res.success || res.data === undefined) throw new Error(res.error || "Fetch failed");
  return res.data;
};

export default function MissionDetailPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id: missionId } = React.use(params);
  const { user, loading: authLoading } = useAuth();

  const { data: org } = useSWR<Org>(user ? `/api/orgs/${slug}` : null, fetcher);
  const { data: fleet } = useSWR<FleetShip[]>(
    org ? `/api/orgs/${org.id}/fleet` : null,
    fetcher
  );

  const { data: mission, mutate: refreshMission, isLoading: missionLoading } = useSWR<MissionDetail>(
    org ? `/api/orgs/${org.id}/operations/${missionId}` : null,
    fetcher,
    { refreshInterval: 3000, revalidateOnFocus: true }
  );

  const [selectedSeat, setSelectedSeat] = useState<{ shipId: string; shipName: string; seat: ShipSeat } | null>(null);
  const [addingShipId, setAddingShipId] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);

  const handleAddShip = async () => {
    if (!org || !addingShipId) return;
    await apiFetch(`/api/orgs/${org.id}/operations/${missionId}/ships`, {
      method: "POST",
      body: JSON.stringify({ fleetShipId: addingShipId }),
    });
    setAddingShipId("");
    refreshMission();
  };

  const handleRemoveShip = async (opShipId: string) => {
    if (!org || !confirm("Remove this ship from the mission?")) return;
    await apiFetch(`/api/orgs/${org.id}/operations/${missionId}/ships/${opShipId}`, { method: "DELETE" });
    refreshMission();
  };

  const handleAssign = async (opShipId: string, seatId: string, userId: string, seatLabel: string) => {
    if (!org) return;
    // Check if this user is already assigned on this ship — if so, we need to delete first
    const ship = mission?.ships.find((s) => s.id === opShipId);
    const existingOnSameShip = ship?.crew.find((c) => c.userId === userId);
    if (existingOnSameShip) {
      await apiFetch(`/api/orgs/${org.id}/operations/${missionId}/crew/${existingOnSameShip.id}`, { method: "DELETE" });
    }
    // Also check if someone else is in this seat — if so, delete them first
    const existingInSeat = ship?.crew.find((c) => c.seatId === seatId);
    if (existingInSeat && existingInSeat.userId !== userId) {
      await apiFetch(`/api/orgs/${org.id}/operations/${missionId}/crew/${existingInSeat.id}`, { method: "DELETE" });
    }
    const res = await apiFetch(`/api/orgs/${org.id}/operations/${missionId}/ships/${opShipId}/crew`, {
      method: "POST",
      body: JSON.stringify({ userId, position: seatLabel, seatId }),
    });
    if (!res.success) throw new Error(res.error || "Failed to assign");
    refreshMission();
  };

  const handleUnassign = async (opShipId: string, seatId: string) => {
    if (!org) return;
    const ship = mission?.ships.find((s) => s.id === opShipId);
    const existing = ship?.crew.find((c) => c.seatId === seatId);
    if (!existing) return;
    const res = await apiFetch(`/api/orgs/${org.id}/operations/${missionId}/crew/${existing.id}`, { method: "DELETE" });
    if (!res.success) throw new Error(res.error || "Failed to unassign");
    refreshMission();
  };

  const handleStatusChange = async (newStatus: MissionStatus) => {
    if (!org) return;
    setStatusUpdating(true);
    await apiFetch(`/api/orgs/${org.id}/operations/${missionId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });
    setStatusUpdating(false);
    refreshMission();
  };

  // Membership list for the modal — all members except those on OTHER ships in THIS mission already
  const membersForModal = useMemo<AssignableMember[]>(() => {
    if (!org || !mission || !selectedSeat) return [];
    const crewOnOtherShips = new Set<string>();
    for (const ship of mission.ships) {
      if (ship.id === selectedSeat.shipId) continue;
      for (const c of ship.crew) crewOnOtherShips.add(c.userId);
    }
    return org.members.map((m) => ({
      userId: m.userId ?? m.id,
      username: m.username,
      avatarUrl: m.avatarUrl,
      alreadyAssigned: crewOnOtherShips.has(m.userId ?? m.id),
    }));
  }, [org, mission, selectedSeat]);

  const currentAssigneeUserId = useMemo(() => {
    if (!mission || !selectedSeat) return null;
    const ship = mission.ships.find((s) => s.id === selectedSeat.shipId);
    return ship?.crew.find((c) => c.seatId === selectedSeat.seat.id)?.userId ?? null;
  }, [mission, selectedSeat]);

  const availableFleetShips = useMemo(() => {
    if (!fleet || !mission) return [];
    const inMission = new Set(mission.ships.map((s) => s.shipId));
    return fleet.filter((f) => !inMission.has(f.id) && f.status === "ACTIVE");
  }, [fleet, mission]);

  if (authLoading || missionLoading) return <div className={styles.emptyShips}>Loading...</div>;
  if (!user) return <div className={styles.emptyShips}>Sign in to view this mission.</div>;
  if (!mission || !org) return <div className={styles.emptyShips}>Mission not found.</div>;

  const statusColor = missionStatusColor(mission.status);

  return (
    <div>
      <Link href={`/orgs/${slug}/missions`} className={styles.backLink}>← Back to Missions</Link>

      <div className={styles.header}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 className={styles.title}>{mission.title}</h1>
          {mission.description && <p className={styles.description}>{mission.description}</p>}
          <div className={styles.meta}>
            <span>{mission.operationType}</span>
            <span>{mission.ships.length} ship{mission.ships.length !== 1 ? "s" : ""}</span>
            <span className={styles.liveIndicator}>
              <span className={styles.liveDot} /> Live updates
            </span>
          </div>
        </div>
        <div className={styles.actions}>
          <span className={styles.statusBadge} style={{ background: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}55` }}>
            {missionStatusLabel(mission.status)}
          </span>
          <select
            className={styles.statusSelect}
            value={mission.status}
            onChange={(e) => handleStatusChange(e.target.value as MissionStatus)}
            disabled={statusUpdating}
          >
            <option value="PLANNING">Planning</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Ship list */}
      {mission.ships.length === 0 ? (
        <div className={styles.emptyShips}>No ships assigned yet. Add one below.</div>
      ) : (
        mission.ships.map((ship: MissionShip) => {
          const layout = getShipLayout(ship.shipName);
          const assignments = crewToSeatAssignments(ship.crew);
          return (
            <div key={ship.id} className={styles.shipSection}>
              <SeatLayout
                shipName={ship.shipName}
                nickname={ship.nickname || undefined}
                layout={layout}
                assignments={assignments}
                onSeatClick={(seat) => setSelectedSeat({ shipId: ship.id, shipName: ship.shipName, seat })}
              />
              <button className={styles.removeShipBtn} onClick={() => handleRemoveShip(ship.id)}>
                Remove ship
              </button>
            </div>
          );
        })
      )}

      {/* Add ship */}
      {availableFleetShips.length > 0 && (
        <div className={styles.addShipPanel}>
          <div className={styles.addShipRow}>
            <select
              className={styles.addShipSelect}
              value={addingShipId}
              onChange={(e) => setAddingShipId(e.target.value)}
            >
              <option value="">+ Add ship from fleet...</option>
              {availableFleetShips.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nickname ? `${f.nickname} (${f.shipName})` : f.shipName}
                </option>
              ))}
            </select>
            <button className={styles.addShipBtn} onClick={handleAddShip} disabled={!addingShipId}>
              Add
            </button>
          </div>
        </div>
      )}

      {/* Seat assignment modal */}
      {selectedSeat && (
        <AssignMemberModal
          seat={selectedSeat.seat}
          members={membersForModal}
          currentAssigneeUserId={currentAssigneeUserId}
          onAssign={async (userId) => {
            await handleAssign(selectedSeat.shipId, selectedSeat.seat.id, userId, selectedSeat.seat.label);
            setSelectedSeat(null);
          }}
          onUnassign={async () => {
            await handleUnassign(selectedSeat.shipId, selectedSeat.seat.id);
            setSelectedSeat(null);
          }}
          onClose={() => setSelectedSeat(null)}
        />
      )}
    </div>
  );
}
