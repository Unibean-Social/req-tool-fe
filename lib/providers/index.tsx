"use client";

import { type ReactNode } from "react";

import { ReduxProvider } from "@/lib/providers/redux-provider";
import { QueryProvider } from "@/lib/providers/query-provider";
import { SignalRProvider } from "@/lib/providers/signalr-provider";
import { useAuthSyncAcrossTabs } from "@/hooks/useAuthSyncAcrossTabs";

function AuthSyncProvider({ children }: { children: ReactNode }) {
  useAuthSyncAcrossTabs();
  return <>{children}</>;
}

/**
 * Thứ tự: Redux → React Query → SignalR → đồng bộ logout đa tab (tooltip/toast bọc ngoài trong AppProviders).
 */
export function DataStoresProvider({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <SignalRProvider>
          <AuthSyncProvider>{children}</AuthSyncProvider>
        </SignalRProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
