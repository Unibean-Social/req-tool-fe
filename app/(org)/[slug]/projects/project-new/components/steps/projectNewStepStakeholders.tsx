"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CreateOrgProjectRequest } from "@/lib/api/services/fetchProject";

export function ProjectNewStepStakeholders({
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
          Bên liên quan và mục tiêu
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ai chịu trách nhiệm hoặc bị ảnh hưởng, và mục tiêu kinh doanh mong muốn.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="pn-stakeholders" className="text-sm font-semibold">
            Bên liên quan
          </Label>
          <Textarea
            id="pn-stakeholders"
            placeholder="Tùy chọn"
            value={form.stakeholders}
            onChange={(e) => onPatch({ stakeholders: e.target.value })}
            disabled={disabled}
            rows={4}
            className="min-h-24 resize-y border-2 border-border/90 dark:border-zinc-600"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pn-goals" className="text-sm font-semibold">
            Mục tiêu kinh doanh
          </Label>
          <Textarea
            id="pn-goals"
            placeholder="Tùy chọn"
            value={form.businessGoals}
            onChange={(e) => onPatch({ businessGoals: e.target.value })}
            disabled={disabled}
            rows={4}
            className="min-h-24 resize-y border-2 border-border/90 dark:border-zinc-600"
          />
        </div>
      </div>
    </div>
  );
}
