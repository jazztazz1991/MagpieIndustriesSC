"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import styles from "./orgs.module.css";

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

interface OrgSummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  memberCount: number;
  owner: OrgOwner;
  myRole?: OrgRole | null;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export default function OrgsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [myOrgs, setMyOrgs] = useState<OrgSummary[]>([]);
  const [discoverOrgs, setDiscoverOrgs] = useState<OrgSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const slug = generateSlug(createName);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    fetchOrgs();
  }, [user, authLoading]);

  async function fetchOrgs() {
    setLoading(true);
    setError(null);

    const [myRes, discoverRes] = await Promise.all([
      apiFetch<OrgSummary[]>("/api/orgs"),
      apiFetch<OrgSummary[]>("/api/orgs/discover"),
    ]);

    if (myRes.success && myRes.data) {
      setMyOrgs(myRes.data);
    } else {
      setError(myRes.error || "Failed to load your organizations");
    }

    if (discoverRes.success && discoverRes.data) {
      setDiscoverOrgs(discoverRes.data);
    }

    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);

    const res = await apiFetch<OrgSummary>("/api/orgs", {
      method: "POST",
      body: JSON.stringify({
        name: createName,
        slug,
        description: createDesc || undefined,
      }),
    });

    if (res.success && res.data) {
      setShowCreate(false);
      setCreateName("");
      setCreateDesc("");
      await fetchOrgs();
    } else {
      setCreateError(res.error || "Failed to create organization");
    }
    setCreating(false);
  }

  if (authLoading || loading) {
    return (
      <div className={styles.orgsPage}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.orgsPage}>
        <div className={styles.emptyState}>Sign in to view and create organizations.</div>
      </div>
    );
  }

  return (
    <div className={styles.orgsPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Organizations</h1>
        <button className={styles.createBtn} onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "Cancel" : "Create Organization"}
        </button>
      </div>

      {showCreate && (
        <form className={styles.createForm} onSubmit={handleCreate}>
          <div className={styles.createFormTitle}>Create a New Organization</div>
          <div className={styles.formGroup}>
            <label htmlFor="org-name">Name</label>
            <input
              id="org-name"
              type="text"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              minLength={3}
              maxLength={50}
              required
              placeholder="Organization name (3-50 characters)"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="org-slug">Slug</label>
            <input
              id="org-slug"
              type="text"
              value={slug}
              readOnly
              className={styles.slugInput}
            />
            <span className={styles.slugHint}>Auto-generated from name. Used in the URL: /orgs/{slug}</span>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="org-desc">Description (optional)</label>
            <textarea
              id="org-desc"
              value={createDesc}
              onChange={(e) => setCreateDesc(e.target.value)}
              maxLength={500}
              placeholder="What is this organization about?"
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

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>My Organizations</h2>
        {myOrgs.length === 0 ? (
          <div className={styles.emptyState}>
            You are not a member of any organizations yet. Create one to get started!
          </div>
        ) : (
          <div className={styles.orgList}>
            {myOrgs.map((org) => (
              <Link key={org.id} className={styles.orgCard} href={`/orgs/${org.slug}`}>
                <div className={styles.orgCardLogo}>
                  {org.logoUrl ? (
                    <img src={org.logoUrl} alt={org.name} className={styles.orgLogoImg} />
                  ) : (
                    <div className={styles.orgLogoPlaceholder}>
                      {org.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className={styles.orgCardBody}>
                  <div className={styles.orgCardName}>{org.name}</div>
                  {org.description && (
                    <div className={styles.orgCardDesc}>{org.description}</div>
                  )}
                  <div className={styles.orgCardMeta}>
                    <span>{org.memberCount} member{org.memberCount !== 1 ? "s" : ""}</span>
                    <span>Owner: {org.owner.username}</span>
                    {org.myRole && <span>Role: {org.myRole.name}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Discover Organizations</h2>
        {discoverOrgs.length === 0 ? (
          <div className={styles.emptyState}>No public organizations to discover right now.</div>
        ) : (
          <div className={styles.orgList}>
            {discoverOrgs.map((org) => (
              <Link key={org.id} className={styles.orgCard} href={`/orgs/${org.slug}`}>
                <div className={styles.orgCardLogo}>
                  {org.logoUrl ? (
                    <img src={org.logoUrl} alt={org.name} className={styles.orgLogoImg} />
                  ) : (
                    <div className={styles.orgLogoPlaceholder}>
                      {org.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className={styles.orgCardBody}>
                  <div className={styles.orgCardName}>{org.name}</div>
                  {org.description && (
                    <div className={styles.orgCardDesc}>{org.description}</div>
                  )}
                  <div className={styles.orgCardMeta}>
                    <span>{org.memberCount} member{org.memberCount !== 1 ? "s" : ""}</span>
                    <span>Owner: {org.owner.username}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
