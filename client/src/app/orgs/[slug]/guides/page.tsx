"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { OrgGuideDTO, GuideCategory } from "@magpie/shared";
import MarkdownHelpModal from "./MarkdownHelpModal";
import styles from "./guides.module.css";

const CATEGORY_LABELS: Record<GuideCategory, string> = {
  RANKS: "Ranks & Progression",
  OPERATIONS: "Operations",
  TREASURY: "Treasury",
  RULES: "Rules & Policies",
  GENERAL: "General",
};

const CATEGORY_ORDER: GuideCategory[] = ["RANKS", "OPERATIONS", "TREASURY", "RULES", "GENERAL"];

interface OrgInfo {
  id: string;
  ownerId: string;
  myRole?: { permissions: string[] } | null;
}

export default function GuidesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const { user, loading: authLoading } = useAuth();

  const [orgInfo, setOrgInfo] = useState<OrgInfo | null>(null);
  const [guides, setGuides] = useState<OrgGuideDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create form state
  const [showCreate, setShowCreate] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createContent, setCreateContent] = useState("");
  const [createCategory, setCreateCategory] = useState<GuideCategory>("GENERAL");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [showMdHelp, setShowMdHelp] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    fetchOrgAndGuides();
  }, [user, authLoading, slug]);

  async function fetchOrgAndGuides() {
    setLoading(true);
    setError(null);

    const orgRes = await apiFetch<OrgInfo>(`/api/orgs/${slug}`);
    if (!orgRes.success || !orgRes.data) {
      setError(orgRes.error || "Failed to load organization");
      setLoading(false);
      return;
    }

    setOrgInfo(orgRes.data);

    const guidesRes = await apiFetch<OrgGuideDTO[]>(`/api/orgs/${orgRes.data.id}/guides`);
    if (guidesRes.success && guidesRes.data) {
      setGuides(guidesRes.data);
    } else {
      setError(guidesRes.error || "Failed to load guides");
    }
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!orgInfo) return;
    setCreating(true);
    setCreateError(null);

    const res = await apiFetch<OrgGuideDTO>(`/api/orgs/${orgInfo.id}/guides`, {
      method: "POST",
      body: JSON.stringify({
        title: createTitle,
        content: createContent,
        category: createCategory,
      }),
    });

    if (res.success) {
      setCreateTitle("");
      setCreateContent("");
      setCreateCategory("GENERAL");
      setShowCreate(false);
      await fetchOrgAndGuides();
    } else {
      setCreateError(res.error || "Failed to create guide");
    }
    setCreating(false);
  }

  const canManage = orgInfo
    ? user?.id === orgInfo.ownerId ||
      orgInfo.myRole?.permissions?.includes("manage_guides")
    : false;

  // Group guides by category
  const guidesByCategory: Partial<Record<GuideCategory, OrgGuideDTO[]>> = {};
  for (const guide of guides) {
    const cat = guide.category;
    if (!guidesByCategory[cat]) guidesByCategory[cat] = [];
    guidesByCategory[cat]!.push(guide);
  }

  if (authLoading || loading) {
    return (
      <div className={styles.guidesPage}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.guidesPage}>
        <div className={styles.emptyState}>Sign in to view org guides.</div>
      </div>
    );
  }

  return (
    <div className={styles.guidesPage}>
      <Link href={`/orgs/${slug}`} className={styles.backLink}>
        &larr; Back to Org
      </Link>

      <h1 className={styles.title}>Organization Guides</h1>

      {error && <div className={styles.error}>{error}</div>}

      {canManage && (
        <div className={styles.managementSection}>
          {!showCreate ? (
            <button className={styles.editBtn} onClick={() => setShowCreate(true)}>
              Create New Guide
            </button>
          ) : (
            <form className={styles.createForm} onSubmit={handleCreate}>
              <div className={styles.formGroup}>
                <label htmlFor="guide-title">Title</label>
                <input
                  id="guide-title"
                  type="text"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  required
                  maxLength={200}
                  placeholder="Guide title"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="guide-category">Category</label>
                <select
                  id="guide-category"
                  value={createCategory}
                  onChange={(e) => setCreateCategory(e.target.value as GuideCategory)}
                >
                  {CATEGORY_ORDER.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.labelWithHelp}>
                  <label htmlFor="guide-content">Content (Markdown supported)</label>
                  <button
                    type="button"
                    className={styles.mdHelpBtn}
                    onClick={() => setShowMdHelp(true)}
                    title="Markdown formatting help"
                  >
                    ?
                  </button>
                </div>
                <textarea
                  id="guide-content"
                  value={createContent}
                  onChange={(e) => setCreateContent(e.target.value)}
                  required
                  placeholder="Write your guide content here... Markdown is supported."
                />
              </div>
              {createError && <div className={styles.error}>{createError}</div>}
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitBtn} disabled={creating}>
                  {creating ? "Creating..." : "Create Guide"}
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowCreate(false);
                    setCreateError(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {guides.length === 0 ? (
        <div className={styles.emptyState}>
          No guides have been created yet.
          {canManage && " Use the button above to create the first guide."}
        </div>
      ) : (
        CATEGORY_ORDER.filter((cat) => guidesByCategory[cat]?.length).map((cat) => (
          <div key={cat} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{CATEGORY_LABELS[cat]}</h2>
            <div className={styles.guideList}>
              {guidesByCategory[cat]!.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/orgs/${slug}/guides/${guide.id}`}
                  className={styles.guideCard}
                >
                  <span className={styles.guideTitle}>{guide.title}</span>
                  <span className={styles.guideMeta}>
                    by {guide.author.username} &middot;{" "}
                    {new Date(guide.updatedAt).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}

      {showMdHelp && <MarkdownHelpModal onClose={() => setShowMdHelp(false)} />}
    </div>
  );
}
