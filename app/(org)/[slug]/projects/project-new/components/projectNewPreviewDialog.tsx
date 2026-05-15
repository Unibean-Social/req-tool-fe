"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CreateOrgProjectRequest } from "@/lib/api/services/fetchProject";

const PREVIEW_ROWS: {
  key: keyof CreateOrgProjectRequest;
  label: string;
}[] = [
  { key: "name", label: "Tên dự án" },
  { key: "description", label: "Mô tả" },
  { key: "context", label: "Ngữ cảnh" },
  { key: "problems", label: "Vấn đề" },
  { key: "stakeholders", label: "Bên liên quan" },
  { key: "businessGoals", label: "Mục tiêu kinh doanh" },
  { key: "businessFlows", label: "Luồng nghiệp vụ" },
  { key: "businessRules", label: "Quy tắc nghiệp vụ" },
  { key: "proposedSolutions", label: "Đề xuất giải pháp" },
];

export function ProjectNewPreviewDialog({
  open,
  onOpenChange,
  form,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: CreateOrgProjectRequest;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(88vh,36rem)] sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle className="text-lg">Xem trước</DialogTitle>
          <DialogDescription>
            Tóm tắt thông tin bạn đã nhập trước khi tạo dự án.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[min(60vh,24rem)] pr-3">
          <dl className="grid gap-4 text-sm">
            {PREVIEW_ROWS.map(({ key, label }) => {
              const value = form[key]?.trim() || "—";
              return (
                <div key={key} className="min-w-0">
                  <dt className="font-semibold text-foreground">{label}</dt>
                  <dd className="mt-1 whitespace-pre-wrap wrap-break-word text-muted-foreground">
                    {value}
                  </dd>
                </div>
              );
            })}
          </dl>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
