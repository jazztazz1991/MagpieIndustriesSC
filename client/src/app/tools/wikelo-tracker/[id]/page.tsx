"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { contracts as staticContracts } from "@/data/wikelo";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { naturalCompare } from "@/lib/sort";
import shared from "../../tools.module.css";

interface Material {
  id: string;
  itemName: string;
  required: number;
  collected: number;
}

interface Project {
  id: string;
  contractId: string;
  name: string;
  status: string;
  progress: number;
  materialCount: number;
  materials: Material[];
  createdAt: string;
  updatedAt: string;
}

export default function WikeloProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Find the contract definition for tier info
  const contract = staticContracts.find((c) => c.id === project?.contractId);

  useEffect(() => {
    if (authLoading || !user || !id) return;
    apiFetch<Project>(`/api/wikelo/projects/${id}`).then((res) => {
      if (res.success && res.data) setProject(res.data);
      setLoading(false);
    });
  }, [id, user, authLoading]);

  const updateMaterial = useCallback(async (materialId: string, collected: number) => {
    const clamped = Math.max(0, collected);
    const res = await apiFetch<Material>(`/api/wikelo/projects/${id}/materials/${materialId}`, {
      method: "PATCH",
      body: JSON.stringify({ collected: clamped }),
    });

    if (res.success && res.data) {
      setProject((prev) => {
        if (!prev) return prev;
        const materials = prev.materials.map((m) =>
          m.id === materialId ? { ...m, collected: res.data!.collected } : m
        );
        const totalRequired = materials.reduce((s, m) => s + m.required, 0);
        const totalCollected = materials.reduce((s, m) => s + Math.min(m.collected, m.required), 0);
        const progress = totalRequired > 0 ? Math.round((totalCollected / totalRequired) * 100) : 0;
        return { ...prev, materials, progress };
      });
    }
  }, [id]);

  const updateStatus = useCallback(async (status: string) => {
    const res = await apiFetch<Project>(`/api/wikelo/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (res.success && res.data) setProject(res.data);
  }, [id]);

  const handleDelete = useCallback(async () => {
    const res = await apiFetch(`/api/wikelo/projects/${id}`, { method: "DELETE" });
    if (res.success) router.push("/tools/wikelo-tracker");
  }, [id, router]);

  if (authLoading || loading) return null;

  if (!project) {
    return (
      <div className={shared.page}>
        <h1 className={shared.title}>Project Not Found</h1>
        <Link href="/tools/wikelo-tracker">← Back to Projects</Link>
      </div>
    );
  }

  const isComplete = project.progress === 100;

  return (
    <div className={shared.page}>
      {/* Header */}
      <Link href="/tools/wikelo-tracker" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "1rem" }}>
        ← Back to Projects
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <h1 className={shared.title} style={{ marginBottom: 0 }}>{project.name}</h1>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              padding: "0.25rem 0.75rem",
              borderRadius: "4px",
              background: project.status === "COMPLETED"
                ? "rgba(74, 222, 128, 0.15)"
                : project.status === "ABANDONED"
                ? "rgba(248, 113, 113, 0.15)"
                : "rgba(74, 158, 255, 0.15)",
              color: project.status === "COMPLETED"
                ? "#4ade80"
                : project.status === "ABANDONED"
                ? "#f87171"
                : "var(--accent)",
            }}
          >
            {project.status.replace("_", " ")}
          </span>
          <button
            onClick={handleDelete}
            style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "1.2rem" }}
            title="Delete project"
          >
            🗑
          </button>
        </div>
      </div>

      {/* Reputation gate */}
      {contract?.tier && contract.tier !== "New Customer" && (
        <div style={{
          padding: "0.75rem 1rem",
          background: "rgba(74, 222, 128, 0.08)",
          border: "1px solid rgba(74, 222, 128, 0.25)",
          borderRadius: "8px",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}>
          <span style={{ color: "#4ade80", fontSize: "1.1rem" }}>✓</span>
          <div>
            <div style={{ fontWeight: 600, color: "#4ade80", fontSize: "0.9rem" }}>
              {contract.tier} Required
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              This contract requires {contract.tier === "Very Best Customer" ? "999+" : "50+"} Wikelo reputation ({contract.tier} tier) to complete.
            </div>
          </div>
        </div>
      )}

      {/* Overall progress */}
      <div className={shared.panel} style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Overall Progress</span>
          <div style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
            <span style={{ fontSize: "1.5rem", fontWeight: 700, color: isComplete ? "#4ade80" : "var(--accent)" }}>
              {project.progress}%
            </span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              {project.materials.length} Materials
            </span>
          </div>
        </div>
        <div style={{ height: "8px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${project.progress}%`,
              background: isComplete ? "#4ade80" : "var(--accent)",
              borderRadius: "4px",
              transition: "width 0.3s",
            }}
          />
        </div>
      </div>

      {/* Status actions */}
      {project.status === "IN_PROGRESS" && (
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {isComplete && (
            <button
              className={shared.addBtn}
              style={{ background: "rgba(74, 222, 128, 0.15)", color: "#4ade80", border: "1px solid rgba(74, 222, 128, 0.3)" }}
              onClick={() => updateStatus("COMPLETED")}
            >
              Mark Complete
            </button>
          )}
          <button
            style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-secondary)", padding: "0.4rem 0.75rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}
            onClick={() => updateStatus("ABANDONED")}
          >
            Abandon
          </button>
        </div>
      )}
      {project.status !== "IN_PROGRESS" && (
        <button
          className={shared.addBtn}
          style={{ marginBottom: "1.5rem" }}
          onClick={() => updateStatus("IN_PROGRESS")}
        >
          Resume Project
        </button>
      )}

      {/* Required Materials */}
      <div className={shared.panel}>
        <h2 className={shared.panelTitle}>Required Materials</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[...project.materials].sort((a, b) => naturalCompare(a.itemName, b.itemName)).map((mat) => {
            const pct = mat.required > 0 ? Math.min(100, Math.round((mat.collected / mat.required) * 100)) : 100;
            const complete = mat.collected >= mat.required;

            return (
              <div
                key={mat.id}
                style={{
                  padding: "0.75rem 1rem",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>
                    {mat.itemName}
                  </span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: complete ? "#4ade80" : "var(--text-primary)" }}>
                    {mat.collected} / {mat.required}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden", marginBottom: "0.5rem" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: complete ? "#4ade80" : "#fb923c",
                      borderRadius: "3px",
                      transition: "width 0.2s",
                    }}
                  />
                </div>

                {/* Controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
                  <button
                    onClick={() => updateMaterial(mat.id, mat.collected - 10)}
                    style={{
                      width: "32px", height: "28px",
                      background: "var(--border)", border: "none", borderRadius: "4px",
                      color: "var(--text-secondary)", fontSize: "0.7rem", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    -10
                  </button>
                  <button
                    onClick={() => updateMaterial(mat.id, mat.collected - 5)}
                    style={{
                      width: "28px", height: "28px",
                      background: "var(--border)", border: "none", borderRadius: "4px",
                      color: "var(--text-secondary)", fontSize: "0.7rem", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    -5
                  </button>
                  <button
                    onClick={() => updateMaterial(mat.id, mat.collected - 1)}
                    style={{
                      width: "28px", height: "28px",
                      background: "var(--border)", border: "none", borderRadius: "4px",
                      color: "var(--text-primary)", fontSize: "1rem", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={mat.collected}
                    onChange={(e) => updateMaterial(mat.id, parseInt(e.target.value, 10) || 0)}
                    min={0}
                    style={{
                      width: "60px", padding: "0.25rem 0.4rem",
                      background: "var(--bg-secondary)", border: "1px solid var(--border)",
                      borderRadius: "4px", color: "var(--text-primary)",
                      textAlign: "center", fontSize: "0.85rem",
                    }}
                  />
                  <button
                    onClick={() => updateMaterial(mat.id, mat.collected + 1)}
                    style={{
                      width: "28px", height: "28px",
                      background: "var(--border)", border: "none", borderRadius: "4px",
                      color: "var(--text-primary)", fontSize: "1rem", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => updateMaterial(mat.id, mat.collected + 5)}
                    style={{
                      width: "28px", height: "28px",
                      background: "var(--border)", border: "none", borderRadius: "4px",
                      color: "var(--text-secondary)", fontSize: "0.7rem", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    +5
                  </button>
                  <button
                    onClick={() => updateMaterial(mat.id, mat.collected + 10)}
                    style={{
                      width: "32px", height: "28px",
                      background: "var(--border)", border: "none", borderRadius: "4px",
                      color: "var(--text-secondary)", fontSize: "0.7rem", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    +10
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rewards */}
      {contract && (
        <div className={shared.panel} style={{ marginTop: "1.5rem" }}>
          <h2 className={shared.panelTitle}>Rewards</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {contract.rewards.map((reward, i) => (
              <span
                key={i}
                style={{
                  padding: "0.3rem 0.75rem",
                  background: "rgba(250, 204, 21, 0.1)",
                  color: "#facc15",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                {reward}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
