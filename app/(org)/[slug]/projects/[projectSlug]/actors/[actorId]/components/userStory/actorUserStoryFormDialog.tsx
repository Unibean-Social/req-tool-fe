"use client";

import { useEffect, useState } from "react";

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
import { cn } from "@/lib/utils";

import {
  storyLinesFromMultiline,
  type ActorUserStory,
  type StoryPriority,
} from "./actorUserStoryTypes";

const PRIORITIES: { value: StoryPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

function newStoryDraft(actorRef: string): ActorUserStory {
  const now = new Date().toISOString();
  const fid = crypto.randomUUID();
  return {
    id: fid,
    feature_id: fid,
    prefix: "",
    title: "",
    description: "",
    actor_ref: actorRef,
    action_text: "",
    goal_text: "",
    status: "draft",
    priority: "medium",
    labels: [],
    references: "",
    story_points: 0,
    sprint_id: null,
    acceptance_criteria: [],
    created_at: now,
    updated_at: now,
  };
}

type ActorUserStoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  actorRef: string;
  initial: ActorUserStory | null;
  onSave: (story: ActorUserStory) => void;
};

export function ActorUserStoryFormDialog({
  open,
  onOpenChange,
  mode,
  actorRef,
  initial,
  onSave,
}: ActorUserStoryFormDialogProps) {
  const [draft, setDraft] = useState<ActorUserStory>(() =>
    newStoryDraft(actorRef)
  );
  const [labelsRaw, setLabelsRaw] = useState("");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initial) {
      setDraft({ ...initial, actor_ref: actorRef });
      setLabelsRaw(initial.labels.join(", "));
    } else {
      setDraft(newStoryDraft(actorRef));
      setLabelsRaw("");
    }
  }, [open, mode, initial, actorRef]);

  const titleTrim = draft.title.trim();
  const actionLines = storyLinesFromMultiline(draft.action_text);
  const goalLines = storyLinesFromMultiline(draft.goal_text);
  const canSave =
    titleTrim.length > 0 && actionLines.length > 0 && goalLines.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    const now = new Date().toISOString();
    const labels = labelsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const actionNorm = actionLines.join("\n");
    const goalNorm = goalLines.join("\n");
    onSave({
      ...draft,
      title: titleTrim,
      description: draft.description.trim(),
      actor_ref: actorRef,
      action_text: actionNorm,
      goal_text: goalNorm,
      labels,
      story_points: Math.max(
        0,
        Number.isFinite(draft.story_points) ? draft.story_points : 0
      ),
      updated_at: now,
      created_at: mode === "create" ? now : draft.created_at,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg">
              {mode === "create" ? "Thêm user story" : "Sửa user story"}
            </DialogTitle>
            <DialogDescription>
              Dữ liệu mẫu trên client — khi có API sẽ đồng bộ máy chủ.
            </DialogDescription>
          </DialogHeader>

          <div className="grid max-h-[min(70vh,520px)] gap-3 overflow-y-auto px-0.5 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="us-title" className="text-sm font-semibold">
                Tiêu đề
              </Label>
              <Input
                id="us-title"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="VD: Duyệt đơn đặt hàng"
                className="h-10"
                autoComplete="off"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="us-desc" className="text-sm font-semibold">
                Mô tả
              </Label>
              <Textarea
                id="us-desc"
                value={draft.description}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, description: e.target.value }))
                }
                placeholder="Bối cảnh ngắn…"
                rows={2}
                className="min-h-16 resize-none text-sm"
              />
            </div>

            <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="us-priority" className="text-sm font-semibold">
                  Priority
                </Label>
                <select
                  id="us-priority"
                  value={draft.priority}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      priority: e.target.value as StoryPriority,
                    }))
                  }
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    "outline-none focus-visible:ring-2 focus-visible:ring-ring/45"
                  )}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="us-points" className="text-sm font-semibold">
                  Story points
                </Label>
                <Input
                  id="us-points"
                  type="number"
                  min={0}
                  step={1}
                  value={draft.story_points}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      story_points: Number.parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="us-action" className="text-sm font-semibold">
                Hành động (ACTIONS)
              </Label>
              <p className="text-xs text-muted-foreground">
                Mỗi dòng là một bước; trên thẻ sẽ hiển thị đánh số 1. 2. 3. …
              </p>
              <Textarea
                id="us-action"
                value={draft.action_text}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, action_text: e.target.value }))
                }
                placeholder={"Bước 1…\nBước 2…"}
                rows={4}
                className="min-h-24 resize-y text-sm"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="us-goal" className="text-sm font-semibold">
                Mục tiêu (GOALS)
              </Label>
              <p className="text-xs text-muted-foreground">
                Mỗi dòng là một mục tiêu có thể đo được.
              </p>
              <Textarea
                id="us-goal"
                value={draft.goal_text}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, goal_text: e.target.value }))
                }
                placeholder={"Mục tiêu 1…\nMục tiêu 2…"}
                rows={4}
                className="min-h-24 resize-y text-sm"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="us-labels" className="text-sm font-semibold">
                Nhãn (phân tách bằng dấu phẩy)
              </Label>
              <Input
                id="us-labels"
                value={labelsRaw}
                onChange={(e) => setLabelsRaw(e.target.value)}
                placeholder="checkout, ưu tiên, Q1"
                className="h-10"
                autoComplete="off"
              />
            </div>
          </div>

          <DialogFooter className="mt-2 gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={!canSave}>
              {mode === "create" ? "Tạo story" : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
