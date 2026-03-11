"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import styles from "./recruitment.module.css";

interface RecruitmentPost {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  isOpen: boolean;
  createdAt: string;
}

export default function OrgRecruitmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const { user, loading: authLoading } = useAuth();

  const [orgId, setOrgId] = useState<string>("");
  const [posts, setPosts] = useState<RecruitmentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [createReqs, setCreateReqs] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ id: string }>(`/api/orgs/${slug}`).then((res) => {
      if (res.success && res.data) setOrgId(res.data.id);
    });
  }, [slug]);

  useEffect(() => {
    if (!orgId) return;
    fetchPosts();
  }, [orgId]);

  async function fetchPosts() {
    setLoading(true);
    setError(null);
    const res = await apiFetch<RecruitmentPost[]>(
      `/api/recruitment/org/${orgId}`
    );
    if (res.success && res.data) {
      setPosts(res.data);
    } else {
      setError(res.error || "Failed to load recruitment posts");
    }
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);

    const res = await apiFetch(`/api/recruitment/org/${orgId}`, {
      method: "POST",
      body: JSON.stringify({
        title: createTitle,
        description: createDesc,
        requirements: createReqs || undefined,
      }),
    });

    if (res.success) {
      setShowCreate(false);
      setCreateTitle("");
      setCreateDesc("");
      setCreateReqs("");
      await fetchPosts();
    } else {
      setCreateError(res.error || "Failed to create post");
    }
    setCreating(false);
  }

  async function handleToggleStatus(postId: string, isOpen: boolean) {
    const res = await apiFetch(`/api/recruitment/org/${orgId}/${postId}`, {
      method: "PATCH",
      body: JSON.stringify({ isOpen: !isOpen }),
    });
    if (res.success) {
      await fetchPosts();
    }
  }

  async function handleDelete(postId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this recruitment post?"
    );
    if (!confirmed) return;

    const res = await apiFetch(`/api/recruitment/org/${orgId}/${postId}`, {
      method: "DELETE",
    });
    if (res.success) {
      await fetchPosts();
    }
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (authLoading || (!orgId && !error)) {
    return (
      <div className={styles.recruitmentPage}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.recruitmentPage}>
        <div className={styles.emptyState}>
          Sign in to manage recruitment posts.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.recruitmentPage}>
        <Link href={`/orgs/${slug}`} className={styles.backLink}>
          &larr; Back to Org
        </Link>
        <div className={styles.loading}>Loading recruitment posts...</div>
      </div>
    );
  }

  return (
    <div className={styles.recruitmentPage}>
      <Link href={`/orgs/${slug}`} className={styles.backLink}>
        &larr; Back to Org
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>Recruitment</h1>
        <button
          className={styles.createBtn}
          onClick={() => setShowCreate(!showCreate)}
        >
          {showCreate ? "Cancel" : "Create Post"}
        </button>
      </div>

      {showCreate && (
        <form className={styles.createForm} onSubmit={handleCreate}>
          <div className={styles.createFormTitle}>New Recruitment Post</div>
          <div className={styles.formGroup}>
            <label htmlFor="post-title">Title</label>
            <input
              id="post-title"
              type="text"
              value={createTitle}
              onChange={(e) => setCreateTitle(e.target.value)}
              required
              maxLength={100}
              placeholder="Post title"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="post-desc">Description</label>
            <textarea
              id="post-desc"
              value={createDesc}
              onChange={(e) => setCreateDesc(e.target.value)}
              required
              maxLength={1000}
              placeholder="Describe the role or what you're looking for"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="post-reqs">Requirements (optional)</label>
            <textarea
              id="post-reqs"
              value={createReqs}
              onChange={(e) => setCreateReqs(e.target.value)}
              maxLength={500}
              placeholder="Any specific requirements for applicants"
            />
          </div>
          {createError && <div className={styles.error}>{createError}</div>}
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.formSubmit}
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Post"}
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

      {posts.length === 0 ? (
        <div className={styles.emptyState}>
          No recruitment posts yet. Create one to start recruiting!
        </div>
      ) : (
        <div className={styles.postList}>
          {posts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              <div className={styles.postHeader}>
                <div className={styles.postTitle}>{post.title}</div>
                <span
                  className={
                    post.isOpen
                      ? styles.badgeOpen
                      : styles.badgeClosed
                  }
                >
                  {post.isOpen ? "Open" : "Closed"}
                </span>
              </div>
              <div className={styles.postDesc}>
                {post.description.length > 200
                  ? `${post.description.slice(0, 200)}...`
                  : post.description}
              </div>
              <div className={styles.postMeta}>
                Created {formatDate(post.createdAt)}
              </div>
              <div className={styles.postActions}>
                <button
                  className={styles.toggleBtn}
                  onClick={() => handleToggleStatus(post.id, post.isOpen)}
                >
                  {post.isOpen ? "Close Post" : "Reopen Post"}
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
