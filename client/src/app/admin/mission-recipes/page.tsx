"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import styles from "../recipes.module.css";

interface Objective { description: string; sortOrder: number; isOptional: boolean; }
interface Reward { rewardType: string; description: string; quantity?: string; }
interface MissionRecipe {
  id: string; name: string; description: string | null; missionType: string;
  difficulty: string | null; minPlayers: number; maxPlayers: number | null;
  estimatedPay: string | null; location: string | null; notes: string | null;
  objectives: { id: string; description: string; sortOrder: number; isOptional: boolean }[];
  rewards: { id: string; rewardType: string; description: string; quantity: string | null }[];
  createdAt: string; updatedAt: string;
}

const MISSION_TYPES = ["bounty", "delivery", "mining", "salvage", "investigation", "mercenary"];
const DIFFICULTIES = ["easy", "medium", "hard", "expert"];
const REWARD_TYPES = ["aUEC", "item", "reputation", "unlock"];

export default function MissionRecipesPage() {
  const { user, loading: authLoading } = useAuth();
  const [missions, setMissions] = useState<MissionRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [missionType, setMissionType] = useState("bounty");
  const [difficulty, setDifficulty] = useState("");
  const [minPlayers, setMinPlayers] = useState(1);
  const [maxPlayers, setMaxPlayers] = useState<number | "">("");
  const [estimatedPay, setEstimatedPay] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.isAdmin) { setLoading(false); return; }
    fetchMissions();
  }, [authLoading, user]);

  async function fetchMissions() {
    setLoading(true);
    const qs = filter ? `?type=${filter}` : "";
    const res = await apiFetch<MissionRecipe[]>(`/api/mission-recipes${qs}`);
    if (res.success && res.data) setMissions(res.data);
    setLoading(false);
  }

  function resetForm() {
    setName(""); setDescription(""); setMissionType("bounty"); setDifficulty("");
    setMinPlayers(1); setMaxPlayers(""); setEstimatedPay(""); setLocation("");
    setNotes(""); setObjectives([]); setRewards([]); setEditId(null);
    setShowForm(false); setError(null);
  }

  function startEdit(m: MissionRecipe) {
    setEditId(m.id); setName(m.name); setDescription(m.description || "");
    setMissionType(m.missionType); setDifficulty(m.difficulty || "");
    setMinPlayers(m.minPlayers); setMaxPlayers(m.maxPlayers ?? "");
    setEstimatedPay(m.estimatedPay || ""); setLocation(m.location || "");
    setNotes(m.notes || "");
    setObjectives(m.objectives.map((o) => ({ description: o.description, sortOrder: o.sortOrder, isOptional: o.isOptional })));
    setRewards(m.rewards.map((r) => ({ rewardType: r.rewardType, description: r.description, quantity: r.quantity || undefined })));
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true); setError(null);
    const body = {
      name, missionType, minPlayers, objectives, rewards,
      ...(description ? { description } : {}),
      ...(difficulty ? { difficulty } : {}),
      ...(maxPlayers !== "" ? { maxPlayers: Number(maxPlayers) } : {}),
      ...(estimatedPay ? { estimatedPay } : {}),
      ...(location ? { location } : {}),
      ...(notes ? { notes } : {}),
    };

    const res = editId
      ? await apiFetch(`/api/mission-recipes/${editId}`, { method: "PATCH", body: JSON.stringify(body) })
      : await apiFetch("/api/mission-recipes", { method: "POST", body: JSON.stringify(body) });

    if (res.success) { resetForm(); fetchMissions(); }
    else { setError(res.error || "Failed to save"); }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this mission recipe?")) return;
    await apiFetch(`/api/mission-recipes/${id}`, { method: "DELETE" });
    fetchMissions();
  }

  function getDiffClass(d: string | null) {
    if (!d) return styles.difficultyBadge;
    const map: Record<string, string> = { easy: styles.diffEasy, medium: styles.diffMedium, hard: styles.diffHard, expert: styles.diffExpert };
    return `${styles.difficultyBadge} ${map[d] || ""}`;
  }

  if (authLoading || loading) return <div className={styles.loading}>Loading...</div>;
  if (!user?.isAdmin) return <div className={styles.denied}>Admin access required.</div>;

  return (
    <div className={styles.recipesPage}>
      <Link href="/admin" className={styles.backLink}>Back to Admin</Link>
      <div className={styles.header}>
        <h1 className={styles.title}>Mission Recipes</h1>
        <button className={styles.newBtn} onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? "Cancel" : "New Mission"}
        </button>
      </div>

      {showForm && (
        <form className={styles.createForm} onSubmit={handleSubmit}>
          <div className={styles.formTitle}>{editId ? "Edit Mission" : "New Mission Recipe"}</div>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Mission Type</label>
              <select value={missionType} onChange={(e) => setMissionType(e.target.value)}>
                {MISSION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="">None</option>
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label>Min Players</label>
              <input type="number" min={1} value={minPlayers} onChange={(e) => setMinPlayers(Number(e.target.value))} />
            </div>
            <div className={styles.formGroup}>
              <label>Max Players</label>
              <input type="number" min={1} value={maxPlayers} onChange={(e) => setMaxPlayers(e.target.value ? Number(e.target.value) : "")} />
            </div>
            <div className={styles.formGroup}>
              <label>Estimated Pay (aUEC)</label>
              <input value={estimatedPay} onChange={(e) => setEstimatedPay(e.target.value)} placeholder="e.g. 15000-25000" />
            </div>
            <div className={`${styles.formGroup} ${styles.formGridFull}`}>
              <label>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className={`${styles.formGroup} ${styles.formGridFull}`}>
              <label>Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>

          <div className={styles.listSection}>
            <div className={styles.listSectionTitle}>Objectives</div>
            {objectives.map((obj, i) => (
              <div key={i} className={styles.listRow}>
                <input placeholder="Objective description" value={obj.description} onChange={(e) => { const arr = [...objectives]; arr[i].description = e.target.value; setObjectives(arr); }} />
                <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <input type="checkbox" checked={obj.isOptional} onChange={(e) => { const arr = [...objectives]; arr[i].isOptional = e.target.checked; setObjectives(arr); }} />
                  Optional
                </label>
                <button type="button" className={styles.removeBtn} onClick={() => setObjectives(objectives.filter((_, j) => j !== i))}>x</button>
              </div>
            ))}
            <button type="button" className={styles.addBtn} onClick={() => setObjectives([...objectives, { description: "", sortOrder: objectives.length, isOptional: false }])}>+ Add Objective</button>
          </div>

          <div className={styles.listSection}>
            <div className={styles.listSectionTitle}>Rewards</div>
            {rewards.map((rew, i) => (
              <div key={i} className={styles.listRow}>
                <select value={rew.rewardType} onChange={(e) => { const arr = [...rewards]; arr[i].rewardType = e.target.value; setRewards(arr); }} style={{ width: "100px" }}>
                  {REWARD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <input placeholder="Description" value={rew.description} onChange={(e) => { const arr = [...rewards]; arr[i].description = e.target.value; setRewards(arr); }} />
                <input placeholder="Qty" value={rew.quantity || ""} onChange={(e) => { const arr = [...rewards]; arr[i].quantity = e.target.value; setRewards(arr); }} style={{ width: "80px" }} />
                <button type="button" className={styles.removeBtn} onClick={() => setRewards(rewards.filter((_, j) => j !== i))}>x</button>
              </div>
            ))}
            <button type="button" className={styles.addBtn} onClick={() => setRewards([...rewards, { rewardType: "aUEC", description: "", quantity: "" }])}>+ Add Reward</button>
          </div>

          <div className={styles.formActions}>
            <button className={styles.submitBtn} type="submit" disabled={submitting}>{submitting ? "Saving..." : editId ? "Update" : "Create"}</button>
            <button className={styles.cancelBtn} type="button" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.filterBar}>
        <select className={styles.selectSmall} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Types</option>
          {MISSION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <button className={styles.newBtn} style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }} onClick={() => fetchMissions()}>Filter</button>
      </div>

      <div className={styles.recipeList}>
        {missions.length === 0 && <div className={styles.emptyState}>No mission recipes yet.</div>}
        {missions.map((m) => (
          <div key={m.id} className={styles.recipeCard}>
            <div className={styles.recipeHeader}>
              <span className={styles.recipeName}>{m.name}</span>
              <span>
                <span className={styles.categoryBadge}>{m.missionType}</span>
                {m.difficulty && <span className={getDiffClass(m.difficulty)}>{m.difficulty}</span>}
              </span>
            </div>
            <div className={styles.recipeMeta}>
              {m.minPlayers}-{m.maxPlayers || "?"} players
              {m.estimatedPay && <> &middot; {m.estimatedPay} aUEC</>}
              {m.location && <> &middot; {m.location}</>}
            </div>
            {m.description && <div className={styles.recipeDesc}>{m.description}</div>}
            {m.objectives.length > 0 && (
              <>
                <div className={styles.listSectionTitle} style={{ marginTop: "0.5rem" }}>Objectives</div>
                <ul className={styles.objectiveList}>
                  {m.objectives.map((o) => <li key={o.id}>{o.description}{o.isOptional ? " (optional)" : ""}</li>)}
                </ul>
              </>
            )}
            {m.rewards.length > 0 && (
              <>
                <div className={styles.listSectionTitle} style={{ marginTop: "0.5rem" }}>Rewards</div>
                <ul className={styles.rewardList}>
                  {m.rewards.map((r) => <li key={r.id}>[{r.rewardType}] {r.description}{r.quantity ? ` (${r.quantity})` : ""}</li>)}
                </ul>
              </>
            )}
            <div className={styles.cardActions}>
              <button className={styles.editBtn} onClick={() => startEdit(m)}>Edit</button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(m.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
