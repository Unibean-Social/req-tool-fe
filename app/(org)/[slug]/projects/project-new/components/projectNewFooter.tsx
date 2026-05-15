"use client";

import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ProjectNewFooterProps = {
  currentStepIndex: number;
  totalSteps: number;
  canGoBack: boolean;
  onBack: () => void;
  isLastStep: boolean;
  nextDisabled: boolean;
  nextLoading: boolean;
  onNext: () => void;
  className?: string;
};

export function ProjectNewFooter({
  currentStepIndex,
  totalSteps,
  canGoBack,
  onBack,
  isLastStep,
  nextDisabled,
  nextLoading,
  onNext,
  className,
}: ProjectNewFooterProps) {
  const progress =
    totalSteps > 0
      ? Math.min(100, Math.round(((currentStepIndex + 1) / totalSteps) * 100))
      : 0;

  return (
    <footer
      className={cn(
        "shrink-0 border-t border-border/60 bg-background",
        className
      )}
    >
      <div
        className="h-1 w-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label="Tiến độ tạo dự án"
      >
        <div
          className="h-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        {canGoBack ? (
          <Button
            type="button"
            variant="ghost"
            className="gap-1.5 px-2 text-muted-foreground hover:text-foreground"
            onClick={onBack}
          >
            <ChevronLeft className="size-4" aria-hidden />
            Quay lại
          </Button>
        ) : (
          <span className="min-w-[6rem]" aria-hidden />
        )}
        <Button
          type="button"
          variant="default"
          disabled={nextDisabled || nextLoading}
          onClick={onNext}
          className={cn(
            "rounded-full px-8 py-2.5 font-semibold shadow-md",
            "disabled:opacity-50"
          )}
        >
          {nextLoading ? (
            "Đang tạo…"
          ) : isLastStep ? (
            <>
              Tạo dự án
              <span
                className="ml-1 inline-block size-2 shrink-0 rounded-full bg-primary-foreground opacity-90"
                aria-hidden
              />
            </>
          ) : (
            <>
              Tiếp theo
              <span
                className="ml-1 inline-block size-2 shrink-0 rounded-full bg-primary-foreground opacity-90"
                aria-hidden
              />
            </>
          )}
        </Button>
      </div>
    </footer>
  );
}
