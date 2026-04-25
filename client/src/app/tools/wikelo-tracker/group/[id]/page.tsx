"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { contracts as staticContracts } from "@/data/wikelo";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { naturalCompare } from "@/lib/sort";
import { isConversionItemName } from "@/domain/wikeloConversion";
import shared from "../../../tools.module.css";

interface Material { id: string; itemName: string; required: number; collected: number; }
interface Project { id: string; name: string; displayName: string | null; contractId: string; status: string; priority: number; progress: number; materials: Material[]; }
interface Member { userId: string; username: string; joinedAt: string; }
interface Group { id: string; name: string; inviteCode: string; ownerId: string; ownerName: string; members: Member[]; projects: Project[]; }
interface LogEntry { id: string; username: string; projectName?: string; itemName: string; delta: number; newTotal: number; createdAt: string; }
interface ContributionItem { itemName: string; net: number; }
interface UserContribution { userId: string; username: string; items: ContributionItem[]; }

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
  const [activeView, setActiveView] = useState<"projects" | "log" | "contributions">("projects");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [logLoading, setLogLoading] = useState(false);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [contributions, setContributions] = useState<UserContribution[]>([]);
  const [contributionsLoading, setContributionsLoading] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [mgScrip, setMgScrip] = useState(0);
  const [quantanium, setQuantanium] = useState(0);
  const [refreshTick, setRefreshTick] = useState(0);

  // Load conversion totals from the server
  const loadConversion = useCallback(async () => {
    if (!id) return;
    const res = await apiFetch<{
      mgScrip: { total: number };
      quantanium: { total: number };
    }>(`/api/wikelo/groups/${id}/conversion`);
    if (res.success && res.data) {
      setMgScrip(res.data.mgScrip.total);
      setQuantanium(res.data.quantanium.total);
    }
  }, [id]);

  useEffect(() => {
    if (!id || authLoading || !user) return;
    loadConversion();
  }, [id, authLoading, user, loadConversion]);

  const postConversion = useCallback(
    async (material: "MG_SCRIP" | "QUANTANIUM", delta: number) => {
      if (!id) return;
      const res = await apiFetch<{ material: string; total: number; applied: number }>(
        `/api/wikelo/groups/${id}/conversion`,
        { method: "POST", body: JSON.stringify({ material, delta }) }
      );
      if (res.success && res.data) {
        if (res.data.material === "MG_SCRIP") setMgScrip(res.data.total);
        else setQuantanium(res.data.total);
        setRefreshTick((t) => t + 1);
      }
    },
    [id]
  );

  const updateMgScrip = (delta: number) => {
    // Optimistic local update; reconcile after the server responds.
    setMgScrip((v) => Math.max(0, v + delta));
    postConversion("MG_SCRIP", delta);
  };

  const updateQuantanium = (delta: number) => {
    setQuantanium((v) => Math.max(0, v + delta));
    postConversion("QUANTANIUM", delta);
  };

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

  // Load contributions
  const loadContributions = useCallback(async () => {
    setContributionsLoading(true);
    const res = await apiFetch<UserContribution[]>(`/api/wikelo/groups/${id}/contributions`);
    if (res.success && res.data) setContributions(res.data);
    setContributionsLoading(false);
  }, [id]);

  useEffect(() => {
    if (activeView === "log") loadLog();
    if (activeView === "contributions") loadContributions();
  }, [activeView]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced refresh on material updates — handles shopping list distribute (multiple updates in a row)
  useEffect(() => {
    if (refreshTick === 0) return;
    const timer = setTimeout(() => {
      if (activeView === "log") loadLog();
      if (activeView === "contributions") loadContributions();
      // Favor/Bit adds auto-debit the conversion pool server-side, so the
      // displayed totals must refresh too.
      loadConversion();
    }, 300);
    return () => clearTimeout(timer);
  }, [refreshTick]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Delete project
  const handleDeleteProject = async (projectId: string, projectLabel: string) => {
    if (!confirm(`Remove "${projectLabel}" from this group? This cannot be undone.`)) return;
    const res = await apiFetch(`/api/wikelo/groups/${id}/projects/${projectId}`, { method: "DELETE" });
    if (res.success) {
      setGroup((prev) => prev ? { ...prev, projects: prev.projects.filter((p) => p.id !== projectId) } : prev);
      if (expandedProject === projectId) setExpandedProject(null);
    }
  };

  // Update material — sends delta for atomic server-side increment.
  // If the server reports INSUFFICIENT_POOL (group MG Scrip / Quantanium not
  // enough to back a Favor / Bit mint), prompt the user — if the favor/bit
  // was purchased externally, retry with external: true to skip the debit.
  const updateMaterial = useCallback(async (projectId: string, materialId: string, delta: number) => {
    const post = (external?: boolean) =>
      apiFetch<Material>(`/api/wikelo/groups/${id}/projects/${projectId}/materials/${materialId}`, {
        method: "PATCH",
        body: JSON.stringify(external ? { delta, external: true } : { delta }),
      });

    let res = await post();
    if (!res.success && (res as { error?: string }).error === "INSUFFICIENT_POOL") {
      const r = res as unknown as { material: "MG_SCRIP" | "QUANTANIUM"; needed: number; available: number };
      const matLabel = r.material === "MG_SCRIP" ? "MG Scrip" : "Quantanium";
      const unit = r.material === "MG_SCRIP" ? "scrip" : "SCU";
      const proceed = confirm(
        `Not enough ${matLabel} in the group pool to mint this (need ${r.needed} ${unit}, pool has ${r.available} ${unit}). ` +
        `Was this purchased from someone else?`
      );
      if (!proceed) return;
      res = await post(true);
    }

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
      setRefreshTick((v) => v + 1);
    }
  }, [id]);

  // Shopping list
  const shoppingList = useMemo(() => {
    if (!group) return [];
    const inProgress = group.projects.filter((p) => p.status === "IN_PROGRESS");
    const aggregated = new Map<string, {
      needed: number; collected: number;
      sources: { projectId: string; materialId: string; required: number; collected: number }[];
    }>();

    for (const project of inProgress) {
      for (const mat of project.materials) {
        const existing = aggregated.get(mat.itemName) || { needed: 0, collected: 0, sources: [] };
        existing.needed += mat.required;
        existing.collected += mat.collected;
        existing.sources.push({ projectId: project.id, materialId: mat.id, required: mat.required, collected: mat.collected });
        aggregated.set(mat.itemName, existing);
      }
    }

    return Array.from(aggregated.entries())
      .map(([name, data]) => ({
        name,
        needed: data.needed,
        collected: data.collected,
        remaining: Math.max(0, data.needed - data.collected),
        sources: data.sources,
      }))
      .sort((a, b) => naturalCompare(a.name, b.name));
  }, [group]);

  // Update shopping list item: distribute across sources, filling each to its cap
  const updateShoppingItem = useCallback(async (itemName: string, delta: number) => {
    const item = shoppingList.find((i) => i.name === itemName);
    if (!item) return;

    let remaining = delta;
    for (const source of item.sources) {
      if (remaining === 0) break;
      if (remaining > 0) {
        const canAdd = source.required - source.collected;
        if (canAdd <= 0) continue;
        const toAdd = Math.min(remaining, canAdd);
        await updateMaterial(source.projectId, source.materialId, toAdd);
        remaining -= toAdd;
      } else {
        const canRemove = source.collected;
        if (canRemove <= 0) continue;
        const toRemove = Math.min(Math.abs(remaining), canRemove);
        await updateMaterial(source.projectId, source.materialId, -toRemove);
        remaining += toRemove;
      }
    }
  }, [shoppingList, updateMaterial]);

  // Drag reorder
  const handleDrop = async (dropIdx: number) => {
    if (dragIdx === null || dragIdx === dropIdx || !group) { setDragIdx(null); return; }
    const reordered = [...group.projects];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(dropIdx, 0, moved);
    setGroup({ ...group, projects: reordered });
    setDragIdx(null);

    await apiFetch(`/api/wikelo/groups/${id}/projects/reorder`, {
      method: "POST",
      body: JSON.stringify({ projectIds: reordered.map((p) => p.id) }),
    });
  };

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
      <div className={shared.groupHeader}>
        <div>
          <h1 className={shared.title} style={{ marginBottom: "0.25rem" }}>{group.name}</h1>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            {group.members.length} member{group.members.length !== 1 ? "s" : ""} · {group.projects.length} project{group.projects.length !== 1 ? "s" : ""}
          </div>
        </div>
        <div className={shared.groupHeaderControls}>
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
          {shoppingListOpen && (<>
            <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {shoppingList.map((item) => {
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
                    <div style={{ display: "flex", gap: "0.2rem" }}>
                      <button onClick={() => updateShoppingItem(item.name, -1)} style={{ width: "24px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-primary)", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center" }}>-</button>
                      <button onClick={() => updateShoppingItem(item.name, 1)} style={{ width: "24px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-primary)", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                      <button onClick={() => updateShoppingItem(item.name, 5)} style={{ width: "28px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+5</button>
                      <button onClick={() => updateShoppingItem(item.name, 10)} style={{ width: "32px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+10</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Conversion materials */}
            {(() => {
              const favorItem = shoppingList.find((i) => i.name === "Wikelo Favor");
              const polarisBitItem = shoppingList.find((i) => i.name === "Polaris Bit");
              const favorRemaining = favorItem?.remaining || 0;
              const bitsRemaining = polarisBitItem?.remaining || 0;

              if (favorRemaining <= 0 && bitsRemaining <= 0) return null;

              const scripNeeded = favorRemaining * 50;
              const scripRemaining = Math.max(0, scripNeeded - mgScrip);
              const quantNeeded = bitsRemaining * 24;
              const quantRemaining = Math.max(0, quantNeeded - quantanium);

              return (
                <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: "0.5rem" }}>
                    Conversion Materials
                  </div>

                  {favorRemaining > 0 && (
                    <div style={{ padding: "0.5rem 0.75rem", background: "rgba(192, 132, 252, 0.06)", border: "1px solid rgba(192, 132, 252, 0.15)", borderRadius: "6px", marginBottom: "0.4rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                        <div style={{ fontSize: "0.8rem", color: "#c084fc", fontWeight: 600 }}>
                          MG Scrip for Favor ({favorRemaining} favors remaining)
                        </div>
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                        {scripNeeded.toLocaleString()} MG Scrip needed
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginLeft: "0.5rem" }}>(50 scrip = 1 favor)</span>
                      </div>
                      <div className={shared.conversionHaveRow}>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Have:</span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: mgScrip >= scripNeeded ? "#4ade80" : "#c084fc" }}>
                          {mgScrip.toLocaleString()} / {scripNeeded.toLocaleString()}
                        </span>
                        {scripRemaining > 0 && (
                          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                            ({scripRemaining.toLocaleString()} more needed)
                          </span>
                        )}
                        <div className={shared.conversionBtns}>
                          <button onClick={() => updateMgScrip(-10)} style={{ width: "28px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center" }}>-10</button>
                          <button onClick={() => updateMgScrip(-1)} style={{ width: "24px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>-</button>
                          <button onClick={() => updateMgScrip(1)} style={{ width: "24px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                          <button onClick={() => updateMgScrip(10)} style={{ width: "28px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+10</button>
                          <button onClick={() => updateMgScrip(50)} style={{ width: "32px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+50</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {bitsRemaining > 0 && (
                    <div style={{ padding: "0.5rem 0.75rem", background: "rgba(250, 204, 21, 0.06)", border: "1px solid rgba(250, 204, 21, 0.15)", borderRadius: "6px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                        <div style={{ fontSize: "0.8rem", color: "#facc15", fontWeight: 600 }}>
                          Quantanium for Polaris Bits ({bitsRemaining} bits remaining)
                        </div>
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                        {quantNeeded.toLocaleString()} SCU Quantanium needed
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginLeft: "0.5rem" }}>(24 SCU = 1 bit)</span>
                      </div>
                      <div className={shared.conversionHaveRow}>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Have:</span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: quantanium >= quantNeeded ? "#4ade80" : "#facc15" }}>
                          {quantanium.toLocaleString()} / {quantNeeded.toLocaleString()}
                        </span>
                        {quantRemaining > 0 && (
                          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                            ({quantRemaining.toLocaleString()} more needed)
                          </span>
                        )}
                        <div className={shared.conversionBtns}>
                          <button onClick={() => updateQuantanium(-10)} style={{ width: "28px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center" }}>-10</button>
                          <button onClick={() => updateQuantanium(-1)} style={{ width: "24px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>-</button>
                          <button onClick={() => updateQuantanium(1)} style={{ width: "24px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                          <button onClick={() => updateQuantanium(10)} style={{ width: "28px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+10</button>
                          <button onClick={() => updateQuantanium(24)} style={{ width: "32px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+24</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </>)}
        </div>
      )}

      {/* View toggle */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button className={activeView === "projects" ? shared.shipBtnActive + " " + shared.shipBtn : shared.shipBtn} onClick={() => setActiveView("projects")}>
          Projects
        </button>
        <button className={activeView === "contributions" ? shared.shipBtnActive + " " + shared.shipBtn : shared.shipBtn} onClick={() => setActiveView("contributions")}>
          Who Has What
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
            <div className={shared.hideMobile} style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
              Drag to reorder priority
            </div>
            <div className={shared.methodGrid}>
              {group.projects.map((project, idx) => (
                <div
                  key={project.id}
                  draggable
                  onDragStart={() => setDragIdx(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(idx)}
                  className={shared.methodCard}
                  onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                  style={{ cursor: "grab", borderLeft: dragIdx === idx ? "3px solid var(--accent)" : undefined }}
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", gap: "0.5rem" }}>
                    <h3 style={{ margin: 0 }}>{project.displayName || project.name}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleDeleteProject(project.id, project.displayName || project.name)}
                        style={{ padding: "0.25rem 0.6rem", background: "rgba(248, 113, 113, 0.1)", border: "1px solid rgba(248, 113, 113, 0.25)", borderRadius: "4px", color: "#f87171", fontSize: "0.75rem", cursor: "pointer" }}
                      >
                        Delete project
                      </button>
                      <button onClick={() => setExpandedProject(null)} style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: "1.2rem", cursor: "pointer" }}>&times;</button>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {[...project.materials].sort((a, b) => naturalCompare(a.itemName, b.itemName)).map((mat) => {
                      const complete = mat.collected >= mat.required;
                      return (
                        <div key={mat.id} className={shared.materialRow}>
                          <span style={{ fontSize: "0.85rem", fontWeight: 500, color: complete ? "var(--text-secondary)" : "var(--text-primary)" }}>
                            {mat.itemName}
                          </span>
                          <span style={{ fontSize: "0.8rem", textAlign: "right", color: complete ? "#4ade80" : "#fb923c", fontWeight: 600 }}>
                            {mat.collected}/{mat.required}
                          </span>
                          <div style={{ display: "flex", gap: "0.2rem" }} onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => updateMaterial(project.id, mat.id, -1)} style={{ width: "24px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>-</button>
                            <button onClick={() => updateMaterial(project.id, mat.id, 1)} style={{ width: "24px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                            <button onClick={() => updateMaterial(project.id, mat.id, 5)} style={{ width: "28px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+5</button>
                            <button onClick={() => updateMaterial(project.id, mat.id, 10)} style={{ width: "32px", height: "24px", background: "var(--border)", border: "none", borderRadius: "3px", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+10</button>
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

      {/* Contributions view */}
      {activeView === "contributions" && (
        <div className={shared.panel}>
          <h2 className={shared.panelTitle}>Who Has What</h2>
          {contributionsLoading ? (
            <div className={shared.emptyMessage}>Loading...</div>
          ) : contributions.length === 0 ? (
            <div className={shared.emptyMessage}>No contributions yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {contributions
                .slice()
                .sort((a, b) => {
                  if (user) {
                    if (a.userId === user.id) return -1;
                    if (b.userId === user.id) return 1;
                  }
                  return a.username.localeCompare(b.username);
                })
                .map((c) => (
                <div key={c.userId}>
                  <div style={{ fontWeight: 600, color: "var(--accent)", fontSize: "0.9rem", marginBottom: "0.4rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.25rem" }}>
                    {c.username}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {c.items
                      .sort((a, b) => {
                        const aIsConv = isConversionItemName(a.itemName);
                        const bIsConv = isConversionItemName(b.itemName);
                        if (aIsConv !== bIsConv) return aIsConv ? 1 : -1;
                        return naturalCompare(a.itemName, b.itemName);
                      })
                      .map((item, i) => (
                        <div key={item.itemName} style={{ display: "flex", alignItems: "center", padding: "0.3rem 0.5rem", fontSize: "0.85rem", background: i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent", borderRadius: "3px" }}>
                          <span style={{ whiteSpace: "nowrap" }}>{item.itemName}</span>
                          <span style={{ flex: 1, borderBottom: "1px dotted rgba(255,255,255,0.1)", margin: "0 0.5rem", minWidth: "2rem", alignSelf: "flex-end", marginBottom: "0.25rem" }} />
                          <span style={{ fontWeight: 600, color: item.net > 0 ? "#4ade80" : "#f87171", whiteSpace: "nowrap" }}>
                            {item.net > 0 ? "+" : ""}{item.net}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
