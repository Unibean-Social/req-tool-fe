"use client";

import { AlignLeft, FolderKanban } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CreateOrgProjectRequest } from "@/lib/api/services/fetchProject";

export function ProjectNewStepBasics({
  form,
  onPatch,
  disabled,
}: {
  form: CreateOrgProjectRequest;
  onPatch: (patch: Partial<CreateOrgProjectRequest>) => void;
  disabled?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Thông tin dự án
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tên bắt buộc; mô tả giúp team hiểu nhanh mục đích dự án.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="pn-name" className="text-sm font-semibold">
            Tên dự án <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <FolderKanban className="text-foreground/40 pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2" />
            <Input
              id="pn-name"
              autoComplete="off"
              placeholder="Ví dụ: API thanh toán"
              value={form.name}
              onChange={(e) => onPatch({ name: e.target.value })}
              disabled={disabled}
              className="h-11 border-2 border-border/90 pl-11 dark:border-zinc-600"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pn-desc" className="text-sm font-semibold">
            Mô tả
          </Label>
          <div className="relative">
            <AlignLeft className="text-foreground/40 pointer-events-none absolute top-3 left-3 size-5" />
            <Textarea
              id="pn-desc"
              placeholder="Tùy chọn"
              value={form.description}
              onChange={(e) => onPatch({ description: e.target.value })}
              disabled={disabled}
              rows={4}
              className="min-h-24 resize-y border-2 border-border/90 pl-11 pt-2.5 dark:border-zinc-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
