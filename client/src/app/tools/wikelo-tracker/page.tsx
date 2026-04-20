"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { contracts as staticContracts } from "@/data/wikelo";
import { useWithOverrides } from "@/hooks/useOverrides";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { naturalCompare } from "@/lib/sort";
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
  displayName: string | null;
  status: string;
  groupId: string | null;
  priority: number;
  progress: number;
  materialCount: number;
  materials: ProjectMaterial[];
  createdAt: string;
  updatedAt: string;
}

export default function WikeloTrackerPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: contracts } = useWithOverrides("wikelo_contract", staticContracts, (c) => c.id);

  const [activeTab, setActiveTab] = useState<"personal" | "shared">("personal");
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);

  // Group state
  interface GroupProject {
    id: string;
    name: string;
    displayName: string | null;
    status: string;
    progress: number;
    materialCount: number;
  }
  interface GroupSummary {
    id: string;
    name: string;
    inviteCode: string;
    ownerId: string;
    ownerName: string;
    memberCount: number;
    projectCount: number;
    projects: GroupProject[];
  }
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
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

  // Drag reorder
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const handleDragStart = (idx: number) => setDragIdx(idx);

  const handleDrop = async (dropIdx: number) => {
    if (dragIdx === null || dragIdx === dropIdx) { setDragIdx(null); return; }
    const reordered = [...projects];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(dropIdx, 0, moved);
    setProjects(reordered);
    setDragIdx(null);

    // Save new order to server
    await apiFetch("/api/wikelo/projects/reorder", {
      method: "POST",
      body: JSON.stringify({ projectIds: reordered.map((p) => p.id) }),
    });
  };

  // Delete project
  const handleDelete = async (id: string) => {
    const res = await apiFetch(`/api/wikelo/projects/${id}`, { method: "DELETE" });
    if (res.success) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Load groups when switching to shared tab
  const loadGroups = useCallback(async () => {
    setGroupsLoading(true);
    const res = await apiFetch<GroupSummary[]>("/api/wikelo/groups");
    if (res.success && res.data) setGroups(res.data);
    setGroupsLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === "shared" && user && groups.length === 0) {
      loadGroups();
    }
  }, [activeTab, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    const res = await apiFetch<GroupSummary>("/api/wikelo/groups", {
      method: "POST",
      body: JSON.stringify({ name: newGroupName }),
    });
    if (res.success && res.data) {
      setGroups((prev) => [res.data!, ...prev]);
      setShowCreateGroup(false);
      setNewGroupName("");
    }
  };

  const handleJoinGroup = async () => {
    if (!joinCode.trim()) return;
    const res = await apiFetch<{ groupId: string; groupName?: string }>("/api/wikelo/groups/join", {
      method: "POST",
      body: JSON.stringify({ inviteCode: joinCode.trim() }),
    });
    if (res.success) {
      setJoinCode("");
      loadGroups(); // refresh list
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!user) return;
    const res = await apiFetch(`/api/wikelo/groups/${groupId}/members/${user.id}`, { method: "DELETE" });
    if (res.success) {
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
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
        Track material collection for Wikelo contracts — personal or with your group.
      </p>

      {/* Tab toggle */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button
          className={activeTab === "personal" ? shared.shipBtnActive + " " + shared.shipBtn : shared.shipBtn}
          onClick={() => setActiveTab("personal")}
        >
          Personal
        </button>
        <button
          className={activeTab === "shared" ? shared.shipBtnActive + " " + shared.shipBtn : shared.shipBtn}
          onClick={() => setActiveTab("shared")}
        >
          Shared Groups
        </button>
      </div>

      {/* ========== SHARED GROUPS TAB ========== */}
      {activeTab === "shared" && (
        <>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            {!showCreateGroup ? (
              <button className={shared.addBtn} onClick={() => setShowCreateGroup(true)}>
                + Create Group
              </button>
            ) : (
              <div className={shared.panel} style={{ width: "100%", marginBottom: "0.5rem" }}>
                <h2 className={shared.panelTitle}>New Group</h2>
                <input
                  type="text"
                  placeholder="Group name (e.g., Magpie Miners)"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className={shared.input}
                  style={{ marginBottom: "0.5rem", width: "100%" }}
                  autoFocus
                />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className={shared.addBtn} onClick={handleCreateGroup} disabled={!newGroupName.trim()}>
                    Create
                  </button>
                  <button className={shared.removeBtn} onClick={() => { setShowCreateGroup(false); setNewGroupName(""); }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Enter invite code..."
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className={shared.input}
                style={{ width: "160px" }}
              />
              <button
                className={shared.addBtn}
                onClick={handleJoinGroup}
                disabled={!joinCode.trim()}
              >
                Join
              </button>
            </div>
          </div>

          {groupsLoading ? (
            <div className={shared.emptyMessage}>Loading groups...</div>
          ) : groups.length === 0 ? (
            <div className={shared.emptyMessage}>
              No groups yet. Create one or join with an invite code.
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.id} style={{ marginBottom: "2rem" }}>
                {/* Group header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <div>
                    <Link
                      href={`/tools/wikelo-tracker/group/${group.id}`}
                      style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", textDecoration: "none" }}
                    >
                      {group.name}
                    </Link>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginLeft: "0.75rem" }}>
                      {group.memberCount} member{group.memberCount !== 1 ? "s" : ""} · Owner: {group.ownerName}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <button
                      onClick={() => navigator.clipboard.writeText(group.inviteCode)}
                      style={{ padding: "0.15rem 0.5rem", fontSize: "0.7rem", background: "rgba(192, 132, 252, 0.15)", border: "1px solid rgba(192, 132, 252, 0.3)", borderRadius: "4px", color: "#c084fc", cursor: "pointer", fontWeight: 600 }}
                    >
                      {group.inviteCode}
                    </button>
                    <Link href={`/tools/wikelo-tracker/group/${group.id}`} style={{ fontSize: "0.8rem", color: "var(--accent)" }}>
                      Manage →
                    </Link>
                    {user && group.ownerId !== user.id && (
                      <button
                        onClick={() => { if (confirm(`Leave "${group.name}"?`)) handleLeaveGroup(group.id); }}
                        style={{ padding: "0.15rem 0.5rem", fontSize: "0.7rem", background: "rgba(248, 113, 113, 0.1)", border: "1px solid rgba(248, 113, 113, 0.25)", borderRadius: "4px", color: "#f87171", cursor: "pointer" }}
                      >
                        Leave
                      </button>
                    )}
                  </div>
                </div>

                {/* Group project cards — same grid as personal */}
                {group.projects.length === 0 ? (
                  <div className={shared.emptyMessage} style={{ fontSize: "0.85rem" }}>
                    No projects in this group yet. <Link href={`/tools/wikelo-tracker/group/${group.id}`} style={{ color: "var(--accent)" }}>Create one →</Link>
                  </div>
                ) : (
                  <div className={shared.methodGrid}>
                    {group.projects.map((project, idx) => (
                      <div key={project.id} className={shared.methodCard}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)", background: "var(--border)", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "0.15rem" }}>
                              {idx + 1}
                            </span>
                            <div>
                              <h3 style={{ margin: 0 }}>
                                <Link
                                  href={`/tools/wikelo-tracker/group/${group.id}`}
                                  style={{ color: "var(--accent)", textDecoration: "none" }}
                                >
                                  {project.displayName || project.name}
                                </Link>
                              </h3>
                              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                {project.materialCount} materials
                              </span>
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
                              padding: "0.15rem 0.5rem", borderRadius: "4px",
                              background: project.status === "COMPLETED" ? "rgba(74, 222, 128, 0.15)" : project.status === "ABANDONED" ? "rgba(248, 113, 113, 0.15)" : "rgba(74, 158, 255, 0.15)",
                              color: project.status === "COMPLETED" ? "#4ade80" : project.status === "ABANDONED" ? "#f87171" : "var(--accent)",
                            }}
                          >
                            {project.status.replace("_", " ")}
                          </span>
                        </div>

                        <div style={{ marginBottom: "0.75rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                            <span style={{ color: "var(--text-secondary)" }}>Progress</span>
                            <span style={{ fontWeight: 600, color: project.progress === 100 ? "#4ade80" : "var(--text-primary)" }}>
                              {project.progress}%
                            </span>
                          </div>
                          <div style={{ height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${project.progress}%`, background: project.progress === 100 ? "#4ade80" : "var(--accent)", borderRadius: "3px", transition: "width 0.3s" }} />
                          </div>
                        </div>

                        <Link href={`/tools/wikelo-tracker/group/${group.id}`} style={{ fontSize: "0.8rem", color: "var(--accent)" }}>
                          View Details →
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </>
      )}

      {/* ========== PERSONAL TAB ========== */}
      {activeTab === "personal" && (<>

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

        const items = Array.from(aggregated.entries())
          .map(([name, data]) => ({
            name,
            needed: data.needed,
            collected: data.collected,
            remaining: Math.max(0, data.needed - data.collected),
            sources: data.sources,
          }))
          .sort((a, b) => naturalCompare(a.name, b.name));

        const totalRemaining = items.reduce((s, i) => s + i.remaining, 0);
        const totalNeeded = [...aggregated.values()].reduce((s, v) => s + v.needed, 0);
        const totalCollected = [...aggregated.values()].reduce((s, v) => s + Math.min(v.collected, v.needed), 0);
        const overallPct = totalNeeded > 0 ? Math.round((totalCollected / totalNeeded) * 100) : 100;

        // Update a shopping list item: distribute across sources, filling each to its cap
        const updateShoppingItem = async (itemName: string, delta: number) => {
          const data = aggregated.get(itemName);
          if (!data) return;

          let remaining = delta;
          for (const source of data.sources) {
            if (remaining === 0) break;
            let toApply: number;
            if (remaining > 0) {
              const canAdd = source.required - source.collected;
              if (canAdd <= 0) continue;
              toApply = Math.min(remaining, canAdd);
              remaining -= toApply;
            } else {
              const canRemove = source.collected;
              if (canRemove <= 0) continue;
              toApply = -Math.min(Math.abs(remaining), canRemove);
              remaining -= toApply;
            }

            const res = await apiFetch<ProjectMaterial>(
              `/api/wikelo/projects/${source.projectId}/materials/${source.materialId}`,
              { method: "PATCH", body: JSON.stringify({ delta: toApply }) }
            );

            if (res.success && res.data) {
              const updated = res.data;
              setProjects((prev) => prev.map((p) => {
                if (p.id !== source.projectId) return p;
                const materials = p.materials.map((m) =>
                  m.id === source.materialId ? { ...m, collected: updated.collected } : m
                );
                const tReq = materials.reduce((s, m) => s + m.required, 0);
                const tCol = materials.reduce((s, m) => s + Math.min(m.collected, m.required), 0);
                return { ...p, materials, progress: tReq > 0 ? Math.round((tCol / tReq) * 100) : 0 };
              }));
            }
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
                  <div key={item.name} className={shared.shoppingRow}>
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

            {/* Conversion requirements — how much MG Scrip / Quantanium needed */}
            {(() => {
              const favorItem = items.find((i) => i.name === "Wikelo Favor");
              const polarisBitItem = items.find((i) => i.name === "Polaris Bit");
              const favorRemaining = favorItem?.remaining || 0;
              const bitsRemaining = polarisBitItem?.remaining || 0;

              if (favorRemaining <= 0 && bitsRemaining <= 0) return null;

              return (
                <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: "0.5rem" }}>
                    Conversion Materials Needed
                  </div>

                  {favorRemaining > 0 && (
                    <div style={{ padding: "0.5rem 0.75rem", background: "rgba(192, 132, 252, 0.06)", border: "1px solid rgba(192, 132, 252, 0.15)", borderRadius: "6px", marginBottom: "0.4rem" }}>
                      <div style={{ fontSize: "0.8rem", color: "#c084fc", fontWeight: 600, marginBottom: "0.15rem" }}>
                        MG Scrip for Favor ({favorRemaining} favors remaining)
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                        {(favorRemaining * 50).toLocaleString()} MG Scrip needed
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginLeft: "0.5rem" }}>(50 scrip = 1 favor)</span>
                      </div>
                    </div>
                  )}

                  {bitsRemaining > 0 && (
                    <div style={{ padding: "0.5rem 0.75rem", background: "rgba(250, 204, 21, 0.06)", border: "1px solid rgba(250, 204, 21, 0.15)", borderRadius: "6px" }}>
                      <div style={{ fontSize: "0.8rem", color: "#facc15", fontWeight: 600, marginBottom: "0.15rem" }}>
                        Quantanium for Polaris Bits ({bitsRemaining} bits remaining)
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                        {(bitsRemaining * 24).toLocaleString()} SCU Quantanium needed
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginLeft: "0.5rem" }}>(24 SCU = 1 bit)</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
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
        <>
        <div className={shared.hideMobile} style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
          Drag to reorder — items fill first project first
        </div>
        <div className={shared.methodGrid}>
          {projects.map((project, idx) => (
            <div
              key={project.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(idx)}
              className={shared.methodCard}
              style={{ cursor: "grab", borderLeft: dragIdx === idx ? "3px solid var(--accent)" : undefined }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)", background: "var(--border)", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "0.15rem" }}>
                    {idx + 1}
                  </span>
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
        </>
      )}

      </>)}
    </div>
  );
}
