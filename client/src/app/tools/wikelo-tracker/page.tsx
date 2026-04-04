"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { contracts as staticContracts } from "@/data/wikelo";
import { useWithOverrides } from "@/hooks/useOverrides";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import shared from "../tools.module.css";

interface ProjectSummary {
  id: string;
  contractId: string;
  name: string;
  status: string;
  progress: number;
  materialCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function WikeloTrackerPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: contracts } = useWithOverrides("wikelo_contract", staticContracts, (c) => c.id);

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState("");
  const [creating, setCreating] = useState(false);

  const activeContracts = useMemo(
    () => contracts.filter((c) => c.active).sort((a, b) => a.name.localeCompare(b.name)),
    [contracts]
  );

  // Load projects
  useEffect(() => {
    if (authLoading || !user) return;
    apiFetch<ProjectSummary[]>("/api/wikelo/projects").then((res) => {
      if (res.success && res.data) setProjects(res.data);
      setLoading(false);
    });
  }, [user, authLoading]);

  // Create project
  const handleCreate = async () => {
    if (!selectedContractId) return;
    const contract = contracts.find((c) => c.id === selectedContractId);
    if (!contract) return;

    setCreating(true);
    const res = await apiFetch<ProjectSummary>("/api/wikelo/projects", {
      method: "POST",
      body: JSON.stringify({
        contractId: contract.id,
        name: contract.name,
        materials: contract.requirements.map((r) => ({
          itemName: r.item,
          required: r.quantity,
        })),
      }),
    });

    if (res.success && res.data) {
      setProjects((prev) => [res.data!, ...prev]);
      setShowCreate(false);
      setSelectedContractId("");
    }
    setCreating(false);
  };

  // Delete project
  const handleDelete = async (id: string) => {
    const res = await apiFetch(`/api/wikelo/projects/${id}`, { method: "DELETE" });
    if (res.success) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (authLoading) return null;

  if (!user) {
    return (
      <div className={shared.page}>
        <h1 className={shared.title}>Wikelo Contract Tracker</h1>
        <p className={shared.subtitle}>Sign in to track your Wikelo contract progress.</p>
        <Link href="/auth/signin" className={shared.addBtn}>Sign In</Link>
      </div>
    );
  }

  return (
    <div className={shared.page}>
      <h1 className={shared.title}>Wikelo Contract Tracker</h1>
      <p className={shared.subtitle}>
        Create projects to track material collection for Wikelo contracts.
      </p>

      {/* Create new project */}
      {!showCreate ? (
        <button
          className={shared.addBtn}
          onClick={() => setShowCreate(true)}
          style={{ marginBottom: "1.5rem" }}
        >
          + New Project
        </button>
      ) : (
        <div className={shared.panel} style={{ marginBottom: "1.5rem" }}>
          <h2 className={shared.panelTitle}>New Project</h2>
          <select
            value={selectedContractId}
            onChange={(e) => setSelectedContractId(e.target.value)}
            className={shared.select}
            style={{ marginBottom: "0.75rem", width: "100%" }}
          >
            <option value="">-- Select a contract --</option>
            {activeContracts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.tier}) — {c.rewards.join(", ")}
              </option>
            ))}
          </select>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className={shared.addBtn}
              onClick={handleCreate}
              disabled={!selectedContractId || creating}
            >
              {creating ? "Creating..." : "Create Project"}
            </button>
            <button
              className={shared.removeBtn}
              onClick={() => { setShowCreate(false); setSelectedContractId(""); }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Project list */}
      {loading ? (
        <div className={shared.emptyMessage}>Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className={shared.emptyMessage}>
          No projects yet. Create one to start tracking materials.
        </div>
      ) : (
        <div className={shared.methodGrid}>
          {projects.map((project) => (
            <div key={project.id} className={shared.methodCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <div>
                  <h3 style={{ margin: 0 }}>
                    <Link
                      href={`/tools/wikelo-tracker/${project.id}`}
                      style={{ color: "var(--accent)", textDecoration: "none" }}
                    >
                      {project.name}
                    </Link>
                  </h3>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {project.materialCount} materials
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    padding: "0.15rem 0.5rem",
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
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Progress</span>
                  <span style={{ fontWeight: 600, color: project.progress === 100 ? "#4ade80" : "var(--text-primary)" }}>
                    {project.progress}%
                  </span>
                </div>
                <div style={{ height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${project.progress}%`,
                      background: project.progress === 100 ? "#4ade80" : "var(--accent)",
                      borderRadius: "3px",
                      transition: "width 0.3s",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Link
                  href={`/tools/wikelo-tracker/${project.id}`}
                  style={{ fontSize: "0.8rem", color: "var(--accent)" }}
                >
                  View Details →
                </Link>
                <button
                  onClick={() => handleDelete(project.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-secondary)",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
