"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import styles from "./recruitment.module.css";

interface PublicRecruitmentPost {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  createdAt: string;
  org: {
    slug: string;
    name: string;
    logoUrl: string | null;
  };
}

export default function RecruitmentBoardPage() {
  const [posts, setPosts] = useState<PublicRecruitmentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    setError(null);
    const res = await apiFetch<PublicRecruitmentPost[]>("/api/recruitment");
    if (res.success && res.data) {
      setPosts(res.data);
    } else {
      setError(res.error || "Failed to load recruitment posts");
    }
    setLoading(false);
  }

  const filteredPosts = posts.filter((post) =>
    post.org.name.toLowerCase().includes(search.toLowerCase())
  );

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div className={styles.boardPage}>
        <div className={styles.loading}>Loading recruitment posts...</div>
      </div>
    );
  }

  return (
    <div className={styles.boardPage}>
      <h1 className={styles.title}>Recruitment Board</h1>
      <p className={styles.subtitle}>
        Browse open recruitment posts from organizations across the verse.
      </p>

      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Filter by org name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {filteredPosts.length === 0 ? (
        <div className={styles.emptyState}>
          {search
            ? "No recruitment posts match your search."
            : "No open recruitment posts at this time."}
        </div>
      ) : (
        <div className={styles.postGrid}>
          {filteredPosts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              <div className={styles.orgInfo}>
                {post.org.logoUrl ? (
                  <img
                    src={post.org.logoUrl}
                    alt={`${post.org.name} logo`}
                    className={styles.orgLogo}
                  />
                ) : (
                  <div className={styles.orgLogoPlaceholder}>
                    {post.org.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className={styles.orgName}>{post.org.name}</span>
              </div>
              <div className={styles.postTitle}>{post.title}</div>
              <div className={styles.postDesc}>{post.description}</div>
              {post.requirements && (
                <div className={styles.requirements}>
                  <span className={styles.requirementsLabel}>
                    Requirements:
                  </span>
                  <span className={styles.requirementsText}>
                    {post.requirements}
                  </span>
                </div>
              )}
              <div className={styles.postFooter}>
                <span className={styles.postDate}>
                  Posted {formatDate(post.createdAt)}
                </span>
                <Link
                  href={`/orgs/${post.org.slug}`}
                  className={styles.viewOrgLink}
                >
                  View Org
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
