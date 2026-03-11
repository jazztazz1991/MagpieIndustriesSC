"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import styles from "./operationDetail.module.css";
import type {
  OperationDetailDTO,
  OperationShipDTO,
  OperationType,
  OperationStatus,
  FleetShipDTO,
  OrgMemberDTO,
} from "@magpie/shared";

/* ------------------------------------------------------------------ */
/*  Local type aliases for brevity                                     */
/* ------------------------------------------------------------------ */

interface OrgSummary {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  myRole?: { permissions: string[] } | null;
}

type FleetShip = Pick<FleetShipDTO, "id" | "shipName" | "nickname">;
type OrgMember = Pick<OrgMemberDTO, "id" | "username">;

/* ------------------------------------------------------------------ */
/*  Position Maps by operation type                                    */
/* ------------------------------------------------------------------ */

const GENERAL_POSITIONS = [
  "Captain/Pilot",
  "Co-Pilot",
  "Flight Operations",
  "Engineer",
  "Gunner",
  "Hangar Services",
  "Medical",
];

const POSITIONS_BY_TYPE: Record<OperationType, string[]> = {
  mining: [
    ...GENERAL_POSITIONS,
    "Mining Lead",
    "Laser Operator",
    "Scan Operator",
    "Refinery Coordinator",
    "Hauler/Transport",
  ],
  salvage: [
    ...GENERAL_POSITIONS,
    "Salvage Lead",
    "Salvage Operator",
    "Hull Scraper",
    "Material Transport",
  ],
  cargo: [
    ...GENERAL_POSITIONS,
    "Cargo Lead",
    "Loadmaster",
    "Cargo Handler",
    "Freighter Pilot",
  ],
  security: [
    ...GENERAL_POSITIONS,
    "Security Lead",
    "Escort Pilot",
    "Ship Gunner",
    "Ground Security",
    "Overwatch/Scout",
  ],
  combat: [
    ...GENERAL_POSITIONS,
    "Fleet Commander",
    "Wing Lead",
    "Bomber Pilot",
    "Landing Crew",
    "SAR/Medevac",
  ],
  mixed: GENERAL_POSITIONS,
};

/* ------------------------------------------------------------------ */
/*  Badge helpers                                                      */
/* ------------------------------------------------------------------ */

const TYPE_LABELS: Record<OperationType, string> = {
  mining: "Mining",
  salvage: "Salvage",
  cargo: "Cargo",
  combat: "Combat",
  security: "Security",
  mixed: "Mixed",
};

const TYPE_STYLE: Record<OperationType, string> = {
  mining: styles.typeMining,
  salvage: styles.typeSalvage,
  cargo: styles.typeCargo,
  combat: styles.typeCombat,
  security: styles.typeSecurity,
  mixed: styles.typeMixed,
};

const STATUS_LABELS: Record<OperationStatus, string> = {
  PLANNING: "Planning",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const STATUS_STYLE: Record<OperationStatus, string> = {
  PLANNING: styles.statusPlanning,
  ACTIVE: styles.statusActive,
  COMPLETED: styles.statusCompleted,
  CANCELLED: styles.statusCancelled,
};

const STATUS_OPTIONS: OperationStatus[] = [
  "PLANNING",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
];

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function OperationDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const slug = params.slug as string;
  const operationId = params.id as string;

  const [org, setOrg] = useState<OrgSummary | null>(null);
  const [operation, setOperation] = useState<OperationDetailDTO | null>(null);
  const [fleetShips, setFleetShips] = useState<FleetShip[]>([]);
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status change
  const [newStatus, setNewStatus] = useState<OperationStatus>("PLANNING");
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Add ship
  const [selectedShipId, setSelectedShipId] = useState("");
  const [addingShip, setAddingShip] = useState(false);

  // Assign crew – keyed by operation-ship id
  const [assigningShipId, setAssigningShipId] = useState<string | null>(null);
  const [crewMemberId, setCrewMemberId] = useState("");
  const [crewPosition, setCrewPosition] = useState("");
  const [assigningCrew, setAssigningCrew] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    fetchAll();
  }, [user, authLoading, slug, operationId]);

  async function fetchAll() {
    setLoading(true);
    setError(null);

    const orgRes = await apiFetch<OrgSummary>(`/api/orgs/${slug}`);

    if (!orgRes.success || !orgRes.data) {
      setError(orgRes.error || "Organization not found");
      setLoading(false);
      return;
    }

    setOrg(orgRes.data);

    const [opRes, fleetRes, membersRes] = await Promise.all([
      apiFetch<OperationDetailDTO>(
        `/api/orgs/${orgRes.data.id}/operations/${operationId}`
      ),
      apiFetch<FleetShip[]>(`/api/orgs/${orgRes.data.id}/fleet`),
      apiFetch<OrgMember[]>(`/api/orgs/${orgRes.data.id}/members`),
    ]);

    if (opRes.success && opRes.data) {
      setOperation(opRes.data);
      setNewStatus(opRes.data.status);
    } else {
      setError(opRes.error || "Failed to load operation");
    }

    if (fleetRes.success && fleetRes.data) {
      setFleetShips(fleetRes.data);
    }

    if (membersRes.success && membersRes.data) {
      setMembers(membersRes.data);
    }

    setLoading(false);
  }

  async function refreshOperation() {
    if (!org) return;
    const res = await apiFetch<OperationDetailDTO>(
      `/api/orgs/${org.id}/operations/${operationId}`
    );
    if (res.success && res.data) {
      setOperation(res.data);
      setNewStatus(res.data.status);
    }
  }

  /* Status update */
  async function handleStatusUpdate() {
    if (!org || !operation) return;
    setStatusUpdating(true);

    const res = await apiFetch(
      `/api/orgs/${org.id}/operations/${operationId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (res.success) {
      await refreshOperation();
    } else {
      alert(res.error || "Failed to update status");
    }
    setStatusUpdating(false);
  }

  /* Add ship */
  async function handleAddShip() {
    if (!org || !selectedShipId) return;
    setAddingShip(true);

    const res = await apiFetch(
      `/api/orgs/${org.id}/operations/${operationId}/ships`,
      {
        method: "POST",
        body: JSON.stringify({ fleetShipId: selectedShipId }),
      }
    );

    if (res.success) {
      setSelectedShipId("");
      await refreshOperation();
    } else {
      alert(res.error || "Failed to add ship");
    }
    setAddingShip(false);
  }

  /* Remove ship */
  async function handleRemoveShip(opShipId: string) {
    if (!org || !confirm("Remove this ship from the operation?")) return;

    const res = await apiFetch(
      `/api/orgs/${org.id}/operations/${operationId}/ships/${opShipId}`,
      { method: "DELETE" }
    );

    if (res.success) {
      await refreshOperation();
    } else {
      alert(res.error || "Failed to remove ship");
    }
  }

  /* Assign crew */
  async function handleAssignCrew(opShipId: string) {
    if (!org || !crewMemberId || !crewPosition) return;
    setAssigningCrew(true);

    const res = await apiFetch(
      `/api/orgs/${org.id}/operations/${operationId}/ships/${opShipId}/crew`,
      {
        method: "POST",
        body: JSON.stringify({
          userId: crewMemberId,
          position: crewPosition,
        }),
      }
    );

    if (res.success) {
      setCrewMemberId("");
      setCrewPosition("");
      setAssigningShipId(null);
      await refreshOperation();
    } else {
      alert(res.error || "Failed to assign crew");
    }
    setAssigningCrew(false);
  }

  /* Remove crew */
  async function handleRemoveCrew(_opShipId: string, crewId: string) {
    if (!org) return;

    const res = await apiFetch(
      `/api/orgs/${org.id}/operations/${operationId}/crew/${crewId}`,
      { method: "DELETE" }
    );

    if (res.success) {
      await refreshOperation();
    } else {
      alert(res.error || "Failed to remove crew member");
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Render guards                                                    */
  /* ---------------------------------------------------------------- */

  if (authLoading || loading) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.emptyState}>Sign in to view this operation.</div>
      </div>
    );
  }

  if (error || !org || !operation) {
    return (
      <div className={styles.detailPage}>
        <Link href={`/orgs/${slug}/operations`} className={styles.backLink}>
          Back to Operations
        </Link>
        <div className={styles.emptyState}>
          {error || "Operation not found"}
        </div>
      </div>
    );
  }

  const isCreator = user.id === operation.creatorId;
  const isOwner = org.ownerId === user.id;
  const canManage =
    isOwner ||
    (org.myRole?.permissions?.includes("manage_operations") ?? false);
  const opType = operation.operationType as OperationType;
  const positions: string[] = POSITIONS_BY_TYPE[opType] || GENERAL_POSITIONS;

  // Ships available to add (not already assigned)
  const assignedShipIds = new Set(operation.ships.map((s) => s.shipId));
  const availableShips = fleetShips.filter((s) => !assignedShipIds.has(s.id));

  return (
    <div className={styles.detailPage}>
      <Link href={`/orgs/${slug}/operations`} className={styles.backLink}>
        Back to Operations
      </Link>

      {/* Header */}
      <div className={styles.detailHeader}>
        <div className={styles.detailTitleRow}>
          <h1 className={styles.detailTitle}>{operation.title}</h1>
          <span
            className={`${styles.typeBadge} ${TYPE_STYLE[opType] || ""}`}
          >
            {TYPE_LABELS[opType] || operation.operationType}
          </span>
          <span
            className={`${styles.statusBadge} ${STATUS_STYLE[operation.status] || ""}`}
          >
            {STATUS_LABELS[operation.status] || operation.status}
          </span>
        </div>
        <div className={styles.detailMeta}>
          {operation.startsAt && (
            <span>Starts: {formatDateTime(operation.startsAt)}</span>
          )}
          {operation.endsAt && (
            <span>Ends: {formatDateTime(operation.endsAt)}</span>
          )}
          <span>Created by: {operation.creatorUsername}</span>
        </div>
        {operation.description && (
          <p className={styles.detailDescription}>{operation.description}</p>
        )}
      </div>

      {/* Status Controls */}
      {canManage && (
        <div className={styles.statusControls}>
          <label htmlFor="statusSelect">Change Status:</label>
          <select
            id="statusSelect"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as OperationStatus)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <button
            className={styles.statusUpdateBtn}
            onClick={handleStatusUpdate}
            disabled={statusUpdating || newStatus === operation.status}
          >
            {statusUpdating ? "Updating..." : "Update"}
          </button>
        </div>
      )}

      {/* Ships Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Ships ({operation.ships.length})
          </h2>
        </div>

        {/* Add Ship */}
        {canManage && availableShips.length > 0 && (
          <div className={styles.addShipRow}>
            <select
              value={selectedShipId}
              onChange={(e) => setSelectedShipId(e.target.value)}
            >
              <option value="">Select a ship to add...</option>
              {availableShips.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shipName}
                  {s.nickname ? ` "${s.nickname}"` : ""}
                </option>
              ))}
            </select>
            <button
              className={styles.addBtn}
              onClick={handleAddShip}
              disabled={!selectedShipId || addingShip}
            >
              {addingShip ? "Adding..." : "Add Ship"}
            </button>
          </div>
        )}

        {operation.ships.length === 0 ? (
          <div className={styles.emptyState}>
            No ships assigned yet. Add one from the fleet above.
          </div>
        ) : (
          operation.ships.map((opShip) => (
            <div key={opShip.id} className={styles.shipCard}>
              <div className={styles.shipCardHeader}>
                <span className={styles.shipCardName}>
                  {opShip.shipName}
                  {opShip.nickname ? ` "${opShip.nickname}"` : ""}
                </span>
                {canManage && (
                  <button
                    className={styles.removeShipBtn}
                    onClick={() => handleRemoveShip(opShip.id)}
                  >
                    Remove Ship
                  </button>
                )}
              </div>

              {/* Crew Roster */}
              {opShip.crew.length > 0 ? (
                <div className={styles.crewList}>
                  {opShip.crew.map((c) => (
                    <div key={c.id} className={styles.crewRow}>
                      <div className={styles.crewInfo}>
                        <span className={styles.crewName}>{c.username}</span>
                        <span className={styles.crewPosition}>
                          {c.position}
                        </span>
                      </div>
                      {canManage && (
                        <button
                          className={styles.removeCrewBtn}
                          onClick={() => handleRemoveCrew(opShip.id, c.id)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyCrewNote}>No crew assigned.</div>
              )}

              {/* Assign Crew Toggle / Form */}
              {canManage && (
                assigningShipId === opShip.id ? (
                  <div className={styles.assignCrewForm}>
                    <select
                      value={crewMemberId}
                      onChange={(e) => setCrewMemberId(e.target.value)}
                    >
                      <option value="">Select member...</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.username}
                        </option>
                      ))}
                    </select>
                    <select
                      value={crewPosition}
                      onChange={(e) => setCrewPosition(e.target.value)}
                    >
                      <option value="">Select position...</option>
                      {positions.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <button
                      className={styles.assignBtn}
                      onClick={() => handleAssignCrew(opShip.id)}
                      disabled={!crewMemberId || !crewPosition || assigningCrew}
                    >
                      {assigningCrew ? "Assigning..." : "Assign"}
                    </button>
                    <button
                      className={styles.toggleAssignBtn}
                      onClick={() => setAssigningShipId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className={styles.toggleAssignBtn}
                    onClick={() => {
                      setAssigningShipId(opShip.id);
                      setCrewMemberId("");
                      setCrewPosition("");
                    }}
                  >
                    Assign Crew
                  </button>
                )
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
