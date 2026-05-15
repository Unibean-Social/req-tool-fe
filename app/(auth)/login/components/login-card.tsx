import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { GitHubMark } from "./github-mark";

export function LoginCard({
  children,
  fromRedirect,
  footer,
}: {
  children?: ReactNode;
  fromRedirect?: string;
  footer?: ReactNode;
}) {
  return (
    <Card
      className={cn(
        "relative mx-auto w-full max-w-md gap-0 overflow-hidden rounded-2xl border-border/70 py-0",
        "shadow-2xl shadow-black/20 dark:shadow-black/40",
        "bg-card/90 backdrop-blur-md"
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-primary/12 via-primary/4 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 right-0 size-48 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-8 size-40 rounded-full bg-chart-1/15 blur-3xl"
        aria-hidden
      />

      <CardHeader className="relative gap-4 border-b border-border/50 bg-linear-to-b from-muted/25 to-transparent px-6 pb-6 pt-8 sm:px-8">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex size-14 shrink-0 items-center justify-center rounded-2xl",
              "border border-border/80 bg-background/80 shadow-inner",
              "ring-1 ring-foreground/6"
            )}
            aria-hidden
          >
            <GitHubMark className="size-8 text-foreground" />
          </div>
          <div className="min-w-0 flex-1 space-y-1.5 pt-0.5">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Đăng nhập một bước
            </p>
            <CardTitle className="font-heading text-2xl leading-tight tracking-tight sm:text-[1.65rem]">
              REQ-Bean9
            </CardTitle>
            <CardDescription className="text-pretty text-sm leading-relaxed sm:text-[0.9375rem]">
              Xác thực bằng GitHub — không mật khẩu, không đăng ký riêng. Phiên làm
              việc được tạo ngay sau khi bạn cho phép.
            </CardDescription>
          </div>
        </div>

        {fromRedirect ? (
          <div
            className={cn(
              "rounded-xl border border-primary/20 bg-primary/10 px-3.5 py-2.5 text-sm",
              "text-muted-foreground"
            )}
          >
            <span className="font-medium text-foreground">Tiếp theo:</span> quay lại{" "}
            <code className="rounded-md bg-muted/80 px-1.5 py-0.5 font-mono text-xs text-foreground">
              {fromRedirect}
            </code>
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="relative space-y-4 px-6 py-7 sm:px-8">
        {children}
      </CardContent>

      {footer ? (
        <CardFooter className="relative border-t border-border/60 bg-muted/25 px-6 py-4 sm:px-8">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  );
}
