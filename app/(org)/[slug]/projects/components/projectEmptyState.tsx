"use client";

import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import { cn } from "@/lib/utils";

export type ProjectEmptyStateProps = {
  orgName: string;
  createProjectHref: string;
};

export function ProjectEmptyState({
  orgName,
  createProjectHref,
}: ProjectEmptyStateProps) {
  return (
    <div className="flex min-h-full w-full flex-1 flex-col items-center justify-center px-6 py-12 sm:px-8">
      <div className="flex w-full max-w-xl flex-col items-center text-center">
        <SafeImage
          src="/notFound.svg"
          alt=""
          width={280}
          height={210}
          priority
          className="h-auto w-full max-w-64 object-contain sm:max-w-72"
          aria-hidden
        />

        <h1 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Chưa có dự án
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          <span className="font-medium text-foreground">{orgName}</span> chưa có
          workspace dự án nào. Tạo dự án đầu tiên để bắt đầu thu thập yêu cầu và
          làm việc cùng nhóm.
        </p>

        <Link
          href={createProjectHref}
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-8 h-11 gap-2 px-6 font-semibold shadow-md shadow-primary/20",
            "hover:shadow-lg hover:shadow-primary/25"
          )}
        >
          <Plus className="size-4" aria-hidden />
          Tạo dự án mới
          <ArrowUpRight className="size-4 opacity-80" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
