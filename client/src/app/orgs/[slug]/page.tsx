"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { OrgHeader } from "@/components/orgs/OrgHeader";
import styles from "./orgDetail.module.css";

interface OrgOwner { id: string; username: string; }
interface OrgRole { id: string; name: string; rank: number; permissions: string[]; }
interface OrgMember { id: string; username: string; avatarUrl: string | null; role: OrgRole | null; joinedAt: string; }
interface OrgDetail {
  id: string; name: string; slug: string;
  description: string | null; spectrumId: string | null;
  logoUrl: string | null; bannerUrl: string | null;
  isPublic: boolean; motd: string | null;
  ownerId: string; createdAt: string; updatedAt: string;
  owner: OrgOwner; members: OrgMember[]; memberCount: number;
  isMember?: boolean; joinRequestStatus?: string | null; myRole?: OrgRole | null;
}
interface OrgAnnouncement { id: string; title: string; content: string; isPinned: boolean; createdAt: string; author: { id: string; username: string }; }
interface OrgActivity { id: string; type: string; createdAt: string; user: { id: string; username: string }; }

export default function OrgOverviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [org, setOrg] = useState<OrgDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<OrgAnnouncement[]>([]);
  const [activities, setActivities] = useState<OrgActivity[]>([]);
  const [joining, setJoining] = useState(false);
  const [joinMsg, setJoinMsg] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }

    (async () => {
      setLoading(true);
      const res = await apiFetch<OrgDetail>(`/api/orgs/${slug}`);
      if (res.success && res.data) {
        setOrg(res.data);
        const [annRes, actRes] = await Promise.all([
          apiFetch<OrgAnnouncement[]>(`/api/orgs/${res.data.id}/announcements`),
          apiFetch<OrgActivity[]>(`/api/orgs/${res.data.id}/activity?limit=8`),
        ]);
        if (annRes.success && annRes.data) setAnnouncements(annRes.data);
        if (actRes.success && actRes.data) setActivities(actRes.data);
      } else {
        setError(res.error || "Failed to load organization");
      }
      setLoading(false);
    })();
  }, [user, authLoading, slug]);

  const handleJoin = async () => {
    if (!org) return;
    setJoining(true);
    setJoinMsg(null);
    const res = await apiFetch(`/api/orgs/${org.id}/join`, { method: "POST", body: JSON.stringify({}) });
    if (res.success) {
      setJoinMsg("Join request sent! An org leader will review it.");
    } else {
      setJoinMsg(res.error || "Failed to send join request");
    }
    setJoining(false);
  };

  if (authLoading || loading) return <div className={styles.loading}>Loading...</div>;
  if (!user) return <div className={styles.emptyState}>Sign in to view organization details.</div>;
  if (error || !org) return <div className={styles.emptyState}>{error || "Organization not found"}</div>;

  const isMember = org.isMember ?? !!org.myRole;
  const recentMembers = [...org.members]
    .sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
    .slice(0, 6);

  return (
    <div>
      <OrgHeader
        org={{
          name: org.name,
          description: org.description,
          logoUrl: org.logoUrl,
          bannerUrl: org.bannerUrl,
          motd: org.motd,
          memberCount: org.memberCount,
          ownerName: org.owner.username,
          isPublic: org.isPublic,
        }}
      />

      {/* Non-member CTA */}
      {!isMember && org.isPublic && (
        <div className={styles.overviewSection}>
          {org.joinRequestStatus === "PENDING" ? (
            <span className={styles.pendingBadge}>Join Request Pending</span>
          ) : (
            <>
              <button
                className={styles.dashboardBtn}
                onClick={handleJoin}
                disabled={joining}
              >
                {joining ? "Sending..." : "Request to Join"}
              </button>
              {joinMsg && <div className={styles.joinMsg}>{joinMsg}</div>}
            </>
          )}
        </div>
      )}

      {/* Pinned announcements */}
      {announcements.length > 0 && (
        <div className={styles.overviewSection}>
          <h3 className={styles.overviewSectionTitle}>Announcements</h3>
          <div className={styles.announcementList}>
            {announcements.slice(0, 3).map((ann) => (
              <div key={ann.id} className={styles.announcementCard}>
                <div className={styles.announcementHeader}>
                  <span className={styles.announcementTitle}>
                    {ann.isPinned && "📌 "}{ann.title}
                  </span>
                  <span className={styles.announcementMeta}>
                    {ann.author.username} · {new Date(ann.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={styles.announcementContent}>{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent members */}
      {recentMembers.length > 0 && (
        <div className={styles.overviewSection}>
          <h3 className={styles.overviewSectionTitle}>
            Recent Members <button onClick={() => router.push(`/orgs/${org.slug}/members`)} className={styles.viewAllLink}>View all →</button>
          </h3>
          <div className={styles.memberGrid}>
            {recentMembers.map((m) => (
              <div key={m.id} className={styles.memberCard}>
                {m.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.avatarUrl} alt={m.username} className={styles.memberAvatar} />
                ) : (
                  <div className={styles.memberAvatarPlaceholder}>{m.username.charAt(0).toUpperCase()}</div>
                )}
                <div>
                  <div className={styles.memberName}>{m.username}</div>
                  {m.role && <div className={styles.memberRole}>{m.role.name}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      {activities.length > 0 && (
        <div className={styles.overviewSection}>
          <h3 className={styles.overviewSectionTitle}>Recent Activity</h3>
          <div className={styles.activityList}>
            {activities.map((act) => (
              <div key={act.id} className={styles.activityItem}>
                <span className={styles.activityUser}>{act.user.username}</span>
                <span className={styles.activityType}>{act.type.replace(/_/g, " ").toLowerCase()}</span>
                <span className={styles.activityTime}>{new Date(act.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
