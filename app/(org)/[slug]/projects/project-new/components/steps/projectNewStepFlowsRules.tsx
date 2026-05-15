"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CreateOrgProjectRequest } from "@/lib/api/services/fetchProject";

export function ProjectNewStepFlowsRules({
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
          Luồng và quy tắc
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Luồng nghiệp vụ chính và các quy tắc cần tuân thủ.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="pn-flows" className="text-sm font-semibold">
            Luồng nghiệp vụ
          </Label>
          <Textarea
            id="pn-flows"
            placeholder="Tùy chọn"
            value={form.businessFlows}
            onChange={(e) => onPatch({ businessFlows: e.target.value })}
            disabled={disabled}
            rows={4}
            className="min-h-24 resize-y border-2 border-border/90 dark:border-zinc-600"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pn-rules" className="text-sm font-semibold">
            Quy tắc nghiệp vụ
          </Label>
          <Textarea
            id="pn-rules"
            placeholder="Tùy chọn"
            value={form.businessRules}
            onChange={(e) => onPatch({ businessRules: e.target.value })}
            disabled={disabled}
            rows={4}
            className="min-h-24 resize-y border-2 border-border/90 dark:border-zinc-600"
          />
        </div>
      </div>
    </div>
  );
}
