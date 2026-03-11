"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import styles from "./calendar.module.css";

interface OrgEvent {
  id: string;
  title: string;
  eventType: string;
  startsAt: string;
  endsAt: string | null;
}

interface OrgInfo {
  id: string;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const { user, loading: authLoading } = useAuth();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [orgId, setOrgId] = useState<string>("");
  const [events, setEvents] = useState<OrgEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    apiFetch<OrgInfo>(`/api/orgs/${slug}`).then((res) => {
      if (res.success && res.data) setOrgId(res.data.id);
      else {
        setError(res.error || "Failed to load org");
        setLoading(false);
      }
    });
  }, [user, authLoading, slug]);

  useEffect(() => {
    if (!orgId) return;
    fetchEvents();
  }, [orgId, year, month]);

  async function fetchEvents() {
    setLoading(true);
    setError(null);

    // Fetch org events — we use the events endpoint
    // Events for this org are accessible via the org events relation
    const res = await apiFetch<OrgEvent[]>(
      `/api/events?orgId=${orgId}`
    );
    if (res.success && res.data) {
      setEvents(res.data);
    }
    // Even if events fail to load, show the calendar
    setLoading(false);
  }

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  // Build calendar grid
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const prevMonthDays = getDaysInMonth(year, month === 0 ? 11 : month - 1);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Group events by date
  const eventsByDate: Record<string, OrgEvent[]> = {};
  for (const event of events) {
    const dateStr = event.startsAt.slice(0, 10);
    if (!eventsByDate[dateStr]) eventsByDate[dateStr] = [];
    eventsByDate[dateStr].push(event);
  }

  // Build cells
  const cells: { day: number; isCurrentMonth: boolean; dateStr: string }[] = [];

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    cells.push({
      day: d,
      isCurrentMonth: false,
      dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      isCurrentMonth: true,
      dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    });
  }

  // Next month days to fill the grid
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      const m = month === 11 ? 1 : month + 2;
      const y = month === 11 ? year + 1 : year;
      cells.push({
        day: d,
        isCurrentMonth: false,
        dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }
  }

  if (authLoading || (!orgId && !error)) {
    return (
      <div className={styles.calendarPage}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.calendarPage}>
        <div className={styles.emptyState}>Sign in to view the calendar.</div>
      </div>
    );
  }

  return (
    <div className={styles.calendarPage}>
      <Link href={`/orgs/${slug}`} className={styles.backLink}>
        &larr; Back to Org
      </Link>

      <h1 className={styles.title}>Organization Calendar</h1>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.calendarHeader}>
        <button className={styles.navBtn} onClick={prevMonth}>
          &larr; Prev
        </button>
        <span className={styles.monthTitle}>
          {MONTH_NAMES[month]} {year}
        </span>
        <button className={styles.navBtn} onClick={nextMonth}>
          Next &rarr;
        </button>
      </div>

      <div className={styles.calendarGrid}>
        {DAY_NAMES.map((d) => (
          <div key={d} className={styles.dayHeader}>
            {d}
          </div>
        ))}
        {cells.map((cell, i) => {
          const dayEvents = eventsByDate[cell.dateStr] || [];
          const isToday = cell.dateStr === todayStr;
          return (
            <div
              key={i}
              className={`${styles.dayCell} ${!cell.isCurrentMonth ? styles.dayOutside : ""} ${isToday ? styles.dayToday : ""}`}
            >
              <span className={styles.dayNumber}>{cell.day}</span>
              {dayEvents.slice(0, 3).map((ev) => (
                <span key={ev.id} className={styles.eventDot} title={ev.title}>
                  {ev.title}
                </span>
              ))}
              {dayEvents.length > 3 && (
                <span className={styles.eventDot}>+{dayEvents.length - 3} more</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
