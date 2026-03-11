"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import styles from "./fleet.module.css";
import type { FleetShipDTO, ShipStatus } from "@magpie/shared";

interface OrgSummary {
  id: string;
  name: string;
  slug: string;
}

type FleetShip = Pick<FleetShipDTO, "id" | "shipName" | "nickname" | "status"> & {
  owner: { id: string; username: string };
};

const STATUS_OPTIONS: ShipStatus[] = [
  "ACTIVE",
  "DESTROYED",
  "LOANED",
  "IN_REPAIR",
];

const STATUS_LABELS: Record<ShipStatus, string> = {
  ACTIVE: "Active",
  DESTROYED: "Destroyed",
  LOANED: "Loaned",
  IN_REPAIR: "In Repair",
};

function getStatusClass(status: ShipStatus): string {
  switch (status) {
    case "ACTIVE":
      return `${styles.statusBadge} ${styles.statusActive}`;
    case "DESTROYED":
      return `${styles.statusBadge} ${styles.statusDestroyed}`;
    case "LOANED":
      return `${styles.statusBadge} ${styles.statusLoaned}`;
    case "IN_REPAIR":
      return `${styles.statusBadge} ${styles.statusInRepair}`;
    default:
      return styles.statusBadge;
  }
}

export default function FleetPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const slug = params.slug as string;

  const [org, setOrg] = useState<OrgSummary | null>(null);
  const [ships, setShips] = useState<FleetShip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add ship form
  const [shipName, setShipName] = useState("");
  const [nickname, setNickname] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNickname, setEditNickname] = useState("");
  const [editStatus, setEditStatus] = useState<ShipStatus>("ACTIVE");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    fetchOrg();
  }, [user, authLoading, slug]);

  async function fetchOrg() {
    setLoading(true);
    setError(null);

    const orgRes = await apiFetch<OrgSummary>(`/api/orgs/${slug}`);

    if (!orgRes.success || !orgRes.data) {
      setError(orgRes.error || "Organization not found");
      setLoading(false);
      return;
    }

    setOrg(orgRes.data);
    await fetchFleet(orgRes.data.id);
    setLoading(false);
  }

  async function fetchFleet(orgId: string) {
    const res = await apiFetch<FleetShip[]>(`/api/orgs/${orgId}/fleet`);
    if (res.success && res.data) {
      setShips(res.data);
    } else {
      setError(res.error || "Failed to load fleet");
    }
  }

  async function handleAddShip(e: React.FormEvent) {
    e.preventDefault();
    if (!org || !shipName.trim()) return;

    setAdding(true);
    setAddError(null);

    const res = await apiFetch<FleetShip>(`/api/orgs/${org.id}/fleet`, {
      method: "POST",
      body: JSON.stringify({
        shipName: shipName.trim(),
        nickname: nickname.trim() || undefined,
      }),
    });

    if (res.success) {
      setShipName("");
      setNickname("");
      await fetchFleet(org.id);
    } else {
      setAddError(res.error || "Failed to add ship");
    }
    setAdding(false);
  }

  function startEdit(ship: FleetShip) {
    setEditingId(ship.id);
    setEditNickname(ship.nickname || "");
    setEditStatus(ship.status);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditNickname("");
    setEditStatus("ACTIVE");
  }

  async function handleSaveEdit(shipId: string) {
    if (!org) return;

    setSaving(true);
    const res = await apiFetch(`/api/orgs/${org.id}/fleet/${shipId}`, {
      method: "PATCH",
      body: JSON.stringify({
        nickname: editNickname.trim() || null,
        status: editStatus,
      }),
    });

    if (res.success) {
      cancelEdit();
      await fetchFleet(org.id);
    } else {
      alert(res.error || "Failed to update ship");
    }
    setSaving(false);
  }

  async function handleRemoveShip(shipId: string) {
    if (!org || !confirm("Remove this ship from the fleet?")) return;

    const res = await apiFetch(`/api/orgs/${org.id}/fleet/${shipId}`, {
      method: "DELETE",
    });

    if (res.success) {
      await fetchFleet(org.id);
    } else {
      alert(res.error || "Failed to remove ship");
    }
  }

  if (authLoading || loading) {
    return (
      <div className={styles.fleetPage}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.fleetPage}>
        <div className={styles.emptyState}>Sign in to view fleet details.</div>
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className={styles.fleetPage}>
        <Link href={`/orgs/${slug}`} className={styles.backLink}>
          Back to Organization
        </Link>
        <div className={styles.emptyState}>{error || "Organization not found"}</div>
      </div>
    );
  }

  return (
    <div className={styles.fleetPage}>
      <Link href={`/orgs/${slug}`} className={styles.backLink}>
        Back to Organization
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>{org.name} — Fleet</h1>
      </div>

      {/* Add Ship Form */}
      <div className={styles.addForm}>
        <div className={styles.addFormTitle}>Add Ship to Fleet</div>
        <form onSubmit={handleAddShip}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="shipName">Ship Name</label>
              <input
                id="shipName"
                type="text"
                value={shipName}
                onChange={(e) => setShipName(e.target.value)}
                placeholder="e.g. Constellation Andromeda"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="nickname">Nickname (optional)</label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. The Magpie"
              />
            </div>
            <button type="submit" className={styles.formSubmit} disabled={adding}>
              {adding ? "Adding..." : "Add Ship"}
            </button>
          </div>
        </form>
        {addError && <div className={styles.error}>{addError}</div>}
      </div>

      {/* Fleet List */}
      {ships.length === 0 ? (
        <div className={styles.emptyState}>
          No ships in the fleet yet. Add one above.
        </div>
      ) : (
        <div className={styles.fleetGrid}>
          {ships.map((ship) => (
            <div key={ship.id} className={styles.shipRow}>
              {editingId === ship.id ? (
                <div className={styles.editForm}>
                  <span className={styles.shipName}>{ship.shipName}</span>
                  <input
                    type="text"
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    placeholder="Nickname"
                  />
                  <select
                    value={editStatus}
                    onChange={(e) =>
                      setEditStatus(e.target.value as ShipStatus)
                    }
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                  <button
                    className={styles.saveBtn}
                    onClick={() => handleSaveEdit(ship.id)}
                    disabled={saving}
                  >
                    Save
                  </button>
                  <button className={styles.cancelBtn} onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className={styles.shipInfo}>
                    <span className={styles.shipName}>{ship.shipName}</span>
                    {ship.nickname && (
                      <span className={styles.shipNickname}>
                        &quot;{ship.nickname}&quot;
                      </span>
                    )}
                    <span className={getStatusClass(ship.status)}>
                      {STATUS_LABELS[ship.status]}
                    </span>
                    <span className={styles.shipOwner}>
                      Owner: {ship.owner.username}
                    </span>
                  </div>
                  {user.id === ship.owner.id && (
                    <div className={styles.shipActions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => startEdit(ship)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.removeBtn}
                        onClick={() => handleRemoveShip(ship.id)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
