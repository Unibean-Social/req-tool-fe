"use client";

import { type ReactNode } from "react";

import { ReduxProvider } from "@/lib/providers/redux-provider";
import { QueryProvider } from "@/lib/providers/query-provider";
// import { SignalRProvider } from "@/lib/providers/signalr-provider";
import { useAuthSyncAcrossTabs } from "@/hooks/useAuthSyncAcrossTabs";

function AuthSyncProvider({ children }: { children: ReactNode }) {
  useAuthSyncAcrossTabs();
  return <>{children}</>;
}

/**
 * Thứ tự: Redux → React Query → [SignalR tạm tắt] → đồng bộ logout đa tab (tooltip/toast bọc ngoài trong AppProviders).
 */
export function DataStoresProvider({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        {/* SignalR: bỏ bọc SignalRProvider tạm thời — bật lại import + wrapper khi dùng realtime */}
        <AuthSyncProvider>{children}</AuthSyncProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
