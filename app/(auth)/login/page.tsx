"use client";

import { useSearchParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useGithubOAuth } from "@/hooks/useGithub";
import { cn } from "@/lib/utils";

import { WorkspaceAuthHint } from "@/app/(org)/[slug]/components/workspaceAuthHint";

import { GitHubMark } from "./components/github-mark";
import { LoginCard } from "./components/login-card";

function safeFromSearchParam(raw: string | null): string | undefined {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return undefined;
  return raw;
}

const githubCtaClass = cn(
  "relative h-12 w-full gap-2.5 rounded-xl text-base font-semibold tracking-tight",
  "border border-white/10 bg-[#24292f] text-white shadow-lg shadow-black/25",
  "transition-[transform,box-shadow,background-color,border-color]",
  "hover:-translate-y-0.5 hover:border-white/15 hover:bg-[#2d333b] hover:shadow-xl hover:shadow-black/30",
  "active:translate-y-0 active:shadow-md",
  "dark:border-white/12 dark:bg-zinc-100 dark:text-zinc-900 dark:shadow-zinc-900/20",
  "dark:hover:border-white/25 dark:hover:bg-white dark:hover:shadow-lg"
);

export default function LoginPage() {
  const searchParams = useSearchParams();
  const from = safeFromSearchParam(searchParams.get("from"));
  const { openOAuth } = useGithubOAuth();
  const [popupBusy, setPopupBusy] = React.useState(false);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col justify-center py-2 sm:py-4">
        <LoginCard
          fromRedirect={from}
          footer={
            <WorkspaceAuthHint className="mx-auto max-w-sm text-center text-xs leading-relaxed text-muted-foreground" />
          }
        >
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className={githubCtaClass}
              disabled={popupBusy}
              onClick={() => {
                setPopupBusy(true);
                const ok = openOAuth();
                if (!ok) {
                  toast.error("Không mở được cửa sổ đăng nhập.", {
                    description: "Cho phép popup cho site này rồi thử lại.",
                  });
                }
                window.setTimeout(() => setPopupBusy(false), 800);
              }}
            >
              <GitHubMark className="size-[1.15rem] shrink-0 opacity-95" />
              Tiếp tục với GitHub
            </Button>
            <p className="text-center text-[11px] text-muted-foreground/90">
              Mở cửa sổ mới — an toàn, không gửi mật khẩu qua trang này.
            </p>
          </div>
        </LoginCard>
      </div>
    </div>
  );
}
