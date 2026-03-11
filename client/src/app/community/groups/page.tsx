"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import styles from "./groups.module.css";

interface GroupOwner {
  id: string;
  username: string;
  rsiHandle: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
}

interface GroupSummary {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  owner: GroupOwner;
  memberCount: number;
  myRole: string;
}

export default function GroupsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    fetchGroups();
  }, [user, authLoading]);

  async function fetchGroups() {
    setLoading(true);
    const res = await apiFetch<GroupSummary[]>("/api/groups");
    if (res.success && res.data) {
      setGroups(res.data);
    } else {
      setError(res.error || "Failed to load groups");
    }
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);

    const res = await apiFetch<GroupSummary>("/api/groups", {
      method: "POST",
      body: JSON.stringify({ name: createName, description: createDesc || undefined }),
    });

    if (res.success && res.data) {
      setShowCreate(false);
      setCreateName("");
      setCreateDesc("");
      await fetchGroups();
    } else {
      setCreateError(res.error || "Failed to create group");
    }
    setCreating(false);
  }

  if (authLoading || loading) {
    return (
      <div className={styles.groupsPage}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.groupsPage}>
        <div className={styles.emptyState}>Sign in to view and create groups.</div>
      </div>
    );
  }

  return (
    <div className={styles.groupsPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Groups</h1>
        <button className={styles.createBtn} onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "Cancel" : "Create Group"}
        </button>
      </div>

      {showCreate && (
        <form className={styles.createForm} onSubmit={handleCreate}>
          <div className={styles.createFormTitle}>Create a New Group</div>
          <div className={styles.formGroup}>
            <label htmlFor="group-name">Name</label>
            <input
              id="group-name"
              type="text"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              minLength={3}
              maxLength={50}
              required
              placeholder="Group name (3-50 characters)"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="group-desc">Description (optional)</label>
            <textarea
              id="group-desc"
              value={createDesc}
              onChange={(e) => setCreateDesc(e.target.value)}
              maxLength={500}
              placeholder="What is this group about?"
            />
          </div>
          {createError && <div className={styles.error}>{createError}</div>}
          <div className={styles.formActions}>
            <button type="submit" className={styles.formSubmit} disabled={creating}>
              {creating ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              className={styles.formCancel}
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {error && <div className={styles.error}>{error}</div>}

      {groups.length === 0 ? (
        <div className={styles.emptyState}>
          You are not a member of any groups yet. Create one to get started!
        </div>
      ) : (
        <div className={styles.groupList}>
          {groups.map((group) => (
            <a
              key={group.id}
              className={styles.groupCard}
              href={`/community/groups/${group.id}`}
              onClick={(e) => {
                e.preventDefault();
                router.push(`/community/groups/${group.id}`);
              }}
            >
              <div className={styles.groupCardName}>{group.name}</div>
              {group.description && (
                <div className={styles.groupCardDesc}>{group.description}</div>
              )}
              <div className={styles.groupCardMeta}>
                <span>{group.memberCount} member{group.memberCount !== 1 ? "s" : ""}</span>
                <span>Owner: {group.owner.username}</span>
                <span>Role: {group.myRole}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
