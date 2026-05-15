"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion } from "framer-motion";
import { Plus } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import type { OrgProject } from "@/lib/api/services/fetchProject";
import { cn } from "@/lib/utils";

import { ProjectWorkspaceNavSidebar } from "./projectWorkspaceNavSidebar";

const PROJECT_RAIL_GRADIENTS = [
  "from-orange-400 to-rose-600",
  "from-violet-500 to-indigo-700",
  "from-cyan-400 to-teal-600",
  "from-amber-400 to-orange-600",
  "from-fuchsia-500 to-pink-600",
  "from-emerald-400 to-green-700",
  "from-sky-400 to-blue-700",
] as const;

/** Bo góc + scale icon rail: CSS thay spring để tránh “giật” khi hover/active chồng nhau */
const RAIL_ICON_MOTION =
  "transition-[border-radius,transform,box-shadow] duration-[520ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] will-change-[border-radius,transform]";

const RAIL_INDICATOR_SPRING = {
  type: "spring" as const,
  stiffness: 320,
  damping: 34,
  mass: 0.85,
};

function projectRailGradient(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PROJECT_RAIL_GRADIENTS[h % PROJECT_RAIL_GRADIENTS.length]!;
}

function projectInitial(name: string): string {
  const t = name.trim();
  if (!t) return "?";
  return t.charAt(0).toLocaleUpperCase("vi-VN");
}

/** Giữ tab hiện tại khi đổi dự án trên rail 1. */
function projectSubPathFromPathname(pathname: string, base: string): string {
  if (!pathname.startsWith(base)) return "dashboard";
  const rest = pathname.slice(base.length).replace(/^\//, "");
  const segment = rest.split("/")[0];
  return segment || "dashboard";
}

function DiscordRailItem({
  href,
  active,
  title,
  className,
  children,
}: {
  href: string;
  active?: boolean;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group/rail relative flex w-full items-center justify-center py-0.5">
      {active ? (
        <motion.span
          layoutId="workspace-project-rail-indicator"
          aria-hidden
          className="absolute left-0 top-1/2 z-10 h-10 w-1 -translate-y-1/2 rounded-r-full bg-foreground shadow-sm"
          transition={RAIL_INDICATOR_SPRING}
        />
      ) : (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute left-0 top-1/2 z-0 w-1 -translate-y-1/2 rounded-r-full bg-foreground transition-[height,opacity] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]",
            "h-2 opacity-0 group-hover/rail:h-5 group-hover/rail:opacity-100"
          )}
        />
      )}
      <Link
        href={href}
        title={title}
        aria-current={active ? "page" : undefined}
        className={cn(
          RAIL_ICON_MOTION,
          "relative flex size-12 shrink-0 scale-100 items-center justify-center overflow-hidden rounded-full text-sm font-bold text-white shadow-md outline-none active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-ring/50",
          "hover:scale-[1.06] hover:rounded-2xl",
          active && "scale-[1.04] rounded-2xl",
          className
        )}
      >
        {children}
      </Link>
    </div>
  );
}

export function ProjectWorkspaceLayout({
  orgSlug,
  projectSlug,
  projects,
  isProjectsPending,
  children,
}: {
  orgSlug: string;
  projectSlug: string;
  projects: OrgProject[];
  isProjectsPending: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const encOrg = encodeURIComponent(orgSlug);
  const encProj = encodeURIComponent(projectSlug);
  const base = `/${encOrg}/projects/${encProj}`;
  const newProjectHref = `/${encOrg}/projects/project-new`;
  const currentSubPath = projectSubPathFromPathname(pathname, base);
  const isMembersView =
    pathname === `${base}/members` || pathname === `${base}/members/`;

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-row overflow-hidden bg-background">
      {/* Rail 1 — danh sách dự án (kiểu Discord) */}
      <aside
        className="flex w-21 shrink-0 flex-col items-center bg-sidebar py-3"
        aria-label="Dự án trong tổ chức"
      >
        <div className="flex shrink-0 items-center justify-center px-2">
          <Image
            src="/Logo.png"
            alt="REQ-Bean9"
            width={44}
            height={44}
            className="size-14 rounded-xl object-contain"
            priority
          />
        </div>

        <span
          className="my-2 h-0.5 w-8 shrink-0 rounded-full bg-border/80"
          aria-hidden
        />

        <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-2 overflow-y-auto px-2.5 py-1 scrollbar-none">
          {isProjectsPending ? (
            <>
              <Skeleton className="size-12 shrink-0 rounded-full" />
              <Skeleton className="size-12 shrink-0 rounded-full" />
              <Skeleton className="size-12 shrink-0 rounded-full" />
            </>
          ) : (
            <LayoutGroup id="org-project-workspace-rail">
              {projects.map((p) => {
                const active = p.slug === projectSlug;
                const href = `/${encOrg}/projects/${encodeURIComponent(p.slug)}/${currentSubPath}`;
                return (
                  <DiscordRailItem
                    key={p.id}
                    href={href}
                    active={active}
                    title={p.name}
                    className={cn(
                      "bg-linear-to-br shadow-inner shadow-black/25 ring-1 ring-white/10",
                      projectRailGradient(p.id)
                    )}
                  >
                    {projectInitial(p.name)}
                  </DiscordRailItem>
                );
              })}
            </LayoutGroup>
          )}
        </div>

        <span
          className="my-2 h-0.5 w-8 shrink-0 rounded-full bg-border/80"
          aria-hidden
        />

        <Link
          href={newProjectHref}
          title="Thêm dự án"
          aria-label="Thêm dự án"
          className={cn(
            RAIL_ICON_MOTION,
            "group/add flex size-12 shrink-0 scale-100 items-center justify-center rounded-full bg-muted/50 text-primary outline-none active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-ring/50 hover:scale-[1.06] hover:rounded-2xl hover:bg-primary hover:text-primary-foreground"
          )}
        >
          <Plus className="size-5 transition-transform group-hover/add:scale-110" aria-hidden />
        </Link>
      </aside>

      <ProjectWorkspaceNavSidebar orgSlug={orgSlug} projectSlug={projectSlug} />

      <main
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background",
          isMembersView ? "p-0" : "p-4 sm:p-6"
        )}
      >
        {children}
      </main>
    </div>
  );
}
