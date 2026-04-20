"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [rsiHandle, setRsiHandle] = useState(user?.rsiHandle || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [publicProfile, setPublicProfile] = useState(user?.publicProfile || false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  if (loading) return <div className={styles.page}>Loading...</div>;
  if (!user)
    return (
      <div className={styles.page}>
        <p>Please sign in to view your profile.</p>
      </div>
    );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await apiFetch("/api/auth/me", {
      method: "PATCH",
      body: JSON.stringify({ rsiHandle, bio, publicProfile }),
    });

    if (res.success) {
      setMessage("Profile updated!");
    } else {
      setMessage(res.error || "Failed to update profile");
    }
    setSaving(false);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Profile</h1>

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} />
            ) : (
              <span>{user.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h2>{user.username}</h2>
            {user.email && <p className={styles.meta}>{user.email}</p>}
            <span className={styles.role}>{user.role}</span>
          </div>
        </div>

        <form onSubmit={handleSave} className={styles.form}>
          <label htmlFor="rsi-handle" className={styles.field}>
            <span>RSI Handle</span>
            <input
              id="rsi-handle"
              type="text"
              value={rsiHandle}
              onChange={(e) => setRsiHandle(e.target.value)}
              placeholder="Your Star Citizen username"
              className={styles.input}
            />
          </label>

          <label htmlFor="profile-bio" className={styles.field}>
            <span>Bio</span>
            <textarea
              id="profile-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className={styles.textarea}
              rows={4}
            />
          </label>

          <label className={styles.field} style={{ flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              checked={publicProfile}
              onChange={(e) => setPublicProfile(e.target.checked)}
            />
            <span style={{ flex: 1 }}>
              Public profile
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 400, marginTop: "0.15rem" }}>
                Let others view your profile and inventory at{" "}
                <code style={{ fontSize: "0.8rem" }}>/u/{user.username}</code>
              </div>
            </span>
          </label>

          {publicProfile && (
            <div style={{ fontSize: "0.8rem", marginTop: "-0.25rem" }}>
              <Link href={`/u/${user.username}`} style={{ color: "var(--accent)" }}>
                View your public profile →
              </Link>
            </div>
          )}

          {message && <p className={styles.message}>{message}</p>}

          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
