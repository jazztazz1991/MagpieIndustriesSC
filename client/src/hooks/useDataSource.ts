"use client";

import { useState, useEffect, useCallback } from "react";
import { DATA_SOURCE_MODE } from "@/lib/dataSource";
import { apiFetch } from "@/lib/api";

export interface UseDataSourceResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDataSource<T>(
  staticData: T,
  apiEndpoint?: string
): UseDataSourceResult<T> {
  const [data, setData] = useState<T>(staticData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    setFetchTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (DATA_SOURCE_MODE === "static" || !apiEndpoint) {
      setData(staticData);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    apiFetch<T>(apiEndpoint)
      .then((result) => {
        if (cancelled) return;
        if (result.success && result.data !== undefined) {
          setData(result.data);
        } else {
          setError(result.error || "Failed to fetch data");
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiEndpoint, staticData, fetchTrigger]);

  return { data, loading, error, refetch };
}
