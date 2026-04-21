"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import shared from "../../tools/tools.module.css";

interface OrgSummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  isPublic: boolean;
  memberCount: number;
  createdAt: string;
  owner: { id: string; username: string };
}

export default function CommunityOrgsPage() {
  const { user, loading: authLoading } = useAuth();
  const [orgs, setOrgs] = useState<OrgSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (authLoading) return;
    apiFetch<OrgSummary[]>("/api/orgs/discover").then((res) => {
      if (res.success && res.data) setOrgs(res.data);
      setLoading(false);
    });
  }, [authLoading]);

  const filtered = useMemo(() => {
    if (!filter.trim()) return orgs;
    const q = filter.toLowerCase();
    return orgs.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.description?.toLowerCase().includes(q) ||
        o.owner.username.toLowerCase().includes(q)
    );
  }, [orgs, filter]);

  if (loading) return <div className={shared.emptyMessage}>Loading orgs...</div>;

  return (
    <div>
      {!user && (
        <div className={shared.emptyMessage} style={{ marginBottom: "1rem", fontSize: "0.85rem" }}>
          <Link href="/auth/signin" style={{ color: "var(--accent)" }}>Sign in</Link> to request joining an org.
        </div>
      )}

      <input
        type="text"
        placeholder="Search orgs..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className={shared.input}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      {filtered.length === 0 ? (
        <div className={shared.emptyMessage}>
          {filter ? `No orgs match "${filter}"` : "No public orgs to discover right now."}
        </div>
      ) : (
        <div className={shared.methodGrid}>
          {filtered.map((org) => (
            <Link
              key={org.id}
              href={`/orgs/${org.slug}`}
              className={shared.methodCard}
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <div
                  style={{
                    width: 48, height: 48, borderRadius: 8,
                    background: "rgba(74, 158, 255, 0.15)",
                    color: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "1.4rem",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  {org.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={org.logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    org.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: "1rem" }}>{org.name}</h3>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    {org.memberCount} member{org.memberCount !== 1 ? "s" : ""} · Owner: {org.owner.username}
                  </div>
                </div>
              </div>
              {org.description && (
                <p style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  margin: "0.25rem 0 0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}>
                  {org.description}
                </p>
              )}
              <div style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--accent)" }}>
                View org →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
