"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import shared from "../../tools/tools.module.css";

interface PublicProfile {
  username: string;
  rsiHandle: string | null;
  avatarUrl: string | null;
  bio: string | null;
  memberSince: string;
  inventory: Array<{ itemName: string; totalCount: number }>;
}

export default function PublicProfilePage() {
  const { handle } = useParams<{ handle: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundErr, setNotFoundErr] = useState(false);

  useEffect(() => {
    if (!handle) return;
    apiFetch<PublicProfile>(`/api/auth/public/${encodeURIComponent(handle)}`).then((res) => {
      if (res.success && res.data) {
        setProfile(res.data);
      } else {
        setNotFoundErr(true);
      }
      setLoading(false);
    });
  }, [handle]);

  if (loading) return <div className={shared.page}><div className={shared.emptyMessage}>Loading...</div></div>;
  if (notFoundErr || !profile) {
    return (
      <div className={shared.page}>
        <h1 className={shared.title}>Profile Not Found</h1>
        <p className={shared.subtitle}>
          This user doesn&apos;t have a public profile, or they don&apos;t exist.
        </p>
        <Link href="/" style={{ color: "var(--accent)" }}>← Back to home</Link>
      </div>
    );
  }

  return (
    <div className={shared.page}>
      <div className={shared.panel}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
          <div
            style={{
              width: "80px", height: "80px", borderRadius: "50%",
              background: "var(--border)", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "2rem", fontWeight: 700,
              color: "var(--text-primary)",
              overflow: "hidden",
            }}
          >
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt={profile.username} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              profile.username.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h1 style={{ margin: 0 }}>{profile.username}</h1>
            {profile.rsiHandle && (
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                RSI: {profile.rsiHandle}
              </div>
            )}
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
              Member since {new Date(profile.memberSince).toLocaleDateString(undefined, { year: "numeric", month: "long" })}
            </div>
          </div>
        </div>
        {profile.bio && (
          <div style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--text-primary)", padding: "0.75rem", background: "var(--bg-secondary)", borderRadius: "6px" }}>
            {profile.bio}
          </div>
        )}
      </div>

      <div className={shared.panel}>
        <h2 className={shared.panelTitle}>Inventory</h2>
        {profile.inventory.length === 0 ? (
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
            No public inventory yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
            {profile.inventory.map((item) => (
              <div
                key={item.itemName}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.35rem 0.5rem",
                  borderBottom: "1px solid var(--border)",
                  fontSize: "0.9rem",
                }}
              >
                <span>{item.itemName}</span>
                <span style={{ fontWeight: 600, color: "var(--accent)" }}>{item.totalCount}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
