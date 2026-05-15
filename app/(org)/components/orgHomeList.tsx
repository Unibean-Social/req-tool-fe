"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  LayoutGrid,
  Plus,
  Search,
  Users,
} from "lucide-react";

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
import {
  fetchProject,
  type OrgProjectsListResponse,
} from "@/lib/api/services/fetchProject";
import { orgProjectsQueryKey } from "@/lib/query/query-keys";

import { buildOrgEntryPath } from "./orgWorkspacePaths";
import { cn } from "@/lib/utils";

const ORG_CARD_GRADIENTS = [
  "from-orange-400 to-rose-600",
  "from-violet-500 to-indigo-700",
  "from-cyan-400 to-teal-600",
  "from-amber-400 to-orange-600",
  "from-fuchsia-500 to-pink-600",
  "from-emerald-400 to-green-700",
  "from-sky-400 to-blue-700",
] as const;

function orgCardGradientFromSeed(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return ORG_CARD_GRADIENTS[h % ORG_CARD_GRADIENTS.length]!;
}

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

function OrgHomeOrgCard({ org }: { org: Org }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpening, setIsOpening] = useState(false);

  const openOrg = useCallback(async () => {
    if (isOpening) return;
    setIsOpening(true);
    const key = orgProjectsQueryKey(org.id);

    try {
      let projects =
        queryClient.getQueryData<OrgProjectsListResponse>(key)?.data;

      if (!projects) {
        const res = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => fetchProject.listOrgProjects(org.id),
        });
        projects = res.data;
      }

      router.push(buildOrgEntryPath(org.slug, projects));
    } catch {
      router.push(`/${encodeURIComponent(org.slug)}/projects`);
    } finally {
      setIsOpening(false);
    }
  }, [isOpening, org.id, org.slug, queryClient, router]);

  return (
    <button
      type="button"
      disabled={isOpening}
      onClick={() => void openOrg()}
      className={cn(
        "group/card-link block h-full w-full rounded-xl text-left outline-none",
        "focus-visible:ring-[3px] focus-visible:ring-ring/60",
        "disabled:pointer-events-none disabled:opacity-70"
      )}
    >
      <Card
        className={cn(
          "h-full min-h-46 gap-0 border border-border/55 bg-popover py-0 shadow-md shadow-black/20 ring-1 ring-white/5",
          "transition-[border-color,box-shadow,transform,background-color] duration-200 ease-out",
          "group-hover/card-link:-translate-y-0.5 group-hover/card-link:border-primary/30 group-hover/card-link:bg-muted/40 group-hover/card-link:shadow-lg group-hover/card-link:shadow-black/25 group-hover/card-link:ring-primary/10"
        )}
      >
        <CardHeader className="flex flex-row items-start gap-4 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-lg bg-linear-to-br text-sm font-bold text-white shadow-inner shadow-black/15 ring-1 ring-white/15",
              orgCardGradientFromSeed(org.id)
            )}
            aria-hidden
          >
            {orgInitial(org.name)}
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <CardTitle className="font-heading text-lg leading-snug font-semibold tracking-tight text-card-foreground line-clamp-2 sm:text-xl">
              {org.name}
            </CardTitle>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays
                className="size-4 shrink-0 opacity-80"
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
        </CardHeader>
        <CardFooter className="flex-wrap content-center justify-between gap-x-2 gap-y-1.5 border-border/50 bg-card/35 px-3 py-2 sm:px-3.5 sm:py-2.5 dark:bg-card/20">
          <div className="flex min-w-0 flex-[1_1_auto] flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground sm:text-xs">
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <Users className="size-4 shrink-0 opacity-90" aria-hidden />
              Thành viên
            </span>
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <LayoutGrid className="size-4 shrink-0 opacity-90" aria-hidden />
              Dự án
            </span>
          </div>
          <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-brand-mint">
            {isOpening ? "Đang mở…" : "Mở"}
            {!isOpening ? <span aria-hidden>→</span> : null}
          </span>
        </CardFooter>
      </Card>
    </button>
  );
}

export function OrgHomeList({ orgs }: OrgHomeListProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
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

  const joinedCount = orgs.length;
  const listCount = filtered.length;

  return (
    <div className="flex min-h-full w-full flex-1 flex-col gap-8 p-6 sm:gap-10 sm:p-8">
      <header className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tổ chức của bạn
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            Quản lý và truy cập các workspace
          </p>
        </div>
        <div className="flex flex-row flex-wrap items-center gap-3">
          {orgs.length > 0 ? (
            <div className="relative min-h-11 min-w-0 flex-1 basis-[min(100%,12rem)]">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm tổ chức…"
                autoComplete="off"
                aria-label="Tìm tổ chức"
                className="h-11 border-border/80 bg-muted/40 pr-3 pl-10 text-sm shadow-none dark:bg-muted/25"
              />
            </div>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="lg"
            className={cn(
              "h-11 shrink-0 border-2 font-semibold transition-colors",
              "hover:border-brand-mint/55 hover:bg-brand-mint/10 hover:text-brand-mint",
              "dark:hover:bg-brand-mint/15"
            )}
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="size-4" aria-hidden />
            Tạo tổ chức mới
          </Button>
        </div>
      </header>

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

      {orgs.length > 0 ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-3 border-b border-border/50 pb-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Đã tham gia
            </p>
            <p className="text-sm tabular-nums text-muted-foreground">
              {listCount === joinedCount
                ? `${joinedCount} tổ chức`
                : `${listCount} / ${joinedCount} tổ chức`}
            </p>
          </div>

          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Không có tổ chức khớp với từ khóa.
            </p>
          ) : null}

          <ul
            className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            role="list"
          >
              {filtered.map((org) => (
                <li key={org.id} className="min-w-0">
                  <OrgHomeOrgCard org={org} />
                </li>
              ))}
              <li className="min-w-0">
                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
                  className={cn(
                    "group/create flex h-full min-h-46 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/70 bg-transparent px-4 py-8 text-center outline-none transition-colors",
                    "hover:border-primary/40 hover:bg-muted/30 focus-visible:ring-[3px] focus-visible:ring-ring/60"
                  )}
                >
                  <span className="flex size-12 items-center justify-center rounded-full border border-border/80 bg-muted/30 text-muted-foreground transition-colors group-hover/create:text-foreground">
                    <Plus className="size-6" aria-hidden />
                  </span>
                  <span className="font-heading text-sm font-semibold tracking-tight text-muted-foreground transition-colors group-hover/create:text-foreground">
                    Tạo tổ chức mới
                    <ArrowUpRight
                      className="ml-1 inline size-4 align-text-bottom opacity-70"
                      aria-hidden
                    />
                  </span>
                </button>
              </li>
          </ul>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 py-6 text-center">
          <p className="max-w-md text-sm text-muted-foreground">
            Chưa có tổ chức nào. Tạo tổ chức đầu tiên để bắt đầu workspace.
          </p>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className={cn(
              "group/create flex w-full max-w-md flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/70 bg-transparent px-6 py-12 text-center outline-none transition-colors sm:min-h-46",
              "hover:border-primary/40 hover:bg-muted/30 focus-visible:ring-[3px] focus-visible:ring-ring/60"
            )}
          >
            <span className="flex size-12 items-center justify-center rounded-full border border-border/80 bg-muted/30 text-muted-foreground transition-colors group-hover/create:text-foreground">
              <Plus className="size-6" aria-hidden />
            </span>
            <span className="font-heading text-base font-semibold tracking-tight text-muted-foreground transition-colors group-hover/create:text-foreground">
              Tạo tổ chức mới
              <ArrowUpRight
                className="ml-1 inline size-4 align-text-bottom opacity-70"
                aria-hidden
              />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
