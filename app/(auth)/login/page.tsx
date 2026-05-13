"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

import { LoginCard } from "./components/login-card";
import { LoginEmailField } from "./components/login-email-field";
import { LoginPasswordField } from "./components/login-password-field";

/** Chỉ cho phép path nội bộ hợp lệ (chống open redirect). */
function safeFromSearchParam(raw: string | null): string | undefined {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return undefined;
  return raw;
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const githubLoginUrl = process.env.NEXT_PUBLIC_GITHUB_LOGIN_URL?.trim();

const githubButtonClass =
  "box-border h-12 w-full gap-2 rounded-xl border-2 border-solid border-foreground/50 bg-muted/25 text-base font-semibold shadow-sm ring-1 ring-foreground/15 transition-[border-color,box-shadow,background-color,transform] hover:-translate-y-px hover:border-primary/80 hover:bg-muted/45 hover:shadow-md hover:ring-primary/30 active:translate-y-0";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const from = safeFromSearchParam(searchParams.get("from"));
  const { login, isLoggingIn } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(
      { email: email.trim(), password },
      { redirectTo: from ?? undefined }
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col justify-center py-4">
        <div className="w-full">
          <LoginCard>
            <form onSubmit={onSubmit} className="flex flex-col gap-8">
              <div className="flex flex-col gap-5">
                <LoginEmailField
                  value={email}
                  onChange={setEmail}
                  disabled={isLoggingIn}
                />
                <LoginPasswordField
                  value={password}
                  onChange={setPassword}
                  disabled={isLoggingIn}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="remember"
                    checked={remember}
                    onCheckedChange={(v) => setRemember(v === true)}
                    disabled={isLoggingIn}
                    className="rounded-full border-border/80"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-muted-foreground cursor-pointer text-sm font-normal"
                  >
                    Ghi nhớ đăng nhập
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-primary text-sm font-medium underline-offset-4 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoggingIn}
                className={cn(
                  "h-12 w-full gap-2 rounded-xl text-base font-semibold transition-[transform,box-shadow,background-color]",
                  "shadow-lg shadow-primary/25 hover:-translate-y-px hover:shadow-xl hover:shadow-primary/35 active:translate-y-0"
                )}
              >
                {isLoggingIn ? (
                  "Đang đăng nhập…"
                ) : (
                  <>
                    Đăng nhập REQ-Bean9
                    <ArrowRight className="size-4" aria-hidden />
                  </>
                )}
              </Button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center" aria-hidden>
                  <span className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 font-medium tracking-wide text-muted-foreground uppercase">
                    Hoặc
                  </span>
                </div>
              </div>

              {githubLoginUrl ? (
                <Button
                  type="button"
                  variant="outline"
                  className={githubButtonClass}
                  disabled={isLoggingIn}
                  onClick={() => {
                    window.location.assign(githubLoginUrl);
                  }}
                >
                  <GitHubIcon className="size-5" />
                  Đăng nhập bằng GitHub
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className={githubButtonClass}
                  disabled={isLoggingIn}
                  onClick={() =>
                    toast.info("Chưa cấu hình GitHub OAuth", {
                      description: "Thêm NEXT_PUBLIC_GITHUB_LOGIN_URL vào .env (URL bắt đầu đăng nhập GitHub).",
                    })
                  }
                >
                  <GitHubIcon className="size-5" />
                  Đăng nhập bằng GitHub
                </Button>
              )}
            </form>
          </LoginCard>
        </div>
      </div>

      <p className="text-muted-foreground mt-auto pt-10 text-left text-sm leading-relaxed font-medium flex items-center gap-2">
        Chưa có tài khoản?{" "}
        <Link
          href="/signUp"
          className="text-foreground font-semibold underline-offset-4 hover:text-primary hover:underline"
        >
          Tạo tài khoản REQ-Bean9
        </Link>
      </p>
    </div>
  );
}
