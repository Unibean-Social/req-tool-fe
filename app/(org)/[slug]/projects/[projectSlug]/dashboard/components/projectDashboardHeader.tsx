"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDeleteOrgProject } from "@/hooks/useProject";

import { useProjectWorkspaceNav } from "../../components/projectWorkspaceNavContext";
import { DeleteOrgProjectDialog } from "./deleteOrgProjectDialog";

export type ProjectDashboardHeaderProps = {
  title: string;
  description?: string;
  orgId: string;
  projectId: string;
  onEdit: () => void;
};

export function ProjectDashboardHeader({
  title,
  description,
  orgId,
  projectId,
  onEdit,
}: ProjectDashboardHeaderProps) {
  const { navigateAfterProjectDelete } = useProjectWorkspaceNav();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteMutation = useDeleteOrgProject({
    onSuccess: (_data, variables, context) => {
      setDeleteOpen(false);
      navigateAfterProjectDelete(variables.projectId, context?.nextSlug);
    },
  });

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="min-w-0 flex-1 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 border-border/80"
              onClick={onEdit}
            >
              <Pencil className="size-3.5" aria-hidden />
              Chỉnh sửa
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="gap-1.5"
              onClick={() => setDeleteOpen(true)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="size-3.5" aria-hidden />
              Xóa dự án
            </Button>
          </div>
        </div>
        {description ? (
          <p className="w-full text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      <DeleteOrgProjectDialog
        open={deleteOpen}
        projectName={title}
        deletePending={deleteMutation.isPending}
        onOpenChange={setDeleteOpen}
        onConfirmDelete={() =>
          deleteMutation.mutate({ orgId, projectId })
        }
      />
    </>
  );
}
