"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import styles from "../events.module.css";
import communityStyles from "../../community.module.css";

interface PublicUser {
  id: string;
  username: string;
  rsiHandle: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
}

interface Attendee {
  id: string;
  status: "GOING" | "MAYBE" | "NOT_GOING";
  user: PublicUser;
}

interface EventDetail {
  id: string;
  title: string;
  description: string | null;
  eventType: string;
  startsAt: string;
  endsAt: string | null;
  createdAt: string;
  creatorId: string;
  creator: PublicUser;
  group: { id: string; name: string };
  attendees: Attendee[];
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

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rsvpLoading, setRsvpLoading] = useState(false);

  const eventId = params.id as string;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    apiFetch<EventDetail>(`/api/events/${eventId}`)
      .then((res) => {
        if (res.success && res.data) {
          setEvent(res.data);
        } else {
          setError(res.error || "Failed to load event");
        }
      })
      .finally(() => setLoading(false));
  }, [user, authLoading, eventId]);

  const handleRsvp = async (status: "GOING" | "MAYBE" | "NOT_GOING") => {
    setRsvpLoading(true);
    const res = await apiFetch<{ id: string; status: string }>(
      `/api/events/${eventId}/rsvp`,
      {
        method: "POST",
        body: JSON.stringify({ status }),
      }
    );

    if (res.success) {
      // Refresh event data
      const refreshed = await apiFetch<EventDetail>(`/api/events/${eventId}`);
      if (refreshed.success && refreshed.data) {
        setEvent(refreshed.data);
      }
    }
    setRsvpLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const res = await apiFetch(`/api/events/${eventId}`, {
      method: "DELETE",
    });

    if (res.success) {
      router.push("/community/events");
    } else {
      setError(res.error || "Failed to delete event");
    }
  };

  if (authLoading || loading) {
    return <div className={communityStyles.emptyState}>Loading...</div>;
  }

  if (!user) {
    return (
      <div className={communityStyles.emptyState}>
        Please sign in to view this event.
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Link href="/community/events" className={styles.backLink}>
          Back to Events
        </Link>
        <p className={communityStyles.errorMsg}>{error}</p>
      </div>
    );
  }

  if (!event) return null;

  const currentRsvp = event.attendees.find((a) => a.user.id === user.id);
  const currentStatus = currentRsvp?.status || null;
  const isCreator = event.creatorId === user.id;

  const goingAttendees = event.attendees.filter((a) => a.status === "GOING");
  const maybeAttendees = event.attendees.filter((a) => a.status === "MAYBE");
  const notGoingAttendees = event.attendees.filter(
    (a) => a.status === "NOT_GOING"
  );

  return (
    <div>
      <Link href="/community/events" className={styles.backLink}>
        Back to Events
      </Link>

      <div className={styles.detailHeader}>
        <div className={styles.detailTitle}>{event.title}</div>
        <div className={styles.detailMeta}>
          <span
            className={`${styles.eventType} ${EVENT_TYPE_STYLE[event.eventType] || styles.eventTypeOther}`}
          >
            {EVENT_TYPE_LABELS[event.eventType] || event.eventType}
          </span>
          <Link
            href={`/community/groups/${event.group.id}`}
            className={styles.detailGroupLink}
          >
            {event.group.name}
          </Link>
        </div>

        <div className={styles.eventTimeRange}>
          <span>{formatDateTime(event.startsAt)}</span>
          {event.endsAt && (
            <>
              <span>-</span>
              <span>{formatDateTime(event.endsAt)}</span>
            </>
          )}
        </div>

        <div className={styles.detailCreator}>
          Created by {event.creator.username}
        </div>
      </div>

      {event.description && (
        <div className={styles.detailDescription}>{event.description}</div>
      )}

      {isCreator && (
        <div className={styles.detailActions}>
          <button onClick={handleDelete} className={styles.deleteBtn}>
            Delete Event
          </button>
        </div>
      )}

      <div className={styles.rsvpButtons}>
        <button
          className={`${styles.rsvpBtn} ${currentStatus === "GOING" ? styles.rsvpActive : ""}`}
          onClick={() => handleRsvp("GOING")}
          disabled={rsvpLoading}
        >
          Going
        </button>
        <button
          className={`${styles.rsvpBtn} ${styles.rsvpBtnMaybe} ${currentStatus === "MAYBE" ? styles.rsvpActive : ""}`}
          onClick={() => handleRsvp("MAYBE")}
          disabled={rsvpLoading}
        >
          Maybe
        </button>
        <button
          className={`${styles.rsvpBtn} ${styles.rsvpBtnNotGoing} ${currentStatus === "NOT_GOING" ? styles.rsvpActive : ""}`}
          onClick={() => handleRsvp("NOT_GOING")}
          disabled={rsvpLoading}
        >
          Not Going
        </button>
      </div>

      {goingAttendees.length > 0 && (
        <div className={styles.attendeeSection}>
          <div className={styles.attendeeSectionTitle}>
            Going ({goingAttendees.length})
          </div>
          <div className={styles.attendeeList}>
            {goingAttendees.map((a) => (
              <div key={a.id} className={styles.attendeeItem}>
                <div className={communityStyles.avatar}>
                  {a.user.avatarUrl ? (
                    <img src={a.user.avatarUrl} alt={a.user.username} />
                  ) : (
                    <span>{a.user.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span>{a.user.username}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {maybeAttendees.length > 0 && (
        <div className={styles.attendeeSection}>
          <div className={styles.attendeeSectionTitle}>
            Maybe ({maybeAttendees.length})
          </div>
          <div className={styles.attendeeList}>
            {maybeAttendees.map((a) => (
              <div key={a.id} className={styles.attendeeItem}>
                <div className={communityStyles.avatar}>
                  {a.user.avatarUrl ? (
                    <img src={a.user.avatarUrl} alt={a.user.username} />
                  ) : (
                    <span>{a.user.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span>{a.user.username}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {notGoingAttendees.length > 0 && (
        <div className={styles.attendeeSection}>
          <div className={styles.attendeeSectionTitle}>
            Not Going ({notGoingAttendees.length})
          </div>
          <div className={styles.attendeeList}>
            {notGoingAttendees.map((a) => (
              <div key={a.id} className={styles.attendeeItem}>
                <div className={communityStyles.avatar}>
                  {a.user.avatarUrl ? (
                    <img src={a.user.avatarUrl} alt={a.user.username} />
                  ) : (
                    <span>{a.user.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span>{a.user.username}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
