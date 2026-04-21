"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { can, type OrgMembershipContext, type OrgRole } from "@/domain/orgPermissions";
import styles from "./members.module.css";

interface Member {
  id: string;              // user id (spread from user)
  username: string;
  avatarUrl: string | null;
  role: OrgRole | null;
  joinedAt: string;
}

interface Org {
  id: string;
  slug: string;
  ownerId: string;
  members: Member[];
  memberCount: number;
  myRole?: OrgRole | null;
  isMember?: boolean;
  roles?: OrgRole[];
}

type SortKey = "username" | "role" | "joined";
type SortDir = "asc" | "desc";

export default function MembersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { user, loading: authLoading } = useAuth();

  const [org, setOrg] = useState<Org | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("joined");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    (async () => {
      const res = await apiFetch<Org>(`/api/orgs/${slug}`);
      if (res.success && res.data) setOrg(res.data);
      setLoading(false);
    })();
  }, [slug, user, authLoading]);

  const membershipCtx = useMemo<OrgMembershipContext>(() => ({
    isOwner: !!(user && org && user.id === org.ownerId),
    isMember: !!(org?.isMember ?? org?.myRole),
    role: org?.myRole ?? null,
  }), [user, org]);

  const canManageMembers = can(membershipCtx, "manage_members");
  const canManageRoles = can(membershipCtx, "manage_roles");

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const visibleMembers = useMemo(() => {
    if (!org) return [];
    const q = filter.toLowerCase();
    const filtered = org.members.filter((m) => !q || m.username.toLowerCase().includes(q));
    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "username") cmp = a.username.localeCompare(b.username);
      else if (sortKey === "role") cmp = (a.role?.rank ?? 999) - (b.role?.rank ?? 999);
      else cmp = new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [org, filter, sortKey, sortDir]);

  const handleRoleChange = async (memberUserId: string, roleId: string) => {
    if (!org) return;
    setBusyId(memberUserId);
    await apiFetch(`/api/orgs/${org.id}/members/${memberUserId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ roleId: roleId || null }),
    });
    // Refresh
    const res = await apiFetch<Org>(`/api/orgs/${slug}`);
    if (res.success && res.data) setOrg(res.data);
    setBusyId(null);
  };

  const handleRemove = async (memberUserId: string, username: string) => {
    if (!org) return;
    if (!confirm(`Remove ${username} from the org?`)) return;
    setBusyId(memberUserId);
    await apiFetch(`/api/orgs/${org.id}/members/${memberUserId}`, { method: "DELETE" });
    const res = await apiFetch<Org>(`/api/orgs/${slug}`);
    if (res.success && res.data) setOrg(res.data);
    setBusyId(null);
  };

  const sortArrow = (k: SortKey) => (sortKey === k ? (sortDir === "asc" ? " ▲" : " ▼") : "");

  if (authLoading || loading) return <div className={styles.emptyState}>Loading...</div>;
  if (!user) return <div className={styles.emptyState}>Sign in to view members.</div>;
  if (!org) return <div className={styles.emptyState}>Organization not found.</div>;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Members<span className={styles.count}>({org.memberCount})</span>
        </h1>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Filter by username..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.filterInput}
        />
      </div>

      {visibleMembers.length === 0 ? (
        <div className={styles.emptyState}>
          {filter ? `No members match "${filter}"` : "No members yet."}
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th onClick={() => toggleSort("username")}>
                  Member{sortArrow("username") && <span className={styles.sortIndicator}>{sortArrow("username")}</span>}
                </th>
                <th onClick={() => toggleSort("role")}>
                  Role{sortArrow("role") && <span className={styles.sortIndicator}>{sortArrow("role")}</span>}
                </th>
                <th onClick={() => toggleSort("joined")}>
                  Joined{sortArrow("joined") && <span className={styles.sortIndicator}>{sortArrow("joined")}</span>}
                </th>
                {(canManageRoles || canManageMembers) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {visibleMembers.map((m) => {
                const isOwnerRow = m.id === org.ownerId;
                return (
                  <tr key={m.id}>
                    <td>
                      <div className={styles.memberCell}>
                        <div className={styles.avatar}>
                          {m.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={m.avatarUrl} alt="" />
                          ) : (
                            m.username.charAt(0).toUpperCase()
                          )}
                        </div>
                        <Link href={`/u/${m.username}`} className={styles.usernameLink}>
                          <span className={styles.username}>{m.username}</span>
                        </Link>
                      </div>
                    </td>
                    <td>
                      {isOwnerRow ? (
                        <span className={`${styles.roleBadge} ${styles.roleOwner}`}>Owner</span>
                      ) : canManageRoles ? (
                        <select
                          className={styles.roleSelect}
                          value={m.role?.id || ""}
                          onChange={(e) => handleRoleChange(m.id, e.target.value)}
                          disabled={busyId === m.id}
                        >
                          <option value="">No role</option>
                          {(org.roles || []).map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`${styles.roleBadge} ${styles.roleOther}`}>
                          {m.role?.name || "No role"}
                        </span>
                      )}
                    </td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                      {new Date(m.joinedAt).toLocaleDateString()}
                    </td>
                    {(canManageRoles || canManageMembers) && (
                      <td>
                        {!isOwnerRow && canManageMembers && (
                          <button
                            className={styles.removeBtn}
                            onClick={() => handleRemove(m.id, m.username)}
                            disabled={busyId === m.id}
                          >
                            {busyId === m.id ? "..." : "Remove"}
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
