"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Markdown from "react-markdown";
import type { OrgGuideDTO, GuideCategory } from "@magpie/shared";
import MarkdownHelpModal from "../MarkdownHelpModal";
import styles from "../guides.module.css";

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

export default function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string; guideId: string }>;
}) {
  const { slug, guideId } = React.use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [orgInfo, setOrgInfo] = useState<OrgInfo | null>(null);
  const [guide, setGuide] = useState<OrgGuideDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState<GuideCategory>("GENERAL");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showMdHelp, setShowMdHelp] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    fetchData();
  }, [user, authLoading, slug, guideId]);

  async function fetchData() {
    setLoading(true);
    setError(null);

    const orgRes = await apiFetch<OrgInfo>(`/api/orgs/${slug}`);
    if (!orgRes.success || !orgRes.data) {
      setError(orgRes.error || "Failed to load organization");
      setLoading(false);
      return;
    }
    setOrgInfo(orgRes.data);

    const guideRes = await apiFetch<OrgGuideDTO>(
      `/api/orgs/${orgRes.data.id}/guides/${guideId}`
    );
    if (guideRes.success && guideRes.data) {
      setGuide(guideRes.data);
    } else {
      setError(guideRes.error || "Guide not found");
    }
    setLoading(false);
  }

  function startEdit() {
    if (!guide) return;
    setEditTitle(guide.title);
    setEditContent(guide.content);
    setEditCategory(guide.category);
    setEditing(true);
    setSaveError(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!orgInfo || !guide) return;
    setSaving(true);
    setSaveError(null);

    const res = await apiFetch<OrgGuideDTO>(
      `/api/orgs/${orgInfo.id}/guides/${guide.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          category: editCategory,
        }),
      }
    );

    if (res.success && res.data) {
      setGuide(res.data);
      setEditing(false);
    } else {
      setSaveError(res.error || "Failed to save guide");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!orgInfo || !guide) return;
    if (!confirm("Are you sure you want to delete this guide?")) return;
    setDeleting(true);

    const res = await apiFetch(`/api/orgs/${orgInfo.id}/guides/${guide.id}`, {
      method: "DELETE",
    });

    if (res.success) {
      router.push(`/orgs/${slug}/guides`);
    } else {
      setError(res.error || "Failed to delete guide");
      setDeleting(false);
    }
  }

  const canManage = orgInfo
    ? user?.id === orgInfo.ownerId ||
      orgInfo.myRole?.permissions?.includes("manage_guides")
    : false;

  if (authLoading || loading) {
    return (
      <div className={styles.guideDetailPage}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.guideDetailPage}>
        <div className={styles.emptyState}>Sign in to view this guide.</div>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className={styles.guideDetailPage}>
        <Link href={`/orgs/${slug}/guides`} className={styles.backLink}>
          &larr; Back to Guides
        </Link>
        <div className={styles.emptyState}>{error || "Guide not found"}</div>
      </div>
    );
  }

  if (editing) {
    return (
      <div className={styles.guideDetailPage}>
        <Link href={`/orgs/${slug}/guides`} className={styles.backLink}>
          &larr; Back to Guides
        </Link>
        <h1 className={styles.title}>Edit Guide</h1>
        <form className={styles.createForm} onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label htmlFor="edit-title">Title</label>
            <input
              id="edit-title"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              maxLength={200}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="edit-category">Category</label>
            <select
              id="edit-category"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value as GuideCategory)}
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
              <label htmlFor="edit-content">Content (Markdown supported)</label>
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
              id="edit-content"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              required
            />
          </div>
          {saveError && <div className={styles.error}>{saveError}</div>}
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitBtn} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
        {showMdHelp && <MarkdownHelpModal onClose={() => setShowMdHelp(false)} />}
      </div>
    );
  }

  return (
    <div className={styles.guideDetailPage}>
      <Link href={`/orgs/${slug}/guides`} className={styles.backLink}>
        &larr; Back to Guides
      </Link>

      <div className={styles.guideHeader}>
        <h1 className={styles.guideDetailTitle}>{guide.title}</h1>
        <div className={styles.guideDetailMeta}>
          <span className={styles.categoryBadge}>
            {CATEGORY_LABELS[guide.category]}
          </span>
          <span>by {guide.author.username}</span>
          <span>Updated {new Date(guide.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className={styles.guideContent}>
        <Markdown>{guide.content}</Markdown>
      </div>

      {canManage && (
        <div className={styles.managementSection}>
          <div className={styles.managementActions}>
            <button className={styles.editBtn} onClick={startEdit}>
              Edit Guide
            </button>
            <button
              className={styles.deleteBtn}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Guide"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
