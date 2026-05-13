"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function HomeDashboard() {
  const { user, logout, isLoggingOut } = useAuth();

  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col gap-8 p-6">
      <header className="flex flex-col gap-2 border-b border-border/70 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            REQ-Bean9
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {user?.email ?? "Đã đăng nhập"}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => void logout()}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Đang đăng xuất…" : "Đăng xuất"}
        </Button>
      </header>
      <p className="text-muted-foreground text-sm leading-relaxed">
        Đây là trang chính sau đăng nhập. Thay nội dung này bằng module công việc của bạn.
      </p>
    </div>
  );
}
