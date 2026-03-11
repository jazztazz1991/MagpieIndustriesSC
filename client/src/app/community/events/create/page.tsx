"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import styles from "../events.module.css";
import communityStyles from "../../community.module.css";

interface GroupOption {
  id: string;
  name: string;
}

const EVENT_TYPES = [
  { value: "mining", label: "Mining" },
  { value: "salvage", label: "Salvage" },
  { value: "combat", label: "Combat" },
  { value: "trade", label: "Trade" },
  { value: "social", label: "Social" },
  { value: "other", label: "Other" },
];

export default function CreateEventPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [groups, setGroups] = useState<GroupOption[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  const [groupId, setGroupId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("social");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoadingGroups(false);
      return;
    }

    apiFetch<GroupOption[]>("/api/groups/my")
      .then((res) => {
        if (res.success && res.data) {
          setGroups(res.data);
          if (res.data.length > 0) {
            setGroupId(res.data[0].id);
          }
        }
      })
      .finally(() => setLoadingGroups(false));
  }, [user, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!groupId) {
      setError("Please select a group");
      setSubmitting(false);
      return;
    }

    if (!startsAt) {
      setError("Please select a start date and time");
      setSubmitting(false);
      return;
    }

    const body: Record<string, string> = {
      groupId,
      title,
      eventType,
      startsAt: new Date(startsAt).toISOString(),
    };

    if (description.trim()) {
      body.description = description.trim();
    }

    if (endsAt) {
      body.endsAt = new Date(endsAt).toISOString();
    }

    const res = await apiFetch<{ id: string }>("/api/events", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (res.success && res.data) {
      router.push(`/community/events/${res.data.id}`);
    } else {
      setError(res.error || "Failed to create event");
    }
    setSubmitting(false);
  };

  if (authLoading || loadingGroups) {
    return <div className={communityStyles.emptyState}>Loading...</div>;
  }

  if (!user) {
    return (
      <div className={communityStyles.emptyState}>
        Please sign in to create an event.
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div>
        <Link href="/community/events" className={styles.backLink}>
          Back to Events
        </Link>
        <div className={communityStyles.emptyState}>
          You need to join a group before creating an event.
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/community/events" className={styles.backLink}>
        Back to Events
      </Link>

      <h2 className={styles.headerTitle}>Create Event</h2>

      {error && <p className={communityStyles.errorMsg}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.createForm}>
        <div className={styles.formField}>
          <label htmlFor="event-group" className={styles.formLabel}>
            Group
          </label>
          <select
            id="event-group"
            className={styles.formSelect}
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formField}>
          <label htmlFor="event-title" className={styles.formLabel}>
            Title
          </label>
          <input
            id="event-title"
            type="text"
            className={styles.formInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
            minLength={3}
            maxLength={100}
            required
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="event-description" className={styles.formLabel}>
            Description (optional)
          </label>
          <textarea
            id="event-description"
            className={styles.formTextarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this event about?"
            maxLength={1000}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="event-type" className={styles.formLabel}>
            Event Type
          </label>
          <select
            id="event-type"
            className={styles.formSelect}
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            {EVENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formField}>
          <label htmlFor="event-starts" className={styles.formLabel}>
            Start Date & Time
          </label>
          <input
            id="event-starts"
            type="datetime-local"
            className={styles.formInput}
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            required
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="event-ends" className={styles.formLabel}>
            End Date & Time (optional)
          </label>
          <input
            id="event-ends"
            type="datetime-local"
            className={styles.formInput}
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
