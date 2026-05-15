"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ProjectNewHeaderProps = {
  /** Link logo / về danh sách dự án */
  projectsHref: string;
  onPreview: () => void;
  onExit: () => void;
  className?: string;
};

export function ProjectNewHeader({
  projectsHref,
  onPreview,
  onExit,
  className,
}: ProjectNewHeaderProps) {
  return (
    <header
      className={cn(
        "flex shrink-0 items-center justify-between gap-4 border-b border-border/80 bg-background px-4 py-3 sm:px-6",
        className
      )}
    >
      <Link
        href={projectsHref}
        className="flex shrink-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45"
        aria-label="Về danh sách dự án"
      >
        <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-border/50">
          <Image
            src="/Logo.png"
            alt=""
            width={40}
            height={40}
            className="size-10 object-contain"
            priority
          />
        </span>
      </Link>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-border/90 font-medium"
          onClick={onPreview}
        >
          <Eye className="size-4" aria-hidden />
          Xem trước
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-border/90 font-medium"
          onClick={onExit}
        >
          <LogOut className="size-4" aria-hidden />
          Thoát
        </Button>
      </div>
    </header>
  );
}
