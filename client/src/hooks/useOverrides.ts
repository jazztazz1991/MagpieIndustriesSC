"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { apiFetch } from "@/lib/api";

export interface DataOverride {
  id: string;
  category: string;
  itemKey: string;
  overrides: Record<string, number | string>;
  updatedAt: string;
}

let cachedOverrides: DataOverride[] | null = null;
let fetchPromise: Promise<DataOverride[]> | null = null;

function fetchOverrides(): Promise<DataOverride[]> {
  if (cachedOverrides) return Promise.resolve(cachedOverrides);
  if (fetchPromise) return fetchPromise;
  fetchPromise = apiFetch<DataOverride[]>("/api/game-data/overrides").then((res) => {
    const data = res.success && res.data ? res.data : [];
    cachedOverrides = data;
    fetchPromise = null;
    return data;
  });
  return fetchPromise;
}

export function invalidateOverrideCache() {
  cachedOverrides = null;
  fetchPromise = null;
}

/**
 * Fetches all data overrides and provides a function to merge them
 * into any static data array.
 */
export function useOverrides() {
  const [overrides, setOverrides] = useState<DataOverride[]>(cachedOverrides || []);
  const [loaded, setLoaded] = useState(!!cachedOverrides);

  const reload = useCallback(() => {
    invalidateOverrideCache();
    fetchOverrides().then((data) => {
      setOverrides(data);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    fetchOverrides().then((data) => {
      setOverrides(data);
      setLoaded(true);
    });
  }, []);

  /**
   * Apply overrides to a static data array.
   * Patches matching items with override fields using Object.assign-style merge.
   */
  const applyOverrides = useCallback(<T,>(
    category: string,
    items: T[],
    keyFn: (item: T) => string
  ): T[] => {
    const relevant = overrides.filter((o) => o.category === category);
    if (relevant.length === 0) return items;

    const overrideMap = new Map(relevant.map((o) => [o.itemKey, o.overrides]));
    return items.map((item) => {
      const patch = overrideMap.get(keyFn(item));
      if (!patch) return item;
      return { ...item, ...patch } as T;
    });
  }, [overrides]);

  return { overrides, loaded, reload, applyOverrides };
}

/**
 * Hook for a specific category: returns static data merged with overrides.
 */
export function useWithOverrides<T>(
  category: string,
  staticItems: T[],
  keyFn: (item: T) => string
): { data: T[]; loaded: boolean; reload: () => void } {
  const { loaded, reload, applyOverrides } = useOverrides();
  const data = useMemo(
    () => applyOverrides(category, staticItems, keyFn),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loaded, staticItems, category, applyOverrides]
  );
  return { data, loaded, reload };
}
