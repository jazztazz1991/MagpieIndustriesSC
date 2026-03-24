"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import styles from "./reports.module.css";

interface ReportItem {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  pageUrl: string | null;
  adminNotes: string | null;
  createdAt: string;
  author: { id: string; username: string };
}

export default function ReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"BUG" | "DATA_ISSUE">("BUG");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    fetchReports();
  }, [authLoading, user]);

  async function fetchReports() {
    setLoading(true);
    const res = await apiFetch<ReportItem[]>("/api/reports");
    if (res.success && res.data) setReports(res.data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await apiFetch<ReportItem>("/api/reports", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        type,
        pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
      }),
    });

    if (res.success) {
      setTitle("");
      setDescription("");
      setType("BUG");
      setShowForm(false);
      fetchReports();
    } else {
      setError(res.error || "Failed to submit report");
    }
    setSubmitting(false);
  }

  function getStatusClass(status: string) {
    const map: Record<string, string> = {
      OPEN: styles.statusOpen,
      IN_PROGRESS: styles.statusInProgress,
      RESOLVED: styles.statusResolved,
      CLOSED: styles.statusClosed,
    };
    return `${styles.statusBadge} ${map[status] || ""}`;
  }

  if (authLoading || loading) return <div className={styles.loading}>Loading...</div>;
  if (!user) return <div className={styles.emptyState}>Sign in to view reports.</div>;

  return (
    <div className={styles.reportsPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Bug Reports & Issues</h1>
        <button className={styles.newBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "New Report"}
        </button>
      </div>

      {showForm && (
        <form className={styles.createForm} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required minLength={3} />
            </div>
            <div className={styles.formGroup}>
              <label>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as "BUG" | "DATA_ISSUE")}>
                <option value="BUG">Bug</option>
                <option value="DATA_ISSUE">Data Issue</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={10}
              placeholder="Describe the issue in detail..."
            />
          </div>
          <button className={styles.submitBtn} type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      )}

      <div className={styles.reportList}>
        {reports.length === 0 && <div className={styles.emptyState}>No reports yet.</div>}
        {reports.map((r) => (
          <div key={r.id} className={styles.reportCard}>
            <div className={styles.reportHeader}>
              <span>
                <span className={styles.reportTitle}>{r.title}</span>
                <span className={styles.reportTypeBadge}>{r.type.replace("_", " ")}</span>
              </span>
              <span className={getStatusClass(r.status)}>{r.status.replace("_", " ")}</span>
            </div>
            <div className={styles.reportMeta}>
              {new Date(r.createdAt).toLocaleDateString()}
            </div>
            <div className={styles.reportDesc}>{r.description}</div>
            {r.adminNotes && (
              <div className={styles.adminNotesBox}>
                <strong>Admin:</strong> {r.adminNotes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
