"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { contracts as staticContracts } from "@/data/wikelo";
import { useWithOverrides } from "@/hooks/useOverrides";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import shared from "../tools.module.css";

interface ProjectMaterial {
  id: string;
  itemName: string;
  required: number;
  collected: number;
}

interface ProjectSummary {
  id: string;
  contractId: string;
  name: string;
  status: string;
  progress: number;
  materialCount: number;
  materials: ProjectMaterial[];
  createdAt: string;
  updatedAt: string;
}

export default function WikeloTrackerPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: contracts } = useWithOverrides("wikelo_contract", staticContracts, (c) => c.id);

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState("");
  const [contractSearch, setContractSearch] = useState("");
  const [creating, setCreating] = useState(false);

  const activeContracts = useMemo(
    () => contracts.filter((c) => c.active).sort((a, b) => a.name.localeCompare(b.name)),
    [contracts]
  );

  const filteredContracts = useMemo(() => {
    if (!contractSearch.trim()) return activeContracts;
    const q = contractSearch.toLowerCase();
    return activeContracts.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.rewards.some((r) => r.toLowerCase().includes(q)) ||
      c.tier.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  }, [activeContracts, contractSearch]);

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
          <input
            type="text"
            placeholder="Search contracts by name, reward, tier..."
            value={contractSearch}
            onChange={(e) => { setContractSearch(e.target.value); setSelectedContractId(""); }}
            className={shared.input}
            style={{ marginBottom: "0.75rem", width: "100%" }}
            autoFocus
          />
          <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "0.75rem", border: "1px solid var(--border)", borderRadius: "6px" }}>
            {filteredContracts.length === 0 ? (
              <div style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.85rem", textAlign: "center" }}>
                No contracts match &quot;{contractSearch}&quot;
              </div>
            ) : (
              filteredContracts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedContractId(c.id)}
                  style={{
                    padding: "0.6rem 0.75rem",
                    cursor: "pointer",
                    borderBottom: "1px solid var(--border)",
                    background: selectedContractId === c.id ? "rgba(74, 158, 255, 0.1)" : "transparent",
                    borderLeft: selectedContractId === c.id ? "3px solid var(--accent)" : "3px solid transparent",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                    {c.tier} · {c.category} · Reward: {c.rewards.join(", ")}
                  </div>
                </div>
              ))
            )}
          </div>
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
              onClick={() => { setShowCreate(false); setSelectedContractId(""); setContractSearch(""); }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Shopping List — aggregate remaining materials across all in-progress projects */}
      {!loading && projects.filter((p) => p.status === "IN_PROGRESS").length > 1 && (() => {
        const inProgress = projects.filter((p) => p.status === "IN_PROGRESS");

        // Build aggregation with references to source materials for updating
        const aggregated = new Map<string, {
          needed: number;
          collected: number;
          sources: { projectId: string; materialId: string; required: number; collected: number }[];
        }>();

        for (const project of inProgress) {
          for (const mat of project.materials) {
            const existing = aggregated.get(mat.itemName) || { needed: 0, collected: 0, sources: [] };
            existing.needed += mat.required;
            existing.collected += mat.collected;
            existing.sources.push({
              projectId: project.id,
              materialId: mat.id,
              required: mat.required,
              collected: mat.collected,
            });
            aggregated.set(mat.itemName, existing);
          }
        }

        // Use first project's material order as base, then append extras
        const seenNames = new Set<string>();
        const orderedNames: string[] = [];
        for (const project of inProgress) {
          for (const mat of project.materials) {
            if (!seenNames.has(mat.itemName)) {
              seenNames.add(mat.itemName);
              orderedNames.push(mat.itemName);
            }
          }
        }

        const items = orderedNames
          .map((name) => {
            const data = aggregated.get(name)!;
            return {
              name,
              needed: data.needed,
              collected: data.collected,
              remaining: Math.max(0, data.needed - data.collected),
              sources: data.sources,
            };
          });

        const totalRemaining = items.reduce((s, i) => s + i.remaining, 0);
        const totalNeeded = [...aggregated.values()].reduce((s, v) => s + v.needed, 0);
        const totalCollected = [...aggregated.values()].reduce((s, v) => s + Math.min(v.collected, v.needed), 0);
        const overallPct = totalNeeded > 0 ? Math.round((totalCollected / totalNeeded) * 100) : 100;

        // Update a shopping list item: distribute to the first source that still needs it
        const updateShoppingItem = async (itemName: string, delta: number) => {
          const data = aggregated.get(itemName);
          if (!data) return;

          // Find the first source material that can accept this change
          let target = delta > 0
            ? data.sources.find((s) => s.collected < s.required)  // add to first incomplete
            : data.sources.find((s) => s.collected > 0);          // remove from first with stock

          if (!target) target = data.sources[0];
          if (!target) return;

          const newCollected = Math.max(0, target.collected + delta);
          const res = await apiFetch<ProjectMaterial>(
            `/api/wikelo/projects/${target.projectId}/materials/${target.materialId}`,
            { method: "PATCH", body: JSON.stringify({ collected: newCollected }) }
          );

          if (res.success && res.data) {
            // Update local state
            setProjects((prev) => prev.map((p) => {
              if (p.id !== target!.projectId) return p;
              const materials = p.materials.map((m) =>
                m.id === target!.materialId ? { ...m, collected: res.data!.collected } : m
              );
              const tReq = materials.reduce((s, m) => s + m.required, 0);
              const tCol = materials.reduce((s, m) => s + Math.min(m.collected, m.required), 0);
              return { ...p, materials, progress: tReq > 0 ? Math.round((tCol / tReq) * 100) : 0 };
            }));
          }
        };

        return (
          <div className={shared.panel} style={{ marginBottom: "1.5rem" }}>
            <h2
              className={shared.panelTitle}
              onClick={() => setShoppingListOpen((v) => !v)}
              style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", userSelect: "none" }}
            >
              <span style={{ fontSize: "0.7rem", transition: "transform 0.2s", transform: shoppingListOpen ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</span>
              Shopping List
              <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                ({inProgress.length} active projects · {totalRemaining} items remaining · {overallPct}%)
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const lines = [`**Shopping List** (${inProgress.length} active projects)`, `Overall: ${overallPct}% — ${totalRemaining} items remaining`, ""];
                  items.forEach((item) => {
                    const check = item.remaining <= 0 ? "x" : " ";
                    lines.push(`- [${check}] ${item.name}: ${item.collected} / ${item.needed}`);
                  });
                  navigator.clipboard.writeText(lines.join("\n")).then(() => {
                    const btn = e.target as HTMLButtonElement;
                    const orig = btn.textContent;
                    btn.textContent = "Copied!";
                    setTimeout(() => { btn.textContent = orig; }, 2000);
                  });
                }}
                style={{ marginLeft: "auto", padding: "0.2rem 0.5rem", fontSize: "0.7rem", background: "rgba(88, 101, 242, 0.15)", border: "1px solid rgba(88, 101, 242, 0.3)", borderRadius: "4px", color: "#5865F2", cursor: "pointer" }}
              >
                Copy for Discord
              </button>
            </h2>

            {shoppingListOpen && (<>
            {/* Overall progress */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
              <span style={{ color: "var(--text-secondary)" }}>Overall</span>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                {overallPct}% — {totalRemaining} items remaining
              </span>
            </div>
            <div style={{ height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden", marginBottom: "1rem" }}>
              <div style={{ height: "100%", width: `${overallPct}%`, background: "var(--accent)", borderRadius: "3px" }} />
            </div>

            {/* Material rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {items.map((item) => {
                const pct = item.needed > 0 ? Math.round((item.collected / item.needed) * 100) : 100;
                const complete = item.remaining <= 0;
                return (
                  <div key={item.name} style={{ display: "grid", gridTemplateColumns: "1fr 80px 70px auto", gap: "0.5rem", alignItems: "center", padding: "0.4rem 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 500, color: complete ? "var(--text-secondary)" : "var(--text-primary)" }}>{item.name}</span>
                    <div style={{ height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: complete ? "#4ade80" : "#fb923c", borderRadius: "2px" }} />
                    </div>
                    <span style={{ fontSize: "0.8rem", textAlign: "right", color: complete ? "#4ade80" : "#fb923c", fontWeight: 600 }}>
                      {item.collected} / {item.needed}
                    </span>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button
                        onClick={() => updateShoppingItem(item.name, -1)}
                        style={{ width: "24px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-primary)", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >-</button>
                      <button
                        onClick={() => updateShoppingItem(item.name, 1)}
                        style={{ width: "24px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-primary)", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >+</button>
                    </div>
                  </div>
                );
              })}
            </div>
            </>)}
          </div>
        );
      })()}

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
