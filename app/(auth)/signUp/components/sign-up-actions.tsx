import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SignUpActions() {
  return (
    <div className="flex flex-col gap-3 pt-2">
      <Button
        type="button"
        className={cn("h-12 w-full gap-2 rounded-xl text-base font-semibold shadow-lg shadow-primary/15")}
        disabled
        variant="secondary"
      >
        Đăng ký (sắp có)
        <ArrowRight className="size-4 opacity-50" aria-hidden />
      </Button>
      <Link
        href="/login"
        className={cn(
          "flex h-12 w-full items-center justify-center rounded-xl border border-border/70 bg-transparent text-sm font-semibold text-foreground transition-colors hover:bg-muted/50"
        )}
      >
        Quay lại đăng nhập
      </Link>
    </div>
  );
}
