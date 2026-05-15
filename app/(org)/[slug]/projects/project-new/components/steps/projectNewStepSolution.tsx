"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CreateOrgProjectRequest } from "@/lib/api/services/fetchProject";

export function ProjectNewStepSolution({
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
          Đề xuất giải pháp
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Hướng xử lý hoặc giải pháp đang cân nhắc (có thể chỉnh sau khi tạo).
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="pn-solution" className="text-sm font-semibold">
          Đề xuất giải pháp
        </Label>
        <Textarea
          id="pn-solution"
          placeholder="Tùy chọn"
          value={form.proposedSolutions}
          onChange={(e) => onPatch({ proposedSolutions: e.target.value })}
          disabled={disabled}
          rows={8}
          className="min-h-40 resize-y border-2 border-border/90 dark:border-zinc-600"
        />
      </div>
    </div>
  );
}
