"use client";

import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  FolderKanban,
  Plus,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateOrgProject } from "@/hooks/useProject";
import { cn } from "@/lib/utils";

import { useOrgWorkspace } from "../../orgWorkspaceContext";

export type ProjectHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  /** Giống org home: chỉ hiện thanh tìm khi đã có dự án (hoặc đang tải). */
  showSearch: boolean;
};

export function ProjectHeader({
  search,
  onSearchChange,
  showSearch,
}: ProjectHeaderProps) {
  const { orgId } = useOrgWorkspace();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createProject = useCreateOrgProject({
    onSuccess: () => {
      setCreateOpen(false);
      setName("");
      setDescription("");
    },
  });

  useEffect(() => {
    if (!searchExpanded) return;
    const id = requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [searchExpanded]);

  useEffect(() => {
    if (!searchExpanded) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const el = searchWrapRef.current;
      if (!el || el.contains(e.target as Node)) return;
      setSearchExpanded(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [searchExpanded]);

  useEffect(() => {
    if (!searchExpanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchExpanded]);

  const handleDialogOpenChange = (open: boolean) => {
    setCreateOpen(open);
    if (!open) {
      setName("");
      setDescription("");
    }
  };

  const trimmedName = name.trim();
  const canSubmit = trimmedName.length > 0 && !createProject.isPending;

  const submit = () => {
    if (!canSubmit) return;
    createProject.mutate({
      orgId,
      body: {
        name: trimmedName,
        description: description.trim(),
      },
    });
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-col gap-4 rounded-2xl border border-border/70 bg-card px-4 py-5 shadow-md ring-1 ring-white/5 sm:gap-5 sm:px-6 sm:py-6",
          "shadow-black/15 dark:shadow-black/35"
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 items-center justify-between gap-3 overflow-x-auto sm:contents">
            <h2 className="font-heading shrink-0 text-nowrap text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Dự án
            </h2>
            <Button
              type="button"
              size="lg"
              className="h-11 shrink-0 font-semibold sm:hidden"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="size-4" aria-hidden />
              Tạo mới
            </Button>
          </div>
          <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:w-auto sm:items-center sm:justify-end sm:gap-2">
            {showSearch ? (
              <div
                ref={searchWrapRef}
                className={cn(
                  "flex h-11 min-w-0 shrink-0 items-stretch overflow-hidden rounded-xl border border-border/70 bg-input/90 shadow-inner shadow-black/15",
                  "transition-[max-width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[max-width]",
                  searchExpanded
                    ? "max-w-full sm:max-w-md"
                    : "max-w-11"
                )}
              >
                <button
                  type="button"
                  className="flex size-11 shrink-0 items-center justify-center text-foreground/50 outline-none transition-colors hover:bg-muted/40 hover:text-foreground dark:text-white/90 dark:hover:bg-muted/30"
                  aria-expanded={searchExpanded}
                  aria-controls="project-list-search"
                  aria-label={
                    searchExpanded ? "Thu gọn tìm kiếm" : "Mở tìm kiếm theo tên"
                  }
                  onClick={() => setSearchExpanded((v) => !v)}
                >
                  <Search className="size-4 shrink-0" aria-hidden />
                </button>
                <div
                  className={cn(
                    "flex min-h-0 min-w-0 flex-1 items-center pr-2 transition-opacity duration-200",
                    searchExpanded
                      ? "border-l border-border/50 opacity-100 dark:border-border/60"
                      : "pointer-events-none w-0 overflow-hidden border-0 p-0 pr-0 opacity-0"
                  )}
                  aria-hidden={!searchExpanded}
                >
                  <input
                    ref={searchInputRef}
                    id="project-list-search"
                    type="search"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Tìm theo tên…"
                    autoComplete="off"
                    tabIndex={searchExpanded ? 0 : -1}
                    aria-label="Tìm dự án"
                    className="h-11 min-w-0 flex-1 bg-transparent pr-1 pl-2 text-sm text-foreground outline-none placeholder:text-foreground/45"
                  />
                </div>
              </div>
            ) : null}
            <Button
              type="button"
              size="lg"
              className="hidden h-11 min-w-0 shrink-0 font-semibold sm:inline-flex sm:h-11"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="size-4" aria-hidden />
              Tạo dự án mới
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-lg">Tạo dự án mới</DialogTitle>
            <DialogDescription>
              Nhập tên và mô tả. Danh sách sẽ cập nhật sau khi tạo thành công.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 px-1">
            <Label
              htmlFor="dialog-project-name"
              className="text-sm font-semibold"
            >
              Tên dự án
            </Label>
            <div className="relative">
              <FolderKanban className="text-foreground/40 pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2" />
              <Input
                id="dialog-project-name"
                autoComplete="off"
                placeholder="Ví dụ: API thanh toán"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={createProject.isPending}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canSubmit) {
                    e.preventDefault();
                    submit();
                  }
                }}
                className="h-11 border-2 border-border/90 pl-11 dark:border-zinc-600"
              />
            </div>
            <Label
              htmlFor="dialog-project-desc"
              className="text-sm font-semibold"
            >
              Mô tả
            </Label>
            <div className="relative">
              <CalendarDays className="text-foreground/40 pointer-events-none absolute top-3 left-3 size-5" />
              <Textarea
                id="dialog-project-desc"
                placeholder="Tùy chọn — có thể để trống"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={createProject.isPending}
                rows={3}
                className="min-h-18 resize-y border-2 border-border/90 pl-11 pt-2.5 dark:border-zinc-600"
              />
            </div>
          </div>
          <DialogFooter className="mt-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={createProject.isPending}
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="font-semibold"
              disabled={!canSubmit}
              onClick={submit}
            >
              {createProject.isPending ? "Đang tạo…" : "Tạo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
