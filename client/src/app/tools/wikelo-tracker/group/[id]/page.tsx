"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { contracts as staticContracts } from "@/data/wikelo";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import shared from "../../../tools.module.css";

interface Material { id: string; itemName: string; required: number; collected: number; }
interface Project { id: string; name: string; displayName: string | null; contractId: string; status: string; priority: number; progress: number; materials: Material[]; }
interface Member { userId: string; username: string; joinedAt: string; }
interface Group { id: string; name: string; inviteCode: string; ownerId: string; ownerName: string; members: Member[]; projects: Project[]; }
interface LogEntry { id: string; username: string; projectName?: string; itemName: string; delta: number; newTotal: number; createdAt: string; }

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [contractSearch, setContractSearch] = useState("");
  const [selectedContractId, setSelectedContractId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [creating, setCreating] = useState(false);
  const [activeView, setActiveView] = useState<"projects" | "log">("projects");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [logLoading, setLogLoading] = useState(false);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const contracts = staticContracts;
  const activeContracts = useMemo(() => contracts.filter((c) => c.active).sort((a, b) => a.name.localeCompare(b.name)), [contracts]);
  const filteredContracts = useMemo(() => {
    if (!contractSearch.trim()) return activeContracts;
    const q = contractSearch.toLowerCase();
    return activeContracts.filter((c) =>
      c.name.toLowerCase().includes(q) || c.rewards.some((r) => r.toLowerCase().includes(q))
    );
  }, [activeContracts, contractSearch]);

  // Load group
  useEffect(() => {
    if (authLoading || !user || !id) return;
    apiFetch<Group>(`/api/wikelo/groups/${id}`).then((res) => {
      if (res.success && res.data) setGroup(res.data);
      setLoading(false);
    });
  }, [id, user, authLoading]);

  // Load log
  const loadLog = useCallback(async () => {
    setLogLoading(true);
    const res = await apiFetch<LogEntry[]>(`/api/wikelo/groups/${id}/log`);
    if (res.success && res.data) setLog(res.data);
    setLogLoading(false);
  }, [id]);

  useEffect(() => {
    if (activeView === "log" && log.length === 0) loadLog();
  }, [activeView]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLeave = async () => {
    if (!user || !group) return;
    setLeaving(true);
    const res = await apiFetch(`/api/wikelo/groups/${id}/members/${user.id}`, { method: "DELETE" });
    if (res.success) {
      router.push("/tools/wikelo-tracker");
    }
    setLeaving(false);
  };

  // Create project
  const handleCreateProject = async () => {
    if (!selectedContractId) return;
    const contract = contracts.find((c) => c.id === selectedContractId);
    if (!contract) return;
    setCreating(true);
    const res = await apiFetch<Project>(`/api/wikelo/groups/${id}/projects`, {
      method: "POST",
      body: JSON.stringify({
        contractId: contract.id,
        name: contract.name,
        displayName: projectName.trim() || undefined,
        materials: contract.requirements.map((r) => ({ itemName: r.item, required: r.quantity })),
      }),
    });
    if (res.success && res.data) {
      setGroup((prev) => prev ? { ...prev, projects: [...prev.projects, res.data!] } : prev);
      setShowCreate(false);
      setSelectedContractId("");
      setProjectName("");
    }
    setCreating(false);
  };

  // Update material
  const updateMaterial = useCallback(async (projectId: string, materialId: string, collected: number) => {
    const clamped = Math.max(0, collected);
    const res = await apiFetch<Material>(`/api/wikelo/groups/${id}/projects/${projectId}/materials/${materialId}`, {
      method: "PATCH",
      body: JSON.stringify({ collected: clamped }),
    });
    if (res.success && res.data) {
      setGroup((prev) => {
        if (!prev) return prev;
        const projects = prev.projects.map((p) => {
          if (p.id !== projectId) return p;
          const materials = p.materials.map((m) => m.id === materialId ? { ...m, collected: res.data!.collected } : m);
          const tReq = materials.reduce((s, m) => s + m.required, 0);
          const tCol = materials.reduce((s, m) => s + Math.min(m.collected, m.required), 0);
          return { ...p, materials, progress: tReq > 0 ? Math.round((tCol / tReq) * 100) : 0 };
        });
        return { ...prev, projects };
      });
    }
  }, [id]);

  // Shopping list
  const shoppingList = useMemo(() => {
    if (!group) return [];
    const inProgress = group.projects.filter((p) => p.status === "IN_PROGRESS");
    const aggregated = new Map<string, { needed: number; collected: number }>();
    const orderedNames: string[] = [];
    const seen = new Set<string>();

    for (const project of inProgress) {
      for (const mat of project.materials) {
        const existing = aggregated.get(mat.itemName) || { needed: 0, collected: 0 };
        existing.needed += mat.required;
        existing.collected += mat.collected;
        aggregated.set(mat.itemName, existing);
        if (!seen.has(mat.itemName)) { seen.add(mat.itemName); orderedNames.push(mat.itemName); }
      }
    }

    return orderedNames.map((name) => {
      const data = aggregated.get(name)!;
      return { name, needed: data.needed, collected: data.collected, remaining: Math.max(0, data.needed - data.collected) };
    });
  }, [group]);

  const totalRemaining = shoppingList.reduce((s, i) => s + i.remaining, 0);
  const totalNeeded = shoppingList.reduce((s, i) => s + i.needed, 0);
  const totalCollected = shoppingList.reduce((s, i) => s + Math.min(i.collected, i.needed), 0);
  const overallPct = totalNeeded > 0 ? Math.round((totalCollected / totalNeeded) * 100) : 100;

  if (authLoading || loading) return null;
  if (!group) return <div className={shared.page}><h1 className={shared.title}>Group Not Found</h1><Link href="/tools/wikelo-tracker">← Back</Link></div>;

  return (
    <div className={shared.page}>
      <Link href="/tools/wikelo-tracker" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "1rem" }}>
        ← Back to Tracker
      </Link>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div>
          <h1 className={shared.title} style={{ marginBottom: "0.25rem" }}>{group.name}</h1>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            {group.members.length} member{group.members.length !== 1 ? "s" : ""} · {group.projects.length} project{group.projects.length !== 1 ? "s" : ""}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Invite:</span>
          <button
            onClick={() => navigator.clipboard.writeText(group.inviteCode)}
            style={{ padding: "0.25rem 0.6rem", background: "rgba(192, 132, 252, 0.15)", border: "1px solid rgba(192, 132, 252, 0.3)", borderRadius: "4px", color: "#c084fc", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", letterSpacing: "0.05em" }}
          >
            {group.inviteCode}
          </button>
          {user && group.ownerId !== user.id && (
            <button
              onClick={() => { if (confirm(`Leave "${group.name}"?`)) handleLeave(); }}
              disabled={leaving}
              style={{ padding: "0.25rem 0.6rem", background: "rgba(248, 113, 113, 0.1)", border: "1px solid rgba(248, 113, 113, 0.25)", borderRadius: "4px", color: "#f87171", fontSize: "0.8rem", cursor: "pointer" }}
            >
              {leaving ? "Leaving..." : "Leave Group"}
            </button>
          )}
        </div>
      </div>

      {/* Members */}
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {group.members.map((m) => (
          <span key={m.userId} style={{ fontSize: "0.75rem", padding: "0.15rem 0.5rem", borderRadius: "12px", background: m.userId === group.ownerId ? "rgba(250, 204, 21, 0.15)" : "rgba(255,255,255,0.06)", color: m.userId === group.ownerId ? "#facc15" : "var(--text-secondary)" }}>
            {m.username}{m.userId === group.ownerId ? " (owner)" : ""}
          </span>
        ))}
      </div>

      {/* Shopping List */}
      {group.projects.filter((p) => p.status === "IN_PROGRESS").length > 0 && (
        <div className={shared.panel} style={{ marginBottom: "1.5rem" }}>
          <h2
            className={shared.panelTitle}
            onClick={() => setShoppingListOpen((v) => !v)}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", userSelect: "none", margin: 0 }}
          >
            <span style={{ fontSize: "0.7rem", transition: "transform 0.2s", transform: shoppingListOpen ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</span>
            Shopping List
            <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              ({totalRemaining} items remaining · {overallPct}%)
            </span>
          </h2>
          {shoppingListOpen && (
            <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {shoppingList.map((item) => {
                const pct = item.needed > 0 ? Math.round((item.collected / item.needed) * 100) : 100;
                const complete = item.remaining <= 0;
                return (
                  <div key={item.name} style={{ display: "grid", gridTemplateColumns: "1fr 80px 70px", gap: "0.5rem", alignItems: "center", padding: "0.3rem 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 500, color: complete ? "var(--text-secondary)" : "var(--text-primary)" }}>{item.name}</span>
                    <div style={{ height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: complete ? "#4ade80" : "#fb923c", borderRadius: "2px" }} />
                    </div>
                    <span style={{ fontSize: "0.8rem", textAlign: "right", color: complete ? "#4ade80" : "#fb923c", fontWeight: 600 }}>
                      {item.collected} / {item.needed}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* View toggle */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button className={activeView === "projects" ? shared.shipBtnActive + " " + shared.shipBtn : shared.shipBtn} onClick={() => setActiveView("projects")}>
          Projects
        </button>
        <button className={activeView === "log" ? shared.shipBtnActive + " " + shared.shipBtn : shared.shipBtn} onClick={() => { setActiveView("log"); }}>
          Activity Log
        </button>
      </div>

      {/* Projects view */}
      {activeView === "projects" && (
        <>
          {!showCreate ? (
            <button className={shared.addBtn} onClick={() => setShowCreate(true)} style={{ marginBottom: "1rem" }}>
              + New Project
            </button>
          ) : (
            <div className={shared.panel} style={{ marginBottom: "1rem" }}>
              <h2 className={shared.panelTitle}>New Group Project</h2>
              <input
                type="text"
                placeholder="Custom name (optional, e.g. Percy's Polaris)"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={shared.input}
                style={{ marginBottom: "0.5rem", width: "100%" }}
              />
              <input
                type="text"
                placeholder="Search contracts..."
                value={contractSearch}
                onChange={(e) => { setContractSearch(e.target.value); setSelectedContractId(""); }}
                className={shared.input}
                style={{ marginBottom: "0.5rem", width: "100%" }}
                autoFocus
              />
              <div style={{ maxHeight: "250px", overflowY: "auto", marginBottom: "0.5rem", border: "1px solid var(--border)", borderRadius: "6px" }}>
                {filteredContracts.map((c) => (
                  <div key={c.id} onClick={() => setSelectedContractId(c.id)} style={{
                    padding: "0.5rem 0.75rem", cursor: "pointer", borderBottom: "1px solid var(--border)",
                    background: selectedContractId === c.id ? "rgba(74, 158, 255, 0.1)" : "transparent",
                    borderLeft: selectedContractId === c.id ? "3px solid var(--accent)" : "3px solid transparent",
                  }}>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{c.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{c.tier} · {c.rewards.join(", ")}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className={shared.addBtn} onClick={handleCreateProject} disabled={!selectedContractId || creating}>
                  {creating ? "Creating..." : "Create"}
                </button>
                <button className={shared.removeBtn} onClick={() => { setShowCreate(false); setSelectedContractId(""); setContractSearch(""); setProjectName(""); }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {group.projects.length === 0 ? (
            <div className={shared.emptyMessage}>No projects yet. Create one to start tracking.</div>
          ) : (
            <>
            <div className={shared.methodGrid}>
              {group.projects.map((project, idx) => (
                <div
                  key={project.id}
                  className={shared.methodCard}
                  onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)", background: "var(--border)", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "0.15rem" }}>
                        {idx + 1}
                      </span>
                      <div>
                        <h3 style={{ margin: 0 }}>{project.displayName || project.name}</h3>
                        {project.displayName && <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{project.name}</span>}
                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block" }}>
                          {project.materials.length} materials
                        </span>
                      </div>
                    </div>
                    <span style={{
                      fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", padding: "0.15rem 0.5rem", borderRadius: "4px",
                      background: project.status === "COMPLETED" ? "rgba(74,222,128,0.15)" : project.status === "ABANDONED" ? "rgba(248,113,113,0.15)" : "rgba(74,158,255,0.15)",
                      color: project.status === "COMPLETED" ? "#4ade80" : project.status === "ABANDONED" ? "#f87171" : "var(--accent)",
                    }}>
                      {project.status.replace("_", " ")}
                    </span>
                  </div>

                  <div style={{ marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                      <span style={{ color: "var(--text-secondary)" }}>Progress</span>
                      <span style={{ fontWeight: 600, color: project.progress === 100 ? "#4ade80" : "var(--text-primary)" }}>{project.progress}%</span>
                    </div>
                    <div style={{ height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${project.progress}%`, background: project.progress === 100 ? "#4ade80" : "var(--accent)", borderRadius: "3px", transition: "width 0.3s" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Expanded project detail */}
            {expandedProject && (() => {
              const project = group.projects.find((p) => p.id === expandedProject);
              if (!project) return null;
              return (
                <div className={shared.panel} style={{ marginTop: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <h3 style={{ margin: 0 }}>{project.displayName || project.name}</h3>
                    <button onClick={() => setExpandedProject(null)} style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: "1.2rem", cursor: "pointer" }}>&times;</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {project.materials.map((mat) => {
                      const complete = mat.collected >= mat.required;
                      return (
                        <div key={mat.id} style={{ display: "grid", gridTemplateColumns: "1fr 70px auto", gap: "0.5rem", alignItems: "center", padding: "0.25rem 0", borderBottom: "1px solid var(--border)" }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: 500, color: complete ? "var(--text-secondary)" : "var(--text-primary)" }}>
                            {mat.itemName}
                          </span>
                          <span style={{ fontSize: "0.8rem", textAlign: "right", color: complete ? "#4ade80" : "#fb923c", fontWeight: 600 }}>
                            {mat.collected}/{mat.required}
                          </span>
                          <div style={{ display: "flex", gap: "0.2rem" }} onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => updateMaterial(project.id, mat.id, mat.collected - 1)} style={{ width: "24px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>-</button>
                            <button onClick={() => updateMaterial(project.id, mat.id, mat.collected + 1)} style={{ width: "24px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                            <button onClick={() => updateMaterial(project.id, mat.id, mat.collected + 5)} style={{ width: "28px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+5</button>
                            <button onClick={() => updateMaterial(project.id, mat.id, mat.collected + 10)} style={{ width: "32px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+10</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
            </>
          )}
        </>
      )}

      {/* Activity Log view */}
      {activeView === "log" && (
        <div className={shared.panel}>
          <h2 className={shared.panelTitle}>Activity Log</h2>
          {logLoading ? (
            <div className={shared.emptyMessage}>Loading...</div>
          ) : log.length === 0 ? (
            <div className={shared.emptyMessage}>No activity yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {log.map((entry) => (
                <div key={entry.id} style={{ padding: "0.4rem 0", borderBottom: "1px solid var(--border)", fontSize: "0.85rem" }}>
                  <span style={{ fontWeight: 600, color: "var(--accent)" }}>{entry.username}</span>
                  <span style={{ color: entry.delta > 0 ? "#4ade80" : "#f87171" }}>
                    {" "}{entry.delta > 0 ? "+" : ""}{entry.delta}
                  </span>
                  <span> {entry.itemName}</span>
                  {entry.projectName && <span style={{ color: "var(--text-secondary)" }}> on {entry.projectName}</span>}
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginLeft: "0.5rem" }}>
                    → {entry.newTotal} total
                  </span>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.7rem", float: "right" }}>
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
