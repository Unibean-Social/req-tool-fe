"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CreateOrgProjectRequest } from "@/lib/api/services/fetchProject";

import {
  PROJECT_CONTEXT_MAX_CHARS,
  PROJECT_MIN_TEXT_CHARS,
  PROJECT_PROBLEMS_LIST_VIEWPORT_CLASS,
  PROJECT_PROBLEMS_LIST_VIEWPORT_HEIGHT,
} from "../projectFormLimits";
import { ProjectNewFieldError } from "../projectNewFieldError";
import { resolveProjectNewTextFieldError } from "../projectNewFieldValidation";
import type { ProjectNewFormErrors } from "../projectNewFormSchema";
import { ProjectNewStringListField } from "../projectNewStringListField";

export function ProjectNewStepContext({
  form,
  onPatch,
  disabled,
  showSubmitErrors = false,
  errors,
}: {
  form: CreateOrgProjectRequest;
  onPatch: (patch: Partial<CreateOrgProjectRequest>) => void;
  disabled?: boolean;
  showSubmitErrors?: boolean;
  errors?: ProjectNewFormErrors;
}) {
  const contextLen = form.context.length;
  const contextError = resolveProjectNewTextFieldError(
    form.context,
    errors?.context,
    showSubmitErrors
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
      <div className="shrink-0">
        <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Ngữ cảnh và vấn đề
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ngữ cảnh và mỗi vấn đề cần ít nhất {PROJECT_MIN_TEXT_CHARS} ký tự; cần
          ít nhất một vấn đề.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
        <div className="flex min-h-0 min-h-24 flex-1 flex-col gap-2 overflow-hidden">
          <Label htmlFor="pn-context" className="shrink-0 text-sm font-semibold">
            Ngữ cảnh <span className="text-destructive">*</span>
          </Label>
          <div className="relative min-h-0 flex-1">
            <Textarea
              id="pn-context"
              aria-invalid={Boolean(contextError)}
              placeholder="Mô tả tình trạng hiện tại, hệ thống đang dùng, hoặc bối cảnh liên quan…"
              value={form.context}
              onChange={(e) =>
                onPatch({
                  context: e.target.value.slice(0, PROJECT_CONTEXT_MAX_CHARS),
                })
              }
              disabled={disabled}
              maxLength={PROJECT_CONTEXT_MAX_CHARS}
              className={cn(
                "h-full min-h-0 resize-none border-2 border-border/90 pb-8 dark:border-zinc-600",
                contextError && "border-destructive"
              )}
            />
            <span
              className="pointer-events-none absolute right-3 bottom-2 text-xs tabular-nums text-muted-foreground"
              aria-live="polite"
            >
              {contextLen} / {PROJECT_CONTEXT_MAX_CHARS}
            </span>
          </div>
          <ProjectNewFieldError message={contextError} />
        </div>

        <ProjectNewStringListField
          id="pn-problems"
          fieldKey="problems"
          label="Vấn đề cần giải quyết"
          hint={`Ít nhất một mục, mỗi mục tối thiểu ${PROJECT_MIN_TEXT_CHARS} ký tự`}
          placeholder="Vd: Thanh toán chậm, thiếu báo cáo…"
          items={form.problems}
          onChange={(problems) => onPatch({ problems })}
          disabled={disabled}
          addLabel="Thêm vấn đề"
          addButtonInHeader
          scrollable
          listViewportClassName={PROJECT_PROBLEMS_LIST_VIEWPORT_CLASS}
          listViewportHeight={PROJECT_PROBLEMS_LIST_VIEWPORT_HEIGHT}
          showSubmitErrors={showSubmitErrors}
          errors={errors}
          className="shrink-0"
        />
      </div>
    </div>
  );
}
