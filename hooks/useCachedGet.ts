"use client";

import { useQuery, type QueryKey, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";

import { DEFAULT_QUERY_GC_MS, DEFAULT_QUERY_STALE_MS } from "@/lib/query/defaults";

type CachedGetOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey,
> = UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>;

/**
 * `useQuery` tuned for GET-style reads: stable `queryKey` hits the TanStack
 * cache; while data is fresh (`staleTime`) no network refetch runs on mount
 * or tab focus. Override per hook when an endpoint needs shorter freshness.
 */
export function useCachedGet<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: CachedGetOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  return useQuery({
    staleTime: DEFAULT_QUERY_STALE_MS,
    gcTime: DEFAULT_QUERY_GC_MS,
    refetchOnWindowFocus: false,
    ...options,
  });
}
