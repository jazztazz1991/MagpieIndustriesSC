"use client";

import { useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Pings the API server health endpoint on mount to wake it up.
 * Render free tier spins down after inactivity — this ensures
 * the server starts booting as soon as a user loads the site.
 */
export default function ServerWakeup() {
  useEffect(() => {
    fetch(`${API_URL}/api/health`).catch(() => {});
  }, []);

  return null;
}
