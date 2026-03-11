"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import styles from "./CommentSection.module.css";

interface CommentUser {
  id: string;
  username: string;
  rsiHandle: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
}

interface Comment {
  id: string;
  content: string;
  guidePath: string;
  createdAt: string;
  updatedAt: string;
  user: CommentUser;
}

interface CommentSectionProps {
  guidePath: string;
}

function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? "s" : ""} ago`;
  if (diffDay === 1) return "yesterday";
  if (diffDay < 30) return `${diffDay} days ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function CommentSection({ guidePath }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(() => {
    setLoading(true);
    apiFetch<Comment[]>(
      `/api/comments?guidePath=${encodeURIComponent(guidePath)}`
    )
      .then((res) => {
        if (res.success && res.data) {
          setComments(res.data);
        } else {
          setError(res.error ?? "Failed to load comments");
        }
      })
      .catch(() => setError("Failed to load comments"))
      .finally(() => setLoading(false));
  }, [guidePath]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await apiFetch<Comment>("/api/comments", {
        method: "POST",
        body: JSON.stringify({ guidePath, content: content.trim() }),
      });

      if (res.success && res.data) {
        setComments((prev) => [res.data!, ...prev]);
        setContent("");
      } else {
        setError(res.error ?? "Failed to post comment");
      }
    } catch {
      setError("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const res = await apiFetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (res.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } else {
        setError(res.error ?? "Failed to delete comment");
      }
    } catch {
      setError("Failed to delete comment");
    }
  };

  return (
    <div className={styles.commentSection}>
      <h2 className={styles.sectionTitle}>Comments</h2>

      {error && <p className={styles.errorMsg}>{error}</p>}

      {user ? (
        <form className={styles.commentForm} onSubmit={handleSubmit}>
          <textarea
            className={styles.commentTextarea}
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={2000}
          />
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting || !content.trim()}
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className={styles.signInMsg}>Sign in to leave a comment</p>
      )}

      {loading ? (
        <p className={styles.loading}>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className={styles.emptyState}>
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div className={styles.commentList}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentHeader}>
                <div>
                  <span className={styles.commentAuthor}>
                    {comment.user.username}
                  </span>
                  <span className={styles.commentTime}>
                    {" "}
                    {getRelativeTime(comment.createdAt)}
                  </span>
                </div>
                {user &&
                  (user.id === comment.user.id || user.role === "ADMIN") && (
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(comment.id)}
                    >
                      Delete
                    </button>
                  )}
              </div>
              <div className={styles.commentBody}>{comment.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
