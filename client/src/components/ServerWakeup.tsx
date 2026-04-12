"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Pings the API server on mount to wake it up.
 * Shows a non-blocking banner if the server is still starting.
 */
export default function ServerWakeup() {
  const [status, setStatus] = useState<"checking" | "ok" | "waking" | "error">("checking");

  useEffect(() => {
    let cancelled = false;
    let retries = 0;

    async function ping() {
      try {
        const res = await fetch(`${API_URL}/api/health`, { signal: AbortSignal.timeout(5000) });
        if (!cancelled && res.ok) {
          setStatus("ok");
          return;
        }
      } catch {
        // Server not ready
      }

      if (cancelled) return;
      retries++;

      if (retries === 1) {
        setStatus("waking");
      }

      // Retry up to 6 times (30 seconds total)
      if (retries < 6) {
        setTimeout(ping, 5000);
      } else {
        setStatus("error");
      }
    }

    ping();
    return () => { cancelled = true; };
  }, []);

  if (status === "checking" || status === "ok") return null;

  if (status === "waking") {
    return (
      <div style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        padding: "0.75rem 1rem",
        background: "rgba(250, 204, 21, 0.15)",
        border: "1px solid rgba(250, 204, 21, 0.3)",
        borderRadius: "8px",
        color: "#facc15",
        fontSize: "0.8rem",
        zIndex: 999,
        maxWidth: "300px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}>
        Server is waking up... Features like login and price lookups will be available shortly.
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        padding: "0.75rem 1rem",
        background: "rgba(248, 113, 113, 0.15)",
        border: "1px solid rgba(248, 113, 113, 0.3)",
        borderRadius: "8px",
        color: "#f87171",
        fontSize: "0.8rem",
        zIndex: 999,
        maxWidth: "300px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}>
        Server is unavailable. Some features may not work. All tool calculations still work offline.
      </div>
    );
  }

  return null;
}
