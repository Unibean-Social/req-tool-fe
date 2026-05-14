"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronRight,
  FolderKanban,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useDeleteOrgProject,
  useOrgProjects,
  useUpdateOrgProject,
} from "@/hooks/useProject";
import type { OrgProject } from "@/lib/api/services/fetchProject";
import { cn } from "@/lib/utils";

import { useOrgWorkspace } from "../../orgWorkspaceContext";

function foldForSearch(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function formatProjectCreatedAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export type ProjectListProps = {
  searchQuery?: string;
};

export function ProjectList({ searchQuery = "" }: ProjectListProps) {
  const router = useRouter();
  const { orgId, slug: orgSlug } = useOrgWorkspace();
  const { data: projects, isPending, isError, error, refetch } = useOrgProjects(
    orgId
  );

  const [editProject, setEditProject] = useState<OrgProject | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<OrgProject | null>(null);

  const updateProject = useUpdateOrgProject({
    onSuccess: () => {
      setEditProject(null);
      setEditName("");
      setEditDescription("");
    },
  });

  const deleteProject = useDeleteOrgProject({
    onSuccess: () => setDeleteTarget(null),
  });

  const filteredProjects = useMemo(() => {
    const list = projects ?? [];
    const q = foldForSearch(searchQuery.trim());
    if (!q) return list;
    return list.filter(
      (p) =>
        foldForSearch(p.name).includes(q) ||
        foldForSearch(p.slug).includes(q) ||
        foldForSearch(p.description ?? "").includes(q)
    );
  }, [projects, searchQuery]);

  const openEdit = (p: OrgProject) => {
    setEditName(p.name);
    setEditDescription(p.description ?? "");
    setEditProject(p);
  };

  const handleEditOpenChange = (open: boolean) => {
    if (!open) {
      setEditProject(null);
      setEditName("");
      setEditDescription("");
    }
  };

  const trimmedEditName = editName.trim();
  const canSubmitEdit =
    Boolean(editProject) &&
    trimmedEditName.length > 0 &&
    !updateProject.isPending;

  const submitEdit = () => {
    if (!editProject || !canSubmitEdit) return;
    updateProject.mutate({
      orgId,
      projectId: editProject.id,
      body: {
        name: trimmedEditName,
        description: editDescription.trim(),
      },
    });
  };

  if (isPending) {
    return (
      <ul
        className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3"
        role="list"
        aria-busy
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="min-w-0">
            <Skeleton className="h-38 w-full rounded-xl" />
          </li>
        ))}
      </ul>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card/60 px-5 py-6 shadow-md ring-1 ring-white/5 sm:px-6">
        <p className="text-destructive text-sm">
          {error instanceof Error
            ? error.message
            : "Không tải được danh sách dự án."}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => void refetch()}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  const list = projects ?? [];

  if (filteredProjects.length === 0) {
    return (
      <p className="text-foreground/65 text-sm">
        {list.length === 0
          ? "Chưa có dự án nào."
          : "Không có dự án khớp với từ khóa."}
      </p>
    );
  }

  return (
    <>
      <ul
        className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3"
        role="list"
      >
        {filteredProjects.map((p) => {
          const projectHref = `/${encodeURIComponent(orgSlug)}/projects/${encodeURIComponent(p.slug)}`;
          return (
          <li key={p.id} className="min-w-0">
            <div
              className={cn(
                "group/card-link block h-full rounded-xl outline-none",
                "cursor-pointer focus-visible:ring-[3px] focus-visible:ring-ring/60"
              )}
              role="button"
              tabIndex={0}
              aria-label={`Mở dự án ${p.name}`}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("button")) return;
                router.push(projectHref);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter" && e.key !== " ") return;
                if ((e.target as HTMLElement).closest("button")) return;
                e.preventDefault();
                router.push(projectHref);
              }}
            >
              <Card
                className={cn(
                  "h-full min-h-38 gap-0 border border-border/55 bg-popover py-0 shadow-md shadow-black/20 ring-1 ring-white/5",
                  "transition-[border-color,box-shadow,transform,background-color] duration-200 ease-out",
                  "group-hover/card-link:-translate-y-0.5 group-hover/card-link:border-primary/35 group-hover/card-link:bg-muted/55 group-hover/card-link:shadow-lg group-hover/card-link:shadow-black/30 group-hover/card-link:ring-primary/12"
                )}
              >
                <CardHeader className="relative flex flex-row items-start gap-3 px-5 pt-5 pb-4 sm:gap-4 sm:px-6 sm:pt-6">
                  <div
                    className="pointer-events-auto absolute top-3 right-3 z-10 flex flex-row items-center gap-1 sm:top-4 sm:right-4"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      className="size-9 border-border/80"
                      aria-label={`Chỉnh sửa ${p.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(p);
                      }}
                    >
                      <Pencil className="size-4" aria-hidden />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      className="size-9 border-destructive/35 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Xóa ${p.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(p);
                      }}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </div>
                  <div
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-card/90 shadow-inner ring-1 ring-border/60 sm:size-14"
                    aria-hidden
                  >
                    <FolderKanban className="size-6 shrink-0 text-foreground/55 dark:text-white/80" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-3 pr-19 sm:pr-20">
                    <CardTitle className="font-heading line-clamp-2 text-lg leading-snug font-semibold tracking-tight text-card-foreground sm:text-xl">
                      {p.name}
                    </CardTitle>
                    {p.description?.trim() ? (
                      <div
                        className={cn(
                          "rounded-lg border border-primary/25 bg-primary/10 px-3 py-2.5 shadow-inner shadow-black/5",
                          "text-foreground/85 text-sm italic leading-snug dark:bg-primary/15 dark:border-primary/30"
                        )}
                      >
                        <p className="line-clamp-4">{p.description.trim()}</p>
                      </div>
                    ) : null}
                  </div>
                </CardHeader>
                <CardFooter className="flex flex-row items-center justify-between gap-3 border-border/50 bg-card/45 px-5 py-3.5 sm:px-6">
                  <p className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground dark:text-zinc-400">
                    <CalendarDays
                      className="size-4 shrink-0 text-foreground/50 dark:text-white/90"
                      aria-hidden
                    />
                    <span className="min-w-0 leading-snug">
                      Tạo{" "}
                      <time dateTime={p.createdAt}>
                        {formatProjectCreatedAt(p.createdAt)}
                      </time>
                    </span>
                  </p>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <span className="text-sm font-medium text-muted-foreground transition-colors group-hover/card-link:text-primary dark:text-zinc-300 dark:group-hover/card-link:text-primary">
                      Dự án
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-foreground/45 transition-transform group-hover/card-link:translate-x-0.5 group-hover/card-link:text-primary dark:text-white/85 dark:group-hover/card-link:text-primary" />
                  </span>
                </CardFooter>
              </Card>
            </div>
          </li>
          );
        })}
      </ul>

      <Dialog open={editProject !== null} onOpenChange={handleEditOpenChange}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-lg">Chỉnh sửa dự án</DialogTitle>
            <DialogDescription>
              Cập nhật tên và mô tả. Thay đổi sẽ được lưu ngay sau khi bạn xác
              nhận.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 px-1">
            <Label
              htmlFor="edit-project-name"
              className="text-sm font-semibold"
            >
              Tên dự án
            </Label>
            <Input
              id="edit-project-name"
              autoComplete="off"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              disabled={updateProject.isPending}
              className="h-11 border-2 border-border/90 dark:border-zinc-600"
            />
            <Label
              htmlFor="edit-project-desc"
              className="text-sm font-semibold"
            >
              Mô tả
            </Label>
            <Textarea
              id="edit-project-desc"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              disabled={updateProject.isPending}
              rows={3}
              className="min-h-18 resize-y border-2 border-border/90 dark:border-zinc-600"
            />
          </div>
          <DialogFooter className="mt-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={updateProject.isPending}
              onClick={() => handleEditOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="font-semibold"
              disabled={!canSubmitEdit}
              onClick={submitEdit}
            >
              {updateProject.isPending ? "Đang lưu…" : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(next) => {
          if (!next) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent className="sm:max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa dự án?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget ? (
                <>
                  Dự án{" "}
                  <span className="font-medium text-foreground">
                    «{deleteTarget.name}»
                  </span>{" "}
                  sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteProject.isPending}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteProject.isPending || !deleteTarget}
              onClick={() => {
                if (!deleteTarget) return;
                deleteProject.mutate({
                  orgId,
                  projectId: deleteTarget.id,
                });
              }}
            >
              {deleteProject.isPending ? "Đang xóa…" : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
