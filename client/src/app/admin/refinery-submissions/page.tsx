"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import shared from "../../tools/tools.module.css";

interface Submission {
  id: string;
  username: string;
  stationName: string;
  oreName: string;
  bonusPct: number;
  notes: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewedAt: string | null;
  createdAt: string;
}

export default function AdminRefinerySubmissionsPage() {
  const { user, loading: authLoading } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"PENDING" | "APPROVED" | "REJECTED" | "ALL">("PENDING");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const query = filter === "ALL" ? "" : `?status=${filter}`;
    const res = await apiFetch<Submission[]>(`/api/refinery-submissions${query}`);
    if (res.success && res.data) setSubmissions(res.data);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    if (user?.isAdmin) load();
  }, [user, load]);

  const review = async (id: string, status: "APPROVED" | "REJECTED") => {
    setBusyId(id);
    const res = await apiFetch(`/api/refinery-submissions/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    if (res.success) {
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  if (authLoading) return null;
  if (!user?.isAdmin) {
    return (
      <div className={shared.page}>
        <h1 className={shared.title}>Admin Only</h1>
        <Link href="/">Back to home</Link>
      </div>
    );
  }

  return (
    <div className={shared.page}>
      <Link href="/admin" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "1rem" }}>
        ← Admin
      </Link>
      <h1 className={shared.title}>Refinery Submissions</h1>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {(["PENDING", "APPROVED", "REJECTED", "ALL"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? shared.shipBtnActive + " " + shared.shipBtn : shared.shipBtn}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={shared.emptyMessage}>Loading...</div>
      ) : submissions.length === 0 ? (
        <div className={shared.emptyMessage}>No submissions.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {submissions.map((s) => (
            <div key={s.id} className={shared.methodCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    {s.username} · {new Date(s.createdAt).toLocaleString()}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: "1rem", margin: "0.25rem 0" }}>
                    {s.stationName} — {s.oreName}:{" "}
                    <span style={{ color: s.bonusPct > 0 ? "#4ade80" : s.bonusPct < 0 ? "#f87171" : "var(--text-secondary)" }}>
                      {s.bonusPct > 0 ? "+" : ""}{s.bonusPct}%
                    </span>
                  </div>
                  {s.notes && (
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontStyle: "italic", marginTop: "0.25rem" }}>
                      “{s.notes}”
                    </div>
                  )}
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.35rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Status: {s.status}
                    {s.reviewedAt && ` · Reviewed ${new Date(s.reviewedAt).toLocaleDateString()}`}
                  </div>
                </div>
                {s.status === "PENDING" && (
                  <div style={{ display: "flex", gap: "0.35rem" }}>
                    <button
                      disabled={busyId === s.id}
                      onClick={() => review(s.id, "APPROVED")}
                      className={shared.addBtn}
                      style={{ fontSize: "0.8rem" }}
                    >
                      Approve
                    </button>
                    <button
                      disabled={busyId === s.id}
                      onClick={() => review(s.id, "REJECTED")}
                      className={shared.removeBtn}
                      style={{ fontSize: "0.8rem" }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
