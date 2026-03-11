"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toolStyles from "../../tools/tools.module.css";
import styles from "../community.module.css";

interface PublicUser {
  id: string;
  username: string;
  rsiHandle: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
}

interface FriendEntry {
  friendshipId: string;
  since: string;
  user: PublicUser;
}

interface RequestEntry {
  friendshipId: string;
  createdAt: string;
  user: PublicUser;
}

type Tab = "friends" | "requests";

export default function FriendsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("friends");
  const [friends, setFriends] = useState<FriendEntry[]>([]);
  const [requests, setRequests] = useState<RequestEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search / send request state
  const [searchUsername, setSearchUsername] = useState("");
  const [sendStatus, setSendStatus] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const loadFriends = useCallback(async () => {
    const res = await apiFetch<FriendEntry[]>("/api/friends");
    if (res.success && res.data) {
      setFriends(res.data);
    }
  }, []);

  const loadRequests = useCallback(async () => {
    const res = await apiFetch<RequestEntry[]>("/api/friends/requests");
    if (res.success && res.data) {
      setRequests(res.data);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    Promise.all([loadFriends(), loadRequests()])
      .catch(() => setError("Failed to load friends data"))
      .finally(() => setLoading(false));
  }, [user, loadFriends, loadRequests]);

  const handleSendRequest = async () => {
    if (!searchUsername.trim()) return;

    setSending(true);
    setSendError(null);
    setSendStatus(null);

    const res = await apiFetch<{ friendshipId: string }>("/api/friends/request", {
      method: "POST",
      body: JSON.stringify({ username: searchUsername.trim() }),
    });

    if (res.success) {
      setSendStatus(`Friend request sent to ${searchUsername.trim()}`);
      setSearchUsername("");
    } else {
      setSendError(res.error || "Failed to send request");
    }

    setSending(false);
  };

  const handleAccept = async (friendshipId: string) => {
    const res = await apiFetch(`/api/friends/${friendshipId}/accept`, {
      method: "PATCH",
    });

    if (res.success) {
      await Promise.all([loadFriends(), loadRequests()]);
    }
  };

  const handleReject = async (friendshipId: string) => {
    const res = await apiFetch(`/api/friends/${friendshipId}/reject`, {
      method: "PATCH",
    });

    if (res.success) {
      setRequests((prev) => prev.filter((r) => r.friendshipId !== friendshipId));
    }
  };

  const handleRemove = async (friendshipId: string) => {
    const res = await apiFetch(`/api/friends/${friendshipId}`, {
      method: "DELETE",
    });

    if (res.success) {
      setFriends((prev) => prev.filter((f) => f.friendshipId !== friendshipId));
    }
  };

  if (!user) {
    return (
      <div className={styles.emptyState}>
        Sign in to manage your friends list.
      </div>
    );
  }

  if (loading) {
    return <div className={styles.emptyState}>Loading...</div>;
  }

  return (
    <div>
      {/* Search / Send Request */}
      <div className={toolStyles.panel}>
        <h2 className={toolStyles.panelTitle}>Add Friend</h2>
        <div className={styles.searchRow}>
          <input
            type="text"
            className={toolStyles.input}
            placeholder="Enter username..."
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendRequest();
            }}
          />
          <button
            className={styles.actionBtn}
            onClick={handleSendRequest}
            disabled={sending || !searchUsername.trim()}
          >
            {sending ? "Sending..." : "Send Request"}
          </button>
        </div>
        {sendStatus && <p className={styles.successMsg}>{sendStatus}</p>}
        {sendError && <p className={styles.errorMsg}>{sendError}</p>}
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "friends" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("friends")}
        >
          Friends{friends.length > 0 ? ` (${friends.length})` : ""}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "requests" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          Pending Requests
          {requests.length > 0 ? ` (${requests.length})` : ""}
        </button>
      </div>

      {/* Friends Tab */}
      {activeTab === "friends" && (
        <div className={styles.userList}>
          {friends.length === 0 ? (
            <div className={styles.emptyState}>
              No friends yet. Send a friend request to get started!
            </div>
          ) : (
            friends.map((f) => (
              <div key={f.friendshipId} className={styles.userCard}>
                <div className={styles.avatar}>
                  {f.user.avatarUrl ? (
                    <img src={f.user.avatarUrl} alt={f.user.username} />
                  ) : (
                    f.user.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{f.user.username}</div>
                  {f.user.rsiHandle && (
                    <div className={styles.userHandle}>
                      RSI: {f.user.rsiHandle}
                    </div>
                  )}
                </div>
                <div className={styles.userActions}>
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                    onClick={() => handleRemove(f.friendshipId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === "requests" && (
        <div className={styles.userList}>
          {requests.length === 0 ? (
            <div className={styles.emptyState}>
              No pending friend requests.
            </div>
          ) : (
            requests.map((r) => (
              <div key={r.friendshipId} className={styles.userCard}>
                <div className={styles.avatar}>
                  {r.user.avatarUrl ? (
                    <img src={r.user.avatarUrl} alt={r.user.username} />
                  ) : (
                    r.user.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{r.user.username}</div>
                  {r.user.rsiHandle && (
                    <div className={styles.userHandle}>
                      RSI: {r.user.rsiHandle}
                    </div>
                  )}
                  <span className={`${styles.badge} ${styles.badgePending}`}>
                    Pending
                  </span>
                </div>
                <div className={styles.userActions}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => handleAccept(r.friendshipId)}
                  >
                    Accept
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                    onClick={() => handleReject(r.friendshipId)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
