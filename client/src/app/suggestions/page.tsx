"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import styles from "./suggestions.module.css";

interface SuggestionItem {
  id: string;
  title: string;
  description: string;
  status: string;
  adminNotes: string | null;
  voteCount: number;
  hasVoted: boolean;
  createdAt: string;
  author: { id: string; username: string };
}

export default function SuggestionsPage() {
  const { user, loading: authLoading } = useAuth();
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sort, setSort] = useState<"newest" | "votes">("votes");
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    fetchSuggestions();
  }, [authLoading, user, sort]);

  async function fetchSuggestions() {
    setLoading(true);
    const res = await apiFetch<SuggestionItem[]>(`/api/suggestions?sort=${sort}`);
    if (res.success && res.data) setSuggestions(res.data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await apiFetch<SuggestionItem>("/api/suggestions", {
      method: "POST",
      body: JSON.stringify({ title, description }),
    });
    if (res.success) {
      setTitle("");
      setDescription("");
      setShowForm(false);
      fetchSuggestions();
    } else {
      setError(res.error || "Failed to submit suggestion");
    }
    setSubmitting(false);
  }

  async function handleVote(id: string) {
    const res = await apiFetch<SuggestionItem>(`/api/suggestions/${id}/vote`, { method: "POST" });
    if (res.success && res.data) {
      setSuggestions((prev) => prev.map((s) => (s.id === id ? res.data! : s)));
    }
  }

  function getStatusClass(status: string) {
    const map: Record<string, string> = {
      PENDING: styles.statusPending,
      UNDER_REVIEW: styles.statusUnderReview,
      PLANNED: styles.statusPlanned,
      DECLINED: styles.statusDeclined,
    };
    return `${styles.statusBadge} ${map[status] || ""}`;
  }

  if (authLoading || loading) return <div className={styles.loading}>Loading...</div>;
  if (!user) return <div className={styles.emptyState}>Sign in to view suggestions.</div>;

  return (
    <div className={styles.suggestionsPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Feature Suggestions</h1>
        <button className={styles.newBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "New Suggestion"}
        </button>
      </div>

      {showForm && (
        <form className={styles.createForm} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.formGroup}>
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required minLength={3} />
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={10}
              placeholder="Describe the feature you'd like to see..."
            />
          </div>
          <button className={styles.submitBtn} type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Suggestion"}
          </button>
        </form>
      )}

      <div className={styles.controls}>
        <button
          className={`${styles.sortBtn} ${sort === "votes" ? styles.sortBtnActive : ""}`}
          onClick={() => setSort("votes")}
        >
          Most Voted
        </button>
        <button
          className={`${styles.sortBtn} ${sort === "newest" ? styles.sortBtnActive : ""}`}
          onClick={() => setSort("newest")}
        >
          Newest
        </button>
      </div>

      <div className={styles.suggestionList}>
        {suggestions.length === 0 && <div className={styles.emptyState}>No suggestions yet. Be the first!</div>}
        {suggestions.map((s) => (
          <div key={s.id} className={styles.suggestionCard}>
            <div className={styles.voteBox}>
              <button
                className={`${styles.voteBtn} ${s.hasVoted ? styles.voteBtnActive : ""}`}
                onClick={() => handleVote(s.id)}
                title={s.hasVoted ? "Remove vote" : "Upvote"}
              >
                ▲
              </button>
              <span className={styles.voteCount}>{s.voteCount}</span>
            </div>
            <div className={styles.suggestionContent}>
              <div className={styles.suggestionHeader}>
                <span className={styles.suggestionTitle}>{s.title}</span>
                <span className={getStatusClass(s.status)}>{s.status.replace("_", " ")}</span>
              </div>
              <div className={styles.suggestionMeta}>
                by {s.author.username} &middot; {new Date(s.createdAt).toLocaleDateString()}
              </div>
              <div className={styles.suggestionDesc}>{s.description}</div>
              {s.adminNotes && (
                <div className={styles.adminNotesBox}>
                  <strong>Admin:</strong> {s.adminNotes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
