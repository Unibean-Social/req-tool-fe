"use client";

import type { CreateOrgProjectRequest } from "@/lib/api/services/fetchProject";

import {
  PROJECT_MIN_TEXT_CHARS,
  PROJECT_FLOWS_RULES_LIST_VIEWPORT_CLASS,
  PROJECT_FLOWS_RULES_LIST_VIEWPORT_HEIGHT,
} from "../projectFormLimits";
import type { ProjectNewFormErrors } from "../projectNewFormSchema";
import { ProjectNewStringListField } from "../projectNewStringListField";

export function ProjectNewStepFlowsRules({
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
          Luồng và quy tắc
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Mỗi danh sách cần ít nhất một mục; mỗi mục tối thiểu{" "}
          {PROJECT_MIN_TEXT_CHARS} ký tự.
        </p>
      </div>

      <ProjectNewStringListField
        id="pn-flows"
        fieldKey="businessFlows"
        label="Luồng nghiệp vụ"
        hint={`Các bước hoặc quy trình chính — tối thiểu ${PROJECT_MIN_TEXT_CHARS} ký tự/mục`}
        placeholder="Ví dụ: Khách đặt hàng → thanh toán → giao hàng"
        items={form.businessFlows}
        onChange={(businessFlows) => onPatch({ businessFlows })}
        disabled={disabled}
        addLabel="Thêm luồng"
        addButtonInHeader
        scrollable
        listViewportClassName={PROJECT_FLOWS_RULES_LIST_VIEWPORT_CLASS}
        listViewportHeight={PROJECT_FLOWS_RULES_LIST_VIEWPORT_HEIGHT}
        showSubmitErrors={showSubmitErrors}
        errors={errors}
      />
      <ProjectNewStringListField
        id="pn-rules"
        fieldKey="businessRules"
        label="Quy tắc nghiệp vụ"
        hint={`Ràng buộc, chính sách — tối thiểu ${PROJECT_MIN_TEXT_CHARS} ký tự/mục`}
        placeholder="Ví dụ: Đơn trên 10 triệu cần duyệt cấp 2"
        items={form.businessRules}
        onChange={(businessRules) => onPatch({ businessRules })}
        disabled={disabled}
        addLabel="Thêm quy tắc"
        addButtonInHeader
        scrollable
        listViewportClassName={PROJECT_FLOWS_RULES_LIST_VIEWPORT_CLASS}
        listViewportHeight={PROJECT_FLOWS_RULES_LIST_VIEWPORT_HEIGHT}
        showSubmitErrors={showSubmitErrors}
        errors={errors}
      />
    </div>
  );
}
