"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import styles from "./operations.module.css";
import type {
  OperationSummaryDTO,
  OperationType,
  OperationStatus,
} from "@magpie/shared";

interface OrgSummary {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  myRole?: { permissions: string[] } | null;
}

const OPERATION_TYPES: OperationType[] = [
  "mining",
  "salvage",
  "cargo",
  "combat",
  "security",
  "mixed",
];

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

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function OperationsPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const slug = params.slug as string;

  const [org, setOrg] = useState<OrgSummary | null>(null);
  const [operations, setOperations] = useState<OperationSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create form state
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState<OperationType>("mining");
  const [formDescription, setFormDescription] = useState("");
  const [formStartsAt, setFormStartsAt] = useState("");
  const [formEndsAt, setFormEndsAt] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

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
    await fetchOperations(orgRes.data.id);
    setLoading(false);
  }

  async function fetchOperations(orgId: string) {
    const res = await apiFetch<OperationSummaryDTO[]>(
      `/api/orgs/${orgId}/operations`
    );
    if (res.success && res.data) {
      setOperations(res.data);
    } else {
      setError(res.error || "Failed to load operations");
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!org || !formTitle.trim() || !formStartsAt) return;

    setCreating(true);
    setCreateError(null);

    const res = await apiFetch<OperationSummaryDTO>(
      `/api/orgs/${org.id}/operations`,
      {
        method: "POST",
        body: JSON.stringify({
          title: formTitle.trim(),
          operationType: formType,
          description: formDescription.trim() || null,
          startsAt: new Date(formStartsAt).toISOString(),
          endsAt: formEndsAt ? new Date(formEndsAt).toISOString() : null,
        }),
      }
    );

    if (res.success) {
      setFormTitle("");
      setFormType("mining");
      setFormDescription("");
      setFormStartsAt("");
      setFormEndsAt("");
      setShowForm(false);
      await fetchOperations(org.id);
    } else {
      setCreateError(res.error || "Failed to create operation");
    }
    setCreating(false);
  }

  if (authLoading || loading) {
    return (
      <div className={styles.operationsPage}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.operationsPage}>
        <div className={styles.emptyState}>
          Sign in to view operations.
        </div>
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className={styles.operationsPage}>
        <Link href={`/orgs/${slug}`} className={styles.backLink}>
          Back to Organization
        </Link>
        <div className={styles.emptyState}>
          {error || "Organization not found"}
        </div>
      </div>
    );
  }

  const canManage =
    org.ownerId === user.id ||
    (org.myRole?.permissions?.includes("manage_operations") ?? false);

  return (
    <div className={styles.operationsPage}>
      <Link href={`/orgs/${slug}`} className={styles.backLink}>
        Back to Organization
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>{org.name} — Operations</h1>
        {canManage && (
          <button
            className={styles.formSubmit}
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "Cancel" : "New Operation"}
          </button>
        )}
      </div>

      {/* Create Operation Form */}
      {canManage && showForm && (
        <div className={styles.createForm}>
          <div className={styles.createFormTitle}>Create Operation</div>
          <form onSubmit={handleCreate}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="opTitle">Title</label>
                <input
                  id="opTitle"
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Operation name"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="opType">Type</label>
                <select
                  id="opType"
                  value={formType}
                  onChange={(e) =>
                    setFormType(e.target.value as OperationType)
                  }
                >
                  {OPERATION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                <label htmlFor="opDesc">Description (optional)</label>
                <textarea
                  id="opDesc"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="What is this operation about?"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="opStart">Starts At</label>
                <input
                  id="opStart"
                  type="datetime-local"
                  value={formStartsAt}
                  onChange={(e) => setFormStartsAt(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="opEnd">Ends At (optional)</label>
                <input
                  id="opEnd"
                  type="datetime-local"
                  value={formEndsAt}
                  onChange={(e) => setFormEndsAt(e.target.value)}
                />
              </div>
              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.formSubmit}
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create Operation"}
                </button>
              </div>
            </div>
          </form>
          {createError && <div className={styles.error}>{createError}</div>}
        </div>
      )}

      {/* Operations List */}
      {operations.length === 0 ? (
        <div className={styles.emptyState}>
          No operations yet. Create one to get started.
        </div>
      ) : (
        <div className={styles.operationList}>
          {operations.map((op) => {
            const opType = op.operationType as OperationType;
            return (
            <Link
              key={op.id}
              href={`/orgs/${slug}/operations/${op.id}`}
              className={styles.operationCard}
            >
              <div className={styles.operationCardHeader}>
                <span className={styles.operationTitle}>{op.title}</span>
                <span
                  className={`${styles.typeBadge} ${TYPE_STYLE[opType] || ""}`}
                >
                  {TYPE_LABELS[opType] || op.operationType}
                </span>
                <span
                  className={`${styles.statusBadge} ${STATUS_STYLE[op.status] || ""}`}
                >
                  {STATUS_LABELS[op.status] || op.status}
                </span>
              </div>
              <div className={styles.operationMeta}>
                {op.startsAt && (
                <span className={styles.metaItem}>
                  Starts: {formatDateTime(op.startsAt)}
                </span>
                )}
                <span className={styles.metaItem}>
                  Ships: {op.shipCount}
                </span>
                <span className={styles.metaItem}>
                  Crew: {op.crewCount}
                </span>
              </div>
            </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
