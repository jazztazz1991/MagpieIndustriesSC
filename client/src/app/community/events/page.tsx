"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import styles from "./events.module.css";
import communityStyles from "../community.module.css";

interface EventSummary {
  id: string;
  title: string;
  eventType: string;
  startsAt: string;
  endsAt: string | null;
  creator: { id: string; username: string };
  group: { id: string; name: string };
  attendeeCount: number;
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  mining: "Mining",
  salvage: "Salvage",
  combat: "Combat",
  trade: "Trade",
  social: "Social",
  other: "Other",
};

const EVENT_TYPE_STYLE: Record<string, string> = {
  mining: styles.eventTypeMining,
  salvage: styles.eventTypeSalvage,
  combat: styles.eventTypeCombat,
  trade: styles.eventTypeTrade,
  social: styles.eventTypeSocial,
  other: styles.eventTypeOther,
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventsPage() {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    apiFetch<EventSummary[]>("/api/events")
      .then((res) => {
        if (res.success && res.data) {
          setEvents(res.data);
        } else {
          setError(res.error || "Failed to load events");
        }
      })
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div className={communityStyles.emptyState}>Loading...</div>;
  }

  if (!user) {
    return (
      <div className={communityStyles.emptyState}>
        Please sign in to view events.
      </div>
    );
  }

  return (
    <div>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Events</span>
        <Link href="/community/events/create" className={styles.createBtn}>
          Create Event
        </Link>
      </div>

      {error && <p className={communityStyles.errorMsg}>{error}</p>}

      {events.length === 0 && !error ? (
        <div className={communityStyles.emptyState}>
          No upcoming events. Join a group and create one!
        </div>
      ) : (
        <div className={styles.eventList}>
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/community/events/${event.id}`}
              className={styles.eventCard}
            >
              <div className={styles.eventCardTop}>
                <span className={styles.eventCardTitle}>{event.title}</span>
                <span
                  className={`${styles.eventType} ${EVENT_TYPE_STYLE[event.eventType] || styles.eventTypeOther}`}
                >
                  {EVENT_TYPE_LABELS[event.eventType] || event.eventType}
                </span>
              </div>
              <div className={styles.eventCardMeta}>
                <span className={styles.eventTime}>
                  {formatDate(event.startsAt)}
                </span>
                <span className={styles.eventCardGroup}>
                  {event.group.name}
                </span>
                <span className={styles.attendeeCount}>
                  {event.attendeeCount} attending
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
