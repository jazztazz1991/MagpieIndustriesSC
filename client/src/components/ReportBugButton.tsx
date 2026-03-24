"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export default function ReportBugButton() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"BUG" | "DATA_ISSUE">("BUG");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!user) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await apiFetch("/api/reports", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        type,
        pageUrl: window.location.href,
      }),
    });
    setSubmitting(false);
    if (res.success) {
      setDone(true);
      setTimeout(() => { setOpen(false); setDone(false); setTitle(""); setDescription(""); setType("BUG"); }, 1500);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "var(--accent, #4a9eff)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: "1.2rem",
          fontWeight: 700,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Report a bug"
      >
        !
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bg-secondary, #12121a)",
              border: "1px solid var(--border, #1e1e2e)",
              borderRadius: "8px",
              padding: "1.5rem",
              width: "90%",
              maxWidth: "420px",
            }}
          >
            {done ? (
              <div style={{ textAlign: "center", color: "var(--accent)", padding: "1rem" }}>
                Report submitted. Thank you!
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ margin: "0 0 1rem", color: "var(--text-primary, #e0e0e8)" }}>Report a Bug</h3>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as "BUG" | "DATA_ISSUE")}
                    style={{ width: "100%", padding: "0.4rem", background: "var(--bg-primary, #0a0a12)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--text-primary)" }}
                  >
                    <option value="BUG">Bug</option>
                    <option value="DATA_ISSUE">Data Issue</option>
                  </select>
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    minLength={3}
                    style={{ width: "100%", padding: "0.4rem", background: "var(--bg-primary, #0a0a12)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--text-primary)" }}
                  />
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    minLength={10}
                    rows={3}
                    style={{ width: "100%", padding: "0.4rem", background: "var(--bg-primary, #0a0a12)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--text-primary)", resize: "vertical" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{ padding: "0.5rem 1rem", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: 600 }}
                  >
                    {submitting ? "Sending..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    style={{ padding: "0.5rem 1rem", background: "none", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
