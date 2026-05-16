"use client";

import type { CreateOrgProjectRequest } from "@/lib/api/services/fetchProject";

import {
  PROJECT_MIN_TEXT_CHARS,
  PROJECT_STAKEHOLDERS_LIST_VIEWPORT_CLASS,
  PROJECT_STAKEHOLDERS_LIST_VIEWPORT_HEIGHT,
} from "../projectFormLimits";
import type { ProjectNewFormErrors } from "../projectNewFormSchema";
import { ProjectNewStringListField } from "../projectNewStringListField";

export function ProjectNewStepStakeholders({
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
  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Bên liên quan và mục tiêu
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Mỗi danh sách cần ít nhất một mục; mỗi mục tối thiểu{" "}
          {PROJECT_MIN_TEXT_CHARS} ký tự.
        </p>
      </div>

      <ProjectNewStringListField
        id="pn-stakeholders"
        fieldKey="stakeholders"
        label="Bên liên quan"
        hint={`Vai trò, team hoặc nhóm bị ảnh hưởng — tối thiểu ${PROJECT_MIN_TEXT_CHARS} ký tự/mục`}
        placeholder="Ví dụ: Product Owner, Kế toán…"
        items={form.stakeholders}
        onChange={(stakeholders) => onPatch({ stakeholders })}
        disabled={disabled}
        addLabel="Thêm bên liên quan"
        addButtonInHeader
        scrollable
        listViewportClassName={PROJECT_STAKEHOLDERS_LIST_VIEWPORT_CLASS}
        listViewportHeight={PROJECT_STAKEHOLDERS_LIST_VIEWPORT_HEIGHT}
        showSubmitErrors={showSubmitErrors}
        errors={errors}
      />
      <ProjectNewStringListField
        id="pn-goals"
        fieldKey="businessGoals"
        label="Mục tiêu kinh doanh"
        hint={`Kết quả mong muốn — tối thiểu ${PROJECT_MIN_TEXT_CHARS} ký tự/mục`}
        placeholder="Ví dụ: Giảm 30% thời gian xử lý đơn…"
        items={form.businessGoals}
        onChange={(businessGoals) => onPatch({ businessGoals })}
        disabled={disabled}
        addLabel="Thêm mục tiêu"
        addButtonInHeader
        scrollable
        listViewportClassName={PROJECT_STAKEHOLDERS_LIST_VIEWPORT_CLASS}
        listViewportHeight={PROJECT_STAKEHOLDERS_LIST_VIEWPORT_HEIGHT}
        showSubmitErrors={showSubmitErrors}
        errors={errors}
      />
    </div>
  );
}
