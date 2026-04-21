"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { missionStatusColor, missionStatusLabel, type MissionStatus } from "@/domain/missions";
import styles from "./missions.module.css";

interface MissionSummary {
  id: string;
  title: string;
  description: string | null;
  operationType: string;
  status: MissionStatus;
  startsAt: string | null;
  endsAt: string | null;
  shipCount: number;
  crewCount: number;
  createdAt: string;
}

interface Org { id: string; slug: string; }

const STATUS_FILTERS: Array<{ key: "all" | MissionStatus; label: string }> = [
  { key: "all", label: "All" },
  { key: "PLANNING", label: "Planning" },
  { key: "ACTIVE", label: "Active" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

export default function MissionsListPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { user, loading: authLoading } = useAuth();

  const [org, setOrg] = useState<Org | null>(null);
  const [missions, setMissions] = useState<MissionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<"all" | MissionStatus>("all");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [operationType, setOperationType] = useState("mining");
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    (async () => {
      const orgRes = await apiFetch<Org>(`/api/orgs/${slug}`);
      if (!orgRes.success || !orgRes.data) {
        setLoading(false);
        return;
      }
      setOrg(orgRes.data);
      const missRes = await apiFetch<MissionSummary[]>(`/api/orgs/${orgRes.data.id}/operations`);
      if (missRes.success && missRes.data) setMissions(missRes.data);
      setLoading(false);
    })();
  }, [slug, user, authLoading]);

  const filtered = useMemo(
    () => (filter === "all" ? missions : missions.filter((m) => m.status === filter)),
    [missions, filter]
  );

  const handleCreate = async () => {
    if (!org || !title.trim()) return;
    setCreating(true);
    setErr(null);
    const res = await apiFetch<MissionSummary>(`/api/orgs/${org.id}/operations`, {
      method: "POST",
      body: JSON.stringify({ title: title.trim(), description: description.trim() || null, operationType }),
    });
    setCreating(false);
    if (res.success && res.data) {
      setMissions((prev) => [res.data!, ...prev]);
      setTitle("");
      setDescription("");
      setShowCreate(false);
    } else {
      setErr(res.error || "Failed to create mission");
    }
  };

  if (authLoading || loading) return <div className={styles.emptyState}>Loading...</div>;
  if (!user) return <div className={styles.emptyState}>Sign in to view missions.</div>;
  if (!org) return <div className={styles.emptyState}>Organization not found.</div>;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Missions</h1>
        {!showCreate && (
          <button className={styles.createBtn} onClick={() => setShowCreate(true)}>
            + New Mission
          </button>
        )}
      </div>

      {showCreate && (
        <div className={styles.form}>
          <div className={styles.formRow}>
            <label className={styles.formLabel} htmlFor="mtitle">Title</label>
            <input
              id="mtitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Pyro Ore Run"
              maxLength={200}
              style={{ padding: "0.45rem 0.6rem", background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--text-primary)" }}
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel} htmlFor="mtype">Type</label>
            <select
              id="mtype"
              value={operationType}
              onChange={(e) => setOperationType(e.target.value)}
              style={{ padding: "0.45rem 0.6rem", background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--text-primary)" }}
            >
              <option value="mining">Mining</option>
              <option value="combat">Combat</option>
              <option value="salvage">Salvage</option>
              <option value="cargo">Cargo</option>
              <option value="exploration">Exploration</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel} htmlFor="mdesc">Description (optional)</label>
            <textarea
              id="mdesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              maxLength={1000}
              style={{ padding: "0.45rem 0.6rem", background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--text-primary)", resize: "vertical" }}
            />
          </div>
          {err && <div style={{ color: "#f87171", fontSize: "0.85rem" }}>{err}</div>}
          <div className={styles.formActions}>
            <button className={styles.createBtn} onClick={handleCreate} disabled={creating || !title.trim()}>
              {creating ? "Creating..." : "Create"}
            </button>
            <button className={styles.cancelBtn} onClick={() => setShowCreate(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className={styles.filters}>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            className={`${styles.filterBtn} ${filter === f.key ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            {f.key !== "all" && ` (${missions.filter((m) => m.status === f.key).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          {missions.length === 0
            ? "No missions yet. Create one to start planning."
            : `No ${filter.toLowerCase()} missions.`}
        </div>
      ) : (
        <div className={styles.missionGrid}>
          {filtered.map((mission) => {
            const color = missionStatusColor(mission.status);
            return (
              <Link key={mission.id} href={`/orgs/${slug}/missions/${mission.id}`} className={styles.missionCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.missionTitle}>{mission.title}</h3>
                  <span
                    className={styles.statusBadge}
                    style={{ background: `${color}20`, color, border: `1px solid ${color}55` }}
                  >
                    {missionStatusLabel(mission.status)}
                  </span>
                </div>
                {mission.description && <p className={styles.description}>{mission.description}</p>}
                <div className={styles.meta}>
                  <span className={styles.metaItem}>🚀 {mission.shipCount} ship{mission.shipCount !== 1 ? "s" : ""}</span>
                  <span className={styles.metaItem}>👥 {mission.crewCount} crew</span>
                  <span className={styles.metaItem}>{mission.operationType}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
