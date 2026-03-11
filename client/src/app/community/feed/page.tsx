"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import styles from "./feed.module.css";

interface ActivityUser {
  id: string;
  username: string;
  rsiHandle: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
}

interface Activity {
  id: string;
  type: string;
  targetId: string | null;
  metadata: Record<string, string> | null;
  createdAt: string;
  user: ActivityUser;
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

function getActivityDescription(activity: Activity): React.ReactNode {
  const username = activity.user.username;
  const meta = activity.metadata;

  switch (activity.type) {
    case "friend_added":
      return (
        <>
          <span className={styles.feedHighlight}>{username}</span> became friends
          with{" "}
          <span className={styles.feedHighlight}>
            {meta?.friendUsername ?? "someone"}
          </span>
        </>
      );
    case "group_created":
      return (
        <>
          <span className={styles.feedHighlight}>{username}</span> created group{" "}
          <span className={styles.feedHighlight}>
            {meta?.groupName ?? "a group"}
          </span>
        </>
      );
    case "group_joined":
      return (
        <>
          <span className={styles.feedHighlight}>{username}</span> joined{" "}
          <span className={styles.feedHighlight}>
            {meta?.groupName ?? "a group"}
          </span>
        </>
      );
    case "event_created":
      return (
        <>
          <span className={styles.feedHighlight}>{username}</span> created event{" "}
          <span className={styles.feedHighlight}>
            {meta?.eventTitle ?? "an event"}
          </span>{" "}
          in{" "}
          <span className={styles.feedHighlight}>
            {meta?.groupName ?? "a group"}
          </span>
        </>
      );
    case "comment_posted":
      return (
        <>
          <span className={styles.feedHighlight}>{username}</span> commented on{" "}
          <span className={styles.feedHighlight}>
            {meta?.guidePath ?? "a guide"}
          </span>
        </>
      );
    default:
      return (
        <>
          <span className={styles.feedHighlight}>{username}</span> performed an
          action
        </>
      );
  }
}

export default function ActivityFeedPage() {
  const { user, loading: authLoading } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    apiFetch<Activity[]>("/api/activity")
      .then((res) => {
        if (res.success && res.data) {
          setActivities(res.data);
        } else {
          setError(res.error ?? "Failed to load activity feed");
        }
      })
      .catch(() => setError("Failed to load activity feed"))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <p className={styles.loading}>Loading activity feed...</p>;
  }

  if (!user) {
    return (
      <div className={styles.emptyState}>
        Sign in to see your activity feed.
      </div>
    );
  }

  if (error) {
    return <p className={styles.errorMsg}>{error}</p>;
  }

  if (activities.length === 0) {
    return (
      <div className={styles.emptyState}>
        No activity yet. Add friends and join groups to see what everyone is up
        to.
      </div>
    );
  }

  return (
    <div>
      <h2>Activity Feed</h2>
      <div className={styles.feedList}>
        {activities.map((activity) => (
          <div key={activity.id} className={styles.feedItem}>
            <div className={styles.feedAvatar}>
              {activity.user.avatarUrl ? (
                <img
                  src={activity.user.avatarUrl}
                  alt={activity.user.username}
                />
              ) : (
                activity.user.username.charAt(0).toUpperCase()
              )}
            </div>
            <div className={styles.feedContent}>
              <div>{getActivityDescription(activity)}</div>
              <div className={styles.feedTime}>
                {getRelativeTime(activity.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
