/**
 * Defaults for read/query traffic: keep responses in cache and avoid
 * refetching while data is still considered fresh.
 */
export const DEFAULT_QUERY_STALE_MS = 5 * 60 * 1000; // 5 minutes
export const DEFAULT_QUERY_GC_MS = 30 * 60 * 1000; // 30 minutes unused
