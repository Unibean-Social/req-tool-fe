"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CreateOrgProjectRequest } from "@/lib/api/services/fetchProject";

export function ProjectNewStepContext({
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
          Ngữ cảnh và vấn đề
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Mô tả bối cảnh và những khó khăn cần giải quyết.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="pn-context" className="text-sm font-semibold">
            Ngữ cảnh
          </Label>
          <Textarea
            id="pn-context"
            placeholder="Tùy chọn"
            value={form.context}
            onChange={(e) => onPatch({ context: e.target.value })}
            disabled={disabled}
            rows={4}
            className="min-h-24 resize-y border-2 border-border/90 dark:border-zinc-600"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pn-problems" className="text-sm font-semibold">
            Vấn đề
          </Label>
          <Textarea
            id="pn-problems"
            placeholder="Tùy chọn"
            value={form.problems}
            onChange={(e) => onPatch({ problems: e.target.value })}
            disabled={disabled}
            rows={4}
            className="min-h-24 resize-y border-2 border-border/90 dark:border-zinc-600"
          />
        </div>
      </div>
    </div>
  );
}
