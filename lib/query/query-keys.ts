/**
 * Central query keys so GET hooks share one cache surface and mutations
 * can invalidate precisely instead of clearing the whole client.
 */
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
  },
} as const;
