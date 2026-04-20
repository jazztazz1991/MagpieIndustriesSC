"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import styles from "./admin.module.css";

interface AdminStats {
  userCount: number;
  orgCount: number;
  openReports: number;
  pendingSuggestions: number;
  craftRecipeCount: number;
  missionRecipeCount: number;
}

interface AdminUser {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  role: string;
  createdAt: string;
}

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

interface SuggestionItem {
  id: string;
  title: string;
  description: string;
  status: string;
  adminNotes: string | null;
  voteCount: number;
  createdAt: string;
  author: { id: string; username: string };
}

type TabKey = "users" | "reports" | "suggestions" | "recipes";

function Spoiler({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <span
      className={revealed ? styles.spoilerRevealed : styles.spoiler}
      onClick={() => setRevealed((r) => !r)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setRevealed((r) => !r); }}
      aria-label={revealed ? "Click to hide" : "Click to reveal"}
    >
      {children}
    </span>
  );
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [tab, setTab] = useState<TabKey>("users");
  const [loading, setLoading] = useState(true);

  // Users
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);

  // Reports
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [reportFilter, setReportFilter] = useState("");

  // Suggestions
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [suggestionFilter, setSuggestionFilter] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user?.isAdmin) { setLoading(false); return; }
    fetchStats();
    fetchUsers();
  }, [authLoading, user]);

  async function fetchStats() {
    const res = await apiFetch<AdminStats>("/api/admin/stats");
    if (res.success && res.data) setStats(res.data);
    setLoading(false);
  }

  async function fetchUsers(search = "", page = 1) {
    const res = await apiFetch<{ users: AdminUser[]; total: number; page: number; totalPages: number }>(
      `/api/admin/users?search=${encodeURIComponent(search)}&page=${page}&limit=20`
    );
    if (res.success && res.data) {
      setUsers(res.data.users);
      setUserPage(res.data.page);
      setUserTotalPages(res.data.totalPages);
    }
  }

  async function fetchReports(status = "") {
    const qs = status ? `?status=${status}` : "";
    const res = await apiFetch<ReportItem[]>(`/api/reports${qs}`);
    if (res.success && res.data) setReports(res.data);
  }

  async function fetchSuggestions(status = "") {
    const qs = status ? `?status=${status}` : "";
    const res = await apiFetch<SuggestionItem[]>(`/api/suggestions${qs}`);
    if (res.success && res.data) setSuggestions(res.data);
  }

  async function toggleAdmin(userId: string, isAdmin: boolean) {
    await apiFetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ isAdmin }),
    });
    fetchUsers(userSearch, userPage);
  }

  async function updateReport(id: string, status: string, adminNotes?: string) {
    await apiFetch(`/api/reports/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, ...(adminNotes !== undefined ? { adminNotes } : {}) }),
    });
    fetchReports(reportFilter);
  }

  async function updateSuggestion(id: string, status: string, adminNotes?: string) {
    await apiFetch(`/api/suggestions/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, ...(adminNotes !== undefined ? { adminNotes } : {}) }),
    });
    fetchSuggestions(suggestionFilter);
  }

  useEffect(() => {
    if (tab === "reports") fetchReports(reportFilter);
    if (tab === "suggestions") fetchSuggestions(suggestionFilter);
  }, [tab]);

  function getStatusClass(status: string) {
    const map: Record<string, string> = {
      OPEN: styles.statusOpen,
      IN_PROGRESS: styles.statusInProgress,
      RESOLVED: styles.statusResolved,
      CLOSED: styles.statusClosed,
      PENDING: styles.statusPending,
      UNDER_REVIEW: styles.statusUnderReview,
      PLANNED: styles.statusPlanned,
      DECLINED: styles.statusDeclined,
    };
    return `${styles.statusBadge} ${map[status] || ""}`;
  }

  if (authLoading || loading) return <div className={styles.loading}>Loading...</div>;
  if (!user?.isAdmin) return <div className={styles.denied}>Admin access required.</div>;

  return (
    <div className={styles.adminPage}>
      <h1 className={styles.title}>Admin Dashboard</h1>

      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}><div className={styles.statValue}>{stats.userCount}</div><div className={styles.statLabel}>Users</div></div>
          <div className={styles.statCard}><div className={styles.statValue}>{stats.orgCount}</div><div className={styles.statLabel}>Orgs</div></div>
          <div className={styles.statCard}><div className={styles.statValue}>{stats.openReports}</div><div className={styles.statLabel}>Open Reports</div></div>
          <div className={styles.statCard}><div className={styles.statValue}>{stats.pendingSuggestions}</div><div className={styles.statLabel}>Pending Suggestions</div></div>
          <div className={styles.statCard}><div className={styles.statValue}>{stats.craftRecipeCount}</div><div className={styles.statLabel}>Craft Recipes</div></div>
          <div className={styles.statCard}><div className={styles.statValue}>{stats.missionRecipeCount}</div><div className={styles.statLabel}>Mission Recipes</div></div>
        </div>
      )}

      <div className={styles.tabs}>
        {(["users", "reports", "suggestions", "recipes"] as TabKey[]).map((t) => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabActive : ""}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {tab === "users" && (
        <div>
          <div className={styles.searchBar}>
            <input
              className={styles.searchInput}
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") fetchUsers(userSearch, 1); }}
            />
            <button className={styles.saveBtn} onClick={() => fetchUsers(userSearch, 1)}>Search</button>
          </div>
          <table className={styles.userTable}>
            <thead>
              <tr><th>Username</th><th>Email</th><th>Role</th><th>Admin</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td><Spoiler>{u.email}</Spoiler></td>
                  <td>{u.role}</td>
                  <td>{u.isAdmin && <span className={styles.adminBadge}>ADMIN</span>}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u.id !== user.id && user.isSuperAdmin && (
                      <button className={styles.toggleBtn} onClick={() => toggleAdmin(u.id, !u.isAdmin)}>
                        {u.isAdmin ? "Remove Admin" : "Make Admin"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <button className={styles.pageBtn} disabled={userPage <= 1} onClick={() => fetchUsers(userSearch, userPage - 1)}>Prev</button>
            <span style={{ color: "var(--text-secondary)" }}>Page {userPage} of {userTotalPages}</span>
            <button className={styles.pageBtn} disabled={userPage >= userTotalPages} onClick={() => fetchUsers(userSearch, userPage + 1)}>Next</button>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {tab === "reports" && (
        <div>
          <div className={styles.filterBar}>
            <select className={styles.selectSmall} value={reportFilter} onChange={(e) => { setReportFilter(e.target.value); fetchReports(e.target.value); }}>
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <div className={styles.queueList}>
            {reports.length === 0 && <div className={styles.emptyState}>No reports found.</div>}
            {reports.map((r) => (
              <ReportCard key={r.id} report={r} onUpdate={updateReport} getStatusClass={getStatusClass} />
            ))}
          </div>
        </div>
      )}

      {/* Suggestions Tab */}
      {tab === "suggestions" && (
        <div>
          <div className={styles.filterBar}>
            <select className={styles.selectSmall} value={suggestionFilter} onChange={(e) => { setSuggestionFilter(e.target.value); fetchSuggestions(e.target.value); }}>
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="PLANNED">Planned</option>
              <option value="DECLINED">Declined</option>
            </select>
          </div>
          <div className={styles.queueList}>
            {suggestions.length === 0 && <div className={styles.emptyState}>No suggestions found.</div>}
            {suggestions.map((s) => (
              <SuggestionCard key={s.id} suggestion={s} onUpdate={updateSuggestion} getStatusClass={getStatusClass} />
            ))}
          </div>
        </div>
      )}

      {/* Recipes Tab */}
      {tab === "recipes" && (
        <div>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <Link href="/admin/craft-recipes" className={styles.saveBtn} style={{ textDecoration: "none", padding: "0.5rem 1rem" }}>
              Manage Craft Recipes
            </Link>
            <Link href="/admin/mission-recipes" className={styles.saveBtn} style={{ textDecoration: "none", padding: "0.5rem 1rem" }}>
              Manage Mission Recipes
            </Link>
            <Link href="/admin/data-browser" className={styles.saveBtn} style={{ textDecoration: "none", padding: "0.5rem 1rem" }}>
              Game Data Browser
            </Link>
            <Link href="/admin/refinery-submissions" className={styles.saveBtn} style={{ textDecoration: "none", padding: "0.5rem 1rem" }}>
              Refinery Submissions
            </Link>
          </div>
          {stats && (
            <div style={{ color: "var(--text-secondary, #8888a0)", fontSize: "0.9rem" }}>
              {stats.craftRecipeCount} craft recipes, {stats.missionRecipeCount} mission recipes in database.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReportCard({ report, onUpdate, getStatusClass }: {
  report: ReportItem;
  onUpdate: (id: string, status: string, notes?: string) => void;
  getStatusClass: (s: string) => string;
}) {
  const [status, setStatus] = useState(report.status);
  const [notes, setNotes] = useState(report.adminNotes || "");

  return (
    <div className={styles.queueCard}>
      <div className={styles.queueHeader}>
        <span className={styles.queueTitle}>[{report.type}] {report.title}</span>
        <span className={getStatusClass(report.status)}>{report.status.replace("_", " ")}</span>
      </div>
      <div className={styles.queueMeta}>
        by {report.author.username} &middot; {new Date(report.createdAt).toLocaleDateString()}
        {report.pageUrl && <> &middot; <a href={report.pageUrl} style={{ color: "var(--accent)" }}>{report.pageUrl}</a></>}
      </div>
      <div className={styles.queueDesc}>{report.description}</div>
      <div className={styles.queueActions}>
        <select className={styles.selectSmall} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        <input className={styles.inputSmall} placeholder="Admin notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button className={styles.saveBtn} onClick={() => onUpdate(report.id, status, notes)}>Save</button>
      </div>
    </div>
  );
}

function SuggestionCard({ suggestion, onUpdate, getStatusClass }: {
  suggestion: SuggestionItem;
  onUpdate: (id: string, status: string, notes?: string) => void;
  getStatusClass: (s: string) => string;
}) {
  const [status, setStatus] = useState(suggestion.status);
  const [notes, setNotes] = useState(suggestion.adminNotes || "");

  return (
    <div className={styles.queueCard}>
      <div className={styles.queueHeader}>
        <span className={styles.queueTitle}>{suggestion.title} ({suggestion.voteCount} votes)</span>
        <span className={getStatusClass(suggestion.status)}>{suggestion.status.replace("_", " ")}</span>
      </div>
      <div className={styles.queueMeta}>
        by {suggestion.author.username} &middot; {new Date(suggestion.createdAt).toLocaleDateString()}
      </div>
      <div className={styles.queueDesc}>{suggestion.description}</div>
      <div className={styles.queueActions}>
        <select className={styles.selectSmall} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="PENDING">Pending</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="PLANNED">Planned</option>
          <option value="DECLINED">Declined</option>
        </select>
        <input className={styles.inputSmall} placeholder="Admin notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button className={styles.saveBtn} onClick={() => onUpdate(suggestion.id, status, notes)}>Save</button>
      </div>
    </div>
  );
}
