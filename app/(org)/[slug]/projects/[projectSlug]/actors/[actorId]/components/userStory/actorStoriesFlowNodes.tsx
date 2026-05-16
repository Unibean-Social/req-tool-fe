"use client";

import { memo } from "react";
import {
  ArrowUpRight,
  Pencil,
  PersonStanding,
  Trash2,
  Zap,
} from "lucide-react";

import {
  Handle,
  Position,
  type Node,
  type NodeProps,
} from "@/components/ui/react-flow";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { useActorStoryFlowActions } from "./actorStoryFlowActionsContext";
import {
  storyLinesFromMultiline,
  type StoryPriority,
} from "./actorUserStoryTypes";
import type { ActorHubFlowData, UserStoryFlowNodeData } from "./actorStoriesFlowGraph";

type ActorHubNode = Node<ActorHubFlowData, "actorHub">;
type UserStoryNode = Node<UserStoryFlowNodeData, "userStory">;

const handleClass =
  "!size-2 !border-0 !bg-transparent after:absolute after:inset-[-6px] after:content-['']";

/** Tách "Tên (mẫu)" → tiêu đề + nhãn pill như mockup. */
function parseActorHubTitleBadge(fullName: string): {
  displayTitle: string;
  badgeLabel: string | null;
} {
  const trimmed = fullName.trim();
  const m = /^(.*?)\s*\(([^)]+)\)\s*$/u.exec(trimmed);
  if (m) {
    return { displayTitle: m[1].trim(), badgeLabel: m[2].trim() };
  }
  return { displayTitle: trimmed, badgeLabel: null };
}

/** Badge kiểu mockup: nền đặc, chữ tương phản (Medium ≈ tan). */
function priorityBadgeClass(p: StoryPriority): string {
  switch (p) {
    case "critical":
      return "bg-rose-500/25 text-rose-100";
    case "high":
      return "bg-rose-200/50 text-rose-900 dark:bg-rose-500/18 dark:text-rose-100";
    case "medium":
      return "bg-[#c9a882]/85 text-[#2a1f18] dark:bg-[#b08d5f]/40 dark:text-[#f5e6d3]";
    case "low":
      return "bg-sky-500/25 text-sky-100";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function priorityLabel(p: StoryPriority): string {
  switch (p) {
    case "critical":
      return "Critical";
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
    default:
      return p;
  }
}

/** Dot màu + tiêu đề section uppercase xám (mockup). */
function StoryActionsGoalsList({
  heading,
  dotClass,
  lines,
}: {
  heading: string;
  dotClass: string;
  lines: string[];
}) {
  if (lines.length === 0) return null;
  return (
    <div className="min-w-0 space-y-2.5">
      <div className="flex items-center gap-2">
        <span className={cn("size-2 shrink-0 rounded-full", dotClass)} aria-hidden />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {heading}
        </p>
      </div>
      <ol className="m-0 list-none space-y-2.5 pl-0">
        {lines.map((line, i) => (
          <li
            key={`${i}-${line.slice(0, 24)}`}
            className="flex gap-2.5 text-sm leading-snug text-foreground"
          >
            <span className="w-6 shrink-0 pt-px text-right font-medium tabular-nums text-muted-foreground">
              {i + 1}.
            </span>
            <span className="min-w-0">{line}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StoryAcceptanceCriteriaList({ lines }: { lines: string[] }) {
  if (lines.length === 0) return null;
  return (
    <div className="min-w-0 space-y-2.5">
      <div className="flex items-center gap-2">
        <span
          className="size-2 shrink-0 rounded-full bg-violet-500"
          aria-hidden
        />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Acceptance criteria
        </p>
      </div>
      <ol className="m-0 list-none space-y-2.5 pl-0">
        {lines.map((line, i) => (
          <li
            key={`ac-${i}-${line.slice(0, 24)}`}
            className="flex gap-2.5 text-sm leading-snug text-foreground"
          >
            <span className="w-6 shrink-0 pt-px text-right font-medium tabular-nums text-muted-foreground">
              {i + 1}.
            </span>
            <span className="min-w-0">{line}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function formatStoryStatusLabel(status: string): string {
  return status
    .split(/_/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export const ActorHubCard = memo(function ActorHubCard(
  props: NodeProps<ActorHubNode>
) {
  const { data } = props;
  const actions = useActorStoryFlowActions();
  const { displayTitle, badgeLabel } = parseActorHubTitleBadge(data.name);

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl text-center shadow-sm",
        "border border-border/50 bg-muted/25 ring-1 ring-border/15",
        "dark:bg-zinc-900/70"
      )}
      style={{ width: 240, minHeight: 188 }}
    >
      <Handle
        type="source"
        position={Position.Bottom}
        className={handleClass}
        aria-label="Liên kết tới user story"
      />

      <div className="relative flex flex-col items-center gap-3 px-4 pb-4 pt-4">
        <span
          className="flex size-15 shrink-0 items-center justify-center rounded-full bg-emerald-400/22 ring-1 ring-emerald-500/35 dark:bg-emerald-400/18"
          aria-hidden
        >
          <PersonStanding
            className="size-7 text-emerald-800 dark:text-emerald-300"
            strokeWidth={1.75}
            aria-hidden
          />
        </span>
        <h2 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-foreground">
          {displayTitle}
        </h2>
        {badgeLabel ? (
          <span className="inline-flex rounded-full bg-emerald-400/22 px-2.5 py-0.5 text-xs font-medium text-emerald-900 ring-1 ring-emerald-500/30 dark:text-emerald-200">
            {badgeLabel}
          </span>
        ) : null}
        <p className="line-clamp-4 w-full max-w-52 text-sm leading-relaxed text-muted-foreground">
          {data.roleDescription}
        </p>

        <Separator className="bg-border/80" />

        {actions ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="nodrag nopan h-9 w-full max-w-52 gap-2 border-border/80 bg-background/50 text-sm font-medium hover:bg-accent/80"
            aria-label="Thêm user story"
            onClick={() => actions.onOpenCreate()}
          >
            Thêm story
            <ArrowUpRight className="size-3.5 shrink-0 opacity-90" aria-hidden />
          </Button>
        ) : null}
      </div>
    </div>
  );
});

export const UserStoryCard = memo(function UserStoryCard(
  props: NodeProps<UserStoryNode>
) {
  const { data } = props;
  const actions = useActorStoryFlowActions();
  const badgeClass = priorityBadgeClass(data.priority);
  const actionLines = storyLinesFromMultiline(data.action_text);
  const goalLines = storyLinesFromMultiline(data.goal_text);
  const acLines = data.acceptance_criteria.map((s) => s.trim()).filter(Boolean);
  const prefixTrim = data.prefix.trim();

  return (
    <div
      className={cn(
        "group/story relative flex flex-col overflow-hidden rounded-2xl",
        "border border-border/40 shadow-sm ring-1 ring-border/20",
        "bg-muted/20 dark:bg-[#1c1c1f]"
      )}
      style={{ width: 352, minHeight: 380 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={handleClass}
        aria-label="Nhận liên kết từ actor"
      />

      <div className="flex min-h-0 flex-1 flex-col gap-3.5 p-4">
        {prefixTrim ? (
          <p className="text-left font-mono text-[11px] tracking-tight text-muted-foreground">
            {prefixTrim}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium",
              badgeClass
            )}
          >
            {priorityLabel(data.priority)}
          </span>
          <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium capitalize text-foreground">
            {formatStoryStatusLabel(String(data.status))}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-0.5 text-xs font-semibold tabular-nums text-foreground">
            <Zap className="size-3.5 shrink-0 opacity-85" aria-hidden />
            {data.story_points} pts
          </span>
        </div>

        <div className="min-w-0 space-y-2">
          <h3 className="text-lg font-bold leading-snug tracking-tight text-foreground">
            <span className="line-clamp-3">{data.title}</span>
          </h3>
          {data.description.trim() ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="line-clamp-4">{data.description}</span>
            </p>
          ) : null}
        </div>

        {data.labels.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.labels.slice(0, 8).map((label) => (
              <span
                key={label}
                className="rounded-md bg-muted/95 px-2 py-0.5 text-xs text-foreground/90"
              >
                {label}
              </span>
            ))}
            {data.labels.length > 8 ? (
              <span className="self-center text-xs text-muted-foreground">
                +{data.labels.length - 8}
              </span>
            ) : null}
          </div>
        ) : null}

        <Separator className="bg-border/70" />

        <div className="min-w-0 space-y-5">
          <StoryActionsGoalsList
            heading="Action"
            dotClass="bg-emerald-500"
            lines={actionLines}
          />
          <StoryActionsGoalsList
            heading="Goal"
            dotClass="bg-sky-500"
            lines={goalLines}
          />
        </div>

        {acLines.length > 0 ? (
          <>
            <Separator className="bg-border/70" />
            <StoryAcceptanceCriteriaList lines={acLines} />
          </>
        ) : null}

        {actions ? (
          <div className="mt-auto flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="nodrag nopan h-9 flex-1 gap-2 border-border/80 bg-background/40 text-sm font-medium hover:bg-accent/70"
              aria-label="Sửa user story"
              onClick={() => actions.onEdit(data)}
            >
              <Pencil className="size-3.5 opacity-90" aria-hidden />
              Sửa
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="nodrag nopan h-9 flex-1 gap-2 border-border/80 bg-background/40 text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label="Xóa user story"
              onClick={() => actions.onRequestDelete(data)}
            >
              <Trash2 className="size-3.5 opacity-90" aria-hidden />
              Xóa
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
});
