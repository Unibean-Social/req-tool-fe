"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, CalendarDays, ChevronRight, Plus, Search } from "lucide-react";

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
import { useCreateOrg } from "@/hooks/useOrg";
import type { Org } from "@/lib/api/services/fetchOrg";

import { cn } from "@/lib/utils";

function formatOrgCreatedAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

function orgInitial(name: string): string {
  const t = name.trim();
  if (!t) return "?";
  return t.charAt(0).toLocaleUpperCase("vi-VN");
}

type OrgHomeListProps = {
  orgs: Org[];
};

export function OrgHomeList({ orgs }: OrgHomeListProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const trimmedNew = newOrgName.trim();

  const { mutateAsync: createOrg, isPending: isCreating } = useCreateOrg({
    onSuccess: (res) => {
      setCreateOpen(false);
      setNewOrgName("");
      router.push(`/${res.data.slug}`);
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orgs;
    return orgs.filter((o) => o.name.toLowerCase().includes(q));
  }, [orgs, search]);

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

  return (
    <div className="flex min-h-full w-full flex-1 flex-col gap-6 p-6 sm:gap-8 sm:p-8">
      <div
        className={cn(
          "flex flex-col gap-4 rounded-2xl border border-border/70 bg-card px-4 py-5 shadow-md ring-1 ring-white/5 sm:gap-5 sm:px-6 sm:py-6",
          "shadow-black/15 dark:shadow-black/35"
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 items-center justify-between gap-3 overflow-x-auto sm:contents">
            <h2 className="font-heading shrink-0 text-nowrap text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Tổ chức của bạn
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
            {orgs.length > 0 ? (
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
                  aria-controls="org-home-search"
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
                    id="org-home-search"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm theo tên…"
                    autoComplete="off"
                    tabIndex={searchExpanded ? 0 : -1}
                    aria-label="Tìm tổ chức"
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
              Tạo tổ chức mới
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) setNewOrgName("");
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-lg">Tạo tổ chức mới</DialogTitle>
            <DialogDescription>
              Nhập tên tổ chức. Sau khi tạo xong bạn sẽ được chuyển vào workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 px-1">
            <Label htmlFor="dialog-org-name" className="text-sm font-semibold">
              Tên tổ chức
            </Label>
            <div className="relative">
              <Building2 className="text-foreground/40 pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2" />
              <Input
                id="dialog-org-name"
                autoComplete="organization"
                placeholder="Ví dụ: Team Platform"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                disabled={isCreating}
                className="h-11 border-2 border-border/90 pl-11 dark:border-zinc-600"
              />
            </div>
          </div>
          <DialogFooter className="mt-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={isCreating}
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="font-semibold"
              disabled={!trimmedNew || isCreating}
              onClick={() => void createOrg({ name: trimmedNew })}
            >
              {isCreating ? "Đang tạo…" : "Tạo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filtered.length === 0 ? (
        <p className="text-foreground/65 text-sm">
          {orgs.length === 0
            ? "Chưa có tổ chức nào."
            : "Không có tổ chức khớp với từ khóa."}
        </p>
      ) : (
        <ul
          className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3"
          role="list"
        >
          {filtered.map((org) => (
            <li key={org.id} className="min-w-0">
              <Link
                href={`/${org.slug}`}
                className={cn(
                  "group/card-link block h-full rounded-xl outline-none",
                  "focus-visible:ring-[3px] focus-visible:ring-ring/60"
                )}
              >
                <Card
                  className={cn(
                    "h-full min-h-38 gap-0 border border-border/55 bg-popover py-0 shadow-md shadow-black/20 ring-1 ring-white/5",
                    "transition-[border-color,box-shadow,transform,background-color] duration-200 ease-out",
                    "group-hover/card-link:-translate-y-0.5 group-hover/card-link:border-primary/35 group-hover/card-link:bg-muted/55 group-hover/card-link:shadow-lg group-hover/card-link:shadow-black/30 group-hover/card-link:ring-primary/12"
                  )}
                >
                  <CardHeader className="flex flex-row items-start gap-4 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
                    <div
                      className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-card/90 text-base font-semibold text-foreground shadow-inner ring-1 ring-border/60 sm:size-14 sm:text-lg"
                      aria-hidden
                    >
                      {orgInitial(org.name)}
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <CardTitle className="font-heading text-lg leading-snug font-semibold tracking-tight text-card-foreground line-clamp-2 sm:text-xl">
                        {org.name}
                      </CardTitle>
                      <p className="flex items-center gap-2 text-sm text-muted-foreground dark:text-zinc-400">
                        <CalendarDays
                          className="size-4 shrink-0 text-foreground/50 dark:text-white/90"
                          aria-hidden
                        />
                        <span className="min-w-0 leading-snug">
                          Tạo{" "}
                          <time dateTime={org.createdAt}>
                            {formatOrgCreatedAt(org.createdAt)}
                          </time>
                        </span>
                      </p>
                    </div>
                    <div
                      className="text-foreground/50 transition-colors group-hover/card-link:text-primary dark:text-white/90 dark:group-hover/card-link:text-white"
                      aria-hidden
                    >
                      <Building2 className="size-5 shrink-0 sm:size-5" />
                    </div>
                  </CardHeader>
                  <CardFooter className="justify-end gap-1.5 border-border/50 bg-card/45 px-5 py-3.5 sm:px-6">
                    <span className="text-sm font-medium text-muted-foreground transition-colors group-hover/card-link:text-primary dark:text-zinc-300 dark:group-hover/card-link:text-primary">
                      Mở workspace
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-foreground/45 transition-transform group-hover/card-link:translate-x-0.5 group-hover/card-link:text-primary dark:text-white/85 dark:group-hover/card-link:text-primary" />
                  </CardFooter>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
