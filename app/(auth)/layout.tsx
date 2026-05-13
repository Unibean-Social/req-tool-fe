import Link from "next/link";
import { Phone, Star } from "lucide-react";
import { Suspense, type ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { SafeImage } from "@/components/ui/safe-image";
import { cn } from "@/lib/utils";

function AuthBrandMark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex shrink-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
        className
      )}
    >
      <span className="relative flex size-17 shrink-0 items-center justify-center overflow-hidden">
        <SafeImage
          src="/Logo.png"
          alt="REQ-Bean9"
          fill
          priority
          sizes="44px"
          className="object-contain"
        />
      </span>
      <span className="font-heading text-xl font-semibold tracking-tight text-foreground">
        REQ-Bean9
      </span>
    </Link>
  );
}

function AuthMarketingAside() {
  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-8 px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <p className="max-w-lg text-pretty text-base font-medium leading-snug text-foreground sm:text-lg lg:text-xl lg:leading-relaxed">
          &ldquo;Giao diện nhanh, ổn định và dễ dùng — đội hỗ trợ luôn sẵn sàng khi cần.&rdquo;
        </p>
        <div className="flex shrink-0 flex-row flex-wrap items-center gap-3">
          <div className="flex -space-x-2" aria-hidden>
            {["LK", "HT", "MA"].map((initials) => (
              <span
                key={initials}
                className="flex size-10 items-center justify-center rounded-full border border-border/80 bg-muted text-xs font-semibold text-muted-foreground shadow-sm"
              >
                {initials}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-0.5 text-brand-mint" aria-label="5 / 5 sao">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-4 fill-current" strokeWidth={0} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-2">
        <div className="relative mx-auto h-[380px] w-full max-w-[min(100%,800px)] sm:h-[448px] md:h-[520px]">
          <SafeImage
            src="/auth-image.png"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-contain object-center"
          />
        </div>
      </div>

      <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Phone className="size-4 shrink-0 text-brand-mint" strokeWidth={1.75} aria-hidden />
        <span>Có thắc mắc? Gọi hotline hoặc liên hệ team kỹ thuật.</span>
      </p>
    </div>
  );
}

export default function AuthRouteGroupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh w-full flex-1 items-center justify-center bg-background px-3 py-4 sm:px-5 sm:py-6 md:px-8 md:py-8">
      <Card
        className={cn(
          "flex w-full max-w-[min(96rem,calc(100vw-1.5rem))] flex-col gap-0 overflow-hidden rounded-2xl border-border/70 p-0 shadow-xl",
          "min-h-[calc(100svh-2rem)] sm:min-h-[calc(100svh-2.5rem)] md:min-h-[calc(100svh-4rem)]",
          "dark:shadow-primary/15"
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <div className="relative z-0 flex w-full flex-1 flex-col border-border/30 border-b md:w-1/2 md:min-h-0 md:border-b-0 md:border-r">
            <div className="mx-auto flex w-full max-w-[29rem] flex-1 flex-col gap-10 px-6 py-10 sm:gap-12 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
              <AuthBrandMark />
              <div className="flex min-h-0 flex-1 flex-col">
                <Suspense
                  fallback={
                    <p className="text-muted-foreground mt-4 text-sm" role="status">
                      Đang tải…
                    </p>
                  }
                >
                  {children}
                </Suspense>
              </div>
            </div>
          </div>

          <div className="relative isolate flex min-h-[42vh] w-full flex-1 flex-col overflow-hidden md:min-h-0 md:w-1/2">
            <AuthMarketingAside />
          </div>
        </div>
      </Card>
    </div>
  );
}
