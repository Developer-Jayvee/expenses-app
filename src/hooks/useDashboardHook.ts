import { useEffect, useState } from "react";
import {
  dashboardSummary_API,
  normalizeDashboardSummary,
} from "./api/dashboard-api";
import type { DashboardSummaryI } from "@c/types/dashboardTypes";
import { LocalStorageClass } from "@c/utils/localStorage.util";

const CACHE_KEY = "dashboard_summary";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface CachedDashboardI {
  data: DashboardSummaryI;
  cachedAt: number;
}

const readCache = (): DashboardSummaryI | null => {
  if (!LocalStorageClass.isAlreadyStored(CACHE_KEY)) return null;
  try {
    const raw = LocalStorageClass.getValue(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as Partial<CachedDashboardI> | null;
    if (!cached || typeof cached.cachedAt !== "number") return null;
    if (Date.now() - cached.cachedAt > CACHE_TTL_MS) return null;
    return normalizeDashboardSummary(cached.data);
  } catch {
    return null;
  }
};

export default function useDashboardHook() {
  const [summary, setSummary] = useState<DashboardSummaryI | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchSummary = async (force = false) => {
    if (!force) {
      const cached = readCache();
      if (cached) {
        setSummary(cached);
        setIsLoading(false);
        return;
      }
    }
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await dashboardSummary_API();
      setSummary(response);
      LocalStorageClass.store(
        CACHE_KEY,
        JSON.stringify({ data: response, cachedAt: Date.now() }),
      );
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return {
    summary,
    isLoading,
    isError,
    refresh: () => fetchSummary(true),
  };
}
