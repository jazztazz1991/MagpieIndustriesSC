"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import styles from "../groups.module.css";

interface PublicUser {
  id: string;
  username: string;
  rsiHandle: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
}

interface GroupMember extends PublicUser {
  groupRole: string;
  joinedAt: string;
}

interface GroupEvent {
  id: string;
  title: string;
  description: string | null;
  eventType: string;
  startsAt: string;
  endsAt: string | null;
  creator: PublicUser;
}

interface GroupDetail {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner: PublicUser;
  members: GroupMember[];
  events: GroupEvent[];
  myRole: string;
}

export default function GroupDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;

  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [addUsername, setAddUsername] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    fetchGroup();
  }, [user, authLoading, groupId]);

  async function fetchGroup() {
    setLoading(true);
    setError(null);
    const res = await apiFetch<GroupDetail>(`/api/groups/${groupId}`);
    if (res.success && res.data) {
      setGroup(res.data);
    } else {
      setError(res.error || "Failed to load group");
    }
    setLoading(false);
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!addUsername.trim()) return;

    setAdding(true);
    setAddError(null);

    const res = await apiFetch(`/api/groups/${groupId}/members`, {
      method: "POST",
      body: JSON.stringify({ username: addUsername.trim() }),
    });

    if (res.success) {
      setAddUsername("");
      await fetchGroup();
    } else {
      setAddError(res.error || "Failed to add member");
    }
    setAdding(false);
  }

  async function handleRemoveMember(userId: string) {
    if (!confirm("Remove this member from the group?")) return;

    const res = await apiFetch(`/api/groups/${groupId}/members/${userId}`, {
      method: "DELETE",
    });

    if (res.success) {
      await fetchGroup();
    } else {
      alert(res.error || "Failed to remove member");
    }
  }

  async function handleLeave() {
    if (!user || !confirm("Are you sure you want to leave this group?")) return;

    const res = await apiFetch(`/api/groups/${groupId}/members/${user.id}`, {
      method: "DELETE",
    });

    if (res.success) {
      router.push("/community/groups");
    } else {
      alert(res.error || "Failed to leave group");
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this group? This cannot be undone.")) return;

    const res = await apiFetch(`/api/groups/${groupId}`, {
      method: "DELETE",
    });

    if (res.success) {
      router.push("/community/groups");
    } else {
      alert(res.error || "Failed to delete group");
    }
  }

  function getRoleBadgeClass(role: string): string {
    switch (role) {
      case "LEADER":
        return `${styles.roleBadge} ${styles.roleBadgeLeader}`;
      case "OFFICER":
        return `${styles.roleBadge} ${styles.roleBadgeOfficer}`;
      default:
        return `${styles.roleBadge} ${styles.roleBadgeMember}`;
    }
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
        <div className={styles.emptyState}>Sign in to view group details.</div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className={styles.groupsPage}>
        <Link href="/community/groups" className={styles.backLink}>
          Back to Groups
        </Link>
        <div className={styles.emptyState}>{error || "Group not found"}</div>
      </div>
    );
  }

  const isOwner = user.id === group.ownerId;
  const canManageMembers = group.myRole === "LEADER" || group.myRole === "OFFICER";

  return (
    <div className={styles.groupsPage}>
      <Link href="/community/groups" className={styles.backLink}>
        Back to Groups
      </Link>

      {/* Group Header */}
      <div className={styles.groupHeader}>
        <h1 className={styles.groupHeaderName}>{group.name}</h1>
        {group.description && (
          <p className={styles.groupHeaderDesc}>{group.description}</p>
        )}
        <div className={styles.ownerBadge}>
          Owner: {group.owner.username} | {group.members.length} member{group.members.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Members Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Members</h2>

        {canManageMembers && (
          <form className={styles.addMemberForm} onSubmit={handleAddMember}>
            <input
              type="text"
              value={addUsername}
              onChange={(e) => setAddUsername(e.target.value)}
              placeholder="Username to add"
              required
            />
            <button type="submit" className={styles.addMemberBtn} disabled={adding}>
              {adding ? "Adding..." : "Add Member"}
            </button>
          </form>
        )}
        {addError && <div className={styles.error}>{addError}</div>}

        <div className={styles.memberList}>
          {group.members.map((member) => (
            <div key={member.id} className={styles.memberRow}>
              <div className={styles.memberInfo}>
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.username}
                    className={styles.memberAvatar}
                  />
                ) : (
                  <div className={styles.memberAvatar} />
                )}
                <span className={styles.memberName}>{member.username}</span>
                <span className={getRoleBadgeClass(member.groupRole)}>
                  {member.groupRole}
                </span>
              </div>
              {/* Show remove button if caller is leader and target is not the owner */}
              {canManageMembers && member.id !== group.ownerId && member.id !== user.id && (
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemoveMember(member.id)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Events Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Upcoming Events</h2>
        {group.events.length === 0 ? (
          <div className={styles.emptyState}>No upcoming events.</div>
        ) : (
          <div className={styles.eventList}>
            {group.events.map((event) => (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.eventTitle}>{event.title}</div>
                <div className={styles.eventMeta}>
                  {event.eventType} | {new Date(event.startsAt).toLocaleString()} | by{" "}
                  {event.creator.username}
                </div>
              </div>
            ))}
          </div>
        )}
        {canManageMembers && (
          <Link
            href={`/community/events/create?groupId=${group.id}`}
            className={styles.createBtn}
            style={{ display: "inline-block", marginTop: "0.75rem", textDecoration: "none", textAlign: "center" }}
          >
            Create Event
          </Link>
        )}
      </div>

      {/* Danger Zone */}
      <div className={styles.dangerZone}>
        <div className={styles.dangerZoneTitle}>Danger Zone</div>
        {!isOwner && (
          <button className={styles.dangerBtn} onClick={handleLeave}>
            Leave Group
          </button>
        )}
        {isOwner && (
          <button className={styles.dangerBtn} onClick={handleDelete}>
            Delete Group
          </button>
        )}
      </div>
    </div>
  );
}
