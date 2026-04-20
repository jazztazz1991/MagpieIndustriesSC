"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { refineryStations as staticStations } from "@/data/refinery";
import { ores as staticOres } from "@/data/mining";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import {
  mergeStationBonuses,
  validateSubmission,
  type ApprovedSubmission,
} from "@/domain/refineryBonuses";
import shared from "../tools.module.css";

export default function RefineryStationsPage() {
  const { user } = useAuth();
  const [approved, setApproved] = useState<ApprovedSubmission[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [stationFilter, setStationFilter] = useState("");

  // Form state
  const [formStation, setFormStation] = useState("");
  const [formOre, setFormOre] = useState("");
  const [formBonus, setFormBonus] = useState(0);
  const [formNotes, setFormNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<ApprovedSubmission[]>("/api/refinery-submissions/approved").then((res) => {
      if (res.success && res.data) setApproved(res.data);
    });
  }, []);

  const stations = useMemo(() => {
    if (!stationFilter.trim()) return staticStations;
    const q = stationFilter.toLowerCase();
    return staticStations.filter(
      (s) => s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q)
    );
  }, [stationFilter]);

  const merged = useMemo(
    () => mergeStationBonuses(staticStations, approved),
    [approved]
  );

  const allOreNames = useMemo(() => {
    const names = new Set<string>();
    staticOres.filter((o) => o.valuePerSCU > 0).forEach((o) => names.add(o.name));
    // Also include any ores that appear in existing bonuses
    for (const station of staticStations) {
      for (const ore of Object.keys(station.bonuses)) names.add(ore);
    }
    return [...names].sort();
  }, []);

  const openReport = (stationName: string, oreName = "") => {
    setFormStation(stationName);
    setFormOre(oreName);
    setFormBonus(0);
    setFormNotes("");
    setFormError(null);
    setSubmitMsg(null);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const err = validateSubmission({
      stationName: formStation,
      oreName: formOre,
      bonusPct: formBonus,
    });
    if (err) {
      setFormError(err);
      return;
    }

    setSubmitting(true);
    setFormError(null);
    const res = await apiFetch<{ id: string; status: string }>(
      "/api/refinery-submissions",
      {
        method: "POST",
        body: JSON.stringify({
          stationName: formStation,
          oreName: formOre,
          bonusPct: formBonus,
          notes: formNotes.trim() || undefined,
        }),
      }
    );
    setSubmitting(false);

    if (res.success) {
      setSubmitMsg("Submitted — pending admin review.");
      setTimeout(() => setShowModal(false), 1500);
    } else {
      setFormError(res.error || "Submission failed");
    }
  };

  return (
    <div className={shared.page}>
      <h1 className={shared.title}>Refinery Station Bonuses</h1>
      <p className={shared.subtitle}>
        Per-station yield bonuses across Stanton and Pyro. Got in-game data we&apos;re missing?
        Report it below — approved submissions override the static dataset.
      </p>

      <div className={shared.panel}>
        <input
          type="text"
          placeholder="Filter by station or location..."
          value={stationFilter}
          onChange={(e) => setStationFilter(e.target.value)}
          className={shared.input}
          style={{ width: "100%" }}
        />
      </div>

      <div className={shared.methodGrid}>
        {stations.map((station) => {
          const mergedBonuses = merged.get(station.name);
          const entries = mergedBonuses ? [...mergedBonuses.entries()].sort((a, b) => a[0].localeCompare(b[0])) : [];

          return (
            <div key={station.name} className={shared.methodCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <div>
                  <h3 style={{ margin: 0 }}>{station.name}</h3>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {station.location}
                  </div>
                </div>
                {user && (
                  <button
                    onClick={() => openReport(station.name)}
                    className={shared.shipBtn}
                    style={{ fontSize: "0.75rem" }}
                  >
                    + Report
                  </button>
                )}
              </div>

              {entries.length === 0 ? (
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                  No bonus data yet.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", marginTop: "0.5rem" }}>
                  {entries.map(([ore, { value, source }]) => (
                    <div
                      key={ore}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.25rem 0",
                        borderBottom: "1px solid var(--border)",
                        fontSize: "0.85rem",
                      }}
                    >
                      <span>
                        {ore}
                        {source === "crowd" && (
                          <span style={{ fontSize: "0.65rem", color: "#c084fc", marginLeft: "0.35rem", padding: "0 0.3rem", borderRadius: "3px", background: "rgba(192, 132, 252, 0.15)" }}>
                            crowd
                          </span>
                        )}
                      </span>
                      <span style={{ fontWeight: 600, color: value > 0 ? "#4ade80" : value < 0 ? "#f87171" : "var(--text-secondary)" }}>
                        {value > 0 ? "+" : ""}{value}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!user && (
        <div className={shared.emptyMessage} style={{ fontSize: "0.85rem" }}>
          <Link href="/auth/signin" style={{ color: "var(--accent)" }}>Sign in</Link> to report bonuses.
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={shared.panel}
            style={{ maxWidth: "420px", width: "100%" }}
          >
            <h2 className={shared.panelTitle}>Report Station Bonus</h2>

            <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Station</label>
            <select value={formStation} onChange={(e) => setFormStation(e.target.value)} className={shared.select} style={{ width: "100%", marginBottom: "0.75rem" }}>
              <option value="">Select station...</option>
              {staticStations.map((s) => (
                <option key={s.name} value={s.name}>{s.name} ({s.location})</option>
              ))}
            </select>

            <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Ore</label>
            <select value={formOre} onChange={(e) => setFormOre(e.target.value)} className={shared.select} style={{ width: "100%", marginBottom: "0.75rem" }}>
              <option value="">Select ore...</option>
              {allOreNames.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>

            <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Bonus % (-100 to 100)</label>
            <input type="number" value={formBonus} onChange={(e) => setFormBonus(parseInt(e.target.value, 10) || 0)} min={-100} max={100} className={shared.input} style={{ width: "100%", marginBottom: "0.75rem" }} />

            <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Notes (optional)</label>
            <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} rows={2} maxLength={500} className={shared.input} style={{ width: "100%", marginBottom: "0.75rem", resize: "vertical" }} placeholder="Source / screenshot / in-game date..." />

            {formError && <div style={{ color: "#f87171", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{formError}</div>}
            {submitMsg && <div style={{ color: "#4ade80", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{submitMsg}</div>}

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={handleSubmit} disabled={submitting} className={shared.addBtn}>
                {submitting ? "Submitting..." : "Submit"}
              </button>
              <button onClick={() => setShowModal(false)} className={shared.removeBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
