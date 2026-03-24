"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import styles from "./orgDetail.module.css";

interface OrgOwner {
  id: string;
  username: string;
}

interface OrgRole {
  id: string;
  name: string;
  rank: number;
  permissions: string[];
}

interface OrgMember {
  id: string;
  username: string;
  avatarUrl: string | null;
  role: OrgRole | null;
  joinedAt: string;
}

interface OrgDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  spectrumId: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  isPublic: boolean;
  motd: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner: OrgOwner;
  members: OrgMember[];
  memberCount: number;
  isMember?: boolean;
  joinRequestStatus?: string | null;
  myRole?: OrgRole | null;
}

interface OrgAnnouncement {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  author: { id: string; username: string };
}

interface OrgActivity {
  id: string;
  type: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  user: { id: string; username: string };
}

type TabKey = "overview" | "members";

interface TabDef {
  key: string;
  label: string;
  href?: string;
}

const INLINE_TABS: TabDef[] = [
  { key: "overview", label: "Overview" },
  { key: "members", label: "Members" },
];

const NAV_TABS: TabDef[] = [
  { key: "guides", label: "Guides", href: "guides" },
  { key: "fleet", label: "Fleet", href: "fleet" },
  { key: "operations", label: "Operations", href: "operations" },
  { key: "treasury", label: "Treasury", href: "treasury" },
  { key: "calendar", label: "Calendar", href: "calendar" },
  { key: "recruitment", label: "Recruitment", href: "recruitment" },
];

export default function OrgDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [org, setOrg] = useState<OrgDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joinMsg, setJoinMsg] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferTarget, setTransferTarget] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [announcements, setAnnouncements] = useState<OrgAnnouncement[]>([]);
  const [activities, setActivities] = useState<OrgActivity[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    fetchOrg();
  }, [user, authLoading, slug]);

  async function fetchOrg() {
    setLoading(true);
    setError(null);
    const res = await apiFetch<OrgDetail>(`/api/orgs/${slug}`);
    if (res.success && res.data) {
      setOrg(res.data);
      // Fetch announcements and activity for overview
      const [annRes, actRes] = await Promise.all([
        apiFetch<OrgAnnouncement[]>(`/api/orgs/${res.data.id}/announcements`),
        apiFetch<OrgActivity[]>(`/api/orgs/${res.data.id}/activity?limit=10`),
      ]);
      if (annRes.success && annRes.data) setAnnouncements(annRes.data);
      if (actRes.success && actRes.data) setActivities(actRes.data);
    } else {
      setError(res.error || "Failed to load organization");
    }
    setLoading(false);
  }

  async function handleJoinRequest() {
    if (!org) return;
    setJoining(true);
    setJoinMsg(null);
    const res = await apiFetch(`/api/orgs/${org.id}/join`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    if (res.success) {
      setJoinMsg("Join request sent! An org leader will review it.");
      await fetchOrg();
    } else {
      setJoinMsg(res.error || "Failed to send join request");
    }
    setJoining(false);
  }

  async function handleLeaveOrg() {
    if (!org || !user) return;
    if (!confirm("Are you sure you want to leave this organization?")) return;
    setLeaving(true);
    const res = await apiFetch(`/api/orgs/${org.id}/members/${user.id}`, {
      method: "DELETE",
    });
    if (res.success) {
      router.push("/orgs");
    } else {
      setError(res.error || "Failed to leave organization");
      setLeaving(false);
    }
  }

  async function handleTransferAndLeave() {
    if (!org || !user || !transferTarget) return;
    setLeaving(true);
    setError(null);

    // Transfer ownership
    const transferRes = await apiFetch(`/api/orgs/${org.id}/transfer`, {
      method: "POST",
      body: JSON.stringify({ newOwnerId: transferTarget }),
    });
    if (!transferRes.success) {
      setError(transferRes.error || "Failed to transfer ownership");
      setLeaving(false);
      return;
    }

    // Now leave the org
    const leaveRes = await apiFetch(`/api/orgs/${org.id}/members/${user.id}`, {
      method: "DELETE",
    });
    if (leaveRes.success) {
      router.push("/orgs");
    } else {
      setError(leaveRes.error || "Failed to leave organization after transfer");
      setLeaving(false);
    }
  }

  function getRoleBadgeClass(role: string): string {
    switch (role.toLowerCase()) {
      case "owner":
        return `${styles.roleBadge} ${styles.roleBadgeOwner}`;
      case "admin":
      case "officer":
        return `${styles.roleBadge} ${styles.roleBadgeOfficer}`;
      default:
        return `${styles.roleBadge} ${styles.roleBadgeMember}`;
    }
  }

  if (authLoading || loading) {
    return (
      <div className={styles.orgDetailPage}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.orgDetailPage}>
        <div className={styles.emptyState}>Sign in to view organization details.</div>
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className={styles.orgDetailPage}>
        <Link href="/orgs" className={styles.backLink}>
          Back to Organizations
        </Link>
        <div className={styles.emptyState}>{error || "Organization not found"}</div>
      </div>
    );
  }

  const isOwner = user.id === org.ownerId;
  const isMember = org.isMember ?? !!org.myRole;

  return (
    <div className={styles.orgDetailPage}>
      <Link href="/orgs" className={styles.backLink}>
        Back to Organizations
      </Link>

      {/* Banner */}
      <div className={styles.banner}>
        {org.bannerUrl ? (
          <img src={org.bannerUrl} alt={`${org.name} banner`} className={styles.bannerImg} />
        ) : (
          <div className={styles.bannerPlaceholder} />
        )}
      </div>

      {/* Org Header */}
      <div className={styles.orgHeader}>
        <div className={styles.orgLogoWrap}>
          {org.logoUrl ? (
            <img src={org.logoUrl} alt={org.name} className={styles.orgLogoImg} />
          ) : (
            <div className={styles.orgLogoPlaceholder}>
              {org.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className={styles.orgHeaderInfo}>
          <h1 className={styles.orgName}>{org.name}</h1>
          {org.description && (
            <p className={styles.orgDescription}>{org.description}</p>
          )}
          <div className={styles.orgMeta}>
            <span>{org.memberCount} member{org.memberCount !== 1 ? "s" : ""}</span>
            <span>Owner: {org.owner.username}</span>
            {org.spectrumId && <span>Spectrum: {org.spectrumId}</span>}
          </div>
        </div>
        <div className={styles.orgActions}>
          {isOwner && (
            <Link href={`/orgs/${org.slug}/dashboard`} className={styles.dashboardBtn}>
              Dashboard
            </Link>
          )}
          {isMember && !isOwner && (
            <button
              className={styles.leaveBtn}
              onClick={handleLeaveOrg}
              disabled={leaving}
            >
              {leaving ? "Leaving..." : "Leave Organization"}
            </button>
          )}
          {isMember && isOwner && org.memberCount > 1 && (
            <button
              className={styles.leaveBtn}
              onClick={() => setShowTransfer(true)}
              disabled={leaving}
            >
              Transfer & Leave
            </button>
          )}
          {!isMember && org.isPublic && (
            <div className={styles.joinInfo}>
              {org.joinRequestStatus === "PENDING" ? (
                <span className={styles.pendingBadge}>Request Pending</span>
              ) : org.joinRequestStatus === "DENIED" ? (
                <>
                  <span className={styles.deniedBadge}>Request Denied</span>
                  <button
                    className={styles.dashboardBtn}
                    onClick={handleJoinRequest}
                    disabled={joining}
                  >
                    {joining ? "Sending..." : "Request Again"}
                  </button>
                </>
              ) : (
                <button
                  className={styles.dashboardBtn}
                  onClick={handleJoinRequest}
                  disabled={joining}
                >
                  {joining ? "Sending..." : "Request to Join"}
                </button>
              )}
              {joinMsg && <div className={styles.joinMsg}>{joinMsg}</div>}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {INLINE_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.key as TabKey)}
          >
            {tab.label}
          </button>
        ))}
        {isMember && NAV_TABS.map((tab) => (
          <Link
            key={tab.key}
            href={`/orgs/${org.slug}/${tab.href}`}
            className={styles.tab}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === "overview" && (
          <div className={styles.overviewTab}>
            <div className={styles.overviewSection}>
              <h3 className={styles.overviewSectionTitle}>About</h3>
              <p className={styles.overviewText}>
                {org.description || "No description provided."}
              </p>
            </div>
            <div className={styles.overviewSection}>
              <h3 className={styles.overviewSectionTitle}>Details</h3>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Created</span>
                  <span className={styles.detailValue}>
                    {new Date(org.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Visibility</span>
                  <span className={styles.detailValue}>
                    {org.isPublic ? "Public" : "Private"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Members</span>
                  <span className={styles.detailValue}>{org.memberCount}</span>
                </div>
                {org.spectrumId && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Spectrum ID</span>
                    <span className={styles.detailValue}>{org.spectrumId}</span>
                  </div>
                )}
              </div>
            </div>
            {/* MOTD */}
            {org.motd && (
              <div className={styles.overviewSection}>
                <h3 className={styles.overviewSectionTitle}>Message of the Day</h3>
                <div className={styles.motdBox}>
                  {org.motd}
                </div>
              </div>
            )}

            {/* Announcements */}
            {announcements.length > 0 && (
              <div className={styles.overviewSection}>
                <h3 className={styles.overviewSectionTitle}>Announcements</h3>
                <div className={styles.announcementList}>
                  {announcements.slice(0, 5).map((ann) => (
                    <div key={ann.id} className={styles.announcementCard}>
                      <div className={styles.announcementHeader}>
                        <span className={styles.announcementTitle}>
                          {ann.isPinned && "📌 "}{ann.title}
                        </span>
                        <span className={styles.announcementMeta}>
                          {ann.author.username} &middot;{" "}
                          {new Date(ann.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={styles.announcementContent}>{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {activities.length > 0 && (
              <div className={styles.overviewSection}>
                <h3 className={styles.overviewSectionTitle}>Recent Activity</h3>
                <div className={styles.activityList}>
                  {activities.map((act) => (
                    <div key={act.id} className={styles.activityItem}>
                      <span className={styles.activityUser}>{act.user.username}</span>
                      <span className={styles.activityType}>
                        {act.type.replace(/_/g, " ")}
                      </span>
                      <span className={styles.activityTime}>
                        {new Date(act.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "members" && (
          <div className={styles.membersTab}>
            <h3 className={styles.tabSectionTitle}>
              Members ({org.members.length})
            </h3>
            {org.members.length === 0 ? (
              <div className={styles.emptyState}>No members to display.</div>
            ) : (
              <div className={styles.memberList}>
                {org.members.map((member) => (
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
                      {member.role && (
                        <span className={getRoleBadgeClass(member.role.name)}>
                          {member.role.name}
                        </span>
                      )}
                    </div>
                    <div className={styles.memberJoined}>
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Transfer Ownership Modal */}
      {showTransfer && org && user && (
        <div className={styles.modalOverlay} onClick={() => setShowTransfer(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Transfer Ownership</h3>
            <p className={styles.modalText}>
              Select a member to become the new owner before you leave.
            </p>
            <select
              className={styles.modalSelect}
              value={transferTarget}
              onChange={(e) => setTransferTarget(e.target.value)}
            >
              <option value="">Select a member...</option>
              {org.members
                .filter((m) => m.id !== user.id)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.username} {m.role ? `(${m.role.name})` : ""}
                  </option>
                ))}
            </select>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.modalActions}>
              <button
                className={styles.leaveBtn}
                onClick={handleTransferAndLeave}
                disabled={!transferTarget || leaving}
              >
                {leaving ? "Transferring..." : "Transfer & Leave"}
              </button>
              <button
                className={styles.dashboardBtn}
                onClick={() => {
                  setShowTransfer(false);
                  setTransferTarget("");
                  setError(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
